import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useSessao } from "./useSessao";

/**
 * Só entra com sessão. Sem ela, vai para `/entrar` levando o destino no
 * `state` — depois do login, a pessoa volta para onde queria ir.
 */
export function ExigeSessao({ children }: { children: ReactNode }) {
  const usuario = useSessao();
  const local = useLocation();
  if (!usuario) return <Navigate to="/entrar" replace state={{ de: local.pathname }} />;
  return children;
}

/**
 * Entrar e cadastro não fazem sentido com sessão aberta. É esta guarda que leva
 * a pessoa adiante depois do login: para o destino que o `ExigeSessao` guardou,
 * ou para o Início.
 */
export function SomenteVisitante({ children }: { children: ReactNode }) {
  const usuario = useSessao();
  const local = useLocation();
  const destino = (local.state as { de?: string } | null)?.de ?? "/";
  return usuario ? <Navigate to={destino} replace /> : children;
}
