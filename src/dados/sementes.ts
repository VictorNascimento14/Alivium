import type { Categoria, Conteudo, Estado, Jornada, Usuario } from "./tipos";

// O conteúdo com que o app nasce num navegador novo. A área administrativa edita
// a partir daqui; apagar os dados do navegador volta a este ponto.
//
// Tom: acolhedor, sem promessa de cura, sem culpa. Nada aqui substitui
// atendimento profissional — o aviso de apoio fica visível nas telas.

const CRIADO = "2026-09-28T12:00:00.000Z";

/**
 * Contas de demonstração (senha `alivium123`), para a v1 ser explorável sem
 * cadastro. Nomes e e-mails são os exemplos estáveis do cofre.
 */
export const USUARIOS_DEMO: Usuario[] = [
  {
    id: "u-admin",
    nome: "Admin Exemplo",
    email: "admin@alivium.app",
    senhaHash: "7f704de6719e40fc1811f9a9de1849027a78dacb941320f933563af815ad9198",
    papel: "admin",
    criadoEm: CRIADO,
  },
  {
    id: "u-pessoa",
    nome: "Pessoa Exemplo",
    email: "pessoa@exemplo.com",
    senhaHash: "771f90591660ece02ab244616abd7c129e5eb08d20a89679d1fc3574df45f0f0",
    papel: "pessoa",
    criadoEm: CRIADO,
    intencao: "Um dia de cada vez.",
  },
];

export const CATEGORIAS: Categoria[] = [
  {
    id: "c-corpo",
    nome: "Dor e corpo",
    descricao: "Conviver com a dor física com mais gentileza e menos luta.",
    icone: "ri-body-scan-line",
    tom: "coral",
  },
  {
    id: "c-ansiedade",
    nome: "Ansiedade",
    descricao: "Quando a mente acelera, voltar para o agora.",
    icone: "ri-windy-line",
    tom: "ceu",
  },
  {
    id: "c-sono",
    nome: "Sono e descanso",
    descricao: "Preparar o corpo e a mente para descansar.",
    icone: "ri-moon-clear-line",
    tom: "lavanda",
  },
  {
    id: "c-luto",
    nome: "Luto e perdas",
    descricao: "Dar lugar à saudade sem se perder nela.",
    icone: "ri-seedling-line",
    tom: "menta",
  },
  {
    id: "c-autocuidado",
    nome: "Autocuidado",
    descricao: "Pequenos gestos que dizem: eu também importo.",
    icone: "ri-hand-heart-line",
    tom: "verde",
  },
  {
    id: "c-esperanca",
    nome: "Esperança",
    descricao: "Lembrar que o que dói hoje não é tudo o que existe.",
    icone: "ri-sun-line",
    tom: "ambar",
  },
];

const c = (
  id: string,
  categoriaId: string,
  tipo: Conteudo["tipo"],
  minutos: number,
  titulo: string,
  resumo: string,
  corpo: string[],
): Conteudo => ({ id, categoriaId, tipo, minutos, titulo, resumo, corpo, publicado: true, criadoEm: CRIADO });

