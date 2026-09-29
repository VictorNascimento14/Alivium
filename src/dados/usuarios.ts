import { agora, atualizar, lerEstado, novoId } from "./repositorio";
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

export interface NovoCadastro {
  nome: string;
  email: string;
  senha: string;
}

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const SENHA_MINIMA = 8;

/** Erros por campo. Vazio = pode cadastrar. */
export function validarCadastro(c: NovoCadastro): Partial<Record<keyof NovoCadastro, string>> {
  const erros: Partial<Record<keyof NovoCadastro, string>> = {};
  if (c.nome.trim().length < 2) erros.nome = "Como podemos te chamar?";
  else if (c.nome.trim().length > 80) erros.nome = "Use até 80 caracteres.";
  if (!EMAIL_VALIDO.test(normalizarEmail(c.email))) erros.email = "Confira o e-mail.";
  else if (lerEstado().usuarios.some((u) => u.email === normalizarEmail(c.email)))
    erros.email = "Já existe uma conta com este e-mail.";
  if (c.senha.length < SENHA_MINIMA) erros.senha = `Use pelo menos ${SENHA_MINIMA} caracteres.`;
  return erros;
}

/** Força da senha de 0 a 4 — orientação, não bloqueio (o bloqueio é o tamanho mínimo). */
export function forcaDaSenha(senha: string): 0 | 1 | 2 | 3 | 4 {
  if (!senha) return 0;
  let pontos = 0;
  if (senha.length >= SENHA_MINIMA) pontos++;
  if (senha.length >= 12) pontos++;
  if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) pontos++;
  if (/\d/.test(senha) && /[^A-Za-z0-9]/.test(senha)) pontos++;
  return Math.max(1, pontos) as 1 | 2 | 3 | 4;
}

/** Cria a conta (papel `pessoa`) e já abre a sessão. */
export function cadastrar(c: NovoCadastro): Resultado<Usuario> {
  const erros = validarCadastro(c);
  const primeiro = Object.values(erros)[0];
  if (primeiro) return { ok: false, erro: primeiro };
  const email = normalizarEmail(c.email);
  const usuario: Usuario = {
    id: novoId("u"),
    nome: c.nome.trim(),
    email,
    senhaHash: hashSenha(email, c.senha),
    papel: "pessoa",
    criadoEm: agora(),
  };
  atualizar((e) => ({ ...e, usuarios: [...e.usuarios, usuario], sessaoId: usuario.id }));
  return { ok: true, valor: usuario };
}

export interface EdicaoPerfil {
  nome: string;
  intencao: string;
}

export function atualizarPerfil(usuarioId: string, p: EdicaoPerfil): Resultado<null> {
  const nome = p.nome.trim();
  const intencao = p.intencao.trim();
  if (nome.length < 2 || nome.length > 80) return { ok: false, erro: "O nome precisa ter de 2 a 80 caracteres." };
  if (intencao.length > 120) return { ok: false, erro: "A intenção vai até 120 caracteres." };
  atualizar((e) => ({
    ...e,
    usuarios: e.usuarios.map((u) => (u.id === usuarioId ? { ...u, nome, intencao: intencao || undefined } : u)),
  }));
  return { ok: true, valor: null };
}

/** Tudo o que o app guarda sobre a pessoa, sem o hash da senha — direito de portabilidade (LGPD art. 18). */
export function exportarDados(usuarioId: string) {
  const e = lerEstado();
  const u = e.usuarios.find((x) => x.id === usuarioId);
  if (!u) return null;
  // Lista explícita, não "tudo menos a senha": campo sensível novo não vaza por padrão.
  const conta = { id: u.id, nome: u.nome, email: u.email, papel: u.papel, criadoEm: u.criadoEm, intencao: u.intencao };
  return {
    exportadoEm: new Date().toISOString(),
    conta,
    checkins: e.checkins.filter((c) => c.usuarioId === usuarioId),
    diario: e.diario.filter((d) => d.usuarioId === usuarioId),
    progresso: e.progresso[usuarioId] ?? null,
  };
}

/**
 * Apaga a conta e TUDO dela (check-ins, diário, progresso) e encerra a sessão.
 * A última conta de administração não pode se apagar: o app ficaria sem quem
 * cuide do conteúdo.
 */
export function apagarConta(usuarioId: string): Resultado<null> {
  const e = lerEstado();
  const u = e.usuarios.find((x) => x.id === usuarioId);
  if (!u) return { ok: false, erro: "Conta não encontrada." };
  if (u.papel === "admin" && e.usuarios.filter((x) => x.papel === "admin").length === 1) {
    return { ok: false, erro: "Esta é a única conta de administração e não pode ser apagada." };
  }
  atualizar((atual) => {
    const progresso = { ...atual.progresso };
    delete progresso[usuarioId];
    return {
      ...atual,
      usuarios: atual.usuarios.filter((x) => x.id !== usuarioId),
      checkins: atual.checkins.filter((c) => c.usuarioId !== usuarioId),
      diario: atual.diario.filter((d) => d.usuarioId !== usuarioId),
      progresso,
      sessaoId: atual.sessaoId === usuarioId ? null : atual.sessaoId,
    };
  });
  return { ok: true, valor: null };
}
