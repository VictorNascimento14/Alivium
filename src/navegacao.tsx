import type { GrupoNav } from "@/ui";

/**
 * A navegação do app — a única coisa que a coluna lateral, a gaveta do celular
 * e a barra de baixo leem. Mexer aqui muda as três de uma vez.
 *
 * `icon` sai do conjunto `Glyph` (`src/ui/base/Glyph.tsx`).
 */
export const GRUPOS: GrupoNav[] = [
  {
    chave: "cuidado",
    rotulo: "Seu cuidado",
    itens: [
      // `exact` porque "/" é prefixo de toda rota.
      { key: "inicio", label: "Início", path: "/", icon: "home", exact: true },
      { key: "conteudos", label: "Conteúdos", path: "/conteudos", icon: "book" },
      { key: "jornadas", label: "Jornadas", path: "/jornadas", icon: "compass" },
      { key: "diario", label: "Diário", path: "/diario", icon: "pen" },
      { key: "progresso", label: "Progresso", path: "/progresso", icon: "chart" },
      { key: "salvos", label: "Salvos", path: "/salvos", icon: "heart" },
    ],
  },
];

/** Destinos da barra de baixo do celular, na ordem em que aparecem. */
export const BARRA_CELULAR = ["inicio", "conteudos", "jornadas", "diario", "progresso"];
