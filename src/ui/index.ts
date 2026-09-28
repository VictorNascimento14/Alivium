// Barril do sistema visual. `import { GlassCard, PageShell } from "@/ui"`.
// Importar do arquivo direto também funciona — e é o que o próprio kit faz,
// para um componente nunca arrastar o resto do sistema junto.

// Fundação
export { EASE_ORGANIC, DUR_OPEN, DUR_CLOSE, stagger, usePrefersReducedMotion } from "./lib/motion";
export { SLUG, NOME, MONOGRAMA } from "./lib/marca";
export { diaISO } from "./lib/data";
export {
  aplicarTema,
  definirTema,
  observarSistema,
  sistemaEscuro,
  temaEfetivo,
  temaEscolhido,
  CHAVE_TEMA,
  type Tema,
} from "./lib/tema";
export {
  isSidebarCollapsed,
  setSidebarCollapsed,
  setRailPeek,
  isRailPeeking,
  useSidebarCollapsed,
  useRailPeek,
  sidebarMdClass,
  RAIL_WIDTH_COLLAPSED,
  RAIL_WIDTH_OPEN,
} from "./lib/sidebarCollapsed";
export { toast, assinarToasts, type Toast } from "./lib/toast";
export { useInView } from "./hooks/useInView";
