"use client";

import React from "react";
import { Search, Timer, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type RankingSearchCardProps = {
  isDarkMode: boolean;
  theme: {
    darkAccentBorder?: string;
    darkAccentBg?: string;
    darkAccentBgSoft?: string;
    darkAccentIconWrap?: string;
    darkAccentText?: string;
    primaryIconWrap?: string;
    primaryIcon?: string;
    primaryBadge?: string;
    searchBorder?: string;
    searchIcon?: string;
  };
  competition: string;
  competitionLabels: Record<string, string>;
  search: string;
  onSearchChange: (value: string) => void;
};

export default function RankingSearchCard({
  isDarkMode,
  theme,
  competition,
  competitionLabels,
  search,
  onSearchChange,
}: RankingSearchCardProps) {
  const competitionLabel = competitionLabels[competition] || competition;
  const hasSearch = search.trim().length > 0;

  return (
    <Card
      className={`overflow-hidden rounded-[22px] border shadow-sm transition-all duration-200 ${
        isDarkMode
          ? `border-white/10 bg-[linear-gradient(180deg,#0e1420_0%,#0b111b_100%)]`
          : `border-black/5 bg-white`
      }`}
    >
      <CardContent className="p-3 sm:p-3.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] ${
                  isDarkMode
                    ? theme.darkAccentIconWrap || "bg-white/5"
                    : theme.primaryIconWrap || "bg-zinc-100"
                }`}
              >
                <Search
                  className={`h-4.5 w-4.5 ${
                    isDarkMode
                      ? theme.darkAccentText || "text-white"
                      : theme.primaryIcon || "text-zinc-700"
                  }`}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Busca rápida
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <p
                    className={`text-[14px] font-extrabold tracking-tight ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    Localize um piloto instantaneamente
                  </p>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                      isDarkMode
                        ? `${theme.darkAccentBorder || "border-white/10"} bg-white/[0.04] ${theme.darkAccentText || "text-white"}`
                        : "border-black/5 bg-zinc-50 text-zinc-700"
                    }`}
                  >
                    <Timer className="h-3 w-3" />
                    {competitionLabel}
                  </span>
                </div>

                <p
                  className={`mt-1 text-[11px] leading-snug ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  Digite nome, sobrenome ou nome de guerra para filtrar a
                  classificação oficial.
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:min-w-[420px] lg:max-w-[520px] lg:flex-1">
            <div className="relative flex-1">
              <Search
                className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                  isDarkMode
                    ? "text-zinc-500"
                    : theme.searchIcon || "text-zinc-400"
                }`}
              />

              <Input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Buscar piloto..."
                className={`h-11 rounded-[16px] pl-10 pr-10 text-[13px] font-medium shadow-none transition-all duration-200 ${
                  isDarkMode
                    ? "border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-500 focus-visible:border-white/20 focus-visible:ring-0"
                    : "border-black/5 bg-zinc-50/80 text-zinc-950 placeholder:text-zinc-400 focus-visible:border-zinc-300 focus-visible:bg-white focus-visible:ring-0"
                }`}
              />

              {hasSearch ? (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className={`absolute right-2 top-1/2 inline-flex h-7 min-w-7 -translate-y-1/2 items-center justify-center rounded-full px-2 text-[10px] font-bold uppercase tracking-[0.08em] transition ${
                    isDarkMode
                      ? "bg-white/8 text-zinc-300 hover:bg-white/12 hover:text-white"
                      : "bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                  aria-label="Limpar busca"
                >
                  limpar
                </button>
              ) : null}
            </div>

            <div
              className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[16px] border px-3 sm:w-auto ${
                isDarkMode
                  ? `${theme.darkAccentBorder || "border-white/10"} bg-white/[0.04]`
                  : "border-black/5 bg-zinc-50"
              }`}
            >
              <Trophy
                className={`h-4 w-4 ${
                  isDarkMode
                    ? theme.darkAccentText || "text-white"
                    : theme.primaryIcon || "text-zinc-700"
                }`}
              />
              <span
                className={`text-[11px] font-bold uppercase tracking-[0.12em] ${
                  isDarkMode ? "text-zinc-200" : "text-zinc-700"
                }`}
              >
                filtro oficial
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}