import type { Tom } from "@/dados/tipos";

/**
 * Tons de categoria e jornada em classes LITERAIS — o Tailwind só gera classe
 * que aparece escrita no fonte. Verde, menta, âmbar e coral saem das rampas do
 * sistema (acompanham o tema sozinhas); lavanda e céu usam a paleta padrão do
 * Tailwind, então levam `dark:` explícito.
 */
export const TONS: Record<Tom, { pastilha: string; halo: string; barra: string }> = {
  verde: { pastilha: "bg-primary-100 text-primary-800", halo: "bg-primary-300/35", barra: "bg-primary-600" },
  menta: { pastilha: "bg-secondary-100 text-secondary-800", halo: "bg-secondary-300/40", barra: "bg-secondary-600" },
  ambar: { pastilha: "bg-orange-100 text-orange-700", halo: "bg-orange-300/35", barra: "bg-orange-500" },
  coral: { pastilha: "bg-red-100 text-red-700", halo: "bg-red-300/30", barra: "bg-red-500" },
  lavanda: {
    pastilha: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
    halo: "bg-violet-300/30 dark:bg-violet-500/20",
    barra: "bg-violet-500",
  },
  ceu: {
    pastilha: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
    halo: "bg-sky-300/30 dark:bg-sky-500/20",
    barra: "bg-sky-500",
  },
};
