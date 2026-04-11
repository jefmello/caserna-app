"use client";

/**
 * SectionDivider — separador visual entre blocos de conteúdo.
 * Linha sutil com gradiente que dá "respiro" e estrutura visual à página.
 */
export default function SectionDivider({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={`h-px w-full bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-zinc-700 ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}
