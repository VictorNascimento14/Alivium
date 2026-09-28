import { useMemo } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import JornadaCard from "@/componentes/JornadaCard";
import { andamento } from "@/dados/jornadas";
import { progressoDe, useEstado } from "@/dados/repositorio";
import { useSessao } from "@/sessao/useSessao";
import { PageShell, stagger } from "@/ui";

export default function Jornadas() {
  const estado = useEstado();
  const usuario = useSessao();
  const progresso = progressoDe(estado, usuario?.id);

  // Em andamento primeiro (é onde a pessoa provavelmente quer voltar), depois as
  // novas, e as concluídas por último.
  const grupos = useMemo(() => {
    const com = estado.jornadas.filter((j) => j.publicada).map((j) => ({ j, a: andamento(progresso, j) }));
    return [
      { titulo: "Em andamento", itens: com.filter((x) => x.a.iniciada && !x.a.concluida) },
      { titulo: "Para começar", itens: com.filter((x) => !x.a.iniciada) },
      { titulo: "Concluídas", itens: com.filter((x) => x.a.concluida) },
    ].filter((g) => g.itens.length > 0);
  }, [estado.jornadas, progresso]);

  let i = 0;
  return (
    <PageShell titulo="Jornadas" detalhe="no seu ritmo">
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <p className="max-w-2xl px-1 text-[14px] leading-relaxed text-foreground-600">
          Caminhos curtos, um passo por vez. Não há prazo: volte quando quiser, e pule o que não fizer sentido hoje.
        </p>
        {grupos.map((g) => (
          <section key={g.titulo} className="mt-6">
            <h2 className="px-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-foreground-500">{g.titulo}</h2>
            <div className="mt-3 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
              {g.itens.map(({ j, a }) => (
                <JornadaCard
                  key={j.id}
                  jornada={j}
                  andamento={a}
                  delay={stagger(i++, 70)}
                  envolver={(cartao: ReactNode) => (
                    <Link
                      to={`/jornadas/${j.id}`}
                      className="block h-full rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                    >
                      {cartao}
                    </Link>
                  )}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
    </PageShell>
  );
}
