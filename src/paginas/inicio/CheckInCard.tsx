import { useState } from "react";
import type { CSSProperties } from "react";

import { checkinDoDia, registrarCheckin } from "@/dados/checkins";
import { useEstado } from "@/dados/repositorio";
import { HUMORES } from "@/dados/tipos";
import type { Humor } from "@/dados/tipos";
import { Button, GlassCard, stagger, toast } from "@/ui";

function descreverDor(dor: number): string {
  if (dor === 0) return "sem dor";
  if (dor <= 3) return "leve";
  if (dor <= 6) return "moderada";
  if (dor <= 8) return "forte";
  return "muito forte";
}

/** Resposta ao registro: acolhe o que foi dito, sem corrigir a pessoa. */
function resposta(humor: Humor, dor: number): string {
  if (humor <= 2 || dor >= 8) return "Sinto muito que esteja pesado agora. Vá com calma — e, se precisar, peça ajuda.";
  if (humor === 3) return "Dias no meio do caminho também contam. Obrigado por se escutar.";
  return "Que bom. Guarde um pouco deste momento para os dias mais difíceis.";
}

interface CheckInCardProps {
  usuarioId: string;
  delay?: number;
}

export default function CheckInCard({ usuarioId, delay = 0 }: CheckInCardProps) {
  const hoje = checkinDoDia(useEstado(), usuarioId);
  const [editando, setEditando] = useState(false);
  const [humor, setHumor] = useState<Humor | null>(hoje?.humor ?? null);
  const [dor, setDor] = useState(hoje?.dor ?? 0);

  const mostrarFormulario = !hoje || editando;

  function registrar() {
    if (!humor) return;
    registrarCheckin(usuarioId, humor, dor);
    setEditando(false);
    toast("Check-in registrado", "Cuidar começa por perceber.");
  }

  return (
    <GlassCard className="p-[26px]" delay={delay}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-bold tracking-[-0.01em] text-foreground-950">Como você está agora?</h2>
          <p className="mt-1 text-[13px] text-foreground-500">Sem certo ou errado. Só um retrato do momento.</p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-50 text-lg text-primary-800">
          <i className="ri-heart-pulse-line" aria-hidden="true" />
        </span>
      </div>

      {mostrarFormulario ? (
        <div key="form" className="animate-fade-up">
          <fieldset className="mt-5">
            <legend className="sr-only">Humor</legend>
            <div className="grid grid-cols-5 gap-2">
              {HUMORES.map((h, i) => {
                const ativo = humor === h.valor;
                return (
                  <button
                    key={h.valor}
                    type="button"
                    onClick={() => setHumor(h.valor)}
                    aria-pressed={ativo}
                    className={`animate-pop press flex cursor-pointer flex-col items-center gap-1.5 rounded-[18px] px-1 py-3 transition-colors duration-200 ${
                      ativo
                        ? "bg-primary-100 ring-2 ring-primary-600"
                        : "glass-inset hover:bg-primary-900/[0.05]"
                    }`}
                    style={{ "--d": `${stagger(i, 60)}ms` } as CSSProperties}
                  >
                    <span
                      className={`text-[28px] leading-none transition-transform duration-open ease-organic ${ativo ? "scale-125" : ""}`}
                      aria-hidden="true"
                    >
                      {h.emoji}
                    </span>
                    <span className="text-center text-[11px] font-medium leading-tight text-foreground-700">
                      {h.rotulo}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-5">
            <div className="mb-2 flex items-baseline justify-between">
              <label htmlFor="dor" className="text-[13px] font-medium text-foreground-700">
                Dor agora
              </label>
              <span className="text-[13px] font-semibold text-foreground-900">
                {dor}/10 <span className="font-normal text-foreground-500">· {descreverDor(dor)}</span>
              </span>
            </div>
            <input
              id="dor"
              type="range"
              min={0}
              max={10}
              step={1}
              value={dor}
              onChange={(e) => setDor(Number(e.target.value))}
              className="w-full cursor-pointer accent-primary-700"
            />
            <div className="mt-1 flex justify-between text-[11px] text-foreground-500">
              <span>nenhuma</span>
              <span>a pior imaginável</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button onClick={registrar} disabled={!humor}>
              Registrar check-in
            </Button>
            {hoje && (
              <Button variant="ghost" onClick={() => setEditando(false)}>
                Cancelar
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div key="resumo" className="animate-fade-up mt-5">
          <div className="glass-inset flex items-center gap-4 rounded-[18px] p-4">
            <span className="animate-pop text-[40px] leading-none" aria-hidden="true">
              {HUMORES[hoje.humor - 1].emoji}
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-foreground-900">{HUMORES[hoje.humor - 1].rotulo}</p>
              <p className="text-[13px] text-foreground-500">
                Dor {hoje.dor}/10 · registrado às{" "}
                {new Date(hoje.criadoEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-foreground-700">{resposta(hoje.humor, hoje.dor)}</p>
          {(hoje.humor === 1 || hoje.dor >= 9) && (
            <p className="mt-3 flex items-start gap-2 rounded-[18px] bg-orange-100 px-4 py-3 text-[13px] text-orange-700">
              <i className="ri-phone-line mt-0.5" aria-hidden="true" />
              <span>
                Se estiver difícil demais, você não precisa passar por isso só. Ligue{" "}
                <a href="tel:188" className="font-semibold underline">
                  188 (CVV)
                </a>
                , 24h e gratuito.
              </span>
            </p>
          )}
          <Button variant="secondary" className="mt-4" onClick={() => setEditando(true)}>
            <i className="ri-refresh-line" aria-hidden="true" />
            Atualizar
          </Button>
        </div>
      )}
    </GlassCard>
  );
}
