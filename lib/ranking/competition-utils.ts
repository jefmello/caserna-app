import type { RankingItem } from "@/types/ranking";

/**
 * Labels legíveis para competições (turnos e geral).
 */
export const competitionLabels: Record<string, string> = {
  T1: "1º Turno",
  T2: "2º Turno",
  T3: "3º Turno",
  GERAL: "Geral",
};

/**
 * Determina o status da disputa pelo título baseado no top 3.
 */
export function getTitleFightStatus(top3: RankingItem[]) {
  if (!top3 || top3.length < 2) {
    return {
      label: "SEM DISPUTA",
      tone: "border-zinc-200 bg-zinc-100 text-zinc-600",
    };
  }

  const leader = top3[0];
  const second = top3[1];
  const diff = leader.pontos - second.pontos;

  if (diff <= 3) {
    return {
      label: "BRIGA ACIRRADA",
      tone: "border-emerald-300 bg-emerald-100 text-emerald-800",
    };
  }

  if (diff <= 8) {
    return {
      label: "DISPUTA CONTROLADA",
      tone: "border-yellow-300 bg-yellow-100 text-yellow-800",
    };
  }

  return {
    label: "LIDERANÇA ISOLADA",
    tone: "border-zinc-300 bg-zinc-100 text-zinc-700",
  };
}

/**
 * Determina o vencedor da comparação (a, b ou empate).
 */
export function getComparisonWinner(
  a: number,
  b: number,
  lowerIsBetter = false
): "a" | "b" | "tie" {
  if (a === b) return "tie";
  if (lowerIsBetter) {
    return a < b ? "a" : "b";
  }
  return a > b ? "a" : "b";
}

/**
 * Retorna classes CSS para card de comparação baseado em quem venceu.
 */
export function getComparisonCardTone({
  winner,
  side,
  isDark,
  theme,
}: {
  winner: "a" | "b" | "tie";
  side: "a" | "b";
  isDark: boolean;
  theme: ReturnType<typeof import("@/lib/ranking/theme-utils").getCategoryTheme>;
}) {
  if (winner === "tie") {
    return isDark
      ? "border-white/10 bg-[#0f172a] text-zinc-200"
      : "border-zinc-200 bg-zinc-50 text-zinc-800";
  }

  const isWinner = winner === side;

  if (isDark) {
    return isWinner
      ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft} text-white`
      : "border-white/10 bg-[#0f172a] text-zinc-300";
  }

  return isWinner
    ? `${theme.primaryBorder} bg-gradient-to-br ${theme.heroBg} text-zinc-950`
    : "border-zinc-200 bg-white text-zinc-700";
}

/**
 * Label para vencedor de duelo.
 */
export function getDuelWinnerLabel(winner: "a" | "b" | "tie"): string {
  if (winner === "a") return "Piloto A na frente";
  if (winner === "b") return "Piloto B na frente";
  return "Empate técnico";
}

/**
 * Gera narrativa para duelo baseado nos scores e diferença de pontos.
 */
export function getDuelNarrative({
  scoreA,
  scoreB,
  pointsDiff,
}: {
  scoreA: number;
  scoreB: number;
  pointsDiff: number;
}): string {
  if (scoreA === scoreB) {
    if (pointsDiff <= 3) return "Duelo totalmente em aberto";
    if (pointsDiff <= 10) return "Equilíbrio com leve pressão";
    return "Empate técnico com vantagem pontual";
  }

  const diff = Math.abs(scoreA - scoreB);

  if (diff >= 4) return "Superioridade clara no duelo";
  if (diff >= 2) return "Vantagem consistente";
  return "Duelo apertado";
}

/**
 * Gera label de perfil do duelo.
 */
export function getDuelProfileLabel({
  scoreA,
  scoreB,
  pointsWinner,
  advWinner,
}: {
  scoreA: number;
  scoreB: number;
  pointsWinner: "a" | "b" | "tie";
  advWinner: "a" | "b" | "tie";
}): string {
  if (scoreA === scoreB) {
    if (pointsWinner === "tie") return "Confronto espelhado";
    return pointsWinner === "a" ? "A lidera nos detalhes" : "B lidera nos detalhes";
  }

  const leader = scoreA > scoreB ? "a" : "b";

  if (pointsWinner === leader && advWinner === leader) {
    return leader === "a" ? "A domina desempenho e disciplina" : "B domina desempenho e disciplina";
  }

  if (pointsWinner === leader) {
    return leader === "a" ? "A vence no pacote competitivo" : "B vence no pacote competitivo";
  }

  return leader === "a" ? "A compensa na regularidade" : "B compensa na regularidade";
}
