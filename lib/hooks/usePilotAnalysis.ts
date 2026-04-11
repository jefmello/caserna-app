"use client";

import { useMemo } from "react";
import type { RankingItem } from "@/types/ranking";
import {
  getGapToLeader,
  getPerformancePercentage,
  getSelectedPilotBestAttribute,
  getPilotConsistencyLabel,
  getPilotMomentumLabel,
  getPilotEfficiency,
} from "@/lib/ranking/ranking-utils";

type UsePilotAnalysisProps = {
  selectedPilot: RankingItem | null;
  filteredRanking: RankingItem[];
  leader: RankingItem | undefined;
  category: string;
  competition: string;
};

type PilotAnalysis = {
  pilot: RankingItem;
  gapToLeader: string;
  averagePointsPerRace: number;
  bestAttribute: { label: string; value: number };
  consistencyLabel: string;
  momentumLabel: string;
  performanceVsLeader: number;
  podiumRate: number;
  winRate: number;
  discipline: number;
  leaderGapValue: number;
  winRateLabel: string;
  podiumRateLabel: string;
  disciplineLabel: string;
  rivalAhead: RankingItem | null;
};

export default function usePilotAnalysis({
  selectedPilot,
  filteredRanking,
  leader,
}: UsePilotAnalysisProps): PilotAnalysis | null {
  const analysis = useMemo<PilotAnalysis | null>(() => {
    if (!selectedPilot) return null;

    const gapToLeader = leader
      ? getGapToLeader(leader.pontos, selectedPilot.pontos)
      : "-";

    const averagePointsPerRace = getPilotEfficiency(selectedPilot);
    const bestAttribute = getSelectedPilotBestAttribute(selectedPilot);
    const consistencyLabel = getPilotConsistencyLabel(selectedPilot);
    const momentumLabel = getPilotMomentumLabel(selectedPilot, leader);

    const performanceVsLeader =
      selectedPilot && leader
        ? getPerformancePercentage(
            selectedPilot.pontos,
            Math.max(leader.pontos, selectedPilot.pontos, 1)
          )
        : 0;

    const podiumRate =
      selectedPilot.participacoes > 0
        ? getPerformancePercentage(
            selectedPilot.podios,
            selectedPilot.participacoes
          )
        : 0;

    const winRate =
      selectedPilot.participacoes > 0
        ? getPerformancePercentage(
            selectedPilot.vitorias,
            selectedPilot.participacoes
          )
        : 0;

    const discipline =
      selectedPilot.participacoes > 0
        ? Math.max(
            0,
            100 -
              getPerformancePercentage(
                selectedPilot.adv,
                selectedPilot.participacoes
              )
          )
        : 100;

    const leaderGapValue = leader
      ? Math.max(0, leader.pontos - selectedPilot.pontos)
      : 0;

    const winRateLabel =
      selectedPilot.participacoes <= 0
        ? "sem leitura"
        : winRate >= 40
          ? "índice vencedor"
          : winRate >= 20
            ? "boa conversão"
            : winRate > 0
              ? "ainda pode crescer"
              : "busca a 1ª vitória";

    const podiumRateLabel =
      selectedPilot.participacoes <= 0
        ? "sem leitura"
        : podiumRate >= 70
          ? "top 6 muito forte"
          : podiumRate >= 50
            ? "regularidade alta"
            : podiumRate > 0
              ? "presença competitiva"
              : "fora do top 6";

    const disciplineLabel =
      selectedPilot.participacoes <= 0
        ? "sem leitura"
        : discipline >= 90
          ? "conduta exemplar"
          : discipline >= 75
            ? "controle estável"
            : discipline >= 60
              ? "atenção moderada"
              : "risco disciplinar";

    const rivalAhead = findRivalAhead(filteredRanking, selectedPilot);

    return {
      pilot: selectedPilot,
      gapToLeader,
      averagePointsPerRace,
      bestAttribute,
      consistencyLabel,
      momentumLabel,
      performanceVsLeader,
      podiumRate,
      winRate,
      discipline,
      leaderGapValue,
      winRateLabel,
      podiumRateLabel,
      disciplineLabel,
      rivalAhead,
    };
  }, [selectedPilot, filteredRanking, leader]);

  return analysis;
}

function findRivalAhead(
  filteredRanking: RankingItem[],
  selectedPilot: RankingItem
): RankingItem | null {
  const pilotIndex = filteredRanking.findIndex(
    (item) =>
      item.pilotoId === selectedPilot.pilotoId &&
      item.competicao === selectedPilot.competicao
  );

  if (pilotIndex <= 0) return null;
  return filteredRanking[pilotIndex - 1] || null;
}
