"use client";

import React from "react";
import { BarChart3 } from "lucide-react";

type RankingStatsHeaderProps = {
  isDarkMode: boolean;
  theme: {
    darkAccentBorder: string;
    titleBorder: string;
    statsSoft: string;
    primaryRing: string;
    darkAccentIconWrap: string;
    statsIconWrap: string;
    darkAccentText: string;
    statsIcon: string;
    darkAccentBg: string;
    headerChip: string;
  };
  category: string;
  competition: string;
  competitionLabels: Record<string, string>;
};

export default function RankingStatsHeader({
  isDarkMode,
  theme,
  category,
  competition,
  competitionLabels,
}: RankingStatsHeaderProps) {
  return (
    <div
      className={`overflow-hidden rounded-[22px] shadow-sm ${
        isDarkMode
          ? `border ${theme.darkAccentBorder} bg-[#111827]`
          : `border ${theme.titleBorder} bg-gradient-to-br ${theme.statsSoft}`
      }`}
    >
      <div className="relative px-4 py-4">
        <div
          className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${theme.primaryRing} to-transparent`}
        />

        <div className="flex items-center justify-between gap-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                isDarkMode ? theme.darkAccentIconWrap : theme.statsIconWrap
              }`}
            >
              <BarChart3
                className={`h-5 w-5 ${isDarkMode ? theme.darkAccentText : theme.statsIcon}`}
              />
            </div>

            <div className="min-w-0">
              <p
                className={`text-[10px] font-bold tracking-[0.16em] uppercase ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Central de estatísticas
              </p>
              <h2
                className={`text-[17px] font-extrabold tracking-tight ${
                  isDarkMode ? "text-white" : "text-zinc-950"
                }`}
              >
                Stats da classificação
              </h2>
              <p
                className={`text-[11px] font-semibold ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                {category} · {competitionLabels[competition] || competition}
              </p>
            </div>
          </div>

          <div
            className={`rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.12em] uppercase ${
              isDarkMode
                ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                : theme.headerChip
            }`}
          >
            Painel premium
          </div>
        </div>
      </div>
    </div>
  );
}
