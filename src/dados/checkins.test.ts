import { beforeEach, describe, expect, it } from "vitest";

import { checkinDoDia, checkinsDe, registrarCheckin } from "./checkins";
import { lerEstado, restaurarSementes } from "./repositorio";

describe("check-in", () => {
  beforeEach(() => restaurarSementes());

  it("um por dia: registrar de novo substitui", () => {
    registrarCheckin("u-pessoa", 2, 7, "2026-09-28");
    registrarCheckin("u-pessoa", 4, 3, "2026-09-28");
    expect(lerEstado().checkins).toHaveLength(1);
    expect(checkinDoDia(lerEstado(), "u-pessoa", "2026-09-28")).toMatchObject({ humor: 4, dor: 3 });
  });

  it("não mistura pessoas nem dias, e ordena do mais recente", () => {
    registrarCheckin("u-pessoa", 3, 5, "2026-09-27");
    registrarCheckin("u-pessoa", 4, 2, "2026-09-28");
    registrarCheckin("u-admin", 5, 0, "2026-09-28");
    expect(checkinsDe(lerEstado(), "u-pessoa").map((c) => c.dia)).toEqual(["2026-09-28", "2026-09-27"]);
  });

  it("prende a dor em 0–10 e recusa humor fora da escala", () => {
    expect(registrarCheckin("u-pessoa", 3, 42, "2026-09-28").dor).toBe(10);
    // @ts-expect-error — humor 9 não existe; a validação de runtime é a regra.
    expect(() => registrarCheckin("u-pessoa", 9, 1)).toThrow();
  });
});
