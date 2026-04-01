"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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
        row: "border-l-[4px] border-l-yellow-500 bg-gradient-to-r from-yellow-100 via-yellow-50 to-white shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]",
        badge: "bg-yellow-400 text-black",
        points: "text-yellow-700",
        name: "text-zinc-950",
        chip: "border-yellow-300 bg-yellow-100 text-yellow-800",
      };
    case 2:
      return {
        row: "border-l-[4px] border-l-zinc-400 bg-gradient-to-r from-zinc-100 via-zinc-50 to-white",
        badge: "bg-zinc-300 text-zinc-900",
        points: "text-zinc-800",
        name: "text-zinc-950",
        chip: "border-zinc-300 bg-white text-zinc-700",
      };
    case 3:
      return {
        row: "border-l-[4px] border-l-amber-700 bg-gradient-to-r from-amber-50 via-amber-50/80 to-white",
        badge: "bg-amber-600 text-white",
        points: "text-amber-800",
        name: "text-zinc-950",
        chip: "border-amber-200 bg-white text-amber-800",
      };
    case 4:
      return {
        row: "border-l-[4px] border-l-sky-500 bg-gradient-to-r from-sky-50 via-sky-50/70 to-white",
        badge: "bg-sky-500 text-white",
        points: "text-sky-700",
        name: "text-zinc-950",
        chip: "border-sky-200 bg-white text-sky-800",
      };
    case 5:
      return {
        row: "border-l-[4px] border-l-violet-500 bg-gradient-to-r from-violet-50 via-violet-50/70 to-white",
        badge: "bg-violet-500 text-white",
        points: "text-violet-700",
        name: "text-zinc-950",
        chip: "border-violet-200 bg-white text-violet-800",
      };
    case 6:
      return {
        row: "border-l-[4px] border-l-emerald-500 bg-gradient-to-r from-emerald-50 via-emerald-50/70 to-white",
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
        "bg-gradient-to-r from-orange-500/12 via-[#161e2b] to-[#111827] border-l-[4px] border-l-orange-400",
      darkSecondRow:
        "bg-gradient-to-r from-white/5 via-[#111827] to-[#111827] border-l-[4px] border-l-zinc-400",
      darkThirdRow:
        "bg-gradient-to-r from-amber-500/10 via-[#111827] to-[#111827] border-l-[4px] border-l-amber-500",
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
        "bg-gradient-to-r from-white/5 via-[#111827] to-[#111827] border-l-[4px] border-l-zinc-400",
      darkThirdRow:
        "bg-gradient-to-r from-amber-500/10 via-[#111827] to-[#111827] border-l-[4px] border-l-amber-500",
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
        "bg-gradient-to-r from-white/5 via-[#111827] to-[#111827] border-l-[4px] border-l-zinc-400",
      darkThirdRow:
        "bg-gradient-to-r from-amber-500/10 via-[#111827] to-[#111827] border-l-[4px] border-l-amber-500",
      darkTopBadge: "bg-yellow-400 text-black",
      darkChartBar: "#facc15",
    },
  };

  return themes[category as keyof typeof themes] || themes.Elite;
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
      className={`rounded-[20px] border shadow-none ${
        isDark
          ? accent
            ? `${categoryTheme.darkAccentBorder} ${categoryTheme.darkAccentBgSoft}`
            : "border-white/10 bg-[#111827]"
          : accent
            ? "border-yellow-300/80 bg-yellow-50/70"
            : "border-black/5 bg-white"
      }`}
    >
      <CardContent className="p-3.5">
        <div className="mb-2 flex items-center justify-between gap-2">
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
          className={`mt-1.5 text-xs leading-snug ${
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
        compact ? "h-[156px]" : "h-[182px]"
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
        className={`flex h-full flex-col ${
          compact ? "px-3 pb-3 pt-2" : "px-4 pb-4 pt-2"
        }`}
      >
        <div className="mb-1 flex items-start justify-between gap-2">
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
    <div className={`h-full w-full ${isDark ? "bg-[#0f172a]" : "bg-zinc-50"}`}>
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
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
            <p className={`mt-1 text-[10px] font-medium ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
              piloto 1:1
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
      className={`overflow-hidden rounded-[24px] shadow-sm ${
        isDark ? "border-white/10 bg-[#111827]" : "border-black/5 bg-white"
      }`}
    >
      <CardHeader
        className={`pb-3 ${
          isDark
            ? `border-b border-white/10 bg-gradient-to-r from-[#111827] via-[#161e2b] to-[#111827]`
            : "border-b border-black/5 bg-gradient-to-r from-white via-zinc-50/70 to-white"
        }`}
      >
        <CardTitle
          className={`flex items-center gap-2 text-sm font-bold ${
            isDark ? "text-white" : "text-zinc-950"
          }`}
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-2xl ${
              isDark ? theme.darkAccentIconWrap : theme.statsIconWrap
            }`}
          >
            <Icon className={`h-4 w-4 ${isDark ? theme.darkAccentText : theme.statsIcon}`} />
          </div>
          <div>
            <p
              className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                isDark ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Ranking estatístico
            </p>
            <p
              className={`text-[15px] font-extrabold tracking-tight ${
                isDark ? "text-white" : "text-zinc-950"
              }`}
            >
              {title}
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        {items.length === 0 ? (
          <div
            className={`rounded-2xl px-4 py-6 text-center text-sm ${
              isDark
                ? "border border-dashed border-white/10 bg-[#0f172a] text-zinc-400"
                : "border border-dashed border-black/10 bg-zinc-50 text-zinc-500"
            }`}
          >
            {emptyLabel}
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map((item, index) => {
              const value = item[metricKey];
              const isFirst = index === 0;

              return (
                <div
                  key={`${title}-${item.pilotoId}-${index}`}
                  className={`flex items-center justify-between gap-3 rounded-[20px] border px-3 py-3 ${
                    isDark
                      ? isFirst
                        ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}`
                        : "border-white/10 bg-[#0f172a]"
                      : isFirst
                        ? `${theme.statAccentBg}`
                        : "border-black/5 bg-zinc-50/70"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-xs font-extrabold ${
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

export default function CasernaKartAppModerno() {
  const [rankingData, setRankingData] = useState<RankingData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("Base");
  const [competition, setCompetition] = useState("T1");
  const [search, setSearch] = useState("");
  const [selectedPilot, setSelectedPilot] = useState<RankingItem | null>(null);
  const [activeTab, setActiveTab] = useState("classificacao");
  const [isDarkMode, setIsDarkMode] = useState(false);

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
  }, [category, competition]);

  const currentCompetitionList = useMemo(() => {
    return rankingData[category]?.[competition] || [];
  }, [rankingData, category, competition]);

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

  const selectedPilotShortName = useMemo(
    () => getPilotFirstAndLastName(selectedPilot?.piloto),
    [selectedPilot]
  );

  const selectedPilotWarName = useMemo(
    () => getPilotWarNameDisplay(selectedPilot),
    [selectedPilot]
  );

  const top3TitleFight = useMemo(() => filteredRanking.slice(0, 3), [filteredRanking]);

  const titleFightStatus = useMemo(
    () => getTitleFightStatus(top3TitleFight),
    [top3TitleFight]
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

  function handleSelectPilot(pilot: RankingItem) {
    setSelectedPilot(pilot);
    setActiveTab("piloto");
  }

  function handleBackToRanking() {
    setActiveTab("classificacao");
  }

  function toggleDarkMode() {
    setIsDarkMode((prev) => !prev);
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
            <p className={`mt-2 text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
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
            <p className={`mt-2 ${isDarkMode ? "text-zinc-300" : "text-zinc-600"}`}>
              {error}
            </p>
            <p className={`mt-4 text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
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
      <div className="mx-auto max-w-md px-3 pb-20 pt-2">
        <header
          className={`sticky top-0 z-20 mb-2 overflow-hidden rounded-[22px] shadow-[0_10px_25px_rgba(15,23,42,0.06)] ${
            isDarkMode
              ? "border border-white/10 bg-[#111827]"
              : "border border-black/5 bg-white"
          }`}
        >
          <div
            className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent ${theme.primaryRing} to-transparent`}
          />

          <div className="space-y-1.5 px-2.5 pb-2 pt-2.5">
            <div
              className={`overflow-hidden rounded-[15px] ${
                isDarkMode ? "border border-white/10 bg-[#0f172a]" : "border border-black/5 bg-zinc-50"
              }`}
            >
              <div className="relative h-[68px] w-full sm:h-[76px] md:h-[84px]">
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

            <div className="grid grid-cols-1 gap-1.5">
              <div
                className={`rounded-[15px] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] ${
                  isDarkMode
                    ? "border border-white/10 bg-gradient-to-b from-[#111827] to-[#0f172a]"
                    : "border border-black/5 bg-gradient-to-b from-zinc-50 to-white"
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <p className={`text-[8px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-400" : "text-zinc-400"}`}>
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

                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
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
                          className={`whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-semibold transition-all duration-200 ${
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
                    aria-label={isDarkMode ? "Ativar modo diurno" : "Ativar modo noturno"}
                    title={isDarkMode ? "Ativar modo diurno" : "Ativar modo noturno"}
                  >
                    {isDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              <div
                className={`rounded-[15px] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] ${
                  isDarkMode
                    ? "border border-white/10 bg-gradient-to-b from-[#111827] to-[#0f172a]"
                    : "border border-black/5 bg-gradient-to-b from-zinc-50 to-white"
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <p className={`text-[8px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-400" : "text-zinc-400"}`}>
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
                  <Trophy className={`h-5.5 w-5.5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
                </div>

                <div className="flex flex-col justify-center">
                  <p className={`text-[18px] font-extrabold uppercase tracking-[0.14em] leading-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                    PILOTO DESTAQUE
                  </p>
                  <p className={`mt-1 whitespace-nowrap text-[8.5px] font-semibold uppercase tracking-[0.08em] sm:text-[9px] ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-500"
                  }`}>
                    LÍDER DA CATEGORIA E CAMPEONATO SELECIONADO
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <HighlightCard
              title="Líder"
              icon={Crown}
              accent
              compact
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
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex min-h-[62px] flex-col items-center justify-center">
                  <p className={`text-[24px] font-extrabold leading-none tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                    {leaderName.firstName.toUpperCase()}
                  </p>
                  <p className={`mt-1 text-[16px] font-semibold leading-none tracking-tight ${isDarkMode ? "text-zinc-200" : "text-zinc-800"}`}>
                    {leaderName.lastName ? leaderName.lastName.toUpperCase() : ""}
                  </p>
                </div>

                <div
                  className={`mt-2 inline-flex rounded-full border px-2.5 py-1 ${
                    isDarkMode
                      ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                      : theme.heroChip
                  }`}
                >
                  <p className="text-[11px] font-bold">{leader?.pontos || 0} pontos</p>
                </div>
              </div>
            </HighlightCard>

            <HighlightCard
              title="Vitórias"
              icon={Medal}
              compact
              isDark={isDarkMode}
              categoryTheme={theme}
            >
              <div className="flex h-full flex-col items-center justify-center text-center">
                <p className={`text-[36px] font-extrabold leading-none tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                  {leader?.vitorias || 0}
                </p>
                <p className={`mt-2 max-w-[110px] text-[11px] leading-snug ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                  vitórias nesta classificação
                </p>
              </div>
            </HighlightCard>

            <Card
              className={`h-[156px] overflow-hidden rounded-[22px] shadow-none ${
                isDarkMode ? "border border-white/10 bg-[#111827]" : "border border-black/5"
              }`}
            >
              <CardContent className="h-full p-0">
                <div className="relative h-full w-full overflow-hidden">
                  <PilotPhotoSlot
                    pilot={leader}
                    alt={getPilotHighlightName(leader?.piloto)}
                    isDark={isDarkMode}
                  />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/55 to-transparent" />

                  <div className="absolute inset-x-0 bottom-2 px-3 text-center">
                    <p className="truncate text-[10px] font-bold uppercase tracking-[0.10em] text-white">
                      {getPilotHighlightName(leader?.piloto)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <HighlightCard
              title="Pódios"
              icon={Medal}
              compact
              isDark={isDarkMode}
              categoryTheme={theme}
            >
              <div className="flex h-full flex-col items-center justify-center text-center">
                <p className={`text-[36px] font-extrabold leading-none tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                  {leader?.podios || 0}
                </p>
                <p className={`mt-2 max-w-[110px] text-[11px] leading-snug ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                  pódios nesta classificação
                </p>
              </div>
            </HighlightCard>
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="relative z-10 mb-5 grid h-auto w-full grid-cols-3 gap-2 bg-transparent p-0 shadow-none">
            <TabsTrigger
              value="classificacao"
              className={`h-[62px] rounded-[18px] px-2 py-0 shadow-sm transition-all duration-200 ${
                isDarkMode
                  ? `border border-white/10 bg-[#111827] text-zinc-400 data-[state=active]:bg-[#161e2b] data-[state=active]:text-white data-[state=active]:shadow-[0_6px_14px_rgba(0,0,0,0.35)]`
                  : "border border-zinc-200 bg-white text-zinc-500 data-[state=active]:border-yellow-300 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-[0_6px_14px_rgba(15,23,42,0.06)]"
              }`}
            >
              <div className="flex h-full flex-col items-center justify-center gap-0.5">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-xl ${
                    isDarkMode ? "bg-white/5 text-zinc-300" : "bg-zinc-50 text-zinc-500"
                  }`}
                >
                  <TableProperties className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
                  Classificação
                </span>
              </div>
            </TabsTrigger>

            <TabsTrigger
              value="piloto"
              className={`h-[62px] rounded-[18px] px-2 py-0 shadow-sm transition-all duration-200 ${
                isDarkMode
                  ? `border border-white/10 bg-[#111827] text-zinc-400 data-[state=active]:bg-[#161e2b] data-[state=active]:text-white data-[state=active]:shadow-[0_6px_14px_rgba(0,0,0,0.35)]`
                  : "border border-zinc-200 bg-white text-zinc-500 data-[state=active]:border-yellow-300 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-[0_6px_14px_rgba(15,23,42,0.06)]"
              }`}
            >
              <div className="flex h-full flex-col items-center justify-center gap-0.5">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-xl ${
                    isDarkMode ? "bg-white/5 text-zinc-300" : "bg-zinc-50 text-zinc-500"
                  }`}
                >
                  <User className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
                  Piloto
                </span>
              </div>
            </TabsTrigger>

            <TabsTrigger
              value="stats"
              className={`h-[62px] rounded-[18px] px-2 py-0 shadow-sm transition-all duration-200 ${
                isDarkMode
                  ? `border border-white/10 bg-[#111827] text-zinc-400 data-[state=active]:bg-[#161e2b] data-[state=active]:text-white data-[state=active]:shadow-[0_6px_14px_rgba(0,0,0,0.35)]`
                  : "border border-zinc-200 bg-white text-zinc-500 data-[state=active]:border-yellow-300 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-[0_6px_14px_rgba(15,23,42,0.06)]"
              }`}
            >
              <div className="flex h-full flex-col items-center justify-center gap-0.5">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-xl ${
                    isDarkMode ? "bg-white/5 text-zinc-300" : "bg-zinc-50 text-zinc-500"
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
                  Stats
                </span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classificacao" className="mt-0 space-y-4 pt-0">
            <Card
              className={`rounded-[22px] shadow-sm ${
                isDarkMode
                  ? `border ${theme.darkAccentBorder} bg-[#111827]`
                  : `border ${theme.searchBorder} bg-gradient-to-br from-white via-white to-zinc-50/70`
              }`}
            >
              <CardContent className="p-3">
                <div className="mb-3 flex items-center gap-2.5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] ${
                      isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                    }`}
                  >
                    <Search className={`h-4.5 w-4.5 ${isDarkMode ? theme.darkAccentText : theme.searchIcon}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`text-[9px] font-bold uppercase tracking-[0.18em] ${isDarkMode ? "text-zinc-400" : "text-zinc-400"}`}>
                      Busca rápida
                    </p>
                    <p className={`mt-0.5 text-[12px] font-semibold leading-tight ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
                      Encontre um piloto na classificação
                    </p>
                  </div>

                  <div
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                        : theme.searchBadge
                    }`}
                  >
                    {competitionLabels[competition] || competition}
                  </div>
                </div>

                <div
                  className={`group flex items-center rounded-[18px] border px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.98)] transition ${
                    isDarkMode
                      ? `${theme.darkAccentBorder} bg-[#0f172a]`
                      : `border-black/5 bg-gradient-to-b from-white to-zinc-50 focus-within:ring-4 ${theme.searchGlow}`
                  }`}
                >
                  <div className="flex h-9 w-8 items-center justify-center">
                    <Search className={`h-4.5 w-4.5 shrink-0 ${isDarkMode ? "text-zinc-400" : "text-zinc-400"}`} />
                  </div>
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar piloto"
                    className={`h-11 border-0 bg-transparent pl-1 pr-0 text-[15px] shadow-none outline-none ring-0 focus-visible:ring-0 ${
                      isDarkMode
                        ? "text-white placeholder:text-zinc-500"
                        : "text-zinc-950 placeholder:text-zinc-400"
                    }`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card
              className={`overflow-hidden rounded-[24px] shadow-sm ${
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
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                          isDarkMode ? `${theme.darkAccentIconWrap} border ${theme.darkAccentBorder}` : theme.titleIconWrap
                        }`}
                      >
                        <Swords className={`h-5 w-5 ${isDarkMode ? theme.darkAccentText : theme.titleIcon}`} />
                      </div>

                      <div className="min-w-0">
                        <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                          Corrida pelo campeonato
                        </p>
                        <h2 className={`text-[17px] font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
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

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <p
                                        className={`min-w-0 flex-1 whitespace-nowrap font-extrabold leading-none tracking-tight ${
                                          isDarkMode ? "text-white" : "text-zinc-950"
                                        } ${nameSize}`}
                                      >
                                        {pilotName}
                                      </p>

                                      {isLeader ? (
                                        <span
                                          className={`shrink-0 inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ${
                                            isDarkMode
                                              ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                                              : theme.heroChip
                                          }`}
                                        >
                                          líder
                                        </span>
                                      ) : null}
                                    </div>

                                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                      {warName ? (
                                        <p className={`whitespace-nowrap text-[10px] italic ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
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
                                        className={`flex h-9 w-9 items-center justify-center rounded-2xl ${
                                          isDarkMode ? theme.darkAccentIconWrap : "bg-zinc-100"
                                        }`}
                                      >
                                        <ChevronRight className={`h-4 w-4 ${isDarkMode ? theme.darkAccentText : "text-zinc-500"}`} />
                                      </div>
                                    </div>
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
                className={`overflow-hidden rounded-[24px] shadow-sm ${
                  isDarkMode
                    ? `border ${theme.darkAccentBorder} bg-[#111827]`
                    : `border ${theme.titleBorder} bg-gradient-to-br ${theme.titleBg}`
                }`}
              >
                <div className="relative px-4 py-4">
                  <div
                    className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${theme.primaryRing} to-transparent`}
                  />

                  <div className="flex items-center justify-between gap-3">
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
                      <TableProperties className={`h-5 w-5 ${isDarkMode ? theme.darkAccentText : theme.titleIcon}`} />
                    </div>
                  </div>
                </div>
              </div>

              <Card
                className={`overflow-hidden rounded-[24px] shadow-sm ${
                  isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
                }`}
              >
                <CardContent className="p-0">
                  <div
                    className={`px-3 py-2.5 ${
                      isDarkMode
                        ? "border-b border-white/10 bg-gradient-to-r from-[#111827] via-[#161e2b] to-[#111827]"
                        : "border-b border-black/5 bg-gradient-to-r from-white via-zinc-50/70 to-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                            isDarkMode ? theme.darkAccentIconWrap : "bg-zinc-100"
                          }`}
                        >
                          <TableProperties className={`h-4 w-4 ${isDarkMode ? theme.darkAccentText : "text-zinc-600"}`} />
                        </div>
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                            Ranking oficial
                          </p>
                          <p className={`text-[13px] font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
                            {category} · {competitionLabels[competition] || competition}
                          </p>
                        </div>
                      </div>

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
                          <th className="whitespace-nowrap px-1 py-3 text-center">Pos</th>
                          <th className="whitespace-nowrap px-2 py-3 text-left">Piloto</th>
                          <th className="whitespace-nowrap px-0.5 py-3 text-center">Pts</th>
                          <th className="whitespace-nowrap px-0.5 py-3 text-center">Vit</th>
                          <th className="whitespace-nowrap px-0.5 py-3 text-center">Pol</th>
                          <th className="whitespace-nowrap px-0.5 py-3 text-center">VMR</th>
                          <th className="whitespace-nowrap px-0.5 py-3 text-center">PDS</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredRanking.map((item, index) => {
                          const nomeLinha1 = getPilotFirstAndLastName(item.piloto);
                          const nomeLinha2 = getPilotWarNameDisplay(item);
                          const isTop6 = index < 6;
                          const isLeader = index === 0;
                          const styles = getTop6RowStyles(index + 1);

                          const darkRow = isTop6
                            ? index === 0
                              ? theme.darkLeaderRow
                              : index === 1
                                ? theme.darkSecondRow
                                : index === 2
                                  ? theme.darkThirdRow
                                  : "bg-[#111827]"
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
                              <td className="px-1 py-3 text-center align-middle">
                                <button
                                  type="button"
                                  onClick={() => handleSelectPilot(item)}
                                  className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition active:scale-95"
                                >
                                  <span
                                    className={`relative flex h-8 w-8 items-center justify-center rounded-xl shadow-sm ${
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
                                      <Star className="absolute -right-1 -top-1 h-3.5 w-3.5 fill-yellow-300 text-yellow-500" />
                                    ) : null}
                                    {index + 1}
                                  </span>
                                </button>
                              </td>

                              <td className="min-w-0 px-2 py-3 align-middle">
                                <button
                                  type="button"
                                  onClick={() => handleSelectPilot(item)}
                                  className="block w-full text-left transition active:scale-[0.99]"
                                >
                                  <div className="min-w-0">
                                    <span
                                      className={`block whitespace-normal break-words text-[12.8px] font-extrabold leading-[1.15] tracking-tight ${
                                        isDarkMode ? "text-white" : styles.name
                                      }`}
                                    >
                                      {nomeLinha1}
                                    </span>

                                    {nomeLinha2 ? (
                                      <div className="mt-1 flex items-center gap-1.5">
                                        <span
                                          className={`inline-flex max-w-full whitespace-normal break-words rounded-full border px-2 py-0.5 text-[10px] font-semibold italic tracking-[0.02em] ${
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
                                className={`px-0.5 py-3 text-center align-middle text-[12px] font-extrabold ${
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

                              <td className={`px-0.5 py-3 text-center align-middle text-[12px] font-semibold ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                <button
                                  type="button"
                                  onClick={() => handleSelectPilot(item)}
                                  className="w-full transition active:scale-95"
                                >
                                  {item.vitorias}
                                </button>
                              </td>

                              <td className={`px-0.5 py-3 text-center align-middle text-[12px] font-semibold ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                <button
                                  type="button"
                                  onClick={() => handleSelectPilot(item)}
                                  className="w-full transition active:scale-95"
                                >
                                  {item.poles}
                                </button>
                              </td>

                              <td className={`px-0.5 py-3 text-center align-middle text-[12px] font-semibold ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                <button
                                  type="button"
                                  onClick={() => handleSelectPilot(item)}
                                  className="w-full transition active:scale-95"
                                >
                                  {item.mv}
                                </button>
                              </td>

                              <td className={`px-0.5 py-3 text-center align-middle text-[12px] font-semibold ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
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
                className={`rounded-[22px] shadow-sm ${
                  isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
                }`}
              >
                <CardContent className="p-8 text-center">
                  <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-3xl ${isDarkMode ? theme.darkAccentIconWrap : "bg-zinc-100"}`}>
                    <User className={`h-7 w-7 ${isDarkMode ? theme.darkAccentText : "text-zinc-500"}`} />
                  </div>
                  <p className={`mt-4 text-base font-semibold ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                    Nenhum piloto selecionado
                  </p>
                  <p className={`mt-2 text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                    Toque em um piloto na classificação para abrir o perfil.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                <Card
                  className={`overflow-hidden rounded-[24px] shadow-sm ${
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
                          className={`grid grid-cols-[124px_1fr] gap-3 rounded-[22px] p-3 shadow-[0_8px_24px_rgba(15,23,42,0.05)] ${
                            isDarkMode ? "border border-white/10 bg-[#0f172a]" : "border border-black/5 bg-white"
                          }`}
                        >
                          <div className={`overflow-hidden rounded-[20px] ${isDarkMode ? "border border-white/10" : "border border-black/5"}`}>
                            <div className="relative h-[180px] w-full">
                              <PilotPhotoSlot
                                pilot={selectedPilot}
                                alt={selectedPilotShortName}
                                isDark={isDarkMode}
                              />
                            </div>
                          </div>

                          <div className="min-w-0">
                            <div className="mb-3 flex items-start justify-between gap-2">
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

                              <div className="flex flex-col items-end gap-2">
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

                            <div className="min-w-0">
                              <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                Perfil do piloto
                              </p>

                              <h2 className={`mt-2 break-words text-[25px] font-extrabold leading-[1.05] tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
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

                              <div className="mt-4 flex flex-wrap gap-2">
                                <div
                                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${
                                    isDarkMode
                                      ? "border border-white/10 bg-white/5"
                                      : "border border-black/5 bg-zinc-50"
                                  }`}
                                >
                                  <Crown className={`h-3.5 w-3.5 ${isDarkMode ? theme.darkAccentText : "text-zinc-600"}`} />
                                  <span className={`text-[11px] font-semibold ${isDarkMode ? "text-zinc-200" : "text-zinc-700"}`}>
                                    {selectedPilot.pos}º colocado
                                  </span>
                                </div>

                                <div
                                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${
                                    isDarkMode
                                      ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                                      : theme.primaryBadge
                                  }`}
                                >
                                  <Trophy className="h-3.5 w-3.5" />
                                  <span className="text-[11px] font-semibold">
                                    {selectedPilot.pontos} pontos
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div
                              className={`mt-4 rounded-[20px] border p-3 ${
                                isDarkMode
                                  ? `${theme.darkAccentBorder} bg-gradient-to-r from-[#111827] to-[#161e2b]`
                                  : `${theme.heroBorder} bg-gradient-to-r ${theme.heroBg}`
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${isDarkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                                    Pontuação oficial
                                  </p>
                                  <p className={`mt-1 text-[30px] font-extrabold leading-none tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                    {selectedPilot.pontos}
                                    <span className={`ml-1 text-[16px] font-bold ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                                      pts
                                    </span>
                                  </p>
                                </div>

                                <div
                                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                                    isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                                  }`}
                                >
                                  <Trophy className={`h-5 w-5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-3">
                  <CompactStatCard
                    title="Posição"
                    value={selectedPilot.pos}
                    subtitle="na classificação"
                    icon={Crown}
                    accent
                    isDark={isDarkMode}
                    categoryTheme={theme}
                  />
                  <CompactStatCard
                    title="Vitórias"
                    value={selectedPilot.vitorias}
                    subtitle="até agora"
                    icon={Medal}
                    isDark={isDarkMode}
                    categoryTheme={theme}
                  />
                  <CompactStatCard
                    title="Poles"
                    value={selectedPilot.poles}
                    subtitle="qualify"
                    icon={Flag}
                    isDark={isDarkMode}
                    categoryTheme={theme}
                  />
                  <CompactStatCard
                    title="VMR"
                    value={selectedPilot.mv}
                    subtitle="voltas rápidas"
                    icon={Timer}
                    accent
                    isDark={isDarkMode}
                    categoryTheme={theme}
                  />
                  <CompactStatCard
                    title="Pódios"
                    value={selectedPilot.podios}
                    subtitle="na classificação"
                    icon={Medal}
                    isDark={isDarkMode}
                    categoryTheme={theme}
                  />
                  <CompactStatCard
                    title="Participações"
                    value={selectedPilot.participacoes}
                    subtitle="corridas válidas"
                    icon={Users}
                    isDark={isDarkMode}
                    categoryTheme={theme}
                  />
                  <CompactStatCard
                    title="ADV"
                    value={selectedPilot.adv}
                    subtitle="advertências"
                    icon={Gauge}
                    accent
                    isDark={isDarkMode}
                    categoryTheme={theme}
                  />
                  <CompactStatCard
                    title="Descarte"
                    value={selectedPilot.descarte}
                    subtitle="campeonato"
                    icon={Gauge}
                    isDark={isDarkMode}
                    categoryTheme={theme}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="mt-0 space-y-4 pt-0">
            <div
              className={`overflow-hidden rounded-[24px] shadow-sm ${
                isDarkMode
                  ? `border ${theme.darkAccentBorder} bg-[#111827]`
                  : `border ${theme.titleBorder} bg-gradient-to-br ${theme.statsSoft}`
              }`}
            >
              <div className="relative px-4 py-4">
                <div
                  className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${theme.primaryRing} to-transparent`}
                />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        isDarkMode ? theme.darkAccentIconWrap : theme.statsIconWrap
                      }`}
                    >
                      <BarChart3 className={`h-5 w-5 ${isDarkMode ? theme.darkAccentText : theme.statsIcon}`} />
                    </div>

                    <div className="min-w-0">
                      <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                        Central de estatísticas
                      </p>
                      <h2 className={`text-[17px] font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                        Stats da classificação
                      </h2>
                      <p className={`text-[11px] font-semibold ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
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
                    Top 5
                  </div>
                </div>
              </div>
            </div>

            <Card
              className={`overflow-hidden rounded-[24px] shadow-sm ${
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
                <CardTitle className={`flex items-center gap-3 ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                      isDarkMode ? theme.darkAccentIconWrap : theme.statsIconWrap
                    }`}
                  >
                    <BarChart3 className={`h-5 w-5 ${isDarkMode ? theme.darkAccentText : theme.statsIcon}`} />
                  </div>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                      Desempenho oficial
                    </p>
                    <p className={`text-[16px] font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
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
                        stroke={isDarkMode ? "rgba(255,255,255,0.08)" : theme.chartGrid}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}