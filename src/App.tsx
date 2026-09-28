import type { CSSProperties } from "react";

import { stagger } from "@/ui";

/**
 * Tela provisória: prova a fundação (vidro, rampas, curva de entrada) antes de
 * os primitivos e a casca chegarem. Some quando as rotas entrarem.
 */
export default function App() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-3.5 px-4 py-10">
      <section className="glass animate-rise p-[26px]" style={{ "--d": `${stagger(0)}ms` } as CSSProperties}>
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-primary-700">Alívio da Dor</p>
        <h1 className="mt-1 text-[28px] font-extrabold tracking-[-0.02em] text-foreground-950">Alivium</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-foreground-600">
          Acolhimento, reflexão, cuidado e esperança — no seu tempo.
        </p>
      </section>
      <section
        className="glass-md lift sheen animate-rise p-[26px]"
        style={{ "--d": `${stagger(1)}ms` } as CSSProperties}
      >
        <p className="text-[13px] text-foreground-500">
          A fundação do sistema visual está no ar: rampas de cor, vidro, tema escuro e a curva orgânica.
        </p>
      </section>
    </main>
  );
}
