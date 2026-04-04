import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import type { RankingByCompetition, RankingItem } from "@/types/ranking";

export type PilotTrendStatus = "up" | "stable" | "down";

export const categoryColors: Record<string, string> = {
  Base: "bg-orange-50 text-orange-700 border-orange-200",
  Graduados: "bg-blue-50 text-blue-700 border-blue-200",
  Elite: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

export const competitionLabels: Record<string, string> = {
  T1: "1º Turno",
  T2: "2º Turno",
  T3: "3º Turno",
  GERAL: "Geral",
};

export const sponsorLogos = [
  {
    name: "LazyKart",
    src: "/patrocinadores/lazykart.png",
    wrapper: "px-2 py-1.5",
    image: "max-h-[34px] max-w-[94px] object-contain",
    shareImage: "max-h-[48px] max-w-[132px] object-contain",
    surfaceLight: "border-black/10 bg-white",
    surfaceDark: "border-white/10 bg-white",
  },
  {
    name: "Lumine",
    src: "/patrocinadores/lumine.png",
    wrapper: "px-1.5 py-1.5",
    image: "max-h-[40px] max-w-[98px] object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.18)]",
    shareImage: "max-h-[52px] max-w-[140px] object-contain drop-shadow-[0_3px_8px_rgba(0,0,0,0.22)]",
    surfaceLight: "border-zinc-800/90 bg-[#111827]",
    surfaceDark: "border-white/10 bg-[#10151f]",
  },
  {
    name: "Precision",
    src: "/patrocinadores/precision.png",
    wrapper: "px-0.5 py-0.5",
    image: "h-[48px] w-[108px] scale-[1.7] object-contain",
    shareImage: "h-[62px] w-[148px] scale-[1.7] object-contain",
    surfaceLight: "border-black/10 bg-white",
    surfaceDark: "border-white/10 bg-white",
  },
  {
    name: "Skyflow",
    src: "/patrocinadores/skyflow.png",
    wrapper: "px-0.5 py-0.5",
    image: "h-[48px] w-[108px] scale-[1.65] object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.18)]",
    shareImage: "h-[62px] w-[148px] scale-[1.65] object-contain drop-shadow-[0_3px_8px_rgba(0,0,0,0.22)]",
    surfaceLight: "border-zinc-800/90 bg-[#111827]",
    surfaceDark: "border-white/10 bg-[#0f172a]",
  },
  {
    name: "Vits",
    src: "/patrocinadores/vits.png",
    wrapper: "px-0.5 py-0.5",
    image: "h-[46px] w-[104px] scale-[1.95] object-contain",
    shareImage: "h-[60px] w-[142px] scale-[1.95] object-contain",
    surfaceLight: "border-black/10 bg-white",
    surfaceDark: "border-white/10 bg-white",
  },
  {
    name: "Astera",
    src: "/patrocinadores/astera.png",
    wrapper: "px-1.5 py-1.5",
    image: "max-h-[40px] max-w-[98px] object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.18)]",
    shareImage: "max-h-[52px] max-w-[140px] object-contain drop-shadow-[0_3px_8px_rgba(0,0,0,0.22)]",
    surfaceLight: "border-zinc-800/90 bg-[#111827]",
    surfaceDark: "border-white/10 bg-[#10151f]",
  },
] as const;

export function sortRanking(list: RankingItem[]) {
  return [...list].sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    if (a.adv !== b.adv) return a.adv - b.adv;
    if (b.participacoes !== a.participacoes) {
      return b.participacoes - a.participacoes;
    }
    if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
    if (b.poles !== a.poles) return b.poles - a.poles;
    if (b.mv !== a.mv) return b.mv - a.mv;
    if (b.podios !== a.podios) return b.podios - a.podios;
    return a.pos - b.pos;
  });
}

export function normalizePilotName(name?: string) {
  if (!name) return "-";

  return name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getPilotNameParts(name?: string) {
  const normalized = normalizePilotName(name);

  if (!normalized || normalized === "-") {
    return { firstName: "-", lastName: "" };
  }

  const parts = normalized.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };

  return {
    firstName: parts[0],
    lastName: parts[parts.length - 1],
  };
}

