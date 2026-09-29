import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AvisoApoio from "@/componentes/AvisoApoio";
import ConteudoCard from "@/componentes/ConteudoCard";
import CorpoDoConteudo from "@/componentes/CorpoDoConteudo";
import GuiaDeRespiracao from "@/componentes/GuiaDeRespiracao";
import { linkDeConteudo } from "@/componentes/linkDeConteudo";
import { TONS } from "@/componentes/tons";
import { alternarSalvo, concluirConteudo, desfazerConclusao } from "@/dados/progresso";
import { progressoDe, useEstado } from "@/dados/repositorio";
import { TIPOS } from "@/dados/tipos";
import { useSessao } from "@/sessao/useSessao";
import { Button, GlassCard, PageShell, Reveal, stagger, toast } from "@/ui";

/** Quanto da página já passou, de 0 a 100. */
function useProgressoDeRolagem(): number {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    function medir() {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setPct(total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 100);
    }
    medir();
    window.addEventListener("scroll", medir, { passive: true });
    window.addEventListener("resize", medir);
    return () => {
      window.removeEventListener("scroll", medir);
      window.removeEventListener("resize", medir);
    };
  }, []);
  return pct;
}

export default function Leitura() {
  const { id } = useParams();
  const estado = useEstado();
  const usuario = useSessao();
  const pct = useProgressoDeRolagem();

  const conteudo = estado.conteudos.find((c) => c.id === id && c.publicado);
  const categoria = estado.categorias.find((c) => c.id === conteudo?.categoriaId);
  const progresso = progressoDe(estado, usuario?.id);
  const concluidoEm = conteudo ? progresso.conteudos[conteudo.id] : undefined;
  const salvo = conteudo ? progresso.salvos.includes(conteudo.id) : false;

  const relacionados = useMemo(
    () =>
      estado.conteudos
        .filter((c) => c.publicado && c.categoriaId === conteudo?.categoriaId && c.id !== conteudo?.id)
        .slice(0, 3),
    [estado.conteudos, conteudo],
  );

  // Trocar de conteúdo por um relacionado começa a leitura do topo.
  useEffect(() => window.scrollTo({ top: 0 }), [id]);

  if (!conteudo || !usuario) {
    return (
      <PageShell titulo="Conteúdo">
        <main className="mx-auto w-full max-w-2xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
          <GlassCard className="flex flex-col items-center p-10 text-center">
            <p className="text-[15px] font-semibold text-foreground-900">Este conteúdo não está disponível.</p>
            <Link to="/conteudos" className="underline-grow mt-3 text-[14px] font-semibold text-primary-800">
              Voltar para os conteúdos
            </Link>
          </GlassCard>
        </main>
      </PageShell>
    );
  }

  const tipo = TIPOS[conteudo.tipo];
  const tom = TONS[categoria?.tom ?? "verde"];

  function alternarConclusao() {
    if (!conteudo || !usuario) return;
    if (concluidoEm) {
      desfazerConclusao(usuario.id, conteudo.id);
    } else {
      concluirConteudo(usuario.id, conteudo.id);
      toast("Concluído", "Mais um passo de cuidado com você.");
    }
  }

  return (
    <PageShell
      titulo={tipo.rotulo}
      detalhe={`${conteudo.minutos} min`}
      toolbar={
        <div className="px-4 pb-2 md:px-6" aria-hidden="true">
          <div className="mx-auto h-1 max-w-3xl overflow-hidden rounded-full bg-foreground-950/[0.07]">
            <div className="h-full rounded-full bg-primary-600 transition-[width] duration-150" style={{ width: `${pct}%` }} />
          </div>
        </div>
      }
    >
      <main className="mx-auto w-full max-w-3xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <Reveal>
          <Link
            to="/conteudos"
            className="press inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold text-primary-800 transition-colors hover:bg-primary-900/[0.07]"
          >
            <i className="ri-arrow-left-line" aria-hidden="true" />
            Conteúdos
          </Link>
        </Reveal>

        <GlassCard tone="medium" className="relative mt-2 overflow-hidden p-7 md:p-10" delay={stagger(0)}>
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full blur-3xl ${tom.halo}`}
          />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${tom.pastilha}`}>
                {categoria && <i className={categoria.icone} aria-hidden="true" />}
                {categoria?.nome}
              </span>
              <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground-500">
                <i className={tipo.icone} aria-hidden="true" />
                {tipo.rotulo} · {conteudo.minutos} min
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (alternarSalvo(usuario.id, conteudo.id)) toast("Salvo", "Está nos seus salvos para quando precisar.");
              }}
              aria-pressed={salvo}
              aria-label={salvo ? "Tirar dos salvos" : "Salvar"}
              className={`press grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full text-xl transition-colors duration-200 ${
                salvo ? "bg-red-100 text-red-600" : "glass-pill text-foreground-600 hover:text-red-600"
              }`}
            >
              {/* `key` troca com o estado: remonta o ícone e o `pop` toca de novo a cada toque. */}
              <i key={String(salvo)} className={`${salvo ? "ri-heart-fill" : "ri-heart-line"} animate-pop`} aria-hidden="true" />
            </button>
          </div>
          <h2 className="relative mt-4 text-[30px] font-extrabold leading-tight tracking-[-0.02em] text-foreground-950 md:text-[36px]">
            {conteudo.titulo}
          </h2>
          <p className="relative mt-3 text-[17px] leading-relaxed text-foreground-600">{conteudo.resumo}</p>

          <div className="relative mt-8">
            <CorpoDoConteudo corpo={conteudo.corpo} />
          </div>

          <div className="relative mt-10 flex flex-wrap items-center gap-3 border-t border-foreground-950/[0.08] pt-6">
            <Button variant={concluidoEm ? "secondary" : "primary"} onClick={alternarConclusao} aria-pressed={Boolean(concluidoEm)}>
              <i className={concluidoEm ? "ri-checkbox-circle-fill animate-pop" : "ri-check-line"} aria-hidden="true" />
              {concluidoEm ? "Concluído" : "Marcar como concluído"}
            </Button>
            {concluidoEm && (
              <span className="animate-fade-in text-[12.5px] text-foreground-500">
                em {new Date(concluidoEm).toLocaleDateString("pt-BR", { day: "numeric", month: "long" })} · toque de novo
                para desfazer
              </span>
            )}
          </div>
        </GlassCard>

        {conteudo.tipo === "respiracao" && (
          <div className="mt-3.5">
            <GuiaDeRespiracao />
          </div>
        )}

        <div className="mt-3.5">
          <AvisoApoio delay={stagger(1)} />
        </div>

        {relacionados.length > 0 && (
          <section className="mt-8">
            <h3 className="px-1 text-[15px] font-bold text-foreground-900">Mais em {categoria?.nome}</h3>
            <div className="mt-3 grid gap-3.5 sm:grid-cols-2">
              {relacionados.map((c, i) => (
                <ConteudoCard
                  key={c.id}
                  conteudo={c}
                  categoria={categoria}
                  concluido={Boolean(progresso.conteudos[c.id])}
                  delay={stagger(i, 60)}
                  envolver={linkDeConteudo(c.id)}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </PageShell>
  );
}
