"use client";

import { useEffect, useMemo, useState } from "react";
import type { RankingData, RankingMetaData } from "@/types/ranking";
import { normalizePilotName } from "@/lib/ranking/ranking-utils";

type UseRankingFiltersProps = {
  rankingData: RankingData;
  rankingMeta: RankingMetaData;
  categories: string[];
};

export default function useRankingFilters({
  rankingData,
  rankingMeta,
  categories,
}: UseRankingFiltersProps) {
  const [category, setCategory] = useState("Base");
  const [competition, setCompetition] = useState("T1");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (categories.length === 0) return;

    setCategory((prev) => (categories.includes(prev) ? prev : categories[0]));
  }, [categories]);

  const availableCompetitions = useMemo(() => {
    return Object.keys(rankingData[category] || {});
  }, [rankingData, category]);

  useEffect(() => {
    if (availableCompetitions.length === 0) return;

    setCompetition((prev) =>
      availableCompetitions.includes(prev) ? prev : availableCompetitions[0]
    );
  }, [availableCompetitions]);

  const currentCompetitionList = useMemo(() => {
    return rankingData[category]?.[competition] || [];
  }, [rankingData, category, competition]);

  const currentCompetitionMeta = useMemo(() => {
    return rankingMeta[category]?.[competition] || null;
  }, [rankingMeta, category, competition]);

  const filteredRanking = useMemo(() => {
    return currentCompetitionList.filter(
      (item) =>
        item.pontos > 0 &&
        normalizePilotName(item.piloto)
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [currentCompetitionList, search]);

  const leader = filteredRanking[0];

  return {
    category,
    setCategory,
    competition,
    setCompetition,
    search,
    setSearch,
    availableCompetitions,
    currentCompetitionList,
    currentCompetitionMeta,
    filteredRanking,
    leader,
  };
}
