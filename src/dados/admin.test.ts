import { beforeEach, describe, expect, it } from "vitest";

import { metricas } from "./admin";
import { registrarCheckin } from "./checkins";
import { concluirConteudo } from "./progresso";
import { lerEstado, restaurarSementes } from "./repositorio";

describe("métricas da administração", () => {
  beforeEach(() => restaurarSementes());

  it("agrega sem expor pessoa: contagens, média e ranking", () => {
    registrarCheckin("u-pessoa", 2, 5, "2026-09-28");
    registrarCheckin("u-admin", 4, 1, "2026-09-27");
    registrarCheckin("u-pessoa", 5, 0, "2026-09-10"); // fora da janela de 7 dias
    concluirConteudo("u-pessoa", "t-ritmo");
    concluirConteudo("u-admin", "t-ritmo");
    concluirConteudo("u-pessoa", "t-carta");
    const m = metricas(lerEstado(), new Date(2026, 8, 28));
    expect(m).toMatchObject({ pessoas: 1, checkinsUltimos7Dias: 2, humorMedio: 3 });
    expect(m.maisConcluidos[0]).toEqual({ conteudoId: "t-ritmo", total: 2 });
    expect(JSON.stringify(m)).not.toMatch(/u-pessoa|u-admin/);
  });
});
