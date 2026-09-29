import { diaISO } from "@/ui/lib/data";
import type { Estado } from "./tipos";

// Métricas da área administrativa. SÓ agregados: quem administra o conteúdo não
// precisa (nem deve) ver o check-in ou o diário de uma pessoa específica.

export interface Metricas {
  pessoas: number;
  conteudosPublicados: number;
  rascunhos: number;
  jornadas: number;
  checkinsUltimos7Dias: number;
  /** Humor médio dos check-ins dos últimos 7 dias, ou `null` sem check-in. */
  humorMedio: number | null;
  /** Conteúdos mais concluídos, com o total de pessoas que concluíram. */
  maisConcluidos: { conteudoId: string; total: number }[];
}

export function metricas(e: Estado, hoje = new Date()): Metricas {
  const limiteISO = diaISO(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 6));
  const recentes = e.checkins.filter((c) => c.dia >= limiteISO);

  const contagem = new Map<string, number>();
  for (const p of Object.values(e.progresso)) {
    for (const id of Object.keys(p.conteudos)) contagem.set(id, (contagem.get(id) ?? 0) + 1);
  }

  return {
    pessoas: e.usuarios.filter((u) => u.papel === "pessoa").length,
    conteudosPublicados: e.conteudos.filter((c) => c.publicado).length,
    rascunhos: e.conteudos.filter((c) => !c.publicado).length,
    jornadas: e.jornadas.length,
    checkinsUltimos7Dias: recentes.length,
    humorMedio: recentes.length ? recentes.reduce((s, c) => s + c.humor, 0) / recentes.length : null,
    maisConcluidos: [...contagem]
      .map(([conteudoId, total]) => ({ conteudoId, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5),
  };
}
