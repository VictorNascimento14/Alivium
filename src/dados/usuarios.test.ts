import { beforeEach, describe, expect, it } from "vitest";

import { lerEstado, restaurarSementes } from "./repositorio";
import { sha256 } from "./sha256";
import { registrarCheckin } from "./checkins";
import {
  apagarConta,
  atualizarPerfil,
  cadastrar,
  entrar,
  exportarDados,
  forcaDaSenha,
  hashSenha,
  sair,
  validarCadastro,
} from "./usuarios";

describe("sha256", () => {
  it("bate com os vetores conhecidos", () => {
    expect(sha256("")).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    expect(sha256("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
    // Mais de um bloco de 64 bytes, e acento (UTF-8 multibyte).
    expect(sha256("á".repeat(40))).toHaveLength(64);
  });

  it("gera o hash das contas de demonstração", () => {
    expect(hashSenha("admin@alivium.app", "alivium123")).toBe(
      "7f704de6719e40fc1811f9a9de1849027a78dacb941320f933563af815ad9198",
    );
  });
});

describe("entrar e sair", () => {
  beforeEach(() => restaurarSementes());

  it("entra com a conta de demonstração, ignorando caixa e espaços no e-mail", () => {
    const r = entrar("  Pessoa@Exemplo.com ", "alivium123");
    expect(r.ok).toBe(true);
    expect(lerEstado().sessaoId).toBe("u-pessoa");
  });

  it("recusa senha errada sem dizer se o e-mail existe", () => {
    const errada = entrar("pessoa@exemplo.com", "x");
    const inexistente = entrar("ninguem@exemplo.com", "x");
    expect(errada).toEqual(inexistente);
    expect(lerEstado().sessaoId).toBeNull();
  });

  it("sair limpa a sessão", () => {
    entrar("pessoa@exemplo.com", "alivium123");
    sair();
    expect(lerEstado().sessaoId).toBeNull();
  });
});

describe("cadastrar", () => {
  beforeEach(() => restaurarSementes());

  it("cria a conta como pessoa e abre a sessão", () => {
    const r = cadastrar({ nome: " Maria ", email: "Maria@Exemplo.com", senha: "umasenha1" });
    expect(r.ok).toBe(true);
    const u = lerEstado().usuarios.at(-1)!;
    expect(u).toMatchObject({ nome: "Maria", email: "maria@exemplo.com", papel: "pessoa" });
    expect(lerEstado().sessaoId).toBe(u.id);
    // E a senha nova funciona para entrar de novo.
    sair();
    expect(entrar("maria@exemplo.com", "umasenha1").ok).toBe(true);
  });

  it("recusa e-mail repetido, senha curta e nome vazio", () => {
    expect(validarCadastro({ nome: "", email: "pessoa@exemplo.com", senha: "123" })).toEqual({
      nome: "Como podemos te chamar?",
      email: "Já existe uma conta com este e-mail.",
      senha: "Use pelo menos 8 caracteres.",
    });
    expect(cadastrar({ nome: "X", email: "x", senha: "1" }).ok).toBe(false);
  });

  it("mede a força da senha", () => {
    expect(forcaDaSenha("")).toBe(0);
    expect(forcaDaSenha("abc")).toBe(1);
    expect(forcaDaSenha("Abcdefgh1!xyz")).toBe(4);
  });
});

describe("perfil e privacidade", () => {
  beforeEach(() => restaurarSementes());

  it("atualiza nome e intenção; intenção vazia some", () => {
    expect(atualizarPerfil("u-pessoa", { nome: " Ana ", intencao: "" }).ok).toBe(true);
    const u = lerEstado().usuarios.find((x) => x.id === "u-pessoa")!;
    expect(u.nome).toBe("Ana");
    expect(u.intencao).toBeUndefined();
    expect(atualizarPerfil("u-pessoa", { nome: "A", intencao: "" }).ok).toBe(false);
  });

  it("exporta sem o hash da senha", () => {
    registrarCheckin("u-pessoa", 3, 1, "2026-09-28");
    const d = exportarDados("u-pessoa")!;
    expect(JSON.stringify(d)).not.toContain("senhaHash");
    expect(d.checkins).toHaveLength(1);
  });

  it("apagar leva junto tudo da pessoa e encerra a sessão", () => {
    entrar("pessoa@exemplo.com", "alivium123");
    registrarCheckin("u-pessoa", 3, 1, "2026-09-28");
    registrarCheckin("u-admin", 3, 1, "2026-09-28");
    expect(apagarConta("u-pessoa").ok).toBe(true);
    const e = lerEstado();
    expect(e.usuarios.some((u) => u.id === "u-pessoa")).toBe(false);
    expect(e.checkins.map((c) => c.usuarioId)).toEqual(["u-admin"]);
    expect(e.sessaoId).toBeNull();
  });

  it("a última administração não se apaga", () => {
    expect(apagarConta("u-admin").ok).toBe(false);
  });
});
