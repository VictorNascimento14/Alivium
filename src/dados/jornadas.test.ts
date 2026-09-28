import { beforeEach, describe, expect, it } from "vitest";

import { alternarEtapa, andamento, iniciarJornada } from "./jornadas";
import { lerEstado, progressoDe, restaurarSementes } from "./repositorio";
import { JORNADAS } from "./sementes";

const j = JORNADAS.find((x) => x.id === "j-noites")!;
const and = () => andamento(progressoDe(lerEstado(), "u-pessoa"), j);

describe("jornadas", () => {
  beforeEach(() => restaurarSementes());

  it("começa sem nada e aponta a primeira etapa", () => {
    expect(and()).toMatchObject({ feitas: 0, total: 4, pct: 0, iniciada: false, concluida: false });
    expect(and().proxima?.id).toBe("e1");
  });

  it("iniciar marca como iniciada sem concluir etapa", () => {
    iniciarJornada("u-pessoa", j.id);
    expect(and()).toMatchObject({ iniciada: true, feitas: 0 });
  });

  it("a próxima é a primeira não feita, mesmo fora de ordem", () => {
    alternarEtapa("u-pessoa", j.id, "e2");
    expect(and()).toMatchObject({ feitas: 1, pct: 25, iniciada: true });
    expect(and().proxima?.id).toBe("e1");
  });

  it("todas feitas = concluída; desmarcar volta", () => {
    for (const e of j.etapas) alternarEtapa("u-pessoa", j.id, e.id);
    expect(and()).toMatchObject({ concluida: true, pct: 100, proxima: undefined });
    expect(alternarEtapa("u-pessoa", j.id, "e4")).toBe(false);
    expect(and().concluida).toBe(false);
  });
});
