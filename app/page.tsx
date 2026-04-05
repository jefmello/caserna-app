"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import RankingShell from "@/components/ranking/ranking-shell";
import RankingHeader from "@/components/ranking/ranking-header";
import RankingSpotlight from "@/components/ranking/ranking-spotlight";
import RankingTabs from "@/components/ranking/ranking-tabs";
import RankingSearchCard from "@/components/ranking/ranking-search-card";
import RankingClassificationSection from "@/components/ranking/ranking-classification-section";
import RankingClassificationShareCard from "@/components/ranking/ranking-classification-share-card";
import RankingTitleFightCard from "@/components/ranking/ranking-title-fight-card";
import RankingStatsHeader from "@/components/ranking/ranking-stats-header";
import RankingStatsSummaryGrid from "@/components/ranking/ranking-stats-summary-grid";
import RankingStatsRadarCard from "@/components/ranking/ranking-stats-radar-card";
import RankingStatsTopPointsChartCard from "@/components/ranking/ranking-stats-top-points-chart-card";
import RankingStatsMetricCardsGrid from "@/components/ranking/ranking-stats-metric-cards-grid";
import RankingPilotEmptyState from "@/components/ranking/ranking-pilot-empty-state";
import RankingPilotHeroCard from "@/components/ranking/ranking-pilot-hero-card";
import RankingPilotComparisonCard from "@/components/ranking/ranking-pilot-comparison-card";
import RankingPilotPerformanceBlocksCard from "@/components/ranking/ranking-pilot-performance-blocks-card";
import RankingPilotDuelCard from "@/components/ranking/ranking-pilot-duel-card";
import useRankingData from "@/lib/hooks/useRankingData";
import usePilotComparison from "@/lib/hooks/usePilotComparison";
import {
  categoryColors,
  competitionLabels,
  sponsorLogos,
  sortRanking,
  normalizePilotName,
  getPilotNameParts,
  getPilotFirstAndLastName,
  getPilotWarName,
  getPilotWarNameDisplay,
  getPilotHighlightName,
  getPilotPhotoPath,
  getTop6RowStyles,
  getTopMetricRanking,
  getTopPointsChartData,
  getCategoryTheme,
  getGapToLeader,
  getPilotPositionInList,
  getPilotTrendStatus,
  getTrendVisual,
  getPerformancePercentage,
  getSelectedPilotBestAttribute,
  getPilotConsistencyLabel,
  getPilotMomentumLabel,
  getPilotEfficiency,
  getTitleFightStatus,
  getSpotlightCategoryStyles,
  getComparisonWinner,
  getComparisonCardTone,
  getDuelWinnerLabel,
  getDuelNarrative,
  getDuelProfileLabel,
  type PilotTrendStatus,
} from "@/lib/ranking/ranking-utils";
import type {
  RankingByCompetition,
  RankingCompetitionMeta,
  RankingData,
  RankingItem,
  RankingMetaData,
  RankingMetaPilot,
} from "@/types/ranking";
import Image from "next/image";
import * as htmlToImage from "html-to-image";
import {
  Trophy,
  Medal,
  Timer,
  Flag,
  Users,
  User,
  BarChart3,
  Search,
  Crown,
  Gauge,
  ArrowLeft,
  Camera,
  Star,
  TableProperties,
  Swords,
  ChevronRight,
  Moon,
  Sun,
  Share2,
  TrendingUp,
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


type CategoryThemeLike = ReturnType<typeof getCategoryTheme>;

function resolveCategoryTheme(categoryTheme: unknown): CategoryThemeLike {
  if (categoryTheme && typeof categoryTheme === "object") {
    return categoryTheme as CategoryThemeLike;
  }

  return getCategoryTheme("Base");
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
  categoryTheme: unknown;
}) {
  const resolvedCategoryTheme = resolveCategoryTheme(categoryTheme);

  return (
    <Card
      className={`rounded-[18px] border shadow-none ${
        isDark
          ? accent
            ? `${resolvedCategoryTheme.darkAccentBorder} ${resolvedCategoryTheme.darkAccentBgSoft}`
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
                  ? resolvedCategoryTheme.darkAccentIconWrap
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
                    ? resolvedCategoryTheme.darkAccentText
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
  categoryTheme: unknown;
}) {
  const resolvedCategoryTheme = resolveCategoryTheme(categoryTheme);
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
            ? `${resolvedCategoryTheme.darkAccentBorder} bg-gradient-to-b ${resolvedCategoryTheme.darkAccentCard}`
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
                  ? resolvedCategoryTheme.darkAccentText
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
                  ? resolvedCategoryTheme.darkAccentIconWrap
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
                    ? resolvedCategoryTheme.darkAccentText
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
                ? resolvedCategoryTheme.darkAccentDivider
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
  pilot?: unknown;
  alt: string;
  isDark?: boolean;
}) {
  const pilotoId =
    pilot && typeof pilot === "object" && "pilotoId" in pilot
      ? (pilot as { pilotoId?: string | null }).pilotoId
      : null;

  const src = pilotoId ? `/pilotos/${pilotoId}.jpg` : null;
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
            className="absolute inset-0 h-full w-full scale-[1.18] object-cover object-center opacity-24 blur-2xl"
            onError={() => setHasError(true)}
          />
          <div className={`absolute inset-0 ${isDark ? "bg-slate-950/18" : "bg-white/8"}`} />
          <img
            src={src}
            alt={alt}
            className="relative z-[1] h-full w-full object-contain object-center"
            onError={() => setHasError(true)}
          />
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
            <p
              className={`mt-1 text-[10px] font-medium ${
                isDark ? "text-zinc-500" : "text-zinc-500"
              }`}
            >
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







export default function CasernaKartAppModerno() {
  const {
    rankingData,
    rankingMeta,
    categories,
    loading,
    error,
    retry,
  } = useRankingData();

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
    if (categories.length === 0) return;

    setCategory((prev) => (categories.includes(prev) ? prev : categories[0]));
  }, [categories]);

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

  const {
    comparePilotA,
    comparePilotB,
    duelMetrics,
    duelSummary,
    duelIntensity,
    duelWinnerPilot,
  } = usePilotComparison({
    comparePilotAId,
    comparePilotBId,
    filteredRanking,
    isDarkMode,
  });

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

  function handleRetry() {
    retry();
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

  const getSpotlightPilotWarName = (pilot: unknown) => {
    if (!pilot || typeof pilot !== "object") return "";
    return getPilotWarName(pilot as RankingItem | null | undefined);
  };

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
            <button
              onClick={handleRetry}
              className={`mt-5 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isDarkMode
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
              }`}
            >
              Tentar novamente
            </button>

            <p
              className={`mt-4 text-sm ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Ou abra <strong>/api/ranking</strong> no navegador para testar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RankingShell>
      <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
        isDarkMode ? "bg-[#0b1220] text-white" : "bg-[#f3f4f6] text-zinc-950"
      }`}
    >
      <div className="mx-auto max-w-md px-2.5 pb-32 pt-1.5">
        <RankingHeader
          isDarkMode={isDarkMode}
          theme={theme}
          categories={categories}
          category={category}
          setCategory={setCategory}
          availableCompetitions={availableCompetitions}
          competition={competition}
          setCompetition={setCompetition}
          competitionLabels={competitionLabels}
          toggleDarkMode={toggleDarkMode}
        />

        <RankingSpotlight
          isDarkMode={isDarkMode}
          theme={theme}
          spotlightStyles={spotlightStyles}
          leader={leader}
          leaderName={leaderName}
          PilotPhotoSlot={PilotPhotoSlot}
          getPilotHighlightName={getPilotHighlightName}
          getPilotWarName={getSpotlightPilotWarName}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3">
          <RankingTabs
            activeTab={activeTab}
            category={category}
            isDarkMode={isDarkMode}
          />

          <TabsContent value="classificacao" className="mt-0 space-y-3 pt-0.5">
            <RankingSearchCard
              isDarkMode={isDarkMode}
              theme={theme}
              competition={competition}
              competitionLabels={competitionLabels}
              search={search}
              onSearchChange={setSearch}
            />

            <RankingClassificationSection>
            <RankingClassificationShareCard
              isDarkMode={isDarkMode}
              theme={theme}
              isSharingImage={isSharingImage}
              filteredRankingLength={filteredRanking.length}
              onShare={handleShareClassification}
            />

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

            <RankingTitleFightCard
              isDarkMode={isDarkMode}
              theme={theme}
              titleFightStatus={titleFightStatus}
              top3TitleFight={top3TitleFight}
              category={category}
              handleSelectPilot={handleSelectPilot}
              getGapToLeader={getGapToLeader}
              getPilotFirstAndLastName={getPilotFirstAndLastName}
              getPilotWarNameDisplay={getPilotWarNameDisplay}
            />
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
            </RankingClassificationSection>
          </TabsContent>

          <TabsContent value="piloto" className="mt-0 space-y-4 pt-0">
            {!selectedPilot ? (
              <RankingPilotEmptyState
                isDarkMode={isDarkMode}
                theme={theme}
                UserIcon={User}
              />
            ) : (
              <div className="space-y-3">
                <RankingPilotHeroCard
                  isDarkMode={isDarkMode}
                  theme={theme}
                  category={category}
                  categoryColors={categoryColors}
                  competition={competition}
                  competitionLabels={competitionLabels}
                  handleBackToRanking={handleBackToRanking}
                  handleSharePilotCard={handleSharePilotCard}
                  isSharingPilotImage={isSharingPilotImage}
                  selectedPilot={selectedPilot}
                  selectedPilotShortName={selectedPilotShortName}
                  selectedPilotWarName={selectedPilotWarName}
                  safeSelectedPilot={safeSelectedPilot}
                  selectedPilotGap={selectedPilotGap}
                  selectedPilotAverage={selectedPilotAverage}
                  selectedPilotConsistency={selectedPilotConsistency}
                  selectedPilotMomentum={selectedPilotMomentum}
                  selectedPilotBestAttribute={selectedPilotBestAttribute}
                  PilotPhotoSlot={PilotPhotoSlot}
                />

                <RankingPilotComparisonCard
                  isDarkMode={isDarkMode}
                  theme={theme}
                  selectedPilotLeaderGapValue={selectedPilotLeaderGapValue}
                  selectedPilotVsLeader={selectedPilotVsLeader}
                  selectedPilotGap={selectedPilotGap}
                  selectedPilotWinRate={selectedPilotWinRate}
                  selectedPilotWinRateLabel={selectedPilotWinRateLabel}
                  selectedPilotPodiumRate={selectedPilotPodiumRate}
                  selectedPilotPodiumRateLabel={selectedPilotPodiumRateLabel}
                  selectedPilotDiscipline={selectedPilotDiscipline}
                  selectedPilotDisciplineLabel={selectedPilotDisciplineLabel}
                  safeSelectedPilot={safeSelectedPilot}
                  TrophyIcon={Trophy}
                  CrownIcon={Crown}
                  MedalIcon={Medal}
                  GaugeIcon={Gauge}
                />

                <RankingPilotPerformanceBlocksCard
                  isDarkMode={isDarkMode}
                  theme={theme}
                  safeSelectedPilot={safeSelectedPilot}
                  selectedPilotAverage={selectedPilotAverage}
                  selectedPilotGap={selectedPilotGap}
                  selectedPilotLeaderGapValue={selectedPilotLeaderGapValue}
                  SwordsIcon={Swords}
                  BarChart3Icon={BarChart3}
                  TablePropertiesIcon={TableProperties}
                />

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

      {!comparePilotAId || !comparePilotBId ? (
        <div
          className={`rounded-[22px] px-4 py-8 text-center text-sm ${
            isDarkMode
              ? "border border-dashed border-white/10 bg-[#0f172a] text-zinc-400"
              : "border border-dashed border-black/10 bg-zinc-50 text-zinc-500"
          }`}
        >
          Selecione dois pilotos da categoria atual para liberar o comparativo 1x1.
        </div>
      ) : comparePilotAId && comparePilotAId === comparePilotBId ? (
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
        <RankingPilotDuelCard
          pilotA={comparePilotA}
          pilotB={comparePilotB}
          isDarkMode={isDarkMode}
          category={category}
        />
      )}
    </CardContent>
  </Card>
</TabsContent>

          <TabsContent value="stats" className="mt-0 space-y-4 pt-0">
            <RankingStatsHeader
              isDarkMode={isDarkMode}
              theme={theme}
              category={category}
              competition={competition}
              competitionLabels={competitionLabels}
            />

            <RankingStatsSummaryGrid
              statsSummary={statsSummary}
              theme={theme}
              isDarkMode={isDarkMode}
              CompactStatCard={CompactStatCard}
              UsersIcon={Users}
              CrownIcon={Crown}
              GaugeIcon={Gauge}
              MedalIcon={Medal}
            />

            <RankingStatsRadarCard
              statsRadar={statsRadar}
              statsSummary={statsSummary}
              bestEfficiencyPilot={bestEfficiencyPilot}
              theme={theme}
              category={category}
              isDarkMode={isDarkMode}
              HighlightCard={HighlightCard}
              StarIcon={Star}
              getPilotFirstAndLastName={getPilotFirstAndLastName}
            />

            <RankingStatsTopPointsChartCard
              topPointsChartData={topPointsChartData}
              theme={theme}
              isDarkMode={isDarkMode}
              BarChart3Icon={BarChart3}
              ResponsiveContainerComponent={ResponsiveContainer}
              CartesianGridComponent={CartesianGrid}
              XAxisComponent={XAxis}
              YAxisComponent={YAxis}
              TooltipComponent={Tooltip}
              BarChartComponent={BarChart}
              BarComponent={Bar}
            />

            <RankingStatsMetricCardsGrid
              StatRankingCardComponent={StatRankingCard}
              topVitorias={topVitorias}
              topPoles={topPoles}
              topMv={topMv}
              topPodios={topPodios}
              theme={theme}
              isDarkMode={isDarkMode}
              TrophyIcon={Trophy}
              FlagIcon={Flag}
              TimerIcon={Timer}
              MedalIcon={Medal}
            />
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
                        <h2 className="mt-2 text-[40px] font-extrabold leading-none tracking-tight">
                          {selectedPilotShortName || "Piloto"}
                        </h2>
                        <p className={`mt-3 text-[20px] font-semibold ${
                          isDarkMode ? "text-zinc-300" : "text-zinc-700"
                        }`}>
                          {category} · {competitionLabels[competition] || competition}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div
                        className={`rounded-full border px-5 py-2 text-[16px] font-bold uppercase tracking-[0.14em] ${
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

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5">
                          <div className={`rounded-[22px] border px-4 py-4 backdrop-blur-md ${
                            isDarkMode ? "border-white/10 bg-black/30" : "border-white/70 bg-white/78"
                          }`}>
                            <p className={`text-[24px] font-extrabold leading-none tracking-tight ${
                              isDarkMode ? "text-white" : "text-zinc-950"
                            }`}>
                              {selectedPilotShortName || "Piloto"}
                            </p>
                            {selectedPilotWarName ? (
                              <p className={`mt-2 text-[15px] font-semibold italic ${
                                isDarkMode ? "text-zinc-300" : "text-zinc-600"
                              }`}>
                                {selectedPilotWarName}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>

                      <div className={`rounded-[24px] border px-4 py-4 ${
                        isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white/90"
                      }`}>
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                            isDarkMode ? "text-zinc-500" : "text-zinc-400"
                          }`}>
                            Patrocinadores oficiais
                          </p>
                          <div className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${
                            isDarkMode ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}` : theme.heroChip
                          }`}>
                            parceiros
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {sponsorLogos.map((sponsor) => (
                            <div
                              key={`pilot-share-sponsor-${sponsor.name}`}
                              className={`flex h-[74px] items-center justify-center overflow-hidden rounded-[18px] border shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${sponsor.wrapper} ${
                                isDarkMode ? sponsor.surfaceDark : sponsor.surfaceLight
                              }`}
                            >
                              <img
                                src={sponsor.src}
                                alt={sponsor.name}
                                className={sponsor.shareImage}
                              />
                            </div>
                          ))}
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
                          { label: "Poles", value: selectedPilot?.poles || 0, icon: Flag },
                          { label: "VMR", value: selectedPilot?.mv || 0, icon: Timer },
                          { label: "Participações", value: selectedPilot?.participacoes || 0, icon: Users },
                          { label: "Descarte", value: selectedPilot?.descarte || 0, icon: Gauge },
                        ].map((item) => {
                          const Icon = item.icon;
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
                              <p className={`mt-4 text-[28px] font-extrabold leading-none tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                                {item.value}
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
    </RankingShell>
  );
}
