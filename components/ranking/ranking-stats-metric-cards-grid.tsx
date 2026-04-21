"use client";

import React from "react";
import type { CategoryTheme } from "@/lib/ranking/theme-utils";
import type { RankingItem } from "@/types/ranking";

type RankingStatsMetricCardsGridProps = {
  StatRankingCardComponent: React.ElementType;
  topVitorias: RankingItem[];
  topPoles: RankingItem[];
  topMv: RankingItem[];
  topPodios: RankingItem[];
  theme: CategoryTheme;
  isDarkMode: boolean;
  TrophyIcon: React.ElementType;
  FlagIcon: React.ElementType;
  TimerIcon: React.ElementType;
  MedalIcon: React.ElementType;
};

export default function RankingStatsMetricCardsGrid({
  StatRankingCardComponent,
  topVitorias,
  topPoles,
  topMv,
  topPodios,
  theme,
  isDarkMode,
  TrophyIcon,
  FlagIcon,
  TimerIcon,
  MedalIcon,
}: RankingStatsMetricCardsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <StatRankingCardComponent
        title="Mais vitórias"
        icon={TrophyIcon}
        items={topVitorias}
        metricKey="vitorias"
        emptyLabel="Nenhuma vitória registrada nesta seleção."
        theme={theme}
        isDark={isDarkMode}
      />

      <StatRankingCardComponent
        title="Mais poles"
        icon={FlagIcon}
        items={topPoles}
        metricKey="poles"
        emptyLabel="Nenhuma pole registrada nesta seleção."
        theme={theme}
        isDark={isDarkMode}
      />

      <StatRankingCardComponent
        title="Mais VMR"
        icon={TimerIcon}
        items={topMv}
        metricKey="mv"
        emptyLabel="Nenhuma volta mais rápida registrada nesta seleção."
        theme={theme}
        isDark={isDarkMode}
      />

      <StatRankingCardComponent
        title="Mais pódios"
        icon={MedalIcon}
        items={topPodios}
        metricKey="podios"
        emptyLabel="Nenhum pódio registrado nesta seleção."
        theme={theme}
        isDark={isDarkMode}
      />
    </div>
  );
}