export function getPilotFirstAndLastName(name?: string) {
  const { firstName, lastName } = getPilotNameParts(name);
  return lastName ? `${firstName} ${lastName}` : firstName;
}

export function getPilotWarName(pilot?: RankingItem | null) {
  const nomeGuerra = normalizePilotName(pilot?.nomeGuerra);
  if (!nomeGuerra || nomeGuerra === "-") return "";
  return nomeGuerra;
}

export function getPilotWarNameDisplay(pilot?: RankingItem | null) {
  const nomeGuerra = getPilotWarName(pilot);
  return nomeGuerra ? `"${nomeGuerra}"` : "";
}

export function getPilotHighlightName(name?: string) {
  const normalized = normalizePilotName(name);
  return normalized === "-" ? "-" : normalized.toUpperCase();
}

export function getPilotPhotoPath(pilot?: RankingItem | null) {
  if (!pilot?.pilotoId) return null;
  return `/pilotos/${pilot.pilotoId}.jpg`;
}

export function getTop6RowStyles(position: number) {
  switch (position) {
    case 1:
      return {
        row: "border-l-[4px] border-l-yellow-500 bg-gradient-to-r from-yellow-100 via-yellow-50 to-white shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_0_0_1px_rgba(234,179,8,0.16),0_10px_24px_rgba(234,179,8,0.18)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_0_0_1px_rgba(234,179,8,0.22),0_14px_28px_rgba(234,179,8,0.24)]",
        badge: "bg-yellow-400 text-black",
        points: "text-yellow-700",
        name: "text-zinc-950",
        chip: "border-yellow-300 bg-yellow-100 text-yellow-800",
      };
    case 2:
      return {
        row: "border-l-[4px] border-l-zinc-400 bg-gradient-to-r from-zinc-100 via-zinc-50 to-white shadow-[0_0_0_1px_rgba(161,161,170,0.14),0_8px_20px_rgba(113,113,122,0.12)] hover:shadow-[0_0_0_1px_rgba(161,161,170,0.18),0_12px_24px_rgba(113,113,122,0.18)]",
        badge: "bg-zinc-300 text-zinc-900",
        points: "text-zinc-800",
        name: "text-zinc-950",
        chip: "border-zinc-300 bg-white text-zinc-700",
      };
    case 3:
      return {
        row: "border-l-[4px] border-l-amber-700 bg-gradient-to-r from-amber-50 via-amber-50/80 to-white shadow-[0_0_0_1px_rgba(217,119,6,0.12),0_8px_20px_rgba(180,83,9,0.12)] hover:shadow-[0_0_0_1px_rgba(217,119,6,0.16),0_12px_24px_rgba(180,83,9,0.18)]",
        badge: "bg-amber-600 text-white",
        points: "text-amber-800",
        name: "text-zinc-950",
        chip: "border-amber-200 bg-white text-amber-800",
      };
    case 4:
      return {
        row: "border-l-[4px] border-l-sky-500 bg-gradient-to-r from-sky-50 via-sky-50/70 to-white shadow-[0_0_0_1px_rgba(14,165,233,0.12),0_8px_20px_rgba(14,165,233,0.12)] hover:shadow-[0_0_0_1px_rgba(14,165,233,0.18),0_12px_24px_rgba(14,165,233,0.18)]",
        badge: "bg-sky-500 text-white",
        points: "text-sky-700",
        name: "text-zinc-950",
        chip: "border-sky-200 bg-white text-sky-800",
      };
    case 5:
      return {
        row: "border-l-[4px] border-l-violet-500 bg-gradient-to-r from-violet-50 via-violet-50/70 to-white shadow-[0_0_0_1px_rgba(139,92,246,0.12),0_8px_20px_rgba(139,92,246,0.12)] hover:shadow-[0_0_0_1px_rgba(139,92,246,0.18),0_12px_24px_rgba(139,92,246,0.18)]",
        badge: "bg-violet-500 text-white",
        points: "text-violet-700",
        name: "text-zinc-950",
        chip: "border-violet-200 bg-white text-violet-800",
      };
    case 6:
      return {
        row: "border-l-[4px] border-l-emerald-500 bg-gradient-to-r from-emerald-50 via-emerald-50/70 to-white shadow-[0_0_0_1px_rgba(16,185,129,0.12),0_8px_20px_rgba(16,185,129,0.12)] hover:shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_12px_24px_rgba(16,185,129,0.18)]",
        badge: "bg-emerald-500 text-white",
        points: "text-emerald-700",
        name: "text-zinc-950",
        chip: "border-emerald-200 bg-white text-emerald-800",
      };
    default:
      return {
        row: "",
        badge: "bg-zinc-100 text-zinc-800",
        points: "text-zinc-950",
        name: "text-zinc-950",
        chip: "border-yellow-200 bg-yellow-50 text-yellow-800",
      };
  }
}

