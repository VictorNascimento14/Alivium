import type { ReactNode } from "react";

import { BrandMark, GlassCard, GlassPill, Reveal, TemaToggle, stagger } from "@/ui";

const PILARES = [
  { icone: "ri-hand-heart-line", texto: "Acolhimento sem julgamento" },
  { icone: "ri-lightbulb-flash-line", texto: "Reflexões e práticas curtas" },
  { icone: "ri-compass-3-line", texto: "Jornadas no seu ritmo" },
  { icone: "ri-sun-line", texto: "Um lugar para a esperança" },
];

interface LayoutAutenticacaoProps {
  titulo: string;
  subtitulo: string;
  children: ReactNode;
  /** Abaixo do cartão: o link para a outra tela (entrar ↔ cadastro). */
  rodape?: ReactNode;
}

/**
 * Moldura das telas sem sessão. Fica FORA do `RailLayout` (não há coluna antes
 * de existir conta), mas usa os mesmos primitivos — o visual continua o do app.
 */
export default function LayoutAutenticacao({ titulo, subtitulo, children, rodape }: LayoutAutenticacaoProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Halos orgânicos: decoração pura, atrás de tudo. */}
      <div
        aria-hidden="true"
        className="animate-fade-in pointer-events-none absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-primary-300/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="animate-fade-in pointer-events-none absolute -bottom-48 -right-32 h-[520px] w-[520px] rounded-full bg-secondary-300/30 blur-3xl"
      />

      <div className="absolute right-4 top-4 z-10 md:right-6 md:top-6">
        <GlassPill className="p-1.5">
          <TemaToggle />
        </GlassPill>
      </div>

      <main className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.1fr_1fr] md:px-8">
        <section className="hidden md:block">
          <Reveal delay={stagger(0)}>
            <BrandMark size={40} showWordmark />
          </Reveal>
          <Reveal delay={stagger(1)}>
            <h1 className="mt-10 text-[46px] font-extrabold leading-[1.04] tracking-[-0.03em] text-foreground-950">
              Um lugar para <span className="text-primary-700">respirar</span>.
            </h1>
          </Reveal>
          <Reveal delay={stagger(2)}>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-foreground-600">
              Acolhimento, reflexão, cuidado e esperança — no seu tempo, do seu jeito.
            </p>
          </Reveal>
          <ul className="mt-9 flex flex-col gap-3">
            {PILARES.map((p, i) => (
              <li key={p.texto}>
                <Reveal delay={stagger(3 + i)}>
                  <GlassPill className="lift py-2 pl-2 pr-5">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-50 text-[17px] text-primary-800">
                      <i className={p.icone} aria-hidden="true" />
                    </span>
                    <span className="text-[14px] font-medium text-foreground-800">{p.texto}</span>
                  </GlassPill>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto w-full max-w-md">
          <Reveal delay={stagger(0)} className="mb-6 flex justify-center md:hidden">
            <BrandMark size={36} showWordmark />
          </Reveal>
          <GlassCard tone="strong" className="p-7 sm:p-9" delay={stagger(1)}>
            <h2 className="text-[24px] font-extrabold tracking-[-0.02em] text-foreground-950">{titulo}</h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-foreground-600">{subtitulo}</p>
            <div className="mt-7">{children}</div>
          </GlassCard>
          {rodape && (
            <Reveal delay={stagger(2)} className="mt-5 text-center text-[14px] text-foreground-600">
              {rodape}
            </Reveal>
          )}
          <p className="mt-6 text-center text-[12px] leading-relaxed text-foreground-500">
            O Alivium não substitui atendimento profissional. Em sofrimento intenso, ligue{" "}
            <a href="tel:188" className="font-semibold text-primary-800 underline-offset-2 hover:underline">
              188 (CVV)
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
