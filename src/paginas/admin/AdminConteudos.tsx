import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { paraBusca } from "@/componentes/texto";
import { TONS } from "@/componentes/tons";
import { alternarPublicacao, apagarConteudo } from "@/dados/catalogo";
import { useEstado } from "@/dados/repositorio";
import { TIPOS } from "@/dados/tipos";
import type { Conteudo } from "@/dados/tipos";
import { Button, GlassCard, GlassPill, Modal, PageShell, stagger, toast } from "@/ui";
import Interruptor from "./Interruptor";

type Situacao = "todos" | "publicados" | "rascunhos";

export default function AdminConteudos() {
  const estado = useEstado();
  const [q, setQ] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [situacao, setSituacao] = useState<Situacao>("todos");
  const [apagar, setApagar] = useState<Conteudo | null>(null);

  const lista = useMemo(() => {
    const termo = paraBusca(q);
    return estado.conteudos.filter(
      (c) =>
        (!categoriaId || c.categoriaId === categoriaId) &&
        (situacao === "todos" || (situacao === "publicados") === c.publicado) &&
        (!termo || paraBusca(c.titulo).includes(termo)),
    );
  }, [estado.conteudos, q, categoriaId, situacao]);

  return (
    <PageShell
      titulo="Conteúdos"
      detalhe={`${estado.conteudos.length} no catálogo`}
      acoes={
        <Link
          to="/admin/conteudos/novo"
          className="press inline-flex items-center gap-1.5 rounded-full bg-primary-900 px-4 py-2 text-[13px] font-semibold text-primary-50 shadow-nav-active transition-colors hover:bg-primary-800"
        >
          <i className="ri-add-line" aria-hidden="true" />
          <span className="hidden sm:inline">Novo</span>
        </Link>
      }
    >
      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <div className="flex flex-col gap-3 md:flex-row">
          <GlassPill className="flex-1 px-[18px] py-2.5 focus-within:ring-2 focus-within:ring-primary-600">
            <i className="ri-search-line text-foreground-500" aria-hidden="true" />
            <input
              aria-label="Buscar por título"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por título"
              className="w-full bg-transparent text-sm text-foreground-900 outline-none placeholder:text-foreground-400"
            />
          </GlassPill>
          <GlassPill className="px-[18px] py-2.5 focus-within:ring-2 focus-within:ring-primary-600 md:w-56">
            <select
              aria-label="Categoria"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full cursor-pointer bg-transparent text-sm font-medium text-foreground-800 outline-none"
            >
              <option value="">Todas as categorias</option>
              {estado.categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </GlassPill>
          <div className="glass-pill flex p-1" role="radiogroup" aria-label="Situação">
            {(["todos", "publicados", "rascunhos"] as Situacao[]).map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={situacao === s}
                onClick={() => setSituacao(s)}
                className={`press flex-1 cursor-pointer rounded-full px-3.5 py-2 text-[12.5px] font-semibold capitalize transition-colors duration-200 ${
                  situacao === s ? "bg-primary-900 text-primary-50" : "text-foreground-600 hover:text-primary-800"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3.5 flex flex-col gap-2.5">
          {lista.length === 0 && (
            <GlassCard className="p-8 text-center text-[14px] text-foreground-600">Nenhum conteúdo com esses filtros.</GlassCard>
          )}
          {lista.map((c, i) => {
            const cat = estado.categorias.find((k) => k.id === c.categoriaId);
            return (
              <GlassCard key={c.id} className="flex items-center gap-4 p-[16px] pl-[20px]" delay={stagger(i, 30)}>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/admin/conteudos/${c.id}`}
                    className="underline-grow truncate text-[15px] font-bold text-foreground-950"
                  >
                    {c.titulo}
                  </Link>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-foreground-500">
                    {cat && (
                      <span className={`rounded-full px-2 py-0.5 font-semibold ${TONS[cat.tom].pastilha}`}>{cat.nome}</span>
                    )}
                    <span>{TIPOS[c.tipo].rotulo}</span>
                    <span aria-hidden="true">·</span>
                    <span>{c.minutos} min</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2.5">
                  <span className={`hidden w-20 text-right text-[12px] font-semibold sm:inline ${c.publicado ? "text-primary-700" : "text-foreground-500"}`}>
                    {c.publicado ? "Publicado" : "Rascunho"}
                  </span>
                  <Interruptor
                    ligado={c.publicado}
                    rotulo={`Publicar ${c.titulo}`}
                    onAlternar={() => {
                      alternarPublicacao(c.id);
                      toast(c.publicado ? "Voltou para rascunho" : "Publicado", c.titulo);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setApagar(c)}
                    aria-label={`Apagar ${c.titulo}`}
                    className="press grid h-10 w-10 cursor-pointer place-items-center rounded-full text-lg text-foreground-600 transition-colors hover:bg-red-100 hover:text-red-700"
                  >
                    <i className="ri-delete-bin-line" aria-hidden="true" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <Modal
          aberto={apagar !== null}
          titulo="Apagar conteúdo?"
          onFechar={() => setApagar(null)}
          rodape={
            <>
              <Button variant="ghost" onClick={() => setApagar(null)}>
                Manter
              </Button>
              <button
                type="button"
                onClick={() => {
                  if (!apagar) return;
                  apagarConteudo(apagar.id);
                  toast("Conteúdo apagado", apagar.titulo);
                  setApagar(null);
                }}
                className="press inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700"
              >
                Apagar
              </button>
            </>
          }
        >
          <p className="text-[14px] leading-relaxed text-foreground-600">
            “{apagar?.titulo}” sai da biblioteca. Etapas de jornada que apontavam para ele continuam, só sem o link.
            Se quiser apenas escondê-lo, volte-o para rascunho.
          </p>
        </Modal>
      </main>
    </PageShell>
  );
}
