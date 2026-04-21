"use client";

import React from "react";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { useChampionship } from "@/context/championship-context";
import type { CategoryTheme } from "@/lib/ranking/theme-utils";

type RankingHeaderProps = {
  isDarkMode?: boolean;
  theme: CategoryTheme;
  categories: string[];
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>> | ((value: string) => void);
  availableCompetitions: string[];
  competition: string;
  setCompetition: React.Dispatch<React.SetStateAction<string>> | ((value: string) => void);
  competitionLabels: Record<string, string>;
  toggleDarkMode?: () => void;
};

export default function RankingHeader({
  isDarkMode: isDarkModeProp,
  theme,
  categories: _categories,
  category: _category,
  setCategory: _setCategory,
  availableCompetitions,
  competition,
  setCompetition,
  competitionLabels,
  toggleDarkMode,
}: RankingHeaderProps) {
  const { isDarkMode: globalIsDarkMode, toggleTheme } = useChampionship();

  const isDarkMode = typeof isDarkModeProp === "boolean" ? isDarkModeProp : globalIsDarkMode;

  const handleToggleDarkMode = toggleDarkMode ?? toggleTheme;

  return (
    <header
      className={`sticky top-0 z-20 mb-1.5 overflow-hidden rounded-[20px] shadow-[0_10px_25px_rgba(15,23,42,0.06)] ${
        isDarkMode ? "border border-white/10 bg-[#111827]" : "border border-black/5 bg-white"
      }`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent ${theme.primaryRing} to-transparent`}
      />

      <div className="space-y-1 px-2.5 pt-2 pb-1.5">
        <div
          className={`overflow-hidden rounded-[15px] ${
            isDarkMode ? "border border-white/10 bg-[#0f172a]" : "border border-black/5 bg-zinc-50"
          }`}
        >
          <div className="relative h-[62px] w-full sm:h-[70px] md:h-[78px]">
            <Image
              src="/banner-topo.png"
              alt="Classificação Oficial"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 448px"
              className="object-contain object-center"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-1">
          <div
            className={`rounded-[15px] px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] ${
              isDarkMode
                ? "border border-white/10 bg-gradient-to-b from-[#111827] to-[#0f172a]"
                : "border border-black/5 bg-gradient-to-b from-zinc-50 to-white"
            }`}
          >
            <div className="mb-0.5 flex items-center justify-between">
              <p
                className={`text-[8px] font-bold tracking-[0.16em] uppercase ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-400"
                }`}
              >
                Campeonato
              </p>
              <div
                className={`ml-2 h-px flex-1 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    : "bg-gradient-to-r from-zinc-200/0 via-zinc-200 to-zinc-200/0"
                }`}
              />
            </div>

            <div className="flex items-center justify-between gap-1.5">
              <div className="flex flex-wrap gap-1.5">
                {availableCompetitions.map((comp) => {
                  const active = competition === comp;
                  return (
                    <button
                      key={comp}
                      onClick={() => setCompetition(comp)}
                      className={`rounded-full border px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition-all duration-200 ${
                        active
                          ? "border-yellow-400 bg-gradient-to-b from-[#fff8d2] to-[#f5e8a6] text-[#7a5600] shadow-[0_4px_10px_rgba(234,179,8,0.22)]"
                          : isDarkMode
                            ? "border-white/10 bg-[#111827] text-zinc-200 shadow-sm hover:border-yellow-500/30 hover:bg-yellow-500/10"
                            : "border-zinc-200 bg-white text-zinc-700 shadow-sm hover:border-yellow-200 hover:bg-yellow-50/40"
                      }`}
                    >
                      {competitionLabels[comp] || comp}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleToggleDarkMode}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                  isDarkMode
                    ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText} hover:opacity-90`
                    : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                }`}
                aria-label={isDarkMode ? "Ativar modo diurno" : "Ativar modo noturno"}
                title={isDarkMode ? "Ativar modo diurno" : "Ativar modo noturno"}
              >
                {isDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
