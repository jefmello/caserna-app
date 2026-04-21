"use client";

import { useMemo } from "react";
import {
  getCategoryTheme,
  getPilotNameParts,
  getSpotlightCategoryStyles,
  getTopMetricRanking,
  getTopPointsChartData,
  normalizePilotName,
  getPilotTrendStatus,
  getTitleFightStatus,
  type PilotTrendStatus,
} from "@/lib/ranking/ranking-utils";
import type { RankingCompetitionMeta, RankingData, RankingItem } from "@/types/ranking";

type UseRankingScreenControllerParams = {
  category: string;
  competition: string;
  isDarkMode: boolean;
  filteredRanking: RankingItem[];
  rankingData: RankingData;
  leader: RankingItem | null;
  currentCompetitionMeta?: RankingCompetitionMeta | null;
};

export default function useRankingScreenController({
  category,
  competition,
  isDarkMode,
  filteredRanking,
  rankingData,
  leader,
  currentCompetitionMeta,
}: UseRankingScreenControllerParams) {
  const leaderName = useMemo(() => getPilotNameParts(leader?.piloto), [leader]);

  const theme = useMemo(() => getCategoryTheme(category), [category]);

  const spotlightStyles = useMemo(
    () => getSpotlightCategoryStyles(category, isDarkMode),
    [category, isDarkMode]
  );

  const top3TitleFight = useMemo(() => filteredRanking.slice(0, 3), [filteredRanking]);

  const pilotTrendMap = useMemo<Record<string, PilotTrendStatus>>(() => {
    const categoryData = rankingData[category];
    const map: Record<string, PilotTrendStatus> = {};

    filteredRanking.forEach((pilot) => {
      const key = pilot.pilotoId || normalizePilotName(pilot.piloto);
      map[key] = getPilotTrendStatus({
        pilot,
        competition,
        categoryData,
      });
    });

    return map;
  }, [filteredRanking, rankingData, category, competition]);

  const titleFightStatus = useMemo(
    () => currentCompetitionMeta?.titleFight || getTitleFightStatus(top3TitleFight),
    [top3TitleFight, currentCompetitionMeta]
  );

  const topPointsChartData = useMemo(
    () => getTopPointsChartData(filteredRanking, 5),
    [filteredRanking]
  );

  const topVitorias = useMemo(
    () => getTopMetricRanking(filteredRanking, "vitorias", 5),
    [filteredRanking]
  );

  const topPoles = useMemo(
    () => getTopMetricRanking(filteredRanking, "poles", 5),
    [filteredRanking]
  );

  const topMv = useMemo(() => getTopMetricRanking(filteredRanking, "mv", 5), [filteredRanking]);

  const topPodios = useMemo(
    () => getTopMetricRanking(filteredRanking, "podios", 5),
    [filteredRanking]
  );

  return {
    leaderName,
    theme,
    spotlightStyles,
    top3TitleFight,
    pilotTrendMap,
    titleFightStatus,
    topPointsChartData,
    topVitorias,
    topPoles,
    topMv,
    topPodios,
  };
}
