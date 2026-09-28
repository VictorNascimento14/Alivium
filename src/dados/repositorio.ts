import { useSyncExternalStore } from "react";

import { SLUG } from "@/ui/lib/marca";
import { estadoInicial } from "./sementes";
import type { Estado, Progresso } from "./tipos";

// O repositório local da v1 (ADR-001 no cofre). É o ÚNICO ponto do app que
// toca o `localStorage` com dado do domínio. Trocar por uma API muda este
// arquivo e as funções de escrita — as telas continuam lendo por `useEstado`.
//
// A API é síncrona de propósito: com tudo em memória, uma tela nunca precisa
// de estado de carregamento para ler. A escrita persiste e avisa os ouvintes.

export const CHAVE_DADOS = `${SLUG}-dados-v1`;

type Ouvinte = () => void;
const ouvintes = new Set<Ouvinte>();

/** `localStorage` quando existe (navegador); nada no teste e no modo privado bloqueado. */
function armazenamento(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function carregar(): Estado {
  try {
    const bruto = armazenamento()?.getItem(CHAVE_DADOS);
    if (bruto) {
      const salvo = JSON.parse(bruto) as Estado;
      // Versão desconhecida volta às sementes em vez de quebrar a tela.
      if (salvo?.versao === 1) return salvo;
    }
  } catch {
    /* JSON corrompido: recomeça das sementes. */
  }
  return estadoInicial();
}

let estado: Estado = carregar();

function persistir() {
  try {
    armazenamento()?.setItem(CHAVE_DADOS, JSON.stringify(estado));
  } catch {
    /* Cota cheia ou storage bloqueado: segue em memória nesta aba. */
  }
}

function avisar() {
  ouvintes.forEach((o) => o());
}

export function lerEstado(): Estado {
  return estado;
}

/**
 * Única porta de escrita. `fn` recebe o estado e devolve o próximo — sem
 * mutar o anterior, senão o `useSyncExternalStore` não percebe a mudança.
 */
export function atualizar(fn: (atual: Estado) => Estado): void {
  estado = fn(estado);
  persistir();
  avisar();
}

export function assinar(ouvinte: Ouvinte): () => void {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

/** Volta às sementes. Usado por "apagar meus dados" e pelos testes. */
export function restaurarSementes(): void {
  estado = estadoInicial();
  persistir();
  avisar();
}

// Outra aba escreveu: relê, para as duas abas não divergirem.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== CHAVE_DADOS) return;
    estado = carregar();
    avisar();
  });
}

/**
 * O estado inteiro, reativo. Derive o que precisar com `useMemo` na tela:
 * um seletor que devolve objeto novo a cada chamada faria o
 * `useSyncExternalStore` renderizar em laço.
 */
export function useEstado(): Estado {
  return useSyncExternalStore(assinar, lerEstado, lerEstado);
}

export const PROGRESSO_VAZIO: Progresso = { conteudos: {}, etapas: {}, jornadas: {}, salvos: [] };

export function progressoDe(e: Estado, usuarioId: string | null | undefined): Progresso {
  return (usuarioId && e.progresso[usuarioId]) || PROGRESSO_VAZIO;
}

/** Id novo. `randomUUID` só existe em contexto seguro; em http de rede local cai no plano B. */
export function novoId(prefixo: string): string {
  const uuid = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  return `${prefixo}-${uuid}`;
}

/** Instante atual em ISO. Isolado para os testes poderem congelar o relógio. */
export function agora(): string {
  return new Date().toISOString();
}
