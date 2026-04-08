"use client";

import { useEffect, useMemo, useState } from "react";
import type { RankingData, RankingMetaData } from "@/types/ranking";
import { normalizePilotName } from "@/lib/ranking/ranking-utils";
import { useChampionship } from "@/context/championship-context";

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
  const { categoria, campeonato, setCategoria, setCampeonato } =
    useChampionship();

  const [search, setSearch] = useState("");

  const category = categoria;
  const competition = campeonato;

  useEffect(() => {
    if (categories.length === 0) return;

    if (!categories.includes(categoria)) {
      setCategoria(categories[0]);
    }
  }, [categories, categoria, setCategoria]);

  const availableCompetitions = useMemo(() => {
    return Object.keys(rankingData[category] || {});
  }, [rankingData, category]);

  useEffect(() => {
    if (availableCompetitions.length === 0) return;

    setCampeonato(
      availableCompetitions.includes(competition)
        ? competition
        : availableCompetitions[0]
    );
  }, [availableCompetitions, competition, setCampeonato]);

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
    setCategory: setCategoria,
    competition,
    setCompetition: setCampeonato,
    search,
    setSearch,
    availableCompetitions,
    currentCompetitionList,
    currentCompetitionMeta,
    filteredRanking,
    leader,
  };
}