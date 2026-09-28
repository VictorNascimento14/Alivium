interface VerSenhaProps {
  visivel: boolean;
  onAlternar: () => void;
}

/** Olho dentro do campo de senha. Entra no `right` do `TextField`. */
export default function VerSenha({ visivel, onAlternar }: VerSenhaProps) {
  return (
    <button
      type="button"
      onClick={onAlternar}
      aria-label={visivel ? "Esconder senha" : "Mostrar senha"}
      aria-pressed={visivel}
      className="press absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-lg text-foreground-500 transition-colors hover:bg-primary-900/[0.07] hover:text-primary-800"
    >
      <i className={visivel ? "ri-eye-off-line" : "ri-eye-line"} aria-hidden="true" />
    </button>
  );
}
