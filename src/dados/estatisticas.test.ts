import { beforeEach, describe, expect, it } from "vitest";

import { registrarCheckin } from "./checkins";
import { escreverEntrada } from "./diario";
import { resumo, ultimosDias } from "./estatisticas";
import { concluirConteudo } from "./progresso";
import { lerEstado, restaurarSementes } from "./repositorio";

describe("estatísticas", () => {
  beforeEach(() => restaurarSementes());

  it("junta dias ativos de fontes diferentes sem repetir", () => {
    registrarCheckin("u-pessoa", 3, 2, "2026-09-20");
    registrarCheckin("u-pessoa", 4, 1, "2026-09-21");
    concluirConteudo("u-pessoa", "t-ritmo");
    escreverEntrada("u-pessoa", { titulo: "", texto: "oi", humor: 3 });
    const r = resumo(lerEstado(), "u-pessoa");
    expect(r).toMatchObject({ conteudos: 1, entradas: 1, checkins: 2 });
    // 20, 21 e hoje (conteúdo + diário no mesmo dia contam uma vez).
    expect(r.diasAtivos).toHaveLength(3);
  });

  it("últimos dias: janela contínua terminando hoje, com o check-in do dia", () => {
    registrarCheckin("u-pessoa", 5, 0, "2026-09-28");
    const d = ultimosDias(lerEstado(), "u-pessoa", 3, new Date(2026, 8, 28));
    expect(d.map((x) => x.dia)).toEqual(["2026-09-26", "2026-09-27", "2026-09-28"]);
    expect(d[2].ck?.humor).toBe(5);
    expect(d[0].ck).toBeUndefined();
  });
});
