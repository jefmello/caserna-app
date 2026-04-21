"use client";

import React, { type RefObject } from "react";
import type { RankingItem } from "@/types/ranking";
import {
  getTop6RowStyles as defaultGetTop6RowStyles,
  getTrendVisual as defaultGetTrendVisual,
  normalizePilotName as defaultNormalizePilotName,
} from "@/lib/ranking/ranking-utils";

type ThemeLike = {
  primaryBorder: string;
  primaryIconWrap: string;
  primaryIcon: string;
  heroBorder: string;
  darkAccentBorder: string;
  darkAccentBg: string;
  darkAccentText: string;
  darkLeaderRow?: string;
  darkSecondRow?: string;
  darkThirdRow?: string;
  searchBadge: string;
};

type NarrativeLike = {
  headline: string;
  body: string;
};

type StatsSummaryLike = {
  totalPilots?: number;
  totalVictories?: number;
  totalPodiums?: number;
  avgPoints?: number;
};

type Props = {
  cardRef: RefObject<HTMLDivElement | null>;
  isDarkMode: boolean;
  theme: ThemeLike;
  category: string;
  competition: string;
  competitionLabels: Record<string, string>;
  championshipNarrative: NarrativeLike;
  filteredRanking: RankingItem[];
  pilotTrendMap: Record<string, string>;
  statsSummary: StatsSummaryLike;
  getPilotFirstAndLastName: (name?: string) => string;
  getTop6RowStyles?: typeof defaultGetTop6RowStyles;
  getTrendVisual?: typeof defaultGetTrendVisual;
  normalizePilotName?: typeof defaultNormalizePilotName;
};