export const CONTEUDOS: Conteudo[] = [
  c("t-dor-nao-e-voce", "c-corpo", "leitura", 4, "Você não é a sua dor",
    "A dor ocupa espaço, mas não define quem você é.",
    [
      "Quem convive com dor por muito tempo às vezes começa a se enxergar só por ela. Os planos passam a ser medidos pelo que a dor permite, e a conversa interna gira em torno do que não dá mais para fazer.",
      "É compreensível. A dor pede atenção — é esse o trabalho dela. Mas existe uma diferença entre sentir dor e ser a dor.",
      "Experimente notar, ao longo do dia, os momentos em que outra coisa também estava presente: um cheiro bom, uma conversa, um trecho de música. A dor pode ter estado lá, e ainda assim não era a única coisa.",
      "Esses momentos não apagam o sofrimento. Eles lembram que você continua sendo alguém inteiro, com gostos, histórias e vínculos — alguém que sente dor, e não alguém feito dela.",
    ]),
  c("t-varredura", "c-corpo", "pratica", 8, "Varredura corporal gentil",
    "Percorrer o corpo com atenção, sem tentar consertar nada.",
    [
      "Encontre uma posição possível — sentada, deitada, do jeito que o corpo aceitar hoje. Não precisa ser a posição ideal.",
      "Leve a atenção aos pés. Apenas note: calor, frio, formigamento, nada. Não há resposta certa.",
      "Suba devagar: pernas, quadril, barriga, peito, ombros, braços, pescoço, rosto. Em cada parte, pergunte em silêncio: o que está aqui agora?",
      "Se encontrar uma região com dor, tente respirar em direção a ela, como quem faz companhia — sem exigir que ela vá embora.",
      "• Se algo ficar intenso demais, abra os olhos e volte para os pés.",
      "• Termine com três respirações lentas e agradeça ao corpo por ter chegado até aqui.",
    ]),
  c("t-ritmo", "c-corpo", "leitura", 5, "O ritmo possível",
    "Alternar atividade e pausa antes que a dor peça.",
    [
      "Em dias bons, é comum querer compensar o tempo perdido — e pagar a conta no dia seguinte. Em dias ruins, é comum parar tudo. Esse vaivém cansa.",
      "Uma alternativa é descobrir o seu ritmo possível: quanto tempo de uma atividade você consegue sustentar com a dor em um nível tolerável, e então fazer pausas antes de chegar ao limite.",
      "• Escolha uma atividade do dia (lavar a louça, caminhar, arrumar a mesa).",
      "• Faça por um tempo curto e combinado consigo, e pare mesmo que ainda dê para continuar.",
      "• Descanse alguns minutos e, se quiser, volte.",
      "Não é preguiça nem desistência: é estratégia. Converse com a equipe que cuida de você sobre como adaptar isso ao seu caso.",
    ]),
  c("t-respiracao-4-6", "c-ansiedade", "respiracao", 3, "Respiração 4–6",
    "Expirar mais longo do que inspirar acalma o corpo.",
    [
      "Quando a ansiedade chega, a respiração fica curta e alta, no peito. Alongar a expiração é um jeito simples de avisar ao corpo que ele pode desacelerar.",
      "• Inspire pelo nariz contando até 4.",
      "• Solte pela boca, devagar, contando até 6.",
      "• Repita por cerca de três minutos.",
      "Se contar incomodar, apenas deixe o ar sair mais devagar do que entrou. Se sentir tontura, volte a respirar normalmente.",
    ]),
  c("t-5-4-3-2-1", "c-ansiedade", "pratica", 4, "5-4-3-2-1: voltar para o agora",
    "Usar os sentidos como âncora quando a mente dispara.",
    [
      "A ansiedade costuma morar no futuro: e se, e se, e se. Os sentidos só funcionam no presente — por isso servem de âncora.",
      "• Nomeie 5 coisas que você vê.",
      "• 4 coisas que você pode tocar.",
      "• 3 sons que você escuta.",
      "• 2 cheiros que percebe (ou de que gosta).",
      "• 1 sabor, ou uma coisa boa sobre você.",
      "Não precisa sumir com a ansiedade. Basta abrir um pouco de espaço entre você e ela.",
    ]),
  c("t-pensamento-nao-e-fato", "c-ansiedade", "reflexao", 5, "Pensamento não é fato",
    "Olhar para o que a mente diz com um pouco de distância.",
    [
      "A mente é ótima em produzir previsões. Algumas ajudam; muitas apenas assustam.",
      "Quando surgir um pensamento difícil, experimente acrescentar na frente: \"estou tendo o pensamento de que…\". \"Vai dar tudo errado\" vira \"estou tendo o pensamento de que vai dar tudo errado\".",
      "Parece pouco, mas muda a posição: você deixa de estar dentro do pensamento e passa a observá-lo.",
      "Para refletir: que pensamento tem aparecido com mais frequência? O que você diria a alguém querido que tivesse esse mesmo pensamento?",
    ]),
  c("t-ritual-noite", "c-sono", "pratica", 6, "Um ritual para a noite",
    "Sinais repetidos ensinam o corpo que é hora de descansar.",
    [
      "O sono não obedece a ordens, mas responde a convites. Um ritual curto, repetido todas as noites, funciona como um convite.",
      "• Diminua as luzes uma hora antes de deitar.",
      "• Deixe o celular longe da cama, se possível.",
      "• Escolha algo calmo: um chá sem cafeína, uma leitura leve, um banho morno.",
      "• Na cama, faça a respiração 4–6 por alguns minutos.",
      "Se o sono não vier em cerca de vinte minutos, levante, faça algo tranquilo com pouca luz e volte quando sentir sono. Insônia persistente merece conversa com um profissional de saúde.",
    ]),
  c("t-descanso-sem-sono", "c-sono", "leitura", 3, "Descansar também vale",
    "Mesmo sem dormir, o corpo em repouso se recupera um pouco.",
    [
      "Nas noites em que o sono não vem, a cobrança costuma piorar tudo: \"eu preciso dormir\" vira mais um motivo para ficar acordado.",
      "Tente trocar a meta. Em vez de dormir, descansar: corpo apoiado, respiração lenta, olhos fechados. Isso já tem valor.",
      "Tirar o peso de ter que dormir, às vezes, é justamente o que abre espaço para o sono chegar.",
    ]),
  c("t-luto-nao-tem-prazo", "c-luto", "leitura", 5, "O luto não tem prazo",
    "Não existe jeito certo nem tempo certo de sentir falta.",
    [
      "O luto não acontece só quando alguém morre. Perder a saúde de antes, um trabalho, uma relação ou uma versão de si também dói.",
      "Não existe uma ordem correta de fases nem um prazo para \"superar\". Há dias em que a saudade parece mais leve, e outros em que volta inteira — e isso não significa que você regrediu.",
      "O que costuma ajudar é dar lugar ao que se sente: falar sobre quem ou o que se perdeu, guardar lembranças, chorar quando vier.",
      "Se a dor da perda estiver impedindo você de viver por muito tempo, procurar apoio profissional é um gesto de cuidado, não de fraqueza.",
    ]),
  c("t-carta", "c-luto", "reflexao", 10, "Uma carta que não precisa ser enviada",
    "Escrever para o que se perdeu, sem destinatário.",
    [
      "Pegue papel, ou abra o diário do app. Escreva uma carta para a pessoa, a fase ou a parte de você que se foi.",
      "Algumas perguntas para começar, se ajudar:",
      "• O que eu gostaria de ter dito?",
      "• Do que eu sinto mais falta?",
      "• O que eu levo comigo daqui para frente?",
      "Ninguém vai ler. Não há erro de português, não há frase feia. Quando terminar, respire fundo e faça algo gentil por você.",
    ]),
  c("t-gestos-pequenos", "c-autocuidado", "leitura", 3, "Autocuidado cabe em pouco",
    "Nem todo cuidado precisa de tempo, dinheiro ou energia.",
    [
      "Autocuidado virou sinônimo de rotinas longas e produtos caros. Em dias difíceis, isso vira mais uma cobrança.",
      "Às vezes, cuidar de si é beber um copo de água. Abrir a janela. Trocar de roupa. Mandar mensagem para alguém querido. Dizer \"não\" a um compromisso.",
      "Escolha um gesto pequeno para hoje. Um só. Ele conta.",
    ]),
  c("t-autocompaixao", "c-autocuidado", "pratica", 5, "Falar consigo como com um amigo",
    "Uma pausa de autocompaixão em três passos.",
    [
      "Quando estiver num momento difícil, experimente esta pausa curta. Pode colocar a mão no peito, se for confortável.",
      "• Reconheça: \"este é um momento de sofrimento\".",
      "• Lembre: \"sofrer faz parte da vida de todo mundo; eu não estou só nisso\".",
      "• Ofereça: \"que eu possa ser gentil comigo agora\".",
      "Se as palavras soarem estranhas, troque por outras que façam sentido para você. O que importa é o tom: o mesmo que você usaria com alguém que ama.",
    ]),
  c("t-tres-coisas", "c-esperanca", "pratica", 3, "Três coisas boas",
    "Treinar o olhar para o que também existe.",
    [
      "Antes de dormir, anote três coisas boas do dia — por menores que sejam. Um café quente. Uma mensagem. Um momento sem dor.",
      "Não é fingir que está tudo bem. É equilibrar a balança: a mente guarda com facilidade o que deu errado, e precisa de ajuda para guardar o resto.",
      "Com o tempo, esse registro vira um arquivo de lembretes para os dias mais pesados.",
    ]),
  c("t-dias-diferentes", "c-esperanca", "reflexao", 4, "Nem todo dia será assim",
    "Lembrar-se de outros dias quando este estiver pesado.",
    [
      "Em dias muito difíceis, parece que sempre foi e sempre será assim. É uma sensação real — mas não é uma previsão confiável.",
      "Pense em um momento, recente ou distante, em que você se sentiu um pouco melhor. O que estava acontecendo? Quem estava por perto?",
      "Esse dia existiu. Outros assim podem existir de novo. Esperança, aqui, não é certeza — é deixar uma porta entreaberta.",
    ]),
];

