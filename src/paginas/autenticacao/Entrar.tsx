import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { useEstado } from "@/dados/repositorio";
import { entrar } from "@/dados/usuarios";
import { Button, TextField, toast } from "@/ui";
import LayoutAutenticacao from "./LayoutAutenticacao";
import VerSenha from "./VerSenha";

const DEMOS = [
  { rotulo: "Pessoa", email: "pessoa@exemplo.com", icone: "ri-user-heart-line" },
  { rotulo: "Administração", email: "admin@alivium.app", icone: "ri-shield-user-line" },
];

export default function Entrar() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  // Só as demonstrações que ainda existem: a conta pode ter sido apagada no Perfil.
  const usuarios = useEstado().usuarios;
  const demos = DEMOS.filter((d) => usuarios.some((u) => u.email === d.email));

  function enviar(e: FormEvent) {
    e.preventDefault();
    const r = entrar(email, senha);
    if (!r.ok) {
      setErro(r.erro);
      return;
    }
    // Quem leva para o destino é o `SomenteVisitante`, ao ver a sessão aberta.
    toast(`Olá, ${r.valor.nome.split(" ")[0]}`, "Que bom ter você de volta.");
  }

  return (
    <LayoutAutenticacao
      titulo="Bem-vindo(a) de volta"
      subtitulo="Entre para continuar de onde parou."
      rodape={
        <>
          Ainda não tem conta?{" "}
          <Link to="/cadastro" className="underline-grow font-semibold text-primary-800">
            Criar conta
          </Link>
        </>
      }
    >
      <form onSubmit={enviar} className="flex flex-col gap-4" noValidate>
        <TextField
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          icon="ri-mail-line"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErro(null);
          }}
          required
        />
        <TextField
          label="Senha"
          type={verSenha ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Sua senha"
          icon="ri-lock-line"
          value={senha}
          onChange={(e) => {
            setSenha(e.target.value);
            setErro(null);
          }}
          right={<VerSenha visivel={verSenha} onAlternar={() => setVerSenha((v) => !v)} />}
          required
        />

        {erro && (
          <p
            role="alert"
            className="animate-fade-up flex items-center gap-2 rounded-[18px] bg-red-100 px-4 py-3 text-[13px] font-medium text-red-700"
          >
            <i className="ri-error-warning-line text-base" aria-hidden="true" />
            {erro}
          </p>
        )}

        <Button type="submit" fullWidth className="mt-1">
          Entrar
          <i className="ri-arrow-right-line" aria-hidden="true" />
        </Button>
      </form>

      {demos.length > 0 && (
        <div className="mt-7">
          <p className="text-center text-[12px] font-semibold uppercase tracking-[0.08em] text-foreground-500">
            Explorar com uma conta de demonstração
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {demos.map((d) => (
              <button
                key={d.email}
                type="button"
                onClick={() => {
                  setEmail(d.email);
                  setSenha("alivium123");
                  setErro(null);
                }}
                className="glass-inset press lift flex cursor-pointer items-center gap-2.5 rounded-[18px] px-3.5 py-3 text-left"
              >
                <i className={`${d.icone} text-lg text-primary-700`} aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-foreground-900">{d.rotulo}</span>
                  <span className="block truncate text-[11px] text-foreground-500">{d.email}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </LayoutAutenticacao>
  );
}
