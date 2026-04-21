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
 * Retorna APENAS os pontos base da posição (sem pole, sem VMR).
 */
export function getBasePositionPoints(position: number): number {
  if (!isValidPosition(position)) return 0;
  return STAGE_POINTS_BY_POSITION[position] || 0;
}

/**
 * Executa uma simulação personalizada completa.
 *
 * @param ranking - Lista atual do ranking
 * @param assignments - Mapa de pilotoId/piloto → posição escolhida
 * @param polePilotKey - Piloto que fez a pole position (+1 pt)
 * @param vmrPilotKey - Piloto que fez a volta mais rápida (+1 pt)
 * @param stageNumber - Número da etapa sendo simulada
 * @param competition - Competição atual
 * @returns Resultado completo com ranking projetado e análises
 */
export function runCustomScenario({
  ranking,
  assignments,
  polePilotKey,
  vmrPilotKey,
  stageNumber,
  competition: _competition,
}: {
  ranking: RankingItem[];
  assignments: CustomScenarioAssignment;
  polePilotKey?: string | null;
  vmrPilotKey?: string | null;
  stageNumber: number;
  competition: string;
}): CustomScenarioResult {
  const hasPoleStage = !NO_POLE_STAGES.includes(stageNumber);

  // Projeta pontos de cada piloto
  const projectedPilots: ProjectedPilot[] = ranking.map((pilot) => {
    const key = resolvePilotKey(pilot);
    const assignedPosition = assignments[key];

    // Pontos base da posição de chegada
    const basePoints = assignedPosition ? getBasePositionPoints(assignedPosition) : 0;

    // Pontos bônus: pole e VMR são independentes da posição
    const poleBonus = hasPoleStage && polePilotKey === key ? 1 : 0;
    const vmrBonus = vmrPilotKey === key ? 1 : 0;

    const pointsGained = basePoints + poleBonus + vmrBonus;
    const projectedPoints = pilot.pontos + pointsGained;

    return {
      ...pilot,
      projectedPoints,
      pointsGained,
      positionChange: 0,
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
    pointsDiff: newLeader && oldLeader ? newLeader.projectedPoints - oldLeader.pontos : 0,
  };

  // Maior ganhador (com pontos positivos)
  const withPointsGained = sorted.filter((p) => p.pointsGained > 0);
  const biggestGainer =
    withPointsGained.length > 0
      ? withPointsGained.reduce((best, p) => (p.pointsGained > best.pointsGained ? p : best))
      : null;

  // Maior perdedor (pontos = 0, mas perdeu posições)
  const withPointsLost = sorted.filter((p) => p.pointsGained === 0 && p.positionChange < 0);
  const biggestLoser =
    withPointsLost.length > 0
      ? withPointsLost.reduce((worst, p) => (p.positionChange < worst.positionChange ? p : worst))
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