export default function EvolutionShareCard({
  cardRef,
  isDarkMode,
  theme,
  category,
  competition,
  competitionLabels,
  championshipNarrative,
  filteredRanking,
  pilotTrendMap,
  statsSummary,
  getPilotFirstAndLastName,
  getTop6RowStyles = defaultGetTop6RowStyles,
  getTrendVisual = defaultGetTrendVisual,
  normalizePilotName = defaultNormalizePilotName,
}: Props) {
  return (
    <div
      ref={cardRef}
      className={`relative mt-6 w-[1080px] overflow-hidden rounded-[36px] border p-8 ${
        isDarkMode ? `border-white/10 text-white` : `${theme.primaryBorder} text-zinc-950`
      }`}
      style={{
        background: isDarkMode
          ? `linear-gradient(135deg, #0b0f16 0%, #111827 40%, #0f172a 100%)`
          : `linear-gradient(135deg, #ffffff 0%, #fafafa 100%)`,
      }}
    >
      <div
        className={`absolute -top-20 -right-20 h-80 w-80 rounded-full blur-3xl ${
          isDarkMode ? "bg-white/5" : `${theme.primaryIconWrap} opacity-30`
        }`}
      />

      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div
        className={`relative rounded-[28px] border p-7 ${
          isDarkMode
            ? `${theme.darkAccentBorder} bg-[#111827]/90`
            : `${theme.heroBorder} bg-white/92`
        }`}
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p
              className={`text-[15px] font-bold tracking-[0.22em] uppercase ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Panorama do campeonato
            </p>
            <h2 className="mt-2 text-[40px] leading-tight font-extrabold tracking-tight">
              {category} · {competitionLabels[competition] || competition}
            </h2>
          </div>

          <div
            className={`rounded-full border px-5 py-2 text-[15px] font-bold tracking-[0.14em] uppercase ${
              isDarkMode
                ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                : theme.searchBadge
            }`}
          >
            Evolução
          </div>
        </div>

        <div
          className={`mt-5 rounded-[20px] border px-5 py-4 ${
            isDarkMode ? `border-white/10 bg-[#0f172a]` : `border-black/5 bg-white`
          }`}
        >
          <p
            className={`text-[13px] font-bold tracking-[0.16em] uppercase ${
              isDarkMode ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            {championshipNarrative.headline}
          </p>
          <p
            className={`mt-1 text-[18px] leading-snug ${
              isDarkMode ? "text-zinc-200" : "text-zinc-600"
            }`}
          >
            {championshipNarrative.body}
          </p>
        </div>

        <p
          className={`mt-5 text-[13px] font-bold tracking-[0.16em] uppercase ${
            isDarkMode ? "text-zinc-500" : "text-zinc-400"
          }`}
        >
          Posição atual e tendência
        </p>
        <div className="mt-3 space-y-3">
          {filteredRanking.slice(0, 6).map((item, index) => {
            const styles = getTop6RowStyles(index + 1);
            const trendStatus =
              pilotTrendMap[item.pilotoId || normalizePilotName(item.piloto)] || "stable";
            const trendV = getTrendVisual(trendStatus as never, isDarkMode);
            const TrendI = trendV.Icon;

            return (
              <div
                key={`evo-${item.pilotoId || item.piloto}-${index}`}
                className={`flex items-center justify-between rounded-[20px] border px-4 py-3 ${
                  isDarkMode
                    ? index === 0
                      ? theme.darkLeaderRow || "border-white/10 bg-[#111827]"
                      : index === 1
                        ? theme.darkSecondRow || "border-white/10 bg-[#111827]"
                        : index === 2
                          ? theme.darkThirdRow || "border-white/10 bg-[#111827]"
                          : "border-white/10 bg-[#111827]"
                    : styles.row || "border-black/5 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-[14px] text-[16px] font-extrabold ${
                      isDarkMode
                        ? index === 0
                          ? "bg-white/10 text-white"
                          : index === 1
                            ? "bg-white/10 text-white"
                            : index === 2
                              ? "bg-amber-500/15 text-amber-300"
                              : "bg-white/10 text-white"
                        : styles.badge
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`truncate text-[20px] font-extrabold tabular-nums ${
                        isDarkMode ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      {getPilotFirstAndLastName(item.piloto)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-bold ${trendV.className}`}
                  >
                    <TrendI className="h-3.5 w-3.5" />
                    {trendV.label}
                  </div>
                  <p
                    className={`text-[22px] font-extrabold tabular-nums ${
                      isDarkMode ? theme.darkAccentText : theme.primaryIcon
                    }`}
                  >
                    {item.pontos} pts
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-4 gap-3">
          <div
            className={`rounded-[18px] border px-4 py-3 text-center ${
              isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
            }`}
          >
            <p
              className={`text-[11px] font-bold tracking-[0.14em] uppercase ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Pilotos
            </p>
            <p
              className={`mt-1 text-[24px] font-extrabold tabular-nums ${isDarkMode ? "text-white" : "text-zinc-950"}`}
            >
              {statsSummary.totalPilots}
            </p>
          </div>
          <div
            className={`rounded-[18px] border px-4 py-3 text-center ${
              isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
            }`}
          >
            <p
              className={`text-[11px] font-bold tracking-[0.14em] uppercase ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Vitórias
            </p>
            <p
              className={`mt-1 text-[24px] font-extrabold tabular-nums ${isDarkMode ? "text-white" : "text-zinc-950"}`}
            >
              {statsSummary.totalVictories || 0}
            </p>
          </div>
          <div
            className={`rounded-[18px] border px-4 py-3 text-center ${
              isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
            }`}
          >
            <p
              className={`text-[11px] font-bold tracking-[0.14em] uppercase ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Pódios
            </p>
            <p
              className={`mt-1 text-[24px] font-extrabold tabular-nums ${isDarkMode ? "text-white" : "text-zinc-950"}`}
            >
              {statsSummary.totalPodiums || 0}
            </p>
          </div>
          <div
            className={`rounded-[18px] border px-4 py-3 text-center ${
              isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
            }`}
          >
            <p
              className={`text-[11px] font-bold tracking-[0.14em] uppercase ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Média
            </p>
            <p
              className={`mt-1 text-[24px] font-extrabold tabular-nums ${isDarkMode ? "text-white" : "text-zinc-950"}`}
            >
              {Math.round(statsSummary.avgPoints || 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between px-2">
        <p
          className={`text-[12px] font-bold tracking-[0.2em] uppercase ${
            isDarkMode ? "text-zinc-600" : "text-zinc-300"
          }`}
        >
          CASERNA KART RACING
        </p>
        <p className={`text-[12px] ${isDarkMode ? "text-zinc-600" : "text-zinc-300"}`}>
          {new Date().toLocaleDateString("pt-BR")} às{" "}
          {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}
