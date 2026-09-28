import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ToastHost } from "@/ui";
import Cadastro from "./paginas/autenticacao/Cadastro";
import Entrar from "./paginas/autenticacao/Entrar";
import Biblioteca from "./paginas/conteudos/Biblioteca";
import Inicio from "./paginas/inicio/Inicio";
import { ExigeSessao, SomenteVisitante } from "./sessao/Guardas";
import LayoutLogado from "./sessao/LayoutLogado";

/**
 * Duas famílias de rota:
 * - sem sessão (entrar, cadastro): fora da coluna, com `SomenteVisitante`;
 * - com sessão: filhas do `LayoutLogado`, que monta a coluna UMA vez.
 *
 * `element` em JSX (`<Inicio />`), nunca a referência (`Inicio`) — a segunda
 * forma compila e quebra só em runtime.
 */
const router = createBrowserRouter([
  {
    path: "/entrar",
    element: (
      <SomenteVisitante>
        <Entrar />
      </SomenteVisitante>
    ),
  },
  {
    path: "/cadastro",
    element: (
      <SomenteVisitante>
        <Cadastro />
      </SomenteVisitante>
    ),
  },
  {
    element: (
      <ExigeSessao>
        <LayoutLogado />
      </ExigeSessao>
    ),
    children: [
      { path: "/", element: <Inicio /> },
      { path: "/conteudos", element: <Biblioteca /> },
    ],
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastHost />
    </>
  );
}
