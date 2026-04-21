"use client";

import React from "react";
import RankingTitleFightCard from "@/components/ranking/ranking-title-fight-card";
import {
  getGapToLeader,
  getPilotFirstAndLastName,
  getPilotWarNameDisplay,
} from "@/lib/ranking/ranking-utils";
import type { RankingItem, TitleFightStatus } from "@/types/ranking";
import type { CategoryTheme } from "@/lib/ranking/theme-utils";

type ClassificacaoTitleFightSectionProps = {
  isDarkMode: boolean;
  theme: CategoryTheme;
  titleFightStatus: TitleFightStatus;
  top3TitleFight: RankingItem[];
  category: string;
  onSelectPilot: (pilot: RankingItem) => void;
};

export default function ClassificacaoTitleFightSection({
  isDarkMode,
  theme,
  titleFightStatus,
  top3TitleFight,
  category,
  onSelectPilot,
}: ClassificacaoTitleFightSectionProps) {
  return (
    <RankingTitleFightCard
      isDarkMode={isDarkMode}
      theme={theme}
      titleFightStatus={titleFightStatus}
      top3TitleFight={top3TitleFight}
      category={category}
      handleSelectPilot={onSelectPilot}
      getGapToLeader={getGapToLeader}
      getPilotFirstAndLastName={getPilotFirstAndLastName}
      getPilotWarNameDisplay={getPilotWarNameDisplay}
    />
  );
}
