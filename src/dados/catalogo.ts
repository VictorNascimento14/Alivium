import { atualizar, lerEstado, novoId } from "./repositorio";
import type { Categoria } from "./tipos";

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
