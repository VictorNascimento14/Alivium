/** O corpo de um conteúdo como a leitura mostra — usado também na prévia do editor. */
export default function CorpoDoConteudo({ corpo }: { corpo: string[] }) {
  return (
    <div className="flex flex-col gap-4 text-[16px] leading-[1.75] text-foreground-800">
      {corpo.map((p, i) =>
        p.startsWith("• ") ? (
          <p key={i} className="flex gap-3 pl-1">
            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" aria-hidden="true" />
            <span>{p.slice(2)}</span>
          </p>
        ) : (
          <p key={i}>{p}</p>
        ),
      )}
    </div>
  );
}