export function getTopMetricRanking(
  list: RankingItem[],
  metric: keyof Pick<RankingItem, "vitorias" | "poles" | "mv" | "podios">,
  limit = 5
) {
  return [...list]
    .filter((item) => Number(item[metric]) > 0)
    .sort((a, b) => {
      const diff = Number(b[metric]) - Number(a[metric]);
      if (diff !== 0) return diff;
      return sortRanking([a, b])[0] === a ? -1 : 1;
    })
    .slice(0, limit);
}

export function getTopPointsChartData(list: RankingItem[], limit = 5) {
  return [...list].slice(0, limit).map((item) => ({
    piloto: getPilotNameParts(item.piloto).firstName,
    pontos: item.pontos,
  }));
}

export function getCategoryTheme(category: string) {
  const themes = {
    Base: {
      shellGlow: "from-orange-500/10 via-white to-orange-100/60",
      primaryBorder: "border-orange-200/90",
      primaryRing: "via-orange-400/80",
      primaryBadge: "bg-orange-100 text-orange-800 border-orange-200",
      primaryIconWrap: "bg-orange-100",
      primaryIcon: "text-orange-700",
      heroBorder: "border-orange-200/80",
      heroBg: "from-orange-50 via-white to-orange-50/70",
      heroChip: "border-orange-200 bg-orange-100/80 text-orange-800",
      titleBorder: "border-orange-200/90",
      titleBg: "from-orange-50 via-white to-white",
      titlePill:
        "border-orange-200 bg-gradient-to-b from-orange-100 to-orange-200",
      titlePillText: "text-orange-950",
      titleIconWrap:
        "border-orange-200 bg-gradient-to-b from-orange-100 to-orange-200",
      titleIcon: "text-orange-700",
      titleSub: "text-orange-500/80",
      searchBorder: "border-orange-200/80",
      searchGlow: "focus-within:ring-orange-200/70",
      searchIcon: "text-orange-500",
      searchBadge: "border-orange-200 bg-orange-50 text-orange-700",
      headerChip: "border-orange-200 bg-orange-50 text-orange-700",
      tableHeadBg: "bg-orange-50/80",
      statsSoft: "from-orange-50 via-white to-orange-50/60",
      statsIconWrap: "bg-orange-100",
      statsIcon: "text-orange-700",
      chartBar: "#f97316",
      chartGrid: "rgba(249,115,22,0.12)",
      chartAxis: "#9a3412",
      statAccentBg: "border-orange-200 bg-orange-50",
      statAccentRank: "bg-orange-500 text-white",
      lineTrack: "from-orange-200 via-orange-300 to-orange-200",
      lineGlow: "bg-orange-300/50",
      leaderGlow: "shadow-[0_10px_22px_rgba(249,115,22,0.18)]",
      darkAccentBorder: "border-orange-500/30",
      darkAccentBg: "bg-orange-500/10",
      darkAccentBgSoft: "bg-orange-500/12",
      darkAccentText: "text-orange-300",
      darkAccentIconWrap: "bg-orange-500/15",
      darkAccentDivider: "bg-orange-500/20",
      darkAccentCard: "from-[#1a1a14] via-[#151922] to-[#111827]",
      darkLeaderRow:
        "bg-gradient-to-r from-orange-500/16 via-[#161e2b] to-[#111827] border-l-[4px] border-l-orange-400 shadow-[0_0_0_1px_rgba(249,115,22,0.16),0_12px_26px_rgba(0,0,0,0.32)]",
      darkSecondRow:
        "bg-gradient-to-r from-white/5 via-[#111827] to-[#111827] border-l-[4px] border-l-zinc-400 shadow-[0_0_0_1px_rgba(161,161,170,0.14),0_10px_22px_rgba(0,0,0,0.24)]",
      darkThirdRow:
        "bg-gradient-to-r from-amber-500/12 via-[#111827] to-[#111827] border-l-[4px] border-l-amber-500 shadow-[0_0_0_1px_rgba(245,158,11,0.16),0_10px_22px_rgba(0,0,0,0.24)]",
      darkTopBadge: "bg-orange-400 text-black",
      darkChartBar: "#fb923c",
    },
    Graduados: {
      shellGlow: "from-blue-500/10 via-white to-blue-100/60",
      primaryBorder: "border-blue-200/90",
      primaryRing: "via-blue-400/80",
      primaryBadge: "bg-blue-100 text-blue-800 border-blue-200",
      primaryIconWrap: "bg-blue-100",
      primaryIcon: "text-blue-700",
      heroBorder: "border-blue-200/80",
      heroBg: "from-blue-50 via-white to-blue-50/70",
      heroChip: "border-blue-200 bg-blue-100/80 text-blue-800",
      titleBorder: "border-blue-200/90",
      titleBg: "from-blue-50 via-white to-white",
      titlePill:
        "border-blue-200 bg-gradient-to-b from-blue-100 to-blue-200",
      titlePillText: "text-blue-950",
      titleIconWrap:
        "border-blue-200 bg-gradient-to-b from-blue-100 to-blue-200",
      titleIcon: "text-blue-700",
      titleSub: "text-blue-500/80",
      searchBorder: "border-blue-200/80",
      searchGlow: "focus-within:ring-blue-200/70",
      searchIcon: "text-blue-500",
      searchBadge: "border-blue-200 bg-blue-50 text-blue-700",
      headerChip: "border-blue-200 bg-blue-50 text-blue-700",
      tableHeadBg: "bg-blue-50/80",
      statsSoft: "from-blue-50 via-white to-blue-50/60",
      statsIconWrap: "bg-blue-100",
      statsIcon: "text-blue-700",
      chartBar: "#3b82f6",
      chartGrid: "rgba(59,130,246,0.12)",
      chartAxis: "#1d4ed8",
      statAccentBg: "border-blue-200 bg-blue-50",
      statAccentRank: "bg-blue-500 text-white",
      lineTrack: "from-blue-200 via-blue-300 to-blue-200",
      lineGlow: "bg-blue-300/50",
      leaderGlow: "shadow-[0_10px_22px_rgba(59,130,246,0.18)]",
      darkAccentBorder: "border-blue-500/30",
      darkAccentBg: "bg-blue-500/10",
      darkAccentBgSoft: "bg-blue-500/12",
      darkAccentText: "text-blue-300",
      darkAccentIconWrap: "bg-blue-500/15",
      darkAccentDivider: "bg-blue-500/20",
      darkAccentCard: "from-[#121b2a] via-[#111827] to-[#0f172a]",
      darkLeaderRow:
        "bg-gradient-to-r from-blue-500/12 via-[#161e2b] to-[#111827] border-l-[4px] border-l-blue-400",
      darkSecondRow:
        "bg-gradient-to-r from-white/5 via-[#111827] to-[#111827] border-l-[4px] border-l-zinc-400 shadow-[0_0_0_1px_rgba(161,161,170,0.14),0_10px_22px_rgba(0,0,0,0.24)]",
      darkThirdRow:
        "bg-gradient-to-r from-amber-500/12 via-[#111827] to-[#111827] border-l-[4px] border-l-amber-500 shadow-[0_0_0_1px_rgba(245,158,11,0.16),0_10px_22px_rgba(0,0,0,0.24)]",
      darkTopBadge: "bg-blue-400 text-black",
      darkChartBar: "#60a5fa",
    },
    Elite: {
      shellGlow: "from-yellow-500/10 via-white to-yellow-100/60",
      primaryBorder: "border-yellow-200/90",
      primaryRing: "via-yellow-400/80",
      primaryBadge: "bg-yellow-100 text-yellow-800 border-yellow-200",
      primaryIconWrap: "bg-yellow-100",
      primaryIcon: "text-yellow-700",
      heroBorder: "border-yellow-200/80",
      heroBg: "from-yellow-50 via-white to-yellow-50/70",
      heroChip: "border-yellow-200 bg-yellow-100/80 text-yellow-800",
      titleBorder: "border-yellow-200/90",
      titleBg: "from-yellow-50 via-white to-white",
      titlePill:
        "border-yellow-200 bg-gradient-to-b from-[#fff9d8] to-[#f8edb2]",
      titlePillText: "text-zinc-950",
      titleIconWrap:
        "border-yellow-200 bg-gradient-to-b from-[#fff9d8] to-[#f8edb2]",
      titleIcon: "text-yellow-700",
      titleSub: "text-yellow-700/70",
      searchBorder: "border-yellow-200/80",
      searchGlow: "focus-within:ring-yellow-200/70",
      searchIcon: "text-yellow-600",
      searchBadge: "border-yellow-200 bg-yellow-50 text-yellow-700",
      headerChip: "border-yellow-200 bg-yellow-50 text-yellow-700",
      tableHeadBg: "bg-yellow-50/80",
      statsSoft: "from-yellow-50 via-white to-yellow-50/60",
      statsIconWrap: "bg-yellow-100",
      statsIcon: "text-yellow-700",
      chartBar: "#facc15",
      chartGrid: "rgba(250,204,21,0.18)",
      chartAxis: "#a16207",
      statAccentBg: "border-yellow-200 bg-yellow-50",
      statAccentRank: "bg-yellow-400 text-black",
      lineTrack: "from-yellow-200 via-yellow-300 to-yellow-200",
      lineGlow: "bg-yellow-300/50",
      leaderGlow: "shadow-[0_10px_22px_rgba(234,179,8,0.18)]",
      darkAccentBorder: "border-yellow-500/30",
      darkAccentBg: "bg-yellow-500/10",
      darkAccentBgSoft: "bg-yellow-500/12",
      darkAccentText: "text-yellow-300",
      darkAccentIconWrap: "bg-yellow-500/15",
      darkAccentDivider: "bg-yellow-500/20",
      darkAccentCard: "from-[#1f1b10] via-[#151922] to-[#111827]",
      darkLeaderRow:
        "bg-gradient-to-r from-yellow-500/12 via-[#161e2b] to-[#111827] border-l-[4px] border-l-yellow-400",
      darkSecondRow:
        "bg-gradient-to-r from-white/5 via-[#111827] to-[#111827] border-l-[4px] border-l-zinc-400 shadow-[0_0_0_1px_rgba(161,161,170,0.14),0_10px_22px_rgba(0,0,0,0.24)]",
      darkThirdRow:
        "bg-gradient-to-r from-amber-500/12 via-[#111827] to-[#111827] border-l-[4px] border-l-amber-500 shadow-[0_0_0_1px_rgba(245,158,11,0.16),0_10px_22px_rgba(0,0,0,0.24)]",
      darkTopBadge: "bg-yellow-400 text-black",
      darkChartBar: "#facc15",
    },
  };

  return themes[category as keyof typeof themes] || themes.Elite;
}

