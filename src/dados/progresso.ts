import { agora, mexerProgresso as mexer } from "./repositorio";

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

/** Salva ou tira dos salvos. O mais recente fica no topo. Devolve se ficou salvo. */
export function alternarSalvo(usuarioId: string, conteudoId: string): boolean {
  let salvo = false;
  mexer(usuarioId, (p) => {
    salvo = !p.salvos.includes(conteudoId);
    return { ...p, salvos: salvo ? [conteudoId, ...p.salvos] : p.salvos.filter((id) => id !== conteudoId) };
  });
  return salvo;
}
