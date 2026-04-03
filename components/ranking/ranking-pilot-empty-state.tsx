"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

type RankingPilotEmptyStateProps = {
  isDarkMode: boolean;
  theme: {
    darkAccentIconWrap: string;
    darkAccentText: string;
  };
  UserIcon: React.ElementType;
};

export default function RankingPilotEmptyState({
  isDarkMode,
  theme,
  UserIcon,
}: RankingPilotEmptyStateProps) {
  return (
    <Card
      className={`rounded-[20px] shadow-sm ${
        isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
      }`}
    >
      <CardContent className="p-8 text-center">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-3xl ${
            isDarkMode ? theme.darkAccentIconWrap : "bg-zinc-100"
          }`}
        >
          <UserIcon
            className={`h-7 w-7 ${
              isDarkMode ? theme.darkAccentText : "text-zinc-500"
            }`}
          />
        </div>
        <p
          className={`mt-4 text-base font-semibold ${
            isDarkMode ? "text-white" : "text-zinc-950"
          }`}
        >
          Nenhum piloto selecionado
        </p>
        <p
          className={`mt-2 text-sm ${
            isDarkMode ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          Toque em um piloto na classificação para abrir o perfil.
        </p>
      </CardContent>
    </Card>
  );
}
