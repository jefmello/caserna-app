import type { RankingItem } from "@/types/ranking";
import type { TitleProbabilityCandidate } from "@/lib/ranking/title-probability-engine";
import { buildTitleProbabilityCandidates } from "@/lib/ranking/title-probability-engine";
import {
  getStageMaxPoints,
  getStagePodiumScenarioPoints,
  resolvePilotKey,
} from "@/lib/ranking/stage-points-engine";

export type NextStageScenario = {
  pilot: RankingItem;
  currentProbability: number;
  winProbability: number;
  podiumProbability: number;
  zeroProbability: number;
  winDelta: number;
  podiumDelta: number;
  zeroDelta: number;
  swingLabel: string;
  narrative: string;
};

export function getNextStageSwingLabel(delta: number) {
  if (delta >= 10) return "vira o campeonato";
  if (delta >= 6) return "acende a disputa";
  if (delta >= 3) return "ganha pressão real";
  if (delta > 0) return "sobe de forma controlada";
  if (delta === 0) return "segura a mesma leitura";
  return "perde força matemática";
}

export function buildNextStageScenarios({
  nextStageNumber,
  titleProbabilities,
  filteredRanking,
  competition,
  titlePointsStillAvailable,
}: {
  nextStageNumber: number | null;
  titleProbabilities: TitleProbabilityCandidate[];
  filteredRanking: RankingItem[];
  competition: string;
  titlePointsStillAvailable: number;
}): NextStageScenario[] {
  if (!nextStageNumber || titleProbabilities.length === 0) return [];

  const nextStageWinPoints = getStageMaxPoints(nextStageNumber);
  const nextStagePodiumPoints = getStagePodiumScenarioPoints(nextStageNumber);

  return titleProbabilities.map((candidate) => {
    const key = resolvePilotKey(candidate.pilot);

    const winProjection = buildTitleProbabilityCandidates({
      ranking: filteredRanking,
      competition,
      titlePointsStillAvailable: Math.max(titlePointsStillAvailable - nextStageWinPoints, 0),
      pointsOverrides: {
        [key]: candidate.pilot.pontos + nextStageWinPoints,
      },
    }).find((item) => resolvePilotKey(item.pilot) === key);

    const podiumProjection = buildTitleProbabilityCandidates({
      ranking: filteredRanking,
      competition,
      titlePointsStillAvailable: Math.max(titlePointsStillAvailable - nextStagePodiumPoints, 0),
      pointsOverrides: {
        [key]: candidate.pilot.pontos + nextStagePodiumPoints,
      },
    }).find((item) => resolvePilotKey(item.pilot) === key);

    const winProbability = winProjection?.probability ?? candidate.probability;
    const podiumProbability = podiumProjection?.probability ?? candidate.probability;
    const zeroProbability = Math.max(
      candidate.probability - Math.min(nextStageWinPoints * 0.12, 4.5),
      0
    );
    const winDelta = winProbability - candidate.probability;
    const podiumDelta = podiumProbability - candidate.probability;
    const zeroDelta = zeroProbability - candidate.probability;

    return {
      pilot: candidate.pilot,
      currentProbability: candidate.probability,
      winProbability,
      podiumProbability,
      zeroProbability,
      winDelta,
      podiumDelta,
      zeroDelta,
      swingLabel: getNextStageSwingLabel(Number(winDelta.toFixed(1))),
      narrative:
        winDelta >= 6
          ? "vence e muda o eixo da disputa imediatamente"
          : winDelta >= 3
            ? "vence e aumenta a pressão sobre o bloco da frente"
            : winDelta > 0
              ? "vence e melhora a rota matemática"
              : "mesmo vencendo, ainda depende de combinação de resultados",
    };
  });
}
