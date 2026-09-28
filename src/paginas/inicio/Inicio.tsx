import { GlassCard, PageShell, stagger } from "@/ui";

export default function Inicio() {
  return (
    <PageShell titulo="Início">
      {/* `pb-28` no celular: a barra de baixo flutua sobre o conteúdo. */}
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <GlassCard className="p-[26px]" delay={stagger(0)}>
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-primary-700">Alívio da Dor</p>
          <h2 className="mt-1 text-[26px] font-extrabold tracking-[-0.02em] text-foreground-950">
            Que bom ter você aqui.
          </h2>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-foreground-600">
            Um espaço de acolhimento, reflexão, cuidado e esperança — no seu tempo.
          </p>
        </GlassCard>
      </main>
    </PageShell>
  );
}
