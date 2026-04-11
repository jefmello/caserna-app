"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  BarChart3,
  Camera,
  Crown,
  Gauge,
  Medal,
  Swords,
  TableProperties,
  Trophy,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import RankingSearchCard from "@/components/ranking/ranking-search-card";
import RankingPilotEmptyState from "@/components/ranking/ranking-pilot-empty-state";
import RankingPilotHeroCard from "@/components/ranking/ranking-pilot-hero-card";
import RankingPilotComparisonCard from "@/components/ranking/ranking-pilot-comparison-card";
import RankingPilotPerformanceBlocksCard from "@/components/ranking/ranking-pilot-performance-blocks-card";
import useRankingData from "@/lib/hooks/useRankingData";
import useRankingFilters from "@/lib/hooks/useRankingFilters";
import usePilotAnalysis from "@/lib/hooks/usePilotAnalysis";
import useRankingScreenController from "@/lib/hooks/useRankingScreenController";
import useRankingShare from "@/lib/hooks/useRankingShare";
import {
  categoryColors,
  competitionLabels,
  getPilotFirstAndLastName,
  getPilotWarNameDisplay,
} from "@/lib/ranking/ranking-utils";
import type { RankingItem } from "@/types/ranking";
import { useChampionship } from "@/context/championship-context";
import PageTransition from "@/components/ui/page-transition";

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
        isDark ? "bg-[#0f172a]" : "bg-zinc-50"
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
              isDark ? "bg-slate-950/18" : "bg-white/8"
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

