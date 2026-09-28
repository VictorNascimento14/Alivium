import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { sair } from "@/dados/usuarios";
import { RailLayout, toast } from "@/ui";
import type { Conta } from "@/ui";
import { BARRA_CELULAR, GRUPOS } from "../navegacao";
import { useSessao } from "./useSessao";

/**
 * A coluna das telas logadas, montada UMA vez. `conta` e `onSair` são
 * memorizados: o `RailLayout` recalcula o contexto quando eles mudam, e uma
 * referência nova a cada render refaria o contexto de todas as telas.
 */
export default function LayoutLogado() {
  const usuario = useSessao();
  const navegar = useNavigate();

  const conta = useMemo<Conta | undefined>(
    () =>
      usuario
        ? { nome: usuario.nome, papel: usuario.papel === "admin" ? "Administração" : "Cuidando de si" }
        : undefined,
    [usuario],
  );

  const onSair = useCallback(() => {
    sair();
    navegar("/entrar", { replace: true });
    toast("Até logo", "Volte quando quiser. Este espaço continua aqui.");
  }, [navegar]);

  return <RailLayout grupos={GRUPOS} barraCelular={BARRA_CELULAR} conta={conta} onSair={onSair} />;
}
