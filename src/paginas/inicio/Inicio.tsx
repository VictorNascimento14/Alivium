import { useSessao } from "@/sessao/useSessao";
import { GlassCard, PageShell, stagger } from "@/ui";
import CheckInCard from "./CheckInCard";
import { fraseDoDia, saudacao } from "./frases";

export default function Inicio() {
  const usuario = useSessao();
  if (!usuario) return null; // a guarda de rota garante a sessão; isto só estreita o tipo

  const agora = new Date();
  const data = agora.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  const primeiroNome = usuario.nome.split(" ")[0];

  return (
    <PageShell titulo="Início" detalhe={data}>
      {/* `pb-28` no celular: a barra de baixo flutua sobre o conteúdo. */}
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <GlassCard tone="medium" className="relative overflow-hidden p-[26px] md:p-8" delay={stagger(0)}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary-300/30 blur-3xl"
          />
          <p className="relative text-[13px] font-semibold uppercase tracking-[0.08em] text-primary-700">
            {saudacao(agora)}
          </p>
          <h2 className="relative mt-1 text-[30px] font-extrabold leading-tight tracking-[-0.02em] text-foreground-950 md:text-[36px]">
            Que bom ter você aqui, {primeiroNome}.
          </h2>
          <p className="relative mt-3 flex max-w-2xl items-start gap-2.5 text-[15px] leading-relaxed text-foreground-600">
            <i className="ri-leaf-line mt-0.5 text-lg text-primary-600" aria-hidden="true" />
            <span>{usuario.intencao ? `“${usuario.intencao}”` : "Um espaço de acolhimento, reflexão, cuidado e esperança — no seu tempo."}</span>
          </p>
        </GlassCard>

        <div className="mt-3.5 grid gap-3.5 lg:grid-cols-[1.35fr_1fr]">
          <CheckInCard usuarioId={usuario.id} delay={stagger(1)} />

          <GlassCard interactive sheen className="flex flex-col justify-between p-[26px]" delay={stagger(2)}>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-foreground-500">
                Para hoje
              </p>
              <p className="mt-3 text-[20px] font-bold leading-snug tracking-[-0.01em] text-foreground-950">
                {fraseDoDia(agora)}
              </p>
            </div>
            <p className="mt-6 text-[12.5px] text-foreground-500">Uma frase nova a cada dia.</p>
          </GlassCard>
        </div>
      </main>
    </PageShell>
  );
}
