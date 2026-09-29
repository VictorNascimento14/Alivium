import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { salvarJornada } from "@/dados/catalogo";
import type { DadosJornada } from "@/dados/catalogo";
import { lerEstado, useEstado } from "@/dados/repositorio";
import type { Etapa } from "@/dados/tipos";
import { Button, GlassCard, GlassPill, PageShell, TextField, stagger, toast } from "@/ui";
import { SeletorIcone, SeletorTom } from "./Seletores";

const NOVA: DadosJornada = {
  titulo: "",
  descricao: "",
  tom: "verde",
  icone: "ri-leaf-line",
  etapas: [],
  publicada: false,
};

// Chave de React para etapa ainda sem id (nova): estável enquanto a tela vive.
let proximaChave = 0;
type EtapaEditavel = Etapa & { chave: string };
const comChave = (e: Etapa): EtapaEditavel => ({ ...e, chave: e.id || `nova-${proximaChave++}` });

export default function EditorJornada() {
  const { id } = useParams();
  const navegar = useNavigate();
  const conteudos = useEstado().conteudos;
  const [original] = useState(() => lerEstado().jornadas.find((j) => j.id === id));
  const [d, setD] = useState<DadosJornada>(() =>
    original
      ? {
          titulo: original.titulo,
          descricao: original.descricao,
          tom: original.tom,
          icone: original.icone,
          etapas: [],
          publicada: original.publicada,
        }
      : NOVA,
  );
  const [etapas, setEtapas] = useState<EtapaEditavel[]>(() =>
    (original?.etapas ?? [{ id: "", titulo: "", proposta: "" }]).map(comChave),
  );
  const [erro, setErro] = useState<string | null>(null);

  if (id !== "nova" && !original) {
    return (
      <PageShell titulo="Jornada">
        <main className="mx-auto w-full max-w-2xl px-4 pb-28 pt-2 md:px-6">
          <GlassCard className="p-10 text-center text-[14px] text-foreground-600">
            Jornada não encontrada.{" "}
            <Link to="/admin/jornadas" className="underline-grow font-semibold text-primary-800">
              Voltar
            </Link>
          </GlassCard>
        </main>
      </PageShell>
    );
  }

  const mudarEtapa = (i: number, parcial: Partial<Etapa>) =>
    setEtapas((es) => es.map((e, j) => (j === i ? { ...e, ...parcial } : e)));

  function mover(i: number, delta: -1 | 1) {
    setEtapas((es) => {
      const alvo = i + delta;
      if (alvo < 0 || alvo >= es.length) return es;
      const copia = [...es];
      [copia[i], copia[alvo]] = [copia[alvo], copia[i]];
      return copia;
    });
  }

  function salvar(e: FormEvent) {
    e.preventDefault();
    const r = salvarJornada(
      {
        ...d,
        etapas: etapas.map((e) => ({ id: e.id, titulo: e.titulo, proposta: e.proposta, conteudoId: e.conteudoId })),
      },
      original?.id,
    );
    if (!r.ok) return setErro(r.erro);
    toast(original ? "Jornada atualizada" : "Jornada criada", d.titulo.trim());
    navegar("/admin/jornadas");
  }

  const base =
    "press grid h-9 w-9 cursor-pointer place-items-center rounded-full text-base text-foreground-600 transition-colors disabled:cursor-not-allowed disabled:opacity-30";
  const botaoIcone = `${base} hover:bg-primary-900/[0.07] hover:text-primary-800`;

  return (
    <PageShell titulo={original ? "Editar jornada" : "Nova jornada"}>
      <main className="mx-auto w-full max-w-4xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <Link
          to="/admin/jornadas"
          className="press inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold text-primary-800 transition-colors hover:bg-primary-900/[0.07]"
        >
          <i className="ri-arrow-left-line" aria-hidden="true" />
          Jornadas
        </Link>

        <form onSubmit={salvar} noValidate className="mt-2 flex flex-col gap-3.5">
          <GlassCard tone="medium" className="grid gap-4 p-[26px] md:grid-cols-2" delay={stagger(0)}>
            <div className="flex flex-col gap-4">
              <TextField
                label="Título"
                maxLength={60}
                value={d.titulo}
                onChange={(e) => setD({ ...d, titulo: e.target.value })}
              />
              <TextField
                label="Descrição"
                maxLength={160}
                value={d.descricao}
                onChange={(e) => setD({ ...d, descricao: e.target.value })}
              />
              <label className="glass-inset flex cursor-pointer items-center gap-3 rounded-[18px] p-3.5">
                <input
                  type="checkbox"
                  checked={d.publicada}
                  onChange={(e) => setD({ ...d, publicada: e.target.checked })}
                  className="h-[18px] w-[18px] cursor-pointer accent-primary-700"
                />
                <span className="text-[13.5px] text-foreground-700">
                  <strong className="font-semibold text-foreground-900">Publicar</strong> — aparece em Jornadas
                </span>
              </label>
            </div>
            <div className="flex flex-col gap-4">
              <SeletorTom valor={d.tom} onChange={(tom) => setD({ ...d, tom })} />
              <SeletorIcone valor={d.icone} tom={d.tom} onChange={(icone) => setD({ ...d, icone })} />
            </div>
          </GlassCard>

          <h2 className="mt-3 px-1 text-[15px] font-bold text-foreground-900">Etapas</h2>
          <ol className="flex flex-col gap-3">
            {etapas.map((etapa, i) => (
              <li key={etapa.chave} className="animate-fade-up">
                <GlassCard className="flex gap-3.5 p-[18px]">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-100 text-[14px] font-bold text-primary-800">
                    {i + 1}
                  </span>
                  <div className="grid min-w-0 flex-1 gap-3 md:grid-cols-2">
                    <TextField
                      label="Título"
                      maxLength={60}
                      value={etapa.titulo}
                      onChange={(e) => mudarEtapa(i, { titulo: e.target.value })}
                    />
                    <div>
                      <label
                        htmlFor={`cont-${etapa.chave}`}
                        className="mb-1.5 block text-sm font-medium text-foreground-700"
                      >
                        Conteúdo de apoio
                      </label>
                      <GlassPill className="w-full px-[18px] py-3 focus-within:ring-2 focus-within:ring-primary-600">
                        <select
                          id={`cont-${etapa.chave}`}
                          value={etapa.conteudoId ?? ""}
                          onChange={(e) => mudarEtapa(i, { conteudoId: e.target.value || undefined })}
                          className="w-full cursor-pointer bg-transparent text-sm font-medium text-foreground-800 outline-none"
                        >
                          <option value="">Nenhum</option>
                          {conteudos.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.titulo}
                              {c.publicado ? "" : " (rascunho)"}
                            </option>
                          ))}
                        </select>
                      </GlassPill>
                    </div>
                    <TextField
                      className="md:col-span-2"
                      label="Proposta do dia"
                      maxLength={200}
                      value={etapa.proposta}
                      onChange={(e) => mudarEtapa(i, { proposta: e.target.value })}
                    />
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <button
                      type="button"
                      className={botaoIcone}
                      disabled={i === 0}
                      onClick={() => mover(i, -1)}
                      aria-label={`Subir etapa ${i + 1}`}
                    >
                      <i className="ri-arrow-up-line" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={botaoIcone}
                      disabled={i === etapas.length - 1}
                      onClick={() => mover(i, 1)}
                      aria-label={`Descer etapa ${i + 1}`}
                    >
                      <i className="ri-arrow-down-line" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={`${base} hover:bg-red-100 hover:text-red-700`}
                      disabled={etapas.length === 1}
                      onClick={() => setEtapas((es) => es.filter((_, j) => j !== i))}
                      aria-label={`Remover etapa ${i + 1}`}
                    >
                      <i className="ri-close-line" aria-hidden="true" />
                    </button>
                  </div>
                </GlassCard>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => setEtapas((es) => [...es, comChave({ id: "", titulo: "", proposta: "" })])}
            className="press flex cursor-pointer items-center justify-center gap-2 rounded-card border-2 border-dashed border-foreground-950/[0.12] p-4 text-[14px] font-semibold text-primary-800 transition-colors hover:border-primary-600 hover:bg-primary-900/[0.04]"
          >
            <i className="ri-add-line" aria-hidden="true" />
            Adicionar etapa
          </button>

          {erro && (
            <p role="alert" className="animate-fade-up px-1 text-[13px] text-red-600">
              {erro}
            </p>
          )}
          <div className="flex gap-2.5">
            <Button type="submit">Salvar jornada</Button>
            <Button variant="ghost" onClick={() => navegar("/admin/jornadas")}>
              Cancelar
            </Button>
          </div>
        </form>
      </main>
    </PageShell>
  );
}
