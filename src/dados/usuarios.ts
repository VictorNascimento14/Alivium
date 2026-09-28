import { atualizar, lerEstado } from "./repositorio";
import { sha256 } from "./sha256";
import type { Usuario } from "./tipos";

// Contas e sessão. A validação daqui é a regra; a da tela é conforto.

export type Resultado<T> = { ok: true; valor: T } | { ok: false; erro: string };

export const normalizarEmail = (email: string) => email.trim().toLowerCase();

export function hashSenha(email: string, senha: string): string {
  return sha256(normalizarEmail(email) + senha);
}

export function entrar(email: string, senha: string): Resultado<Usuario> {
  const alvo = normalizarEmail(email);
  if (!alvo || !senha) return { ok: false, erro: "Preencha e-mail e senha." };
  const usuario = lerEstado().usuarios.find((u) => u.email === alvo);
  // Mesma mensagem para e-mail inexistente e senha errada: não revela quem tem conta.
  if (!usuario || usuario.senhaHash !== hashSenha(alvo, senha)) {
    return { ok: false, erro: "E-mail ou senha não conferem." };
  }
  atualizar((e) => ({ ...e, sessaoId: usuario.id }));
  return { ok: true, valor: usuario };
}

export function sair(): void {
  atualizar((e) => ({ ...e, sessaoId: null }));
}
