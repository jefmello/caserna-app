"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Crown,
  Flag,
  Gauge,
  Medal,
  Star,
  Timer,
  Trophy,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RankingHeader from "@/components/ranking/ranking-header";
import RankingStatsHeader from "@/components/ranking/ranking-stats-header";
import RankingStatsSummaryGrid from "@/components/ranking/ranking-stats-summary-grid";
import RankingStatsRadarCard from "@/components/ranking/ranking-stats-radar-card";
import RankingStatsTopPointsChartCard from "@/components/ranking/ranking-stats-top-points-chart-card";
import RankingStatsMetricCardsGrid from "@/components/ranking/ranking-stats-metric-cards-grid";
import useRankingData from "@/lib/hooks/useRankingData";
import useRankingFilters from "@/lib/hooks/useRankingFilters";
import useRankingScreenController from "@/lib/hooks/useRankingScreenController";
import {
  competitionLabels,
  getCategoryTheme,
  getPilotFirstAndLastName,
} from "@/lib/ranking/ranking-utils";
import type { RankingItem, RankingMetaPilot } from "@/types/ranking";
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
      className={`rounded-[18px] border shadow-none transition-all duration-200 hover:-translate-y-[1px] ${
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
          className={`text-[22px] font-bold leading-none tracking-tight tabular-nums ${
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
      className={`rounded-[22px] border shadow-none transition-all duration-200 hover:-translate-y-[1px] ${
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

function StatRankingCard({
  title,
  icon: Icon,
  items,
  metricKey,
  emptyLabel,
  theme,
  isDark = false,
  onSelectPilot,
}: {
  title: string;
  icon: React.ElementType;
  items: RankingItem[];
  metricKey: "vitorias" | "poles" | "mv" | "podios";
  emptyLabel: string;
  theme: ReturnType<typeof getCategoryTheme>;
  isDark?: boolean;
  onSelectPilot: (pilot: RankingItem) => void;
}) {
  return (
    <Card
      className={`overflow-hidden rounded-[22px] shadow-sm transition-all duration-200 hover:-translate-y-[1px] ${
        isDark ? "border-white/10 bg-[#111827]" : "border-black/5 bg-white"
      }`}
    >
      <CardHeader
        className={`pb-2.5 ${
          isDark
            ? "border-b border-white/10 bg-gradient-to-r from-[#111827] via-[#161e2b] to-[#111827]"
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
              className={`text-[14px] font-extrabold tracking-[0.01em] ${
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
                <button
                  key={`${title}-${item.pilotoId}-${index}`}
                  type="button"
                  onClick={() => onSelectPilot(item)}
                  title="Abrir piloto"
                  className={`flex w-full items-center justify-between gap-2.5 rounded-[18px] border px-2.5 py-2.5 text-left transition-all duration-200 ${
                    isDark
                      ? isFirst
                        ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft} hover:brightness-110`
                        : "border-white/10 bg-[#0f172a] hover:border-white/20 hover:bg-[#162033]"
                      : isFirst
                        ? `${theme.statAccentBg} hover:brightness-[0.98]`
                        : "border-black/5 bg-zinc-50/70 hover:bg-white"
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
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getPilotWarNameDisplay(pilot?: RankingItem | null) {
  const raw = pilot?.piloto ?? "";
  const parts = raw.split(" - ");
  if (parts.length > 1) return parts.slice(1).join(" - ").trim();
  return "";
}

export default function EstatisticasPageContent() {
  const router = useRouter();

  const { rankingData, rankingMeta, categories, loading, error, retry } =
    useRankingData();

  const {
    category,
    setCategory,
    competition,
    setCompetition,
    availableCompetitions,
    filteredRanking,
    leader,
    currentCompetitionMeta,
  } = useRankingFilters({
    rankingData,
    rankingMeta,
    categories,
  });

  const [isDarkMode, setIsDarkMode] = React.useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("caserna-theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("caserna-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const {
    theme,
    topPointsChartData,
    topVitorias,
    topPoles,
    topMv,
    topPodios,
  } = useRankingScreenController({
    category,
    competition,
    isDarkMode,
    filteredRanking,
    rankingData,
    leader,
    currentCompetitionMeta,
  });

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
        ? Math.max(
            (filteredRanking[2]?.pontos || 0) - (filteredRanking[5]?.pontos || 0),
            0
          )
        : Math.max(
            (filteredRanking[0]?.pontos || 0) -
              (filteredRanking[filteredRanking.length - 1]?.pontos || 0),
            0
          );

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
    } else if (
      (hottestPilot?.poles || 0) >= 2 ||
      (hottestPilot?.mv || 0) >= 2
    ) {
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

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleRetry = () => {
    retry();
  };

  const handleSelectPilot = (pilot: RankingItem) => {
    const pilotId = pilot.pilotoId || "";
    router.push(pilotId ? `/pilotos?pilotId=${pilotId}` : "/pilotos");
  };

  const StatRankingCardConnected = (props: {
    title: string;
    icon: React.ElementType;
    items: RankingItem[];
    metricKey: "vitorias" | "poles" | "mv" | "podios";
    emptyLabel: string;
    theme: ReturnType<typeof getCategoryTheme>;
    isDark?: boolean;
  }) => {
    return <StatRankingCard {...props} onSelectPilot={handleSelectPilot} />;
  };

  if (loading) {
    return (
      <div
        className={`mt-4 rounded-[28px] border px-6 py-10 text-center ${
          isDarkMode
            ? "border-white/10 bg-[#111827] text-white"
            : "border-black/5 bg-white text-zinc-950"
        }`}
      >
        <p className="text-xl font-semibold tracking-tight">
          Carregando estatísticas...
        </p>
        <p
          className={`mt-2 text-sm ${
            isDarkMode ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          Preparando leitura analítica do campeonato
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`mt-4 rounded-[28px] border p-6 text-center ${
          isDarkMode
            ? "border-red-500/30 bg-[#111827] text-white"
            : "border-red-300 bg-white text-zinc-950"
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
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4 lg:space-y-5 xl:space-y-6">
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
        toggleDarkMode={handleToggleDarkMode}
      />

      <div className="space-y-4 xl:grid xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] xl:items-start xl:gap-5 xl:space-y-0">
        <div className="space-y-4">
          <RankingStatsHeader
            isDarkMode={isDarkMode}
            theme={theme}
            category={category}
            competition={competition}
            competitionLabels={competitionLabels}
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
        </div>

        <div className="space-y-4 xl:sticky xl:top-6">
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
        </div>
      </div>

      <div className="xl:pt-1">
        <RankingStatsMetricCardsGrid
          StatRankingCardComponent={StatRankingCardConnected}
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
      </div>
    </div>
  );
}