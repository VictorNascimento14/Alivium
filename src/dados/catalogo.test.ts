import { beforeEach, describe, expect, it } from "vitest";

import { apagarCategoria, salvarCategoria } from "./catalogo";
import { lerEstado, restaurarSementes } from "./repositorio";

const nova = { nome: "Movimento", descricao: "Corpo em movimento gentil.", icone: "ri-run-line", tom: "verde" as const };

describe("categorias", () => {
  beforeEach(() => restaurarSementes());

  it("cria, edita e recusa nome repetido", () => {
    const r = salvarCategoria(nova);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(salvarCategoria({ ...nova, nome: "movimento" }).ok).toBe(false);
    expect(salvarCategoria({ ...nova, nome: "Movimento leve" }, r.id).ok).toBe(true);
    expect(lerEstado().categorias.find((c) => c.id === r.id)?.nome).toBe("Movimento leve");
    // Editar mantendo o próprio nome não conta como repetido.
    expect(salvarCategoria({ ...nova, nome: "Movimento leve" }, r.id).ok).toBe(true);
  });

  it("valida nome e ícone", () => {
    expect(salvarCategoria({ ...nova, nome: "a" }).ok).toBe(false);
    expect(salvarCategoria({ ...nova, icone: "<script>" }).ok).toBe(false);
  });

  it("não apaga categoria com conteúdo; apaga a vazia", () => {
    expect(apagarCategoria("c-corpo").ok).toBe(false);
    const r = salvarCategoria(nova);
    if (!r.ok) throw new Error();
    expect(apagarCategoria(r.id).ok).toBe(true);
    expect(lerEstado().categorias.some((c) => c.id === r.id)).toBe(false);
  });
});
