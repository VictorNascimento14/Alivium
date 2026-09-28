import type { ReactNode } from "react";

import { TIPOS } from "@/dados/tipos";
import type { Categoria, Conteudo } from "@/dados/tipos";
import { GlassCard } from "@/ui";
import { TONS } from "./tons";

interface ConteudoCardProps {
  conteudo: Conteudo;
  categoria?: Categoria;
  concluido?: boolean;
  delay?: number;
  /** Envolve o cartão num link — a rota de leitura é de quem usa. */
  envolver?: (cartao: ReactNode) => ReactNode;
}

/** Cartão de conteúdo: categoria, tipo, título, resumo e tempo. Usado na biblioteca, no Início e nos salvos. */
export default function ConteudoCard({ conteudo, categoria, concluido, delay = 0, envolver }: ConteudoCardProps) {
  const tipo = TIPOS[conteudo.tipo];
  const tom = TONS[categoria?.tom ?? "verde"];

  const cartao = (
    <GlassCard interactive sheen className="relative flex h-full flex-col overflow-hidden p-[22px]" delay={delay}>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full blur-2xl ${tom.halo}`}
      />
      <div className="relative flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${tom.pastilha}`}>
          {categoria && <i className={categoria.icone} aria-hidden="true" />}
          {categoria?.nome ?? "Sem categoria"}
        </span>
        {concluido && (
          <span
            className="animate-pop grid h-7 w-7 place-items-center rounded-full bg-primary-700 text-sm text-primary-50"
            title="Concluído"
          >
            <i className="ri-check-line" aria-hidden="true" />
            <span className="sr-only">Concluído</span>
          </span>
        )}
      </div>
      <h3 className="relative mt-4 text-[16.5px] font-bold leading-snug tracking-[-0.01em] text-foreground-950">
        {conteudo.titulo}
      </h3>
      <p className="relative mt-1.5 flex-1 text-[13.5px] leading-relaxed text-foreground-600">{conteudo.resumo}</p>
      <p className="relative mt-4 flex items-center gap-3 text-[12px] font-medium text-foreground-500">
        <span className="inline-flex items-center gap-1">
          <i className={tipo.icone} aria-hidden="true" />
          {tipo.rotulo}
        </span>
        <span aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-1">
          <i className="ri-time-line" aria-hidden="true" />
          {conteudo.minutos} min
        </span>
      </p>
    </GlassCard>
  );

  return envolver ? envolver(cartao) : cartao;
}
