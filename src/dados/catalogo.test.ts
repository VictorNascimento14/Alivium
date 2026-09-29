import { beforeEach, describe, expect, it } from "vitest";

import {
  alternarPublicacao,
  alternarPublicacaoJornada,
  apagarCategoria,
  apagarConteudo,
  corpoDeTexto,
  salvarCategoria,
  salvarConteudo,
  salvarJornada,
  textoDeCorpo,
} from "./catalogo";
import { alternarEtapa, andamento } from "./jornadas";
import { lerEstado, progressoDe, restaurarSementes } from "./repositorio";

const nova = {
  nome: "Movimento",
  descricao: "Corpo em movimento gentil.",
  icone: "ri-run-line",
  tom: "verde" as const,
};

describe("categorias", () => {
  beforeEach(() => restaurarSementes());

  it("cria, edita e recusa nome repetido", () => {
    const r = salvarCategoria(nova);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(salvarCategoria({ ...nova, nome: "movimento" }).ok).toBe(false);
    expect(salvarCategoria({ ...nova, nome: "Movimento leve" }, r.id).ok).toBe(true);
    expect(lerEstado().categorias.find((c) => c.id === r.id)?.nome).toBe("Movimento leve");
    // Editar mantendo o próprio nome não conta como repetido.
    expect(salvarCategoria({ ...nova, nome: "Movimento leve" }, r.id).ok).toBe(true);
  });

  it("valida nome e ícone", () => {
    expect(salvarCategoria({ ...nova, nome: "a" }).ok).toBe(false);
    expect(salvarCategoria({ ...nova, icone: "<script>" }).ok).toBe(false);
  });

  it("não apaga categoria com conteúdo; apaga a vazia", () => {
    expect(apagarCategoria("c-corpo").ok).toBe(false);
    const r = salvarCategoria(nova);
    if (!r.ok) throw new Error();
    expect(apagarCategoria(r.id).ok).toBe(true);
    expect(lerEstado().categorias.some((c) => c.id === r.id)).toBe(false);
  });
});

describe("conteúdos", () => {
  beforeEach(() => restaurarSementes());

  const base = {
    categoriaId: "c-corpo",
    titulo: "Alongar com calma",
    resumo: "Três alongamentos gentis para o fim do dia.",
    corpo: ["Comece devagar."],
    tipo: "pratica" as const,
    minutos: 5,
    publicado: false,
  };

  it("texto do editor vira parágrafos e listas, e volta igual", () => {
    const texto = "Primeira linha\ncontinua aqui.\n\n- um\n- dois\n\nFim.";
    const corpo = corpoDeTexto(texto);
    expect(corpo).toEqual(["Primeira linha continua aqui.", "• um", "• dois", "Fim."]);
    expect(corpoDeTexto(textoDeCorpo(corpo))).toEqual(corpo);
  });

  it("cria como rascunho, publica e valida categoria", () => {
    const r = salvarConteudo(base);
    if (!r.ok) throw new Error(r.erro);
    alternarPublicacao(r.id);
    expect(lerEstado().conteudos.find((c) => c.id === r.id)?.publicado).toBe(true);
    expect(salvarConteudo({ ...base, categoriaId: "nao-existe" }).ok).toBe(false);
    expect(salvarConteudo({ ...base, corpo: [] }).ok).toBe(false);
  });

  it("apagar solta a etapa da jornada sem apagá-la", () => {
    apagarConteudo("t-respiracao-4-6");
    const etapa = lerEstado().jornadas.find((j) => j.id === "j-respiro")!.etapas[0];
    expect(etapa.id).toBe("e1");
    expect(etapa.conteudoId).toBeUndefined();
  });
});

describe("jornadas", () => {
  beforeEach(() => restaurarSementes());

  it("editar preserva os ids das etapas — e o progresso de quem estava no meio", () => {
    alternarEtapa("u-pessoa", "j-noites", "e2");
    const j = lerEstado().jornadas.find((x) => x.id === "j-noites")!;
    const dados = { titulo: j.titulo, descricao: j.descricao, tom: j.tom, icone: j.icone, publicada: j.publicada };
    // Reordena, edita o texto e acrescenta uma etapa nova (sem id).
    const etapas = [
      j.etapas[1],
      { ...j.etapas[0], titulo: "Montar o ritual (revisto)" },
      ...j.etapas.slice(2),
      { id: "", titulo: "Nova", proposta: "Uma proposta nova." },
    ];
    expect(salvarJornada({ ...dados, etapas }, j.id).ok).toBe(true);
    const depois = lerEstado().jornadas.find((x) => x.id === "j-noites")!;
    expect(depois.etapas.slice(0, 4).map((e) => e.id)).toEqual(["e2", "e1", "e3", "e4"]);
    expect(depois.etapas[4].id).toMatch(/^e-/);
    expect(andamento(progressoDe(lerEstado(), "u-pessoa"), depois).feitas).toBe(1);
  });

  it("valida etapas e publica/despublica", () => {
    const base = { titulo: "Teste", descricao: "", tom: "verde" as const, icone: "ri-leaf-line", publicada: false };
    expect(salvarJornada({ ...base, etapas: [] }).ok).toBe(false);
    expect(salvarJornada({ ...base, etapas: [{ id: "", titulo: "Um", proposta: "curta" }] }).ok).toBe(true);
    expect(salvarJornada({ ...base, etapas: [{ id: "", titulo: "Um", proposta: "ok ok", conteudoId: "x" }] }).ok).toBe(
      false,
    );
    alternarPublicacaoJornada("j-noites");
    expect(lerEstado().jornadas.find((x) => x.id === "j-noites")?.publicada).toBe(false);
  });
});
