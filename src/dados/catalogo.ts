import { agora, atualizar, lerEstado, novoId } from "./repositorio";
import type { Categoria, Conteudo, Jornada } from "./tipos";

// Escrita do catálogo (categorias, conteúdos, jornadas) — só a área
// administrativa chama. A guarda de papel está na rota; a validação, aqui.

export type Resultado = { ok: true; id: string } | { ok: false; erro: string };

export type DadosCategoria = Omit<Categoria, "id">;

export function validarCategoria(c: DadosCategoria): string | null {
  if (c.nome.trim().length < 2 || c.nome.trim().length > 40) return "O nome precisa ter de 2 a 40 caracteres.";
  if (c.descricao.trim().length > 140) return "A descrição vai até 140 caracteres.";
  if (!/^ri-[a-z0-9-]+$/.test(c.icone)) return "Escolha um ícone.";
  return null;
}

/** Cria (sem `id`) ou edita (com `id`). Nome não pode repetir, sem diferenciar caixa. */
export function salvarCategoria(c: DadosCategoria, id?: string): Resultado {
  const erro = validarCategoria(c);
  if (erro) return { ok: false, erro };
  const nome = c.nome.trim();
  if (lerEstado().categorias.some((k) => k.id !== id && k.nome.toLowerCase() === nome.toLowerCase())) {
    return { ok: false, erro: "Já existe uma categoria com esse nome." };
  }
  const limpa = { ...c, nome, descricao: c.descricao.trim() };
  const alvo = id ?? novoId("c");
  atualizar((e) => ({
    ...e,
    categorias: id
      ? e.categorias.map((k) => (k.id === id ? { ...limpa, id } : k))
      : [...e.categorias, { ...limpa, id: alvo }],
  }));
  return { ok: true, id: alvo };
}

/** Categoria com conteúdo não se apaga: o conteúdo ficaria órfão na biblioteca. */
export function apagarCategoria(id: string): Resultado {
  const n = lerEstado().conteudos.filter((c) => c.categoriaId === id).length;
  if (n > 0) return { ok: false, erro: `Ela tem ${n} conteúdo(s). Mova-os para outra categoria antes.` };
  atualizar((e) => ({ ...e, categorias: e.categorias.filter((k) => k.id !== id) }));
  return { ok: true, id };
}

// ── Conteúdos ────────────────────────────────────────────────────────────────

export type DadosConteudo = Omit<Conteudo, "id" | "criadoEm">;

const BULLET = /^[•\-*]\s+/;

/**
 * Texto do editor → parágrafos. Linha em branco separa parágrafos; linha que
 * começa com "•", "-" ou "*" vira item de lista ("• …", o formato da leitura).
 */
export function corpoDeTexto(texto: string): string[] {
  return texto
    .split(/\n\s*\n/)
    .flatMap((bloco) => {
      const linhas = bloco.split("\n").map((l) => l.trim()).filter(Boolean);
      if (linhas.length && linhas.every((l) => BULLET.test(l))) return linhas.map((l) => `• ${l.replace(BULLET, "")}`);
      return linhas.length ? [linhas.join(" ")] : [];
    });
}

/** Parágrafos → texto do editor. Itens seguidos ficam em linhas vizinhas. */
export function textoDeCorpo(corpo: string[]): string {
  return corpo.reduce((acc, p, i) => {
    if (i === 0) return p;
    const juntar = p.startsWith("• ") && corpo[i - 1].startsWith("• ");
    return acc + (juntar ? "\n" : "\n\n") + p;
  }, "");
}

export function validarConteudo(c: DadosConteudo): string | null {
  if (c.titulo.trim().length < 3 || c.titulo.trim().length > 90) return "O título precisa ter de 3 a 90 caracteres.";
  if (c.resumo.trim().length < 10 || c.resumo.trim().length > 160) return "O resumo precisa ter de 10 a 160 caracteres.";
  if (!lerEstado().categorias.some((k) => k.id === c.categoriaId)) return "Escolha uma categoria.";
  if (!Number.isInteger(c.minutos) || c.minutos < 1 || c.minutos > 120) return "Tempo entre 1 e 120 minutos.";
  if (c.corpo.length === 0) return "Escreva o corpo do conteúdo.";
  return null;
}

