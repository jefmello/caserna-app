"use client";

import React from "react";

type RankingStatsSummaryGridProps = {
  statsSummary: {
    totalPilots: number;
    leaderAdvantage: number;
    avgPoints: number;
    top6CutPoints: number;
  };
  theme: unknown;
  isDarkMode: boolean;
  CompactStatCard: React.ComponentType<{
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ElementType;
    accent?: boolean;
    isDark?: boolean;
    categoryTheme: unknown;
  }>;
  UsersIcon: React.ElementType;
  CrownIcon: React.ElementType;
  GaugeIcon: React.ElementType;
  MedalIcon: React.ElementType;
};

export default function RankingStatsSummaryGrid({
  statsSummary,
  theme,
  isDarkMode,
  CompactStatCard,
  UsersIcon,
  CrownIcon,
  GaugeIcon,
  MedalIcon,
}: RankingStatsSummaryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <CompactStatCard
        title="Pilotos ativos"
        value={statsSummary.totalPilots}
        subtitle="com pontuação na seleção atual"
        icon={UsersIcon}
        categoryTheme={theme}
        isDark={isDarkMode}
      />
      <CompactStatCard
        title="Vantagem do líder"
        value={`${statsSummary.leaderAdvantage} pts`}
        subtitle="sobre o 2º colocado"
        icon={CrownIcon}
        accent
        categoryTheme={theme}
        isDark={isDarkMode}
      />
      <CompactStatCard
        title="Média geral"
        value={statsSummary.totalPilots ? statsSummary.avgPoints.toFixed(1) : "0.0"}
        subtitle="pontos por piloto nesta leitura"
        icon={GaugeIcon}
        categoryTheme={theme}
        isDark={isDarkMode}
      />
      <CompactStatCard
        title="Corte Top 6"
        value={`${statsSummary.top6CutPoints} pts`}
        subtitle="pontuação mínima da zona de troféu"
        icon={MedalIcon}
        accent
        categoryTheme={theme}
        isDark={isDarkMode}
      />
    </div>
  );
}
