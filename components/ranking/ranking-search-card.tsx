"use client";

import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type RankingSearchCardProps = {
  isDarkMode: boolean;
  theme: {
    darkAccentBorder: string;
    darkAccentBg: string;
    darkAccentText: string;
    darkAccentIconWrap: string;
    primaryIconWrap: string;
    searchIcon: string;
    searchBadge: string;
    searchBorder: string;
    searchGlow: string;
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
  return (
    <Card
      className={`rounded-[20px] shadow-sm ${
        isDarkMode
          ? `border ${theme.darkAccentBorder} bg-[#111827]`
          : `border ${theme.searchBorder} bg-gradient-to-br from-white via-white to-zinc-50/70`
      }`}
    >
      <CardContent className="p-2.5">
        <div className="mb-2.5 flex items-center gap-2">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] ${
              isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
            }`}
          >
            <Search
              className={`h-4.5 w-4.5 ${
                isDarkMode ? theme.darkAccentText : theme.searchIcon
              }`}
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-zinc-400">
              Busca rápida
            </p>
            <p
              className={`mt-0.5 text-[11px] font-semibold leading-tight ${
                isDarkMode ? "text-white" : "text-zinc-900"
              }`}
            >
              Encontre um piloto na classificação
            </p>
          </div>

          <div
            className={`shrink-0 rounded-full border px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] ${
              isDarkMode
                ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                : theme.searchBadge
            }`}
          >
            {competitionLabels[competition] || competition}
          </div>
        </div>

        <div
          className={`group flex items-center rounded-[16px] border px-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.98)] transition ${
            isDarkMode
              ? `${theme.darkAccentBorder} bg-[#0f172a]`
              : `border-black/5 bg-gradient-to-b from-white to-zinc-50 focus-within:ring-4 ${theme.searchGlow}`
          }`}
        >
          <div className="flex h-8 w-7 items-center justify-center">
            <Search className="h-4.5 w-4.5 shrink-0 text-zinc-400" />
          </div>
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar piloto"
            className={`h-10 border-0 bg-transparent pl-0.5 pr-0 text-[14px] shadow-none outline-none ring-0 focus-visible:ring-0 ${
              isDarkMode
                ? "text-white placeholder:text-zinc-500"
                : "text-zinc-950 placeholder:text-zinc-400"
            }`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
