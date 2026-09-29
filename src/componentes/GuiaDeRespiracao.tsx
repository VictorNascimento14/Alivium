import { useEffect, useState } from "react";

import { Button, GlassCard, usePrefersReducedMotion } from "@/ui";

interface GuiaDeRespiracaoProps {
  /** Segundos de cada fase. O padrão é o 4–6 do conteúdo "Respiração 4–6". */
  inspirar?: number;
  soltar?: number;
}

type Fase = "parado" | "inspirar" | "soltar";

/**
 * Um círculo que cresce ao inspirar e encolhe ao soltar, com contagem.
 *
 * A duração da transição é o TEMPO DA RESPIRAÇÃO (conteúdo), não movimento de
 * interface — por isso vai em `style` e não no vocabulário `--dur-*` do kit.
 * Com `prefers-reduced-motion`, o círculo fica parado e só a contagem guia.
 */
export default function GuiaDeRespiracao({ inspirar = 4, soltar = 6 }: GuiaDeRespiracaoProps) {
  const reduzir = usePrefersReducedMotion();
  // Um estado só: trocar de fase, contar e zerar acontecem no mesmo passo, sem
  // efeito colateral dentro de atualizador (o StrictMode os roda duas vezes).
  const [s, setS] = useState<{ fase: Fase; resta: number; ciclos: number }>({ fase: "parado", resta: 0, ciclos: 0 });
  const { fase, resta, ciclos } = s;

  useEffect(() => {
    if (fase === "parado") return;
    const t = setInterval(() => {
      setS((a) => {
        if (a.resta > 1) return { ...a, resta: a.resta - 1 };
        if (a.fase === "inspirar") return { ...a, fase: "soltar", resta: soltar };
        return { fase: "inspirar", resta: inspirar, ciclos: a.ciclos + 1 };
      });
    }, 1000);
    return () => clearInterval(t);
  }, [fase, inspirar, soltar]);

  function alternar() {
    setS((a) => (a.fase === "parado" ? { fase: "inspirar", resta: inspirar, ciclos: 0 } : { ...a, fase: "parado" }));
  }

  const escala = fase === "inspirar" ? 1 : 0.62;
  const duracao = fase === "inspirar" ? inspirar : soltar;
  const rotulo = fase === "parado" ? "Pronto quando você estiver" : fase === "inspirar" ? "Inspire pelo nariz" : "Solte devagar";

  return (
    <GlassCard tone="medium" className="flex flex-col items-center p-8 text-center">
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-foreground-500">Pratique agora</p>
      <div className="relative my-6 grid h-56 w-56 place-items-center">
        {/* Anel fixo: a referência do tamanho máximo. */}
        <span className="absolute inset-0 rounded-full border-2 border-dashed border-primary-600/25" aria-hidden="true" />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-300/70 to-secondary-300/60 shadow-[0_0_60px_-10px] shadow-primary-500/40"
          style={{
            transform: `scale(${reduzir ? 0.8 : escala})`,
            transition: reduzir || fase === "parado" ? "transform 600ms ease" : `transform ${duracao}s ease-in-out`,
          }}
        />
        <span className="relative text-[44px] font-extrabold tabular-nums text-primary-900" aria-hidden="true">
          {fase === "parado" ? "🌿" : resta}
        </span>
      </div>
      <p className="min-h-[1.5em] text-[17px] font-semibold text-foreground-900" aria-live="polite">
        {rotulo}
      </p>
      <p className="mt-1 text-[13px] text-foreground-500">
        {inspirar}s para inspirar · {soltar}s para soltar{ciclos > 0 ? ` · ${ciclos} ciclo(s)` : ""}
      </p>
      <Button className="mt-5" variant={fase === "parado" ? "primary" : "secondary"} onClick={alternar}>
        <i className={fase === "parado" ? "ri-play-fill" : "ri-pause-fill"} aria-hidden="true" />
        {fase === "parado" ? "Começar" : "Parar"}
      </Button>
    </GlassCard>
  );
}
