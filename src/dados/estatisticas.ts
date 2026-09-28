import { diaISO } from "@/ui/lib/data";
import { checkinsDe } from "./checkins";
import { entradasDe } from "./diario";
import { progressoDe } from "./repositorio";
import type { CheckIn, Estado } from "./tipos";

export interface Resumo {
  conteudos: number;
  etapas: number;
  entradas: number;
  checkins: number;
  /** Dias (`AAAA-MM-DD` locais) com qualquer registro de cuidado. */
  diasAtivos: string[];
}

/** Instante ISO → dia local. `slice(0, 10)` daria o dia em UTC, errado à noite no Brasil. */
const diaDe = (iso: string) => diaISO(new Date(iso));

export function resumo(e: Estado, usuarioId: string): Resumo {
  const p = progressoDe(e, usuarioId);
  const cks = checkinsDe(e, usuarioId);
  const entradas = entradasDe(e, usuarioId);
  const dias = new Set<string>([
    ...cks.map((c) => c.dia),
    ...Object.values(p.conteudos).map(diaDe),
    ...Object.values(p.etapas).map(diaDe),
    ...entradas.map((d) => diaDe(d.criadoEm)),
  ]);
  return {
    conteudos: Object.keys(p.conteudos).length,
    etapas: Object.keys(p.etapas).length,
    entradas: entradas.length,
    checkins: cks.length,
    diasAtivos: [...dias].sort(),
  };
}

/** Os últimos `n` dias até `hoje`, cada um com o check-in se houver. */
export function ultimosDias(e: Estado, usuarioId: string, n = 14, hoje = new Date()): { dia: string; ck?: CheckIn }[] {
  const porDia = new Map(checkinsDe(e, usuarioId).map((c) => [c.dia, c]));
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - (n - 1 - i));
    const dia = diaISO(d);
    return { dia, ck: porDia.get(dia) };
  });
}
