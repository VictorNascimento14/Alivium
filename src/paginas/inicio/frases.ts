// Frases do dia. Curtas, sem promessa, sem "gratidão obrigatória".
export const FRASES = [
  "Você não precisa dar conta de tudo hoje. Só do próximo passo.",
  "Descansar também é seguir em frente.",
  "O que dói hoje não é tudo o que você é.",
  "Pequenos cuidados também contam — principalmente eles.",
  "Está tudo bem ir devagar.",
  "Pedir ajuda é um gesto de coragem.",
  "Nem todo dia será assim.",
  "Respire. Este momento também vai passar.",
  "Você chegou até aqui. Isso já diz muito.",
  "Seja com você a companhia que você seria para alguém querido.",
  "Hoje, basta o possível.",
  "Esperança pode ser só deixar a porta entreaberta.",
];

/** A mesma frase o dia inteiro, outra amanhã. */
export function fraseDoDia(d = new Date()): string {
  const inicioDoAno = new Date(d.getFullYear(), 0, 0);
  const dia = Math.floor((d.getTime() - inicioDoAno.getTime()) / 86_400_000);
  return FRASES[dia % FRASES.length];
}

export function saudacao(d = new Date()): string {
  const h = d.getHours();
  if (h >= 5 && h < 12) return "Bom dia";
  if (h >= 12 && h < 18) return "Boa tarde";
  return "Boa noite";
}
