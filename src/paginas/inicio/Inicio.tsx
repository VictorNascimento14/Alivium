import { Link } from "react-router-dom";

import ConteudoCard from "@/componentes/ConteudoCard";
import { linkDeConteudo } from "@/componentes/linkDeConteudo";
import { TONS } from "@/componentes/tons";
import { andamento } from "@/dados/jornadas";
import { jornadaParaContinuar, recomendarConteudos } from "@/dados/recomendacoes";
import { progressoDe, useEstado } from "@/dados/repositorio";
import { useSessao } from "@/sessao/useSessao";
import { GlassCard, MeterBar, PageShell, stagger } from "@/ui";
import CheckInCard from "./CheckInCard";
import { fraseDoDia, saudacao } from "./frases";

export default function Inicio() {
  const usuario = useSessao();
  const estado = useEstado();
  if (!usuario) return null; // a guarda de rota garante a sessão; isto só estreita o tipo

  const agora = new Date();
  const data = agora.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  const primeiroNome = usuario.nome.split(" ")[0];
  const progresso = progressoDe(estado, usuario.id);
  const continuar = jornadaParaContinuar(estado, usuario.id);
  const recomendados = recomendarConteudos(estado, usuario.id);

  return (
    <PageShell titulo="Início" detalhe={data}>
      {/* `pb-28` no celular: a barra de baixo flutua sobre o conteúdo. */}
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <GlassCard tone="medium" className="relative overflow-hidden p-[26px] md:p-8" delay={stagger(0)}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary-300/30 blur-3xl"
          />
          <p className="relative text-[13px] font-semibold uppercase tracking-[0.08em] text-primary-700">
            {saudacao(agora)}
          </p>
          <h2 className="relative mt-1 text-[30px] font-extrabold leading-tight tracking-[-0.02em] text-foreground-950 md:text-[36px]">
            Que bom ter você aqui, {primeiroNome}.
          </h2>
          <p className="relative mt-3 flex max-w-2xl items-start gap-2.5 text-[15px] leading-relaxed text-foreground-600">
            <i className="ri-leaf-line mt-0.5 text-lg text-primary-600" aria-hidden="true" />
            <span>{usuario.intencao ? `“${usuario.intencao}”` : "Um espaço de acolhimento, reflexão, cuidado e esperança — no seu tempo."}</span>
          </p>
        </GlassCard>

        <div className="mt-3.5 grid gap-3.5 lg:grid-cols-[1.35fr_1fr]">
          <CheckInCard usuarioId={usuario.id} delay={stagger(1)} />

          <div className="flex flex-col gap-3.5">
            <ContinuarCard jornadaId={continuar?.id} delay={stagger(2)} />
            <GlassCard interactive sheen className="p-[26px]" delay={stagger(3)}>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-foreground-500">Para hoje</p>
              <p className="mt-2.5 text-[18px] font-bold leading-snug tracking-[-0.01em] text-foreground-950">
                {fraseDoDia(agora)}
              </p>
            </GlassCard>
          </div>
        </div>

        {recomendados.length > 0 && (
          <section className="mt-8">
            <div className="flex items-baseline justify-between px-1">
              <h2 className="text-[17px] font-bold tracking-[-0.01em] text-foreground-950">Para você hoje</h2>
              <Link to="/conteudos" className="underline-grow text-[13px] font-semibold text-primary-800">
                Ver todos
              </Link>
            </div>
            <div className="mt-3 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
              {recomendados.map((c, i) => (
                <ConteudoCard
                  key={c.id}
                  conteudo={c}
                  categoria={estado.categorias.find((k) => k.id === c.categoriaId)}
                  concluido={Boolean(progresso.conteudos[c.id])}
                  delay={stagger(4 + i, 60)}
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

/** A jornada em andamento com o próximo passo — ou o convite para começar uma. */
function ContinuarCard({ jornadaId, delay }: { jornadaId?: string; delay: number }) {
  const estado = useEstado();
  const usuario = useSessao();
  const jornada = estado.jornadas.find((j) => j.id === jornadaId);

  if (!jornada || !usuario) {
    return (
      <GlassCard className="p-[26px]" delay={delay}>
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-foreground-500">Jornadas</p>
        <p className="mt-2.5 text-[15px] leading-relaxed text-foreground-700">
          Caminhos curtos, um passo por dia, para acompanhar você.
        </p>
        <Link
          to="/jornadas"
          className="press mt-4 inline-flex items-center gap-2 rounded-full bg-primary-900 px-5 py-2.5 text-[14px] font-semibold text-primary-50 shadow-nav-active transition-colors hover:bg-primary-800"
        >
          Escolher uma jornada
          <i className="ri-arrow-right-line" aria-hidden="true" />
        </Link>
      </GlassCard>
    );
  }

  const a = andamento(progressoDe(estado, usuario.id), jornada);
  const tom = TONS[jornada.tom];
  return (
    <Link
      to={`/jornadas/${jornada.id}`}
      className="block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
    >
      <GlassCard interactive className="relative overflow-hidden p-[26px]" delay={delay}>
        <div aria-hidden="true" className={`pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full blur-2xl ${tom.halo}`} />
        <p className="relative text-[12px] font-semibold uppercase tracking-[0.08em] text-foreground-500">
          Continue de onde parou
        </p>
        <div className="relative mt-3 flex items-center gap-3">
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-xl ${tom.pastilha}`}>
            <i className={jornada.icone} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[16px] font-bold text-foreground-950">{jornada.titulo}</p>
            <p className="truncate text-[13px] text-foreground-600">Próximo: {a.proxima?.titulo}</p>
          </div>
        </div>
        <div className="relative mt-4 flex items-center gap-3">
          <MeterBar pct={a.pct} height={7} className="flex-1" label={`Andamento de ${jornada.titulo}`} />
          <span className="text-[12px] font-semibold text-foreground-800">
            {a.feitas}/{a.total}
          </span>
        </div>
      </GlassCard>
    </Link>
  );
}
