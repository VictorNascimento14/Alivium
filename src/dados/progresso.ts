import { agora, atualizar, progressoDe } from "./repositorio";
import type { Estado, Progresso } from "./tipos";

/** Aplica `fn` ao progresso de uma pessoa, criando-o se ainda não existir. */
function mexer(usuarioId: string, fn: (p: Progresso) => Progresso) {
  atualizar((e: Estado) => ({ ...e, progresso: { ...e.progresso, [usuarioId]: fn(progressoDe(e, usuarioId)) } }));
}

export function concluirConteudo(usuarioId: string, conteudoId: string): void {
  mexer(usuarioId, (p) =>
    p.conteudos[conteudoId] ? p : { ...p, conteudos: { ...p.conteudos, [conteudoId]: agora() } },
  );
}

export function desfazerConclusao(usuarioId: string, conteudoId: string): void {
  mexer(usuarioId, (p) => {
    const conteudos = { ...p.conteudos };
    delete conteudos[conteudoId];
    return { ...p, conteudos };
  });
}
