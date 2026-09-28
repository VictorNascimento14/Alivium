import { useMemo } from "react";

import { useEstado } from "@/dados/repositorio";
import type { Usuario } from "@/dados/tipos";

/** Quem está na sessão neste navegador, ou `null`. */
export function useSessao(): Usuario | null {
  const estado = useEstado();
  return useMemo(
    () => estado.usuarios.find((u) => u.id === estado.sessaoId) ?? null,
    [estado.usuarios, estado.sessaoId],
  );
}
