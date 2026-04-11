import type { RankingItem } from "@/types/ranking";

/**
 * Tabela oficial de pontos por posição no campeonato Caserna Kart Racing.
 * Este é a ÚNICA fonte verdadeira para cálculos de pontuação.
 * Qualquer alteração aqui deve ser comunicada à organização do campeonato.
 */
export const STAGE_POINTS_BY_POSITION: Record<number, number> = {
  1: 35,
  2: 32,
  3: 30,
  4: 28,
  5: 26,
  6: 24,
  7: 22,
  8: 21,
  9: 20,
  10: 19,
  11: 18,
  12: 17,
  13: 16,
  14: 15,
  15: 14,
  16: 13,
  17: 12,
  18: 11,
  19: 10,
  20: 9,
  21: 8,
  22: 7,
  23: 6,
  24: 5,
  25: 4,
  26: 3,
  27: 2,
  28: 1,
};

/**
 * Etapas que NÃO possuem ponto de pole position.
 */
export const NO_POLE_STAGES = [2, 5, 8];

/**
 * Mapeamento de competições para suas respectivas etapas.
 * GERAL combina T2 + T3 (etapas 4-9).
 */
export const CHAMPIONSHIP_STAGE_MAP: Record<string, number[]> = {
  T1: [1, 2, 3],
  T2: [4, 5, 6],
  T3: [7, 8, 9],
  GERAL: [4, 5, 6, 7, 8, 9],
};

/**
 * Etapas já concluídas por padrão. Stage 1 é considerada realizada
 * para que as projeções comecem a partir da stage 2.
 */
export const DEFAULT_COMPLETED_STAGES = [1];

const MAX_STAGE_BASE_POINTS = STAGE_POINTS_BY_POSITION[1] || 35;

export function getRemainingChampionshipStages(
  competition: string,
  completedStages: number[]
) {
  const stages = CHAMPIONSHIP_STAGE_MAP[competition] || [];
  return stages.filter((stage) => !completedStages.includes(stage));
}

export function getStageMaxPoints(stage: number) {
  const basePoints = MAX_STAGE_BASE_POINTS;
  const fastestLapPoint = 1;
  const polePoint = NO_POLE_STAGES.includes(stage) ? 0 : 1;

  return basePoints + fastestLapPoint + polePoint;
}

export function getMaxPointsFromStages(stages: number[]) {
  return stages.reduce((total, stage) => total + getStageMaxPoints(stage), 0);
}

export function getStagePodiumScenarioPoints(stage: number) {
  const basePoints = STAGE_POINTS_BY_POSITION[3] || 30;
  const fastestLapPoint = 1;

  return basePoints + fastestLapPoint;
}

export function resolvePilotKey(pilot: Pick<RankingItem, "pilotoId" | "piloto">) {
  return pilot.pilotoId || pilot.piloto;
}
