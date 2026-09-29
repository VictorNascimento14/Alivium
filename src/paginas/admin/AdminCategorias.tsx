import { useState } from "react";

import { TONS } from "@/componentes/tons";
import { apagarCategoria, salvarCategoria } from "@/dados/catalogo";
import type { DadosCategoria } from "@/dados/catalogo";
import { useEstado } from "@/dados/repositorio";
import type { Categoria } from "@/dados/tipos";
import { Button, GlassCard, Modal, PageShell, TextField, stagger, toast } from "@/ui";
import { SeletorIcone, SeletorTom } from "./Seletores";

const VAZIA: DadosCategoria = { nome: "", descricao: "", icone: "ri-leaf-line", tom: "verde" };

export default function AdminCategorias() {
  const estado = useEstado();
  // `null` = modal fechado; `{ id: undefined }` = criando; `{ id }` = editando.
  const [edicao, setEdicao] = useState<{ id?: string; dados: DadosCategoria } | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [apagar, setApagar] = useState<Categoria | null>(null);

  const total = (id: string) => estado.conteudos.filter((c) => c.categoriaId === id).length;

  function abrir(c?: Categoria) {
    setErro(null);
    setEdicao(c ? { id: c.id, dados: { nome: c.nome, descricao: c.descricao, icone: c.icone, tom: c.tom } } : { dados: VAZIA });
  }

  function salvar() {
    if (!edicao) return;
    const r = salvarCategoria(edicao.dados, edicao.id);
    if (!r.ok) return setErro(r.erro);
    toast(edicao.id ? "Categoria atualizada" : "Categoria criada", edicao.dados.nome.trim());
    setEdicao(null);
  }

  const d = edicao?.dados;
  const mudar = (parcial: Partial<DadosCategoria>) => edicao && setEdicao({ ...edicao, dados: { ...edicao.dados, ...parcial } });

  return (
    <PageShell
      titulo="Categorias"
      detalhe={`${estado.categorias.length} no catálogo`}
      acoes={
        <Button onClick={() => abrir()} className="!px-4 !py-2">
          <i className="ri-add-line" aria-hidden="true" />
          <span className="hidden sm:inline">Nova</span>
        </Button>
      }
    >
      <main className="mx-auto w-full max-w-4xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <div className="flex flex-col gap-3">
          {estado.categorias.map((c, i) => (
            <GlassCard key={c.id} className="flex items-center gap-4 p-[18px]" delay={stagger(i, 50)}>
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-[22px] ${TONS[c.tom].pastilha}`}>
                <i className={c.icone} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-foreground-950">{c.nome}</p>
                <p className="truncate text-[13px] text-foreground-600">{c.descricao || "Sem descrição"}</p>
              </div>
              <span className="hidden shrink-0 rounded-full bg-foreground-950/[0.05] px-3 py-1 text-[12px] font-semibold text-foreground-700 sm:inline">
                {total(c.id)} conteúdo(s)
              </span>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => abrir(c)}
                  aria-label={`Editar ${c.nome}`}
                  className="press grid h-10 w-10 cursor-pointer place-items-center rounded-full text-lg text-foreground-600 transition-colors hover:bg-primary-900/[0.07] hover:text-primary-800"
                >
                  <i className="ri-edit-line" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setApagar(c)}
                  aria-label={`Apagar ${c.nome}`}
                  className="press grid h-10 w-10 cursor-pointer place-items-center rounded-full text-lg text-foreground-600 transition-colors hover:bg-red-100 hover:text-red-700"
                >
                  <i className="ri-delete-bin-line" aria-hidden="true" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>

        <Modal
          aberto={edicao !== null}
          titulo={edicao?.id ? "Editar categoria" : "Nova categoria"}
          onFechar={() => setEdicao(null)}
          rodape={
            <>
              <Button variant="ghost" onClick={() => setEdicao(null)}>
                Cancelar
              </Button>
              <Button onClick={salvar}>Salvar</Button>
            </>
          }
        >
          {d && (
            <div className="flex flex-col gap-4">
              <div className="glass-inset flex items-center gap-3 rounded-[18px] p-3.5">
                <span className={`grid h-11 w-11 place-items-center rounded-full text-xl ${TONS[d.tom].pastilha}`}>
                  <i key={d.icone} className={`${d.icone} animate-pop`} aria-hidden="true" />
                </span>
                <span className="text-[14px] font-semibold text-foreground-900">{d.nome || "Prévia da categoria"}</span>
              </div>
              <TextField label="Nome" maxLength={40} value={d.nome} onChange={(e) => mudar({ nome: e.target.value })} />
              <TextField
                label="Descrição"
                maxLength={140}
                hint="Uma frase que explique a categoria."
                value={d.descricao}
                onChange={(e) => mudar({ descricao: e.target.value })}
              />
              <SeletorTom valor={d.tom} onChange={(tom) => mudar({ tom })} />
              <SeletorIcone valor={d.icone} tom={d.tom} onChange={(icone) => mudar({ icone })} />
              {erro && (
                <p role="alert" className="animate-fade-up text-xs text-red-600">
                  {erro}
                </p>
              )}
            </div>
          )}
        </Modal>

        <Modal
          aberto={apagar !== null}
          titulo="Apagar categoria?"
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
                  const r = apagarCategoria(apagar.id);
                  if (r.ok) toast("Categoria apagada", apagar.nome);
                  else toast("Não foi possível apagar", r.erro);
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
            “{apagar?.nome}” sai do catálogo. Categorias com conteúdo não podem ser apagadas — mova os conteúdos
            antes.
          </p>
        </Modal>
      </main>
    </PageShell>
  );
}
