import { AnimatedNumber, Button, GlassCard, MeterBar, StatCard, stagger, toast } from "@/ui";

/**
 * Tela provisória: prova os primitivos antes de a casca e as rotas chegarem.
 * Some quando as rotas entrarem.
 */
export default function App() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-3.5 px-4 py-10">
      <GlassCard className="p-[26px]" delay={stagger(0)}>
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-primary-700">Alívio da Dor</p>
        <h1 className="mt-1 text-[28px] font-extrabold tracking-[-0.02em] text-foreground-950">Alivium</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-foreground-600">
          Acolhimento, reflexão, cuidado e esperança — no seu tempo.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <Button onClick={() => toast("Tudo certo", "Os primitivos estão no ar.")}>Começar</Button>
          <Button variant="ghost">Saber mais</Button>
        </div>
      </GlassCard>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <StatCard label="Conteúdos" value={<AnimatedNumber value={24} />} icon="grid" delay={stagger(1)} />
        <StatCard label="Jornadas" value={<AnimatedNumber value={4} />} icon="calendar" tone="mint" delay={stagger(2)} />
      </div>
      <GlassCard className="p-[26px]" delay={stagger(3)}>
        <MeterBar pct={64} label="Progresso de exemplo" />
      </GlassCard>
    </main>
  );
}
