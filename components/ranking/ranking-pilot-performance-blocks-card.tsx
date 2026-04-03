"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  isDarkMode: boolean;
  theme: any;
  safeSelectedPilot: any;
  selectedPilotAverage: number;
  selectedPilotGap: string;
  selectedPilotLeaderGapValue: number;
  SwordsIcon: React.ElementType;
  BarChart3Icon: React.ElementType;
  TablePropertiesIcon: React.ElementType;
};

export default function RankingPilotPerformanceBlocksCard({
  isDarkMode,
  theme,
  safeSelectedPilot,
  selectedPilotAverage,
  selectedPilotGap,
  selectedPilotLeaderGapValue,
  SwordsIcon,
  BarChart3Icon,
  TablePropertiesIcon,
}: Props) {
  return (
    <Card className={`rounded-[24px] shadow-sm ${
      isDarkMode
        ? `border ${theme.darkAccentBorder} bg-[#111827]`
        : `border ${theme.titleBorder} bg-gradient-to-br ${theme.titleBg}`
    }`}>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Card><CardContent className="p-4">Ataque: {safeSelectedPilot.vitorias}</CardContent></Card>
          <Card><CardContent className="p-4">Consistência: {safeSelectedPilot.podios}</CardContent></Card>
          <Card><CardContent className="p-4">Status: {selectedPilotAverage}</CardContent></Card>
        </div>
      </CardContent>
    </Card>
  );
}
