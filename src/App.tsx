import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { RailLayout, ToastHost } from "@/ui";
import { BARRA_CELULAR, CONTA, GRUPOS } from "./navegacao";
import Inicio from "./paginas/inicio/Inicio";

/**
 * Toda tela com coluna lateral é filha da rota do `RailLayout`: ele monta a
 * coluna UMA vez e passa navegação, conta e "sair" às telas pelo contexto.
 *
 * `element` em JSX (`<Inicio />`), nunca a referência (`Inicio`) — a segunda
 * forma compila e quebra só em runtime.
 */
const router = createBrowserRouter([
  {
    element: <RailLayout grupos={GRUPOS} barraCelular={BARRA_CELULAR} conta={CONTA} />,
    children: [{ path: "/", element: <Inicio /> }],
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
