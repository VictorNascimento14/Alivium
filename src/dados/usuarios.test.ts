import { beforeEach, describe, expect, it } from "vitest";

import { lerEstado, restaurarSementes } from "./repositorio";
import { sha256 } from "./sha256";
import { entrar, hashSenha, sair } from "./usuarios";

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
