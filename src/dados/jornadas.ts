import { agora, mexerProgresso as mexer } from "./repositorio";
import type { Etapa, Jornada, Progresso } from "./tipos";

export const chaveEtapa = (jornadaId: string, etapaId: string) => `${jornadaId}/${etapaId}`;

export interface Andamento {
  feitas: number;
  total: number;
  pct: number;
  iniciada: boolean;
  concluida: boolean;
  /** A primeira etapa ainda não feita, na ordem da jornada. */
  proxima?: Etapa;
}

export function andamento(p: Progresso, j: Jornada): Andamento {
  const feitas = j.etapas.filter((e) => p.etapas[chaveEtapa(j.id, e.id)]).length;
  const total = j.etapas.length;
  return {
    feitas,
    total,
    pct: total ? Math.round((feitas / total) * 100) : 0,
    iniciada: Boolean(p.jornadas[j.id]) || feitas > 0,
    concluida: total > 0 && feitas === total,
    proxima: j.etapas.find((e) => !p.etapas[chaveEtapa(j.id, e.id)]),
  };
}

export function iniciarJornada(usuarioId: string, jornadaId: string): void {
  mexer(usuarioId, (p) => (p.jornadas[jornadaId] ? p : { ...p, jornadas: { ...p.jornadas, [jornadaId]: agora() } }));
}

/** Marca/desmarca uma etapa. Marcar também dá a jornada por iniciada. */
export function alternarEtapa(usuarioId: string, jornadaId: string, etapaId: string): boolean {
  const k = chaveEtapa(jornadaId, etapaId);
  let feita = false;
  mexer(usuarioId, (p) => {
    const etapas = { ...p.etapas };
    feita = !etapas[k];
    if (feita) etapas[k] = agora();
    else delete etapas[k];
    const jornadas = p.jornadas[jornadaId] ? p.jornadas : { ...p.jornadas, [jornadaId]: agora() };
    return { ...p, etapas, jornadas };
  });
  return feita;
}
