"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  ChevronRight,
  Clapperboard,
  Crown,
  Gauge,
  Sparkles,
  Swords,
  Trophy,
  UserRound,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import RankingHeader from "@/components/ranking/ranking-header";
import RankingSpotlight from "@/components/ranking/ranking-spotlight";
import RankingCompetitionContext from "@/components/ranking/sections/ranking-competition-context";
import RankingChampionshipNarrativeCard from "@/components/ranking/ranking-championship-narrative-card";
import RankingEditorialCards from "@/components/ranking/ranking-editorial-cards";
import useRankingData from "@/lib/hooks/useRankingData";
import useRankingFilters from "@/lib/hooks/useRankingFilters";
import useChampionshipNarrative from "@/lib/hooks/useChampionshipNarrative";
import useEditorialCards from "@/lib/hooks/useEditorialCards";
import useRankingScreenController from "@/lib/hooks/useRankingScreenController";
import {
  competitionLabels,
  getPilotFirstAndLastName,
  getPilotHighlightName,
  getPilotWarName,
} from "@/lib/ranking/ranking-utils";
import HallOfFame from "@/components/ranking/hall-of-fame";
import type { RankingItem, RankingMetaPilot } from "@/types/ranking";
import { useChampionship } from "@/context/championship-context";
import PageTransition, { StaggerContainer, StaggerItem } from "@/components/ui/page-transition";

type CategoryAccent = "base" | "graduados" | "elite" | "neutral";

function normalizeCategoryAccent(category?: string | null): CategoryAccent {
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
              className={`text-[12px] font-semibold uppercase tracking-[0.08em] ${
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

function HomeSummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  isDarkMode,
  theme,
  accent = false,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  isDarkMode: boolean;
  theme: any;
  accent?: boolean;
}) {
  return (
    <Card
      className={`rounded-[22px] shadow-sm ${
        isDarkMode
          ? accent
            ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}`
            : "border border-white/10 bg-[#111827]"
          : accent
            ? "border-yellow-300/70 bg-yellow-50/80"
            : "border-black/5 bg-white"
      }`}
    >
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
              isDarkMode ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            {title}
          </p>

          <div
            className={`flex h-9 w-9 items-center justify-center rounded-2xl ${
              isDarkMode
                ? accent
                  ? theme.darkAccentIconWrap
                  : "bg-white/5"
                : accent
                  ? "bg-yellow-100"
                  : "bg-zinc-100"
            }`}
          >
            <Icon
              className={`h-4 w-4 ${
                isDarkMode
                  ? accent
                    ? theme.darkAccentText
                    : "text-zinc-300"
                  : accent
                    ? "text-yellow-700"
                    : "text-zinc-600"
              }`}
            />
          </div>
        </div>

        <p
          className={`text-[24px] font-extrabold leading-none tracking-tight ${
            isDarkMode ? "text-white" : "text-zinc-950"
          }`}
        >
          {value}
        </p>

        <p
          className={`mt-2 text-[12px] leading-snug ${
            isDarkMode ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
}

function HomePilotCtaCard({
  href,
  eyebrow,
  title,
  description,
  buttonLabel,
  icon: Icon,
  isDarkMode,
  theme,
  accent = false,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
  icon: React.ElementType;
  isDarkMode: boolean;
  theme: any;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group block rounded-[24px] border shadow-sm transition-all duration-200 hover:-translate-y-[2px] ${
        isDarkMode
          ? accent
            ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}`
            : "border-white/10 bg-[#111827] hover:border-white/20 hover:bg-[#162033]"
          : accent
            ? "border-yellow-300/70 bg-yellow-50/80"
            : "border-black/5 bg-white hover:bg-zinc-50"
      }`}
    >
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p
              className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              {eyebrow}
            </p>
            <h3
              className={`mt-1 text-[20px] font-extrabold tracking-tight ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              {title}
            </h3>
          </div>

          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
              isDarkMode
                ? accent
                  ? theme.darkAccentIconWrap
                  : "bg-white/5"
                : accent
                  ? "bg-yellow-100"
                  : "bg-zinc-100"
            }`}
          >
            <Icon
              className={`h-4.5 w-4.5 ${
                isDarkMode
                  ? accent
                    ? theme.darkAccentText
                    : "text-zinc-300"
                  : accent
                    ? "text-yellow-700"
                    : "text-zinc-600"
              }`}
            />
          </div>
        </div>

        <p
          className={`text-[12px] leading-snug ${
            isDarkMode ? "text-zinc-400" : "text-zinc-600"
          }`}
        >
          {description}
        </p>

        <div
          className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-bold transition-all duration-200 group-hover:translate-x-0.5 ${
            isDarkMode
              ? accent
                ? `${theme.darkAccentBg} ${theme.darkAccentText}`
                : "bg-white/5 text-zinc-200"
              : accent
                ? "bg-yellow-100 text-yellow-800"
                : "bg-zinc-100 text-zinc-800"
          }`}
        >
          {buttonLabel}
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

