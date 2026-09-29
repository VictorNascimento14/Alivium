import { metricas } from "@/dados/admin";
import { useEstado } from "@/dados/repositorio";
import { HUMORES } from "@/dados/tipos";
import { AnimatedNumber, GlassCard, MeterBar, PageShell, StatCard, stagger } from "@/ui";

export default function PainelAdmin() {
  const estado = useEstado();
  const m = metricas(estado);
  const maior = m.maisConcluidos[0]?.total ?? 1;
  const humor = m.humorMedio === null ? null : HUMORES[Math.round(m.humorMedio) - 1];

  return (
    <PageShell titulo="Administração" detalhe="visão geral">
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Pessoas" value={<AnimatedNumber value={m.pessoas} />} icon="users" delay={stagger(0)} />
          <StatCard
            label="Conteúdos publicados"
            value={<AnimatedNumber value={m.conteudosPublicados} />}
            icon="book"
            tone="mint"
            foot={m.rascunhos ? `${m.rascunhos} em rascunho` : "Nenhum rascunho"}
            delay={stagger(1)}
          />
          <StatCard label="Jornadas" value={<AnimatedNumber value={m.jornadas} />} icon="compass" tone="green" delay={stagger(2)} />
          <StatCard
            label="Check-ins (7 dias)"
            value={<AnimatedNumber value={m.checkinsUltimos7Dias} />}
            icon="calendar-check"
            tone="amber"
            delay={stagger(3)}
          />
        </div>

        <div className="mt-3.5 grid gap-3.5 lg:grid-cols-[1.5fr_1fr]">
          <GlassCard className="p-[26px]" delay={stagger(4)}>
            <h2 className="text-[17px] font-bold tracking-[-0.01em] text-foreground-950">Conteúdos mais concluídos</h2>
            <p className="mt-1 text-[13px] text-foreground-500">Quantas pessoas concluíram cada um.</p>
            {m.maisConcluidos.length === 0 ? (
              <p className="mt-5 text-[14px] text-foreground-600">Ainda ninguém concluiu um conteúdo.</p>
            ) : (
              <div className="mt-5 flex flex-col gap-4">
                {m.maisConcluidos.map((x, i) => {
                  const c = estado.conteudos.find((k) => k.id === x.conteudoId);
                  return (
                    <div key={x.conteudoId}>
                      <div className="mb-1.5 flex items-baseline justify-between gap-3">
                        <span className="truncate text-[13px] font-medium text-foreground-700">{c?.titulo ?? "Conteúdo removido"}</span>
                        <span className="text-[13px] font-semibold text-foreground-900">{x.total}</span>
                      </div>
                      <MeterBar pct={(x.total / maior) * 100} delay={stagger(i, 90)} label={`Conclusões de ${c?.titulo ?? "conteúdo"}`} />
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>

          <GlassCard className="flex flex-col p-[26px]" delay={stagger(5)}>
            <h2 className="text-[17px] font-bold tracking-[-0.01em] text-foreground-950">Clima da comunidade</h2>
            <p className="mt-1 text-[13px] text-foreground-500">Humor médio dos check-ins dos últimos 7 dias.</p>
            <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
              {humor ? (
                <>
                  <span className="animate-pop text-[56px] leading-none" aria-hidden="true">
                    {humor.emoji}
                  </span>
                  <p className="mt-3 text-[18px] font-bold text-foreground-950">{humor.rotulo}</p>
                  <p className="text-[13px] text-foreground-500">média {m.humorMedio?.toFixed(1).replace(".", ",")} de 5</p>
                </>
              ) : (
                <p className="text-[14px] text-foreground-600">Sem check-ins nesta semana.</p>
              )}
            </div>
            <p className="rounded-[18px] bg-foreground-950/[0.04] px-4 py-3 text-[12px] leading-relaxed text-foreground-600">
              <i className="ri-shield-keyhole-line mr-1 text-primary-700" aria-hidden="true" />
              Só números agregados. Diário e check-ins individuais nunca aparecem para a administração.
            </p>
          </GlassCard>
        </div>
      </main>
    </PageShell>
  );
}
