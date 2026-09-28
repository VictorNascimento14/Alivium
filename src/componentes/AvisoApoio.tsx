import { GlassCard } from "@/ui";

/**
 * O caminho para ajuda de verdade. Fica visível na leitura e no diário — o
 * CLAUDE.md proíbe removê-lo sem decisão escrita em ADR.
 */
export default function AvisoApoio({ delay = 0 }: { delay?: number }) {
  return (
    <GlassCard tone="medium" className="flex items-start gap-4 p-[22px]" delay={delay}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-100 text-lg text-orange-700">
        <i className="ri-customer-service-2-line" aria-hidden="true" />
      </span>
      <div className="text-[13.5px] leading-relaxed text-foreground-600">
        <p className="font-semibold text-foreground-900">Você não precisa passar por isso só.</p>
        <p className="mt-1">
          O Alivium é um apoio e não substitui atendimento profissional. Em sofrimento intenso, ligue{" "}
          <a href="tel:188" className="font-semibold text-primary-800 underline underline-offset-2">
            188
          </a>{" "}
          (CVV, 24h, gratuito) ou{" "}
          <a href="tel:192" className="font-semibold text-primary-800 underline underline-offset-2">
            192
          </a>{" "}
          (SAMU) em emergência.
        </p>
      </div>
    </GlassCard>
  );
}