export default function HomePageContent() {
  const { isDarkMode, toggleTheme } = useChampionship();

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

  const {
    theme,
    leaderName,
    spotlightStyles,
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

  const leaderPilotHref = leader?.pilotoId
    ? `/pilotos?pilotId=${leader.pilotoId}`
    : "/pilotos";

  const hottestPilot =
    (statsRadar?.hottestPilot as RankingItem | RankingMetaPilot | null) || null;

  const hottestPilotHref =
    hottestPilot && "pilotoId" in hottestPilot && hottestPilot.pilotoId
      ? `/pilotos?pilotId=${hottestPilot.pilotoId}`
      : "/pilotos";

  const dynamicPrimaryCta = useMemo(() => {
    if (statsRadar.titleHeat === "Briga acirrada") {
      return {
        href: "/simulacoes",
        eyebrow: "Disputa do título",
        title: "Cenário quente do campeonato",
        description:
          "A briga está apertada. Veja a matemática atual e o impacto da próxima etapa.",
        buttonLabel: "Abrir simulações",
        icon: Sparkles,
        accent: true,
      };
    }

    if (leader?.pilotoId) {
      return {
        href: leaderPilotHref,
        eyebrow: "Piloto em foco",
        title: getPilotFirstAndLastName(leader.piloto),
        description:
          "Abra a análise individual do líder e veja o raio-x completo do momento atual.",
        buttonLabel: "Analisar líder",
        icon: Crown,
        accent: true,
      };
    }

    return {
      href: "/classificacao",
      eyebrow: "Leitura oficial",
      title: "Ver classificação completa",
      description:
        "Abra a tabela oficial do campeonato e acompanhe a pressão no topo e o corte do Top 6.",
      buttonLabel: "Abrir classificação",
      icon: Trophy,
      accent: true,
    };
  }, [leader, leaderPilotHref, statsRadar.titleHeat]);

  const handleRetry = () => {
    retry();
  };

  const getSpotlightPilotWarName = (pilot: unknown) => {
    if (!pilot || typeof pilot !== "object") return "";
    return getPilotWarName(pilot as RankingItem | null | undefined);
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
          Carregando painel principal...
        </p>
        <p
          className={`mt-2 text-sm ${
            isDarkMode ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          Preparando central oficial do campeonato
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
      <div className="mt-4 space-y-4 lg:space-y-5 xl:space-y-6">
        <RankingHeader
        theme={theme}
        categories={categories}
        category={category}
        setCategory={setCategory}
        availableCompetitions={availableCompetitions}
        competition={competition}
        setCompetition={setCompetition}
        competitionLabels={competitionLabels}
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

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <HomePilotCtaCard
          href={dynamicPrimaryCta.href}
          eyebrow={dynamicPrimaryCta.eyebrow}
          title={dynamicPrimaryCta.title}
          description={dynamicPrimaryCta.description}
          buttonLabel={dynamicPrimaryCta.buttonLabel}
          icon={dynamicPrimaryCta.icon}
          isDarkMode={isDarkMode}
          theme={theme}
          accent={dynamicPrimaryCta.accent}
        />

        {hottestPilot && "pilotoId" in hottestPilot && hottestPilot.pilotoId ? (
          <HomePilotCtaCard
            href={hottestPilotHref}
            eyebrow="Piloto em alta"
            title={getPilotFirstAndLastName(hottestPilot.piloto)}
            description={`${statsRadar.hottestLabel}. Abra a análise individual para ver o momento completo do piloto.`}
            buttonLabel="Abrir piloto"
            icon={UserRound}
            isDarkMode={isDarkMode}
            theme={theme}
          />
        ) : (
          <HomePilotCtaCard
            href="/pilotos"
            eyebrow="Central individual"
            title="Abrir análise de pilotos"
            description="Entre no módulo de pilotos para buscar qualquer nome e abrir a análise individual completa."
            buttonLabel="Ir para pilotos"
            icon={UserRound}
            isDarkMode={isDarkMode}
            theme={theme}
          />
        )}
      </div>

      <StaggerContainer className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StaggerItem>
        <HomeSummaryCard
          title="Líder"
          value={leader ? getPilotFirstAndLastName(leader.piloto) : "-"}
          subtitle={`${leader?.pontos || 0} pts no recorte atual`}
          icon={Crown}
          isDarkMode={isDarkMode}
          theme={theme}
          accent
        />
        </StaggerItem>
        <StaggerItem>
        <HomeSummaryCard
          title="Vantagem"
          value={`${statsSummary.leaderAdvantage} pts`}
          subtitle="Diferença entre líder e vice"
          icon={Gauge}
          isDarkMode={isDarkMode}
          theme={theme}
        />
        </StaggerItem>
        <StaggerItem>
        <HomeSummaryCard
          title="Corte Top 6"
          value={`${statsSummary.top6CutPoints} pts`}
          subtitle="Linha de troféu do campeonato"
          icon={Trophy}
          isDarkMode={isDarkMode}
          theme={theme}
        />
        </StaggerItem>
        <StaggerItem>
        <HomeSummaryCard
          title="Calor da disputa"
          value={statsRadar.titleHeat}
          subtitle="Leitura rápida da briga pelo título"
          icon={Swords}
          isDarkMode={isDarkMode}
          theme={theme}
        />
        </StaggerItem>
      </StaggerContainer>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <RankingCompetitionContext
          isDarkMode={isDarkMode}
          theme={theme}
          titleFightStatus={titleFightStatus}
          statsSummary={statsSummary}
          statsRadar={statsRadar}
          bestEfficiencyPilot={bestEfficiencyPilot}
          getPilotFirstAndLastName={getPilotFirstAndLastName}
        />

        <Card
          className={`rounded-[24px] shadow-sm ${
            isDarkMode
              ? "border border-white/10 bg-[#111827]"
              : "border-black/5 bg-white"
          }`}
        >
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Próximo passo
                </p>
                <h3
                  className={`mt-1 text-[20px] font-extrabold tracking-tight ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  Acesse o módulo certo
                </h3>
              </div>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                  isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                }`}
              >
                <ChevronRight
                  className={`h-4.5 w-4.5 ${
                    isDarkMode ? theme.darkAccentText : theme.primaryIcon
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Link
                href="/classificacao"
                className={`flex items-center justify-between rounded-[18px] border px-3 py-3 transition-all duration-200 ${
                  isDarkMode
                    ? "border-white/10 bg-[#0f172a] hover:border-white/20 hover:bg-[#162033]"
                    : "border-black/5 bg-zinc-50/80 hover:bg-white"
                }`}
              >
                <div>
                  <p
                    className={`text-[14px] font-semibold ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    Ver classificação oficial
                  </p>
                  <p
                    className={`mt-0.5 text-[12px] ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    Tabela completa, pressão no topo e corte do Top 6.
                  </p>
                </div>
                <Trophy
                  className={`h-4 w-4 ${
                    isDarkMode ? theme.darkAccentText : theme.primaryIcon
                  }`}
                />
              </Link>

              <Link
                href="/simulacoes"
                className={`flex items-center justify-between rounded-[18px] border px-3 py-3 transition-all duration-200 ${
                  isDarkMode
                    ? "border-white/10 bg-[#0f172a] hover:border-white/20 hover:bg-[#162033]"
                    : "border-black/5 bg-zinc-50/80 hover:bg-white"
                }`}
              >
                <div>
                  <p
                    className={`text-[14px] font-semibold ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    Projetar cenários futuros
                  </p>
                  <p
                    className={`mt-0.5 text-[12px] ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    Veja favorito, vivos na matemática e impacto da próxima etapa.
                  </p>
                </div>
                <Sparkles
                  className={`h-4 w-4 ${
                    isDarkMode ? theme.darkAccentText : theme.primaryIcon
                  }`}
                />
              </Link>

              <Link
                href="/midia"
                className={`flex items-center justify-between rounded-[18px] border px-3 py-3 transition-all duration-200 ${
                  isDarkMode
                    ? "border-white/10 bg-[#0f172a] hover:border-white/20 hover:bg-[#162033]"
                    : "border-black/5 bg-zinc-50/80 hover:bg-white"
                }`}
              >
                <div>
                  <p
                    className={`text-[14px] font-semibold ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    Gerar conteúdo oficial
                  </p>
                  <p
                    className={`mt-0.5 text-[12px] ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    Cards da classificação, líder, narrativa e duelo.
                  </p>
                </div>
                <Clapperboard
                  className={`h-4 w-4 ${
                    isDarkMode ? theme.darkAccentText : theme.primaryIcon
                  }`}
                />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <RankingChampionshipNarrativeCard
          isDarkMode={isDarkMode}
          theme={theme}
          category={category}
          competitionLabel={competitionLabels[competition] || competition}
          narrative={championshipNarrative}
        />

        <RankingEditorialCards
          isDarkMode={isDarkMode}
          theme={theme}
          cards={editorialCards.slice(0, 2)}
        />
      </div>

      {/* Hall da Fama */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Trophy
            className={`h-5 w-5 ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}
          />
          <h2
            className={`text-lg font-extrabold tracking-tight ${
              isDarkMode ? "text-white" : "text-zinc-950"
            }`}
          >
            Hall da Fama
          </h2>
        </div>
        <HallOfFame isDarkMode={isDarkMode} category={category} />
      </div>
    </div>
    </PageTransition>
  );
}