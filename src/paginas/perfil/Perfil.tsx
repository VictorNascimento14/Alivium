import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { apagarConta, atualizarPerfil, exportarDados } from "@/dados/usuarios";
import { useSessao } from "@/sessao/useSessao";
import { Avatar, Button, GlassCard, Modal, PageShell, TextField, definirTema, stagger, temaEscolhido, toast } from "@/ui";
import type { Tema } from "@/ui";

const TEMAS: { valor: Tema; rotulo: string; icone: string }[] = [
  { valor: "claro", rotulo: "Claro", icone: "ri-sun-line" },
  { valor: "escuro", rotulo: "Escuro", icone: "ri-moon-line" },
  { valor: "sistema", rotulo: "Do sistema", icone: "ri-computer-line" },
];

export default function Perfil() {
  const usuario = useSessao();
  const navegar = useNavigate();
  const [nome, setNome] = useState(usuario?.nome ?? "");
  const [intencao, setIntencao] = useState(usuario?.intencao ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [tema, setTema] = useState<Tema>(temaEscolhido());
  const [apagando, setApagando] = useState(false);
  const [confirmacao, setConfirmacao] = useState("");

  if (!usuario) return null;

  function salvar(e: FormEvent) {
    e.preventDefault();
    if (!usuario) return;
    const r = atualizarPerfil(usuario.id, { nome, intencao });
    if (!r.ok) return setErro(r.erro);
    setErro(null);
    toast("Perfil salvo", intencao.trim() ? "Sua intenção aparece no Início." : undefined);
  }

  function baixar() {
    if (!usuario) return;
    const dados = exportarDados(usuario.id);
    const url = URL.createObjectURL(new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "meus-dados-alivium.json" });
    a.click();
    URL.revokeObjectURL(url);
  }

  function apagar() {
    if (!usuario) return;
    const r = apagarConta(usuario.id);
    if (!r.ok) {
      setApagando(false);
      toast("Não foi possível apagar", r.erro);
      return;
    }
    navegar("/entrar", { replace: true });
    toast("Conta apagada", "Seus dados foram removidos deste navegador. Cuide-se.");
  }

  const membroDesde = new Date(usuario.criadoEm).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <PageShell titulo="Meu perfil">
      <main className="mx-auto w-full max-w-3xl px-4 pb-28 pt-2 md:px-6 md:pb-10">
        <GlassCard tone="medium" className="p-[26px] md:p-8" delay={stagger(0)}>
          <div className="flex items-center gap-4">
            <span className="animate-pop">
              <Avatar nome={usuario.nome} size={68} />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-[21px] font-extrabold tracking-[-0.01em] text-foreground-950">{usuario.nome}</h2>
              <p className="truncate text-[13px] text-foreground-500">{usuario.email}</p>
              <p className="text-[12px] text-foreground-500">Aqui desde {membroDesde}</p>
            </div>
          </div>

          <form className="mt-7 grid gap-4" onSubmit={salvar} noValidate>
            <TextField label="Como podemos te chamar?" icon="ri-user-line" value={nome} onChange={(e) => setNome(e.target.value)} />
            <TextField
              label="Sua intenção"
              icon="ri-leaf-line"
              placeholder="Ex.: Um dia de cada vez."
              hint="Uma frase curta para se lembrar. Aparece no topo do Início."
              maxLength={120}
              value={intencao}
              onChange={(e) => setIntencao(e.target.value)}
            />
            {erro && (
              <p role="alert" className="animate-fade-up text-xs text-red-600">
                {erro}
              </p>
            )}
            <div>
              <Button type="submit">Salvar alterações</Button>
            </div>
          </form>
        </GlassCard>

        <GlassCard className="mt-3.5 p-[26px]" delay={stagger(1)}>
          <h2 className="text-[17px] font-bold text-foreground-950">Aparência</h2>
          <div className="glass-inset mt-4 grid grid-cols-3 gap-1 rounded-full p-1" role="radiogroup" aria-label="Tema">
            {TEMAS.map((t) => {
              const ativo = tema === t.valor;
              return (
                <button
                  key={t.valor}
                  type="button"
                  role="radio"
                  aria-checked={ativo}
                  onClick={() => {
                    definirTema(t.valor);
                    setTema(t.valor);
                  }}
                  className={`press inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-[13px] font-semibold transition-colors duration-200 ${
                    ativo ? "bg-primary-900 text-primary-50 shadow-nav-active" : "text-foreground-600 hover:text-primary-800"
                  }`}
                >
                  <i className={t.icone} aria-hidden="true" />
                  {t.rotulo}
                </button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="mt-3.5 p-[26px]" delay={stagger(2)}>
          <h2 className="text-[17px] font-bold text-foreground-950">Seus dados</h2>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-foreground-600">
            Nesta versão, tudo o que você registra fica guardado só neste navegador. Você pode levar uma cópia ou apagar
            tudo quando quiser.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button variant="secondary" onClick={baixar}>
              <i className="ri-download-2-line" aria-hidden="true" />
              Baixar meus dados
            </Button>
            <button
              type="button"
              onClick={() => setApagando(true)}
              className="press inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold text-red-700 transition-colors duration-200 hover:bg-red-100"
            >
              <i className="ri-delete-bin-line" aria-hidden="true" />
              Apagar minha conta
            </button>
          </div>
        </GlassCard>

        <Modal
          aberto={apagando}
          titulo="Apagar sua conta?"
          onFechar={() => {
            setApagando(false);
            setConfirmacao("");
          }}
          rodape={
            <>
              <Button variant="ghost" onClick={() => setApagando(false)}>
                Manter minha conta
              </Button>
              <button
                type="button"
                disabled={confirmacao.trim().toLowerCase() !== "apagar"}
                onClick={apagar}
                className="press inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Apagar tudo
              </button>
            </>
          }
        >
          <p className="text-[14px] leading-relaxed text-foreground-600">
            Seus check-ins, o diário, os salvos e o progresso das jornadas serão apagados deste navegador. Não dá para
            desfazer. Se quiser guardar uma cópia, baixe seus dados antes.
          </p>
          <TextField
            className="mt-5"
            label='Para confirmar, escreva "apagar"'
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
            autoComplete="off"
          />
        </Modal>
      </main>
    </PageShell>
  );
}
