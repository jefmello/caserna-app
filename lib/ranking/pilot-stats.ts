import type { RankingItem } from "@/types/ranking";
import { sortRanking } from "@/lib/ranking/ranking-sorting";
import { getPilotNameParts } from "@/lib/ranking/pilot-name-utils";

/**
 * Calcula a diferença de pontos entre piloto e líder.
 */
export function getGapToLeader(leaderPoints: number, pilotPoints: number): string {
  const diff = leaderPoints - pilotPoints;
  if (diff <= 0) return "líder";
  return `-${diff} pts do líder`;
}

/**
 * Calcula percentual de performance (valor/total * 100).
 */
export function getPerformancePercentage(value: number, total: number): number {
  if (!total || total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

/**
 * Retorna o melhor atributo do piloto (mais vitórias, poles, etc.).
 */
export function getSelectedPilotBestAttribute(pilot?: RankingItem | null) {
  if (!pilot) {
    return { label: "Sem dados", value: 0 };
  }

  const attributes = [
    { label: "Vitórias", value: pilot.vitorias },
    { label: "Poles", value: pilot.poles },
    { label: "VMR", value: pilot.mv },
    { label: "Pódios", value: pilot.podios },
  ];

  return attributes.sort((a, b) => b.value - a.value)[0];
}

/**
 * Gera label de consistência baseado em taxa de pódio, vitórias e advertências.
 */
export function getPilotConsistencyLabel(pilot?: RankingItem | null): string {
  if (!pilot || pilot.participacoes <= 0) return "Sem base suficiente";

  const podiumRate = pilot.podios / pilot.participacoes;
  const winRate = pilot.vitorias / pilot.participacoes;
  const advRate = pilot.adv / pilot.participacoes;

  if (podiumRate >= 0.7 && advRate <= 0.2) return "Consistência de elite";
  if (winRate >= 0.35) return "Perfil vencedor";
  if (podiumRate >= 0.5) return "Muito regular";
  if (advRate >= 0.5) return "Atenção na disciplina";
  return "Em evolução";
}

/**
 * Gera label de momentum relativo ao líder.
 */
export function getPilotMomentumLabel(
  pilot?: RankingItem | null,
  leader?: RankingItem | null
): string {
  if (!pilot) return "Sem leitura";
  if (!leader || pilot.pilotoId === leader.pilotoId)
    return "Referência da categoria";

  const diff = Math.max(0, leader.pontos - pilot.pontos);

  if (diff <= 3) return "Na briga direta";
  if (diff <= 10) return "Pressionando o topo";
  if (diff <= 20) return "Precisa reagir";
  return "Busca recuperação";
}

/**
 * Calcula eficiência média (pontos por participação).
 */
export function getPilotEfficiency(pilot?: RankingItem | null): number {
  if (!pilot || pilot.participacoes <= 0) return 0;
  return Math.round((pilot.pontos / pilot.participacoes) * 10) / 10;
}

/**
 * Retorna top N pilotos por métrica específica (vitórias, poles, VMR, pódios).
 */
export function getTopMetricRanking(
  list: RankingItem[],
  metric: keyof Pick<RankingItem, "vitorias" | "poles" | "mv" | "podios">,
  limit = 5
): RankingItem[] {
  return [...list]
    .filter((item) => Number(item[metric]) > 0)
    .sort((a, b) => {
      const diff = Number(b[metric]) - Number(a[metric]);
      if (diff !== 0) return diff;
      return sortRanking([a, b])[0] === a ? -1 : 1;
    })
    .slice(0, limit);
}

/**
 * Retorna dados de pontos dos top N pilotos para gráfico de barras.
 */
export function getTopPointsChartData(list: RankingItem[], limit = 5) {
  return [...list].slice(0, limit).map((item) => ({
    piloto: getPilotNameParts(item.piloto).firstName,
    pontos: item.pontos,
  }));
}
