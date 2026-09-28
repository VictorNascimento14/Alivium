// O vocabulário do domínio. Definições no glossário do cofre
// (`00 - Índice/glossario.md`): conteúdo, categoria, jornada, etapa, check-in,
// diário, progresso.
//
// Datas de calendário são `AAAA-MM-DD` locais (`diaISO`), nunca `toISOString()`
// — este corta no fuso UTC e joga o check-in das 22h para o dia seguinte.
// Instantes (quando algo aconteceu) são ISO completos.

export type Papel = "pessoa" | "admin";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  /** SHA-256 de `email + senha`. Não é segurança — ver ADR-001 no cofre. */
  senhaHash: string;
  papel: Papel;
  criadoEm: string;
  /** Uma frase que a pessoa escolheu para se lembrar — aparece no Início. */
  intencao?: string;
}

/** Tons de categoria e jornada. A interface traduz cada um em classes literais do Tailwind. */
export type Tom = "verde" | "menta" | "ambar" | "coral" | "lavanda" | "ceu";

export interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  /** Classe do Remix Icon (`ri-…-line`). */
  icone: string;
  tom: Tom;
}

export type TipoConteudo = "leitura" | "reflexao" | "pratica" | "respiracao";

export interface Conteudo {
  id: string;
  categoriaId: string;
  titulo: string;
  resumo: string;
  /** Parágrafos. Linha que começa com "• " vira item de lista na leitura. */
  corpo: string[];
  tipo: TipoConteudo;
  minutos: number;
  publicado: boolean;
  criadoEm: string;
}

export interface Etapa {
  id: string;
  titulo: string;
  /** A pequena ação proposta para o dia. */
  proposta: string;
  conteudoId?: string;
}

export interface Jornada {
  id: string;
  titulo: string;
  descricao: string;
  tom: Tom;
  icone: string;
  etapas: Etapa[];
  publicada: boolean;
  criadoEm: string;
}

/** Humor de 1 (muito difícil) a 5 (bem). */
export type Humor = 1 | 2 | 3 | 4 | 5;

export interface CheckIn {
  id: string;
  usuarioId: string;
  /** `AAAA-MM-DD` local. Um por dia: registrar de novo substitui. */
  dia: string;
  humor: Humor;
  /** Dor de 0 (nenhuma) a 10 (a pior imaginável). */
  dor: number;
  criadoEm: string;
}

export interface EntradaDiario {
  id: string;
  usuarioId: string;
  titulo: string;
  texto: string;
  humor: Humor;
  criadoEm: string;
}

export interface Progresso {
  /** conteudoId → instante em que foi concluído. */
  conteudos: Record<string, string>;
  /** `${jornadaId}/${etapaId}` → instante. */
  etapas: Record<string, string>;
  /** jornadaId → instante em que começou. */
  jornadas: Record<string, string>;
  /** Ids de conteúdos salvos, do mais recente ao mais antigo. */
  salvos: string[];
}

export interface Estado {
  versao: 1;
  usuarios: Usuario[];
  categorias: Categoria[];
  conteudos: Conteudo[];
  jornadas: Jornada[];
  checkins: CheckIn[];
  diario: EntradaDiario[];
  /** usuarioId → progresso. */
  progresso: Record<string, Progresso>;
  /** Quem está na sessão neste navegador. */
  sessaoId: string | null;
}

export const HUMORES: { valor: Humor; rotulo: string; emoji: string }[] = [
  { valor: 1, rotulo: "Muito difícil", emoji: "😣" },
  { valor: 2, rotulo: "Difícil", emoji: "😔" },
  { valor: 3, rotulo: "Mais ou menos", emoji: "😐" },
  { valor: 4, rotulo: "Bem", emoji: "🙂" },
  { valor: 5, rotulo: "Muito bem", emoji: "😊" },
];

export const TIPOS: Record<TipoConteudo, { rotulo: string; icone: string }> = {
  leitura: { rotulo: "Leitura", icone: "ri-book-open-line" },
  reflexao: { rotulo: "Reflexão", icone: "ri-lightbulb-flash-line" },
  pratica: { rotulo: "Prática", icone: "ri-hand-heart-line" },
  respiracao: { rotulo: "Respiração", icone: "ri-windy-line" },
};
