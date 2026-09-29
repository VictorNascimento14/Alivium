import { useRouteError } from "react-router-dom";

import Recado from "./Recado";

/**
 * `errorElement` das rotas: um erro de render não pode virar tela em branco
 * nem o despejo técnico do router. O detalhe vai para o console, não para a tela.
 */
export default function ErroInesperado() {
  const erro = useRouteError();
  console.error(erro);
  return (
    <Recado
      emoji="🌧️"
      titulo="Algo não saiu como esperado"
      texto="Não foi nada que você fez. Seus registros continuam guardados. Tente recarregar a página."
      acoes={
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="press inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary-900 px-5 py-3 text-sm font-semibold text-primary-50 shadow-nav-active transition-colors hover:bg-primary-800"
        >
          <i className="ri-refresh-line" aria-hidden="true" />
          Recarregar
        </button>
      }
    />
  );
}
