"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import RankingHeader from "@/components/ranking/ranking-header";
import RankingSearchCard from "@/components/ranking/ranking-search-card";
import useRankingData from "@/lib/hooks/useRankingData";
import useRankingFilters from "@/lib/hooks/useRankingFilters";
import useChampionshipNarrative from "@/lib/hooks/useChampionshipNarrative";
import useEditorialCards from "@/lib/hooks/useEditorialCards";
import useRankingScreenController from "@/lib/hooks/useRankingScreenController";
import useRankingShare from "@/lib/hooks/useRankingShare";
import {
  competitionLabels,
  getPilotFirstAndLastName,
  getPilotWarNameDisplay,
  getTop6RowStyles,
  getTrendVisual,
  normalizePilotName,
  normalizeCategoryAccent,
} from "@/lib/ranking/ranking-utils";
import type { RankingItem, RankingMetaPilot } from "@/types/ranking";
import ClassificacaoHeroSection from "@/components/classificacao/classificacao-hero-section";
import ClassificacaoMainTableSection from "@/components/classificacao/classificacao-main-table-section";
import SectionDivider from "@/components/ui/section-divider";
import { useChampionship } from "@/context/championship-context";
import PageTransition from "@/components/ui/page-transition";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top";
import Breadcrumb from "@/components/ui/breadcrumb";
import { LeaderHeroSkeleton, ClassificationSkeleton } from "@/components/ui/shape-skeleton";

const RankingShareCanvas = dynamic(
  () => import("@/components/ranking/sections/ranking-share-canvas"),
  { ssr: false }
);

