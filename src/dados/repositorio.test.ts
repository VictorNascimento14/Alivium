import { beforeEach, describe, expect, it } from "vitest";

import { atualizar, assinar, lerEstado, novoId, progressoDe, restaurarSementes } from "./repositorio";
import { CATEGORIAS, CONTEUDOS, JORNADAS } from "./sementes";

describe("sementes", () => {
  it("todo conteúdo aponta para uma categoria que existe", () => {
    const ids = new Set(CATEGORIAS.map((c) => c.id));
    expect(CONTEUDOS.filter((c) => !ids.has(c.categoriaId))).toEqual([]);
  });

  it("toda etapa que cita conteúdo cita um que existe", () => {
    const ids = new Set(CONTEUDOS.map((c) => c.id));
    const quebradas = JORNADAS.flatMap((j) => j.etapas.filter((e) => e.conteudoId && !ids.has(e.conteudoId)));
    expect(quebradas).toEqual([]);
  });

  it("ids são únicos", () => {
    for (const lista of [CATEGORIAS, CONTEUDOS, JORNADAS]) {
      expect(new Set(lista.map((x) => x.id)).size).toBe(lista.length);
    }
  });
});

describe("repositório", () => {
  beforeEach(() => restaurarSementes());

  it("atualizar troca a referência e avisa quem assina", () => {
    const antes = lerEstado();
    let avisos = 0;
    const sair = assinar(() => avisos++);
    atualizar((e) => ({ ...e, sessaoId: "u-pessoa" }));
    sair();
    expect(lerEstado()).not.toBe(antes);
    expect(lerEstado().sessaoId).toBe("u-pessoa");
    expect(avisos).toBe(1);
  });

  it("progresso de quem não tem registro é vazio, e não undefined", () => {
    expect(progressoDe(lerEstado(), "ninguem").salvos).toEqual([]);
  });

  it("novoId leva o prefixo e não repete", () => {
    const a = novoId("x");
    expect(a.startsWith("x-")).toBe(true);
    expect(novoId("x")).not.toBe(a);
  });
});
