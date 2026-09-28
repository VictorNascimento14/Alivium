import { agora, atualizar, novoId } from "./repositorio";
import type { EntradaDiario, Estado, Humor } from "./tipos";

export const TEXTO_MAXIMO = 5000;
export const TITULO_MAXIMO = 80;

export interface RascunhoDiario {
  titulo: string;
  texto: string;
  humor: Humor;
}

/** Erro que impede salvar, ou `null`. */
export function validarEntrada(r: RascunhoDiario): string | null {
  if (!r.texto.trim()) return "Escreva ao menos uma linha.";
  if (r.texto.length > TEXTO_MAXIMO) return `Use até ${TEXTO_MAXIMO} caracteres.`;
  if (r.titulo.length > TITULO_MAXIMO) return `O título vai até ${TITULO_MAXIMO} caracteres.`;
  if (![1, 2, 3, 4, 5].includes(r.humor)) return "Escolha como você está.";
  return null;
}

const limpar = (r: RascunhoDiario) => ({ titulo: r.titulo.trim() || "Sem título", texto: r.texto.trim(), humor: r.humor });

export function escreverEntrada(usuarioId: string, r: RascunhoDiario): EntradaDiario {
  const erro = validarEntrada(r);
  if (erro) throw new Error(erro);
  const entrada: EntradaDiario = { id: novoId("d"), usuarioId, criadoEm: agora(), ...limpar(r) };
  atualizar((e) => ({ ...e, diario: [...e.diario, entrada] }));
  return entrada;
}

/** Edita só entrada da própria pessoa — o id sozinho não basta. */
export function editarEntrada(usuarioId: string, id: string, r: RascunhoDiario): void {
  const erro = validarEntrada(r);
  if (erro) throw new Error(erro);
  atualizar((e) => ({
    ...e,
    diario: e.diario.map((d) => (d.id === id && d.usuarioId === usuarioId ? { ...d, ...limpar(r) } : d)),
  }));
}

export function apagarEntrada(usuarioId: string, id: string): void {
  atualizar((e) => ({ ...e, diario: e.diario.filter((d) => !(d.id === id && d.usuarioId === usuarioId)) }));
}

export function entradasDe(e: Estado, usuarioId: string): EntradaDiario[] {
  return e.diario.filter((d) => d.usuarioId === usuarioId).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
}
