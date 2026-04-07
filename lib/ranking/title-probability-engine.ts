import type { RankingItem } from "@/types/ranking";
import { resolvePilotKey } from "@/lib/ranking/stage-points-engine";

export type TitleProbabilityCandidate = {
  pilot: RankingItem;
  probability: number;
  projectedTotal: number;
  titleReach: number;
  pointsBehindLeader: number;
  canStillReachLeader: boolean;
  label: string;
  tone: string;
  scenarioLabel: string;
};

export function getTitleProbabilityScenarioLabel(
  probability: number,
  pointsBehindLeader: number
) {
  if (probability >= 34) {
    return pointsBehindLeader === 0
      ? "controla a corrida pelo título"
      : "segue pressionando forte o líder";
  }

  if (probability >= 22) {
    return "mantém presença real na disputa";
  }

  if (probability >= 12) {
    return "ainda tem rota competitiva";
  }

  if (probability >= 6) {
    return "precisa combinar reação e tropeço rival";
  }

  return "vive de cenário extremo até o fim";
}

export function getTitleProbabilityLabel(probability: number) {
  if (probability >= 34) {
    return {
      label: "FAVORITO",
      tone: "border-emerald-300 bg-emerald-50 text-emerald-700",
    };
  }

  if (probability >= 22) {
    return {
      label: "PERSEGUIDOR",
      tone: "border-sky-300 bg-sky-50 text-sky-700",
    };
  }

  if (probability >= 12) {
    return {
      label: "NA BRIGA",
      tone: "border-violet-300 bg-violet-50 text-violet-700",
    };
  }

  if (probability >= 6) {
    return {
      label: "DEPENDE",
      tone: "border-amber-300 bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "MILAGRE",
    tone: "border-zinc-300 bg-zinc-100 text-zinc-700",
  };
}

export function buildTitleProbabilityCandidates({
  ranking,
  competition,
  titlePointsStillAvailable,
  pointsOverrides,
}: {
  ranking: RankingItem[];
  competition: string;
  titlePointsStillAvailable: number;
  pointsOverrides?: Record<string, number>;
}): TitleProbabilityCandidate[] {
  if (ranking.length === 0) return [];

  const candidates = ranking.slice(0, 6);
  const leaderPoints = Math.max(
    ...candidates.map((pilot) => {
      const key = resolvePilotKey(pilot);
      return pointsOverrides?.[key] ?? pilot.pontos;
    })
  );

  const rawCandidates = candidates.map((pilot) => {
    const key = resolvePilotKey(pilot);
    const adjustedPoints = pointsOverrides?.[key] ?? pilot.pontos;
    const pointsBehindLeader = Math.max(leaderPoints - adjustedPoints, 0);
    const projectedTotal = adjustedPoints + titlePointsStillAvailable;
    const titleReach = projectedTotal - leaderPoints;
    const canStillReachLeader = projectedTotal >= leaderPoints;
    const reachFactor = Math.max(titleReach, 0);
    const discardProtection =
      competition === "GERAL" ? Math.max(pilot.descarte || 0, 0) : 0;
    const momentumBoost =
      pilot.vitorias * 3 +
      pilot.podios * 1.4 +
      pilot.poles * 0.9 +
      pilot.mv * 0.9;
    const score =
      projectedTotal * 0.58 +
      adjustedPoints * 0.26 +
      reachFactor * 0.12 +
      discardProtection * 0.08 +
      momentumBoost -
      pointsBehindLeader * 0.1;

    return {
      pilot,
      projectedTotal,
      titleReach,
      pointsBehindLeader,
      canStillReachLeader,
      rawScore: Math.max(score, canStillReachLeader ? 1 : 0.25),
    };
  });

  const totalScore = rawCandidates.reduce(
    (sum, candidate) => sum + candidate.rawScore,
    0
  );

  return rawCandidates
    .map((candidate) => {
      const probability = totalScore > 0 ? (candidate.rawScore / totalScore) * 100 : 0;
      const { label, tone } = getTitleProbabilityLabel(probability);

      return {
        pilot: candidate.pilot,
        probability,
        projectedTotal: candidate.projectedTotal,
        titleReach: candidate.titleReach,
        pointsBehindLeader: candidate.pointsBehindLeader,
        canStillReachLeader: candidate.canStillReachLeader,
        label,
        tone,
        scenarioLabel: getTitleProbabilityScenarioLabel(
          probability,
          candidate.pointsBehindLeader
        ),
      };
    })
    .sort((a, b) => b.probability - a.probability);
}
