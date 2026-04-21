"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { CategoryTheme } from "@/lib/ranking/theme-utils";

type RankingPilotComparisonCardProps = {
  isDarkMode: boolean;
  theme: CategoryTheme;
  selectedPilotLeaderGapValue: number;
  selectedPilotVsLeader: number;
  selectedPilotGap: string;
  selectedPilotWinRate: number;
  selectedPilotWinRateLabel: string;
  selectedPilotPodiumRate: number;
  selectedPilotPodiumRateLabel: string;
  selectedPilotDiscipline: number;
  selectedPilotDisciplineLabel: string;
  safeSelectedPilot: {
    vitorias: number;
    participacoes: number;
    podios: number;
    adv: number;
  };
  TrophyIcon: React.ElementType;
  CrownIcon: React.ElementType;
  MedalIcon: React.ElementType;
  GaugeIcon: React.ElementType;
};

export default function RankingPilotComparisonCard({
  isDarkMode,
  theme,
  selectedPilotLeaderGapValue,
  selectedPilotVsLeader,
  selectedPilotGap,
  selectedPilotWinRate,
  selectedPilotWinRateLabel,
  selectedPilotPodiumRate,
  selectedPilotPodiumRateLabel,
  selectedPilotDiscipline,
  selectedPilotDisciplineLabel,
  safeSelectedPilot,
  TrophyIcon,
  CrownIcon,
  MedalIcon,
  GaugeIcon,
}: RankingPilotComparisonCardProps) {
  return (
    <Card
      className={`rounded-[24px] shadow-sm ${
        isDarkMode
          ? `border ${theme.darkAccentBorder} bg-[#111827]`
          : `border ${theme.titleBorder} bg-gradient-to-br ${theme.titleBg}`
      }`}
    >
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p
              className={`text-[10px] font-bold tracking-[0.16em] uppercase ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}
            >
              Comparativo oficial
            </p>
            <h3
              className={`text-[20px] font-bold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}
            >
              Momento competitivo do piloto
            </h3>
          </div>

          <div
            className={`rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.12em] uppercase ${isDarkMode ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}` : theme.headerChip}`}
          >
            leitura rápida
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Card
            className={`rounded-[22px] shadow-none ${isDarkMode ? `${theme.darkAccentBorder} bg-[#0f172a]` : `${theme.heroBorder} bg-gradient-to-b ${theme.heroBg}`}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-1.5">
                <div>
                  <p
                    className={`text-[10px] font-bold tracking-[0.16em] uppercase ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}
                  >
                    Distância do líder
                  </p>
                  <p
                    className={`mt-1 text-[24px] leading-none font-black tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}
                  >
                    {selectedPilotLeaderGapValue}
                    <span
                      className={`ml-1 text-[12px] font-bold ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}
                    >
                      pts
                    </span>
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap}`}
                >
                  <TrophyIcon
                    className={`h-4.5 w-4.5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`}
                  />
                </div>
              </div>
              <div
                className={`mt-3 h-2.5 w-full overflow-hidden rounded-full ${isDarkMode ? "bg-white/10" : "bg-zinc-100"}`}
              >
                <div
                  className={`h-full rounded-full ${isDarkMode ? "bg-white/80" : "bg-zinc-900"}`}
                  style={{ width: `${selectedPilotVsLeader}%` }}
                />
              </div>
              <p
                className={`mt-2 text-[11px] leading-snug ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}
              >
                {selectedPilotGap === "líder"
                  ? "piloto já ocupa a liderança da seleção"
                  : `${selectedPilotVsLeader}% do rendimento em pontos do líder atual`}
              </p>
            </CardContent>
          </Card>

          <Card
            className={`rounded-[22px] shadow-none ${isDarkMode ? "border border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-1.5">
                <div>
                  <p
                    className={`text-[10px] font-bold tracking-[0.16em] uppercase ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}
                  >
                    Aproveitamento em vitórias
                  </p>
                  <p
                    className={`mt-1 text-[24px] leading-none font-black tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}
                  >
                    {selectedPilotWinRate}%
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap}`}
                >
                  <CrownIcon
                    className={`h-4.5 w-4.5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`}
                  />
                </div>
              </div>
              <div
                className={`mt-3 h-2.5 w-full overflow-hidden rounded-full ${isDarkMode ? "bg-white/10" : "bg-zinc-100"}`}
              >
                <div
                  className={`h-full rounded-full ${isDarkMode ? "bg-white/80" : "bg-zinc-900"}`}
                  style={{ width: `${selectedPilotWinRate}%` }}
                />
              </div>
              <p
                className={`mt-2 text-[11px] leading-snug ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}
              >
                {selectedPilotWinRateLabel} · {safeSelectedPilot.vitorias} vitória(s) em{" "}
                {safeSelectedPilot.participacoes} participação(ões)
              </p>
            </CardContent>
          </Card>

          <Card
            className={`rounded-[22px] shadow-none ${isDarkMode ? "border border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-1.5">
                <div>
                  <p
                    className={`text-[10px] font-bold tracking-[0.16em] uppercase ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}
                  >
                    Taxa de pódios
                  </p>
                  <p
                    className={`mt-1 text-[24px] leading-none font-black tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}
                  >
                    {selectedPilotPodiumRate}%
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap}`}
                >
                  <MedalIcon
                    className={`h-4.5 w-4.5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`}
                  />
                </div>
              </div>
              <div
                className={`mt-3 h-2.5 w-full overflow-hidden rounded-full ${isDarkMode ? "bg-white/10" : "bg-zinc-100"}`}
              >
                <div
                  className={`h-full rounded-full ${isDarkMode ? "bg-white/80" : "bg-zinc-900"}`}
                  style={{ width: `${selectedPilotPodiumRate}%` }}
                />
              </div>
              <p
                className={`mt-2 text-[11px] leading-snug ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}
              >
                {selectedPilotPodiumRateLabel} · presença no top 6 em {safeSelectedPilot.podios}{" "}
                etapa(s)
              </p>
            </CardContent>
          </Card>

          <Card
            className={`rounded-[22px] shadow-none ${isDarkMode ? "border border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-1.5">
                <div>
                  <p
                    className={`text-[10px] font-bold tracking-[0.16em] uppercase ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}
                  >
                    Nível disciplinar
                  </p>
                  <p
                    className={`mt-1 text-[24px] leading-none font-black tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}
                  >
                    {selectedPilotDiscipline}%
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap}`}
                >
                  <GaugeIcon
                    className={`h-4.5 w-4.5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`}
                  />
                </div>
              </div>
              <div
                className={`mt-3 h-2.5 w-full overflow-hidden rounded-full ${isDarkMode ? "bg-white/10" : "bg-zinc-100"}`}
              >
                <div
                  className={`h-full rounded-full ${isDarkMode ? "bg-white/80" : "bg-zinc-900"}`}
                  style={{ width: `${selectedPilotDiscipline}%` }}
                />
              </div>
              <p
                className={`mt-2 text-[11px] leading-snug ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}
              >
                {selectedPilotDisciplineLabel} · {safeSelectedPilot.adv} advertências em{" "}
                {safeSelectedPilot.participacoes} participação(ões)
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
