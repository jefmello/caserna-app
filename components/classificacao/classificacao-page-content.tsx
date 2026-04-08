"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import RankingHeader from "@/components/ranking/ranking-header";
import RankingSpotlight from "@/components/ranking/ranking-spotlight";
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
  getPilotHighlightName,
  getPilotWarName,
  getPilotWarNameDisplay,
  getTop6RowStyles,
  getTrendVisual,
  normalizePilotName,
} from "@/lib/ranking/ranking-utils";
import type { RankingItem, RankingMetaPilot } from "@/types/ranking";
import { Camera } from "lucide-react";
import ClassificacaoHeroSection from "@/components/classificacao/classificacao-hero-section";
import ClassificacaoMainTableSection from "@/components/classificacao/classificacao-main-table-section";
import ClassificacaoTitleFightSection from "@/components/classificacao/classificacao-title-fight-section";
import { useChampionship } from "@/context/championship-context";

const RankingShareCanvas = dynamic(
  () => import("@/components/ranking/sections/ranking-share-canvas"),
  { ssr: false }
);

function normalizeCategoryAccent(category?: string | null) {
  if (!category) return "neutral";

  const normalized = category
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  if (normalized === "base") return "base";
  if (normalized === "graduados") return "graduados";
  if (normalized === "elite") return "elite";

  return "neutral";
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

  const showImage = Boolean(src) && !hasError;

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${
        isDark ? "bg-[#0b0f16]" : "bg-zinc-50"
      }`}
    >
      {showImage ? (
        <>
          <img
            src={src || ""}
            alt={alt}
            className="absolute inset-0 h-full w-full scale-[1.18] object-cover object-center opacity-24 blur-2xl"
            onError={() => setHasError(true)}
          />
          <div
            className={`absolute inset-0 ${
              isDark ? "bg-black/24" : "bg-white/8"
            }`}
          />
          <img
            src={src || ""}
            alt={alt}
            className="relative z-[1] h-full w-full object-contain object-center"
            onError={() => setHasError(true)}
          />
        </>
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center ${
            isDark
              ? "bg-gradient-to-b from-[#0b0f16] to-[#0f172a]"
              : "bg-gradient-to-b from-zinc-50 to-zinc-100"
          }`}
        >
          <div className="text-center">
            <div
              className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ${
                isDark ? "bg-white/5" : "bg-white"
              }`}
            >
              <Camera
                className={`h-5 w-5 ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}
              />
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

export default function ClassificacaoPageContent() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useChampionship();

  const { rankingData, rankingMeta, categories, loading, error, retry } =
    useRankingData();

  const {
    category,
    setCategory,
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
  const leaderShareCardRef = useRef<HTMLDivElement | null>(null);
  const narrativeShareCardRef = useRef<HTMLDivElement | null>(null);
  const duelShareCardRef = useRef<HTMLDivElement | null>(null);

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

  const headerCategories = useMemo(() => {
    return [];
  }, []);

  const handleHeaderCategoryChange = () => {
    return;
  };

  const {
    leaderName,
    theme,
    spotlightStyles,
    top3TitleFight,
    pilotTrendMap,
    titleFightStatus,
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

    const totalPoints = filteredRanking.reduce(
      (sum, item) => sum + item.pontos,
      0
    );
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
            (filteredRanking[2]?.pontos || 0) -
              (filteredRanking[5]?.pontos || 0),
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

      download(
        dataUrl,
        `classificacao-${category.toLowerCase()}-${competition.toLowerCase()}.png`
      );
    } catch (err) {
      console.error(err);
      window.alert("Não foi possível gerar a imagem da classificação.");
    } finally {
      setIsSharingImage(false);
    }
  };

  const getSpotlightPilotWarName = (pilot: unknown) => {
    if (!pilot || typeof pilot !== "object") return "";
    return getPilotWarName(pilot as RankingItem | null | undefined);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "bg-[#05070a]" : ""}`}>
        <div className="relative mx-auto mt-4 w-full max-w-[1600px]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_60%)]" />
          <div
            className={`relative overflow-hidden rounded-[32px] border px-6 py-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.22)] ${
              isDarkMode
                ? "border-white/8 bg-[linear-gradient(180deg,#0b0f16_0%,#0f172a_100%)] text-white"
                : "border-black/5 bg-white text-zinc-950"
            }`}
          >
            <div
              className={`mx-auto mb-4 h-14 w-14 animate-pulse rounded-2xl ${
                isDarkMode ? "bg-white/8" : "bg-zinc-100"
              }`}
            />
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
      <div className={`min-h-screen ${isDarkMode ? "bg-[#05070a]" : ""}`}>
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
            <p
              className={`mt-2 ${
                isDarkMode ? "text-zinc-300" : "text-zinc-600"
              }`}
            >
              {error}
            </p>
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
    <div
      className={`min-h-screen ${isDarkMode ? "bg-[#05070a] text-white" : ""}`}
    >
      <div className="relative mx-auto mt-4 w-full max-w-[1600px]">
        {isDarkMode && (
          <>
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#05070a_0%,#070b11_38%,#05070a_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 rounded-[36px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.045),transparent_62%)]" />
            <div className="pointer-events-none absolute right-0 top-8 -z-10 h-28 w-28 rounded-full bg-amber-300/4 blur-3xl" />
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

          <RankingSearchCard
            isDarkMode={isDarkMode}
            theme={theme}
            competition={competition}
            competitionLabels={competitionLabels}
            search={search}
            onSearchChange={setSearch}
          />

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

          <ClassificacaoTitleFightSection
            isDarkMode={isDarkMode}
            theme={theme}
            titleFightStatus={titleFightStatus}
            top3TitleFight={top3TitleFight}
            category={category}
            onSelectPilot={handleSelectPilot}
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
        </div>

        <div className="pointer-events-none fixed -left-[9999px] top-0 z-[-1] opacity-0">
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
            }}
          />
        </div>
      </div>
    </div>
  );
}