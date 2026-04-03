"use client";

import React from "react";
import { Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type ThemeLike = {
  darkAccentBorder: string;
  darkAccentBg: string;
  darkAccentText: string;
  darkAccentIconWrap: string;
  primaryIconWrap: string;
  searchIcon: string;
  searchBadge: string;
  searchBorder: string;
};

type RankingClassificationShareCardProps = {
  isDarkMode: boolean;
  theme: ThemeLike;
  isSharingImage: boolean;
  filteredRankingLength: number;
  onShare: () => void;
};

export default function RankingClassificationShareCard({
  isDarkMode,
  theme,
  isSharingImage,
  filteredRankingLength,
  onShare,
}: RankingClassificationShareCardProps) {
  return (
    <Card
      className={`rounded-[20px] shadow-sm ${
        isDarkMode
          ? `border ${theme.darkAccentBorder} bg-[#111827]`
          : `border ${theme.searchBorder} bg-gradient-to-br from-white via-white to-zinc-50/70`
      }`}
    >
      <CardContent className="p-2.5">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] ${
                isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
              }`}
            >
              <Share2
                className={`h-4.5 w-4.5 ${
                  isDarkMode ? theme.darkAccentText : theme.searchIcon
                }`}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                Compartilhamento oficial
              </p>
              <p
                className={`mt-0.5 text-[11px] font-semibold leading-tight ${
                  isDarkMode ? "text-white" : "text-zinc-900"
                }`}
              >
                Gere uma imagem pronta da classificação atual
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onShare}
            disabled={isSharingImage || filteredRankingLength === 0}
            className={`shrink-0 rounded-full border px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] transition-all duration-200 ${
              isDarkMode
                ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText} disabled:opacity-50`
                : `${theme.searchBadge} disabled:opacity-50`
            }`}
          >
            {isSharingImage ? "Gerando..." : "Compartilhar"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
