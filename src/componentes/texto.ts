/** Minúsculas e sem acento — "respiração" acha "respiracao" e vice-versa. */
export function paraBusca(s: string): string {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}
