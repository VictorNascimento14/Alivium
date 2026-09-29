/** Interruptor de publicação: o botão desliza, e o texto ao lado diz o estado. */
export default function Interruptor({ ligado, onAlternar, rotulo }: { ligado: boolean; onAlternar: () => void; rotulo: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      aria-label={rotulo}
      onClick={onAlternar}
      className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-open ease-organic ${
        ligado ? "bg-primary-600" : "bg-foreground-950/[0.15]"
      }`}
    >
      <span
        className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-open ease-organic ${
          ligado ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}