export function salvarConteudo(c: DadosConteudo, id?: string): Resultado {
  const erro = validarConteudo(c);
  if (erro) return { ok: false, erro };
  const limpo = { ...c, titulo: c.titulo.trim(), resumo: c.resumo.trim() };
  const alvo = id ?? novoId("t");
  atualizar((e) => ({
    ...e,
    conteudos: id
      ? e.conteudos.map((k) => (k.id === id ? { ...k, ...limpo } : k))
      : [...e.conteudos, { ...limpo, id: alvo, criadoEm: agora() }],
  }));
  return { ok: true, id: alvo };
}

export function alternarPublicacao(id: string): void {
  atualizar((e) => ({ ...e, conteudos: e.conteudos.map((k) => (k.id === id ? { ...k, publicado: !k.publicado } : k)) }));
}

/** Apaga o conteúdo e solta as etapas de jornada que apontavam para ele (a etapa continua). */
export function apagarConteudo(id: string): void {
  atualizar((e) => ({
    ...e,
    conteudos: e.conteudos.filter((k) => k.id !== id),
    jornadas: e.jornadas.map((j) => ({
      ...j,
      etapas: j.etapas.map((et) => (et.conteudoId === id ? { ...et, conteudoId: undefined } : et)),
    })),
  }));
}

// ── Jornadas ─────────────────────────────────────────────────────────────────

export type DadosJornada = Omit<Jornada, "id" | "criadoEm">;

export function validarJornada(j: DadosJornada): string | null {
  if (j.titulo.trim().length < 3 || j.titulo.trim().length > 60) return "O título precisa ter de 3 a 60 caracteres.";
  if (j.descricao.trim().length > 160) return "A descrição vai até 160 caracteres.";
  if (!/^ri-[a-z0-9-]+$/.test(j.icone)) return "Escolha um ícone.";
  if (j.etapas.length === 0) return "A jornada precisa de ao menos uma etapa.";
  const ids = new Set(lerEstado().conteudos.map((c) => c.id));
  for (const [i, e] of j.etapas.entries()) {
    if (e.titulo.trim().length < 2 || e.titulo.trim().length > 60) return `Etapa ${i + 1}: título de 2 a 60 caracteres.`;
    if (e.proposta.trim().length < 5 || e.proposta.trim().length > 200) return `Etapa ${i + 1}: proposta de 5 a 200 caracteres.`;
    if (e.conteudoId && !ids.has(e.conteudoId)) return `Etapa ${i + 1}: o conteúdo escolhido não existe mais.`;
  }
  return null;
}

/**
 * Cria ou edita. Etapa nova ganha id; etapa existente MANTÉM o dela — o
 * progresso das pessoas é guardado por `jornada/etapa`, e trocar o id apagaria
 * o caminho de quem já estava no meio.
 */
export function salvarJornada(j: DadosJornada, id?: string): Resultado {
  const erro = validarJornada(j);
  if (erro) return { ok: false, erro };
  const limpa: DadosJornada = {
    ...j,
    titulo: j.titulo.trim(),
    descricao: j.descricao.trim(),
    etapas: j.etapas.map((e) => ({
      id: e.id || novoId("e"),
      titulo: e.titulo.trim(),
      proposta: e.proposta.trim(),
      conteudoId: e.conteudoId || undefined,
    })),
  };
  const alvo = id ?? novoId("j");
  atualizar((e) => ({
    ...e,
    jornadas: id
      ? e.jornadas.map((k) => (k.id === id ? { ...k, ...limpa } : k))
      : [...e.jornadas, { ...limpa, id: alvo, criadoEm: agora() }],
  }));
  return { ok: true, id: alvo };
}

export function alternarPublicacaoJornada(id: string): void {
  atualizar((e) => ({ ...e, jornadas: e.jornadas.map((k) => (k.id === id ? { ...k, publicada: !k.publicada } : k)) }));
}

export function apagarJornada(id: string): void {
  atualizar((e) => ({ ...e, jornadas: e.jornadas.filter((k) => k.id !== id) }));
}
