import { useState } from "react";
import { Link } from "react-router-dom";

import { TONS } from "@/componentes/tons";
import { alternarPublicacaoJornada, apagarJornada } from "@/dados/catalogo";
import { useEstado } from "@/dados/repositorio";
import type { Jornada } from "@/dados/tipos";
import { Button, GlassCard, Modal, PageShell, stagger, toast } from "@/ui";
import Interruptor from "./Interruptor";

export default function AdminJornadas() {
  const estado = useEstado();
  const [apagar, setApagar] = useState<Jornada | null>(null);
  // Quantas pessoas começaram cada jornada — número agregado, sem nome.
  const iniciadas = (id: string) => Object.values(estado.progresso).filter((p) => p.jornadas[id]).length;

  return (
    <PageShell
      titulo="Jornadas"
      detalhe={`${estado.jornadas.length} no catálogo`}
      acoes={
        <Link
          to="/admin/jornadas/nova"
          className="press inline-flex items-center gap-1.5 rounded-full bg-primary-900 px-4 py-2 text-[13px] font-semibold text-primary-50 shadow-nav-active transition-colors hover:bg-primary-800"
        >
          <i className="ri-add-line" aria-hidden="true" />
          <span className="hidden sm:inline">Nova</span>
        </Link>
      }
    >
      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <div className="grid gap-3.5 md:grid-cols-2">
          {estado.jornadas.map((j, i) => (
            <GlassCard key={j.id} className="relative flex flex-col overflow-hidden p-[22px]" delay={stagger(i, 60)}>
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full blur-2xl ${TONS[j.tom].halo}`}
              />
              <div className="relative flex items-start gap-3.5">
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-[22px] ${TONS[j.tom].pastilha}`}
                >
                  <i className={j.icone} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/admin/jornadas/${j.id}`}
                    className="underline-grow text-[16px] font-bold text-foreground-950"
                  >
                    {j.titulo}
                  </Link>
                  <p className="mt-0.5 text-[12.5px] text-foreground-500">
                    {j.etapas.length} etapas · {iniciadas(j.id)} pessoa(s) começaram
                  </p>
                </div>
              </div>
              <p className="relative mt-3 flex-1 text-[13.5px] leading-relaxed text-foreground-600">{j.descricao}</p>
              <div className="relative mt-4 flex items-center justify-between gap-3 border-t border-foreground-950/[0.07] pt-4">
                <span className="flex items-center gap-2.5">
                  <Interruptor
                    ligado={j.publicada}
                    rotulo={`Publicar ${j.titulo}`}
                    onAlternar={() => {
                      alternarPublicacaoJornada(j.id);
                      toast(j.publicada ? "Voltou para rascunho" : "Publicada", j.titulo);
                    }}
                  />
                  <span
                    className={`text-[12px] font-semibold ${j.publicada ? "text-primary-700" : "text-foreground-500"}`}
                  >
                    {j.publicada ? "Publicada" : "Rascunho"}
                  </span>
                </span>
                <span className="flex gap-1">
                  <Link
                    to={`/admin/jornadas/${j.id}`}
                    aria-label={`Editar ${j.titulo}`}
                    className="press grid h-10 w-10 place-items-center rounded-full text-lg text-foreground-600 transition-colors hover:bg-primary-900/[0.07] hover:text-primary-800"
                  >
                    <i className="ri-edit-line" aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setApagar(j)}
                    aria-label={`Apagar ${j.titulo}`}
                    className="press grid h-10 w-10 cursor-pointer place-items-center rounded-full text-lg text-foreground-600 transition-colors hover:bg-red-100 hover:text-red-700"
                  >
                    <i className="ri-delete-bin-line" aria-hidden="true" />
                  </button>
                </span>
              </div>
            </GlassCard>
          ))}
        </div>

        <Modal
          aberto={apagar !== null}
          titulo="Apagar jornada?"
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
                  apagarJornada(apagar.id);
                  toast("Jornada apagada", apagar.titulo);
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
            “{apagar?.titulo}” sai do app
            {apagar && iniciadas(apagar.id)
              ? `, e ${iniciadas(apagar.id)} pessoa(s) que começaram perdem o caminho`
              : ""}
            . Para só escondê-la, volte-a para rascunho.
          </p>
        </Modal>
      </main>
    </PageShell>
  );
}