export default function ClassificacaoPageContent() {
  const router = useRouter();
  const { isDarkMode, toggleTheme, categoria, campeonato } = useChampionship();

  const { rankingData, rankingMeta, categories, loading, error, retry } = useRankingData({
    categoria,
    campeonato,
  });

  const {
    category,
    setCategory: _setCategory,
    competition,
    setCompetition,
    search,
    setSearch,
    availableCompetitions,
    currentCompetitionMeta,
    filteredRanking,
    leader,
  } = useRankingFilters({
    rankingData,
    rankingMeta,
    categories,
  });

  const [isSharingImage, setIsSharingImage] = useState(false);

  const shareCardRef = useRef<HTMLDivElement | null>(null);
  const fullClassificationShareCardRef = useRef<HTMLDivElement | null>(null);
  const leaderShareCardRef = useRef<HTMLDivElement | null>(null);
  const narrativeShareCardRef = useRef<HTMLDivElement | null>(null);
  const duelShareCardRef = useRef<HTMLDivElement | null>(null);
  const podiumCardRef = useRef<HTMLDivElement | null>(null);
  const evolutionCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const accent = normalizeCategoryAccent(category);

    window.dispatchEvent(
      new CustomEvent("caserna-category-accent-change", {
        detail: { accent },
      })
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent("caserna-category-accent-change", {
          detail: { accent: "neutral" },
        })
      );
    };
  }, [category]);

  // Esta página usa seletor de categoria separado — header fica desabilitado
  const headerCategories: string[] = [];
  const handleHeaderCategoryChange = () => {};

  const { theme, pilotTrendMap, titleFightStatus } = useRankingScreenController({
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

  const championshipNarrative = useChampionshipNarrative({
    category,
    competitionLabel: competitionLabels[competition] || competition,
    leader,
    titleFightStatus,
    statsSummary,
    statsRadar,
    bestEfficiencyPilot,
  });

  const editorialCards = useEditorialCards({
    category,
    competitionLabel: competitionLabels[competition] || competition,
    leader,
    filteredRanking,
    statsSummary,
    statsRadar,
    bestEfficiencyPilot,
  });

  const { generateImage, download } = useRankingShare({
    isDarkMode,
  });

  const handleRetry = () => {
    retry();
  };

  const handleSelectPilot = (pilot: RankingItem) => {
    const pilotId = pilot.pilotoId || "";
    router.push(pilotId ? `/pilotos?pilotId=${pilotId}` : "/pilotos");
  };

  const handleShareClassification = async () => {
    if (!shareCardRef.current || isSharingImage) return;

    try {
      setIsSharingImage(true);
      const dataUrl = await generateImage(shareCardRef.current);
      if (!dataUrl) return;

      download(dataUrl, `classificacao-${category.toLowerCase()}-${competition.toLowerCase()}.png`);
    } catch (err) {
      console.error(err);
      window.alert("Não foi possível gerar a imagem da classificação.");
    } finally {
      setIsSharingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="relative mx-auto mt-4 w-full max-w-[1600px] space-y-4 px-4 py-6">
          <LeaderHeroSkeleton isDark={isDarkMode} />
          <ClassificationSkeleton rows={10} isDark={isDarkMode} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="relative mx-auto mt-4 w-full max-w-[1600px]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.1),transparent_60%)]" />
          <div
            className={`relative overflow-hidden rounded-[32px] border p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.22)] ${
              isDarkMode
                ? "border-red-500/20 bg-[linear-gradient(180deg,#0b0f16_0%,#0f172a_100%)] text-white"
                : "border-red-300 bg-white text-zinc-950"
            }`}
          >
            <p className="text-2xl font-semibold tracking-tight">Erro</p>
            <p className={`mt-2 ${isDarkMode ? "text-zinc-300" : "text-zinc-600"}`}>{error}</p>
            <button
              onClick={handleRetry}
              className={`mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                isDarkMode
                  ? "border-white/10 bg-white/8 text-white hover:bg-white/14"
                  : "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800"
              }`}
            >
              Tentar novamente
            </button>
            <p className={`mt-4 text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
              Ou abra <strong>/api/ranking</strong> no navegador para testar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className={`min-h-screen ${isDarkMode ? "text-white" : ""}`}>
        <div className="relative mx-auto mt-4 w-full max-w-[1600px]">
          {isDarkMode && (
            <>
              <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 rounded-[36px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.045),transparent_62%)]" />
              <div className="pointer-events-none absolute top-8 right-0 -z-10 h-28 w-28 rounded-full bg-amber-300/4 blur-3xl" />
            </>
          )}

          <div className="relative space-y-3 lg:space-y-4 xl:space-y-5">
            <RankingHeader
              theme={theme}
              categories={headerCategories}
              category={category}
              setCategory={handleHeaderCategoryChange}
              availableCompetitions={availableCompetitions}
              competition={competition}
              setCompetition={setCompetition}
              competitionLabels={competitionLabels}
              toggleDarkMode={toggleTheme}
            />

            <Breadcrumb
              items={[{ label: "Classificação", href: "/classificacao" }]}
              isDark={isDarkMode}
            />

            <RankingSearchCard
              isDarkMode={isDarkMode}
              theme={theme}
              competition={competition}
              competitionLabels={competitionLabels}
              search={search}
              onSearchChange={setSearch}
            />

            <ClassificacaoMainTableSection
              isDarkMode={isDarkMode}
              theme={theme}
              category={category}
              competition={competition}
              filteredRanking={filteredRanking}
              leader={leader}
              titleFightStatus={titleFightStatus}
              pilotTrendMap={pilotTrendMap}
              onSelectPilot={handleSelectPilot}
            />

            <SectionDivider />

            <ClassificacaoHeroSection
              isDarkMode={isDarkMode}
              theme={theme}
              category={category}
              competition={competition}
              filteredRanking={filteredRanking}
              titleFightStatus={titleFightStatus}
              statsSummary={statsSummary}
              statsRadar={statsRadar}
              bestEfficiencyPilot={bestEfficiencyPilot}
              championshipNarrative={championshipNarrative}
              editorialCards={editorialCards}
              isSharingImage={isSharingImage}
              onShareClassification={handleShareClassification}
            />
          </div>

          <div className="pointer-events-none fixed top-0 -left-[9999px] z-[-1] opacity-0">
            <RankingShareCanvas
              isDarkMode={isDarkMode}
              theme={theme}
              category={category}
              competition={competition}
              competitionLabels={competitionLabels}
              leader={leader}
              statsSummary={statsSummary}
              championshipNarrative={championshipNarrative}
              comparePilotA={null}
              comparePilotB={null}
              duelSummary={null}
              duelIntensity={{
                label: "SEM LEITURA",
                tone: isDarkMode
                  ? "border-white/10 bg-white/5 text-zinc-300"
                  : "border-zinc-200 bg-zinc-50 text-zinc-600",
              }}
              filteredRanking={filteredRanking}
              pilotTrendMap={pilotTrendMap}
              getPilotFirstAndLastName={getPilotFirstAndLastName}
              getPilotWarNameDisplay={getPilotWarNameDisplay}
              getTop6RowStyles={getTop6RowStyles}
              getTrendVisual={getTrendVisual}
              normalizePilotName={normalizePilotName}
              refs={{
                leaderShareCardRef,
                narrativeShareCardRef,
                duelShareCardRef,
                shareCardRef,
                fullClassificationShareCardRef,
                podiumCardRef,
                evolutionCardRef,
              }}
            />
          </div>
        </div>
      </div>
      <ScrollToTopButton isDark={isDarkMode} />
    </PageTransition>
  );
}
