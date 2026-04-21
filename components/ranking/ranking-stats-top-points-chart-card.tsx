"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TopPointsBarChart = dynamic(() => import("@/components/charts/top-points-bar-chart"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-2xl bg-zinc-100/50" />,
});

type ThemeLike = {
  darkAccentIconWrap: string;
  darkAccentText: string;
  statsIconWrap: string;
  statsIcon: string;
  chartGrid: string;
  chartAxis: string;
  darkChartBar: string;
  chartBar: string;
};

type ChartPoint = {
  piloto: string;
  pontos: number;
};

type RankingStatsTopPointsChartCardProps = {
  topPointsChartData: ChartPoint[];
  theme: ThemeLike;
  isDarkMode: boolean;
  BarChart3Icon: React.ElementType;
};

export default function RankingStatsTopPointsChartCard({
  topPointsChartData,
  theme,
  isDarkMode,
  BarChart3Icon,
}: RankingStatsTopPointsChartCardProps) {
  return (
    <Card
      className={`overflow-hidden rounded-[22px] shadow-sm ${
        isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
      }`}
    >
      <CardHeader
        className={`${
          isDarkMode
            ? "border-b border-white/10 bg-gradient-to-r from-[#111827] via-[#161e2b] to-[#111827]"
            : "border-b border-black/5 bg-gradient-to-r from-white via-zinc-50/70 to-white"
        }`}
      >
        <CardTitle
          className={`flex items-center gap-3 ${isDarkMode ? "text-white" : "text-zinc-950"}`}
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
              isDarkMode ? theme.darkAccentIconWrap : theme.statsIconWrap
            }`}
          >
            <BarChart3Icon
              className={`h-5 w-5 ${isDarkMode ? theme.darkAccentText : theme.statsIcon}`}
            />
          </div>
          <div>
            <p
              className={`text-[9px] font-bold tracking-[0.14em] uppercase ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Desempenho oficial
            </p>
            <p
              className={`text-[16px] font-extrabold tracking-tight ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              Top 5 em pontos
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="h-72 pt-4">
        {topPointsChartData.length === 0 ? (
          <div
            className={`flex h-full items-center justify-center rounded-2xl text-sm ${
              isDarkMode
                ? "border border-dashed border-white/10 bg-[#0f172a] text-zinc-400"
                : "border border-dashed border-black/10 bg-zinc-50 text-zinc-500"
            }`}
          >
            Nenhum dado disponível para este campeonato.
          </div>
        ) : (
          <TopPointsBarChart
            data={topPointsChartData}
            isDarkMode={isDarkMode}
            chartGrid={theme.chartGrid}
            chartAxis={theme.chartAxis}
            chartBar={theme.chartBar}
            darkChartBar={theme.darkChartBar}
          />
        )}
      </CardContent>
    </Card>
  );
}
