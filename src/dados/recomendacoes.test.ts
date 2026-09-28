import { beforeEach, describe, expect, it } from "vitest";

import { registrarCheckin } from "./checkins";
import { alternarEtapa } from "./jornadas";
import { concluirConteudo } from "./progresso";
import { jornadaParaContinuar, recomendarConteudos } from "./recomendacoes";
import { lerEstado, restaurarSementes } from "./repositorio";

describe("recomendações", () => {
  beforeEach(() => restaurarSementes());

  it("não recomenda o que já foi concluído", () => {
    const primeiro = recomendarConteudos(lerEstado(), "u-pessoa")[0];
    concluirConteudo("u-pessoa", primeiro.id);
    expect(recomendarConteudos(lerEstado(), "u-pessoa").map((c) => c.id)).not.toContain(primeiro.id);
  });

  it("num dia difícil, práticas e respirações curtas vêm primeiro", () => {
    registrarCheckin("u-pessoa", 1, 8, "2026-09-28");
    const r = recomendarConteudos(lerEstado(), "u-pessoa", 3, "2026-09-28");
    expect(r.every((c) => c.tipo === "respiracao" || c.tipo === "pratica")).toBe(true);
    expect(r[0].minutos).toBeLessThanOrEqual(r[1].minutos);
  });

  it("continuar aponta a jornada em andamento, não a concluída", () => {
    expect(jornadaParaContinuar(lerEstado(), "u-pessoa")).toBeUndefined();
    alternarEtapa("u-pessoa", "j-saudade", "e1");
    expect(jornadaParaContinuar(lerEstado(), "u-pessoa")?.id).toBe("j-saudade");
  });
});
