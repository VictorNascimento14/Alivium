import { diaISO } from "@/ui/lib/data";
import { agora, atualizar, novoId } from "./repositorio";
import type { CheckIn, Estado, Humor } from "./tipos";

/** O check-in de um dia, se houver. */
export function checkinDoDia(e: Estado, usuarioId: string, dia = diaISO(new Date())): CheckIn | undefined {
  return e.checkins.find((c) => c.usuarioId === usuarioId && c.dia === dia);
}

/** Check-ins de uma pessoa, do mais recente ao mais antigo. */
export function checkinsDe(e: Estado, usuarioId: string): CheckIn[] {
  return e.checkins.filter((c) => c.usuarioId === usuarioId).sort((a, b) => b.dia.localeCompare(a.dia));
}

/** Registra o check-in do dia. Um por dia: registrar de novo substitui o anterior. */
export function registrarCheckin(usuarioId: string, humor: Humor, dor: number, dia = diaISO(new Date())): CheckIn {
  if (![1, 2, 3, 4, 5].includes(humor)) throw new Error("Humor fora da escala 1–5.");
  const dorValida = Math.min(10, Math.max(0, Math.round(dor)));
  const novo: CheckIn = { id: novoId("ck"), usuarioId, dia, humor, dor: dorValida, criadoEm: agora() };
  atualizar((e) => ({
    ...e,
    checkins: [...e.checkins.filter((c) => !(c.usuarioId === usuarioId && c.dia === dia)), novo],
  }));
  return novo;
}
