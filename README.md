# Alivium — Alívio da Dor

Aplicação para adultos com proposta de **acolhimento, reflexão, cuidado e esperança**. Funciona em
celular, tablet e computador, com o sistema visual **vidro-orgânico**: verde profundo, vidro fosco,
pílulas, coluna lateral que desdobra e micro-interações em toda parte.

> Este repositório é o **front-end**. Não existe backend na v1: os dados vivem no navegador, atrás de
> uma camada (`src/dados/`) pensada para ser trocada por uma API depois.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
```

Contas de demonstração (senha `alivium123`) — também há atalhos na tela de entrar:

| Conta | E-mail | O que vê |
|---|---|---|
| Pessoa | `pessoa@exemplo.com` | a experiência de cuidado |
| Administração | `admin@alivium.app` | + a área administrativa |

Ou crie a sua em **Criar conta**.

## O que tem

| Área | Rota | O que faz |
|---|---|---|
| Entrar / Cadastro | `/entrar`, `/cadastro` | login local, medidor de força da senha, consentimento |
| Início | `/` | saudação pelo nome, intenção, check-in de humor e dor, jornada para continuar, sugestões para o dia |
| Conteúdos | `/conteudos` | 6 categorias, busca sem acento, filtro por tipo |
| Leitura | `/conteudos/:id` | progresso de leitura, concluir, salvar, guia animado de respiração |
| Jornadas | `/jornadas`, `/jornadas/:id` | caminhos passo a passo, próximo passo em destaque |
| Diário | `/diario` | reflexões com humor, sugestões para começar, editar e apagar |
| Progresso | `/progresso` | indicadores, humor de 14 dias, calendário dos dias de cuidado |
| Salvos | `/salvos` | conteúdos guardados |
| Perfil | `/perfil` | nome, intenção, tema, baixar e apagar os próprios dados |
| Administração | `/admin/*` | painel agregado, categorias, conteúdos (editor com prévia) e jornadas |

## Checks

```bash
npm run lint && npm run type-check && npm test && npm run build
```

O CI roda os quatro em todo PR e exige o link da nota do cofre no corpo do PR.

## Estrutura

```
src/ui/          sistema visual vidro-orgânico (fundação, primitivos, casca)
src/dados/       domínio, sementes, repositório local e regras — o único lugar que toca o localStorage
src/sessao/      sessão, guardas de rota, layout logado
src/componentes/ peças usadas por mais de uma tela
src/paginas/     telas, uma pasta por área
```

Regras para quem mexe no código (pessoas e agentes): [`CLAUDE.md`](CLAUDE.md).

## Documentação

O cofre Obsidian do projeto é
[VictorNascimento14/Obsidian-alivium](https://github.com/VictorNascimento14/Obsidian-alivium) —
decisões (ADRs), uma nota por PR, aprendizados e o changelog.

> O Alivium não substitui atendimento profissional. Em sofrimento intenso, ligue **188** (CVV, 24h,
> gratuito) ou **192** (SAMU).
