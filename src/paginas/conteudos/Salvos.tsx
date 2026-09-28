import { Link } from "react-router-dom";

import ConteudoCard from "@/componentes/ConteudoCard";
import { linkDeConteudo } from "@/componentes/linkDeConteudo";
import { progressoDe, useEstado } from "@/dados/repositorio";
import { useSessao } from "@/sessao/useSessao";
import { GlassCard, PageShell, stagger } from "@/ui";

export default function Salvos() {
  const estado = useEstado();
  const usuario = useSessao();
  const progresso = progressoDe(estado, usuario?.id);
  // Na ordem dos salvos (mais recente primeiro); some o que foi despublicado.
  const salvos = progresso.salvos
    .map((id) => estado.conteudos.find((c) => c.id === id && c.publicado))
    .filter((c) => c !== undefined);

  return (
    <PageShell titulo="Salvos" detalhe={salvos.length === 1 ? "1 conteúdo" : `${salvos.length} conteúdos`}>
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        {salvos.length === 0 ? (
          <GlassCard className="mx-auto flex max-w-lg flex-col items-center p-10 text-center">
            <span className="animate-pop grid h-16 w-16 place-items-center rounded-full bg-red-100 text-3xl text-red-600">
              <i className="ri-heart-line" aria-hidden="true" />
            </span>
            <p className="mt-5 text-[17px] font-bold text-foreground-950">Nada salvo ainda</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-foreground-600">
              Toque no coração de um conteúdo para guardá-lo aqui — um cantinho para voltar nos dias difíceis.
            </p>
            <Link
              to="/conteudos"
              className="press mt-6 inline-flex items-center gap-2 rounded-full bg-primary-900 px-5 py-2.5 text-[14px] font-semibold text-primary-50 shadow-nav-active transition-colors hover:bg-primary-800"
            >
              Explorar conteúdos
              <i className="ri-arrow-right-line" aria-hidden="true" />
            </Link>
          </GlassCard>
        ) : (
          <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
            {salvos.map((c, i) => (
              <ConteudoCard
                key={c.id}
                conteudo={c}
                categoria={estado.categorias.find((k) => k.id === c.categoriaId)}
                concluido={Boolean(progresso.conteudos[c.id])}
                delay={stagger(i, 60)}
                envolver={linkDeConteudo(c.id)}
              />
            ))}
          </div>
        )}
      </main>
    </PageShell>
  );
}
