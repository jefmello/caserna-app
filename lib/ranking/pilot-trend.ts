import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import type { RankingByCompetition, RankingItem } from "@/types/ranking";
import { normalizePilotName } from "@/lib/ranking/pilot-name-utils";

export type PilotTrendStatus = "up" | "stable" | "down";

/**
 * Encontra a posição de um piloto em uma lista.
 */
export function getPilotPositionInList(
  list: RankingItem[],
  pilotoId: string,
  fallbackName: string
): number | null {
  const index = list.findIndex(
    (item) =>
      (pilotoId && item.pilotoId === pilotoId) ||
      (!pilotoId && normalizePilotName(item.piloto) === normalizePilotName(fallbackName))
  );

  return index >= 0 ? index + 1 : null;
}

/**
 * Determina a tendência de posição de um piloto (subindo, estável, caindo).
 * Compara posição atual com GERAL e turnos individuais.
 */
export function getPilotTrendStatus({
  pilot,
  competition,
  categoryData,
}: {
  pilot: RankingItem;
  competition: string;
  categoryData: RankingByCompetition | undefined;
}): PilotTrendStatus {
  if (!categoryData) return "stable";

  const currentList = categoryData[competition] || [];
  const currentPos = getPilotPositionInList(currentList, pilot.pilotoId, pilot.piloto);
  if (!currentPos) return "stable";

  if (competition === "GERAL") {
    const turnoPositions = ["T1", "T2", "T3"]
      .map((key) => getPilotPositionInList(categoryData[key] || [], pilot.pilotoId, pilot.piloto))
      .filter((value): value is number => value !== null);

    if (turnoPositions.length === 0) return "stable";

    const bestTurnoPos = Math.min(...turnoPositions);
    if (currentPos < bestTurnoPos) return "up";
    if (currentPos <= bestTurnoPos + 1) return "stable";
    return "down";
  }

  const geralPos = getPilotPositionInList(categoryData.GERAL || [], pilot.pilotoId, pilot.piloto);
  if (!geralPos) return "stable";

  if (currentPos < geralPos) return "up";
  if (currentPos === geralPos || currentPos === geralPos + 1 || currentPos + 1 === geralPos) {
    return "stable";
  }
  return "down";
}

/**
 * Retorna ícone, label e classes CSS para exibição visual da tendência.
 */
export function getTrendVisual(status: PilotTrendStatus, isDark: boolean) {
  if (status === "up") {
    return {
      Icon: TrendingUp,
      label: "em alta",
      className: isDark
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
        : "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  if (status === "down") {
    return {
      Icon: TrendingDown,
      label: "em queda",
      className: isDark
        ? "border-red-500/30 bg-red-500/10 text-red-300"
        : "border-red-200 bg-red-50 text-red-700",
    };
  }

  return {
    Icon: Minus,
    label: "estável",
    className: isDark
      ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
      : "border-yellow-200 bg-yellow-50 text-yellow-700",
  };
}
