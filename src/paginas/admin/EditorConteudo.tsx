import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import CorpoDoConteudo from "@/componentes/CorpoDoConteudo";
import { TONS } from "@/componentes/tons";
import { corpoDeTexto, salvarConteudo, textoDeCorpo } from "@/dados/catalogo";
import { lerEstado, useEstado } from "@/dados/repositorio";
import { TIPOS } from "@/dados/tipos";
import type { TipoConteudo } from "@/dados/tipos";
import { Button, GlassCard, GlassPill, PageShell, TextField, stagger, toast } from "@/ui";

const CAMPO_TEXTO =
  "w-full rounded-[18px] border border-foreground-950/[0.10] bg-surface/70 px-[18px] py-3 text-sm leading-relaxed text-foreground-950 backdrop-blur-sm transition-colors duration-200 placeholder:text-foreground-400 hover:border-foreground-950/25 focus:border-primary-600";

export default function EditorConteudo() {
  const { id } = useParams();
  const navegar = useNavigate();
  const estado = useEstado();
  // Lê uma vez, na montagem: o formulário é dono do rascunho a partir daí.
  const [original] = useState(() => lerEstado().conteudos.find((c) => c.id === id));
  const [titulo, setTitulo] = useState(original?.titulo ?? "");
  const [resumo, setResumo] = useState(original?.resumo ?? "");
  const [categoriaId, setCategoriaId] = useState(original?.categoriaId ?? estado.categorias[0]?.id ?? "");
  const [tipo, setTipo] = useState<TipoConteudo>(original?.tipo ?? "leitura");
  const [minutos, setMinutos] = useState(original?.minutos ?? 5);
  const [texto, setTexto] = useState(original ? textoDeCorpo(original.corpo) : "");
  const [publicado, setPublicado] = useState(original?.publicado ?? false);
  const [erro, setErro] = useState<string | null>(null);

  if (id && id !== "novo" && !original) {
    return (
      <PageShell titulo="Conteúdo">
        <main className="mx-auto w-full max-w-2xl px-4 pb-28 pt-2 md:px-6">
          <GlassCard className="p-10 text-center text-[14px] text-foreground-600">
            Conteúdo não encontrado.{" "}
            <Link to="/admin/conteudos" className="underline-grow font-semibold text-primary-800">
              Voltar
            </Link>
          </GlassCard>
        </main>
      </PageShell>
    );
  }

  const corpo = corpoDeTexto(texto);
  const categoria = estado.categorias.find((c) => c.id === categoriaId);

  function salvar(e: FormEvent) {
    e.preventDefault();
    const r = salvarConteudo({ titulo, resumo, categoriaId, tipo, minutos, corpo, publicado }, original?.id);
    if (!r.ok) return setErro(r.erro);
    toast(original ? "Conteúdo atualizado" : "Conteúdo criado", publicado ? "Já está na biblioteca." : "Salvo como rascunho.");
    navegar("/admin/conteudos");
  }

  return (
    <PageShell titulo={original ? "Editar conteúdo" : "Novo conteúdo"}>
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <Link
          to="/admin/conteudos"
          className="press inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold text-primary-800 transition-colors hover:bg-primary-900/[0.07]"
        >
          <i className="ri-arrow-left-line" aria-hidden="true" />
          Conteúdos
        </Link>

        <div className="mt-2 grid gap-3.5 lg:grid-cols-2">
          <GlassCard tone="medium" className="p-[26px]" delay={stagger(0)}>
            <form onSubmit={salvar} className="flex flex-col gap-4" noValidate>
              <TextField label="Título" maxLength={90} value={titulo} onChange={(e) => setTitulo(e.target.value)} />
              <TextField
                label="Resumo"
                maxLength={160}
                hint="Uma linha que aparece no cartão da biblioteca."
                value={resumo}
                onChange={(e) => setResumo(e.target.value)}
              />
              <div className="grid gap-4 sm:grid-cols-4">
                {[
                  {
                    id: "cat",
                    rotulo: "Categoria",
                    valor: categoriaId,
                    mudar: setCategoriaId,
                    opcoes: estado.categorias.map((c) => [c.id, c.nome]),
                  },
                  {
                    id: "tipo",
                    rotulo: "Tipo",
                    valor: tipo,
                    mudar: (v: string) => setTipo(v as TipoConteudo),
                    opcoes: Object.entries(TIPOS).map(([v, t]) => [v, t.rotulo]),
                  },
                ].map((s) => (
                  <div key={s.id} className={s.id === "cat" ? "sm:col-span-2" : ""}>
                    <label htmlFor={s.id} className="mb-1.5 block text-sm font-medium text-foreground-700">
                      {s.rotulo}
                    </label>
                    <GlassPill className="w-full px-[18px] py-3 focus-within:ring-2 focus-within:ring-primary-600">
                      <select
                        id={s.id}
                        value={s.valor}
                        onChange={(e) => s.mudar(e.target.value)}
                        className="w-full cursor-pointer bg-transparent text-sm font-medium text-foreground-800 outline-none"
                      >
                        {s.opcoes.map(([v, r]) => (
                          <option key={v} value={v}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </GlassPill>
                  </div>
                ))}
                <TextField
                  label="Minutos"
                  type="number"
                  min={1}
                  max={120}
                  value={minutos}
                  onChange={(e) => setMinutos(Number(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="corpo" className="mb-1.5 block text-sm font-medium text-foreground-700">
                  Corpo
                </label>
                <textarea
                  id="corpo"
                  rows={12}
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder={"Um parágrafo.\n\nOutro parágrafo.\n\n- um item de lista\n- outro item"}
                  className={`${CAMPO_TEXTO} resize-y font-[inherit]`}
                />
                <p className="mt-1.5 text-xs text-foreground-500">
                  Linha em branco separa parágrafos. Comece a linha com “-” para fazer uma lista.
                </p>
              </div>
              <label className="glass-inset flex cursor-pointer items-center gap-3 rounded-[18px] p-3.5">
                <input
                  type="checkbox"
                  checked={publicado}
                  onChange={(e) => setPublicado(e.target.checked)}
                  className="h-[18px] w-[18px] cursor-pointer accent-primary-700"
                />
                <span className="text-[13.5px] text-foreground-700">
                  <strong className="font-semibold text-foreground-900">Publicar</strong> — aparece na biblioteca para todo
                  mundo
                </span>
              </label>
              {erro && (
                <p role="alert" className="animate-fade-up text-xs text-red-600">
                  {erro}
                </p>
              )}
              <div className="flex gap-2.5">
                <Button type="submit">Salvar</Button>
                <Button variant="ghost" onClick={() => navegar("/admin/conteudos")}>
                  Cancelar
                </Button>
              </div>
            </form>
          </GlassCard>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-foreground-500">Prévia</p>
            <GlassCard className="relative overflow-hidden p-7" delay={stagger(1)}>
              {categoria && (
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full blur-3xl ${TONS[categoria.tom].halo}`}
                />
              )}
              <div className="relative">
                {categoria && (
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${TONS[categoria.tom].pastilha}`}>
                    <i className={categoria.icone} aria-hidden="true" />
                    {categoria.nome}
                  </span>
                )}
                <h2 className="mt-4 text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-foreground-950">
                  {titulo || "Título do conteúdo"}
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-foreground-600">{resumo || "O resumo aparece aqui."}</p>
                <div className="mt-6">
                  {corpo.length ? (
                    <CorpoDoConteudo corpo={corpo} />
                  ) : (
                    <p className="text-[14px] text-foreground-500">O corpo aparece aqui enquanto você escreve.</p>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
