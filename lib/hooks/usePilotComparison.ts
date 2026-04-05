"use client";

import { useMemo } from "react";
import type { RankingItem } from "@/types/ranking";
import {
  getComparisonWinner,
  getDuelNarrative,
  getDuelProfileLabel,
} from "@/lib/ranking/ranking-utils";

type UsePilotComparisonProps = {
  comparePilotAId: string;
  comparePilotBId: string;
  filteredRanking: RankingItem[];
  isDarkMode: boolean;
};

export default function usePilotComparison({
  comparePilotAId,
  comparePilotBId,
  filteredRanking,
  isDarkMode,
}: UsePilotComparisonProps) {
  const comparePilotA = useMemo(
    () =>
      filteredRanking.find(
        (item) => (item.pilotoId || item.piloto) === comparePilotAId
      ) || null,
    [filteredRanking, comparePilotAId]
  );

  const comparePilotB = useMemo(
    () =>
      filteredRanking.find(
        (item) => (item.pilotoId || item.piloto) === comparePilotBId
      ) || null,
    [filteredRanking, comparePilotBId]
  );

  const duelMetrics = useMemo(() => {
    if (!comparePilotA || !comparePilotB) return [];

    return [
      {
        label: "Pontos",
        shortLabel: "PTS",
        a: comparePilotA.pontos,
        b: comparePilotB.pontos,
        lowerIsBetter: false,
        description: "força no campeonato atual",
      },
      {
        label: "Vitórias",
        shortLabel: "VIT",
        a: comparePilotA.vitorias,
        b: comparePilotB.vitorias,
        lowerIsBetter: false,
        description: "capacidade de decidir corridas",
      },
      {
        label: "Poles",
        shortLabel: "POL",
        a: comparePilotA.poles,
        b: comparePilotB.poles,
        lowerIsBetter: false,
        description: "arrancada de classificação",
      },
      {
        label: "VMR",
        shortLabel: "VMR",
        a: comparePilotA.mv,
        b: comparePilotB.mv,
        lowerIsBetter: false,
        description: "ritmo de volta rápida",
      },
      {
        label: "Pódios",
        shortLabel: "PDS",
        a: comparePilotA.podios,
        b: comparePilotB.podios,
        lowerIsBetter: false,
        description: "presença no top 6",
      },
      {
        label: "Participações",
        shortLabel: "PART",
        a: comparePilotA.participacoes,
        b: comparePilotB.participacoes,
        lowerIsBetter: false,
        description: "volume competitivo",
      },
      {
        label: "ADV",
        shortLabel: "ADV",
        a: comparePilotA.adv,
        b: comparePilotB.adv,
        lowerIsBetter: true,
        description: "disciplina na pista",
      },
    ];
  }, [comparePilotA, comparePilotB]);

  const duelSummary = useMemo(() => {
    if (!comparePilotA || !comparePilotB || duelMetrics.length === 0) {
      return null;
    }

    let scoreA = 0;
    let scoreB = 0;

    duelMetrics.forEach((metric) => {
      const winner = getComparisonWinner(
        metric.a,
        metric.b,
        metric.lowerIsBetter
      );
      if (winner === "a") scoreA += 1;
      if (winner === "b") scoreB += 1;
    });

    const pointsWinner = getComparisonWinner(
      comparePilotA.pontos,
      comparePilotB.pontos,
      false
    );
    const advWinner = getComparisonWinner(
      comparePilotA.adv,
      comparePilotB.adv,
      true
    );
    const overallWinner =
      scoreA === scoreB ? pointsWinner : scoreA > scoreB ? "a" : "b";
    const scoreDiff = Math.abs(scoreA - scoreB);
    const pointsDiff = Math.abs(comparePilotA.pontos - comparePilotB.pontos);

    return {
      scoreA,
      scoreB,
      pointsWinner,
      advWinner,
      overallWinner,
      scoreDiff,
      pointsDiff,
      narrative: getDuelNarrative({ scoreA, scoreB, pointsDiff }),
      profileLabel: getDuelProfileLabel({
        scoreA,
        scoreB,
        pointsWinner,
        advWinner,
      }),
    };
  }, [comparePilotA, comparePilotB, duelMetrics]);

  const duelIntensity = useMemo(() => {
    if (!duelSummary) {
      return {
        label: "SEM LEITURA",
        tone: isDarkMode
          ? "border-white/10 bg-white/5 text-zinc-300"
          : "border-zinc-200 bg-zinc-50 text-zinc-600",
        description: "Aguardando confronto válido.",
      };
    }

    if (duelSummary.overallWinner === "tie") {
      if (duelSummary.pointsDiff <= 3) {
        return {
          label: "EMPATE TÉCNICO",
          tone: isDarkMode
            ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
            : "border-yellow-200 bg-yellow-50 text-yellow-700",
          description: "Nenhum piloto conseguiu abrir vantagem clara.",
        };
      }

      return {
        label: "PRESSÃO NOS DETALHES",
        tone: isDarkMode
          ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
          : "border-blue-200 bg-blue-50 text-blue-700",
        description: "O duelo está equilibrado, mas com leve inclinação pontual.",
      };
    }

    if (duelSummary.scoreDiff >= 4) {
      return {
        label: "SUPERIORIDADE CLARA",
        tone: isDarkMode
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-emerald-200 bg-emerald-50 text-emerald-700",
        description: "Um dos lados domina a maior parte dos territórios do confronto.",
      };
    }

    if (duelSummary.scoreDiff >= 2) {
      return {
        label: "VANTAGEM CONSISTENTE",
        tone: isDarkMode
          ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
          : "border-blue-200 bg-blue-50 text-blue-700",
        description: "Há superioridade real, mas ainda existe espaço para reação.",
      };
    }

    return {
      label: "DUELO APERTADO",
      tone: isDarkMode
        ? "border-orange-500/30 bg-orange-500/10 text-orange-300"
        : "border-orange-200 bg-orange-50 text-orange-700",
      description: "A disputa segue aberta e sensível a qualquer mudança de ritmo.",
    };
  }, [duelSummary, isDarkMode]);

  const duelWinnerPilot = useMemo(() => {
    if (!duelSummary || !comparePilotA || !comparePilotB) return null;
    if (duelSummary.overallWinner === "a") return comparePilotA;
    if (duelSummary.overallWinner === "b") return comparePilotB;
    return null;
  }, [duelSummary, comparePilotA, comparePilotB]);

  return {
    comparePilotA,
    comparePilotB,
    duelMetrics,
    duelSummary,
    duelIntensity,
    duelWinnerPilot,
  };
}
