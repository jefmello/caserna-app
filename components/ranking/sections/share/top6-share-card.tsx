"use client";

import React, { type RefObject } from "react";
import type { RankingItem, RankingMetaPilot } from "@/types/ranking";
import {
  getTop6RowStyles as defaultGetTop6RowStyles,
  getTrendVisual as defaultGetTrendVisual,
  normalizePilotName as defaultNormalizePilotName,
} from "@/lib/ranking/ranking-utils";

type PilotLike = RankingItem | RankingMetaPilot;

type ThemeLike = {
  primaryBorder: string;
  primaryIconWrap: string;
  primaryIcon: string;
  heroBorder: string;
  darkAccentBorder: string;
  darkAccentBg: string;
  darkAccentText: string;
  darkAccentIconWrap: string;
  darkLeaderRow?: string;
  darkSecondRow?: string;
  darkThirdRow?: string;
  searchBadge: string;
};

type Props = {
  cardRef: RefObject<HTMLDivElement | null>;
  isDarkMode: boolean;
  theme: ThemeLike;
  category: string;
  competition: string;
  competitionLabels: Record<string, string>;
  leader: PilotLike | null;
  filteredRanking: RankingItem[];
  pilotTrendMap: Record<string, string>;
  getPilotFirstAndLastName: (name?: string) => string;
  getPilotWarNameDisplay: (pilot?: RankingItem | null) => string;
  getTop6RowStyles?: typeof defaultGetTop6RowStyles;
  getTrendVisual?: typeof defaultGetTrendVisual;
  normalizePilotName?: typeof defaultNormalizePilotName;
};

export default function Top6ShareCard({
  cardRef,
  isDarkMode,
  theme,
  category,
  competition,
  competitionLabels,
  leader,
  filteredRanking,
  pilotTrendMap,
  getPilotFirstAndLastName,
  getPilotWarNameDisplay,
  getTop6RowStyles = defaultGetTop6RowStyles,
  getTrendVisual = defaultGetTrendVisual,
  normalizePilotName = defaultNormalizePilotName,
}: Props) {
  return (
    <div
      ref={cardRef}
      className={`relative w-[1200px] overflow-hidden rounded-[36px] border p-10 ${
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
        className={`rounded-[28px] border px-8 py-7 ${
          isDarkMode ? `${theme.darkAccentBorder} bg-[#111827]` : `${theme.heroBorder} bg-white/90`
        }`}
      >
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-[22px] ${
                isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
              }`}
            >
              <span className={`text-3xl ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`}>
                🏆
              </span>
            </div>
            <div>
              <p
                className={`text-[16px] font-bold tracking-[0.22em] uppercase ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                Classificação oficial
              </p>
              <h2 className="mt-2 text-[42px] leading-none font-extrabold tracking-[0.04em]">
                CASERNA KART RACING
              </h2>
              <p
                className={`mt-3 text-[22px] font-semibold ${
                  isDarkMode ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                {category} · {competitionLabels[competition] || competition}
              </p>
            </div>
          </div>

          <div
            className={`rounded-full border px-5 py-2 text-[18px] font-bold tracking-[0.12em] uppercase ${
              isDarkMode
                ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                : theme.searchBadge
            }`}
          >
            Top 6 oficial
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div
            className={`rounded-[22px] border px-5 py-4 ${
              isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
            }`}
          >
            <p
              className={`text-[14px] font-bold tracking-[0.16em] uppercase ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Líder
            </p>
            <p className="mt-2 text-[26px] font-extrabold tabular-nums">
              {leader ? getPilotFirstAndLastName(leader.piloto) : "-"}
            </p>
            <p
              className={`mt-1 text-[18px] font-semibold ${
                isDarkMode ? theme.darkAccentText : "text-zinc-700"
              }`}
            >
              {leader?.pontos || 0} pontos
            </p>
          </div>
          <div
            className={`rounded-[22px] border px-5 py-4 ${
              isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
            }`}
          >
            <p
              className={`text-[14px] font-bold tracking-[0.16em] uppercase ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Pilotos
            </p>
            <p className="mt-2 text-[26px] font-extrabold tabular-nums">{filteredRanking.length}</p>
            <p
              className={`mt-1 text-[18px] font-semibold ${
                isDarkMode ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              na classificação atual
            </p>
          </div>
          <div
            className={`rounded-[22px] border px-5 py-4 ${
              isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
            }`}
          >
            <p
              className={`text-[14px] font-bold tracking-[0.16em] uppercase ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Vantagem
            </p>
            <p className="mt-2 text-[26px] font-extrabold tabular-nums">
              {filteredRanking[1] && leader
                ? Math.max((leader.pontos || 0) - filteredRanking[1].pontos, 0)
                : 0}{" "}
              pts
            </p>
            <p
              className={`mt-1 text-[18px] font-semibold ${
                isDarkMode ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              do líder para o vice
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {filteredRanking.slice(0, 6).map((item, index) => {
          const styles = getTop6RowStyles(index + 1);
          const trendStatus =
            pilotTrendMap[item.pilotoId || normalizePilotName(item.piloto)] || "stable";
          const trendVisual = getTrendVisual(trendStatus as never, isDarkMode);
          const TrendIcon = trendVisual.Icon;

          return (
            <div
              key={`share-${item.pilotoId || item.piloto}-${index}`}
              className={`flex items-center justify-between rounded-[24px] border px-5 py-4 ${
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
              <div className="flex min-w-0 items-center gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-[18px] text-[22px] font-extrabold ${
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
                  <p className="truncate text-[26px] font-extrabold tracking-tight tabular-nums">
                    {getPilotFirstAndLastName(item.piloto)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[13px] font-semibold ${trendVisual.className}`}
                    >
                      <TrendIcon className="h-3.5 w-3.5" />
                      {trendVisual.label}
                    </span>
                    {getPilotWarNameDisplay(item) ? (
                      <span
                        className={`text-[14px] italic ${
                          isDarkMode ? "text-zinc-400" : "text-zinc-500"
                        }`}
                      >
                        {getPilotWarNameDisplay(item)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3 text-center">
                {[
                  { label: "PTS", value: item.pontos },
                  { label: "VIT", value: item.vitorias },
                  { label: "POL", value: item.poles },
                  { label: "VMR", value: item.mv },
                  { label: "PDS", value: item.podios },
                ].map((stat) => (
                  <div
                    key={`${item.pilotoId || item.piloto}-${stat.label}`}
                    className={`min-w-[74px] rounded-[18px] border px-3 py-2 ${
                      isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white/90"
                    }`}
                  >
                    <p
                      className={`text-[11px] font-bold tracking-[0.14em] uppercase ${
                        isDarkMode ? "text-zinc-500" : "text-zinc-400"
                      }`}
                    >
                      {stat.label}
                    </p>
                    <p className="mt-1 text-[22px] leading-none font-extrabold tabular-nums">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
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
