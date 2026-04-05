"use client";

import React from "react";

type RankingStatsRadarCardProps = {
  statsRadar: {
    hottestPilot: { piloto: string } | null;
    hottestLabel: string;
    podiumPressure: number;
    titleHeat: string;
  };
  statsSummary: {
    totalPilots: number;
    leaderAdvantage: number;
  };
  bestEfficiencyPilot: {
    piloto: string;
    pontos: number;
    participacoes: number;
  } | null;
  theme: {
    heroBorder: string;
    heroBg: string;
    primaryIconWrap: string;
    primaryIcon: string;
    darkAccentBorder?: string;
  };
  category: string;
  isDarkMode: boolean;
  HighlightCard: React.ElementType;
  StarIcon: React.ElementType;
  getPilotFirstAndLastName: (name?: string) => string;
};

export default function RankingStatsRadarCard({
  statsRadar,
  statsSummary,
  bestEfficiencyPilot,
  theme,
  category,
  isDarkMode,
  HighlightCard,
  StarIcon,
  getPilotFirstAndLastName,
}: RankingStatsRadarCardProps) {
  const darkCardClass = theme.darkAccentBorder
    ? `${theme.darkAccentBorder} bg-[#0f172a]`
    : "border-white/10 bg-[#0f172a]";

  return (
    <div className="grid grid-cols-1 gap-3">
      <HighlightCard
        title="Radar oficial"
        icon={StarIcon}
        accent
        isDark={isDarkMode}
        categoryTheme={theme}
        accentStyles={{
          border: theme.heroBorder,
          bg: `bg-gradient-to-b ${theme.heroBg}`,
          iconWrap: theme.primaryIconWrap,
          icon: theme.primaryIcon,
          text:
            category === "Base"
              ? "text-orange-800"
              : category === "Graduados"
                ? "text-blue-800"
                : "text-yellow-800",
          divider:
            category === "Base"
              ? "bg-orange-200/80"
              : category === "Graduados"
                ? "bg-blue-200/80"
                : "bg-yellow-200/80",
        }}
      >
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div
            className={`rounded-[16px] border px-2.5 py-2.5 ${
              isDarkMode ? darkCardClass : "border-black/5 bg-white/80"
            }`}
          >
            <p
              className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Momento do grid
            </p>
            <p
              className={`mt-1 text-[15px] font-extrabold leading-tight ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              {statsRadar.hottestLabel}
            </p>
            <p
              className={`mt-1 text-[11px] leading-snug ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              {statsRadar.hottestPilot
                ? `${getPilotFirstAndLastName(statsRadar.hottestPilot.piloto)} lidera a leitura de impacto.`
                : "Sem piloto destacado nesta seleção."}
            </p>
          </div>

          <div
            className={`rounded-[16px] border px-2.5 py-2.5 ${
              isDarkMode ? darkCardClass : "border-black/5 bg-white/80"
            }`}
          >
            <p
              className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Temperatura do título
            </p>
            <p
              className={`mt-1 text-[15px] font-extrabold leading-tight ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              {statsRadar.titleHeat}
            </p>
            <p
              className={`mt-1 text-[11px] leading-snug ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              {statsSummary.totalPilots > 1
                ? `${statsSummary.leaderAdvantage} pts separam líder e vice.`
                : "Ainda não há duelo consolidado nesta seleção."}
            </p>
          </div>

          <div
            className={`rounded-[16px] border px-2.5 py-2.5 ${
              isDarkMode ? darkCardClass : "border-black/5 bg-white/80"
            }`}
          >
            <p
              className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Pressão do Top 6
            </p>
            <p
              className={`mt-1 text-[15px] font-extrabold leading-tight ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              {statsRadar.podiumPressure} pts
            </p>
            <p
              className={`mt-1 text-[11px] leading-snug ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              diferença entre o topo do pódio ampliado e a zona de troféu.
            </p>
          </div>

          <div
            className={`rounded-[16px] border px-2.5 py-2.5 ${
              isDarkMode ? darkCardClass : "border-black/5 bg-white/80"
            }`}
          >
            <p
              className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Eficiência oficial
            </p>
            <p
              className={`mt-1 text-[15px] font-extrabold leading-tight ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              {bestEfficiencyPilot
                ? getPilotFirstAndLastName(bestEfficiencyPilot.piloto)
                : "Sem leitura"}
            </p>
            <p
              className={`mt-1 text-[11px] leading-snug ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              {bestEfficiencyPilot
                ? `${(bestEfficiencyPilot.pontos / Math.max(bestEfficiencyPilot.participacoes, 1)).toFixed(1)} pts por participação.`
                : "Nenhuma participação registrada para calcular eficiência."}
            </p>
          </div>
        </div>
      </HighlightCard>
    </div>
  );
}
