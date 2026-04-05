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

export default function usePilotAnalysis({
  selectedPilot,
  filteredRanking,
  leader,
  category,
  competition,
}: UsePilotAnalysisProps) {
  const safeSelectedPilot: RankingItem = selectedPilot ?? {
    pos: 0,
    pilotoId: "",
    piloto: "",
    nomeGuerra: "",
    pontos: 0,
    adv: 0,
    participacoes: 0,
    vitorias: 0,
    poles: 0,
    mv: 0,
    podios: 0,
    descarte: 0,
    categoriaAtual: category,
    competicao: competition,
    categoria: category,
  };

  const selectedPilotGap = useMemo(() => {
    if (!selectedPilot || !leader) return "-";
    return getGapToLeader(leader.pontos, safeSelectedPilot.pontos);
  }, [selectedPilot, leader, safeSelectedPilot.pontos]);

  const selectedPilotAverage = useMemo(
    () => getPilotEfficiency(selectedPilot),
    [selectedPilot]
  );

  const selectedPilotBestAttribute = useMemo(
    () => getSelectedPilotBestAttribute(selectedPilot),
    [selectedPilot]
  );

  const selectedPilotConsistency = useMemo(
    () => getPilotConsistencyLabel(selectedPilot),
    [selectedPilot]
  );

  const selectedPilotMomentum = useMemo(
    () => getPilotMomentumLabel(selectedPilot, leader),
    [selectedPilot, leader]
  );

  const selectedPilotVsLeader = useMemo(() => {
    if (!selectedPilot || !leader) return 0;
    return getPerformancePercentage(
      safeSelectedPilot.pontos,
      leader.pontos || safeSelectedPilot.pontos || 1
    );
  }, [selectedPilot, leader, safeSelectedPilot.pontos]);

  const selectedPilotPodiumRate = useMemo(() => {
    if (!selectedPilot) return 0;
    return getPerformancePercentage(
      safeSelectedPilot.podios,
      safeSelectedPilot.participacoes || 1
    );
  }, [selectedPilot, safeSelectedPilot.podios, safeSelectedPilot.participacoes]);

  const selectedPilotWinRate = useMemo(() => {
    if (!selectedPilot) return 0;
    return getPerformancePercentage(
      safeSelectedPilot.vitorias,
      safeSelectedPilot.participacoes || 1
    );
  }, [selectedPilot, safeSelectedPilot.vitorias, safeSelectedPilot.participacoes]);

  const selectedPilotDiscipline = useMemo(() => {
    if (!selectedPilot || safeSelectedPilot.participacoes <= 0) return 100;
    const penalty = getPerformancePercentage(
      safeSelectedPilot.adv,
      safeSelectedPilot.participacoes
    );
    return Math.max(0, 100 - penalty);
  }, [selectedPilot, safeSelectedPilot.adv, safeSelectedPilot.participacoes]);

  const selectedPilotLeaderGapValue = useMemo(() => {
    if (!selectedPilot || !leader) return 0;
    return Math.max(0, leader.pontos - safeSelectedPilot.pontos);
  }, [selectedPilot, leader, safeSelectedPilot.pontos]);

  const selectedPilotWinRateLabel = useMemo(() => {
    if (!selectedPilot || safeSelectedPilot.participacoes <= 0) return "sem leitura";
    if (selectedPilotWinRate >= 40) return "índice vencedor";
    if (selectedPilotWinRate >= 20) return "boa conversão";
    if (selectedPilotWinRate > 0) return "ainda pode crescer";
    return "busca a 1ª vitória";
  }, [selectedPilot, safeSelectedPilot.participacoes, selectedPilotWinRate]);

  const selectedPilotPodiumRateLabel = useMemo(() => {
    if (!selectedPilot || safeSelectedPilot.participacoes <= 0) return "sem leitura";
    if (selectedPilotPodiumRate >= 70) return "top 6 muito forte";
    if (selectedPilotPodiumRate >= 50) return "regularidade alta";
    if (selectedPilotPodiumRate > 0) return "presença competitiva";
    return "fora do top 6";
  }, [selectedPilot, safeSelectedPilot.participacoes, selectedPilotPodiumRate]);

  const selectedPilotDisciplineLabel = useMemo(() => {
    if (!selectedPilot || safeSelectedPilot.participacoes <= 0) return "sem leitura";
    if (selectedPilotDiscipline >= 90) return "conduta exemplar";
    if (selectedPilotDiscipline >= 75) return "controle estável";
    if (selectedPilotDiscipline >= 60) return "atenção moderada";
    return "risco disciplinar";
  }, [selectedPilot, safeSelectedPilot.participacoes, selectedPilotDiscipline]);

  const selectedPilotRivalAhead = useMemo(() => {
    if (!selectedPilot) return null;

    const pilotIndex = filteredRanking.findIndex(
      (item) =>
        item.pilotoId === safeSelectedPilot.pilotoId &&
        item.competicao === safeSelectedPilot.competicao
    );

    if (pilotIndex <= 0) return null;
    return filteredRanking[pilotIndex - 1] || null;
  }, [filteredRanking, selectedPilot, safeSelectedPilot.pilotoId, safeSelectedPilot.competicao]);

  return {
    safeSelectedPilot,
    selectedPilotGap,
    selectedPilotAverage,
    selectedPilotBestAttribute,
    selectedPilotConsistency,
    selectedPilotMomentum,
    selectedPilotVsLeader,
    selectedPilotPodiumRate,
    selectedPilotWinRate,
    selectedPilotDiscipline,
    selectedPilotLeaderGapValue,
    selectedPilotWinRateLabel,
    selectedPilotPodiumRateLabel,
    selectedPilotDisciplineLabel,
    selectedPilotRivalAhead,
  };
}
