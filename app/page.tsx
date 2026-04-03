"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import * as htmlToImage from "html-to-image";
import {
  Trophy,
  Medal,
  Timer,
  Flag,
  Users,
  BarChart3,
  Search,
  Crown,
  Gauge,
  ArrowLeft,
  User,
  Camera,
  Star,
  TableProperties,
  Swords,
  ChevronRight,
  Moon,
  Sun,
  Share2,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

type RankingItem = {
  pos: number;
  pilotoId: string;
  piloto: string;
  nomeGuerra: string;
  pontos: number;
  adv: number;
  participacoes: number;
  vitorias: number;
  poles: number;
  mv: number;
  podios: number;
  descarte: number;
  categoriaAtual: string;
  competicao: string;
  categoria: string;
};

type RankingByCompetition = Record<string, RankingItem[]>;
type RankingData = Record<string, RankingByCompetition>;

type RankingMetaPilot = {
  pos: number;
  pilotoId: string;
  piloto: string;
  nomeGuerra: string;
  pontos: number;
  adv: number;
  participacoes: number;
  vitorias: number;
  poles: number;
  mv: number;
  podios: number;
  descarte: number;
};

type RankingCompetitionMeta = {
  summary: {
    totalPilots: number;
    leaderPoints: number;
    vicePoints: number;
    leaderAdvantage: number;
    top6CutPoints: number;
    avgPoints: number;
    totalVictories: number;
    totalPodiums: number;
  };
  radar: {
    hottestPilot: RankingMetaPilot | null;
    hottestLabel: string;
    podiumPressure: number;
    titleHeat: string;
  };
  titleFight: {
    label: string;
    tone: string;
  };
  bestEfficiencyPilot: RankingMetaPilot | null;
};

type RankingMetaData = Record<string, Record<string, RankingCompetitionMeta>>;

const categoryColors: Record<string, string> = {
  Base: "bg-orange-50 text-orange-700 border-orange-200",
  Graduados: "bg-blue-50 text-blue-700 border-blue-200",
  Elite: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

const competitionLabels: Record<string, string> = {
  T1: "1º Turno",
  T2: "2º Turno",
  T3: "3º Turno",
  GERAL: "Geral",
};

const sponsorLogos = [
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

function sortRanking(list: RankingItem[]) {
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

function normalizePilotName(name?: string) {
  if (!name) return "-";

  return name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getPilotNameParts(name?: string) {
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

function getPilotFirstAndLastName(name?: string) {
  const { firstName, lastName } = getPilotNameParts(name);
  return lastName ? `${firstName} ${lastName}` : firstName;
}

function getPilotWarName(pilot?: RankingItem | null) {
  const nomeGuerra = normalizePilotName(pilot?.nomeGuerra);
  if (!nomeGuerra || nomeGuerra === "-") return "";
  return nomeGuerra;
}

function getPilotWarNameDisplay(pilot?: RankingItem | null) {
  const nomeGuerra = getPilotWarName(pilot);
  return nomeGuerra ? `"${nomeGuerra}"` : "";
}

function getPilotHighlightName(name?: string) {
  const normalized = normalizePilotName(name);
  return normalized === "-" ? "-" : normalized.toUpperCase();
}

function getPilotPhotoPath(pilot?: RankingItem | null) {
  if (!pilot?.pilotoId) return null;
  return `/pilotos/${pilot.pilotoId}.jpg`;
}

function getTop6RowStyles(position: number) {
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

function getTopMetricRanking(
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

function getTopPointsChartData(list: RankingItem[], limit = 5) {
  return [...list].slice(0, limit).map((item) => ({
    piloto: getPilotNameParts(item.piloto).firstName,
    pontos: item.pontos,
  }));
}

function getCategoryTheme(category: string) {
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

function getGapToLeader(leaderPoints: number, pilotPoints: number) {
  const diff = leaderPoints - pilotPoints;
  if (diff <= 0) return "líder";
  return `-${diff} pts do líder`;
}
function getPilotPositionInList(list: RankingItem[], pilotoId: string, fallbackName: string) {
  const index = list.findIndex(
    (item) =>
      (pilotoId && item.pilotoId === pilotoId) ||
      (!pilotoId && normalizePilotName(item.piloto) === normalizePilotName(fallbackName))
  );

  return index >= 0 ? index + 1 : null;
}

type PilotTrendStatus = "up" | "stable" | "down";

function getPilotTrendStatus({
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

function getTrendVisual(status: PilotTrendStatus, isDark: boolean) {
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

function getPerformancePercentage(value: number, total: number) {
  if (!total || total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

function getSelectedPilotBestAttribute(pilot?: RankingItem | null) {
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

function getPilotConsistencyLabel(pilot?: RankingItem | null) {
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

function getPilotMomentumLabel(pilot?: RankingItem | null, leader?: RankingItem | null) {
  if (!pilot) return "Sem leitura";
  if (!leader || pilot.pilotoId === leader.pilotoId) return "Referência da categoria";

  const diff = Math.max(0, leader.pontos - pilot.pontos);

  if (diff <= 3) return "Na briga direta";
  if (diff <= 10) return "Pressionando o topo";
  if (diff <= 20) return "Precisa reagir";
  return "Busca recuperação";
}

function getPilotEfficiency(pilot?: RankingItem | null) {
  if (!pilot || pilot.participacoes <= 0) return 0;
  return Math.round((pilot.pontos / pilot.participacoes) * 10) / 10;
}

function getTitleFightStatus(top3: RankingItem[]) {
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

function getSpotlightCategoryStyles(category: string, isDark: boolean) {
  if (isDark) {
    if (category === "Base") {
      return {
        leftCard: "border-orange-500/30 bg-[linear-gradient(180deg,#1f1b16_0%,#151922_48%,#111827_100%)]",
        leftSubcard: "border-orange-500/35 bg-[linear-gradient(180deg,#172033_0%,#101827_58%,#0a1220_100%)] shadow-[0_16px_34px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.04)]",
        badge: "border-orange-400/35 bg-[linear-gradient(180deg,rgba(251,146,60,0.32),rgba(124,45,18,0.92))] text-white shadow-[0_14px_26px_rgba(249,115,22,0.24)]",
        statCard: "border-orange-500/30 bg-[linear-gradient(135deg,#7c2d12_0%,#9a3412_48%,#7c2d12_100%)]",
        label: "text-orange-300",
        iconBubble: "border border-white/10 bg-white/10 text-white",
      };
    }

    if (category === "Graduados") {
      return {
        leftCard: "border-blue-500/30 bg-[linear-gradient(180deg,#14233d_0%,#151922_48%,#111827_100%)]",
        leftSubcard: "border-blue-500/35 bg-[linear-gradient(180deg,#15233b_0%,#101827_58%,#0a1220_100%)] shadow-[0_16px_34px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.04)]",
        badge: "border-blue-300/35 bg-[linear-gradient(180deg,rgba(96,165,250,0.34),rgba(30,64,175,0.92))] text-white shadow-[0_14px_26px_rgba(59,130,246,0.22)]",
        statCard: "border-blue-500/30 bg-[linear-gradient(135deg,#274a9b_0%,#4169c6_52%,#274a9b_100%)]",
        label: "text-blue-300",
        iconBubble: "border border-white/10 bg-white/10 text-white",
      };
    }

    return {
      leftCard: "border-yellow-500/30 bg-[linear-gradient(180deg,#2a2412_0%,#151922_48%,#111827_100%)]",
      leftSubcard: "border-yellow-500/35 bg-[linear-gradient(180deg,#1d2130_0%,#101827_58%,#0a1220_100%)] shadow-[0_16px_34px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.04)]",
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

function CompactStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = false,
  isDark = false,
  categoryTheme,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  accent?: boolean;
  isDark?: boolean;
  categoryTheme: ReturnType<typeof getCategoryTheme>;
}) {
  return (
    <Card
      className={`rounded-[18px] border shadow-none ${
        isDark
          ? accent
            ? `${categoryTheme.darkAccentBorder} ${categoryTheme.darkAccentBgSoft}`
            : "border-white/10 bg-[#111827]"
          : accent
            ? "border-yellow-300/80 bg-yellow-50/70"
            : "border-black/5 bg-white"
      }`}
    >
      <CardContent className="p-3">
        <div className="mb-1.5 flex items-center justify-between gap-1.5">
          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${
              isDark ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            {title}
          </p>
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-2xl ${
              isDark
                ? accent
                  ? categoryTheme.darkAccentIconWrap
                  : "bg-white/5"
                : accent
                  ? "bg-yellow-100"
                  : "bg-zinc-100"
            }`}
          >
            <Icon
              className={`h-3.5 w-3.5 ${
                isDark
                  ? accent
                    ? categoryTheme.darkAccentText
                    : "text-zinc-300"
                  : accent
                    ? "text-yellow-700"
                    : "text-zinc-600"
              }`}
            />
          </div>
        </div>

        <p
          className={`text-[22px] font-bold leading-none tracking-tight ${
            isDark ? "text-white" : "text-zinc-950"
          }`}
        >
          {value}
        </p>

        <p
          className={`mt-1 text-[11px] leading-snug ${
            isDark ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
}

function HighlightCard({
  title,
  icon: Icon,
  children,
  accent = false,
  accentStyles,
  compact = false,
  isDark = false,
  categoryTheme,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  accent?: boolean;
  accentStyles?: {
    border: string;
    bg: string;
    iconWrap: string;
    icon: string;
    text: string;
    divider: string;
  };
  compact?: boolean;
  isDark?: boolean;
  categoryTheme: ReturnType<typeof getCategoryTheme>;
}) {
  const defaultAccent = {
    border: "border-yellow-300",
    bg: "bg-gradient-to-b from-yellow-50 to-white",
    iconWrap: "bg-yellow-100",
    icon: "text-yellow-700",
    text: "text-yellow-800",
    divider: "bg-yellow-200/80",
  };

  const appliedAccent = accentStyles || defaultAccent;

  return (
    <Card
      className={`rounded-[22px] border shadow-none ${
        compact ? "h-[144px]" : "h-auto min-h-[168px]"
      } ${
        isDark
          ? accent
            ? `${categoryTheme.darkAccentBorder} bg-gradient-to-b ${categoryTheme.darkAccentCard}`
            : "border-white/10 bg-[#111827]"
          : accent
            ? `${appliedAccent.border} ${appliedAccent.bg}`
            : "border-black/5 bg-white"
      }`}
    >
      <CardContent
        className={`${compact ? "flex h-full flex-col" : "flex flex-col"} ${
          compact ? "px-2.5 pb-2.5 pt-2" : "px-3 pb-3 pt-2"
        }`}
      >
        <div className="mb-0.5 flex items-start justify-between gap-1.5">
          <p
            className={`w-full text-center font-bold uppercase leading-none ${
              compact
                ? "text-[10px] tracking-[0.16em]"
                : "text-[11px] tracking-[0.18em]"
            } ${
              isDark
                ? accent
                  ? categoryTheme.darkAccentText
                  : "text-zinc-400"
                : accent
                  ? appliedAccent.text
                  : "text-zinc-500"
            }`}
          >
            {title}
          </p>

          <div
            className={`-mt-1 flex shrink-0 items-center justify-center rounded-xl ${
              compact ? "h-5 w-5" : "h-6 w-6"
            } ${
              isDark
                ? accent
                  ? categoryTheme.darkAccentIconWrap
                  : "bg-white/5"
                : accent
                  ? appliedAccent.iconWrap
                  : "bg-zinc-100"
            }`}
          >
            <Icon
              className={`${compact ? "h-2.5 w-2.5" : "h-3 w-3"} ${
                isDark
                  ? accent
                    ? categoryTheme.darkAccentText
                    : "text-zinc-300"
                  : accent
                    ? appliedAccent.icon
                    : "text-zinc-600"
              }`}
            />
          </div>
        </div>

        <div
          className={`mb-1 h-px w-full ${
            isDark
              ? accent
                ? categoryTheme.darkAccentDivider
                : "bg-white/10"
              : accent
                ? appliedAccent.divider
                : "bg-zinc-100"
          }`}
        />

        <div className="flex-1 pt-0.5">{children}</div>
      </CardContent>
    </Card>
  );
}

function PilotPhotoSlot({
  pilot,
  alt,
  isDark = false,
}: {
  pilot?: RankingItem | null;
  alt: string;
  isDark?: boolean;
}) {
  const src = getPilotPhotoPath(pilot);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const showImage = !!src && !hasError;

  return (
    <div className={`relative h-full w-full overflow-hidden ${isDark ? "bg-[#0f172a]" : "bg-zinc-50"}`}>
      {showImage ? (
        <>
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover object-center"
            onError={() => setHasError(true)}
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        </>
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center ${
            isDark
              ? "bg-gradient-to-b from-[#0f172a] to-[#111827]"
              : "bg-gradient-to-b from-zinc-50 to-zinc-100"
          }`}
        >
          <div className="text-center">
            <div
              className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ${
                isDark ? "bg-white/5" : "bg-white"
              }`}
            >
              <Camera className={`h-5 w-5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`} />
            </div>
            <p
              className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Espaço foto
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatRankingCard({
  title,
  icon: Icon,
  items,
  metricKey,
  emptyLabel,
  theme,
  isDark = false,
}: {
  title: string;
  icon: React.ElementType;
  items: RankingItem[];
  metricKey: "vitorias" | "poles" | "mv" | "podios";
  emptyLabel: string;
  theme: ReturnType<typeof getCategoryTheme>;
  isDark?: boolean;
}) {
  return (
    <Card
      className={`overflow-hidden rounded-[22px] shadow-sm ${
        isDark ? "border-white/10 bg-[#111827]" : "border-black/5 bg-white"
      }`}
    >
      <CardHeader
        className={`pb-2.5 ${
          isDark
            ? `border-b border-white/10 bg-gradient-to-r from-[#111827] via-[#161e2b] to-[#111827]`
            : "border-b border-black/5 bg-gradient-to-r from-white via-zinc-50/70 to-white"
        }`}
      >
        <CardTitle
          className={`flex items-center gap-1.5 text-sm font-bold ${
            isDark ? "text-white" : "text-zinc-950"
          }`}
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-[18px] ${
              isDark ? theme.darkAccentIconWrap : theme.statsIconWrap
            }`}
          >
            <Icon className={`h-4 w-4 ${isDark ? theme.darkAccentText : theme.statsIcon}`} />
          </div>
          <div>
            <p
              className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                isDark ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Ranking estatístico
            </p>
            <p
              className={`text-[14px] font-extrabold tracking-tight ${
                isDark ? "text-white" : "text-zinc-950"
              }`}
            >
              {title}
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-3">
        {items.length === 0 ? (
          <div
            className={`rounded-2xl px-3 py-5 text-center text-sm ${
              isDark
                ? "border border-dashed border-white/10 bg-[#0f172a] text-zinc-400"
                : "border border-dashed border-black/10 bg-zinc-50 text-zinc-500"
            }`}
          >
            {emptyLabel}
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => {
              const value = item[metricKey];
              const isFirst = index === 0;

              return (
                <div
                  key={`${title}-${item.pilotoId}-${index}`}
                  className={`flex items-center justify-between gap-2.5 rounded-[18px] border px-2.5 py-2.5 ${
                    isDark
                      ? isFirst
                        ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}`
                        : "border-white/10 bg-[#0f172a]"
                      : isFirst
                        ? `${theme.statAccentBg}`
                        : "border-black/5 bg-zinc-50/70"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[18px] text-[11px] font-extrabold ${
                        isDark
                          ? isFirst
                            ? theme.darkTopBadge
                            : "bg-white/10 text-zinc-200"
                          : isFirst
                            ? theme.statAccentRank
                            : "bg-zinc-200 text-zinc-800"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`truncate text-[13px] font-extrabold tracking-tight ${
                          isDark ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        {getPilotFirstAndLastName(item.piloto)}
                      </p>

                      {getPilotWarNameDisplay(item) ? (
                        <p
                          className={`mt-0.5 truncate text-[10px] italic ${
                            isDark ? "text-zinc-400" : "text-zinc-500"
                          }`}
                        >
                          {getPilotWarNameDisplay(item)}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div
                    className={`shrink-0 rounded-2xl px-3 py-1.5 text-sm font-extrabold ${
                      isDark
                        ? isFirst
                          ? `${theme.darkAccentBg} ${theme.darkAccentText}`
                          : "bg-white/5 text-zinc-200"
                        : isFirst
                          ? `${theme.primaryBadge}`
                          : "bg-white text-zinc-800"
                    }`}
                  >
                    <span>{value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


function getComparisonWinner(a: number, b: number, lowerIsBetter = false) {
  if (a === b) return "tie" as const;
  if (lowerIsBetter) {
    return a < b ? ("a" as const) : ("b" as const);
  }
  return a > b ? ("a" as const) : ("b" as const);
}

function getComparisonCardTone({
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

function getDuelWinnerLabel(winner: "a" | "b" | "tie") {
  if (winner === "a") return "Piloto A na frente";
  if (winner === "b") return "Piloto B na frente";
  return "Empate técnico";
}

function getDuelNarrative({
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

function getDuelProfileLabel({
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

export default function CasernaKartAppModerno() {
  const [rankingData, setRankingData] = useState<RankingData>({});
  const [rankingMeta, setRankingMeta] = useState<RankingMetaData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("Base");
  const [competition, setCompetition] = useState("T1");
  const [search, setSearch] = useState("");
  const [selectedPilot, setSelectedPilot] = useState<RankingItem | null>(null);
  const [activeTab, setActiveTab] = useState("classificacao");
  const [comparePilotAId, setComparePilotAId] = useState("");
  const [comparePilotBId, setComparePilotBId] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const shareCardRef = useRef<HTMLDivElement | null>(null);
  const pilotShareCardRef = useRef<HTMLDivElement | null>(null);
  const [isSharingImage, setIsSharingImage] = useState(false);
  const [isSharingPilotImage, setIsSharingPilotImage] = useState(false);
  const scrollPageToTop = React.useCallback((behavior: ScrollBehavior = "smooth") => {
    if (typeof window === "undefined") return;

    const scrollTargets = [
      window,
      document.documentElement,
      document.body,
      document.scrollingElement,
    ].filter(Boolean) as Array<Window | Element>;

    scrollTargets.forEach((target) => {
      if (target === window) {
        window.scrollTo({ top: 0, behavior });
        return;
      }

      if ("scrollTo" in target) {
        (target as Element & { scrollTo?: (options: ScrollToOptions) => void }).scrollTo?.({
          top: 0,
          behavior,
        });
      }

      if ("scrollTop" in target) {
        (target as HTMLElement).scrollTop = 0;
      }
    });
  }, []);


  useEffect(() => {
    const savedTheme = window.localStorage.getItem("caserna-theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("caserna-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    if (activeTab !== "piloto") return;

    const firstFrame = window.requestAnimationFrame(() => {
      scrollPageToTop("auto");

      const secondFrame = window.requestAnimationFrame(() => {
        scrollPageToTop("smooth");
      });

      return () => window.cancelAnimationFrame(secondFrame);
    });

    return () => window.cancelAnimationFrame(firstFrame);
  }, [activeTab, scrollPageToTop]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/ranking", { cache: "no-store" });
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json?.error || "Erro ao carregar os dados.");
        }

        setRankingData(json.data || {});
        setRankingMeta(json.meta || {});

        const cats = json.categories || [];
        if (cats.length > 0) {
          setCategory((prev: string) => (cats.includes(prev) ? prev : cats[0]));
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Erro desconhecido.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const categories = useMemo(() => Object.keys(rankingData), [rankingData]);

  const availableCompetitions = useMemo(() => {
    return Object.keys(rankingData[category] || {});
  }, [rankingData, category]);

  useEffect(() => {
    if (availableCompetitions.length === 0) return;

    setCompetition((prev) =>
      availableCompetitions.includes(prev) ? prev : availableCompetitions[0]
    );
  }, [availableCompetitions]);

  useEffect(() => {
    setSelectedPilot(null);
    setComparePilotAId("");
    setComparePilotBId("");
  }, [category, competition]);

  const currentCompetitionList = useMemo(() => {
    return rankingData[category]?.[competition] || [];
  }, [rankingData, category, competition]);

  const currentCompetitionMeta = useMemo(() => {
    return rankingMeta[category]?.[competition] || null;
  }, [rankingMeta, category, competition]);

  const filteredRanking = useMemo(() => {
    return currentCompetitionList.filter(
      (item) =>
        item.pontos > 0 &&
        normalizePilotName(item.piloto)
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [currentCompetitionList, search]);

  const leader = filteredRanking[0];
  const leaderName = useMemo(() => getPilotNameParts(leader?.piloto), [leader]);
  const theme = useMemo(() => getCategoryTheme(category), [category]);
  const spotlightStyles = useMemo(
    () => getSpotlightCategoryStyles(category, isDarkMode),
    [category, isDarkMode]
  );
  const sponsorTrack = useMemo(() => [...sponsorLogos, ...sponsorLogos], []);

  const comparePilotA = useMemo(
    () => filteredRanking.find((item) => (item.pilotoId || item.piloto) === comparePilotAId) || null,
    [filteredRanking, comparePilotAId]
  );

  const comparePilotB = useMemo(
    () => filteredRanking.find((item) => (item.pilotoId || item.piloto) === comparePilotBId) || null,
    [filteredRanking, comparePilotBId]
  );


const duelMetrics = useMemo(() => {
  if (!comparePilotA || !comparePilotB) return [];

  return [
    {
      label: "Pontos",
      shortLabel: "PTS",
      a: comparePilotA.pontos,
      b: comparePilotB.pontos,
      lowerIsBetter: false,
      description: "força no campeonato atual",
    },
    {
      label: "Vitórias",
      shortLabel: "VIT",
      a: comparePilotA.vitorias,
      b: comparePilotB.vitorias,
      lowerIsBetter: false,
      description: "capacidade de decidir corridas",
    },
    {
      label: "Poles",
      shortLabel: "POL",
      a: comparePilotA.poles,
      b: comparePilotB.poles,
      lowerIsBetter: false,
      description: "arrancada de classificação",
    },
    {
      label: "VMR",
      shortLabel: "VMR",
      a: comparePilotA.mv,
      b: comparePilotB.mv,
      lowerIsBetter: false,
      description: "ritmo de volta rápida",
    },
    {
      label: "Pódios",
      shortLabel: "PDS",
      a: comparePilotA.podios,
      b: comparePilotB.podios,
      lowerIsBetter: false,
      description: "presença no top 6",
    },
    {
      label: "Participações",
      shortLabel: "PART",
      a: comparePilotA.participacoes,
      b: comparePilotB.participacoes,
      lowerIsBetter: false,
      description: "volume competitivo",
    },
    {
      label: "ADV",
      shortLabel: "ADV",
      a: comparePilotA.adv,
      b: comparePilotB.adv,
      lowerIsBetter: true,
      description: "disciplina na pista",
    },
  ];
}, [comparePilotA, comparePilotB]);

const duelSummary = useMemo(() => {
  if (!comparePilotA || !comparePilotB || duelMetrics.length === 0) {
    return null;
  }

  let scoreA = 0;
  let scoreB = 0;

  duelMetrics.forEach((metric) => {
    const winner = getComparisonWinner(metric.a, metric.b, metric.lowerIsBetter);
    if (winner === "a") scoreA += 1;
    if (winner === "b") scoreB += 1;
  });

  const pointsWinner = getComparisonWinner(comparePilotA.pontos, comparePilotB.pontos, false);
  const advWinner = getComparisonWinner(comparePilotA.adv, comparePilotB.adv, true);
  const overallWinner = scoreA === scoreB ? pointsWinner : scoreA > scoreB ? "a" : "b";
  const scoreDiff = Math.abs(scoreA - scoreB);
  const pointsDiff = Math.abs(comparePilotA.pontos - comparePilotB.pontos);

  return {
    scoreA,
    scoreB,
    pointsWinner,
    advWinner,
    overallWinner,
    scoreDiff,
    pointsDiff,
    narrative: getDuelNarrative({ scoreA, scoreB, pointsDiff }),
    profileLabel: getDuelProfileLabel({
      scoreA,
      scoreB,
      pointsWinner,
      advWinner,
    }),
  };
}, [comparePilotA, comparePilotB, duelMetrics]);

const duelIntensity = useMemo(() => {
  if (!duelSummary) {
    return {
      label: "SEM LEITURA",
      tone: isDarkMode
        ? "border-white/10 bg-white/5 text-zinc-300"
        : "border-zinc-200 bg-zinc-50 text-zinc-600",
      description: "Aguardando confronto válido.",
    };
  }

  if (duelSummary.overallWinner === "tie") {
    if (duelSummary.pointsDiff <= 3) {
      return {
        label: "EMPATE TÉCNICO",
        tone: isDarkMode
          ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
          : "border-yellow-200 bg-yellow-50 text-yellow-700",
        description: "Nenhum piloto conseguiu abrir vantagem clara.",
      };
    }

    return {
      label: "PRESSÃO NOS DETALHES",
      tone: isDarkMode
        ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
        : "border-blue-200 bg-blue-50 text-blue-700",
      description: "O duelo está equilibrado, mas com leve inclinação pontual.",
    };
  }

  if (duelSummary.scoreDiff >= 4) {
    return {
      label: "SUPERIORIDADE CLARA",
      tone: isDarkMode
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
        : "border-emerald-200 bg-emerald-50 text-emerald-700",
      description: "Um dos lados domina a maior parte dos territórios do confronto.",
    };
  }

  if (duelSummary.scoreDiff >= 2) {
    return {
      label: "VANTAGEM CONSISTENTE",
      tone: isDarkMode
        ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
        : "border-blue-200 bg-blue-50 text-blue-700",
      description: "Há superioridade real, mas ainda existe espaço para reação.",
    };
  }

  return {
    label: "DUELO APERTADO",
    tone: isDarkMode
      ? "border-orange-500/30 bg-orange-500/10 text-orange-300"
      : "border-orange-200 bg-orange-50 text-orange-700",
    description: "A disputa segue aberta e sensível a qualquer mudança de ritmo.",
  };
}, [duelSummary, isDarkMode]);

const duelWinnerPilot = useMemo(() => {
  if (!duelSummary || !comparePilotA || !comparePilotB) return null;
  if (duelSummary.overallWinner === "a") return comparePilotA;
  if (duelSummary.overallWinner === "b") return comparePilotB;
  return null;
}, [duelSummary, comparePilotA, comparePilotB]);

  const selectedPilotShortName = useMemo(
    () => getPilotFirstAndLastName(selectedPilot?.piloto),
    [selectedPilot]
  );

  const selectedPilotWarName = useMemo(
    () => getPilotWarNameDisplay(selectedPilot),
    [selectedPilot]
  );

  const safeSelectedPilot: RankingItem = selectedPilot ?? {
    pos: 0,
    pilotoId: "",
    piloto: "",
    nomeGuerra: "",
    pontos: 0,
    adv: 0,
    participacoes: 0,
    vitorias: 0,
    poles: 0,
    mv: 0,
    podios: 0,
    descarte: 0,
    categoriaAtual: category,
    competicao: competition,
    categoria: category,
  };


  const selectedPilotGap = useMemo(() => {
    if (!selectedPilot || !leader) return "-";
    return getGapToLeader(leader.pontos, safeSelectedPilot.pontos);
  }, [selectedPilot, leader]);

  const selectedPilotAverage = useMemo(
    () => getPilotEfficiency(selectedPilot),
    [selectedPilot]
  );

  const selectedPilotBestAttribute = useMemo(
    () => getSelectedPilotBestAttribute(selectedPilot),
    [selectedPilot]
  );

  const selectedPilotConsistency = useMemo(
    () => getPilotConsistencyLabel(selectedPilot),
    [selectedPilot]
  );

  const selectedPilotMomentum = useMemo(
    () => getPilotMomentumLabel(selectedPilot, leader),
    [selectedPilot, leader]
  );

  const selectedPilotVsLeader = useMemo(() => {
    if (!selectedPilot || !leader) return 0;
    return getPerformancePercentage(
      safeSelectedPilot.pontos,
      leader.pontos || safeSelectedPilot.pontos || 1
    );
  }, [selectedPilot, leader]);

  const selectedPilotPodiumRate = useMemo(() => {
    if (!selectedPilot) return 0;
    return getPerformancePercentage(safeSelectedPilot.podios, safeSelectedPilot.participacoes || 1);
  }, [selectedPilot]);

  const selectedPilotWinRate = useMemo(() => {
    if (!selectedPilot) return 0;
    return getPerformancePercentage(safeSelectedPilot.vitorias, safeSelectedPilot.participacoes || 1);
  }, [selectedPilot]);

  const selectedPilotDiscipline = useMemo(() => {
    if (!selectedPilot || safeSelectedPilot.participacoes <= 0) return 100;
    const penalty = getPerformancePercentage(safeSelectedPilot.adv, safeSelectedPilot.participacoes);
    return Math.max(0, 100 - penalty);
  }, [selectedPilot]);

  const selectedPilotLeaderGapValue = useMemo(() => {
    if (!selectedPilot || !leader) return 0;
    return Math.max(0, leader.pontos - safeSelectedPilot.pontos);
  }, [selectedPilot, leader]);

  const selectedPilotWinRateLabel = useMemo(() => {
    if (!selectedPilot || safeSelectedPilot.participacoes <= 0) return "sem leitura";
    if (selectedPilotWinRate >= 40) return "índice vencedor";
    if (selectedPilotWinRate >= 20) return "boa conversão";
    if (selectedPilotWinRate > 0) return "ainda pode crescer";
    return "busca a 1ª vitória";
  }, [selectedPilot, selectedPilotWinRate]);

  const selectedPilotPodiumRateLabel = useMemo(() => {
    if (!selectedPilot || safeSelectedPilot.participacoes <= 0) return "sem leitura";
    if (selectedPilotPodiumRate >= 70) return "top 6 muito forte";
    if (selectedPilotPodiumRate >= 50) return "regularidade alta";
    if (selectedPilotPodiumRate > 0) return "presença competitiva";
    return "fora do top 6";
  }, [selectedPilot, selectedPilotPodiumRate]);

  const selectedPilotDisciplineLabel = useMemo(() => {
    if (!selectedPilot || safeSelectedPilot.participacoes <= 0) return "sem leitura";
    if (selectedPilotDiscipline >= 90) return "conduta exemplar";
    if (selectedPilotDiscipline >= 75) return "controle estável";
    if (selectedPilotDiscipline >= 60) return "atenção moderada";
    return "risco disciplinar";
  }, [selectedPilot, selectedPilotDiscipline]);

  const selectedPilotRivalAhead = useMemo(() => {
    if (!selectedPilot) return null;

    const pilotIndex = filteredRanking.findIndex(
      (item) =>
        item.pilotoId === safeSelectedPilot.pilotoId &&
        item.competicao === safeSelectedPilot.competicao
    );

    if (pilotIndex <= 0) return null;
    return filteredRanking[pilotIndex - 1] || null;
  }, [filteredRanking, selectedPilot]);

  const selectedPilotRivalDirect = useMemo(() => {
    if (!selectedPilot || filteredRanking.length <= 1) return null;

    const currentIndex = filteredRanking.findIndex(
      (item) =>
        item.pilotoId === safeSelectedPilot.pilotoId &&
        item.competicao === safeSelectedPilot.competicao
    );

    if (currentIndex === -1) return null;

    const previousPilot = currentIndex > 0 ? filteredRanking[currentIndex - 1] : null;
    const nextPilot = currentIndex < filteredRanking.length - 1 ? filteredRanking[currentIndex + 1] : null;

    if (!previousPilot) return nextPilot;
    if (!nextPilot) return previousPilot;

    const diffAbove = Math.abs(previousPilot.pontos - safeSelectedPilot.pontos);
    const diffBelow = Math.abs(safeSelectedPilot.pontos - nextPilot.pontos);

    return diffAbove <= diffBelow ? previousPilot : nextPilot;
  }, [filteredRanking, selectedPilot, safeSelectedPilot]);

  const top3TitleFight = useMemo(() => filteredRanking.slice(0, 3), [filteredRanking]);

  const pilotTrendMap = useMemo(() => {
    const categoryData = rankingData[category];
    const map: Record<string, PilotTrendStatus> = {};

    filteredRanking.forEach((pilot) => {
      const key = pilot.pilotoId || normalizePilotName(pilot.piloto);
      map[key] = getPilotTrendStatus({
        pilot,
        competition,
        categoryData,
      });
    });

    return map;
  }, [filteredRanking, rankingData, category, competition]);

  const titleFightStatus = useMemo(
    () => currentCompetitionMeta?.titleFight || getTitleFightStatus(top3TitleFight),
    [top3TitleFight, currentCompetitionMeta]
  );

  const topPointsChartData = useMemo(
    () => getTopPointsChartData(filteredRanking, 5),
    [filteredRanking]
  );

  const topVitorias = useMemo(
    () => getTopMetricRanking(filteredRanking, "vitorias", 5),
    [filteredRanking]
  );

  const topPoles = useMemo(
    () => getTopMetricRanking(filteredRanking, "poles", 5),
    [filteredRanking]
  );

  const topMv = useMemo(
    () => getTopMetricRanking(filteredRanking, "mv", 5),
    [filteredRanking]
  );

  const topPodios = useMemo(
    () => getTopMetricRanking(filteredRanking, "podios", 5),
    [filteredRanking]
  );

  const statsSummary = useMemo(() => {
    if (currentCompetitionMeta?.summary) {
      return currentCompetitionMeta.summary;
    }

    const totalPilots = filteredRanking.length;
    const leaderPoints = filteredRanking[0]?.pontos || 0;
    const vicePoints = filteredRanking[1]?.pontos || 0;
    const top6CutPoints =
      totalPilots >= 6
        ? filteredRanking[5]?.pontos || 0
        : filteredRanking[totalPilots - 1]?.pontos || 0;

    const totalPoints = filteredRanking.reduce((sum, item) => sum + item.pontos, 0);
    const avgPoints = totalPilots > 0 ? totalPoints / totalPilots : 0;

    const totalVictories = filteredRanking.reduce(
      (sum, item) => sum + item.vitorias,
      0
    );
    const totalPodiums = filteredRanking.reduce(
      (sum, item) => sum + item.podios,
      0
    );

    return {
      totalPilots,
      leaderPoints,
      vicePoints,
      leaderAdvantage: Math.max(leaderPoints - vicePoints, 0),
      top6CutPoints,
      avgPoints,
      totalVictories,
      totalPodiums,
    };
  }, [filteredRanking, currentCompetitionMeta]);

  const statsRadar = useMemo(() => {
    if (currentCompetitionMeta?.radar) {
      return currentCompetitionMeta.radar;
    }

    if (filteredRanking.length === 0) {
      return {
        hottestPilot: null as RankingMetaPilot | null,
        hottestLabel: "Sem leitura",
        podiumPressure: 0,
        titleHeat: "Sem disputa",
      };
    }

    const hottestPilot = [...filteredRanking].sort((a, b) => {
      const aScore = a.vitorias * 4 + a.poles * 2 + a.mv * 2 + a.podios;
      const bScore = b.vitorias * 4 + b.poles * 2 + b.mv * 2 + b.podios;
      if (bScore !== aScore) return bScore - aScore;
      return b.pontos - a.pontos;
    })[0];

    const podiumPressure =
      filteredRanking.length >= 6
        ? Math.max((filteredRanking[2]?.pontos || 0) - (filteredRanking[5]?.pontos || 0), 0)
        : Math.max((filteredRanking[0]?.pontos || 0) - (filteredRanking[filteredRanking.length - 1]?.pontos || 0), 0);

    const titleDiff = Math.max(
      (filteredRanking[0]?.pontos || 0) - (filteredRanking[1]?.pontos || 0),
      0
    );

    let titleHeat = "Disputa em aberto";
    if (filteredRanking.length < 2) {
      titleHeat = "Sem disputa";
    } else if (titleDiff <= 3) {
      titleHeat = "Briga acirrada";
    } else if (titleDiff <= 8) {
      titleHeat = "Controle parcial";
    } else {
      titleHeat = "Liderança isolada";
    }

    let hottestLabel = "Momento forte";
    if ((hottestPilot?.vitorias || 0) >= 3) {
      hottestLabel = "Ataque dominante";
    } else if ((hottestPilot?.podios || 0) >= 4) {
      hottestLabel = "Consistência premium";
    } else if ((hottestPilot?.poles || 0) >= 2 || (hottestPilot?.mv || 0) >= 2) {
      hottestLabel = "Velocidade em alta";
    }

    return {
      hottestPilot,
      hottestLabel,
      podiumPressure,
      titleHeat,
    };
  }, [filteredRanking, currentCompetitionMeta]);

  const bestEfficiencyPilot = useMemo(() => {
    if (currentCompetitionMeta?.bestEfficiencyPilot) {
      return currentCompetitionMeta.bestEfficiencyPilot;
    }

    const eligible = filteredRanking.filter((item) => item.participacoes > 0);

    if (eligible.length === 0) return null;

    return [...eligible].sort((a, b) => {
      const aEfficiency = a.pontos / Math.max(a.participacoes, 1);
      const bEfficiency = b.pontos / Math.max(b.participacoes, 1);
      if (bEfficiency !== aEfficiency) return bEfficiency - aEfficiency;
      return b.pontos - a.pontos;
    })[0];
  }, [filteredRanking, currentCompetitionMeta]);

  function handleSelectPilot(pilot: RankingItem) {
    scrollPageToTop("auto");
    setSelectedPilot(pilot);
    setActiveTab("piloto");

    window.setTimeout(() => {
      scrollPageToTop("smooth");
    }, 30);
  }

  function handleBackToRanking() {
    setActiveTab("classificacao");
  }

  function toggleDarkMode() {
    setIsDarkMode((prev) => !prev);
  }

  async function handleShareClassification() {
    if (!shareCardRef.current || isSharingImage) return;

    try {
      setIsSharingImage(true);
      const dataUrl = await htmlToImage.toPng(shareCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: isDarkMode ? "#0b1220" : "#f4f4f5",
      });

      const link = document.createElement("a");
      link.download = `classificacao-${category.toLowerCase()}-${competition.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      window.alert("Não foi possível gerar a imagem da classificação.");
    } finally {
      setIsSharingImage(false);
    }
  }

  async function handleSharePilotCard() {
    if (!selectedPilot || !pilotShareCardRef.current || isSharingPilotImage) return;

    try {
      setIsSharingPilotImage(true);
      const dataUrl = await htmlToImage.toPng(pilotShareCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: isDarkMode ? "#0b1220" : "#f4f4f5",
      });

      const safePilotName = getPilotFirstAndLastName(safeSelectedPilot.piloto)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/\s+/g, "-");

      const link = document.createElement("a");
      link.download = `piloto-${safePilotName}-${category.toLowerCase()}-${competition.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      window.alert("Não foi possível gerar a imagem do piloto.");
    } finally {
      setIsSharingPilotImage(false);
    }
  }

  if (loading) {
    return (
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-[#0b1220] text-white" : "bg-[#f3f4f6] text-zinc-950"
        }`}
      >
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <p className="text-xl font-semibold tracking-tight">
              Carregando campeonato...
            </p>
            <p
              className={`mt-2 text-sm ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Preparando classificação oficial
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-[#0b1220] text-white" : "bg-[#f3f4f6] text-zinc-950"
        }`}
      >
        <div className="flex min-h-screen items-center justify-center px-6">
          <div
            className={`max-w-md rounded-3xl p-6 text-center shadow-sm ${
              isDarkMode
                ? "border border-red-500/30 bg-[#111827]"
                : "border border-red-300 bg-white"
            }`}
          >
            <p className="text-2xl font-semibold tracking-tight">Erro</p>
            <p
              className={`mt-2 ${
                isDarkMode ? "text-zinc-300" : "text-zinc-600"
              }`}
            >
              {error}
            </p>
            <p
              className={`mt-4 text-sm ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Abra <strong>/api/ranking</strong> no navegador para testar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        isDarkMode ? "bg-[#0b1220] text-white" : "bg-[#f3f4f6] text-zinc-950"
      }`}
    >
      <div className="mx-auto max-w-md px-2.5 pb-32 pt-1.5">
        <header
          className={`sticky top-0 z-20 mb-1.5 overflow-hidden rounded-[20px] shadow-[0_10px_25px_rgba(15,23,42,0.06)] ${
            isDarkMode
              ? "border border-white/10 bg-[#111827]"
              : "border border-black/5 bg-white"
          }`}
        >
          <div
            className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent ${theme.primaryRing} to-transparent`}
          />

          <div className="space-y-1 px-2.5 pb-1.5 pt-2">
            <div
              className={`overflow-hidden rounded-[15px] ${
                isDarkMode
                  ? "border border-white/10 bg-[#0f172a]"
                  : "border border-black/5 bg-zinc-50"
              }`}
            >
              <div className="relative h-[62px] w-full sm:h-[70px] md:h-[78px]">
                <Image
                  src="/banner-topo.png"
                  alt="Classificação Oficial"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 448px"
                  className="object-contain object-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1">
              <div
                className={`rounded-[15px] px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] ${
                  isDarkMode
                    ? "border border-white/10 bg-gradient-to-b from-[#111827] to-[#0f172a]"
                    : "border border-black/5 bg-gradient-to-b from-zinc-50 to-white"
                }`}
              >
                <div className="mb-0.5 flex items-center justify-between">
                  <p
                    className={`text-[8px] font-bold uppercase tracking-[0.16em] ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-400"
                    }`}
                  >
                    Categoria
                  </p>
                  <div
                    className={`ml-2 h-px flex-1 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        : "bg-gradient-to-r from-zinc-200/0 via-zinc-200 to-zinc-200/0"
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex flex-wrap gap-1">
                    {categories.map((cat) => {
                      const active = category === cat;

                      const styles = {
                        Base: active
                          ? "border-orange-400 bg-gradient-to-b from-orange-100 to-orange-200 text-orange-900 shadow-[0_4px_10px_rgba(249,115,22,0.22)]"
                          : isDarkMode
                            ? "border-orange-500/30 bg-[#111827] text-orange-300 shadow-sm hover:bg-orange-500/10"
                            : "border-orange-200 bg-white text-orange-700 shadow-sm hover:bg-orange-50",
                        Graduados: active
                          ? "border-blue-400 bg-gradient-to-b from-blue-100 to-blue-200 text-blue-900 shadow-[0_4px_10px_rgba(59,130,246,0.22)]"
                          : isDarkMode
                            ? "border-blue-500/30 bg-[#111827] text-blue-300 shadow-sm hover:bg-blue-500/10"
                            : "border-blue-200 bg-white text-blue-700 shadow-sm hover:bg-blue-50",
                        Elite: active
                          ? "border-yellow-400 bg-gradient-to-b from-yellow-100 to-yellow-200 text-yellow-900 shadow-[0_4px_10px_rgba(234,179,8,0.22)]"
                          : isDarkMode
                            ? "border-yellow-500/30 bg-[#111827] text-yellow-300 shadow-sm hover:bg-yellow-500/10"
                            : "border-yellow-200 bg-white text-yellow-700 shadow-sm hover:bg-yellow-50",
                      };

                      return (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-all duration-200 ${
                            styles[cat as keyof typeof styles]
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={toggleDarkMode}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText} hover:opacity-90`
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                    aria-label={
                      isDarkMode ? "Ativar modo diurno" : "Ativar modo noturno"
                    }
                    title={
                      isDarkMode ? "Ativar modo diurno" : "Ativar modo noturno"
                    }
                  >
                    {isDarkMode ? (
                      <Sun className="h-4.5 w-4.5" />
                    ) : (
                      <Moon className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
              </div>

              <div
                className={`rounded-[15px] px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] ${
                  isDarkMode
                    ? "border border-white/10 bg-gradient-to-b from-[#111827] to-[#0f172a]"
                    : "border border-black/5 bg-gradient-to-b from-zinc-50 to-white"
                }`}
              >
                <div className="mb-0.5 flex items-center justify-between">
                  <p
                    className={`text-[8px] font-bold uppercase tracking-[0.16em] ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-400"
                    }`}
                  >
                    Campeonato
                  </p>
                  <div
                    className={`ml-2 h-px flex-1 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        : "bg-gradient-to-r from-zinc-200/0 via-zinc-200 to-zinc-200/0"
                    }`}
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {availableCompetitions.map((comp) => {
                    const active = competition === comp;
                    return (
                      <button
                        key={comp}
                        onClick={() => setCompetition(comp)}
                        className={`whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-semibold transition-all duration-200 ${
                          active
                            ? "border-yellow-400 bg-gradient-to-b from-[#fff8d2] to-[#f5e8a6] text-[#7a5600] shadow-[0_4px_10px_rgba(234,179,8,0.22)]"
                            : isDarkMode
                              ? "border-white/10 bg-[#111827] text-zinc-200 shadow-sm hover:border-yellow-500/30 hover:bg-yellow-500/10"
                              : "border-zinc-200 bg-white text-zinc-700 shadow-sm hover:border-yellow-200 hover:bg-yellow-50/40"
                        }`}
                      >
                        {competitionLabels[comp] || comp}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section
          className={`overflow-hidden rounded-[24px] border px-3 py-3 shadow-sm ${
            isDarkMode
              ? `border-white/10 bg-gradient-to-br ${theme.darkAccentCard}`
              : `${theme.primaryBorder} bg-gradient-to-br ${theme.shellGlow}`
          }`}
        >
          <div
            className={`mb-3 rounded-[18px] border px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ${
              isDarkMode
                ? `${theme.darkAccentBorder} bg-gradient-to-b from-[#111827] to-[#161e2b]`
                : `${theme.heroBorder} bg-gradient-to-b ${theme.heroBg}`
            }`}
          >
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] shadow-sm ${
                    isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                  }`}
                >
                  <Trophy
                    className={`h-5.5 w-5.5 ${
                      isDarkMode ? theme.darkAccentText : theme.primaryIcon
                    }`}
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <p
                    className={`text-[18px] font-extrabold uppercase tracking-[0.14em] leading-none ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    PILOTO DESTAQUE
                  </p>
                  <p
                    className={`mt-1 whitespace-nowrap text-[8.5px] font-semibold uppercase tracking-[0.08em] sm:text-[9px] ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    LÍDER DA CATEGORIA E CAMPEONATO SELECIONADO
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex min-h-[288px] flex-col gap-2.5">
              <Card
                className={`h-[162px] overflow-hidden rounded-[24px] shadow-none ${
                  isDarkMode ? spotlightStyles.leftCard : spotlightStyles.leftCard
                }`}
              >
                <CardContent className="h-full p-0">
                  <div className="relative h-full w-full overflow-hidden">
                    <PilotPhotoSlot
                      pilot={leader}
                      alt={getPilotHighlightName(leader?.piloto)}
                      isDark={isDarkMode}
                    />

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/34 via-black/8 to-transparent" />

                    <div className="absolute inset-x-0 bottom-2 z-20 px-3">
                      <div className={`mx-auto flex max-w-[74%] items-center justify-center rounded-[15px] border px-2.5 py-1.5 backdrop-blur-md ${spotlightStyles.badge}`}>
                        <p className="truncate whitespace-nowrap text-[9.5px] font-black uppercase tracking-[0.12em]">
                          {getPilotWarName(leader) ? getPilotWarName(leader).toUpperCase() : getPilotHighlightName(leader?.piloto)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`h-[123px] overflow-hidden rounded-[24px] shadow-none ${spotlightStyles.leftSubcard}`}
              >
                <CardContent className="flex h-full items-center justify-center px-3 py-2.5">
                  <div className="flex h-full w-full flex-col items-center justify-center text-center">
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <p className={`text-[8px] font-bold uppercase tracking-[0.22em] ${spotlightStyles.label}`}>
                        Líder
                      </p>
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[12px] ${isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap}`}>
                        <Crown className={`h-3.5 w-3.5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center leading-none">
                      <p className={`text-[18px] font-black tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                        {leaderName.firstName.toUpperCase()}
                      </p>
                      <p className={`mt-1 text-[10.5px] font-semibold tracking-[0.08em] ${isDarkMode ? "text-zinc-300" : "text-zinc-800"}`}>
                        {leaderName.lastName ? leaderName.lastName.toUpperCase() : ""}
                      </p>
                    </div>

                    <div className="mt-3 flex justify-center">
                      <div className={`inline-flex items-center rounded-full border px-4 py-1.5 ${spotlightStyles.badge}`}>
                        <p className="text-[10.5px] font-black leading-none">
                          {leader?.pontos || 0} pontos
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex min-h-[288px] flex-col gap-2">
              {[
                {
                  title: "Vitórias",
                  value: leader?.vitorias || 0,
                  subtitle: "ataque vencedor",
                  icon: Medal,
                },
                {
                  title: "Pódios",
                  value: leader?.podios || 0,
                  subtitle: "presença top 6",
                  icon: Trophy,
                },
                {
                  title: "VMR",
                  value: leader?.mv || 0,
                  subtitle: "ritmo mais rápido",
                  icon: Timer,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <Card
                    key={item.title}
                    className={`h-[92px] overflow-hidden rounded-[22px] shadow-none ${spotlightStyles.statCard}`}
                  >
                    <CardContent className="relative h-full p-3">
                      <div className="flex h-full items-center justify-between gap-2">
                        <div className="flex min-w-0 w-[40%] flex-col items-center justify-center text-center">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/92">
                            {item.title}
                          </p>
                          <p className="mt-2 text-[34px] font-black leading-none tracking-tight text-white">
                            {item.value}
                          </p>
                        </div>

                        <div className="flex min-w-0 w-[44%] flex-col items-end justify-center gap-2 pr-1">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${spotlightStyles.iconBubble}`}>
                            <Icon className="h-4.5 w-4.5" />
                          </div>

                          <p className="max-w-[82px] text-right text-[8.5px] font-semibold uppercase leading-[1.15] tracking-[0.08em] text-white/86">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3">
          <TabsList className="relative z-10 mb-6 grid h-auto w-full grid-cols-4 gap-2.5 bg-transparent p-0 shadow-none">
            {[
              {
                value: "classificacao",
                label: "Classificação",
                icon: TableProperties,
              },
              {
                value: "piloto",
                label: "Piloto",
                icon: User,
              },
              {
                value: "comparador",
                label: "Comparar",
                icon: Swords,
              },
              {
                value: "stats",
                label: "Stats",
                icon: BarChart3,
              },
            ].map((tabItem) => {
              const Icon = tabItem.icon;
              const isActive = activeTab === tabItem.value;

              const activeGlow =
                category === "Base"
                  ? isDarkMode
                    ? "shadow-[0_10px_22px_rgba(249,115,22,0.24),0_0_0_1px_rgba(249,115,22,0.28)]"
                    : "shadow-[0_10px_22px_rgba(249,115,22,0.18),0_0_0_1px_rgba(249,115,22,0.16)]"
                  : category === "Graduados"
                    ? isDarkMode
                      ? "shadow-[0_10px_22px_rgba(59,130,246,0.24),0_0_0_1px_rgba(59,130,246,0.28)]"
                      : "shadow-[0_10px_22px_rgba(59,130,246,0.18),0_0_0_1px_rgba(59,130,246,0.16)]"
                    : isDarkMode
                      ? "shadow-[0_10px_22px_rgba(234,179,8,0.24),0_0_0_1px_rgba(234,179,8,0.28)]"
                      : "shadow-[0_10px_22px_rgba(234,179,8,0.18),0_0_0_1px_rgba(234,179,8,0.16)]";

              const activeSurface =
                category === "Base"
                  ? isDarkMode
                    ? "border-orange-500/45 bg-[linear-gradient(180deg,rgba(249,115,22,0.18)_0%,#132033_54%,#09111d_100%)] text-white shadow-[0_12px_24px_rgba(0,0,0,0.34),0_0_0_1px_rgba(249,115,22,0.12)]"
                    : "border-orange-300 bg-gradient-to-b from-orange-50 to-white text-zinc-950"
                  : category === "Graduados"
                    ? isDarkMode
                      ? "border-blue-500/45 bg-[linear-gradient(180deg,rgba(59,130,246,0.18)_0%,#132033_54%,#09111d_100%)] text-white shadow-[0_12px_24px_rgba(0,0,0,0.34),0_0_0_1px_rgba(59,130,246,0.12)]"
                      : "border-blue-300 bg-gradient-to-b from-blue-50 to-white text-zinc-950"
                    : isDarkMode
                      ? "border-yellow-500/45 bg-[linear-gradient(180deg,rgba(234,179,8,0.18)_0%,#132033_54%,#09111d_100%)] text-white shadow-[0_12px_24px_rgba(0,0,0,0.34),0_0_0_1px_rgba(234,179,8,0.12)]"
                      : "border-yellow-300 bg-gradient-to-b from-yellow-50 to-white text-zinc-950";

              return (
                <TabsTrigger
                  key={tabItem.value}
                  value={tabItem.value}
                  className={`h-[64px] rounded-[18px] px-2 py-1.5 shadow-sm transition-all duration-300 ${
                    isActive
                      ? `${activeSurface} ${activeGlow} scale-[1.01]`
                      : isDarkMode
                        ? "border border-white/8 bg-[linear-gradient(180deg,#091120_0%,#060d18_100%)] text-zinc-300 hover:border-white/16 hover:bg-[#0d1726] shadow-[0_10px_22px_rgba(0,0,0,0.28)]"
                        : "border border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex h-full flex-col items-center justify-center gap-1">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-[12px] transition-all duration-300 ${
                        isActive
                          ? category === "Base"
                            ? isDarkMode
                              ? "bg-orange-500/15 text-orange-300"
                              : "bg-orange-100 text-orange-700"
                            : category === "Graduados"
                              ? isDarkMode
                                ? "bg-blue-500/15 text-blue-300"
                                : "bg-blue-100 text-blue-700"
                              : isDarkMode
                                ? "bg-yellow-500/15 text-yellow-300"
                                : "bg-yellow-100 text-yellow-700"
                          : isDarkMode
                            ? "bg-white/6 text-zinc-200"
                            : "bg-zinc-50 text-zinc-500"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <span
                      className={`max-w-full text-center font-bold uppercase whitespace-nowrap ${
                        tabItem.value === "classificacao"
                          ? "text-[8px] leading-none tracking-[0.06em]"
                          : "text-[9px] leading-none tracking-[0.1em]"
                      }`}
                    >
                      {tabItem.label}
                    </span>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="classificacao" className="mt-0 space-y-3 pt-0.5">
            <Card
              className={`rounded-[20px] shadow-sm ${
                isDarkMode
                  ? `border ${theme.darkAccentBorder} bg-[#111827]`
                  : `border ${theme.searchBorder} bg-gradient-to-br from-white via-white to-zinc-50/70`
              }`}
            >
              <CardContent className="p-2.5">
                <div className="mb-2.5 flex items-center gap-2">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] ${
                      isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                    }`}
                  >
                    <Search
                      className={`h-4.5 w-4.5 ${
                        isDarkMode ? theme.darkAccentText : theme.searchIcon
                      }`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[8px] font-bold uppercase tracking-[0.18em] ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-400"
                      }`}
                    >
                      Busca rápida
                    </p>
                    <p
                      className={`mt-0.5 text-[11px] font-semibold leading-tight ${
                        isDarkMode ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      Encontre um piloto na classificação
                    </p>
                  </div>

                  <div
                    className={`shrink-0 rounded-full border px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                        : theme.searchBadge
                    }`}
                  >
                    {competitionLabels[competition] || competition}
                  </div>
                </div>

                <div
                  className={`group flex items-center rounded-[16px] border px-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.98)] transition ${
                    isDarkMode
                      ? `${theme.darkAccentBorder} bg-[#0f172a]`
                      : `border-black/5 bg-gradient-to-b from-white to-zinc-50 focus-within:ring-4 ${theme.searchGlow}`
                  }`}
                >
                  <div className="flex h-8 w-7 items-center justify-center">
                    <Search
                      className={`h-4.5 w-4.5 shrink-0 ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-400"
                      }`}
                    />
                  </div>
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar piloto"
                    className={`h-10 border-0 bg-transparent pl-0.5 pr-0 text-[14px] shadow-none outline-none ring-0 focus-visible:ring-0 ${
                      isDarkMode
                        ? "text-white placeholder:text-zinc-500"
                        : "text-zinc-950 placeholder:text-zinc-400"
                    }`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card
              className={`rounded-[20px] shadow-sm ${
                isDarkMode
                  ? `border ${theme.darkAccentBorder} bg-[#111827]`
                  : `border ${theme.searchBorder} bg-gradient-to-br from-white via-white to-zinc-50/70`
              }`}
            >
              <CardContent className="p-2.5">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] ${
                        isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                      }`}
                    >
                      <Share2
                        className={`h-4.5 w-4.5 ${
                          isDarkMode ? theme.darkAccentText : theme.searchIcon
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[8px] font-bold uppercase tracking-[0.18em] ${
                          isDarkMode ? "text-zinc-400" : "text-zinc-400"
                        }`}
                      >
                        Compartilhamento oficial
                      </p>
                      <p
                        className={`mt-0.5 text-[11px] font-semibold leading-tight ${
                          isDarkMode ? "text-white" : "text-zinc-900"
                        }`}
                      >
                        Gere uma imagem pronta da classificação atual
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleShareClassification}
                    disabled={isSharingImage || filteredRanking.length === 0}
                    className={`shrink-0 rounded-full border px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] transition-all duration-200 ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText} disabled:opacity-50`
                        : `${theme.searchBadge} disabled:opacity-50`
                    }`}
                  >
                    {isSharingImage ? "Gerando..." : "Compartilhar"}
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`overflow-hidden rounded-[22px] shadow-sm ${
                isDarkMode
                  ? `border ${theme.darkAccentBorder} bg-[#111827]`
                  : `border ${theme.searchBorder} bg-gradient-to-br from-white via-white to-zinc-50/70`
              }`}
            >
              <CardContent className="p-2.5">
                <div className="mb-2.5 flex items-center gap-2">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] ${
                      isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                    }`}
                  >
                    <Gauge
                      className={`h-4.5 w-4.5 ${
                        isDarkMode ? theme.darkAccentText : theme.searchIcon
                      }`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[8px] font-bold uppercase tracking-[0.18em] ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-400"
                      }`}
                    >
                      Contexto competitivo
                    </p>
                    <p
                      className={`mt-0.5 text-[11px] font-semibold leading-tight ${
                        isDarkMode ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      Leitura rápida oficial do campeonato selecionado
                    </p>
                  </div>

                  <div
                    className={`shrink-0 rounded-full border px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] ${
                      isDarkMode
                        ? titleFightStatus.label === "BRIGA ACIRRADA"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                          : titleFightStatus.label === "DISPUTA CONTROLADA"
                            ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                            : "border-white/10 bg-white/5 text-zinc-300"
                        : titleFightStatus.tone
                    }`}
                  >
                    {titleFightStatus.label}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div
                    className={`rounded-[16px] border px-2.5 py-2.5 ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} bg-[#0f172a]`
                        : "border-black/5 bg-white/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                            isDarkMode ? "text-zinc-500" : "text-zinc-400"
                          }`}
                        >
                          Título
                        </p>
                        <p
                          className={`mt-1 text-[15px] font-extrabold leading-tight ${
                            isDarkMode ? "text-white" : "text-zinc-950"
                          }`}
                        >
                          {statsRadar.titleHeat}
                        </p>
                      </div>

                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl ${
                          isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                        }`}
                      >
                        <Crown
                          className={`h-4 w-4 ${
                            isDarkMode ? theme.darkAccentText : theme.primaryIcon
                          }`}
                        />
                      </div>
                    </div>

                    <p
                      className={`mt-1.5 text-[10px] leading-snug ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      {statsSummary.totalPilots > 1
                        ? `${statsSummary.leaderAdvantage} pts entre líder e vice nesta leitura oficial.`
                        : "Ainda não há confronto consolidado pela liderança."}
                    </p>
                  </div>

                  <div
                    className={`rounded-[16px] border px-2.5 py-2.5 ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} bg-[#0f172a]`
                        : "border-black/5 bg-white/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                            isDarkMode ? "text-zinc-500" : "text-zinc-400"
                          }`}
                        >
                          Corte Top 6
                        </p>
                        <p
                          className={`mt-1 text-[15px] font-extrabold leading-tight ${
                            isDarkMode ? "text-white" : "text-zinc-950"
                          }`}
                        >
                          {statsSummary.top6CutPoints} pts
                        </p>
                      </div>

                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl ${
                          isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                        }`}
                      >
                        <Trophy
                          className={`h-4 w-4 ${
                            isDarkMode ? theme.darkAccentText : theme.primaryIcon
                          }`}
                        />
                      </div>
                    </div>

                    <p
                      className={`mt-1.5 text-[10px] leading-snug ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      {statsSummary.totalPilots >= 6
                        ? `${statsRadar.podiumPressure} pts separam o 3º do 6º colocado.`
                        : "Leitura adaptada ao número atual de pilotos pontuando."}
                    </p>
                  </div>

                  <div
                    className={`rounded-[16px] border px-2.5 py-2.5 ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} bg-[#0f172a]`
                        : "border-black/5 bg-white/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                            isDarkMode ? "text-zinc-500" : "text-zinc-400"
                          }`}
                        >
                          Momento do grid
                        </p>
                        <p
                          className={`mt-1 text-[15px] font-extrabold leading-tight ${
                            isDarkMode ? "text-white" : "text-zinc-950"
                          }`}
                        >
                          {statsRadar.hottestLabel}
                        </p>
                      </div>

                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl ${
                          isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                        }`}
                      >
                        <TrendingUp
                          className={`h-4 w-4 ${
                            isDarkMode ? theme.darkAccentText : theme.primaryIcon
                          }`}
                        />
                      </div>
                    </div>

                    <p
                      className={`mt-1.5 text-[10px] leading-snug ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      {statsRadar.hottestPilot
                        ? `${getPilotFirstAndLastName(statsRadar.hottestPilot.piloto)} lidera o impacto competitivo atual.`
                        : "Sem piloto destacado nesta seleção."}
                    </p>
                  </div>

                  <div
                    className={`rounded-[16px] border px-2.5 py-2.5 ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} bg-[#0f172a]`
                        : "border-black/5 bg-white/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                            isDarkMode ? "text-zinc-500" : "text-zinc-400"
                          }`}
                        >
                          Eficiência premium
                        </p>
                        <p
                          className={`mt-1 text-[15px] font-extrabold leading-tight ${
                            isDarkMode ? "text-white" : "text-zinc-950"
                          }`}
                        >
                          {bestEfficiencyPilot
                            ? getPilotFirstAndLastName(bestEfficiencyPilot.piloto)
                            : "Sem leitura"}
                        </p>
                      </div>

                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl ${
                          isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                        }`}
                      >
                        <Users
                          className={`h-4 w-4 ${
                            isDarkMode ? theme.darkAccentText : theme.primaryIcon
                          }`}
                        />
                      </div>
                    </div>

                    <p
                      className={`mt-1.5 text-[10px] leading-snug ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      {bestEfficiencyPilot
                        ? `${(bestEfficiencyPilot.pontos / Math.max(bestEfficiencyPilot.participacoes, 1)).toFixed(1)} pts por participação.`
                        : "Nenhuma participação registrada para calcular eficiência."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="pointer-events-none fixed -left-[9999px] top-0 z-[-1] opacity-0">
              <div
                ref={shareCardRef}
                className={`w-[1200px] overflow-hidden rounded-[36px] border p-10 ${
                  isDarkMode
                    ? `border-white/10 bg-gradient-to-br ${theme.darkAccentCard} text-white`
                    : `${theme.primaryBorder} bg-gradient-to-br ${theme.shellGlow} text-zinc-950`
                }`}
              >
                <div
                  className={`rounded-[28px] border px-8 py-7 ${
                    isDarkMode
                      ? `${theme.darkAccentBorder} bg-[#111827]`
                      : `${theme.heroBorder} bg-white/90`
                  }`}
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-[22px] ${
                          isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                        }`}
                      >
                        <Trophy
                          className={`h-8 w-8 ${
                            isDarkMode ? theme.darkAccentText : theme.primaryIcon
                          }`}
                        />
                      </div>
                      <div>
                        <p className={`text-[16px] font-bold uppercase tracking-[0.22em] ${
                          isDarkMode ? "text-zinc-400" : "text-zinc-500"
                        }`}>
                          Classificação oficial
                        </p>
                        <h2 className="mt-2 text-[42px] font-extrabold leading-none tracking-[0.04em]">
                          CASERNA KART RACING
                        </h2>
                        <p className={`mt-3 text-[22px] font-semibold ${
                          isDarkMode ? "text-zinc-300" : "text-zinc-700"
                        }`}>
                          {category} · {competitionLabels[competition] || competition}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`rounded-full border px-5 py-2 text-[18px] font-bold uppercase tracking-[0.12em] ${
                        isDarkMode
                          ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                          : theme.searchBadge
                      }`}
                    >
                      Top 6 oficial
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className={`rounded-[22px] border px-5 py-4 ${
                      isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
                    }`}>
                      <p className={`text-[14px] font-bold uppercase tracking-[0.16em] ${
                        isDarkMode ? "text-zinc-500" : "text-zinc-400"
                      }`}>Líder</p>
                      <p className="mt-2 text-[26px] font-extrabold">{leader ? getPilotFirstAndLastName(leader.piloto) : "-"}</p>
                      <p className={`mt-1 text-[18px] font-semibold ${
                        isDarkMode ? theme.darkAccentText : "text-zinc-700"
                      }`}>{leader?.pontos || 0} pontos</p>
                    </div>
                    <div className={`rounded-[22px] border px-5 py-4 ${
                      isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
                    }`}>
                      <p className={`text-[14px] font-bold uppercase tracking-[0.16em] ${
                        isDarkMode ? "text-zinc-500" : "text-zinc-400"
                      }`}>Pilotos</p>
                      <p className="mt-2 text-[26px] font-extrabold">{filteredRanking.length}</p>
                      <p className={`mt-1 text-[18px] font-semibold ${
                        isDarkMode ? "text-zinc-300" : "text-zinc-700"
                      }`}>na classificação atual</p>
                    </div>
                    <div className={`rounded-[22px] border px-5 py-4 ${
                      isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
                    }`}>
                      <p className={`text-[14px] font-bold uppercase tracking-[0.16em] ${
                        isDarkMode ? "text-zinc-500" : "text-zinc-400"
                      }`}>Vantagem</p>
                      <p className="mt-2 text-[26px] font-extrabold">{filteredRanking[1] ? Math.max((leader?.pontos || 0) - filteredRanking[1].pontos, 0) : 0} pts</p>
                      <p className={`mt-1 text-[18px] font-semibold ${
                        isDarkMode ? "text-zinc-300" : "text-zinc-700"
                      }`}>do líder para o vice</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {filteredRanking.slice(0, 6).map((item, index) => {
                    const styles = getTop6RowStyles(index + 1);
                    const trendStatus =
                      pilotTrendMap[item.pilotoId || normalizePilotName(item.piloto)] ||
                      "stable";
                    const trendVisual = getTrendVisual(trendStatus, isDarkMode);
                    const TrendIcon = trendVisual.Icon;

                    return (
                      <div
                        key={`share-${item.pilotoId || item.piloto}-${index}`}
                        className={`flex items-center justify-between rounded-[24px] border px-5 py-4 ${
                          isDarkMode
                            ? index === 0
                              ? `${theme.darkLeaderRow}`
                              : index === 1
                                ? `${theme.darkSecondRow}`
                                : index === 2
                                  ? `${theme.darkThirdRow}`
                                  : "border-white/10 bg-[#111827]"
                            : isDarkMode
                              ? ""
                              : styles.row || "border-black/5 bg-white"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div className={`flex h-14 w-14 items-center justify-center rounded-[18px] text-[22px] font-extrabold ${
                            isDarkMode
                              ? index === 0
                                ? theme.darkTopBadge
                                : index === 1
                                  ? "bg-white/10 text-white"
                                  : index === 2
                                    ? "bg-amber-500/15 text-amber-300"
                                    : "bg-white/10 text-white"
                              : styles.badge
                          }`}>
                            {index + 1}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-[26px] font-extrabold tracking-tight">
                              {getPilotFirstAndLastName(item.piloto)}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[13px] font-semibold ${trendVisual.className}`}>
                                <TrendIcon className="h-3.5 w-3.5" />
                                {trendVisual.label}
                              </span>
                              {getPilotWarNameDisplay(item) ? (
                                <span className={`text-[14px] italic ${
                                  isDarkMode ? "text-zinc-400" : "text-zinc-500"
                                }`}>
                                  {getPilotWarNameDisplay(item)}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-5 gap-3 text-center">
                          {[
                            { label: "PTS", value: item.pontos },
                            { label: "VIT", value: item.vitorias },
                            { label: "POL", value: item.poles },
                            { label: "VMR", value: item.mv },
                            { label: "PDS", value: item.podios },
                          ].map((stat) => (
                            <div
                              key={`${item.pilotoId || item.piloto}-${stat.label}`}
                              className={`min-w-[74px] rounded-[18px] border px-3 py-2 ${
                                isDarkMode
                                  ? "border-white/10 bg-[#0f172a]"
                                  : "border-black/5 bg-white/90"
                              }`}
                            >
                              <p className={`text-[11px] font-bold uppercase tracking-[0.14em] ${
                                isDarkMode ? "text-zinc-500" : "text-zinc-400"
                              }`}>
                                {stat.label}
                              </p>
                              <p className="mt-1 text-[22px] font-extrabold leading-none">{stat.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <Card
              className={`overflow-hidden rounded-[22px] shadow-sm ${
                isDarkMode
                  ? `border ${theme.darkAccentBorder} bg-[#111827]`
                  : `border ${theme.titleBorder} bg-gradient-to-br ${theme.titleBg}`
              }`}
            >
              <CardContent className="p-0">
                <div className="relative px-4 py-4">
                  <div
                    className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${theme.primaryRing} to-transparent`}
                  />

                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                          isDarkMode
                            ? `${theme.darkAccentIconWrap} border ${theme.darkAccentBorder}`
                            : theme.titleIconWrap
                        }`}
                      >
                        <Swords
                          className={`h-5 w-5 ${
                            isDarkMode ? theme.darkAccentText : theme.titleIcon
                          }`}
                        />
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                            isDarkMode ? "text-zinc-500" : "text-zinc-400"
                          }`}
                        >
                          Corrida pelo campeonato
                        </p>
                        <h2
                          className={`text-[17px] font-extrabold tracking-tight ${
                            isDarkMode ? "text-white" : "text-zinc-950"
                          }`}
                        >
                          Disputa pelo título
                        </h2>
                      </div>
                    </div>

                    <div
                      className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${titleFightStatus.tone}`}
                    >
                      {titleFightStatus.label}
                    </div>
                  </div>

                  {top3TitleFight.length === 0 ? (
                    <div
                      className={`rounded-[20px] px-4 py-6 text-center text-sm ${
                        isDarkMode
                          ? "border border-dashed border-white/10 bg-[#0f172a] text-zinc-400"
                          : "border border-dashed border-black/10 bg-zinc-50 text-zinc-500"
                      }`}
                    >
                      Nenhum piloto com pontos para exibir a disputa pelo título.
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="pointer-events-none absolute left-[21px] top-[36px] bottom-[36px] w-[2px]">
                        <div
                          className={`absolute inset-0 rounded-full ${
                            isDarkMode
                              ? `${theme.darkAccentDivider}`
                              : `bg-gradient-to-b ${theme.lineTrack}`
                          }`}
                        />
                        <div
                          className={`absolute left-1/2 top-0 h-full w-[10px] -translate-x-1/2 rounded-full blur-md ${
                            isDarkMode ? theme.darkAccentBg : theme.lineGlow
                          }`}
                        />
                      </div>

                      <div className="space-y-3">
                        {top3TitleFight.map((pilot, index) => {
                          const isLeader = index === 0;
                          const gapLabel = getGapToLeader(
                            top3TitleFight[0]?.pontos || 0,
                            pilot.pontos
                          );
                          const pilotName = getPilotFirstAndLastName(pilot.piloto);
                          const warName = getPilotWarNameDisplay(pilot);

                          const positionBadgeStyles =
                            index === 0
                              ? isDarkMode
                                ? theme.darkTopBadge
                                : `${theme.primaryBadge}`
                              : index === 1
                                ? isDarkMode
                                  ? "bg-white/10 text-zinc-100"
                                  : "bg-zinc-200 text-zinc-900"
                                : isDarkMode
                                  ? "bg-amber-500/15 text-amber-300"
                                  : "bg-amber-100 text-amber-800";

                          const cardPadding = isLeader ? "py-4" : "py-3";
                          const cardRadius = isLeader ? "rounded-[24px]" : "rounded-[22px]";
                          const positionSize = isLeader
                            ? "h-14 w-14 text-[18px]"
                            : "h-11 w-11 text-sm";
                          const nameSize = isLeader ? "text-[13px]" : "text-[13px]";
                          const pointsValueSize = isLeader ? "text-[28px]" : "text-[20px]";
                          const pointsLabelSize = isLeader ? "text-[11px]" : "text-[10px]";

                          const leaderDotClass =
                            category === "Base"
                              ? "bg-orange-400"
                              : category === "Graduados"
                                ? "bg-blue-400"
                                : "bg-yellow-400";

                          return (
                            <div
                              key={`title-fight-${pilot.pilotoId}-${index}`}
                              className="relative pl-10"
                            >
                              <div className="absolute left-[12px] top-1/2 z-10 -translate-y-1/2">
                                <div
                                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                    isDarkMode ? "bg-[#111827]" : "bg-white"
                                  } ${
                                    isLeader
                                      ? theme.darkAccentBorder
                                      : index === 1
                                        ? isDarkMode
                                          ? "border-zinc-500"
                                          : "border-zinc-400"
                                        : "border-amber-500"
                                  }`}
                                >
                                  <div
                                    className={`h-2.5 w-2.5 rounded-full ${
                                      isLeader
                                        ? isDarkMode
                                          ? leaderDotClass
                                          : "bg-yellow-400"
                                        : index === 1
                                          ? "bg-zinc-400"
                                          : "bg-amber-500"
                                    }`}
                                  />
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleSelectPilot(pilot)}
                                className={`w-full border px-3 ${cardPadding} ${cardRadius} text-left transition hover:scale-[0.995] active:scale-[0.99] ${
                                  isDarkMode
                                    ? isLeader
                                      ? `${theme.darkAccentBorder} ${theme.darkLeaderRow} shadow-[0_10px_22px_rgba(0,0,0,0.35)]`
                                      : "border-white/10 bg-[#111827] hover:bg-[#161e2b]"
                                    : isLeader
                                      ? `${theme.heroBorder} ${theme.leaderGlow} bg-gradient-to-r ${theme.heroBg}`
                                      : "border-black/5 bg-white hover:bg-zinc-50/80"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`flex shrink-0 items-center justify-center rounded-[20px] font-extrabold ${positionSize} ${positionBadgeStyles}`}
                                  >
                                    {index + 1}º
                                  </div>

                                  <div className="min-w-0 flex-1 pr-1">
                                    <div className="flex items-center gap-2">
                                      <p
                                        className={`min-w-0 flex-1 whitespace-nowrap font-extrabold leading-none tracking-tight ${
                                          isDarkMode ? "text-white" : "text-zinc-950"
                                        } ${nameSize}`}
                                      >
                                        {pilotName}
                                      </p>
                                    </div>

                                    <div className="mt-1.5 flex items-center gap-2">
                                      {warName ? (
                                        <p
                                          className={`whitespace-nowrap text-[10px] italic ${
                                            isDarkMode ? "text-zinc-400" : "text-zinc-500"
                                          }`}
                                        >
                                          {warName}
                                        </p>
                                      ) : null}

                                      {!isLeader ? (
                                        <span
                                          className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                                            isDarkMode
                                              ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                                              : "border-zinc-200 bg-white text-zinc-600"
                                          }`}
                                        >
                                          {gapLabel}
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>

                                  <div className="shrink-0">
                                    {isLeader ? (
                                      <div className="flex min-w-[88px] flex-col items-end gap-2">
                                        <span
                                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ${
                                            isDarkMode
                                              ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                                              : theme.heroChip
                                          }`}
                                        >
                                          líder
                                        </span>

                                        <div className="flex items-center gap-2">
                                          <div className="min-w-[62px] text-right">
                                            <p
                                              className={`font-bold uppercase tracking-[0.12em] ${
                                                isDarkMode ? "text-zinc-500" : "text-zinc-400"
                                              } ${pointsLabelSize}`}
                                            >
                                              Pontos
                                            </p>
                                            <p
                                              className={`font-extrabold leading-none tracking-tight ${
                                                isDarkMode ? "text-white" : "text-zinc-950"
                                              } ${pointsValueSize}`}
                                            >
                                              {pilot.pontos}
                                            </p>
                                          </div>

                                          <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-[18px] ${
                                              isDarkMode ? theme.darkAccentIconWrap : "bg-zinc-100"
                                            }`}
                                          >
                                            <ChevronRight
                                              className={`h-4 w-4 ${
                                                isDarkMode ? theme.darkAccentText : "text-zinc-500"
                                              }`}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <div className="min-w-[62px] text-right">
                                          <p
                                            className={`font-bold uppercase tracking-[0.12em] ${
                                              isDarkMode ? "text-zinc-500" : "text-zinc-400"
                                            } ${pointsLabelSize}`}
                                          >
                                            Pontos
                                          </p>
                                          <p
                                            className={`font-extrabold leading-none tracking-tight ${
                                              isDarkMode ? "text-white" : "text-zinc-950"
                                            } ${pointsValueSize}`}
                                          >
                                            {pilot.pontos}
                                          </p>
                                        </div>

                                        <div
                                          className={`flex h-8 w-8 items-center justify-center rounded-[18px] ${
                                            isDarkMode ? theme.darkAccentIconWrap : "bg-zinc-100"
                                          }`}
                                        >
                                          <ChevronRight
                                            className={`h-4 w-4 ${
                                              isDarkMode ? theme.darkAccentText : "text-zinc-500"
                                            }`}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <section className="space-y-3">
              <div
                className={`overflow-hidden rounded-[22px] shadow-sm ${
                  isDarkMode
                    ? `border ${theme.darkAccentBorder} bg-[#111827]`
                    : `border ${theme.titleBorder} bg-gradient-to-br ${theme.titleBg}`
                }`}
              >
                <div className="relative px-4 py-4">
                  <div
                    className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${theme.primaryRing} to-transparent`}
                  />

                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex flex-1 justify-center pr-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`inline-flex max-w-full items-center justify-center rounded-[18px] border px-4 py-2 shadow-[0_4px_10px_rgba(0,0,0,0.08)] ${
                            isDarkMode
                              ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}`
                              : theme.titlePill
                          }`}
                        >
                          <h2
                            className={`truncate text-[17px] font-extrabold uppercase leading-none tracking-[0.05em] ${
                              isDarkMode ? "text-white" : theme.titlePillText
                            }`}
                          >
                            Classificação Geral
                          </h2>
                        </div>

                        <p
                          className={`mt-2.5 w-[245px] max-w-full text-center text-[9px] font-semibold uppercase tracking-[0.12em] ${
                            isDarkMode ? "text-zinc-500" : theme.titleSub
                          }`}
                        >
                          categoria e campeonato selecionados
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-[0_4px_10px_rgba(0,0,0,0.08)] ${
                        isDarkMode
                          ? `${theme.darkAccentBorder} ${theme.darkAccentIconWrap}`
                          : theme.titleIconWrap
                      }`}
                    >
                      <TableProperties
                        className={`h-5 w-5 ${
                          isDarkMode ? theme.darkAccentText : theme.titleIcon
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Card
                className={`overflow-hidden rounded-[22px] shadow-sm ${
                  isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
                }`}
              >
                <CardContent className="p-0">
                  <div
                    className={`px-3 py-3 ${
                      isDarkMode
                        ? "border-b border-white/10 bg-gradient-to-r from-[#111827] via-[#161e2b] to-[#111827]"
                        : "border-b border-black/5 bg-gradient-to-r from-white via-zinc-50/70 to-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
                            isDarkMode ? theme.darkAccentIconWrap : theme.titleIconWrap
                          }`}
                        >
                          <TableProperties
                            className={`h-4.5 w-4.5 ${
                              isDarkMode ? theme.darkAccentText : theme.titleIcon
                            }`}
                          />
                        </div>

                        <div className="min-w-0">
                          <p
                            className={`text-[8px] font-bold uppercase tracking-[0.18em] ${
                              isDarkMode ? "text-zinc-500" : "text-zinc-400"
                            }`}
                          >
                            Painel oficial
                          </p>
                          <p
                            className={`text-[14px] font-extrabold tracking-tight ${
                              isDarkMode ? "text-white" : "text-zinc-950"
                            }`}
                          >
                            Grade de classificação
                          </p>
                          <p
                            className={`mt-0.5 text-[11px] font-medium ${
                              isDarkMode ? "text-zinc-400" : "text-zinc-500"
                            }`}
                          >
                            {category} · {competitionLabels[competition] || competition}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <div
                          className={`rounded-full border px-3 py-1 text-[11px] font-bold ${
                            isDarkMode
                              ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                              : "border-black/5 bg-zinc-50 text-zinc-700"
                          }`}
                        >
                          {filteredRanking.length} piloto
                          {filteredRanking.length === 1 ? "" : "s"}
                        </div>

                        <div
                          className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${titleFightStatus.tone}`}
                        >
                          {titleFightStatus.label}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div
                        className={`rounded-[16px] border px-3 py-2 ${
                          isDarkMode
                            ? "border-white/10 bg-[#0f172a]"
                            : "border-black/5 bg-white"
                        }`}
                      >
                        <p
                          className={`text-[9px] font-bold uppercase tracking-[0.16em] ${
                            isDarkMode ? "text-zinc-500" : "text-zinc-400"
                          }`}
                        >
                          Líder
                        </p>
                        <p
                          className={`mt-1 truncate text-[12px] font-extrabold ${
                            isDarkMode ? "text-white" : "text-zinc-950"
                          }`}
                        >
                          {leader ? getPilotFirstAndLastName(leader.piloto) : "-"}
                        </p>
                        <p
                          className={`mt-0.5 text-[11px] font-semibold ${
                            isDarkMode ? theme.darkAccentText : "text-zinc-700"
                          }`}
                        >
                          {leader?.pontos || 0} pts
                        </p>
                      </div>

                      <div
                        className={`rounded-[16px] border px-3 py-2 ${
                          isDarkMode
                            ? "border-white/10 bg-[#0f172a]"
                            : "border-black/5 bg-white"
                        }`}
                      >
                        <p
                          className={`text-[9px] font-bold uppercase tracking-[0.16em] ${
                            isDarkMode ? "text-zinc-500" : "text-zinc-400"
                          }`}
                        >
                          Zona troféu
                        </p>
                        <p
                          className={`mt-1 text-[12px] font-extrabold ${
                            isDarkMode ? "text-white" : "text-zinc-950"
                          }`}
                        >
                          Top 6 oficial
                        </p>
                        <p
                          className={`mt-0.5 text-[11px] font-medium ${
                            isDarkMode ? "text-zinc-400" : "text-zinc-500"
                          }`}
                        >
                          corte: {filteredRanking[5]?.pontos ?? 0} pts
                        </p>
                      </div>

                      <div
                        className={`rounded-[16px] border px-3 py-2 ${
                          isDarkMode
                            ? "border-white/10 bg-[#0f172a]"
                            : "border-black/5 bg-white"
                        }`}
                      >
                        <p
                          className={`text-[9px] font-bold uppercase tracking-[0.16em] ${
                            isDarkMode ? "text-zinc-500" : "text-zinc-400"
                          }`}
                        >
                          Pressão no topo
                        </p>
                        <p
                          className={`mt-1 text-[12px] font-extrabold ${
                            isDarkMode ? "text-white" : "text-zinc-950"
                          }`}
                        >
                          {filteredRanking[1]
                            ? `${Math.max((leader?.pontos || 0) - filteredRanking[1].pontos, 0)} pts`
                            : "0 pts"}
                        </p>
                        <p
                          className={`mt-0.5 text-[11px] font-medium ${
                            isDarkMode ? "text-zinc-400" : "text-zinc-500"
                          }`}
                        >
                          vantagem do líder
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="max-h-[560px] overflow-y-auto">
                    <table className="w-full table-fixed">
                      <colgroup>
                        <col className="w-[42px]" />
                        <col />
                        <col className="w-[31px]" />
                        <col className="w-[31px]" />
                        <col className="w-[31px]" />
                        <col className="w-[36px]" />
                        <col className="w-[36px]" />
                      </colgroup>

                      <thead className="sticky top-0 z-10">
                        <tr
                          className={`text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur ${
                            isDarkMode
                              ? `border-b border-white/10 bg-[#161e2b] ${theme.darkAccentText}`
                              : `border-b border-black/5 ${theme.tableHeadBg} text-zinc-500`
                          }`}
                        >
                          <th className="whitespace-nowrap px-1 py-2.5 text-center">Pos</th>
                          <th className="whitespace-nowrap px-2 py-2.5 text-left">Piloto</th>
                          <th className="whitespace-nowrap px-0.5 py-2.5 text-center">Pts</th>
                          <th className="whitespace-nowrap px-0.5 py-2.5 text-center">Vit</th>
                          <th className="whitespace-nowrap px-0.5 py-2.5 text-center">Pol</th>
                          <th className="whitespace-nowrap px-0.5 py-2.5 text-center">VMR</th>
                          <th className="whitespace-nowrap px-0.5 py-2.5 text-center">PDS</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredRanking.map((item, index) => {
                          const nomeLinha1 = getPilotFirstAndLastName(item.piloto);
                          const nomeLinha2 = getPilotWarNameDisplay(item);
                          const isTop6 = index < 6;
                          const isLeader = index === 0;
                          const styles = getTop6RowStyles(index + 1);
                          const trendStatus =
                            pilotTrendMap[item.pilotoId || normalizePilotName(item.piloto)] ||
                            "stable";
                          const trendVisual = getTrendVisual(trendStatus, isDarkMode);
                          const TrendIcon = trendVisual.Icon;

                          const darkRow = isTop6
                            ? index === 0
                              ? `${theme.darkLeaderRow} shadow-[0_0_0_1px_rgba(250,204,21,0.14),0_12px_26px_rgba(0,0,0,0.28)]`
                              : index === 1
                                ? `${theme.darkSecondRow} shadow-[0_0_0_1px_rgba(161,161,170,0.14),0_10px_22px_rgba(0,0,0,0.22)]`
                                : index === 2
                                  ? `${theme.darkThirdRow} shadow-[0_0_0_1px_rgba(245,158,11,0.14),0_10px_22px_rgba(0,0,0,0.22)]`
                                  : index === 3
                                    ? "bg-gradient-to-r from-sky-500/10 via-[#161e2b] to-[#111827] border-l-[4px] border-l-sky-400 shadow-[0_0_0_1px_rgba(56,189,248,0.12),0_10px_22px_rgba(0,0,0,0.2)]"
                                    : index === 4
                                      ? "bg-gradient-to-r from-violet-500/10 via-[#161e2b] to-[#111827] border-l-[4px] border-l-violet-400 shadow-[0_0_0_1px_rgba(168,85,247,0.12),0_10px_22px_rgba(0,0,0,0.2)]"
                                      : "bg-gradient-to-r from-emerald-500/10 via-[#161e2b] to-[#111827] border-l-[4px] border-l-emerald-400 shadow-[0_0_0_1px_rgba(52,211,153,0.12),0_10px_22px_rgba(0,0,0,0.2)]"
                            : `${index % 2 === 0 ? "bg-[#111827]" : "bg-[#0f172a]"} hover:bg-[#161e2b]`;

                          return (
                            <tr
                              key={`${category}-${competition}-table-${item.pos}-${item.piloto}`}
                              className={`group transition ${
                                isDarkMode
                                  ? darkRow
                                  : isTop6
                                    ? styles.row
                                    : `${index % 2 === 0 ? "bg-white" : "bg-zinc-50/40"} hover:bg-zinc-50`
                              }`}
                            >
                              <td className="px-1 py-2.5 text-center align-middle">
                                <button
                                  type="button"
                                  onClick={() => handleSelectPilot(item)}
                                  className="mx-auto flex h-7 w-7 items-center justify-center rounded-[10px] text-[11px] font-bold transition active:scale-95"
                                >
                                  <span
                                    className={`relative flex h-7 w-7 items-center justify-center rounded-[10px] ${isTop6 ? "shadow-[0_6px_14px_rgba(0,0,0,0.14)]" : "shadow-sm"} ${
                                      isDarkMode
                                        ? index === 0
                                          ? theme.darkTopBadge
                                          : index === 1
                                            ? "bg-white/10 text-white"
                                            : index === 2
                                              ? "bg-amber-500/20 text-amber-300"
                                              : "bg-white/10 text-white"
                                        : styles.badge
                                    }`}
                                  >
                                    {isLeader ? (
                                      <Star className="absolute -right-1 -top-1 h-3 w-3 fill-yellow-300 text-yellow-500" />
                                    ) : null}
                                    {index + 1}
                                  </span>
                                </button>
                              </td>

                              <td className="min-w-0 px-2 py-2.5 align-middle">
                                <button
                                  type="button"
                                  onClick={() => handleSelectPilot(item)}
                                  className="block w-full text-left transition active:scale-[0.99]"
                                >
                                  <div className="min-w-0">
                                    <div className="flex items-start justify-between gap-1.5">
                                      <span
                                        className={`block min-w-0 flex-1 whitespace-normal break-words text-[12px] font-extrabold leading-[1.1] tracking-tight ${
                                          isDarkMode ? "text-white" : styles.name
                                        }`}
                                      >
                                        {nomeLinha1}
                                      </span>

                                      <span
                                        className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] ${trendVisual.className}`}
                                      >
                                        <TrendIcon className="h-3 w-3" />
                                        {trendVisual.label}
                                      </span>
                                    </div>

                                    {nomeLinha2 ? (
                                      <div className="mt-0.5 flex items-center gap-1">
                                        <span
                                          className={`inline-flex max-w-full whitespace-normal break-words rounded-full border px-1.5 py-0.5 text-[9px] font-semibold italic tracking-[0.02em] ${
                                            isDarkMode
                                              ? `${theme.darkAccentBorder} ${theme.darkAccentBg} text-zinc-200`
                                              : styles.chip
                                          }`}
                                        >
                                          {nomeLinha2}
                                        </span>
                                      </div>
                                    ) : null}
                                  </div>
                                </button>
                              </td>

                              <td
                                className={`px-0.5 py-2.5 text-center align-middle text-[11px] font-extrabold ${
                                  isDarkMode
                                    ? index === 0
                                      ? theme.darkAccentText
                                      : "text-white"
                                    : isTop6
                                      ? styles.points
                                      : "text-zinc-950"
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleSelectPilot(item)}
                                  className="w-full transition active:scale-95"
                                >
                                  {item.pontos}
                                </button>
                              </td>

                              <td
                                className={`px-0.5 py-2.5 text-center align-middle text-[11px] font-semibold ${
                                  isDarkMode ? "text-white" : "text-zinc-950"
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleSelectPilot(item)}
                                  className="w-full transition active:scale-95"
                                >
                                  {item.vitorias}
                                </button>
                              </td>

                              <td
                                className={`px-0.5 py-2.5 text-center align-middle text-[11px] font-semibold ${
                                  isDarkMode ? "text-white" : "text-zinc-950"
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleSelectPilot(item)}
                                  className="w-full transition active:scale-95"
                                >
                                  {item.poles}
                                </button>
                              </td>

                              <td
                                className={`px-0.5 py-2.5 text-center align-middle text-[11px] font-semibold ${
                                  isDarkMode ? "text-white" : "text-zinc-950"
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleSelectPilot(item)}
                                  className="w-full transition active:scale-95"
                                >
                                  {item.mv}
                                </button>
                              </td>

                              <td
                                className={`px-0.5 py-2.5 text-center align-middle text-[11px] font-semibold ${
                                  isDarkMode ? "text-white" : "text-zinc-950"
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleSelectPilot(item)}
                                  className="w-full transition active:scale-95"
                                >
                                  {item.podios}
                                </button>
                              </td>
                            </tr>
                          );
                        })}

                        {filteredRanking.length === 0 && (
                          <tr>
                            <td
                              colSpan={7}
                              className={`px-4 py-8 text-center text-sm ${
                                isDarkMode ? "text-zinc-400" : "text-zinc-500"
                              }`}
                            >
                              Nenhum piloto com pontos encontrado.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="piloto" className="mt-0 space-y-4 pt-0">
            {!selectedPilot ? (
              <Card
                className={`rounded-[20px] shadow-sm ${
                  isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
                }`}
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`mx-auto flex h-14 w-14 items-center justify-center rounded-3xl ${
                      isDarkMode ? theme.darkAccentIconWrap : "bg-zinc-100"
                    }`}
                  >
                    <User
                      className={`h-7 w-7 ${
                        isDarkMode ? theme.darkAccentText : "text-zinc-500"
                      }`}
                    />
                  </div>
                  <p
                    className={`mt-4 text-base font-semibold ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    Nenhum piloto selecionado
                  </p>
                  <p
                    className={`mt-2 text-sm ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    Toque em um piloto na classificação para abrir o perfil.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                <Card
                  className={`overflow-hidden rounded-[22px] shadow-sm ${
                    isDarkMode
                      ? `border ${theme.darkAccentBorder} bg-gradient-to-br ${theme.darkAccentCard}`
                      : `${theme.primaryBorder} bg-gradient-to-br ${theme.shellGlow}`
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <div
                        className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent ${theme.primaryRing} to-transparent`}
                      />

                      <div className="p-3">
                        <div
                          className={`rounded-[24px] p-3 shadow-[0_10px_24px_rgba(15,23,42,0.06)] ${
                            isDarkMode
                              ? "border border-white/10 bg-[#0f172a]"
                              : "border border-black/5 bg-white"
                          }`}
                        >
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <button
                              type="button"
                              onClick={handleBackToRanking}
                              className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition ${
                                isDarkMode
                                  ? `border ${theme.darkAccentBorder} ${theme.darkAccentBg} text-zinc-100 hover:opacity-90`
                                  : "border border-black/5 bg-zinc-50 text-zinc-800 hover:bg-zinc-100"
                              }`}
                            >
                              <ArrowLeft className="h-4 w-4" />
                              Voltar
                            </button>

                            <div className="flex flex-wrap items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={handleSharePilotCard}
                                disabled={isSharingPilotImage}
                                className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition disabled:opacity-50 ${
                                  isDarkMode
                                    ? `border ${theme.darkAccentBorder} ${theme.darkAccentBg} text-zinc-100 hover:opacity-90`
                                    : "border border-black/5 bg-zinc-50 text-zinc-800 hover:bg-zinc-100"
                                }`}
                              >
                                <Share2 className="h-4 w-4" />
                                {isSharingPilotImage ? "Gerando..." : "Compartilhar piloto"}
                              </button>

                              <Badge
                                variant="outline"
                                className={
                                  isDarkMode
                                    ? `${theme.darkAccentBorder} ${theme.darkAccentBg} text-zinc-200`
                                    : categoryColors[category] || "border-black/10 text-zinc-700"
                                }
                              >
                                {category}
                              </Badge>

                              <Badge
                                variant="outline"
                                className={
                                  isDarkMode
                                    ? "border-white/10 bg-white/5 text-zinc-200"
                                    : "border-zinc-200 bg-zinc-50 text-zinc-700"
                                }
                              >
                                {competitionLabels[competition] || competition}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3 md:grid-cols-[132px_1fr]">
                            <div
                              className={`relative overflow-hidden rounded-[24px] shadow-[0_12px_28px_rgba(15,23,42,0.10)] ${
                                isDarkMode
                                  ? `border ${theme.darkAccentBorder} bg-[#0f172a]`
                                  : `${theme.heroBorder} bg-gradient-to-b ${theme.heroBg}`
                              }`}
                            >
                              <div
                                className={`pointer-events-none absolute inset-x-6 top-0 z-10 h-[2px] bg-gradient-to-r from-transparent ${theme.primaryRing} to-transparent`}
                              />

                              <div className="relative w-full aspect-square">
                                <PilotPhotoSlot
                                  pilot={selectedPilot}
                                  alt={selectedPilotShortName}
                                  isDark={isDarkMode}
                                />

                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/72 via-black/16 to-transparent" />

                                <div className="absolute left-3 top-3 flex items-center gap-2">
                                  <div
                                    className={`inline-flex h-11 min-w-[54px] items-center justify-center rounded-[16px] border px-3 text-[18px] font-extrabold shadow-lg ${
                                      isDarkMode
                                        ? `${theme.darkAccentBorder} bg-black/45 text-white backdrop-blur-md`
                                        : "border-white/70 bg-white/88 text-zinc-950 backdrop-blur-md"
                                    }`}
                                  >
                                    {safeSelectedPilot.pos}º
                                  </div>

                                  <div
                                    className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] shadow-sm ${
                                      isDarkMode
                                        ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                                        : categoryColors[category] || "border-black/10 bg-white/90 text-zinc-700"
                                    }`}
                                  >
                                    {category}
                                  </div>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 p-3">
                                  <div
                                    className={`rounded-[20px] border px-3 py-3 backdrop-blur-md ${
                                      isDarkMode
                                        ? "border-white/10 bg-black/30"
                                        : "border-white/60 bg-white/72"
                                    }`}
                                  >
                                    <p
                                      className={`truncate text-[15px] font-extrabold leading-none tracking-tight ${
                                        isDarkMode ? "text-white" : "text-zinc-950"
                                      }`}
                                    >
                                      {selectedPilotShortName}
                                    </p>

                                    {selectedPilotWarName ? (
                                      <p
                                        className={`mt-1 truncate text-[11px] font-semibold italic ${
                                          isDarkMode ? "text-zinc-300" : "text-zinc-600"
                                        }`}
                                      >
                                        {selectedPilotWarName}
                                      </p>
                                    ) : null}

                                    <div className="mt-2 flex items-center justify-between gap-2">
                                      <span
                                        className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${
                                          isDarkMode
                                            ? "border-white/10 bg-white/5 text-zinc-300"
                                            : "border-black/5 bg-white/80 text-zinc-700"
                                        }`}
                                      >
                                        piloto oficial
                                      </span>

                                      <span
                                        className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${
                                          isDarkMode
                                            ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                                            : theme.heroChip
                                        }`}
                                      >
                                        {competitionLabels[competition] || competition}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="min-w-0">
                              <p
                                className={`text-[11px] font-bold uppercase tracking-[0.18em] ${
                                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                                }`}
                              >
                                Perfil premium do piloto
                              </p>

                              <h2
                                className={`mt-2 break-words text-[28px] font-extrabold leading-[1.02] tracking-tight ${
                                  isDarkMode ? "text-white" : "text-zinc-950"
                                }`}
                              >
                                {selectedPilotShortName}
                              </h2>

                              {selectedPilotWarName ? (
                                <div className="mt-3">
                                  <span
                                    className={`inline-flex max-w-full break-words rounded-full border px-3 py-1.5 text-[11px] font-semibold italic ${
                                      isDarkMode
                                        ? `${theme.darkAccentBorder} ${theme.darkAccentBg} text-zinc-300`
                                        : theme.heroChip
                                    }`}
                                  >
                                    {selectedPilotWarName}
                                  </span>
                                </div>
                              ) : null}

                              <div className="mt-4 grid grid-cols-2 gap-2">
                                <div
                                  className={`rounded-[16px] border px-2.5 py-2.5 ${
                                    isDarkMode
                                      ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}`
                                      : `${theme.heroBorder} bg-gradient-to-b ${theme.heroBg}`
                                  }`}
                                >
                                  <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${isDarkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                                    Posição atual
                                  </p>
                                  <p className={`mt-1 text-[24px] font-extrabold leading-none tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                    {safeSelectedPilot.pos}º
                                  </p>
                                  <p className={`mt-1 text-[11px] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                                    {selectedPilotGap}
                                  </p>
                                </div>

                                <div
                                  className={`rounded-[16px] border px-2.5 py-2.5 ${
                                    isDarkMode
                                      ? `${theme.darkAccentBorder} bg-[#111827]`
                                      : "border-black/5 bg-zinc-50/80"
                                  }`}
                                >
                                  <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${isDarkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                                    Pontuação oficial
                                  </p>
                                  <p className={`mt-1 text-[24px] font-extrabold leading-none tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                    {safeSelectedPilot.pontos}
                                    <span className={`ml-1 text-[14px] font-bold ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                                      pts
                                    </span>
                                  </p>
                                  <p className={`mt-1 text-[11px] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                                    média {selectedPilotAverage.toFixed(1)} por participação
                                  </p>
                                </div>
                              </div>

                              <div
                                className={`mt-3 rounded-[20px] border p-3 ${
                                  isDarkMode
                                    ? `${theme.darkAccentBorder} bg-gradient-to-r from-[#111827] to-[#161e2b]`
                                    : `${theme.heroBorder} bg-gradient-to-r ${theme.heroBg}`
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0 flex-1">
                                    <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                                      Análise oficial
                                    </p>
                                    <p className={`mt-1 text-[16px] font-extrabold leading-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                      {selectedPilotConsistency}
                                    </p>
                                    <p className={`mt-2 text-[12px] leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                                      Momento: <span className="font-semibold">{selectedPilotMomentum}</span> · melhor fundamento atual em <span className="font-semibold">{selectedPilotBestAttribute.label.toLowerCase()}</span> ({selectedPilotBestAttribute.value}).
                                    </p>
                                  </div>

                                  <div
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                                      isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                                    }`}
                                  >
                                    <User
                                      className={`h-5 w-5 ${
                                        isDarkMode ? theme.darkAccentText : theme.primaryIcon
                                      }`}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`rounded-[24px] shadow-sm ${
                    isDarkMode
                      ? `border ${theme.darkAccentBorder} bg-[#111827]`
                      : `border ${theme.titleBorder} bg-gradient-to-br ${theme.titleBg}`
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                          Comparativo oficial
                        </p>
                        <h3 className={`text-[18px] font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                          Momento competitivo do piloto
                        </h3>
                      </div>

                      <div className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}` : theme.headerChip}`}>
                        leitura rápida
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                      <Card
                        className={`rounded-[22px] shadow-none ${
                          isDarkMode
                            ? `${theme.darkAccentBorder} bg-[#0f172a]`
                            : `${theme.heroBorder} bg-gradient-to-b ${theme.heroBg}`
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-1.5">
                            <div>
                              <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                Distância do líder
                              </p>
                              <p className={`mt-1 text-[22px] font-extrabold leading-none tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                {selectedPilotLeaderGapValue}
                                <span className={`ml-1 text-[12px] font-bold ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                                  pts
                                </span>
                              </p>
                            </div>
                            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap}`}>
                              <Trophy className={`h-4.5 w-4.5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
                            </div>
                          </div>
                          <div className={`mt-3 h-2.5 w-full overflow-hidden rounded-full ${isDarkMode ? "bg-white/10" : "bg-zinc-100"}`}>
                            <div className={`h-full rounded-full ${isDarkMode ? "bg-white/80" : "bg-zinc-900"}`} style={{ width: `${selectedPilotVsLeader}%` }} />
                          </div>
                          <p className={`mt-2 text-[11px] leading-snug ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                            {selectedPilotGap === "líder" ? "piloto já ocupa a liderança da seleção" : `${selectedPilotVsLeader}% do rendimento em pontos do líder atual`}
                          </p>
                        </CardContent>
                      </Card>

                      <Card
                        className={`rounded-[22px] shadow-none ${
                          isDarkMode ? "border border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-1.5">
                            <div>
                              <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                Aproveitamento em vitórias
                              </p>
                              <p className={`mt-1 text-[22px] font-extrabold leading-none tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                {selectedPilotWinRate}%
                              </p>
                            </div>
                            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap}`}>
                              <Crown className={`h-4.5 w-4.5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
                            </div>
                          </div>
                          <div className={`mt-3 h-2.5 w-full overflow-hidden rounded-full ${isDarkMode ? "bg-white/10" : "bg-zinc-100"}`}>
                            <div className={`h-full rounded-full ${isDarkMode ? "bg-white/80" : "bg-zinc-900"}`} style={{ width: `${selectedPilotWinRate}%` }} />
                          </div>
                          <p className={`mt-2 text-[11px] leading-snug ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                            {selectedPilotWinRateLabel} · {safeSelectedPilot.vitorias} vitória(s) em {safeSelectedPilot.participacoes} participação(ões)
                          </p>
                        </CardContent>
                      </Card>

                      <Card
                        className={`rounded-[22px] shadow-none ${
                          isDarkMode ? "border border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-1.5">
                            <div>
                              <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                Taxa de pódios
                              </p>
                              <p className={`mt-1 text-[22px] font-extrabold leading-none tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                {selectedPilotPodiumRate}%
                              </p>
                            </div>
                            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap}`}>
                              <Medal className={`h-4.5 w-4.5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
                            </div>
                          </div>
                          <div className={`mt-3 h-2.5 w-full overflow-hidden rounded-full ${isDarkMode ? "bg-white/10" : "bg-zinc-100"}`}>
                            <div className={`h-full rounded-full ${isDarkMode ? "bg-white/80" : "bg-zinc-900"}`} style={{ width: `${selectedPilotPodiumRate}%` }} />
                          </div>
                          <p className={`mt-2 text-[11px] leading-snug ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                            {selectedPilotPodiumRateLabel} · presença no top 6 em {safeSelectedPilot.podios} etapa(s)
                          </p>
                        </CardContent>
                      </Card>

                      <Card
                        className={`rounded-[22px] shadow-none ${
                          isDarkMode ? "border border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-1.5">
                            <div>
                              <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                Nível disciplinar
                              </p>
                              <p className={`mt-1 text-[22px] font-extrabold leading-none tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                {selectedPilotDiscipline}%
                              </p>
                            </div>
                            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap}`}>
                              <Gauge className={`h-4.5 w-4.5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
                            </div>
                          </div>
                          <div className={`mt-3 h-2.5 w-full overflow-hidden rounded-full ${isDarkMode ? "bg-white/10" : "bg-zinc-100"}`}>
                            <div className={`h-full rounded-full ${isDarkMode ? "bg-white/80" : "bg-zinc-900"}`} style={{ width: `${selectedPilotDiscipline}%` }} />
                          </div>
                          <p className={`mt-2 text-[11px] leading-snug ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                            {selectedPilotDisciplineLabel} · {safeSelectedPilot.adv} advertências em {safeSelectedPilot.participacoes} participação(ões)
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`rounded-[24px] shadow-sm ${
                    isDarkMode
                      ? `border ${theme.darkAccentBorder} bg-[#111827]`
                      : `border ${theme.titleBorder} bg-gradient-to-br ${theme.titleBg}`
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                          Performance do piloto
                        </p>
                        <h3 className={`text-[18px] font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                          Leitura por blocos oficiais
                        </h3>
                      </div>

                      <div className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}` : theme.headerChip}`}>
                        ataque · consistência · status
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <Card
                        className={`rounded-[22px] shadow-none ${
                          isDarkMode
                            ? `${theme.darkAccentBorder} bg-[#0f172a]`
                            : `${theme.heroBorder} bg-gradient-to-b ${theme.heroBg}`
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="mb-4 flex items-center justify-between gap-2">
                            <div>
                              <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                Ataque
                              </p>
                              <h4 className={`mt-1 text-[16px] font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                Força ofensiva
                              </h4>
                            </div>
                            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap}`}>
                              <Swords className={`h-4.5 w-4.5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className={`rounded-[18px] border px-3 py-3 ${isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-white"}`}>
                              <div className="flex items-center justify-between gap-2.5">
                                <span className={`text-[11px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                                  Vitórias
                                </span>
                                <span className={`text-[20px] font-extrabold leading-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                  {safeSelectedPilot.vitorias}
                                </span>
                              </div>
                            </div>

                            <div className={`rounded-[18px] border px-3 py-3 ${isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-white"}`}>
                              <div className="flex items-center justify-between gap-2.5">
                                <span className={`text-[11px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                                  Poles
                                </span>
                                <span className={`text-[20px] font-extrabold leading-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                  {safeSelectedPilot.poles}
                                </span>
                              </div>
                            </div>

                            <div className={`rounded-[18px] border px-3 py-3 ${isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-white"}`}>
                              <div className="flex items-center justify-between gap-2.5">
                                <span className={`text-[11px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                                  Melhores voltas
                                </span>
                                <span className={`text-[20px] font-extrabold leading-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                  {safeSelectedPilot.mv}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card
                        className={`rounded-[22px] shadow-none ${
                          isDarkMode ? "border border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="mb-4 flex items-center justify-between gap-2">
                            <div>
                              <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                Consistência
                              </p>
                              <h4 className={`mt-1 text-[16px] font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                Regularidade na temporada
                              </h4>
                            </div>
                            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap}`}>
                              <BarChart3 className={`h-4.5 w-4.5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className={`rounded-[18px] border px-3 py-3 ${isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-white"}`}>
                              <div className="flex items-center justify-between gap-2.5">
                                <span className={`text-[11px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                                  Pódios
                                </span>
                                <span className={`text-[20px] font-extrabold leading-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                  {safeSelectedPilot.podios}
                                </span>
                              </div>
                            </div>

                            <div className={`rounded-[18px] border px-3 py-3 ${isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-white"}`}>
                              <div className="flex items-center justify-between gap-2.5">
                                <span className={`text-[11px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                                  Participações
                                </span>
                                <span className={`text-[20px] font-extrabold leading-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                  {safeSelectedPilot.participacoes}
                                </span>
                              </div>
                            </div>

                            <div className={`rounded-[18px] border px-3 py-3 ${isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-white"}`}>
                              <div className="flex items-center justify-between gap-2.5">
                                <span className={`text-[11px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                                  Média de pontos
                                </span>
                                <span className={`text-[20px] font-extrabold leading-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                  {selectedPilotAverage.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card
                        className={`rounded-[22px] shadow-none ${
                          isDarkMode ? "border border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="mb-4 flex items-center justify-between gap-2">
                            <div>
                              <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                Status no campeonato
                              </p>
                              <h4 className={`mt-1 text-[16px] font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                Posição atual do piloto
                              </h4>
                            </div>
                            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap}`}>
                              <TableProperties className={`h-4.5 w-4.5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className={`rounded-[18px] border px-3 py-3 ${isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-white"}`}>
                              <div className="flex items-center justify-between gap-2.5">
                                <span className={`text-[11px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                                  Posição atual
                                </span>
                                <span className={`text-[20px] font-extrabold leading-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                  {safeSelectedPilot.pos}º
                                </span>
                              </div>
                            </div>

                            <div className={`rounded-[18px] border px-3 py-3 ${isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-white"}`}>
                              <div className="flex items-center justify-between gap-2.5">
                                <span className={`text-[11px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                                  Pontos totais
                                </span>
                                <span className={`text-[20px] font-extrabold leading-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                  {safeSelectedPilot.pontos}
                                </span>
                              </div>
                            </div>

                            <div className={`rounded-[18px] border px-3 py-3 ${isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-white"}`}>
                              <div className="flex items-center justify-between gap-2.5">
                                <span className={`text-[11px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                                  Diferença do líder
                                </span>
                                <span className={`text-[20px] font-extrabold leading-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                  {selectedPilotGap === "líder" ? "LÍDER" : `${selectedPilotLeaderGapValue} pts`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`rounded-[24px] shadow-sm ${
                    isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                          Raio-x competitivo
                        </p>
                        <h3 className={`text-[18px] font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                          Comparativo do piloto
                        </h3>
                      </div>

                      <div className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}` : theme.headerChip}`}>
                        leitura oficial
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className={`rounded-[20px] border p-3 ${isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50/70"}`}>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                          Próximo alvo
                        </p>
                        <p className={`mt-2 text-[17px] font-extrabold leading-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                          {selectedPilotRivalAhead ? getPilotFirstAndLastName(selectedPilotRivalAhead.piloto) : "Nenhum piloto acima"}
                        </p>
                        <p className={`mt-2 text-[12px] ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                          {selectedPilotRivalAhead && selectedPilot
                            ? `${selectedPilotRivalAhead.pontos - safeSelectedPilot.pontos} ponto(s) para avançar mais uma posição.`
                            : "Piloto ocupa a liderança desta seleção."}
                        </p>
                      </div>

                      <div className={`rounded-[20px] border p-3 ${isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50/70"}`}>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                          Destaque técnico
                        </p>
                        <p className={`mt-2 text-[17px] font-extrabold leading-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                          {selectedPilotBestAttribute.label}
                        </p>
                        <p className={`mt-2 text-[12px] ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                          Melhor número individual do piloto nesta leitura: <span className="font-semibold">{selectedPilotBestAttribute.value}</span>.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <CompactStatCard
                        title="Posição"
                        value={safeSelectedPilot.pos}
                        subtitle="na classificação"
                        icon={Crown}
                        accent
                        isDark={isDarkMode}
                        categoryTheme={theme}
                      />
                      <CompactStatCard
                        title="Vitórias"
                        value={safeSelectedPilot.vitorias}
                        subtitle={`taxa ${selectedPilotWinRate}%`}
                        icon={Medal}
                        isDark={isDarkMode}
                        categoryTheme={theme}
                      />
                      <CompactStatCard
                        title="Poles"
                        value={safeSelectedPilot.poles}
                        subtitle="desempenho de qualify"
                        icon={Flag}
                        isDark={isDarkMode}
                        categoryTheme={theme}
                      />
                      <CompactStatCard
                        title="VMR"
                        value={safeSelectedPilot.mv}
                        subtitle="voltas mais rápidas"
                        icon={Timer}
                        accent
                        isDark={isDarkMode}
                        categoryTheme={theme}
                      />
                      <CompactStatCard
                        title="Pódios"
                        value={safeSelectedPilot.podios}
                        subtitle={`${selectedPilotPodiumRate}% de presença`}
                        icon={Medal}
                        isDark={isDarkMode}
                        categoryTheme={theme}
                      />
                      <CompactStatCard
                        title="Participações"
                        value={safeSelectedPilot.participacoes}
                        subtitle="corridas válidas"
                        icon={Users}
                        isDark={isDarkMode}
                        categoryTheme={theme}
                      />
                      <CompactStatCard
                        title="ADV"
                        value={safeSelectedPilot.adv}
                        subtitle="controle disciplinar"
                        icon={Gauge}
                        accent
                        isDark={isDarkMode}
                        categoryTheme={theme}
                      />
                      <CompactStatCard
                        title="Descarte"
                        value={safeSelectedPilot.descarte}
                        subtitle="impacto no campeonato"
                        icon={Gauge}
                        isDark={isDarkMode}
                        categoryTheme={theme}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>


<TabsContent value="comparador" className="mt-0 space-y-4 pt-0">
  <Card
    className={`overflow-hidden rounded-[24px] shadow-sm ${
      isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
    }`}
  >
    <CardContent className="p-0">
      <div className="relative px-4 py-4">
        <div
          className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${theme.primaryRing} to-transparent`}
        />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
              }`}
            >
              <Swords
                className={`h-5 w-5 ${
                  isDarkMode ? theme.darkAccentText : theme.primaryIcon
                }`}
              />
            </div>

            <div>
              <p
                className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Head-to-head oficial
              </p>
              <h2
                className={`text-[17px] font-extrabold tracking-tight ${
                  isDarkMode ? "text-white" : "text-zinc-950"
                }`}
              >
                Comparador premium entre pilotos
              </h2>
            </div>
          </div>

          <div
            className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
              isDarkMode
                ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                : theme.searchBadge
            }`}
          >
            {competitionLabels[competition] || competition}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>

  <Card
    className={`rounded-[24px] shadow-sm ${
      isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
    }`}
  >
    <CardContent className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p
            className={`mb-2 text-[10px] font-bold uppercase tracking-[0.16em] ${
              isDarkMode ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            Piloto A
          </p>
          <select
            value={comparePilotAId}
            onChange={(e) => setComparePilotAId(e.target.value)}
            className={`h-12 w-full rounded-2xl border px-3 text-sm font-semibold outline-none ${
              isDarkMode
                ? "border-white/10 bg-[#0f172a] text-white"
                : "border-zinc-200 bg-white text-zinc-950"
            }`}
          >
            <option value="">Selecionar piloto A</option>
            {filteredRanking.map((pilot) => {
              const value = pilot.pilotoId || pilot.piloto;
              return (
                <option key={`a-${value}`} value={value}>
                  {getPilotFirstAndLastName(pilot.piloto)}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <p
            className={`mb-2 text-[10px] font-bold uppercase tracking-[0.16em] ${
              isDarkMode ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            Piloto B
          </p>
          <select
            value={comparePilotBId}
            onChange={(e) => setComparePilotBId(e.target.value)}
            className={`h-12 w-full rounded-2xl border px-3 text-sm font-semibold outline-none ${
              isDarkMode
                ? "border-white/10 bg-[#0f172a] text-white"
                : "border-zinc-200 bg-white text-zinc-950"
            }`}
          >
            <option value="">Selecionar piloto B</option>
            {filteredRanking.map((pilot) => {
              const value = pilot.pilotoId || pilot.piloto;
              return (
                <option key={`b-${value}`} value={value}>
                  {getPilotFirstAndLastName(pilot.piloto)}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {!comparePilotA || !comparePilotB ? (
        <div
          className={`rounded-[22px] px-4 py-8 text-center text-sm ${
            isDarkMode
              ? "border border-dashed border-white/10 bg-[#0f172a] text-zinc-400"
              : "border border-dashed border-black/10 bg-zinc-50 text-zinc-500"
          }`}
        >
          Selecione dois pilotos da categoria atual para liberar o comparativo 1x1.
        </div>
      ) : comparePilotAId === comparePilotBId ? (
        <div
          className={`rounded-[22px] px-4 py-8 text-center text-sm ${
            isDarkMode
              ? "border border-dashed border-white/10 bg-[#0f172a] text-zinc-400"
              : "border border-dashed border-black/10 bg-zinc-50 text-zinc-500"
          }`}
        >
          Escolha dois pilotos diferentes para montar o duelo oficial.
        </div>
      ) : (
        <>
          <div
            className={`overflow-hidden rounded-[24px] border ${
              isDarkMode
                ? `${theme.darkAccentBorder} bg-gradient-to-br ${theme.darkAccentCard}`
                : `${theme.primaryBorder} bg-gradient-to-br ${theme.heroBg}`
            }`}
          >
            <div className="relative px-3 py-3 sm:px-4 sm:py-4">
              <div
                className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${theme.primaryRing} to-transparent`}
              />

              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                      isDarkMode ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    Arena do duelo
                  </p>
                  <h3
                    className={`text-[18px] font-extrabold tracking-tight ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    Confronto direto premium
                  </h3>
                </div>

                <div
                  className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] ${duelIntensity.tone}`}
                >
                  {duelIntensity.label}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_160px_1fr] lg:items-stretch">
                {[comparePilotA, comparePilotB].map((pilot, index) => {
                  const side = index === 0 ? "a" : "b";
                  const pilotPosition =
                    pilot.pos ||
                    filteredRanking.findIndex(
                      (item) =>
                        (item.pilotoId || item.piloto) ===
                        (pilot.pilotoId || pilot.piloto)
                    ) +
                      1;
                  const isWinner = duelSummary?.overallWinner === side;
                  const pilotScore =
                    side === "a" ? duelSummary?.scoreA || 0 : duelSummary?.scoreB || 0;
                  const trendStatus =
                    pilotTrendMap[pilot.pilotoId || normalizePilotName(pilot.piloto)] ||
                    "stable";
                  const trendVisual = getTrendVisual(trendStatus, isDarkMode);
                  const TrendIcon = trendVisual.Icon;
                  const gapVsLeader = leader
                    ? getGapToLeader(leader.pontos, pilot.pontos)
                    : "-";
                  const performanceWins = duelMetrics.filter(
                    (metric) => getComparisonWinner(metric.a, metric.b, metric.lowerIsBetter) === side
                  ).length;

                  return (
                    <div
                      key={`${side}-${pilot.pilotoId || pilot.piloto}`}
                      className={`rounded-[24px] border p-3 sm:p-4 ${
                        isDarkMode
                          ? isWinner
                            ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft} shadow-[0_14px_32px_rgba(0,0,0,0.34)]`
                            : "border-white/10 bg-[#0f172a]"
                          : isWinner
                            ? `${theme.heroBorder} bg-white/95 shadow-[0_16px_34px_rgba(15,23,42,0.08)]`
                            : "border-black/5 bg-white/88 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <div>
                          <p
                            className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                              isDarkMode ? "text-zinc-500" : "text-zinc-400"
                            }`}
                          >
                            Piloto {side.toUpperCase()}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                                isDarkMode
                                  ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                                  : theme.heroChip
                              }`}
                            >
                              {pilotPosition}º lugar
                            </span>
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${trendVisual.className}`}
                            >
                              <span className="inline-flex items-center gap-1">
                                <TrendIcon className="h-3 w-3" />
                                {trendVisual.label}
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p
                            className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                              isDarkMode ? "text-zinc-500" : "text-zinc-400"
                            }`}
                          >
                            Score
                          </p>
                          <p
                            className={`mt-1 text-[28px] font-black leading-none tracking-tight ${
                              isDarkMode ? "text-white" : "text-zinc-950"
                            }`}
                          >
                            {pilotScore}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-[96px_1fr] items-center gap-3">
                        <div className="h-[96px] w-[96px] overflow-hidden rounded-[24px] border border-black/5">
                          <PilotPhotoSlot
                            pilot={pilot}
                            alt={getPilotFirstAndLastName(pilot.piloto)}
                            isDark={isDarkMode}
                          />
                        </div>

                        <div className="min-w-0">
                          <p
                            className={`text-[17px] font-black leading-[1.02] tracking-tight ${
                              isDarkMode ? "text-white" : "text-zinc-950"
                            }`}
                          >
                            {getPilotFirstAndLastName(pilot.piloto)}
                          </p>

                          {getPilotWarNameDisplay(pilot) ? (
                            <p
                              className={`mt-1 text-[11px] italic ${
                                isDarkMode ? "text-zinc-400" : "text-zinc-500"
                              }`}
                            >
                              {getPilotWarNameDisplay(pilot)}
                            </p>
                          ) : null}

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div
                              className={`rounded-[18px] border px-3 py-2 ${
                                isDarkMode
                                  ? "border-white/10 bg-[#111827]"
                                  : "border-black/5 bg-zinc-50/70"
                              }`}
                            >
                              <p className={`text-[9px] font-bold uppercase tracking-[0.14em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                Pontos
                              </p>
                              <p className={`mt-1 text-[19px] font-black leading-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                {pilot.pontos}
                              </p>
                            </div>

                            <div
                              className={`rounded-[18px] border px-3 py-2 ${
                                isDarkMode
                                  ? "border-white/10 bg-[#111827]"
                                  : "border-black/5 bg-zinc-50/70"
                              }`}
                            >
                              <p className={`text-[9px] font-bold uppercase tracking-[0.14em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                Gap líder
                              </p>
                              <p className={`mt-1 text-[12px] font-extrabold leading-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                {gapVsLeader}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {[
                          { label: "VIT", value: pilot.vitorias },
                          { label: "POL", value: pilot.poles },
                          { label: "PDS", value: pilot.podios },
                          { label: "ADV", value: pilot.adv },
                        ].map((stat) => (
                          <div
                            key={`${side}-${stat.label}`}
                            className={`rounded-[18px] border px-2.5 py-2 text-center ${
                              isDarkMode
                                ? "border-white/10 bg-[#111827]"
                                : "border-black/5 bg-zinc-50/70"
                            }`}
                          >
                            <p className={`text-[9px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                              {stat.label}
                            </p>
                            <p className={`mt-1 text-[17px] font-black leading-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                              {stat.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div
                        className={`mt-3 rounded-[18px] border px-3 py-2 ${
                          isDarkMode
                            ? isWinner
                              ? `${theme.darkAccentBorder} ${theme.darkAccentBg}`
                              : "border-white/10 bg-[#111827]"
                            : isWinner
                              ? `${theme.primaryBorder} bg-white`
                              : "border-black/5 bg-zinc-50/70"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-[9px] font-bold uppercase tracking-[0.14em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                            Territórios vencidos
                          </p>
                          <span className={`text-[11px] font-black ${isDarkMode ? (isWinner ? theme.darkAccentText : "text-zinc-300") : "text-zinc-950"}`}>
                            {performanceWins} / {duelMetrics.length}
                          </span>
                        </div>
                        <div className={`mt-2 h-2.5 overflow-hidden rounded-full ${isDarkMode ? "bg-white/10" : "bg-zinc-200/80"}`}>
                          <div
                            className={`h-full rounded-full ${
                              isDarkMode ? (isWinner ? "bg-white" : "bg-zinc-400") : (isWinner ? "bg-zinc-950" : "bg-zinc-400")
                            }`}
                            style={{ width: `${Math.max(10, Math.round((performanceWins / Math.max(duelMetrics.length, 1)) * 100))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="flex flex-col items-center justify-center gap-2 px-1 py-1 sm:px-0">
                  <div
                    className={`rounded-[28px] border px-4 py-3 text-center ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} bg-[#0f172a] shadow-[0_10px_28px_rgba(0,0,0,0.26)]`
                        : `${theme.primaryBorder} bg-white shadow-[0_14px_28px_rgba(15,23,42,0.06)]`
                    }`}
                  >
                    <p className={`text-[9px] font-bold uppercase tracking-[0.18em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                      Placar oficial
                    </p>
                    <p className={`mt-1 text-[34px] font-black leading-none tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                      {duelSummary?.scoreA || 0}
                      <span className={`${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}> x </span>
                      {duelSummary?.scoreB || 0}
                    </p>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-full border ${
                          isDarkMode
                            ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                            : `${theme.primaryBorder} bg-zinc-50 text-zinc-950`
                        }`}
                      >
                        <Swords className="h-4.5 w-4.5" />
                      </div>
                    </div>
                    <p className={`mt-2 text-[11px] font-semibold leading-snug ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                      {duelSummary?.narrative}
                    </p>
                  </div>

                  <div
                    className={`rounded-[22px] border px-3 py-2 text-center ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} ${theme.darkAccentBg}`
                        : theme.searchBadge
                    }`}
                  >
                    <p className={`text-[9px] font-black uppercase tracking-[0.16em] ${isDarkMode ? theme.darkAccentText : "inherit"}`}>
                      {duelSummary?.profileLabel}
                    </p>
                  </div>

                  <div
                    className={`rounded-[22px] border px-3 py-3 text-center ${
                      isDarkMode
                        ? "border-white/10 bg-[#0f172a]"
                        : "border-black/5 bg-white/90"
                    }`}
                  >
                    <p className={`text-[9px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                      Vencedor do duelo
                    </p>
                    <p className={`mt-1 text-[15px] font-black leading-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                      {duelWinnerPilot
                        ? getPilotFirstAndLastName(duelWinnerPilot.piloto)
                        : "Empate técnico"}
                    </p>
                    <p className={`mt-1 text-[11px] leading-snug ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                      {duelIntensity.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <Card
              className={`rounded-[24px] shadow-sm ${
                isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
              }`}
            >
              <CardContent className="p-4">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                      isDarkMode ? theme.darkAccentIconWrap : theme.statsIconWrap
                    }`}
                  >
                    <BarChart3
                      className={`h-4.5 w-4.5 ${
                        isDarkMode ? theme.darkAccentText : theme.statsIcon
                      }`}
                    />
                  </div>

                  <div>
                    <p
                      className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                        isDarkMode ? "text-zinc-500" : "text-zinc-400"
                      }`}
                    >
                      Métrica por métrica
                    </p>
                    <h3
                      className={`text-[16px] font-extrabold tracking-tight ${
                        isDarkMode ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      Leitura visual do confronto
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {duelMetrics.map((metric) => {
                    const winner = getComparisonWinner(
                      metric.a,
                      metric.b,
                      metric.lowerIsBetter
                    );
                    const maxValue = Math.max(metric.a, metric.b, 1);
                    const getMetricPercent = (value: number) => {
                      if (metric.lowerIsBetter) {
                        const normalized = maxValue - value;
                        return Math.max(10, Math.round((normalized / maxValue) * 100));
                      }

                      return Math.max(10, Math.round((value / maxValue) * 100));
                    };
                    const aPct = getMetricPercent(metric.a);
                    const bPct = getMetricPercent(metric.b);

                    return (
                      <div
                        key={metric.label}
                        className={`rounded-[22px] border p-3 ${
                          isDarkMode
                            ? "border-white/10 bg-[#0f172a]"
                            : "border-black/5 bg-zinc-50/70"
                        }`}
                      >
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p
                              className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                                isDarkMode ? "text-zinc-500" : "text-zinc-400"
                              }`}
                            >
                              {metric.label}
                            </p>
                            <p
                              className={`mt-0.5 text-[11px] font-medium ${
                                isDarkMode ? "text-zinc-400" : "text-zinc-500"
                              }`}
                            >
                              {metric.description}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full border px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] ${
                              winner === "tie"
                                ? isDarkMode
                                  ? "border-white/10 bg-white/5 text-zinc-300"
                                  : "border-zinc-200 bg-white text-zinc-600"
                                : isDarkMode
                                  ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                                  : theme.searchBadge
                            }`}
                          >
                            {winner === "tie"
                              ? "Empate"
                              : winner === "a"
                                ? "Vantagem A"
                                : "Vantagem B"}
                          </span>
                        </div>

                        <div className="grid grid-cols-[56px_1fr_56px] items-center gap-3">
                          <div className="text-left">
                            <p className={`text-[10px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                              A
                            </p>
                            <p className={`mt-1 text-[22px] font-black leading-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                              {metric.a}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <div className="mb-1 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.12em]">
                                <span className={isDarkMode ? "text-zinc-500" : "text-zinc-400"}>
                                  {getPilotNameParts(comparePilotA.piloto).firstName}
                                </span>
                                <span className={isDarkMode ? "text-zinc-500" : "text-zinc-400"}>
                                  {aPct}%
                                </span>
                              </div>
                              <div className={`h-2.5 overflow-hidden rounded-full ${isDarkMode ? "bg-white/10" : "bg-zinc-200/80"}`}>
                                <div
                                  className={`h-full rounded-full ${
                                    winner === "a"
                                      ? isDarkMode
                                        ? "bg-white"
                                        : "bg-zinc-950"
                                      : isDarkMode
                                        ? "bg-zinc-500"
                                        : "bg-zinc-400"
                                  }`}
                                  style={{ width: `${aPct}%` }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="mb-1 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.12em]">
                                <span className={isDarkMode ? "text-zinc-500" : "text-zinc-400"}>
                                  {getPilotNameParts(comparePilotB.piloto).firstName}
                                </span>
                                <span className={isDarkMode ? "text-zinc-500" : "text-zinc-400"}>
                                  {bPct}%
                                </span>
                              </div>
                              <div className={`h-2.5 overflow-hidden rounded-full ${isDarkMode ? "bg-white/10" : "bg-zinc-200/80"}`}>
                                <div
                                  className={`ml-auto h-full rounded-full ${
                                    winner === "b"
                                      ? isDarkMode
                                        ? "bg-white"
                                        : "bg-zinc-950"
                                      : isDarkMode
                                        ? "bg-zinc-500"
                                        : "bg-zinc-400"
                                  }`}
                                  style={{ width: `${bPct}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className={`text-[10px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                              B
                            </p>
                            <p className={`mt-1 text-[22px] font-black leading-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                              {metric.b}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card
                className={`rounded-[24px] shadow-sm ${
                  isDarkMode
                    ? `${theme.darkAccentBorder} bg-[#111827]`
                    : `${theme.titleBorder} bg-gradient-to-br from-white via-white to-zinc-50/70`
                }`}
              >
                <CardContent className="p-4">
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                        isDarkMode ? theme.darkAccentIconWrap : theme.statsIconWrap
                      }`}
                    >
                      <Gauge
                        className={`h-4.5 w-4.5 ${
                          isDarkMode ? theme.darkAccentText : theme.statsIcon
                        }`}
                      />
                    </div>

                    <div>
                      <p
                        className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                          isDarkMode ? "text-zinc-500" : "text-zinc-400"
                        }`}
                      >
                        Síntese oficial do duelo
                      </p>
                      <h3
                        className={`text-[16px] font-extrabold tracking-tight ${
                          isDarkMode ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        Desempenho + disciplina
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`rounded-[22px] border p-4 ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}`
                        : `${theme.primaryBorder} bg-gradient-to-br ${theme.heroBg}`
                    }`}
                  >
                    <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                      Selo do confronto
                    </p>
                    <p className={`mt-2 text-[22px] font-black leading-tight tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                      {duelSummary?.narrative}
                    </p>
                    <p className={`mt-2 text-[12px] leading-relaxed ${isDarkMode ? "text-zinc-300" : "text-zinc-600"}`}>
                      {duelSummary?.profileLabel}. {duelSummary?.pointsWinner === "tie"
                        ? "No placar de pontos, os dois seguem empatados."
                        : duelSummary?.pointsWinner === "a"
                          ? `${getPilotFirstAndLastName(comparePilotA.piloto)} leva vantagem pontual no campeonato.`
                          : `${getPilotFirstAndLastName(comparePilotB.piloto)} leva vantagem pontual no campeonato.`}
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <CompactStatCard
                      title="Placar técnico"
                      value={`${duelSummary?.scoreA || 0} x ${duelSummary?.scoreB || 0}`}
                      subtitle={getDuelWinnerLabel(duelSummary?.overallWinner || "tie")}
                      icon={Swords}
                      accent
                      isDark={isDarkMode}
                      categoryTheme={theme}
                    />
                    <CompactStatCard
                      title="Gap em pontos"
                      value={`${duelSummary?.pointsDiff || 0} pts`}
                      subtitle={
                        duelSummary?.pointsWinner === "tie"
                          ? "duelo empatado"
                          : duelSummary?.pointsWinner === "a"
                            ? `${getPilotNameParts(comparePilotA.piloto).firstName} na frente`
                            : `${getPilotNameParts(comparePilotB.piloto).firstName} na frente`
                      }
                      icon={BarChart3}
                      isDark={isDarkMode}
                      categoryTheme={theme}
                    />
                    <CompactStatCard
                      title="Disciplina"
                      value={getDuelWinnerLabel(duelSummary?.advWinner || "tie")}
                      subtitle="menor número de advertências"
                      icon={Flag}
                      isDark={isDarkMode}
                      categoryTheme={theme}
                    />
                    <CompactStatCard
                      title="Leitura geral"
                      value={duelSummary?.profileLabel || "Sem leitura"}
                      subtitle="visão consolidada do confronto"
                      icon={Gauge}
                      isDark={isDarkMode}
                      categoryTheme={theme}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`rounded-[24px] shadow-sm ${
                  isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
                }`}
              >
                <CardContent className="p-4">
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                        isDarkMode ? theme.darkAccentIconWrap : theme.statsIconWrap
                      }`}
                    >
                      <Trophy
                        className={`h-4.5 w-4.5 ${
                          isDarkMode ? theme.darkAccentText : theme.statsIcon
                        }`}
                      />
                    </div>
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                        Leitura editorial
                      </p>
                      <h3 className={`text-[16px] font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                        Quem leva cada frente
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div
                      className={`rounded-[20px] border p-3 ${
                        isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50/70"
                      }`}
                    >
                      <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                        Performance
                      </p>
                      <p className={`mt-1 text-[14px] font-extrabold leading-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                        {duelSummary?.pointsWinner === "tie"
                          ? "Empate em desempenho"
                          : duelSummary?.pointsWinner === "a"
                            ? `${getPilotNameParts(comparePilotA.piloto).firstName} na frente`
                            : `${getPilotNameParts(comparePilotB.piloto).firstName} na frente`}
                      </p>
                      <p className={`mt-1 text-[11px] leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                        leitura com base em pontos totais e volume geral de resultado.
                      </p>
                    </div>

                    <div
                      className={`rounded-[20px] border p-3 ${
                        isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50/70"
                      }`}
                    >
                      <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                        Disciplina
                      </p>
                      <p className={`mt-1 text-[14px] font-extrabold leading-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                        {duelSummary?.advWinner === "tie"
                          ? "Empate disciplinar"
                          : duelSummary?.advWinner === "a"
                            ? `${getPilotNameParts(comparePilotA.piloto).firstName} mais limpo`
                            : `${getPilotNameParts(comparePilotB.piloto).firstName} mais limpo`}
                      </p>
                      <p className={`mt-1 text-[11px] leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                        leitura com base em advertências dentro do campeonato selecionado.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </CardContent>
  </Card>
</TabsContent>

          <TabsContent value="stats" className="mt-0 space-y-4 pt-0">
            <div
              className={`overflow-hidden rounded-[22px] shadow-sm ${
                isDarkMode
                  ? `border ${theme.darkAccentBorder} bg-[#111827]`
                  : `border ${theme.titleBorder} bg-gradient-to-br ${theme.statsSoft}`
              }`}
            >
              <div className="relative px-4 py-4">
                <div
                  className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${theme.primaryRing} to-transparent`}
                />

                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        isDarkMode ? theme.darkAccentIconWrap : theme.statsIconWrap
                      }`}
                    >
                      <BarChart3
                        className={`h-5 w-5 ${
                          isDarkMode ? theme.darkAccentText : theme.statsIcon
                        }`}
                      />
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                          isDarkMode ? "text-zinc-500" : "text-zinc-400"
                        }`}
                      >
                        Central de estatísticas
                      </p>
                      <h2
                        className={`text-[17px] font-extrabold tracking-tight ${
                          isDarkMode ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        Stats da classificação
                      </h2>
                      <p
                        className={`text-[11px] font-semibold ${
                          isDarkMode ? "text-zinc-400" : "text-zinc-500"
                        }`}
                      >
                        {category} · {competitionLabels[competition] || competition}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                        : theme.headerChip
                    }`}
                  >
                    Painel premium
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <CompactStatCard
                title="Pilotos ativos"
                value={statsSummary.totalPilots}
                subtitle="com pontuação na seleção atual"
                icon={Users}
                categoryTheme={theme}
                isDark={isDarkMode}
              />
              <CompactStatCard
                title="Vantagem do líder"
                value={`${statsSummary.leaderAdvantage} pts`}
                subtitle="sobre o 2º colocado"
                icon={Crown}
                accent
                categoryTheme={theme}
                isDark={isDarkMode}
              />
              <CompactStatCard
                title="Média geral"
                value={statsSummary.totalPilots ? statsSummary.avgPoints.toFixed(1) : "0.0"}
                subtitle="pontos por piloto nesta leitura"
                icon={Gauge}
                categoryTheme={theme}
                isDark={isDarkMode}
              />
              <CompactStatCard
                title="Corte Top 6"
                value={`${statsSummary.top6CutPoints} pts`}
                subtitle="pontuação mínima da zona de troféu"
                icon={Medal}
                accent
                categoryTheme={theme}
                isDark={isDarkMode}
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <HighlightCard
                title="Radar oficial"
                icon={Star}
                accent
                isDark={isDarkMode}
                categoryTheme={theme}
                accentStyles={{
                  border: theme.heroBorder,
                  bg: `bg-gradient-to-b ${theme.heroBg}`,
                  iconWrap: theme.primaryIconWrap,
                  icon: theme.primaryIcon,
                  text:
                    category === "Base"
                      ? "text-orange-800"
                      : category === "Graduados"
                        ? "text-blue-800"
                        : "text-yellow-800",
                  divider:
                    category === "Base"
                      ? "bg-orange-200/80"
                      : category === "Graduados"
                        ? "bg-blue-200/80"
                        : "bg-yellow-200/80",
                }}
              >
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div
                    className={`rounded-[16px] border px-2.5 py-2.5 ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} bg-[#0f172a]`
                        : "border-black/5 bg-white/80"
                    }`}
                  >
                    <p
                      className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                        isDarkMode ? "text-zinc-500" : "text-zinc-400"
                      }`}
                    >
                      Momento do grid
                    </p>
                    <p
                      className={`mt-1 text-[15px] font-extrabold leading-tight ${
                        isDarkMode ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      {statsRadar.hottestLabel}
                    </p>
                    <p
                      className={`mt-1 text-[11px] leading-snug ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      {statsRadar.hottestPilot
                        ? `${getPilotFirstAndLastName(statsRadar.hottestPilot.piloto)} lidera a leitura de impacto.`
                        : "Sem piloto destacado nesta seleção."}
                    </p>
                  </div>

                  <div
                    className={`rounded-[16px] border px-2.5 py-2.5 ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} bg-[#0f172a]`
                        : "border-black/5 bg-white/80"
                    }`}
                  >
                    <p
                      className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                        isDarkMode ? "text-zinc-500" : "text-zinc-400"
                      }`}
                    >
                      Temperatura do título
                    </p>
                    <p
                      className={`mt-1 text-[15px] font-extrabold leading-tight ${
                        isDarkMode ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      {statsRadar.titleHeat}
                    </p>
                    <p
                      className={`mt-1 text-[11px] leading-snug ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      {statsSummary.totalPilots > 1
                        ? `${statsSummary.leaderAdvantage} pts separam líder e vice.`
                        : "Ainda não há duelo consolidado nesta seleção."}
                    </p>
                  </div>

                  <div
                    className={`rounded-[16px] border px-2.5 py-2.5 ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} bg-[#0f172a]`
                        : "border-black/5 bg-white/80"
                    }`}
                  >
                    <p
                      className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                        isDarkMode ? "text-zinc-500" : "text-zinc-400"
                      }`}
                    >
                      Pressão do Top 6
                    </p>
                    <p
                      className={`mt-1 text-[15px] font-extrabold leading-tight ${
                        isDarkMode ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      {statsRadar.podiumPressure} pts
                    </p>
                    <p
                      className={`mt-1 text-[11px] leading-snug ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      diferença entre o topo do pódio ampliado e a zona de troféu.
                    </p>
                  </div>

                  <div
                    className={`rounded-[16px] border px-2.5 py-2.5 ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} bg-[#0f172a]`
                        : "border-black/5 bg-white/80"
                    }`}
                  >
                    <p
                      className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                        isDarkMode ? "text-zinc-500" : "text-zinc-400"
                      }`}
                    >
                      Eficiência oficial
                    </p>
                    <p
                      className={`mt-1 text-[15px] font-extrabold leading-tight ${
                        isDarkMode ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      {bestEfficiencyPilot
                        ? getPilotFirstAndLastName(bestEfficiencyPilot.piloto)
                        : "Sem leitura"}
                    </p>
                    <p
                      className={`mt-1 text-[11px] leading-snug ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      {bestEfficiencyPilot
                        ? `${(bestEfficiencyPilot.pontos / Math.max(bestEfficiencyPilot.participacoes, 1)).toFixed(1)} pts por participação.`
                        : "Nenhuma participação registrada para calcular eficiência."}
                    </p>
                  </div>
                </div>
              </HighlightCard>
            </div>

            <Card
              className={`overflow-hidden rounded-[22px] shadow-sm ${
                isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
              }`}
            >
              <CardHeader
                className={`${
                  isDarkMode
                    ? "border-b border-white/10 bg-gradient-to-r from-[#111827] via-[#161e2b] to-[#111827]"
                    : "border-b border-black/5 bg-gradient-to-r from-white via-zinc-50/70 to-white"
                }`}
              >
                <CardTitle
                  className={`flex items-center gap-3 ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                      isDarkMode ? theme.darkAccentIconWrap : theme.statsIconWrap
                    }`}
                  >
                    <BarChart3
                      className={`h-5 w-5 ${
                        isDarkMode ? theme.darkAccentText : theme.statsIcon
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                        isDarkMode ? "text-zinc-500" : "text-zinc-400"
                      }`}
                    >
                      Desempenho oficial
                    </p>
                    <p
                      className={`text-[16px] font-extrabold tracking-tight ${
                        isDarkMode ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      Top 5 em pontos
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="h-72 pt-4">
                {topPointsChartData.length === 0 ? (
                  <div
                    className={`flex h-full items-center justify-center rounded-2xl text-sm ${
                      isDarkMode
                        ? "border border-dashed border-white/10 bg-[#0f172a] text-zinc-400"
                        : "border border-dashed border-black/10 bg-zinc-50 text-zinc-500"
                    }`}
                  >
                    Nenhum dado disponível para este campeonato.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topPointsChartData}>
                      <CartesianGrid
                        stroke={
                          isDarkMode
                            ? "rgba(255,255,255,0.08)"
                            : theme.chartGrid
                        }
                        strokeDasharray="3 3"
                      />
                      <XAxis
                        dataKey="piloto"
                        stroke={isDarkMode ? "#9ca3af" : theme.chartAxis}
                      />
                      <YAxis
                        stroke={isDarkMode ? "#9ca3af" : theme.chartAxis}
                      />
                      <Tooltip
                        contentStyle={{
                          background: isDarkMode ? "#111827" : "#ffffff",
                          border: isDarkMode
                            ? "1px solid rgba(255,255,255,0.10)"
                            : "1px solid rgba(15,23,42,0.08)",
                          color: isDarkMode ? "#ffffff" : "#111827",
                          borderRadius: 16,
                        }}
                      />
                      <Bar
                        dataKey="pontos"
                        fill={isDarkMode ? theme.darkChartBar : theme.chartBar}
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-3">
              <StatRankingCard
                title="Mais vitórias"
                icon={Trophy}
                items={topVitorias}
                metricKey="vitorias"
                emptyLabel="Nenhuma vitória registrada nesta seleção."
                theme={theme}
                isDark={isDarkMode}
              />

              <StatRankingCard
                title="Mais poles"
                icon={Flag}
                items={topPoles}
                metricKey="poles"
                emptyLabel="Nenhuma pole registrada nesta seleção."
                theme={theme}
                isDark={isDarkMode}
              />

              <StatRankingCard
                title="Mais VMR"
                icon={Timer}
                items={topMv}
                metricKey="mv"
                emptyLabel="Nenhuma volta mais rápida registrada nesta seleção."
                theme={theme}
                isDark={isDarkMode}
              />

              <StatRankingCard
                title="Mais pódios"
                icon={Medal}
                items={topPodios}
                metricKey="podios"
                emptyLabel="Nenhum pódio registrado nesta seleção."
                theme={theme}
                isDark={isDarkMode}
              />
            </div>
          </TabsContent>
            <div className="pointer-events-none fixed -left-[9999px] top-0 z-[-1] opacity-0">
              <div
                ref={pilotShareCardRef}
                className={`w-[1080px] overflow-hidden rounded-[40px] border p-10 ${
                  isDarkMode
                    ? `border-white/10 bg-gradient-to-br ${theme.darkAccentCard} text-white`
                    : `${theme.primaryBorder} bg-gradient-to-br ${theme.shellGlow} text-zinc-950`
                }`}
              >
                <div
                  className={`rounded-[30px] border p-8 ${
                    isDarkMode
                      ? `${theme.darkAccentBorder} bg-[#111827]`
                      : `${theme.heroBorder} bg-white/92`
                  }`}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-[22px] ${
                          isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                        }`}
                      >
                        <User className={`h-8 w-8 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
                      </div>
                      <div>
                        <p className={`text-[14px] font-bold uppercase tracking-[0.2em] ${
                          isDarkMode ? "text-zinc-400" : "text-zinc-500"
                        }`}>
                          Perfil oficial do piloto
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <h2 className="text-[40px] font-extrabold leading-none tracking-tight">
                            {selectedPilotShortName || "Piloto"}
                          </h2>
                          {selectedPilotWarName ? (
                            <div
                              className={`rounded-full border px-4 py-1.5 text-[14px] font-bold tracking-[0.04em] ${
                                isDarkMode
                                  ? `${theme.darkAccentBorder} bg-white/5 text-zinc-100`
                                  : `${theme.heroBorder} bg-white text-zinc-700`
                              }`}
                            >
                              {selectedPilotWarName}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start justify-end gap-3 max-w-[440px]">
                      <div className="flex flex-col items-end gap-3">
                        <div
                          className={`rounded-full border px-5 py-2 text-[15px] font-bold uppercase tracking-[0.14em] ${
                            isDarkMode
                              ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                              : theme.searchBadge
                          }`}
                        >
                          {selectedPilot ? `${safeSelectedPilot.pos}º lugar` : "Sem posição"}
                        </div>
                        <div
                          className={`rounded-full border px-5 py-2 text-[15px] font-bold uppercase tracking-[0.14em] ${
                            isDarkMode
                              ? "border-white/10 bg-white/5 text-zinc-200"
                              : "border-zinc-200 bg-zinc-50 text-zinc-700"
                          }`}
                        >
                          {selectedPilot ? `${safeSelectedPilot.pontos} pontos` : "0 pontos"}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div
                          className={`rounded-full border px-5 py-2 text-[15px] font-bold uppercase tracking-[0.14em] ${
                            isDarkMode
                              ? `${theme.darkAccentBorder} bg-white/5 text-zinc-200`
                              : `${theme.heroBorder} bg-white text-zinc-700`
                          }`}
                        >
                          {category}
                        </div>
                        <div
                          className={`rounded-full border px-5 py-2 text-[15px] font-bold uppercase tracking-[0.14em] ${
                            isDarkMode
                              ? `${theme.darkAccentBorder} bg-white/5 text-zinc-200`
                              : `${theme.heroBorder} bg-white text-zinc-700`
                          }`}
                        >
                          {competitionLabels[competition] || competition}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-[280px_1fr] items-start gap-6">
                    <div className="space-y-4 self-start">
                      <div className={`overflow-hidden rounded-[28px] border ${
                        isDarkMode ? `${theme.darkAccentBorder} bg-[#0f172a]` : `${theme.heroBorder} bg-zinc-50`
                      }`}>
                        <div className="relative aspect-square w-full overflow-hidden">
                        {selectedPilot && getPilotPhotoPath(selectedPilot) ? (
                          <img
                            src={getPilotPhotoPath(selectedPilot) || ""}
                            alt={selectedPilotShortName || "Piloto"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className={`flex h-full w-full items-center justify-center ${
                            isDarkMode ? "bg-gradient-to-b from-[#0f172a] to-[#111827]" : "bg-gradient-to-b from-zinc-50 to-zinc-100"
                          }`}>
                            <div className="text-center">
                              <div className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-[22px] ${
                                isDarkMode ? "bg-white/5" : "bg-white"
                              }`}>
                                <Camera className={`h-7 w-7 ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`} />
                              </div>
                              <p className={`text-[13px] font-bold uppercase tracking-[0.14em] ${
                                isDarkMode ? "text-zinc-400" : "text-zinc-500"
                              }`}>
                                Espaço da foto
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      </div>
                    </div>

                      <div className={`rounded-[24px] border px-4 py-4 ${
                        isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white/90"
                      }`}>
                        <div className="mb-3 flex items-center justify-center">
                          <div className={`rounded-full border px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] ${
                            isDarkMode ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}` : theme.heroChip
                          }`}>
                            Patrocinadores oficiais
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {sponsorLogos.map((sponsor) => {
                            const shareLogoClass =
                              sponsor.name === "LazyKart"
                                ? "max-h-[42px] max-w-[118px] object-contain"
                                : sponsor.name === "Astera"
                                  ? "max-h-[40px] max-w-[118px] object-contain"
                                  : sponsor.shareImage;

                            return (
                              <div
                                key={`pilot-share-sponsor-${sponsor.name}`}
                                className={`flex h-[74px] items-center justify-center overflow-hidden rounded-[18px] border shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${sponsor.wrapper} ${
                                  isDarkMode ? sponsor.surfaceDark : sponsor.surfaceLight
                                }`}
                              >
                                <img
                                  src={sponsor.src}
                                  alt={sponsor.name}
                                  className={shareLogoClass}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="grid grid-cols-4 gap-4">
                        <div className={`rounded-[24px] border px-5 py-5 ${
                          isDarkMode ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}` : `${theme.heroBorder} bg-gradient-to-b ${theme.heroBg}`
                        }`}>
                          <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-500"}`}>Posição</p>
                          <p className={`mt-2 text-[34px] font-extrabold leading-none tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>{selectedPilot?.pos || 0}º</p>
                          <p className={`mt-2 text-[13px] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>{selectedPilotGap}</p>
                        </div>
                        <div className={`rounded-[24px] border px-5 py-5 ${
                          isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50/80"
                        }`}>
                          <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-500"}`}>Eficiência</p>
                          <p className={`mt-2 text-[34px] font-extrabold leading-none tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>{selectedPilotAverage.toFixed(1)}</p>
                          <p className={`mt-2 text-[13px] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>média por participação</p>
                        </div>
                        <div className={`rounded-[24px] border px-5 py-5 ${
                          isDarkMode ? `${theme.darkAccentBorder} bg-[#0f172a]` : `${theme.primaryBorder} bg-white`
                        }`}>
                          <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-500"}`}>Vitórias</p>
                          <p className={`mt-2 text-[34px] font-extrabold leading-none tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>{selectedPilot?.vitorias || 0}</p>
                          <p className={`mt-2 text-[13px] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>{selectedPilotWinRate}% de conversão</p>
                        </div>
                        <div className={`rounded-[24px] border px-5 py-5 ${
                          isDarkMode ? `${theme.darkAccentBorder} ${theme.darkAccentBg}` : theme.heroChip
                        }`}>
                          <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? theme.darkAccentText : "text-zinc-700"}`}>Top 6</p>
                          <p className={`mt-2 text-[34px] font-extrabold leading-none tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>{selectedPilot?.podios || 0}</p>
                          <p className={`mt-2 text-[13px] ${isDarkMode ? "text-zinc-300" : "text-zinc-700"}`}>{selectedPilotPodiumRate}% de presença</p>
                        </div>
                      </div>

                      <div className={`rounded-[26px] border px-6 py-6 ${
                        isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50/70"
                      }`}>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className={`text-[11px] font-bold uppercase tracking-[0.18em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                              Resumo oficial
                            </p>
                            <p className={`mt-2 text-[25px] font-extrabold leading-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                              {selectedPilotConsistency}
                            </p>
                            <p className={`mt-3 text-[15px] leading-relaxed ${isDarkMode ? "text-zinc-300" : "text-zinc-600"}`}>
                              Momento: <span className="font-semibold">{selectedPilotMomentum}</span> · destaque principal em <span className="font-semibold">{selectedPilotBestAttribute.label.toLowerCase()}</span> ({selectedPilotBestAttribute.value}).
                            </p>
                            <p className={`mt-2 text-[15px] leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                              {selectedPilotRivalAhead && selectedPilot
                                ? `${selectedPilotRivalAhead.pontos - safeSelectedPilot.pontos} ponto(s) para alcançar ${getPilotFirstAndLastName(selectedPilotRivalAhead.piloto)}.`
                                : "Piloto já ocupa a liderança desta leitura oficial."}
                            </p>
                          </div>

                          <div className={`rounded-[22px] border px-5 py-4 text-center ${
                            isDarkMode ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}` : `${theme.heroBorder} bg-white`
                          }`}>
                            <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>Disciplina</p>
                            <p className={`mt-2 text-[30px] font-extrabold leading-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>{selectedPilotDiscipline}%</p>
                            <p className={`mt-2 text-[13px] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>{safeSelectedPilot.adv} ADV</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          {
                            label: "Poles",
                            value: selectedPilot?.poles || 0,
                            subtext: "classificações vencidas",
                            icon: Flag,
                          },
                          {
                            label: "VMR",
                            value: selectedPilot?.mv || 0,
                            subtext: "voltas mais rápidas",
                            icon: Timer,
                          },
                          {
                            label: "Participações",
                            value: selectedPilot?.participacoes || 0,
                            subtext: "presenças oficiais",
                            icon: Users,
                          },
                          {
                            label: "Distância do líder",
                            value: selectedPilotLeaderGapValue,
                            subtext: selectedPilotLeaderGapValue === 0 ? "na liderança" : "pontos para alcançar",
                            icon: Gauge,
                          },
                          {
                            label: "Pódios",
                            value: selectedPilot?.podios || 0,
                            subtext: "chegadas no top 6",
                            icon: Trophy,
                          },
                          {
                            label: "Média de pontos",
                            value: selectedPilotAverage.toFixed(1),
                            subtext: "por participação",
                            icon: BarChart3,
                          },
                          {
                            label: "Rival direto",
                            value: selectedPilotRivalDirect
                              ? getPilotFirstAndLastName(selectedPilotRivalDirect.piloto)
                              : "Sem rival",
                            subtext: selectedPilotRivalDirect
                              ? `${Math.abs(selectedPilotRivalDirect.pontos - safeSelectedPilot.pontos)} pt(s) de diferença`
                              : "vantagem isolada",
                            icon: Swords,
                          },
                          {
                            label: "Advertências",
                            value: safeSelectedPilot.adv,
                            subtext: safeSelectedPilot.adv === 0 ? "sem punições" : "advertências recebidas",
                            icon: AlertTriangle,
                          },
                        ].map((item) => {
                          const Icon = item.icon;
                          const isTextValue = typeof item.value === "string";

                          return (
                            <div
                              key={item.label}
                              className={`rounded-[22px] border px-4 py-4 ${
                                isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <p className={`min-w-0 flex-1 pr-1 text-[11px] font-bold uppercase leading-tight tracking-[0.14em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                  {item.label}
                                </p>
                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[14px] ${
                                  isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                                }`}>
                                  <Icon className={`h-3.5 w-3.5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
                                </div>
                              </div>
                              <p className={`mt-4 ${isTextValue ? "text-[18px] leading-tight" : "text-[28px] leading-none tracking-tight"} font-extrabold ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                {item.value}
                              </p>
                              <p className={`mt-2 text-[12px] leading-snug ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                                {item.subtext}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          <div className="fixed bottom-1 left-1/2 z-30 w-[calc(100%-22px)] max-w-md -translate-x-1/2">
            <Card
              className={`relative overflow-hidden rounded-[18px] shadow-[0_16px_34px_rgba(15,23,42,0.16)] backdrop-blur-2xl ${
                isDarkMode
                  ? "border border-white/12 bg-[linear-gradient(180deg,rgba(37,52,88,0.82),rgba(21,31,56,0.90))]"
                  : "border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.52),rgba(244,247,255,0.66))]"
              }`}
            >
              <div className={`pointer-events-none absolute inset-0 ${
                isDarkMode
                  ? "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_48%),linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)]"
                  : "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_42%),linear-gradient(90deg,transparent,rgba(255,255,255,0.26),transparent)]"
              }`} />
              <CardContent className="relative px-1.5 pb-[1px] pt-0">
                <div className="mb-0 flex justify-center">
                  <p className={`text-center text-[8.5px] font-bold uppercase tracking-[0.19em] leading-none ${isDarkMode ? "text-zinc-100/95" : "text-slate-700"}`}>
                    Patrocinadores oficiais
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-[16px]">
                  <div className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-4 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-[rgba(22,32,58,0.95)] to-transparent"
                      : "bg-gradient-to-r from-[rgba(247,249,255,0.98)] to-transparent"
                  }`} />
                  <div className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-4 ${
                    isDarkMode
                      ? "bg-gradient-to-l from-[rgba(22,32,58,0.95)] to-transparent"
                      : "bg-gradient-to-l from-[rgba(247,249,255,0.98)] to-transparent"
                  }`} />

                  <div className="sponsor-marquee-track flex w-max items-center gap-1.5">
                    {sponsorTrack.map((sponsor, index) => (
                      <div
                        key={`fixed-sponsor-${sponsor.name}-${index}`}
                        className={`flex h-[50px] w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-[15px] border shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_16px_rgba(15,23,42,0.10)] ${sponsor.wrapper} ${
                          isDarkMode ? sponsor.surfaceDark : sponsor.surfaceLight
                        }`}
                      >
                        <img
                          src={sponsor.src}
                          alt={sponsor.name}
                          className={sponsor.image}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <style jsx global>{`
            @keyframes sponsor-marquee-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }

            .sponsor-marquee-track {
              animation: sponsor-marquee-scroll 24s linear infinite;
              will-change: transform;
            }

            .sponsor-marquee-track:hover {
              animation-play-state: paused;
            }
          `}</style>

        </Tabs>
      </div>
    </div>
  );
}

