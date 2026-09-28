import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/** Envolve um `ConteudoCard` no link da leitura — o mesmo em toda tela que lista conteúdo. */
export function linkDeConteudo(id: string) {
  return (cartao: ReactNode) => (
    <Link
      to={`/conteudos/${id}`}
      className="block h-full rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
    >
      {cartao}
    </Link>
  );
}
