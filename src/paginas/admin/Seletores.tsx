import { TONS } from "@/componentes/tons";
import type { Tom } from "@/dados/tipos";

const ROTULO_TOM: Record<Tom, string> = {
  verde: "Verde",
  menta: "Menta",
  ambar: "Âmbar",
  coral: "Coral",
  lavanda: "Lavanda",
  ceu: "Céu",
};

/** Ícones oferecidos no catálogo — Remix, traço fino, temas de cuidado. */
const ICONES = [
  "ri-body-scan-line",
  "ri-windy-line",
  "ri-moon-clear-line",
  "ri-seedling-line",
  "ri-hand-heart-line",
  "ri-sun-line",
  "ri-heart-pulse-line",
  "ri-leaf-line",
  "ri-drop-line",
  "ri-mental-health-line",
  "ri-emotion-happy-line",
  "ri-user-heart-line",
  "ri-run-line",
  "ri-cup-line",
  "ri-music-2-line",
  "ri-book-open-line",
];

export function SeletorTom({ valor, onChange }: { valor: Tom; onChange: (t: Tom) => void }) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-foreground-700">Tom</legend>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(TONS) as Tom[]).map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={valor === t}
            aria-label={ROTULO_TOM[t]}
            title={ROTULO_TOM[t]}
            onClick={() => onChange(t)}
            className={`press grid h-10 w-10 cursor-pointer place-items-center rounded-full transition-all duration-open ease-organic ${TONS[t].pastilha} ${
              valor === t ? "scale-110 ring-2 ring-foreground-900 ring-offset-2 ring-offset-background-50" : ""
            }`}
          >
            {valor === t && <i className="ri-check-line animate-pop" aria-hidden="true" />}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function SeletorIcone({ valor, tom, onChange }: { valor: string; tom: Tom; onChange: (i: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-foreground-700">Ícone</legend>
      <div className="grid grid-cols-8 gap-1.5">
        {ICONES.map((i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={valor === i}
            aria-label={i.replace(/^ri-|-line$/g, "").replace(/-/g, " ")}
            onClick={() => onChange(i)}
            className={`press grid aspect-square cursor-pointer place-items-center rounded-[14px] text-lg transition-colors duration-200 ${
              valor === i ? TONS[tom].pastilha : "glass-inset text-foreground-600 hover:text-primary-800"
            }`}
          >
            <i className={i} aria-hidden="true" />
          </button>
        ))}
      </div>
    </fieldset>
  );
}
