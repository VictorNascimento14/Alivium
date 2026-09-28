import type { CSSProperties } from "react";
import { Link } from "react-router-dom";

import { TONS } from "@/componentes/tons";
import { resumo, ultimosDias } from "@/dados/estatisticas";
import { andamento } from "@/dados/jornadas";
import { progressoDe, useEstado } from "@/dados/repositorio";
import { HUMORES } from "@/dados/tipos";
import { useSessao } from "@/sessao/useSessao";
import { AnimatedNumber, Calendar, GlassCard, MeterBar, PageShell, StatCard, stagger } from "@/ui";

// Uma cor por humor, em classes literais (o Tailwind não gera classe montada).
// Nada abaixo de 500 na rampa verde: some no trilho.
const COR_HUMOR = ["", "bg-red-400", "bg-orange-400", "bg-secondary-500", "bg-primary-500", "bg-primary-700"];

export default function Progresso() {
  const estado = useEstado();
  const usuario = useSessao();
  if (!usuario) return null;

  const r = resumo(estado, usuario.id);
  const dias = ultimosDias(estado, usuario.id);
  const progresso = progressoDe(estado, usuario.id);
  const jornadas = estado.jornadas
    .filter((j) => j.publicada)
    .map((j) => ({ j, a: andamento(progresso, j) }))
    .filter((x) => x.a.iniciada);

  return (
    <PageShell titulo="Progresso" detalhe={`${r.diasAtivos.length} dias de cuidado`}>
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <p className="max-w-2xl px-1 text-[14px] leading-relaxed text-foreground-600">
          Cada registro conta. Dias sem registro também fazem parte do caminho — não há sequência a perder aqui.
        </p>

        <div className="mt-4 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Conteúdos concluídos" value={<AnimatedNumber value={r.conteudos} />} icon="book" delay={stagger(0)} />
          <StatCard label="Etapas de jornada" value={<AnimatedNumber value={r.etapas} />} icon="compass" tone="mint" delay={stagger(1)} />
          <StatCard label="Check-ins" value={<AnimatedNumber value={r.checkins} />} icon="calendar-check" tone="amber" delay={stagger(2)} />
          <StatCard label="Páginas do diário" value={<AnimatedNumber value={r.entradas} />} icon="pen" tone="green" delay={stagger(3)} />
        </div>

        <div className="mt-3.5 grid gap-3.5 lg:grid-cols-[1.5fr_1fr]">
          <GlassCard className="p-[26px]" delay={stagger(4)}>
            <h2 className="text-[17px] font-bold tracking-[-0.01em] text-foreground-950">Como você esteve</h2>
            <p className="mt-1 text-[13px] text-foreground-500">Humor dos check-ins nas últimas duas semanas.</p>
            <div className="mt-6 flex h-40 items-end gap-1.5 sm:gap-2" role="list" aria-label="Humor por dia">
              {dias.map(({ dia, ck }, i) => {
                const rotulo = new Date(`${dia}T12:00:00`).toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
                return (
                  <div key={dia} role="listitem" className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                    {ck ? (
                      <div
                        className={`animate-rise w-full max-w-7 rounded-full ${COR_HUMOR[ck.humor]}`}
                        style={{ height: `${ck.humor * 20}%`, "--d": `${stagger(i, 35)}ms` } as CSSProperties}
                        title={`${rotulo}: ${HUMORES[ck.humor - 1].rotulo}, dor ${ck.dor}/10`}
                      >
                        <span className="sr-only">
                          {rotulo}: {HUMORES[ck.humor - 1].rotulo}, dor {ck.dor} de 10
                        </span>
                      </div>
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-foreground-950/[0.12]" aria-hidden="true" />
                    )}
                    <span className="text-[10.5px] text-foreground-500">{dia.slice(8)}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[11.5px] text-foreground-600">
              {HUMORES.map((h) => (
                <span key={h.valor} className="inline-flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${COR_HUMOR[h.valor]}`} aria-hidden="true" />
                  {h.rotulo}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-[22px]" delay={stagger(5)}>
            <h2 className="px-1 text-[17px] font-bold tracking-[-0.01em] text-foreground-950">Dias de cuidado</h2>
            <p className="mb-3 mt-1 px-1 text-[13px] text-foreground-500">Qualquer registro marca o dia.</p>
            <Calendar marcados={r.diasAtivos} />
          </GlassCard>
        </div>

        <GlassCard className="mt-3.5 p-[26px]" delay={stagger(6)}>
          <h2 className="text-[17px] font-bold tracking-[-0.01em] text-foreground-950">Jornadas</h2>
          {jornadas.length === 0 ? (
            <p className="mt-2 text-[14px] text-foreground-600">
              Nenhuma jornada começada ainda.{" "}
              <Link to="/jornadas" className="underline-grow font-semibold text-primary-800">
                Conhecer as jornadas
              </Link>
            </p>
          ) : (
            <div className="mt-5 flex flex-col gap-4">
              {jornadas.map(({ j, a }, i) => (
                <Link key={j.id} to={`/jornadas/${j.id}`} className="group block rounded-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600">
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2.5 text-[14px] font-semibold text-foreground-800 group-hover:text-primary-800">
                      <span className={`grid h-7 w-7 place-items-center rounded-full text-sm ${TONS[j.tom].pastilha}`}>
                        <i className={j.icone} aria-hidden="true" />
                      </span>
                      {j.titulo}
                    </span>
                    <span className="text-[13px] font-semibold text-foreground-900">
                      {a.concluida ? "Concluída" : `${a.feitas}/${a.total}`}
                    </span>
                  </div>
                  <MeterBar pct={a.pct} delay={stagger(i, 90)} label={`Andamento de ${j.titulo}`} />
                </Link>
              ))}
            </div>
          )}
        </GlassCard>
      </main>
    </PageShell>
  );
}
