import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ToastHost } from "@/ui";
import PainelAdmin from "./paginas/admin/PainelAdmin";
import Cadastro from "./paginas/autenticacao/Cadastro";
import Entrar from "./paginas/autenticacao/Entrar";
import Biblioteca from "./paginas/conteudos/Biblioteca";
import Leitura from "./paginas/conteudos/Leitura";
import Salvos from "./paginas/conteudos/Salvos";
import Diario from "./paginas/diario/Diario";
import Inicio from "./paginas/inicio/Inicio";
import JornadaDetalhe from "./paginas/jornadas/JornadaDetalhe";
import Jornadas from "./paginas/jornadas/Jornadas";
import Perfil from "./paginas/perfil/Perfil";
import Progresso from "./paginas/progresso/Progresso";
import { ExigeSessao, RotaAdmin, SomenteVisitante } from "./sessao/Guardas";
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
      { path: "/conteudos/:id", element: <Leitura /> },
      { path: "/salvos", element: <Salvos /> },
      { path: "/jornadas", element: <Jornadas /> },
      { path: "/jornadas/:id", element: <JornadaDetalhe /> },
      { path: "/diario", element: <Diario /> },
      { path: "/progresso", element: <Progresso /> },
      { path: "/perfil", element: <Perfil /> },
      {
        // Área administrativa: mesma coluna, guarda de papel por cima.
        path: "/admin",
        element: <RotaAdmin />,
        children: [{ index: true, element: <PainelAdmin /> }],
      },
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
