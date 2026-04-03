"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

type GenericComponent = React.ComponentType<any>;

type RankingStatsTopPointsChartCardProps = {
  topPointsChartData: ChartPoint[];
  theme: ThemeLike;
  isDarkMode: boolean;
  BarChart3Icon: React.ElementType;
  ResponsiveContainerComponent: GenericComponent;
  CartesianGridComponent: GenericComponent;
  XAxisComponent: GenericComponent;
  YAxisComponent: GenericComponent;
  TooltipComponent: GenericComponent;
  BarChartComponent: GenericComponent;
  BarComponent: GenericComponent;
};

export default function RankingStatsTopPointsChartCard({
  topPointsChartData,
  theme,
  isDarkMode,
  BarChart3Icon,
  ResponsiveContainerComponent,
  CartesianGridComponent,
  XAxisComponent,
  YAxisComponent,
  TooltipComponent,
  BarChartComponent,
  BarComponent,
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
          className={`flex items-center gap-3 ${
            isDarkMode ? "text-white" : "text-zinc-950"
          }`}
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
              isDarkMode ? theme.darkAccentIconWrap : theme.statsIconWrap
            }`}
          >
            <BarChart3Icon
              className={`h-5 w-5 ${
                isDarkMode ? theme.darkAccentText : theme.statsIcon
              }`}
            />
          </div>
          <div>
            <p
              className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
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
          <ResponsiveContainerComponent width="100%" height="100%">
            <BarChartComponent data={topPointsChartData}>
              <CartesianGridComponent
                stroke={isDarkMode ? "rgba(255,255,255,0.08)" : theme.chartGrid}
                strokeDasharray="3 3"
              />
              <XAxisComponent
                dataKey="piloto"
                stroke={isDarkMode ? "#9ca3af" : theme.chartAxis}
              />
              <YAxisComponent
                stroke={isDarkMode ? "#9ca3af" : theme.chartAxis}
              />
              <TooltipComponent
                contentStyle={{
                  background: isDarkMode ? "#111827" : "#ffffff",
                  border: isDarkMode
                    ? "1px solid rgba(255,255,255,0.10)"
                    : "1px solid rgba(15,23,42,0.08)",
                  color: isDarkMode ? "#ffffff" : "#111827",
                  borderRadius: 16,
                }}
              />
              <BarComponent
                dataKey="pontos"
                fill={isDarkMode ? theme.darkChartBar : theme.chartBar}
                radius={[10, 10, 0, 0]}
              />
            </BarChartComponent>
          </ResponsiveContainerComponent>
        )}
      </CardContent>
    </Card>
  );
}