const e = (id: string, titulo: string, proposta: string, conteudoId?: string) => ({ id, titulo, proposta, conteudoId });

export const JORNADAS: Jornada[] = [
  {
    id: "j-respiro",
    titulo: "7 dias de respiro",
    descricao: "Uma semana de pequenas pausas para acalmar o corpo e a mente.",
    tom: "ceu",
    icone: "ri-windy-line",
    publicada: true,
    criadoEm: CRIADO,
    etapas: [
      e("e1", "Primeira pausa", "Faça a respiração 4–6 por três minutos, em qualquer momento do dia.", "t-respiracao-4-6"),
      e("e2", "Voltar para o agora", "Use o 5-4-3-2-1 quando perceber a mente acelerada.", "t-5-4-3-2-1"),
      e("e3", "Olhar para os pensamentos", "Pratique o \"estou tendo o pensamento de que…\" com um pensamento difícil.", "t-pensamento-nao-e-fato"),
      e("e4", "O corpo inteiro", "Faça uma varredura corporal gentil antes de dormir.", "t-varredura"),
      e("e5", "Um gesto pequeno", "Escolha um gesto de autocuidado e faça.", "t-gestos-pequenos"),
      e("e6", "Falar com gentileza", "Faça a pausa de autocompaixão num momento difícil.", "t-autocompaixao"),
      e("e7", "Três coisas boas", "Anote três coisas boas do dia no diário.", "t-tres-coisas"),
    ],
  },
  {
    id: "j-conviver-dor",
    titulo: "Conviver com a dor",
    descricao: "Cinco passos para uma relação menos brigada com a dor do dia a dia.",
    tom: "coral",
    icone: "ri-body-scan-line",
    publicada: true,
    criadoEm: CRIADO,
    etapas: [
      e("e1", "Você é mais que a dor", "Note três momentos do dia em que outra coisa também estava presente.", "t-dor-nao-e-voce"),
      e("e2", "Escutar o corpo", "Faça a varredura corporal gentil.", "t-varredura"),
      e("e3", "O ritmo possível", "Escolha uma atividade e pare antes do limite.", "t-ritmo"),
      e("e4", "Descansar sem culpa", "Tire dez minutos de descanso sem precisar merecer.", "t-descanso-sem-sono"),
      e("e5", "Registrar o caminho", "Faça o check-in do dia e escreva uma linha no diário sobre como foi a semana."),
    ],
  },
  {
    id: "j-noites",
    titulo: "Noites mais tranquilas",
    descricao: "Construir, aos poucos, um convite para o descanso.",
    tom: "lavanda",
    icone: "ri-moon-clear-line",
    publicada: true,
    criadoEm: CRIADO,
    etapas: [
      e("e1", "Montar o ritual", "Escolha dois gestos do ritual da noite e repita hoje.", "t-ritual-noite"),
      e("e2", "Tirar o peso", "Se o sono não vier, troque a meta: descansar.", "t-descanso-sem-sono"),
      e("e3", "Respirar para dormir", "Faça a respiração 4–6 já deitado(a).", "t-respiracao-4-6"),
      e("e4", "Fechar o dia", "Anote três coisas boas antes de apagar a luz.", "t-tres-coisas"),
    ],
  },
  {
    id: "j-saudade",
    titulo: "Dar lugar à saudade",
    descricao: "Um percurso delicado para quem está atravessando uma perda.",
    tom: "menta",
    icone: "ri-seedling-line",
    publicada: true,
    criadoEm: CRIADO,
    etapas: [
      e("e1", "Sem prazo", "Leia com calma e perceba o que ressoa.", "t-luto-nao-tem-prazo"),
      e("e2", "Escrever a carta", "Escreva uma carta que não precisa ser enviada.", "t-carta"),
      e("e3", "Ser gentil consigo", "Faça a pausa de autocompaixão.", "t-autocompaixao"),
      e("e4", "Uma porta entreaberta", "Lembre de um dia em que se sentiu um pouco melhor.", "t-dias-diferentes"),
    ],
  },
];

/** O estado de um navegador que nunca abriu o app. */
export function estadoInicial(): Estado {
  return {
    versao: 1,
    usuarios: USUARIOS_DEMO,
    categorias: CATEGORIAS,
    conteudos: CONTEUDOS,
    jornadas: JORNADAS,
    checkins: [],
    diario: [],
    progresso: {},
    sessaoId: null,
  };
}
