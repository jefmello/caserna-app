"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AppMainLayout from "@/components/navigation/app-main-layout";
import { Card, CardContent } from "@/components/ui/card";
import RankingTrioCompareCard from "@/components/ranking/ranking-trio-compare-card";
import useRankingData from "@/lib/hooks/useRankingData";
import { useChampionship } from "@/context/championship-context";
import type { RankingItem } from "@/types/ranking";

function PilotSlot({
  index,
  pilot,
  pilots,
  onSelect,
  onClear,
  isDarkMode,
}: {
  index: number;
  pilot: RankingItem | null;
  pilots: RankingItem[];
  onSelect: (p: RankingItem) => void;
  onClear: () => void;
  isDarkMode: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pilots.slice(0, 40);
    return pilots
      .filter(
        (p) =>
          p.piloto.toLowerCase().includes(q) ||
          (p.nomeGuerra ?? "").toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q)
      )
      .slice(0, 40);
  }, [pilots, query]);

  return (
    <div
      className={`relative rounded-[18px] border p-3 ${
        isDarkMode
          ? "border-white/10 bg-white/[0.03] text-white"
          : "border-zinc-200 bg-white text-zinc-900"
      }`}
    >
      <p className="text-[10px] font-bold tracking-[0.18em] uppercase opacity-55">
        Piloto {index + 1}
      </p>
      {pilot ? (
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-black tracking-tight">{pilot.piloto}</p>
            <p className="truncate text-[10px] font-semibold tracking-[0.12em] uppercase opacity-60">
              {pilot.categoria} · {pilot.competicao}
            </p>
          </div>
          <button
            type="button"
            onClick={onClear}
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-[0.1em] uppercase transition ${
              isDarkMode
                ? "border-white/15 text-white/70 hover:border-white/30 hover:text-white"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
            }`}
          >
            Trocar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`mt-1 w-full rounded-[12px] border-2 border-dashed px-3 py-2.5 text-left text-[13px] font-semibold tracking-tight transition ${
            isDarkMode
              ? "border-white/15 text-white/55 hover:border-white/30 hover:text-white"
              : "border-zinc-300 text-zinc-500 hover:border-zinc-400 hover:text-zinc-800"
          }`}
        >
          Escolher piloto…
        </button>
      )}

      {open && !pilot ? (
        <div
          className={`absolute top-full left-0 z-50 mt-2 max-h-[320px] w-full overflow-hidden rounded-2xl border shadow-[0_24px_60px_rgba(0,0,0,0.25)] ${
            isDarkMode ? "border-white/10 bg-[#0a0f16]" : "border-zinc-200 bg-white"
          }`}
        >
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar piloto por nome ou categoria…"
            className={`w-full border-b px-3 py-2.5 text-[13px] outline-none ${
              isDarkMode
                ? "border-white/10 bg-transparent text-white placeholder:text-white/40"
                : "border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400"
            }`}
          />
          <div className="max-h-[260px] overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-6 text-center text-[12px] opacity-55">
                Nenhum piloto encontrado.
              </p>
            ) : (
              filtered.map((p) => (
                <button
                  key={`${p.pilotoId ?? p.piloto}-${p.categoria}-${p.competicao}`}
                  type="button"
                  onClick={() => {
                    onSelect(p);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[12px] transition ${
                    isDarkMode ? "hover:bg-white/5" : "hover:bg-zinc-50"
                  }`}
                >
                  <span className="truncate font-semibold">{p.piloto}</span>
                  <span className="shrink-0 text-[10px] tracking-[0.14em] uppercase opacity-55">
                    {p.categoria}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CompararPageContent() {
  const { isDarkMode } = useChampionship();
  const { rankingData } = useRankingData();
  const searchParams = useSearchParams();
  const router = useRouter();

  const allPilots = useMemo<RankingItem[]>(() => {
    const seen = new Set<string>();
    const out: RankingItem[] = [];
    for (const category of Object.values(rankingData ?? {})) {
      for (const list of Object.values(category)) {
        for (const p of list) {
          const key = p.pilotoId || `${p.piloto}-${p.categoria}`;
          if (seen.has(key)) continue;
          seen.add(key);
          out.push(p);
        }
      }
    }
    out.sort((a, b) => a.piloto.localeCompare(b.piloto, "pt-BR"));
    return out;
  }, [rankingData]);

  const [slots, setSlots] = useState<(RankingItem | null)[]>([null, null, null]);

  // Hydrate from ?ids= if provided.
  useEffect(() => {
    const ids = searchParams.get("ids");
    if (!ids || allPilots.length === 0) return;
    const parts = ids.split(",").slice(0, 3);
    const hydrated = parts.map((id) => allPilots.find((p) => p.pilotoId === id) ?? null);
    while (hydrated.length < 3) hydrated.push(null);
    setSlots(hydrated);
    // Only once, when data first arrives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPilots.length]);

  // Sync selection → URL
  useEffect(() => {
    const ids = slots
      .map((p) => p?.pilotoId)
      .filter(Boolean)
      .join(",");
    const params = new URLSearchParams(searchParams.toString());
    if (ids) params.set("ids", ids);
    else params.delete("ids");
    const next = params.toString();
    router.replace(`/comparar${next ? `?${next}` : ""}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots]);

  const selected = slots.filter(Boolean) as RankingItem[];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6 md:py-8">
      <Card
        className={`mb-5 overflow-hidden rounded-[20px] border ${
          isDarkMode
            ? "border-white/10 bg-[#111827] text-white"
            : "border-zinc-200 bg-white text-zinc-900"
        }`}
      >
        <CardContent className="p-4 md:p-5">
          <h1 className="text-[18px] font-black tracking-tight md:text-[22px]">
            Comparação de pilotos
          </h1>
          <p className="mt-1 text-[12px] font-semibold tracking-tight opacity-65 md:text-[13px]">
            Escolha até 3 pilotos para confronto direto. O melhor em cada métrica é destacado.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {slots.map((pilot, i) => (
          <PilotSlot
            key={`slot-${i}`}
            index={i}
            pilot={pilot}
            pilots={allPilots}
            isDarkMode={isDarkMode}
            onSelect={(p) => setSlots((curr) => curr.map((slot, idx) => (idx === i ? p : slot)))}
            onClear={() => setSlots((curr) => curr.map((slot, idx) => (idx === i ? null : slot)))}
          />
        ))}
      </div>

      <div className="mt-5">
        {selected.length >= 2 ? (
          <RankingTrioCompareCard pilots={selected} isDarkMode={isDarkMode} />
        ) : (
          <Card
            className={`overflow-hidden rounded-[20px] border border-dashed ${
              isDarkMode
                ? "border-white/15 bg-white/[0.02] text-white/55"
                : "border-zinc-300 bg-zinc-50 text-zinc-500"
            }`}
          >
            <CardContent className="p-8 text-center text-[13px] font-semibold tracking-tight">
              Escolha pelo menos 2 pilotos para começar a comparação.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function CompararPage() {
  return (
    <AppMainLayout>
      <CompararPageContent />
    </AppMainLayout>
  );
}
