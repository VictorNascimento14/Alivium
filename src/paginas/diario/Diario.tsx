import { useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { flushSync } from "react-dom";

import AvisoApoio from "@/componentes/AvisoApoio";
import { TEXTO_MAXIMO, apagarEntrada, editarEntrada, entradasDe, escreverEntrada, validarEntrada } from "@/dados/diario";
import type { RascunhoDiario } from "@/dados/diario";
import { useEstado } from "@/dados/repositorio";
import { HUMORES } from "@/dados/tipos";
import type { EntradaDiario, Humor } from "@/dados/tipos";
import { useSessao } from "@/sessao/useSessao";
import { Button, GlassCard, Modal, PageShell, stagger, toast } from "@/ui";

const SUGESTOES = [
  "Hoje eu senti…",
  "Uma coisa que me ajudou hoje foi…",
  "O que está pesando agora é…",
  "Eu gostaria de dizer a mim mesmo(a)…",
  "Três coisas boas de hoje:",
];

// Botões de apagar: o `<Button>` não tem variante de perigo, e trocar a cor por
// classe ao lado da variante briga com a cor dela na cascata.
const APAGAR_BASE =
  "press inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold transition-colors duration-200";

const VAZIO: RascunhoDiario = { titulo: "", texto: "", humor: 3 };

const CAMPO =
  "w-full rounded-[18px] border border-foreground-950/[0.10] bg-surface/70 px-[18px] py-3 text-sm text-foreground-950 backdrop-blur-sm transition-colors duration-200 placeholder:text-foreground-400 hover:border-foreground-950/25 focus:border-primary-600";

function SeletorHumor({ valor, onChange }: { valor: Humor; onChange: (h: Humor) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Como você está">
      {HUMORES.map((h) => {
        const ativo = valor === h.valor;
        return (
          <button
            key={h.valor}
            type="button"
            role="radio"
            aria-checked={ativo}
            title={h.rotulo}
            onClick={() => onChange(h.valor)}
            className={`press grid h-11 w-11 cursor-pointer place-items-center rounded-full text-[22px] transition-all duration-open ease-organic ${
              ativo ? "scale-110 bg-primary-100 ring-2 ring-primary-600" : "glass-inset opacity-70 hover:opacity-100"
            }`}
          >
            <span aria-hidden="true">{h.emoji}</span>
            <span className="sr-only">{h.rotulo}</span>
          </button>
        );
      })}
    </div>
  );
}

function Formulario({
  inicial,
  onSalvar,
  rotulo,
  children,
}: {
  inicial: RascunhoDiario;
  onSalvar: (r: RascunhoDiario) => void;
  rotulo: string;
  children?: ReactNode;
}) {
  const [r, setR] = useState(inicial);
  const [erro, setErro] = useState<string | null>(null);
  const textoRef = useRef<HTMLTextAreaElement>(null);

  /** Acrescenta a sugestão e devolve o foco ao texto, com o cursor no fim. */
  function sugerir(s: string) {
    const texto = r.texto ? `${r.texto}\n${s} ` : `${s} `;
    // `flushSync`: o texto novo já está no campo quando o foco e o cursor chegam —
    // tudo no mesmo clique. Deixar o foco no botão faria cada espaço digitado
    // "clicar" a sugestão de novo.
    flushSync(() => setR({ ...r, texto }));
    textoRef.current?.focus();
    textoRef.current?.setSelectionRange(texto.length, texto.length);
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    const problema = validarEntrada(r);
    if (problema) return setErro(problema);
    onSalvar(r);
    setR(VAZIO);
    setErro(null);
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-3.5" noValidate>
      <input
        aria-label="Título (opcional)"
        placeholder="Título (opcional)"
        value={r.titulo}
        maxLength={80}
        onChange={(e) => setR({ ...r, titulo: e.target.value })}
        className={CAMPO}
      />
      <textarea
        ref={textoRef}
        aria-label="O que você quer escrever"
        placeholder="Escreva com calma. Ninguém além de você lê isto."
        value={r.texto}
        rows={7}
        maxLength={TEXTO_MAXIMO}
        onChange={(e) => {
          setR({ ...r, texto: e.target.value });
          setErro(null);
        }}
        className={`${CAMPO} resize-y leading-relaxed`}
      />
      <div className="flex flex-wrap gap-2">
        {SUGESTOES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => sugerir(s)}
            className="press glass-pill cursor-pointer px-3 py-1.5 text-[12px] font-medium text-foreground-700 transition-colors hover:text-primary-800"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SeletorHumor valor={r.humor} onChange={(h) => setR({ ...r, humor: h })} />
        <span className="text-[11.5px] text-foreground-500">
          {r.texto.length}/{TEXTO_MAXIMO}
        </span>
      </div>
      {erro && (
        <p role="alert" className="animate-fade-up text-xs text-red-600">
          {erro}
        </p>
      )}
      <div className="flex flex-wrap gap-2.5">
        <Button type="submit">
          <i className="ri-quill-pen-line" aria-hidden="true" />
          {rotulo}
        </Button>
        {children}
      </div>
    </form>
  );
}

export default function Diario() {
  const estado = useEstado();
  const usuario = useSessao();
  const entradas = useMemo(() => (usuario ? entradasDe(estado, usuario.id) : []), [estado, usuario]);
  const [aberta, setAberta] = useState<EntradaDiario | null>(null);
  const [editando, setEditando] = useState(false);
  const [confirmarApagar, setConfirmarApagar] = useState(false);

  if (!usuario) return null;

  function fechar() {
    setAberta(null);
    setEditando(false);
    setConfirmarApagar(false);
  }

  const dataLonga = (iso: string) =>
    new Date(iso).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <PageShell titulo="Diário" detalhe="só você lê">
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <div className="grid gap-3.5 lg:grid-cols-[1.15fr_1fr]">
          <GlassCard tone="medium" className="p-[26px]" delay={stagger(0)}>
            <h2 className="text-[17px] font-bold tracking-[-0.01em] text-foreground-950">Escrever</h2>
            <p className="mt-1 mb-5 text-[13px] text-foreground-500">
              Colocar em palavras ajuda a ver com um pouco mais de distância.
            </p>
            <Formulario
              inicial={VAZIO}
              rotulo="Guardar no diário"
              onSalvar={(r) => {
                escreverEntrada(usuario.id, r);
                toast("Guardado", "Obrigado por se escutar.");
              }}
            />
          </GlassCard>

          <div className="flex flex-col gap-3.5">
            {entradas.length === 0 ? (
              <GlassCard className="flex flex-col items-center p-10 text-center" delay={stagger(1)}>
                <span className="animate-pop grid h-14 w-14 place-items-center rounded-full bg-primary-50 text-2xl text-primary-700">
                  <i className="ri-book-2-line" aria-hidden="true" />
                </span>
                <p className="mt-4 text-[15px] font-semibold text-foreground-900">Seu diário está esperando.</p>
                <p className="mt-1 text-[13px] text-foreground-500">A primeira linha é a mais difícil — e pode ser curta.</p>
              </GlassCard>
            ) : (
              entradas.map((d, i) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setAberta(d)}
                  className="block w-full cursor-pointer rounded-card text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                >
                  <GlassCard interactive className="flex gap-4 p-[20px]" delay={stagger(i + 1, 50)}>
                    <span className="text-[28px] leading-none" aria-hidden="true">
                      {HUMORES[d.humor - 1].emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11.5px] font-medium text-foreground-500 first-letter:uppercase">{dataLonga(d.criadoEm)}</p>
                      <p className="mt-0.5 truncate text-[15px] font-bold text-foreground-950">{d.titulo}</p>
                      <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-foreground-600">{d.texto}</p>
                    </div>
                  </GlassCard>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="mt-6">
          <AvisoApoio />
        </div>

        <Modal
          aberto={aberta !== null}
          titulo={editando ? "Editar" : (aberta?.titulo ?? "")}
          onFechar={fechar}
          largura="lg"
          rodape={
            aberta && !editando ? (
              confirmarApagar ? (
                <>
                  <span className="mr-auto text-[13px] text-foreground-600">Apagar para sempre?</span>
                  <Button variant="ghost" onClick={() => setConfirmarApagar(false)}>
                    Manter
                  </Button>
                  <button
                    type="button"
                    className={`${APAGAR_BASE} bg-red-600 text-white hover:bg-red-700`}
                    onClick={() => {
                      apagarEntrada(usuario.id, aberta.id);
                      fechar();
                      toast("Apagado", "A entrada saiu do seu diário.");
                    }}
                  >
                    Apagar
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={`${APAGAR_BASE} mr-auto text-red-700 hover:bg-red-100`}
                    onClick={() => setConfirmarApagar(true)}
                  >
                    <i className="ri-delete-bin-line" aria-hidden="true" />
                    Apagar
                  </button>
                  <Button variant="secondary" onClick={() => setEditando(true)}>
                    <i className="ri-edit-line" aria-hidden="true" />
                    Editar
                  </Button>
                </>
              )
            ) : undefined
          }
        >
          {aberta &&
            (editando ? (
              <Formulario
                inicial={{ titulo: aberta.titulo, texto: aberta.texto, humor: aberta.humor }}
                rotulo="Salvar alterações"
                onSalvar={(r) => {
                  editarEntrada(usuario.id, aberta.id, r);
                  fechar();
                  toast("Alterações salvas");
                }}
              >
                <Button variant="ghost" onClick={() => setEditando(false)}>
                  Cancelar
                </Button>
              </Formulario>
            ) : (
              <div>
                <p className="flex items-center gap-2 text-[13px] text-foreground-500">
                  <span className="text-xl" aria-hidden="true">
                    {HUMORES[aberta.humor - 1].emoji}
                  </span>
                  <span className="first-letter:uppercase">
                    {dataLonga(aberta.criadoEm)} · {HUMORES[aberta.humor - 1].rotulo.toLowerCase()}
                  </span>
                </p>
                <p className="mt-4 whitespace-pre-wrap text-[15px] leading-[1.75] text-foreground-800">{aberta.texto}</p>
              </div>
            ))}
        </Modal>
      </main>
    </PageShell>
  );
}
