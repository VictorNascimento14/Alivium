import type { ReactNode } from "react";

import type { Andamento } from "@/dados/jornadas";
import type { Jornada } from "@/dados/tipos";
import { GlassCard, MeterBar } from "@/ui";
import { TONS } from "./tons";

interface JornadaCardProps {
  jornada: Jornada;
  andamento: Andamento;
  delay?: number;
  envolver?: (cartao: ReactNode) => ReactNode;
}

function Situacao({ a }: { a: Andamento }) {
  if (a.concluida)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary-700 px-2.5 py-1 text-[11.5px] font-semibold text-primary-50">
        <i className="ri-medal-line" aria-hidden="true" /> Concluída
      </span>
    );
  if (a.iniciada)
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-2.5 py-1 text-[11.5px] font-semibold text-primary-800">
        <span className="animate-live h-[5px] w-[5px] rounded-full bg-primary-600" aria-hidden="true" /> Em andamento
      </span>
    );
  return (
    <span className="rounded-full bg-foreground-950/[0.06] px-2.5 py-1 text-[11.5px] font-semibold text-foreground-600">
      Nova
    </span>
  );
}

/** Cartão de jornada: tom, ícone, situação e, se começou, a barra de andamento. */
export default function JornadaCard({ jornada, andamento: a, delay = 0, envolver }: JornadaCardProps) {
  const tom = TONS[jornada.tom];
  const cartao = (
    <GlassCard interactive sheen className="relative flex h-full flex-col overflow-hidden p-[22px]" delay={delay}>
      <div aria-hidden="true" className={`pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full blur-2xl ${tom.halo}`} />
      <div className="relative flex items-start justify-between gap-3">
        <span className={`grid h-12 w-12 place-items-center rounded-full text-[22px] ${tom.pastilha}`}>
          <i className={jornada.icone} aria-hidden="true" />
        </span>
        <Situacao a={a} />
      </div>
      <h3 className="relative mt-4 text-[18px] font-bold leading-snug tracking-[-0.01em] text-foreground-950">
        {jornada.titulo}
      </h3>
      <p className="relative mt-1.5 flex-1 text-[13.5px] leading-relaxed text-foreground-600">{jornada.descricao}</p>
      <div className="relative mt-5">
        <div className="mb-1.5 flex items-baseline justify-between text-[12px]">
          <span className="font-medium text-foreground-500">{a.total} etapas</span>
          {a.iniciada && (
            <span className="font-semibold text-foreground-800">
              {a.feitas}/{a.total}
            </span>
          )}
        </div>
        <MeterBar pct={a.pct} height={7} label={`Andamento de ${jornada.titulo}`} />
      </div>
    </GlassCard>
  );
  return envolver ? envolver(cartao) : cartao;
}