export default function PilotosPageContent() {
  const searchParams = useSearchParams();
  const { isDarkMode } = useChampionship();

  const { rankingData, rankingMeta, categories, loading, error, retry } =
    useRankingData();

  const {
    category,
    competition,
    search,
    setSearch,
    filteredRanking,
    leader,
  } = useRankingFilters({
    rankingData,
    rankingMeta,
    categories,
  });

  const [selectedPilot, setSelectedPilot] = useState<RankingItem | null>(null);
  const [isSharingPilotImage, setIsSharingPilotImage] = useState(false);
  const pilotShareCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const pilotIdFromUrl = searchParams.get("pilotId");
    if (!pilotIdFromUrl || filteredRanking.length === 0) return;

    const matchedPilot =
      filteredRanking.find((item) => item.pilotoId === pilotIdFromUrl) || null;

    if (matchedPilot) {
      setSelectedPilot(matchedPilot);
    }
  }, [searchParams, filteredRanking]);

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

  const { theme } = useRankingScreenController({
    category,
    competition,
    isDarkMode,
    filteredRanking,
    rankingData,
    leader,
  });

  const { generateImage, download } = useRankingShare({
    isDarkMode,
  });

  const pilotAnalysis = usePilotAnalysis({
    selectedPilot,
    filteredRanking,
    leader,
    category,
    competition,
  });

  // Quando selectedPilot está definido, resolvedSafePilot é garantidamente non-null
  // (os componentes de análise só renderizam no branch onde selectedPilot é truthy)
  const resolvedSafePilot = pilotAnalysis?.pilot
    ?? (selectedPilot as RankingItem);
  const selectedPilotGap = pilotAnalysis?.gapToLeader ?? "-";
  const selectedPilotAverage = pilotAnalysis?.averagePointsPerRace ?? 0;
  const selectedPilotBestAttribute = pilotAnalysis?.bestAttribute ?? { label: "Sem dados", value: 0 };
  const selectedPilotConsistency = pilotAnalysis?.consistencyLabel ?? "Sem leitura";
  const selectedPilotMomentum = pilotAnalysis?.momentumLabel ?? "Sem leitura";
  const selectedPilotVsLeader = pilotAnalysis?.performanceVsLeader ?? 0;
  const selectedPilotPodiumRate = pilotAnalysis?.podiumRate ?? 0;
  const selectedPilotWinRate = pilotAnalysis?.winRate ?? 0;
  const selectedPilotDiscipline = pilotAnalysis?.discipline ?? 100;
  const selectedPilotLeaderGapValue = pilotAnalysis?.leaderGapValue ?? 0;
  const selectedPilotWinRateLabel = pilotAnalysis?.winRateLabel ?? "sem leitura";
  const selectedPilotPodiumRateLabel = pilotAnalysis?.podiumRateLabel ?? "sem leitura";
  const selectedPilotDisciplineLabel = pilotAnalysis?.disciplineLabel ?? "sem leitura";
  const selectedPilotRivalAhead = pilotAnalysis?.rivalAhead ?? null;

  const selectedPilotShortName = useMemo(
    () => getPilotFirstAndLastName(selectedPilot?.piloto),
    [selectedPilot]
  );

  const selectedPilotWarName = useMemo(
    () => getPilotWarNameDisplay(selectedPilot),
    [selectedPilot]
  );

  useEffect(() => {
    if (!selectedPilot) return;

    const stillExists = filteredRanking.find(
      (item) =>
        (item.pilotoId && item.pilotoId === selectedPilot.pilotoId) ||
        item.piloto === selectedPilot.piloto
    );

    if (!stillExists) {
      setSelectedPilot(null);
    }
  }, [filteredRanking, selectedPilot]);

  const handleBackToList = () => {
    setSelectedPilot(null);
  };

  const handleSelectPilot = (pilot: RankingItem) => {
    setSelectedPilot(pilot);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRetry = () => {
    retry();
  };

  const handleSharePilotCard = async () => {
    if (!selectedPilot || !pilotShareCardRef.current || isSharingPilotImage) return;

    try {
      setIsSharingPilotImage(true);
      const dataUrl = await generateImage(pilotShareCardRef.current);
      if (!dataUrl) return;

      const safePilotName = getPilotFirstAndLastName(selectedPilot.piloto)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/\s+/g, "-");

      download(
        dataUrl,
        `piloto-${safePilotName}-${category.toLowerCase()}-${competition.toLowerCase()}.png`
      );
    } catch (err) {
      console.error(err);
      window.alert("Não foi possível gerar a imagem do piloto.");
    } finally {
      setIsSharingPilotImage(false);
    }
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
          Carregando pilotos...
        </p>
        <p
          className={`mt-2 text-sm ${
            isDarkMode ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          Preparando central de análise individual
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
    <PageTransition>
      <div className="mt-4 space-y-3 lg:space-y-4 xl:space-y-5">
        <RankingSearchCard
        isDarkMode={isDarkMode}
        theme={theme}
        competition={competition}
        competitionLabels={competitionLabels}
        search={search}
        onSearchChange={setSearch}
      />

      {!selectedPilot ? (
        <>
          <RankingPilotEmptyState
            isDarkMode={isDarkMode}
            theme={theme}
            UserIcon={User}
          />

          <Card
            className={`rounded-[24px] shadow-sm ${
              isDarkMode
                ? "border border-white/10 bg-[#111827]"
                : "border-black/5 bg-white"
            }`}
          >
            <CardContent className="p-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                      isDarkMode ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    Grade de pilotos
                  </p>
                  <h3
                    className={`text-[20px] font-extrabold tracking-tight ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    Selecione um piloto
                  </h3>
                </div>

                <div
                  className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                    isDarkMode
                      ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                      : "border-black/5 bg-zinc-50 text-zinc-700"
                  }`}
                >
                  {filteredRanking.length} piloto
                  {filteredRanking.length === 1 ? "" : "s"}
                </div>
              </div>

              <div className="space-y-2">
                {filteredRanking.map((pilot, index) => (
                  <button
                    key={`${pilot.pilotoId || pilot.piloto}-${index}`}
                    type="button"
                    onClick={() => handleSelectPilot(pilot)}
                    className={`w-full rounded-[18px] border px-3 py-3 text-left transition-all duration-200 ${
                      isDarkMode
                        ? "border-white/10 bg-[#0f172a] hover:border-white/20 hover:bg-[#162033]"
                        : "border-black/5 bg-zinc-50/80 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p
                          className={`truncate text-[14px] font-semibold tracking-tight ${
                            isDarkMode ? "text-white" : "text-zinc-950"
                          }`}
                        >
                          {getPilotFirstAndLastName(pilot.piloto)}
                        </p>
                        {getPilotWarNameDisplay(pilot) ? (
                          <p
                            className={`mt-0.5 truncate text-[11px] italic ${
                              isDarkMode ? "text-zinc-400" : "text-zinc-500"
                            }`}
                          >
                            {getPilotWarNameDisplay(pilot)}
                          </p>
                        ) : null}
                      </div>

                      <div className="shrink-0 text-right">
                        <p
                          className={`text-[14px] font-semibold ${
                            isDarkMode ? theme.darkAccentText : "text-zinc-950"
                          }`}
                        >
                          {pilot.pontos} pts
                        </p>
                        <p
                          className={`text-[10px] font-semibold ${
                            isDarkMode ? "text-zinc-500" : "text-zinc-400"
                          }`}
                        >
                          P{pilot.pos}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}

                {filteredRanking.length === 0 ? (
                  <div
                    className={`rounded-[18px] border border-dashed px-4 py-8 text-center text-sm ${
                      isDarkMode
                        ? "border-white/10 bg-[#0f172a] text-zinc-400"
                        : "border-black/10 bg-zinc-50 text-zinc-500"
                    }`}
                  >
                    Nenhum piloto com pontos encontrado.
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="space-y-3">
          <div ref={pilotShareCardRef}>
            <RankingPilotHeroCard
              isDarkMode={isDarkMode}
              theme={theme}
              category={category}
              categoryColors={categoryColors}
              competition={competition}
              competitionLabels={competitionLabels}
              handleBackToRanking={handleBackToList}
              handleSharePilotCard={handleSharePilotCard}
              isSharingPilotImage={isSharingPilotImage}
              selectedPilot={selectedPilot}
              selectedPilotShortName={selectedPilotShortName}
              selectedPilotWarName={selectedPilotWarName}
              safeSelectedPilot={resolvedSafePilot}
              selectedPilotGap={selectedPilotGap}
              selectedPilotAverage={selectedPilotAverage}
              selectedPilotConsistency={selectedPilotConsistency}
              selectedPilotMomentum={selectedPilotMomentum}
              selectedPilotBestAttribute={selectedPilotBestAttribute}
              PilotPhotoSlot={PilotPhotoSlot}
            />
          </div>

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
            safeSelectedPilot={resolvedSafePilot}
            TrophyIcon={Trophy}
            CrownIcon={Crown}
            MedalIcon={Medal}
            GaugeIcon={Gauge}
          />

          <RankingPilotPerformanceBlocksCard
            isDarkMode={isDarkMode}
            theme={theme}
            safeSelectedPilot={resolvedSafePilot}
            selectedPilotAverage={selectedPilotAverage}
            selectedPilotGap={selectedPilotGap}
            selectedPilotLeaderGapValue={selectedPilotLeaderGapValue}
            SwordsIcon={Swords}
            BarChart3Icon={BarChart3}
            TablePropertiesIcon={TableProperties}
          />

          <Card
            className={`rounded-[24px] shadow-sm transition-all duration-200 hover:-translate-y-[1px] ${
              isDarkMode
                ? "border border-white/10 bg-[#111827]"
                : "border-black/5 bg-white"
            }`}
          >
            <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                      isDarkMode ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    Raio-x competitivo
                  </p>
                  <h3
                    className={`text-[20px] font-extrabold tracking-tight ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    Comparativo do piloto
                  </h3>
                </div>

                <div
                  className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                    isDarkMode
                      ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                      : "border-black/5 bg-zinc-50 text-zinc-700"
                  }`}
                >
                  leitura oficial
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div
                  className={`rounded-[20px] border p-3 ${
                    isDarkMode
                      ? "border-white/10 bg-[#0f172a]"
                      : "border-black/5 bg-zinc-50/70"
                  }`}
                >
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                      isDarkMode ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    Próximo alvo
                  </p>
                  <p
                    className={`mt-2 text-[20px] font-semibold leading-tight ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    {selectedPilotRivalAhead
                      ? getPilotFirstAndLastName(selectedPilotRivalAhead.piloto)
                      : "Nenhum piloto acima"}
                  </p>
                  <p
                    className={`mt-2 text-[12px] ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    {selectedPilotRivalAhead && selectedPilot
                      ? `${selectedPilotRivalAhead.pontos - resolvedSafePilot.pontos} ponto(s) para avançar mais uma posição.`
                      : "Piloto ocupa a liderança desta seleção."}
                  </p>
                </div>

                <div
                  className={`rounded-[20px] border p-3 ${
                    isDarkMode
                      ? "border-white/10 bg-[#0f172a]"
                      : "border-black/5 bg-zinc-50/70"
                  }`}
                >
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                      isDarkMode ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    Destaque técnico
                  </p>
                  <p
                    className={`mt-2 text-[20px] font-semibold leading-tight ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    {selectedPilotBestAttribute.label}
                  </p>
                  <p
                    className={`mt-2 text-[12px] ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    Melhor número individual do piloto nesta leitura:{" "}
                    <span className="font-semibold">
                      {selectedPilotBestAttribute.value}
                    </span>
                    .
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
    </PageTransition>
  );
}