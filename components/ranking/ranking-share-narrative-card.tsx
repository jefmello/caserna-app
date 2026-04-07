"use client";

import { useRef } from "react";
import useEditorialShare from "@/lib/hooks/useEditorialShare";

type Props = {
  headline: string;
  narrative: string;
  category: string;
  competition: string;
};

export default function RankingShareNarrativeCard({
  headline,
  narrative,
  category,
  competition,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { shareImage } = useEditorialShare();

  return (
    <div className="mt-4">
      <div
        ref={ref}
        className="rounded-2xl bg-gradient-to-br from-zinc-900 to-black p-6 text-white"
      >
        <p className="text-xs opacity-70">
          {category} • {competition}
        </p>

        <h2 className="mt-2 text-xl font-bold">{headline}</h2>

        <p className="mt-3 text-sm opacity-80">{narrative}</p>

        <div className="mt-4 text-[10px] opacity-50">
          Caserna Kart Racing
        </div>
      </div>

      <button
        onClick={() => shareImage(ref.current, "narrative")}
        className="mt-2 w-full rounded-xl bg-zinc-900 py-2 text-sm text-white"
      >
        Compartilhar narrativa
      </button>
    </div>
  );
}