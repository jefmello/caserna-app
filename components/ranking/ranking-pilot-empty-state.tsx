"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Swords, Trophy } from "lucide-react";

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
      className={`rounded-2xl shadow-sm ${
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

        <div className="mt-6 flex flex-col items-center gap-3">
          <div
            className={`flex w-full max-w-xs items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
              isDarkMode
                ? "border-white/10 bg-[#0f172a] hover:bg-[#161e2b]"
                : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
            }`}
          >
            <Trophy
              className={`h-5 w-5 shrink-0 ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                isDarkMode ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Clique em qualquer piloto na tabela acima
            </span>
          </div>

          <div
            className={`flex w-full max-w-xs items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
              isDarkMode
                ? "border-white/10 bg-[#0f172a] hover:bg-[#161e2b]"
                : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
            }`}
          >
            <Swords
              className={`h-5 w-5 shrink-0 ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                isDarkMode ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Selecione dois pilotos na aba Duelos para comparar
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