export function getGapToLeader(leaderPoints: number, pilotPoints: number) {
  const diff = leaderPoints - pilotPoints;
  if (diff <= 0) return "líder";
  return `-${diff} pts do líder`;
}
export function getPilotPositionInList(list: RankingItem[], pilotoId: string, fallbackName: string) {
  const index = list.findIndex(
    (item) =>
      (pilotoId && item.pilotoId === pilotoId) ||
      (!pilotoId && normalizePilotName(item.piloto) === normalizePilotName(fallbackName))
  );

  return index >= 0 ? index + 1 : null;
}

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

export function getPerformancePercentage(value: number, total: number) {
  if (!total || total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

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

export function getPilotConsistencyLabel(pilot?: RankingItem | null) {
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

export function getPilotMomentumLabel(pilot?: RankingItem | null, leader?: RankingItem | null) {
  if (!pilot) return "Sem leitura";
  if (!leader || pilot.pilotoId === leader.pilotoId) return "Referência da categoria";

  const diff = Math.max(0, leader.pontos - pilot.pontos);

  if (diff <= 3) return "Na briga direta";
  if (diff <= 10) return "Pressionando o topo";
  if (diff <= 20) return "Precisa reagir";
  return "Busca recuperação";
}

export function getPilotEfficiency(pilot?: RankingItem | null) {
  if (!pilot || pilot.participacoes <= 0) return 0;
  return Math.round((pilot.pontos / pilot.participacoes) * 10) / 10;
}

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

export function getSpotlightCategoryStyles(category: string, isDark: boolean) {
  if (isDark) {
    if (category === "Base") {
      return {
        leftCard: "border-orange-500/30 bg-[linear-gradient(180deg,#1f1b16_0%,#151922_48%,#111827_100%)]",
        leftSubcard: "border-orange-500/30 bg-[linear-gradient(180deg,rgba(249,115,22,0.12),rgba(17,24,39,0.96))]",
        badge: "border-orange-400/35 bg-[linear-gradient(180deg,rgba(251,146,60,0.32),rgba(124,45,18,0.92))] text-white shadow-[0_14px_26px_rgba(249,115,22,0.24)]",
        statCard: "border-orange-500/30 bg-[linear-gradient(135deg,#7c2d12_0%,#9a3412_48%,#7c2d12_100%)]",
        label: "text-orange-300",
        iconBubble: "border border-white/10 bg-white/10 text-white",
      };
    }

    if (category === "Graduados") {
      return {
        leftCard: "border-blue-500/30 bg-[linear-gradient(180deg,#14233d_0%,#151922_48%,#111827_100%)]",
        leftSubcard: "border-blue-500/30 bg-[linear-gradient(180deg,rgba(59,130,246,0.14),rgba(17,24,39,0.96))]",
        badge: "border-blue-300/35 bg-[linear-gradient(180deg,rgba(96,165,250,0.34),rgba(30,64,175,0.92))] text-white shadow-[0_14px_26px_rgba(59,130,246,0.22)]",
        statCard: "border-blue-500/30 bg-[linear-gradient(135deg,#274a9b_0%,#4169c6_52%,#274a9b_100%)]",
        label: "text-blue-300",
        iconBubble: "border border-white/10 bg-white/10 text-white",
      };
    }

    return {
      leftCard: "border-yellow-500/30 bg-[linear-gradient(180deg,#2a2412_0%,#151922_48%,#111827_100%)]",
      leftSubcard: "border-yellow-500/30 bg-[linear-gradient(180deg,rgba(234,179,8,0.14),rgba(17,24,39,0.96))]",
      badge: "border-yellow-300/35 bg-[linear-gradient(180deg,rgba(250,204,21,0.34),rgba(161,98,7,0.94))] text-white shadow-[0_14px_26px_rgba(234,179,8,0.22)]",
      statCard: "border-yellow-500/30 bg-[linear-gradient(135deg,#8a6a08_0%,#b88a10_52%,#8a6a08_100%)]",
      label: "text-yellow-300",
      iconBubble: "border border-white/10 bg-white/10 text-white",
    };
  }

  if (category === "Base") {
    return {
      leftCard: "border-orange-200 bg-[linear-gradient(180deg,#fff7ed_0%,#ffedd5_46%,#fed7aa_100%)]",
      leftSubcard: "border-orange-200 bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_100%)]",
      badge: "border-orange-300 bg-[linear-gradient(180deg,#fb923c_0%,#ea580c_100%)] text-white shadow-[0_14px_24px_rgba(249,115,22,0.20)]",
      statCard: "border-orange-200 bg-[linear-gradient(135deg,#f97316_0%,#fb923c_50%,#ea580c_100%)]",
      label: "text-orange-600",
      iconBubble: "border border-white/20 bg-white/18 text-white",
    };
  }

  if (category === "Graduados") {
    return {
      leftCard: "border-blue-200 bg-[linear-gradient(180deg,#eff6ff_0%,#dbeafe_46%,#bfdbfe_100%)]",
      leftSubcard: "border-blue-200 bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_100%)]",
      badge: "border-blue-300 bg-[linear-gradient(180deg,#6ea0ff_0%,#3b82f6_100%)] text-white shadow-[0_14px_24px_rgba(59,130,246,0.20)]",
      statCard: "border-blue-200 bg-[linear-gradient(135deg,#4f7fdb_0%,#6e9bf1_52%,#456fc3_100%)]",
      label: "text-blue-600",
      iconBubble: "border border-white/20 bg-white/18 text-white",
    };
  }

  return {
    leftCard: "border-yellow-200 bg-[linear-gradient(180deg,#fefce8_0%,#fef3c7_46%,#fde68a_100%)]",
    leftSubcard: "border-yellow-200 bg-[linear-gradient(180deg,#fefce8_0%,#ffffff_100%)]",
    badge: "border-yellow-300 bg-[linear-gradient(180deg,#f5cd3a_0%,#d4a614_100%)] text-white shadow-[0_14px_24px_rgba(234,179,8,0.20)]",
    statCard: "border-yellow-200 bg-[linear-gradient(135deg,#b88a10_0%,#d4a614_52%,#9a7410_100%)]",
    label: "text-yellow-700",
    iconBubble: "border border-white/20 bg-white/18 text-white",
  };
}

export function getComparisonWinner(
  a: number,
  b: number,
  lowerIsBetter = false
) {
  if (a === b) return "tie" as const;
  if (lowerIsBetter) {
    return a < b ? ("a" as const) : ("b" as const);
  }
  return a > b ? ("a" as const) : ("b" as const);
}

export function getComparisonCardTone({
  winner,
  side,
  isDark,
  theme,
}: {
  winner: "a" | "b" | "tie";
  side: "a" | "b";
  isDark: boolean;
  theme: ReturnType<typeof getCategoryTheme>;
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

export function getDuelWinnerLabel(winner: "a" | "b" | "tie") {
  if (winner === "a") return "Piloto A na frente";
  if (winner === "b") return "Piloto B na frente";
  return "Empate técnico";
}

export function getDuelNarrative({
  scoreA,
  scoreB,
  pointsDiff,
}: {
  scoreA: number;
  scoreB: number;
  pointsDiff: number;
}) {
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
}) {
  if (scoreA === scoreB) {
    if (pointsWinner === "tie") return "Confronto espelhado";
    return pointsWinner === "a"
      ? "A lidera nos detalhes"
      : "B lidera nos detalhes";
  }

  const leader = scoreA > scoreB ? "a" : "b";

  if (pointsWinner === leader && advWinner === leader) {
    return leader === "a"
      ? "A domina desempenho e disciplina"
      : "B domina desempenho e disciplina";
  }

  if (pointsWinner === leader) {
    return leader === "a"
      ? "A vence no pacote competitivo"
      : "B vence no pacote competitivo";
  }

  return leader === "a"
    ? "A compensa na regularidade"
    : "B compensa na regularidade";
}

