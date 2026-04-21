"use client";

/* eslint-disable @next/next/no-img-element -- offscreen canvas rendered via html-to-image; next/Image is incompatible */

import React, { type RefObject } from "react";
import type { RankingItem } from "@/types/ranking";
import {
  getTop6RowStyles as defaultGetTop6RowStyles,
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
  searchBadge: string;
};

type Props = {
  cardRef: RefObject<HTMLDivElement | null>;
  isDarkMode: boolean;
  theme: ThemeLike;
  category: string;
  competition: string;
  competitionLabels: Record<string, string>;
  filteredRanking: RankingItem[];
  getPilotFirstAndLastName: (name?: string) => string;
  getTop6RowStyles?: typeof defaultGetTop6RowStyles;
  normalizePilotName?: typeof defaultNormalizePilotName;
};

export default function PodiumShareCard({
  cardRef,
  isDarkMode,
  theme,
  category,
  competition,
  competitionLabels,
  filteredRanking,
  getPilotFirstAndLastName,
  getTop6RowStyles = defaultGetTop6RowStyles,
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
              Pódio oficial
            </p>
            <h2 className="mt-2 text-[40px] leading-tight font-extrabold tracking-tight">
              Top 6 — {category}
            </h2>
            <p
              className={`mt-2 text-[20px] font-semibold ${
                isDarkMode ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              {competitionLabels[competition] || competition}
            </p>
          </div>

          <div
            className={`rounded-full border px-5 py-2 text-[15px] font-bold tracking-[0.14em] uppercase ${
              isDarkMode
                ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                : theme.searchBadge
            }`}
          >
            Pódio
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          {[0, 2, 1].map((posIdx) => {
            const pilot = filteredRanking[posIdx];
            if (!pilot) return null;
            const podiumStyles = getTop6RowStyles(posIdx + 1);
            const posLabels = ["1°", "2°", "3°"];
            const posBadges = [
              "from-yellow-400 to-amber-500",
              "from-gray-300 to-gray-400",
              "from-amber-600 to-amber-800",
            ];

            return (
              <div
                key={`podium-top-${posIdx}`}
                className={`flex flex-col items-center rounded-[24px] border px-5 py-6 ${
                  isDarkMode
                    ? "border-white/10 bg-[#0f172a]"
                    : podiumStyles.row || "border-black/5 bg-white"
                }`}
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-xl font-black text-white shadow-lg ${posBadges[posIdx]}`}
                >
                  {posLabels[posIdx]}
                </div>

                {(() => {
                  const pilotoId = pilot.pilotoId || null;
                  return pilotoId ? (
                    <div
                      className={`mt-4 h-20 w-20 overflow-hidden rounded-[18px] border ${
                        isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-zinc-50"
                      }`}
                    >
                      <img
                        src={`/pilotos/${pilotoId}.jpg`}
                        alt={getPilotFirstAndLastName(pilot.piloto)}
                        className="h-full w-full object-cover object-center"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (e.target as HTMLImageElement).parentElement!.style.display = "flex";
                          (e.target as HTMLImageElement).parentElement!.innerHTML =
                            '<div class="flex h-full w-full items-center justify-center bg-zinc-100 text-2xl">🏎️</div>';
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className={`mt-4 flex h-20 w-20 items-center justify-center rounded-[18px] border text-3xl ${
                        isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-zinc-100"
                      }`}
                    >
                      🏎️
                    </div>
                  );
                })()}

                <p
                  className={`mt-3 text-center text-[22px] font-extrabold ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  {getPilotFirstAndLastName(pilot.piloto)}
                </p>
                {pilot.nomeGuerra && (
                  <p
                    className={`text-[16px] italic ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}
                  >
                    &quot;{normalizePilotName(pilot.nomeGuerra)}&quot;
                  </p>
                )}

                <p
                  className={`mt-2 text-[32px] font-extrabold tabular-nums ${
                    isDarkMode ? theme.darkAccentText : theme.primaryIcon
                  }`}
                >
                  {pilot.pontos} pts
                </p>

                <div className="mt-3 flex gap-3 text-center">
                  <div>
                    <p
                      className={`text-[11px] font-bold ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}
                    >
                      VIT
                    </p>
                    <p
                      className={`text-lg font-extrabold tabular-nums ${isDarkMode ? "text-zinc-200" : "text-zinc-700"}`}
                    >
                      {pilot.vitorias}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-[11px] font-bold ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}
                    >
                      PDS
                    </p>
                    <p
                      className={`text-lg font-extrabold tabular-nums ${isDarkMode ? "text-zinc-200" : "text-zinc-700"}`}
                    >
                      {pilot.podios}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-[11px] font-bold ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}
                    >
                      POL
                    </p>
                    <p
                      className={`text-lg font-extrabold tabular-nums ${isDarkMode ? "text-zinc-200" : "text-zinc-700"}`}
                    >
                      {pilot.poles}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[3, 4, 5].map((posIdx) => {
            const pilot = filteredRanking[posIdx];
            if (!pilot) return null;
            const pos4Badges = [
              "from-sky-400 to-blue-500",
              "from-violet-400 to-purple-500",
              "from-emerald-400 to-green-500",
            ];
            const posLabels = ["4°", "5°", "6°"];
            const podiumStyles = getTop6RowStyles(posIdx + 1);

            return (
              <div
                key={`podium-bottom-${posIdx}`}
                className={`flex items-center gap-4 rounded-[20px] border px-4 py-4 ${
                  isDarkMode
                    ? "border-white/10 bg-[#0f172a]"
                    : podiumStyles.row || "border-black/5 bg-white"
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-base font-black text-white shadow ${pos4Badges[posIdx - 3]}`}
                >
                  {posLabels[posIdx - 3]}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-[20px] font-extrabold ${isDarkMode ? "text-white" : "text-zinc-950"}`}
                  >
                    {getPilotFirstAndLastName(pilot.piloto)}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[24px] font-extrabold tabular-nums ${
                        isDarkMode ? theme.darkAccentText : theme.primaryIcon
                      }`}
                    >
                      {pilot.pontos} pts
                    </span>
                    <span
                      className={`text-[13px] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}
                    >
                      · {pilot.vitorias}V · {pilot.podios}P
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
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
