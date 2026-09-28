import { beforeEach, describe, expect, it } from "vitest";

import { concluirConteudo, desfazerConclusao } from "./progresso";
import { lerEstado, progressoDe, restaurarSementes } from "./repositorio";

describe("progresso de conteúdo", () => {
  beforeEach(() => restaurarSementes());

  it("concluir guarda o instante e é idempotente", () => {
    concluirConteudo("u-pessoa", "t-5-4-3-2-1");
    const primeiro = progressoDe(lerEstado(), "u-pessoa").conteudos["t-5-4-3-2-1"];
    concluirConteudo("u-pessoa", "t-5-4-3-2-1");
    expect(progressoDe(lerEstado(), "u-pessoa").conteudos["t-5-4-3-2-1"]).toBe(primeiro);
  });

  it("desfazer remove só aquele conteúdo e não toca em outra pessoa", () => {
    concluirConteudo("u-pessoa", "a");
    concluirConteudo("u-pessoa", "b");
    concluirConteudo("u-admin", "a");
    desfazerConclusao("u-pessoa", "a");
    expect(Object.keys(progressoDe(lerEstado(), "u-pessoa").conteudos)).toEqual(["b"]);
    expect(progressoDe(lerEstado(), "u-admin").conteudos.a).toBeDefined();
  });
});
