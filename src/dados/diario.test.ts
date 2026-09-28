import { beforeEach, describe, expect, it } from "vitest";

import { apagarEntrada, editarEntrada, entradasDe, escreverEntrada, validarEntrada } from "./diario";
import { lerEstado, restaurarSementes } from "./repositorio";

describe("diário", () => {
  beforeEach(() => restaurarSementes());

  it("escreve com título padrão e texto aparado", () => {
    const d = escreverEntrada("u-pessoa", { titulo: "  ", texto: "  hoje foi longo  ", humor: 3 });
    expect(d).toMatchObject({ titulo: "Sem título", texto: "hoje foi longo" });
    expect(entradasDe(lerEstado(), "u-pessoa")).toHaveLength(1);
  });

  it("recusa texto vazio", () => {
    expect(validarEntrada({ titulo: "", texto: "   ", humor: 3 })).toBe("Escreva ao menos uma linha.");
    expect(() => escreverEntrada("u-pessoa", { titulo: "", texto: "", humor: 3 })).toThrow();
  });

  it("uma pessoa não edita nem apaga a entrada de outra", () => {
    const d = escreverEntrada("u-pessoa", { titulo: "A", texto: "minha", humor: 4 });
    editarEntrada("u-admin", d.id, { titulo: "X", texto: "invadido", humor: 1 });
    apagarEntrada("u-admin", d.id);
    expect(entradasDe(lerEstado(), "u-pessoa")[0]).toMatchObject({ titulo: "A", texto: "minha" });
    editarEntrada("u-pessoa", d.id, { titulo: "B", texto: "editada", humor: 5 });
    expect(entradasDe(lerEstado(), "u-pessoa")[0].texto).toBe("editada");
    apagarEntrada("u-pessoa", d.id);
    expect(entradasDe(lerEstado(), "u-pessoa")).toEqual([]);
  });
});
