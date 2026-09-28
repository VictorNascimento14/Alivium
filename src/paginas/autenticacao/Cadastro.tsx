import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

import { SENHA_MINIMA, cadastrar, forcaDaSenha, validarCadastro } from "@/dados/usuarios";
import type { NovoCadastro } from "@/dados/usuarios";
import { Button, TextField, toast } from "@/ui";
import LayoutAutenticacao from "./LayoutAutenticacao";
import VerSenha from "./VerSenha";

// Classes literais: o Tailwind não gera classe montada em runtime.
const FORCA = [
  { rotulo: "", largura: "w-0", cor: "bg-foreground-300" },
  { rotulo: "Fraca", largura: "w-1/4", cor: "bg-red-500" },
  { rotulo: "Razoável", largura: "w-2/4", cor: "bg-orange-500" },
  { rotulo: "Boa", largura: "w-3/4", cor: "bg-primary-600" },
  { rotulo: "Forte", largura: "w-full", cor: "bg-primary-700" },
];

export default function Cadastro() {
  const [dados, setDados] = useState<NovoCadastro>({ nome: "", email: "", senha: "" });
  const [verSenha, setVerSenha] = useState(false);
  const [aceite, setAceite] = useState(false);
  // Erro só aparece depois da primeira tentativa: gritar "campo inválido" enquanto a
  // pessoa ainda digita é o oposto de acolher.
  const [tentou, setTentou] = useState(false);

  const erros = tentou ? validarCadastro(dados) : {};
  const forca = FORCA[forcaDaSenha(dados.senha)];

  const campo = (k: keyof NovoCadastro) => ({
    value: dados[k],
    onChange: (e: ChangeEvent<HTMLInputElement>) => setDados((d) => ({ ...d, [k]: e.target.value })),
    error: erros[k],
  });

  function enviar(e: FormEvent) {
    e.preventDefault();
    setTentou(true);
    if (!aceite) return;
    const r = cadastrar(dados);
    if (r.ok) toast(`Boas-vindas, ${r.valor.nome.split(" ")[0]}`, "Este espaço agora também é seu.");
  }

  return (
    <LayoutAutenticacao
      titulo="Criar sua conta"
      subtitulo="Leva menos de um minuto. Você pode mudar tudo depois."
      rodape={
        <>
          Já tem conta?{" "}
          <Link to="/entrar" className="underline-grow font-semibold text-primary-800">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={enviar} className="flex flex-col gap-4" noValidate>
        <TextField label="Como podemos te chamar?" autoComplete="name" placeholder="Seu nome" icon="ri-user-line" {...campo("nome")} />
        <TextField label="E-mail" type="email" autoComplete="email" placeholder="voce@exemplo.com" icon="ri-mail-line" {...campo("email")} />
        <div>
          <TextField
            label="Senha"
            type={verSenha ? "text" : "password"}
            autoComplete="new-password"
            placeholder={`Pelo menos ${SENHA_MINIMA} caracteres`}
            icon="ri-lock-line"
            right={<VerSenha visivel={verSenha} onAlternar={() => setVerSenha((v) => !v)} />}
            {...campo("senha")}
          />
          <div className="mt-2.5 flex items-center gap-3 px-1" aria-live="polite">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground-950/[0.09]">
              <div className={`h-full rounded-full transition-all duration-open ease-organic ${forca.largura} ${forca.cor}`} />
            </div>
            <span className="w-16 text-right text-[12px] font-medium text-foreground-500">{forca.rotulo}</span>
          </div>
        </div>

        <label className="glass-inset flex cursor-pointer items-start gap-3 rounded-[18px] p-3.5">
          <input
            type="checkbox"
            checked={aceite}
            onChange={(e) => setAceite(e.target.checked)}
            className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer accent-primary-700"
          />
          <span className="text-[12.5px] leading-relaxed text-foreground-600">
            Entendo que o Alivium é um apoio e <strong className="font-semibold text-foreground-800">não substitui
            atendimento profissional</strong>, e que nesta versão meus registros ficam guardados só neste navegador.
          </span>
        </label>
        {tentou && !aceite && (
          <p role="alert" className="animate-fade-up -mt-2 px-1 text-xs text-red-600">
            Para continuar, confirme que leu o aviso acima.
          </p>
        )}

        <Button type="submit" fullWidth className="mt-1">
          Criar conta
          <i className="ri-arrow-right-line" aria-hidden="true" />
        </Button>
      </form>
    </LayoutAutenticacao>
  );
}
