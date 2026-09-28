import { Link, useParams } from "react-router-dom";

import AvisoApoio from "@/componentes/AvisoApoio";
import { TONS } from "@/componentes/tons";
import { alternarEtapa, andamento, chaveEtapa, iniciarJornada } from "@/dados/jornadas";
import { lerEstado, progressoDe, useEstado } from "@/dados/repositorio";
import { useSessao } from "@/sessao/useSessao";
import { AnimatedNumber, Button, GlassCard, MeterBar, PageShell, Reveal, stagger, toast } from "@/ui";

export default function JornadaDetalhe() {
  const { id } = useParams();
  const estado = useEstado();
  const usuario = useSessao();
  const jornada = estado.jornadas.find((j) => j.id === id && j.publicada);

  if (!jornada || !usuario) {
    return (
      <PageShell titulo="Jornada">
        <main className="mx-auto w-full max-w-2xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
          <GlassCard className="flex flex-col items-center p-10 text-center">
            <p className="text-[15px] font-semibold text-foreground-900">Esta jornada não está disponível.</p>
            <Link to="/jornadas" className="underline-grow mt-3 text-[14px] font-semibold text-primary-800">
              Ver jornadas
            </Link>
          </GlassCard>
        </main>
      </PageShell>
    );
  }

  const progresso = progressoDe(estado, usuario.id);
  const a = andamento(progresso, jornada);
  const tom = TONS[jornada.tom];

  function alternar(etapaId: string, titulo: string) {
    if (!jornada || !usuario) return;
    const feita = alternarEtapa(usuario.id, jornada.id, etapaId);
    if (!feita) return;
    const agora = andamento(progressoDe(lerEstado(), usuario.id), jornada);
    if (agora.concluida) toast("Jornada concluída", `Você completou “${jornada.titulo}”. Que caminho bonito.`);
    else toast("Etapa feita", `“${titulo}” — um passo de cada vez.`);
  }

  return (
    <PageShell titulo="Jornada" detalhe={`${a.feitas} de ${a.total} etapas`}>
      <main className="mx-auto w-full max-w-4xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <Reveal>
          <Link
            to="/jornadas"
            className="press inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold text-primary-800 transition-colors hover:bg-primary-900/[0.07]"
          >
            <i className="ri-arrow-left-line" aria-hidden="true" />
            Jornadas
          </Link>
        </Reveal>

        <GlassCard tone="medium" className="relative mt-2 overflow-hidden p-7 md:p-9" delay={stagger(0)}>
          <div aria-hidden="true" className={`pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full blur-3xl ${tom.halo}`} />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <span className={`grid h-14 w-14 place-items-center rounded-full text-[26px] ${tom.pastilha}`}>
                <i className={jornada.icone} aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-[30px] font-extrabold leading-tight tracking-[-0.02em] text-foreground-950">
                {jornada.titulo}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-foreground-600">{jornada.descricao}</p>
            </div>
            <div className="shrink-0 md:text-right">
              <p className="text-[44px] font-extrabold leading-none tracking-[-0.03em] text-primary-800">
                <AnimatedNumber value={a.pct} format={(n) => `${Math.round(n)}%`} />
              </p>
              <p className="mt-1 text-[12.5px] text-foreground-500">do caminho</p>
            </div>
          </div>
          <MeterBar pct={a.pct} className="relative mt-6" label={`Andamento de ${jornada.titulo}`} />
          {!a.iniciada && (
            <Button
              className="relative mt-6"
              onClick={() => {
                iniciarJornada(usuario.id, jornada.id);
                toast("Jornada iniciada", "Sem pressa. Comece pela primeira etapa quando puder.");
              }}
            >
              <i className="ri-play-circle-line" aria-hidden="true" />
              Começar jornada
            </Button>
          )}
        </GlassCard>

        {a.concluida && (
          <GlassCard className="mt-3.5 flex items-center gap-4 p-[22px]" delay={stagger(1)}>
            <span className="animate-pop text-[40px] leading-none" aria-hidden="true">
              🌱
            </span>
            <div>
              <p className="text-[16px] font-bold text-foreground-950">Você completou esta jornada.</p>
              <p className="mt-0.5 text-[13.5px] text-foreground-600">
                Pode refazer qualquer etapa quando quiser — o caminho continua aqui.
              </p>
            </div>
          </GlassCard>
        )}

        <ol className="relative mt-6">
          {/* O fio que liga as etapas. */}
          <span aria-hidden="true" className="absolute bottom-6 left-[27px] top-6 w-0.5 rounded-full bg-foreground-950/[0.08]" />
          {jornada.etapas.map((etapa, i) => {
            const feitaEm = progresso.etapas[chaveEtapa(jornada.id, etapa.id)];
            const proxima = a.proxima?.id === etapa.id;
            const conteudo = estado.conteudos.find((c) => c.id === etapa.conteudoId && c.publicado);
            return (
              <li key={etapa.id} className="relative flex gap-4 pb-3.5 last:pb-0">
                <span
                  key={feitaEm ? "feita" : "aberta"}
                  className={`animate-pop relative z-10 ml-2 mt-4 grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full text-[14px] font-bold ${
                    feitaEm
                      ? "bg-primary-700 text-primary-50"
                      : proxima
                        ? "bg-primary-100 text-primary-800 ring-2 ring-primary-600 ring-offset-2 ring-offset-background-50"
                        : "glass-pill text-foreground-600"
                  }`}
                >
                  {feitaEm ? <i className="ri-check-line text-lg" aria-hidden="true" /> : i + 1}
                </span>
                <GlassCard
                  tone={proxima ? "medium" : "soft"}
                  className={`flex-1 p-[20px] ${feitaEm ? "opacity-75" : ""}`}
                  delay={stagger(i + 1, 60)}
                >
                  {proxima && (
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-700">
                      Próximo passo
                    </p>
                  )}
                  <h3 className="text-[16px] font-bold text-foreground-950">{etapa.titulo}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-foreground-600">{etapa.proposta}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2.5">
                    <Button
                      variant={feitaEm ? "secondary" : proxima ? "primary" : "ghost"}
                      onClick={() => alternar(etapa.id, etapa.titulo)}
                      aria-pressed={Boolean(feitaEm)}
                    >
                      <i className={feitaEm ? "ri-checkbox-circle-fill" : "ri-checkbox-blank-circle-line"} aria-hidden="true" />
                      {feitaEm ? "Feito" : "Marcar como feito"}
                    </Button>
                    {conteudo && (
                      <Link
                        to={`/conteudos/${conteudo.id}`}
                        className="press inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold text-primary-800 transition-colors hover:bg-primary-900/[0.07]"
                      >
                        <i className="ri-book-open-line" aria-hidden="true" />
                        {conteudo.titulo}
                      </Link>
                    )}
                  </div>
                </GlassCard>
              </li>
            );
          })}
        </ol>

        <div className="mt-6">
          <AvisoApoio />
        </div>
      </main>
    </PageShell>
  );
}
