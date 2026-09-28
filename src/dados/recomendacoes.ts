import { checkinDoDia } from "./checkins";
import { andamento } from "./jornadas";
import { progressoDe } from "./repositorio";
import type { Conteudo, Estado, Jornada } from "./tipos";

/**
 * Até `n` conteúdos para hoje: publicados e ainda não concluídos. Num dia
 * difícil (humor ≤ 2 ou dor ≥ 7 no check-in), práticas e respirações curtas vêm
 * primeiro — é o que cabe quando falta energia para ler.
 */
export function recomendarConteudos(e: Estado, usuarioId: string, n = 3, dia?: string): Conteudo[] {
  const feitos = progressoDe(e, usuarioId).conteudos;
  const ck = checkinDoDia(e, usuarioId, dia);
  const diaDificil = ck ? ck.humor <= 2 || ck.dor >= 7 : false;
  const peso = (c: Conteudo) => (diaDificil ? (c.tipo === "respiracao" || c.tipo === "pratica" ? 0 : 1) : 0);
  return e.conteudos
    .filter((c) => c.publicado && !feitos[c.id])
    .map((c, i) => ({ c, i }))
    .sort((a, b) => peso(a.c) - peso(b.c) || (diaDificil ? a.c.minutos - b.c.minutos : 0) || a.i - b.i)
    .slice(0, n)
    .map((x) => x.c);
}

/** A jornada para continuar: a em andamento iniciada mais recentemente. */
export function jornadaParaContinuar(e: Estado, usuarioId: string): Jornada | undefined {
  const p = progressoDe(e, usuarioId);
  return e.jornadas
    .filter((j) => j.publicada)
    .filter((j) => {
      const a = andamento(p, j);
      return a.iniciada && !a.concluida;
    })
    .sort((a, b) => (p.jornadas[b.id] ?? "").localeCompare(p.jornadas[a.id] ?? ""))[0];
}
