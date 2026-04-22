"use client";

import React, { useMemo } from "react";
import { Crown, Flag, Gauge, Star, Target, Timer, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getPilotFirstAndLastName, getPilotWarNameDisplay } from "@/lib/ranking/ranking-utils";
import type { RankingItem } from "@/types/ranking";

type MetricDef = {
  key: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  lowerIsBetter: boolean;
  pick: (pilot: RankingItem) => number;
};

const METRICS: readonly MetricDef[] = [
  {
    key: "pontos",
    label: "Pontos",
    shortLabel: "PTS",
    icon: Trophy,
    lowerIsBetter: false,
    pick: (p) => p.pontos,
  },
  {
    key: "vitorias",
    label: "Vitórias",
    shortLabel: "VIT",
    icon: Flag,
    lowerIsBetter: false,
    pick: (p) => p.vitorias,
  },
  {
    key: "poles",
    label: "Poles",
    shortLabel: "POL",
    icon: Star,
    lowerIsBetter: false,
    pick: (p) => p.poles,
  },
  {
    key: "podios",
    label: "Pódios",
    shortLabel: "POD",
    icon: Crown,
    lowerIsBetter: false,
    pick: (p) => p.podios,
  },
  {
    key: "mv",
    label: "VMR",
    shortLabel: "VMR",
    icon: Timer,
    lowerIsBetter: false,
    pick: (p) => p.mv,
  },
  {
    key: "participacoes",
    label: "Particip.",
    shortLabel: "PRT",
    icon: Target,
    lowerIsBetter: false,
    pick: (p) => p.participacoes,
  },
  {
    key: "pos",
    label: "Posição",
    shortLabel: "POS",
    icon: Gauge,
    lowerIsBetter: true,
    pick: (p) => p.pos,
  },
] as const;

/**
 * Head-to-head-to-head comparison of 2 or 3 pilots. For each metric the best
 * value across the roster is highlighted with an amber chip. Works in any
 * theme (dark/light). Intentionally standalone — no picker UI here; the
 * caller passes an already-selected RankingItem[] of length 2 or 3.
 */
export default function RankingTrioCompareCard({
  pilots,
  isDarkMode = false,
  title = "Comparação de pilotos",
}: {
  pilots: RankingItem[];
  isDarkMode?: boolean;
  title?: string;
}) {
  const roster = useMemo(() => pilots.slice(0, 3), [pilots]);

  const bestIndexByMetric = useMemo(() => {
    const out: Record<string, number> = {};
    for (const metric of METRICS) {
      let bestIdx = 0;
      let bestVal = metric.pick(roster[0]);
      for (let i = 1; i < roster.length; i++) {
        const v = metric.pick(roster[i]);
        const better = metric.lowerIsBetter ? v < bestVal : v > bestVal;
        if (better) {
          bestIdx = i;
          bestVal = v;
        }
      }
      // Tie: no highlight.
      const allEqual = roster.every((p) => metric.pick(p) === bestVal);
      out[metric.key] = allEqual ? -1 : bestIdx;
    }
    return out;
  }, [roster]);

  if (roster.length < 2) return null;

  const frame = isDarkMode
    ? "border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.72)_0%,rgba(8,12,24,0.78)_100%)]"
    : "border-zinc-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f5f7fb_100%)]";

  const cellBase = isDarkMode
    ? "border-white/10 bg-white/[0.03] text-white"
    : "border-black/5 bg-white text-zinc-900";

  return (
    <Card
      className={`overflow-hidden rounded-[24px] border shadow-[0_18px_42px_rgba(0,0,0,0.15)] ${frame}`}
    >
      <CardContent className="p-4 md:p-5">
        <div
          className={`mb-4 flex items-center justify-between gap-3 ${
            isDarkMode ? "text-white/80" : "text-zinc-700"
          }`}
        >
          <h3 className="text-[13px] font-bold tracking-[0.22em] uppercase">{title}</h3>
          <span className="text-[10px] font-semibold tracking-[0.18em] uppercase opacity-60">
            {roster.length} pilotos
          </span>
        </div>

        {/* Pilot headers */}
        <div
          className={`grid gap-2 md:gap-3`}
          style={{
            gridTemplateColumns: `minmax(110px,140px) repeat(${roster.length},minmax(0,1fr))`,
          }}
        >
          <div />
          {roster.map((p) => (
            <div
              key={`hdr-${p.pilotoId ?? p.piloto}`}
              className={`rounded-[16px] border px-3 py-2.5 ${cellBase}`}
            >
              <p className="truncate text-[9px] font-bold tracking-[0.16em] uppercase opacity-55">
                {p.categoria}
              </p>
              <p className="mt-1 truncate text-[15px] leading-tight font-black tracking-tight">
                {getPilotFirstAndLastName(p.piloto)}
              </p>
              {getPilotWarNameDisplay(p) ? (
                <p className="mt-0.5 truncate text-[10px] font-semibold italic opacity-60">
                  &ldquo;{getPilotWarNameDisplay(p)}&rdquo;
                </p>
              ) : null}
            </div>
          ))}
        </div>

        {/* Metric rows */}
        <div className="mt-3 flex flex-col gap-1.5">
          {METRICS.map((metric) => {
            const Icon = metric.icon;
            const bestIdx = bestIndexByMetric[metric.key];
            return (
              <div
                key={metric.key}
                className="grid items-stretch gap-2 md:gap-3"
                style={{
                  gridTemplateColumns: `minmax(110px,140px) repeat(${roster.length},minmax(0,1fr))`,
                }}
              >
                <div
                  className={`flex items-center gap-2 rounded-[14px] border px-3 py-2 ${cellBase}`}
                >
                  <Icon className="h-3.5 w-3.5 opacity-70" />
                  <span className="text-[11px] font-bold tracking-[0.14em] uppercase opacity-80">
                    {metric.label}
                  </span>
                </div>
                {roster.map((pilot, i) => {
                  const value = metric.pick(pilot);
                  const isBest = i === bestIdx;
                  return (
                    <div
                      key={`${metric.key}-${pilot.pilotoId ?? pilot.piloto}`}
                      className={`flex items-center justify-center rounded-[14px] border px-2 py-2 text-center font-black tabular-nums transition-colors ${
                        isBest
                          ? "border-amber-400/60 bg-amber-400/15 text-amber-500 shadow-[inset_0_0_0_1px_rgba(250,204,21,0.25)] dark:text-amber-300"
                          : cellBase
                      }`}
                    >
                      <span className="text-[18px] leading-none md:text-[20px]">
                        {metric.key === "pos" ? `#${value}` : value}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
