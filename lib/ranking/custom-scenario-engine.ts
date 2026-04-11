import type { RankingItem } from "@/types/ranking";
import {
  STAGE_POINTS_BY_POSITION,
  NO_POLE_STAGES,
  resolvePilotKey,
} from "@/lib/ranking/stage-points-engine";

/**
 * Mapeamento de piloto para posição de chegada escolhida pelo usuário.
 * Chave = pilotoId ou piloto, Valor = posição (1-28).
 */
export type CustomScenarioAssignment = Record<string, number>;

/**
 * Piloto com projeção de pontos após cenário simulado.
 */
export type ProjectedPilot = RankingItem & {
  projectedPoints: number;
  pointsGained: number;
  positionChange: number;
};

/**
 * Resultado completo de uma simulação personalizada.
 */
export type CustomScenarioResult = {
  projectedRanking: ProjectedPilot[];
  leaderChange: {
    oldLeader: string | null;
    newLeader: string | null;
    pointsDiff: number;
  };
  biggestGainer: {
    pilotName: string;
    pointsGained: number;
  } | null;
  biggestLoser: {
    pilotName: string;
    pointsLost: number;
  } | null;
  totalPilots: number;
  assignedPilots: number;
  unassignedPilots: number;
};

/**
 * Valida se uma posição é válida (existe na tabela de pontos).
 */
export function isValidPosition(position: number): boolean {
  return position >= 1 && position <= Object.keys(STAGE_POINTS_BY_POSITION).length;
}

/**
 * Calcula os pontos que um piloto ganha baseado na posição de chegada.
 * Posição 1: pontos base (35) + pole (1, se aplicável) + melhor volta (1).
 * Posições 2+: apenas pontos base.
 */
export function calculateStagePoints(
  finishingPosition: number,
  stageNumber: number,
  hasPolePoint: boolean = true,
  hasFastestLapPoint: boolean = true
): number {
  if (!isValidPosition(finishingPosition)) return 0;

  const basePoints = STAGE_POINTS_BY_POSITION[finishingPosition] || 0;
  const polePoint = hasPolePoint && !NO_POLE_STAGES.includes(stageNumber) ? 1 : 0;
  const fastestLapPoint = hasFastestLapPoint ? 1 : 0;

  // Apenas posição 1 ganha pole e VMR
  if (finishingPosition === 1) {
    return basePoints + polePoint + fastestLapPoint;
  }

  return basePoints;
}

/**
 * Executa uma simulação personalizada completa.
 *
 * @param ranking - Lista atual do ranking
 * @param assignments - Mapa de pilotoId/piloto → posição escolhida
 * @param stageNumber - Número da etapa sendo simulada
 * @param competition - Competição atual (para descarte se GERAL)
 * @returns Resultado completo com ranking projetado e análises
 */
export function runCustomScenario({
  ranking,
  assignments,
  stageNumber,
  competition,
}: {
  ranking: RankingItem[];
  assignments: CustomScenarioAssignment;
  stageNumber: number;
  competition: string;
}): CustomScenarioResult {
  const hasPole = !NO_POLE_STAGES.includes(stageNumber);

  // Projeta pontos de cada piloto
  const projectedPilots: ProjectedPilot[] = ranking.map((pilot) => {
    const key = resolvePilotKey(pilot);
    const assignedPosition = assignments[key];
    const pointsGained = assignedPosition
      ? calculateStagePoints(assignedPosition, stageNumber, hasPole)
      : 0;
    const projectedPoints = pilot.pontos + pointsGained;

    return {
      ...pilot,
      projectedPoints,
      pointsGained,
      positionChange: 0, // será calculado após ordenação
    };
  });

  // Ordena pelo ranking projetado
  const sorted = projectedPilots
    .map((pilot, _, arr) => {
      const projectedIndex = [...arr]
        .sort((a, b) => {
          if (b.projectedPoints !== a.projectedPoints) return b.projectedPoints - a.projectedPoints;
          if (a.adv !== b.adv) return a.adv - b.adv;
          if (b.participacoes !== a.participacoes) return b.participacoes - a.participacoes;
          if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
          return a.pos - b.pos;
        })
        .findIndex((p) => resolvePilotKey(p) === resolvePilotKey(pilot));

      const oldPos = pilot.pos;
      const newPos = projectedIndex + 1;

      return {
        ...pilot,
        positionChange: oldPos - newPos,
      };
    })
    .sort((a, b) => {
      if (b.projectedPoints !== a.projectedPoints) return b.projectedPoints - a.projectedPoints;
      if (a.adv !== b.adv) return a.adv - b.adv;
      if (b.participacoes !== a.participacoes) return b.participacoes - a.participacoes;
      if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
      return a.pos - b.pos;
    });

  // Análises
  const oldLeader = ranking[0];
  const newLeader = sorted[0];
  const leaderChange = {
    oldLeader: oldLeader?.piloto || null,
    newLeader: newLeader?.piloto || null,
    pointsDiff: newLeader && oldLeader
      ? newLeader.projectedPoints - oldLeader.pontos
      : 0,
  };

  // Maior ganhador (com pontos positivos)
  const withPointsGained = sorted.filter((p) => p.pointsGained > 0);
  const biggestGainer = withPointsGained.length > 0
    ? withPointsGained.reduce((best, p) => p.pointsGained > best.pointsGained ? p : best)
    : null;

  // Maior perdedor (pontos = 0, mas perdeu posições)
  const withPointsLost = sorted.filter((p) => p.pointsGained === 0 && p.positionChange < 0);
  const biggestLoser = withPointsLost.length > 0
    ? withPointsLost.reduce((worst, p) => p.positionChange < worst.positionChange ? p : worst)
    : null;

  return {
    projectedRanking: sorted,
    leaderChange,
    biggestGainer: biggestGainer
      ? { pilotName: biggestGainer.piloto, pointsGained: biggestGainer.pointsGained }
      : null,
    biggestLoser: biggestLoser
      ? { pilotName: biggestLoser.piloto, pointsLost: Math.abs(biggestLoser.positionChange) }
      : null,
    totalPilots: ranking.length,
    assignedPilots: Object.keys(assignments).length,
    unassignedPilots: ranking.length - Object.keys(assignments).length,
  };
}
