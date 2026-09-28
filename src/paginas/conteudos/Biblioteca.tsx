import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import ConteudoCard from "@/componentes/ConteudoCard";
import { paraBusca } from "@/componentes/texto";
import { progressoDe, useEstado } from "@/dados/repositorio";
import { TIPOS } from "@/dados/tipos";
import type { TipoConteudo } from "@/dados/tipos";
import { useSessao } from "@/sessao/useSessao";
import { GlassCard, GlassPill, PageShell, Reveal, stagger } from "@/ui";

/**
 * Filtros moram na URL (`?categoria=…&tipo=…&q=…`): voltar do conteúdo devolve
 * a lista como estava, e o link filtrado pode ser compartilhado.
 */
export default function Biblioteca() {
  const estado = useEstado();
  const usuario = useSessao();
  const [params, setParams] = useSearchParams();
  const categoriaId = params.get("categoria") ?? "";
  const tipo = (params.get("tipo") ?? "") as TipoConteudo | "";
  const q = params.get("q") ?? "";

  const concluidos = progressoDe(estado, usuario?.id).conteudos;

  const publicados = useMemo(() => estado.conteudos.filter((c) => c.publicado), [estado.conteudos]);

  const visiveis = useMemo(() => {
    const termo = paraBusca(q);
    return publicados.filter(
      (c) =>
        (!categoriaId || c.categoriaId === categoriaId) &&
        (!tipo || c.tipo === tipo) &&
        (!termo || paraBusca(`${c.titulo} ${c.resumo}`).includes(termo)),
    );
  }, [publicados, categoriaId, tipo, q]);

  function filtrar(chave: string, valor: string) {
    setParams(
      (atual) => {
        const p = new URLSearchParams(atual);
        if (valor) p.set(chave, valor);
        else p.delete(chave);
        return p;
      },
      { replace: true },
    );
  }

  const contagem = (id: string) => publicados.filter((c) => c.categoriaId === id).length;

  const chip = (id: string, rotulo: string, icone: string, n: number) => {
    const ativo = categoriaId === id;
    return (
      <button
        key={id || "todas"}
        type="button"
        onClick={() => filtrar("categoria", id)}
        aria-pressed={ativo}
        className={`press inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition-colors duration-200 ${
          ativo
            ? "bg-primary-900 text-primary-50 shadow-nav-active"
            : "glass-pill text-foreground-700 hover:text-primary-800"
        }`}
      >
        <i className={icone} aria-hidden="true" />
        {rotulo}
        <span className={`text-[11px] font-medium ${ativo ? "text-primary-100" : "text-foreground-500"}`}>{n}</span>
      </button>
    );
  };

  return (
    <PageShell
      titulo="Conteúdos"
      detalhe={`${publicados.length} para explorar`}
      toolbar={
        <div className="scrollbar-hide flex gap-2 overflow-x-auto px-4 pb-3 pt-1 md:px-6">
          {chip("", "Todas", "ri-apps-2-line", publicados.length)}
          {estado.categorias.map((c) => chip(c.id, c.nome, c.icone, contagem(c.id)))}
        </div>
      }
    >
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <GlassPill className="flex-1 px-[18px] py-2.5 focus-within:ring-2 focus-within:ring-primary-600">
            <i className="ri-search-line text-base text-foreground-500" aria-hidden="true" />
            <label htmlFor="busca" className="sr-only">
              Buscar conteúdos
            </label>
            <input
              id="busca"
              type="search"
              value={q}
              onChange={(e) => filtrar("q", e.target.value)}
              placeholder="Buscar por título ou assunto"
              className="w-full bg-transparent text-sm text-foreground-900 outline-none placeholder:text-foreground-400"
            />
          </GlassPill>
          <GlassPill className="px-[18px] py-2.5 focus-within:ring-2 focus-within:ring-primary-600 sm:w-56">
            <label htmlFor="tipo" className="sr-only">
              Tipo
            </label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => filtrar("tipo", e.target.value)}
              className="w-full cursor-pointer bg-transparent text-sm font-medium text-foreground-800 outline-none"
            >
              <option value="">Todos os tipos</option>
              {Object.entries(TIPOS).map(([valor, t]) => (
                <option key={valor} value={valor}>
                  {t.rotulo}
                </option>
              ))}
            </select>
          </GlassPill>
        </Reveal>

        {visiveis.length === 0 ? (
          <GlassCard className="mt-3.5 flex flex-col items-center p-10 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-primary-50 text-2xl text-primary-700">
              <i className="ri-search-eye-line" aria-hidden="true" />
            </span>
            <p className="mt-4 text-[15px] font-semibold text-foreground-900">Nada por aqui com esses filtros.</p>
            <p className="mt-1 text-[13px] text-foreground-500">Tente outra palavra ou volte para todas as categorias.</p>
          </GlassCard>
        ) : (
          <div className="mt-3.5 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
            {visiveis.map((c, i) => (
              <ConteudoCard
                key={c.id}
                conteudo={c}
                categoria={estado.categorias.find((k) => k.id === c.categoriaId)}
                concluido={Boolean(concluidos[c.id])}
                delay={stagger(i, 60)}
              />
            ))}
          </div>
        )}
      </main>
    </PageShell>
  );
}
