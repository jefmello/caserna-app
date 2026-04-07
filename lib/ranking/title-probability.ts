// lib/ranking/title-probability.ts

export const STAGE_POINTS_BY_POSITION: Record<number, number> = {
  1: 35, 2: 32, 3: 30, 4: 28, 5: 26, 6: 24, 7: 22, 8: 20,
  9: 18, 10: 16, 11: 15, 12: 14, 13: 13, 14: 12, 15: 11, 16: 10,
  17: 9, 18: 8, 19: 7, 20: 6, 21: 5, 22: 4, 23: 3, 24: 2,
  25: 1, 26: 1, 27: 1, 28: 1,
};

export const NO_POLE_STAGES = [2, 5, 8];

export const CHAMPIONSHIP_STAGE_MAP = {
  T1: [1, 2, 3],
  T2: [4, 5, 6],
  T3: [7, 8, 9],
};

export const DEFAULT_COMPLETED_STAGES = [1];

export function getRemainingChampionshipStages(
  competition: string,
  completedStages: number[] = DEFAULT_COMPLETED_STAGES
) {
  if (competition === "GERAL") {
    return [...CHAMPIONSHIP_STAGE_MAP.T2, ...CHAMPIONSHIP_STAGE_MAP.T3].filter(
      (stage) => !completedStages.includes(stage)
    );
  }

  const stages =
    CHAMPIONSHIP_STAGE_MAP[
      competition as keyof typeof CHAMPIONSHIP_STAGE_MAP
    ] || [];

  return stages.filter((stage) => !completedStages.includes(stage));
}

export function getStageMaxPoints(stage: number) {
  const base = STAGE_POINTS_BY_POSITION[1] || 35;
  const fastestLap = 1;
  const pole = NO_POLE_STAGES.includes(stage) ? 0 : 1;

  return base + fastestLap + pole;
}

export function getMaxPointsFromStages(stages: number[]) {
  return stages.reduce((total, stage) => {
    return total + getStageMaxPoints(stage);
  }, 0);
}

export function getStagePodiumScenarioPoints(stage: number) {
  const base = STAGE_POINTS_BY_POSITION[3] || 30;
  const fastestLap = 1;
  const pole = NO_POLE_STAGES.includes(stage) ? 0 : 1;

  return base + fastestLap + pole;
}

export function getTitleProbabilityLabel(probability: number) {
  if (probability >= 40) {
    return {
      label: "FAVORITO",
      tone: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    };
  }

  if (probability >= 20) {
    return {
      label: "PERSEGUIDOR",
      tone: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    };
  }

  if (probability >= 10) {
    return {
      label: "NA BRIGA",
      tone: "bg-sky-500/10 text-sky-600 border-sky-500/20",
    };
  }

  if (probability >= 5) {
    return {
      label: "DEPENDE",
      tone: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    };
  }

  return {
    label: "MILAGRE",
    tone: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  };
}

export function buildTitleProbabilityCandidates(
  filteredRanking: any[],
  competition: string,
  completedStages: number[] = DEFAULT_COMPLETED_STAGES
) {
  if (!filteredRanking?.length) return [];

  const candidates = filteredRanking.slice(0, 6);

  const remainingStages = getRemainingChampionshipStages(
    competition,
    completedStages
  );

  const maxRemaining = getMaxPointsFromStages(remainingStages);

  const scores = candidates.map((pilot) => {
    let projectedTotal = pilot.pontos + maxRemaining;

    if (competition === "GERAL") {
      projectedTotal = pilot.pontos + maxRemaining;
    }

    const score =
      projectedTotal * 0.6 +
      pilot.pontos * 0.3 +
      pilot.vitorias * 2 +
      pilot.podios * 1;

    return {
      pilot,
      projectedTotal,
      score,
      basePoints: pilot.pontos,
    };
  });

  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);

  return scores.map((s) => {
    const probability =
      totalScore > 0 ? (s.score / totalScore) * 100 : 0;

    const { label, tone } = getTitleProbabilityLabel(probability);

    return {
      ...s,
      probability,
      label,
      tone,
    };
  });
}