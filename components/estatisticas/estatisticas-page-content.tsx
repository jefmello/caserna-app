"use client";

import React, { useMemo } from "react";
import { BarChart3, Crown, Flag, Gauge, Medal, Star, Timer, Trophy, Users } from "lucide-react";
import SectionDivider from "@/components/ui/section-divider";
import RankingHeader from "@/components/ranking/ranking-header";
import RankingStatsHeader from "@/components/ranking/ranking-stats-header";
import RankingStatsSummaryGrid from "@/components/ranking/ranking-stats-summary-grid";
import RankingStatsRadarCard from "@/components/ranking/ranking-stats-radar-card";
import RankingStatsTopPointsChartCard from "@/components/ranking/ranking-stats-top-points-chart-card";
import RankingStatsMetricCardsGrid from "@/components/ranking/ranking-stats-metric-cards-grid";
import useRankingData from "@/lib/hooks/useRankingData";
import useRankingFilters from "@/lib/hooks/useRankingFilters";
import useRankingScreenController from "@/lib/hooks/useRankingScreenController";
import { useChampionship } from "@/context/championship-context";
import { competitionLabels, getPilotFirstAndLastName } from "@/lib/ranking/ranking-utils";
import type { RankingMetaPilot } from "@/types/ranking";
import PageTransition from "@/components/ui/page-transition";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top";
import Breadcrumb from "@/components/ui/breadcrumb";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import EmptyStateIllustration from "@/components/ui/empty-state-illustration";
import { LeaderHeroSkeleton, StatGridSkeleton } from "@/components/ui/shape-skeleton";
import {
  CompactStatCard,
  HighlightCard,
  StatRankingCardConnected,
} from "@/components/estatisticas/estatisticas-ui";
import ConsistencyHeatmap, { type HeatmapPilotRow } from "@/components/ui/consistency-heatmap";

export default function EstatisticasPageContent() {
  const { categoria, campeonato } = useChampionship();

  const { rankingData, rankingMeta, categories, loading, error, retry } = useRankingData({
    categoria,
    campeonato,
  });

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

  const { isDarkMode, toggleTheme } = useChampionship();

  const { theme, topPointsChartData, topVitorias, topPoles, topMv, topPodios } =
    useRankingScreenController({
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

    const totalVictories = filteredRanking.reduce((sum, item) => sum + item.vitorias, 0);
    const totalPodiums = filteredRanking.reduce((sum, item) => sum + item.podios, 0);

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

    const hottestPilot = filteredRanking.reduce((best, item) => {
      const itemScore = item.vitorias * 4 + item.poles * 2 + item.mv * 2 + item.podios;
      const bestScore = best.vitorias * 4 + best.poles * 2 + best.mv * 2 + best.podios;
      if (itemScore > bestScore) return item;
      if (itemScore === bestScore && item.pontos > best.pontos) return item;
      return best;
    }, filteredRanking[0]);

    const podiumPressure =
      filteredRanking.length >= 6
        ? Math.max((filteredRanking[2]?.pontos || 0) - (filteredRanking[5]?.pontos || 0), 0)
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

    return eligible.reduce((best, item) => {
      const itemEff = item.pontos / item.participacoes;
      const bestEff = best.pontos / best.participacoes;
      if (itemEff > bestEff) return item;
      if (itemEff === bestEff && item.pontos > best.pontos) return item;
      return best;
    }, eligible[0]);
  }, [filteredRanking, currentCompetitionMeta]);

  const handleToggleDarkMode = toggleTheme;

  const handleRetry = () => {
    retry();
  };

  /**
   * Heatmap preview — stage-by-stage points are not in the current CSV, so we
   * approximate using each pilot's totals: vitórias/poles/podios flags boost
   * selected "high" stages, and the remaining points are spread across the
   * remaining ones. Purely directional; flagged as "preview" in the UI.
   */
  const heatmapRows: HeatmapPilotRow[] = useMemo(() => {
    const STAGE_COUNT = 8;
    return filteredRanking.slice(0, 8).map((p) => {
      const values: Array<number | null> = new Array(STAGE_COUNT).fill(null);
      const stagesParticipated = Math.min(STAGE_COUNT, Math.max(p.participacoes || STAGE_COUNT, 1));
      const highlightStages = Math.min(
        stagesParticipated,
        p.vitorias + Math.ceil((p.podios || 0) / 2)
      );
      const avgPerStage = stagesParticipated > 0 ? p.pontos / stagesParticipated : 0;
      for (let i = 0; i < stagesParticipated; i++) {
        const isHighlight = i < highlightStages;
        const jitter = ((i * 37 + p.pos * 11) % 9) - 4; // deterministic [-4..4]
        const base = isHighlight ? avgPerStage * 1.25 : avgPerStage * 0.85;
        values[i] = Math.max(0, Math.round(base + jitter));
      }
      return {
        name: getPilotFirstAndLastName(p.piloto),
        values,
      };
    });
  }, [filteredRanking]);

  if (loading) {
    return (
      <div className="mt-4 space-y-4">
        <LeaderHeroSkeleton isDark={isDarkMode} />
        <StatGridSkeleton cells={4} isDark={isDarkMode} />
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
        <p className={`mt-2 ${isDarkMode ? "text-zinc-300" : "text-zinc-600"}`}>{error}</p>
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
    <PageTransition>
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

        <Breadcrumb
          items={[{ label: "Estatísticas", href: "/estatisticas" }]}
          isDark={isDarkMode}
        />

        {filteredRanking.length === 0 ? (
          <EmptyStateIllustration
            variant="data"
            title="Sem dados para analisar"
            description="Não há pilotos suficientes no recorte atual para montar a leitura estatística."
            isDark={isDarkMode}
          />
        ) : (
          <>
            <RevealOnScroll>
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
            </RevealOnScroll>

            <SectionDivider />

            <RevealOnScroll delay={0.05}>
              <section className="space-y-2.5">
                <header className="flex items-end justify-between gap-3">
                  <div>
                    <h2
                      className={`text-lg font-bold tracking-tight ${
                        isDarkMode ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      Mapa de consistência
                    </h2>
                    <p
                      className={`text-[11px] font-medium tracking-[0.04em] ${
                        isDarkMode ? "text-white/55" : "text-zinc-500"
                      }`}
                    >
                      Preview — pontos por etapa aproximados a partir dos totais.
                    </p>
                  </div>
                </header>
                <ConsistencyHeatmap pilots={heatmapRows} theme={theme} isDark={isDarkMode} />
              </section>
            </RevealOnScroll>

            <SectionDivider />

            <RevealOnScroll delay={0.1}>
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
            </RevealOnScroll>
          </>
        )}
      </div>
      <ScrollToTopButton isDark={isDarkMode} />
    </PageTransition>
  );
}
