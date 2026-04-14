"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Crown,
  Flag,
  Gauge,
  Medal,
  Sparkles,
  Swords,
  Trophy,
  UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SectionDivider from "@/components/ui/section-divider";
import RankingHeader from "@/components/ranking/ranking-header";
import useRankingData from "@/lib/hooks/useRankingData";
import useRankingFilters from "@/lib/hooks/useRankingFilters";
import { useChampionship } from "@/context/championship-context";
import { competitionLabels, getCategoryTheme, getPilotFirstAndLastName } from "@/lib/ranking/ranking-utils";
import CustomScenarioBuilder from "@/components/simulacoes/custom-scenario-builder";
import PageTransition, { StaggerContainer, StaggerItem } from "@/components/ui/page-transition";
import {
  buildTitleProbabilityCandidates,
  type TitleProbabilityCandidate,
} from "@/lib/ranking/title-probability-engine";
import {
  DEFAULT_COMPLETED_STAGES,
  getMaxPointsFromStages,
  getRemainingChampionshipStages,
  getStageMaxPoints,
  getStagePodiumScenarioPoints,
} from "@/lib/ranking/stage-points-engine";
import {
  buildNextStageScenarios,
  type NextStageScenario,
} from "@/lib/ranking/next-stage-simulator";
import type { RankingItem } from "@/types/ranking";

function SectionTitle({
  title,
  subtitle,
  icon: Icon,
  isDarkMode,
  theme,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  isDarkMode: boolean;
  theme: ReturnType<typeof getCategoryTheme>;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[22px] border shadow-sm ${
        isDarkMode
          ? `${theme.darkAccentBorder} bg-[#111827]`
          : "border-black/5 bg-white"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
          }`}
        >
          <Icon className={`h-5 w-5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
        </div>

        <div>
          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
              isDarkMode ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            Centro de projeções
          </p>
          <h2
            className={`text-[20px] font-extrabold tracking-tight ${
              isDarkMode ? "text-white" : "text-zinc-950"
            }`}
          >
            {title}
          </h2>
          <p
            className={`mt-0.5 text-[12px] ${
              isDarkMode ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
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
  theme: ReturnType<typeof getCategoryTheme>;
  accent?: boolean;
}) {
  return (
    <Card
      className={`rounded-[22px] shadow-sm transition-all duration-200 hover:-translate-y-[1px] ${
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
            className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
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

function ProbabilityRow({
  candidate,
  leaderPoints,
  titlePointsStillAvailable,
  isDarkMode,
  theme,
  onSelectPilot,
}: {
  candidate: TitleProbabilityCandidate;
  leaderPoints: number;
  titlePointsStillAvailable: number;
  isDarkMode: boolean;
  theme: ReturnType<typeof getCategoryTheme>;
  onSelectPilot: (pilot: RankingItem) => void;
}) {
  const pointsBehind = Math.max(leaderPoints - candidate.pilot.pontos, 0);
  const isAlive = pointsBehind <= titlePointsStillAvailable || pointsBehind === 0;

  return (
    <button
      type="button"
      onClick={() => onSelectPilot(candidate.pilot)}
      title="Abrir piloto"
      className={`w-full rounded-[20px] border px-3 py-3 text-left transition-all duration-200 ${
        isDarkMode
          ? "border-white/10 bg-[#111827] hover:border-white/20 hover:bg-[#162033]"
          : "border-black/5 bg-white hover:bg-zinc-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={`truncate text-[14px] font-semibold tracking-tight ${
              isDarkMode ? "text-white" : "text-zinc-950"
            }`}
          >
            {getPilotFirstAndLastName(candidate.pilot.piloto)}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                isAlive
                  ? isDarkMode
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : isDarkMode
                    ? "border-red-500/30 bg-red-500/10 text-red-300"
                    : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {isAlive ? "vivo na matemática" : "limite crítico"}
            </span>

            <span
              className={`text-[12px] font-medium ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              {candidate.pilot.pontos} pts • {pointsBehind} pts atrás
            </span>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p
            className={`text-[24px] font-extrabold leading-none ${
              isDarkMode ? theme.darkAccentText : "text-zinc-950"
            }`}
          >
            {Number(candidate.probability || 0).toFixed(2)}%
          </p>
          <p
            className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
              isDarkMode ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            chance atual
          </p>
        </div>
      </div>
    </button>
  );
}

function ScenarioRow({
  scenario,
  isDarkMode,
  theme,
  onSelectPilot,
}: {
  scenario: NextStageScenario;
  isDarkMode: boolean;
  theme: ReturnType<typeof getCategoryTheme>;
  onSelectPilot: (pilot: RankingItem) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelectPilot(scenario.pilot)}
      title="Abrir piloto"
      className={`w-full rounded-[20px] border px-3 py-3 text-left transition-all duration-200 ${
        isDarkMode
          ? "border-white/10 bg-[#111827] hover:border-white/20 hover:bg-[#162033]"
          : "border-black/5 bg-white hover:bg-zinc-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={`truncate text-[14px] font-semibold tracking-tight ${
              isDarkMode ? "text-white" : "text-zinc-950"
            }`}
          >
            {getPilotFirstAndLastName(scenario.pilot.piloto)}
          </p>
          <p
            className={`mt-1 text-[12px] ${
              isDarkMode ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            Probabilidade se vencer a próxima etapa: {Number(scenario.winProbability || 0).toFixed(2)}%
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p
            className={`text-[20px] font-extrabold leading-none ${
              isDarkMode ? theme.darkAccentText : "text-zinc-950"
            }`}
          >
            {scenario.winDelta > 0 ? "+" : ""}
            {scenario.winDelta}
          </p>
          <p
            className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
              isDarkMode ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            delta
          </p>
        </div>
      </div>
    </button>
  );
}

export default function SimulacoesPageContent() {
  const router = useRouter();
  const { isDarkMode, toggleTheme, categoria, campeonato } = useChampionship();

  const { rankingData, rankingMeta, categories, loading, error, retry } =
    useRankingData({ categoria, campeonato });

  const {
    category,
    setCategory,
    competition,
    setCompetition,
    availableCompetitions,
    filteredRanking,
    leader,
  } = useRankingFilters({
    rankingData,
    rankingMeta,
    categories,
  });

  const theme = useMemo(() => getCategoryTheme(category), [category]);

  const completedStages = useMemo(() => DEFAULT_COMPLETED_STAGES, []);

  const remainingStages = useMemo(
    () => getRemainingChampionshipStages(competition, completedStages),
    [competition, completedStages]
  );

  const titlePointsStillAvailable = useMemo(
    () => getMaxPointsFromStages(remainingStages),
    [remainingStages]
  );

  const titleProbabilities = useMemo<TitleProbabilityCandidate[]>(() => {
    return buildTitleProbabilityCandidates({
      ranking: filteredRanking,
      competition,
      titlePointsStillAvailable,
    });
  }, [filteredRanking, competition, titlePointsStillAvailable]);

  const titleProbabilitySummary = useMemo(() => {
    if (titleProbabilities.length === 0) {
      return {
        headline: "Sem leitura",
        body: "Ainda não há pilotos suficientes para projetar a disputa pelo título.",
      };
    }

    const favorite = titleProbabilities[0];
    const realisticContenders = titleProbabilities.filter(
      (candidate) => candidate.probability >= 12
    ).length;

    if (favorite.probability >= 42) {
      return {
        headline: "Favoritismo claro",
        body: `${getPilotFirstAndLastName(
          favorite.pilot.piloto
        )} controla a matemática atual e lidera a projeção oficial do título.`,
      };
    }

    if (realisticContenders >= 3) {
      return {
        headline: "Título em aberto",
        body: `A leitura matemática mantém ${realisticContenders} pilotos com presença real na briga pelo campeonato.`,
      };
    }

    if (realisticContenders === 2) {
      return {
        headline: "Disputa concentrada",
        body: `A corrida pelo título está mais apertada entre ${getPilotFirstAndLastName(
          titleProbabilities[0].pilot.piloto
        )} e ${getPilotFirstAndLastName(titleProbabilities[1].pilot.piloto)}.`,
      };
    }

    return {
      headline: "Briga de perseguição",
      body: `O pelotão ainda precisa recuperar ${favorite.pointsBehindLeader} pts para ameaçar o favorito matemático.`,
      };
  }, [titleProbabilities]);

  const nextStageNumber = remainingStages[0] || null;

  const nextStageWinPoints = useMemo(
    () => (nextStageNumber ? getStageMaxPoints(nextStageNumber) : 0),
    [nextStageNumber]
  );

  const nextStagePodiumPoints = useMemo(
    () => (nextStageNumber ? getStagePodiumScenarioPoints(nextStageNumber) : 0),
    [nextStageNumber]
  );

  const nextStageScenarios = useMemo<NextStageScenario[]>(() => {
    return buildNextStageScenarios({
      nextStageNumber,
      titleProbabilities,
      filteredRanking,
      competition,
      titlePointsStillAvailable,
    });
  }, [
    nextStageNumber,
    titleProbabilities,
    filteredRanking,
    competition,
    titlePointsStillAvailable,
  ]);

  const nextStageSummary = useMemo(() => {
    if (!nextStageNumber || nextStageScenarios.length === 0) {
      return {
        headline: "Sem próxima etapa projetada",
        body: "O simulador volta a ficar disponível quando houver etapa restante no calendário.",
      };
    }

    const biggestJump = [...nextStageScenarios].sort((a, b) => b.winDelta - a.winDelta)[0];
    const aliveCount = nextStageScenarios.filter(
      (candidate) => candidate.winProbability >= 12
    ).length;

    if (biggestJump && biggestJump.winDelta >= 6) {
      return {
        headline: `Etapa ${nextStageNumber} pode virar o campeonato`,
        body: `${getPilotFirstAndLastName(
          biggestJump.pilot.piloto
        )} é quem mais cresce se vencer a próxima bateria máxima e pode reabrir o título com força real.`,
      };
    }

    if (aliveCount >= 4) {
      return {
        headline: "Próxima etapa mantém a disputa aberta",
        body: `A simulação ainda deixa ${aliveCount} pilotos vivos em cenário competitivo se a próxima etapa mexer no bloco da frente.`,
      };
    }

    return {
      headline: "Próxima etapa tende a consolidar o topo",
      body: "Sem grande virada imediata, a próxima prova reforça mais o controle do pelotão principal do que uma ruptura matemática.",
    };
  }, [nextStageNumber, nextStageScenarios]);

  const leaderPoints = filteredRanking[0]?.pontos || 0;

  const mathematicalStatusRows = useMemo(() => {
    return filteredRanking.map((pilot) => {
      const pointsBehind = Math.max(leaderPoints - pilot.pontos, 0);
      const stillAlive = pointsBehind <= titlePointsStillAvailable || pointsBehind === 0;

      return {
        pilot,
        pointsBehind,
        stillAlive,
      };
    });
  }, [filteredRanking, leaderPoints, titlePointsStillAvailable]);

  const handleToggleDarkMode = toggleTheme;

  const handleRetry = () => {
    retry();
  };

  const handleSelectPilot = (pilot: RankingItem) => {
    const pilotId = pilot.pilotoId || "";
    router.push(pilotId ? `/pilotos?pilotId=${pilotId}` : "/pilotos");
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
          Carregando simulações...
        </p>
        <p
          className={`mt-2 text-sm ${
            isDarkMode ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          Preparando projeções do campeonato
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

      <SectionTitle
        title="Leitura matemática do campeonato"
        subtitle={`${category} · ${competitionLabels[competition] || competition}`}
        icon={Sparkles}
        isDarkMode={isDarkMode}
        theme={theme}
      />

      <StaggerContainer className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StaggerItem>
        <SummaryCard
          title="Pontos restantes"
          value={titlePointsStillAvailable}
          subtitle="Pontuação máxima ainda disponível no calendário atual."
          icon={Trophy}
          isDarkMode={isDarkMode}
          theme={theme}
          accent
        />
        </StaggerItem>
        <StaggerItem>
        <SummaryCard
          title="Próxima etapa"
          value={nextStageNumber || "-"}
          subtitle="Número da próxima etapa que ainda impacta a matemática."
          icon={Flag}
          isDarkMode={isDarkMode}
          theme={theme}
        />
        </StaggerItem>
        <StaggerItem>
        <SummaryCard
          title="Vitória máxima"
          value={nextStageWinPoints || 0}
          subtitle="Pontos possíveis para vitória total na próxima etapa."
          icon={Crown}
          isDarkMode={isDarkMode}
          theme={theme}
        />
        </StaggerItem>
        <StaggerItem>
        <SummaryCard
          title="Cenário pódio"
          value={nextStagePodiumPoints || 0}
          subtitle="Pontuação de referência para cenário forte de pódio."
          icon={Medal}
          isDarkMode={isDarkMode}
          theme={theme}
        />
        </StaggerItem>
      </StaggerContainer>

      <SectionDivider />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
        <Card
          className={`rounded-[24px] shadow-sm ${
            isDarkMode
              ? "border border-white/10 bg-[#111827]"
              : "border-black/5 bg-white"
          }`}
        >
          <CardHeader className="pb-3">
            <CardTitle
              className={`flex items-center gap-2 text-[20px] font-extrabold tracking-tight ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              <Trophy className={`h-5 w-5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
              Probabilidade de título
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div
              className={`rounded-[20px] border px-4 py-4 ${
                isDarkMode
                  ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}`
                  : "border-black/5 bg-zinc-50/80"
              }`}
            >
              <p
                className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Headline oficial
              </p>
              <p
                className={`mt-2 text-[20px] font-extrabold leading-tight ${
                  isDarkMode ? "text-white" : "text-zinc-950"
                }`}
              >
                {titleProbabilitySummary.headline}
              </p>
              <p
                className={`mt-2 text-[14px] leading-snug ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                {titleProbabilitySummary.body}
              </p>
            </div>

            <div className="space-y-2">
              {titleProbabilities.length > 0 ? (
                titleProbabilities.map((candidate) => (
                  <ProbabilityRow
                    key={`prob-${candidate.pilot.pilotoId || candidate.pilot.piloto}`}
                    candidate={candidate}
                    leaderPoints={leaderPoints}
                    titlePointsStillAvailable={titlePointsStillAvailable}
                    isDarkMode={isDarkMode}
                    theme={theme}
                    onSelectPilot={handleSelectPilot}
                  />
                ))
              ) : (
                <div
                  className={`rounded-[20px] border border-dashed px-4 py-8 text-center text-sm ${
                    isDarkMode
                      ? "border-white/10 bg-[#0f172a] text-zinc-400"
                      : "border-black/10 bg-zinc-50 text-zinc-500"
                  }`}
                >
                  Ainda não há leitura suficiente para projetar o título.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card
          className={`rounded-[24px] shadow-sm ${
            isDarkMode
              ? "border border-white/10 bg-[#111827]"
              : "border-black/5 bg-white"
          }`}
        >
          <CardHeader className="pb-3">
            <CardTitle
              className={`flex items-center gap-2 text-[20px] font-extrabold tracking-tight ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              <Gauge className={`h-5 w-5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
              Status matemático
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            {mathematicalStatusRows.length > 0 ? (
              mathematicalStatusRows.map(({ pilot, pointsBehind, stillAlive }, index) => (
                <button
                  key={`math-${pilot.pilotoId || pilot.piloto}-${index}`}
                  type="button"
                  onClick={() => handleSelectPilot(pilot)}
                  title="Abrir piloto"
                  className={`w-full rounded-[18px] border px-3 py-3 text-left transition-all duration-200 ${
                    isDarkMode
                      ? "border-white/10 bg-[#0f172a] hover:border-white/20 hover:bg-[#162033]"
                      : "border-black/5 bg-zinc-50/80 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className={`truncate text-[14px] font-semibold ${
                          isDarkMode ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        {getPilotFirstAndLastName(pilot.piloto)}
                      </p>
                      <p
                        className={`mt-1 text-[12px] ${
                          isDarkMode ? "text-zinc-400" : "text-zinc-500"
                        }`}
                      >
                        {pointsBehind === 0
                          ? "Líder da matemática atual."
                          : `${pointsBehind} pts atrás do líder.`}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                        stillAlive
                          ? isDarkMode
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : isDarkMode
                            ? "border-red-500/30 bg-red-500/10 text-red-300"
                            : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {stillAlive ? "ainda vivo" : "fora do alcance"}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div
                className={`rounded-[20px] border border-dashed px-4 py-8 text-center text-sm ${
                  isDarkMode
                    ? "border-white/10 bg-[#0f172a] text-zinc-400"
                    : "border-black/10 bg-zinc-50 text-zinc-500"
                }`}
              >
                Sem pilotos suficientes para calcular o status matemático.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <SectionDivider />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
        <Card
          className={`rounded-[24px] shadow-sm ${
            isDarkMode
              ? "border border-white/10 bg-[#111827]"
              : "border-black/5 bg-white"
          }`}
        >
          <CardHeader className="pb-3">
            <CardTitle
              className={`flex items-center gap-2 text-[20px] font-extrabold tracking-tight ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              <Flag className={`h-5 w-5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
              Simulador da próxima etapa
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div
              className={`rounded-[20px] border px-4 py-4 ${
                isDarkMode
                  ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}`
                  : "border-black/5 bg-zinc-50/80"
              }`}
            >
              <p
                className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Headline oficial
              </p>
              <p
                className={`mt-2 text-[20px] font-extrabold leading-tight ${
                  isDarkMode ? "text-white" : "text-zinc-950"
                }`}
              >
                {nextStageSummary.headline}
              </p>
              <p
                className={`mt-2 text-[14px] leading-snug ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                {nextStageSummary.body}
              </p>
            </div>

            <div className="space-y-2">
              {nextStageScenarios.length > 0 ? (
                nextStageScenarios.map((scenario) => (
                  <ScenarioRow
                    key={`scenario-${scenario.pilot.pilotoId || scenario.pilot.piloto}`}
                    scenario={scenario}
                    isDarkMode={isDarkMode}
                    theme={theme}
                    onSelectPilot={handleSelectPilot}
                  />
                ))
              ) : (
                <div
                  className={`rounded-[20px] border border-dashed px-4 py-8 text-center text-sm ${
                    isDarkMode
                      ? "border-white/10 bg-[#0f172a] text-zinc-400"
                      : "border-black/10 bg-zinc-50 text-zinc-500"
                  }`}
                >
                  O simulador volta a aparecer quando houver uma próxima etapa disponível.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <SectionDivider />

        {/* Cenário personalizado */}
        <Card
          className={`rounded-[24px] shadow-sm ${
            isDarkMode
              ? "border border-white/10 bg-[#111827]"
              : "border-black/5 bg-white"
          }`}
        >
          <CardHeader className="pb-3">
            <CardTitle
              className={`flex items-center gap-2 text-[20px] font-extrabold tracking-tight ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              <UserPlus className={`h-5 w-5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
              Monte seu próprio cenário
            </CardTitle>
          </CardHeader>

          <CardContent>
            {nextStageNumber ? (
              <CustomScenarioBuilder
                ranking={filteredRanking.filter((p) => p.pontos > 0)}
                stageNumber={nextStageNumber}
                category={category}
                isDarkMode={isDarkMode}
                onSelectPilot={handleSelectPilot}
              />
            ) : (
              <div
                className={`rounded-[20px] border border-dashed px-4 py-8 text-center text-sm ${
                  isDarkMode
                    ? "border-white/10 bg-[#0f172a] text-zinc-400"
                    : "border-black/10 bg-zinc-50 text-zinc-500"
                }`}
              >
                Disponível quando houver uma próxima etapa definida.
              </div>
            )}
          </CardContent>
        </Card>

        <Card
          className={`rounded-[24px] shadow-sm ${
            isDarkMode
              ? "border border-white/10 bg-[#111827]"
              : "border-black/5 bg-white"
          }`}
        >
          <CardHeader className="pb-3">
            <CardTitle
              className={`flex items-center gap-2 text-[20px] font-extrabold tracking-tight ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              <Swords className={`h-5 w-5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
              Leituras rápidas
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <button
              type="button"
              onClick={() => titleProbabilities[0] && handleSelectPilot(titleProbabilities[0].pilot)}
              title="Abrir piloto"
              className={`w-full rounded-[20px] border px-4 py-4 text-left transition-all duration-200 ${
                isDarkMode
                  ? "border-white/10 bg-[#0f172a] hover:border-white/20 hover:bg-[#162033]"
                  : "border-black/5 bg-zinc-50/80 hover:bg-white"
              }`}
            >
              <p
                className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Favorito atual
              </p>
              <p
                className={`mt-2 text-[20px] font-extrabold leading-tight ${
                  isDarkMode ? "text-white" : "text-zinc-950"
                }`}
              >
                {titleProbabilities[0]
                  ? getPilotFirstAndLastName(titleProbabilities[0].pilot.piloto)
                  : "Sem leitura"}
              </p>
              <p
                className={`mt-2 text-[12px] ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                {titleProbabilities[0]
                  ? `${Number(titleProbabilities[0].probability || 0).toFixed(2)}% de probabilidade de título neste momento.`
                  : "Ainda não há pilotos suficientes para projeção."}
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                const biggest = [...nextStageScenarios].sort((a, b) => b.winDelta - a.winDelta)[0];
                if (biggest) handleSelectPilot(biggest.pilot);
              }}
              title="Abrir piloto"
              className={`w-full rounded-[20px] border px-4 py-4 text-left transition-all duration-200 ${
                isDarkMode
                  ? "border-white/10 bg-[#0f172a] hover:border-white/20 hover:bg-[#162033]"
                  : "border-black/5 bg-zinc-50/80 hover:bg-white"
              }`}
            >
              <p
                className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Pressão da próxima etapa
              </p>
              <p
                className={`mt-2 text-[20px] font-extrabold leading-tight ${
                  isDarkMode ? "text-white" : "text-zinc-950"
                }`}
              >
                {nextStageScenarios[0]
                  ? getPilotFirstAndLastName(
                      [...nextStageScenarios].sort((a, b) => b.winDelta - a.winDelta)[0].pilot.piloto
                    )
                  : "Sem pressão definida"}
              </p>
              <p
                className={`mt-2 text-[12px] ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                {nextStageScenarios[0]
                  ? "Piloto com maior crescimento potencial caso vença a próxima etapa."
                  : "Sem etapa futura disponível para medir impacto."}
              </p>
            </button>

            <div
              className={`rounded-[20px] border px-4 py-4 ${
                isDarkMode
                  ? "border-white/10 bg-[#0f172a]"
                  : "border-black/5 bg-zinc-50/80"
              }`}
            >
              <p
                className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Observação oficial
              </p>
              <p
                className={`mt-2 text-[14px] leading-snug ${
                  isDarkMode ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                A matemática da temporada continua baseada no recorte atual de{" "}
                <span className="font-semibold">{category}</span> em{" "}
                <span className="font-semibold">
                  {competitionLabels[competition] || competition}
                </span>
                . A quantidade de pontos restantes e o peso da próxima etapa são o
                centro da leitura desta tela.
              </p>

              <div className="mt-3 flex items-center gap-2">
                <ArrowUpRight
                  className={`h-4 w-4 ${
                    isDarkMode ? theme.darkAccentText : theme.primaryIcon
                  }`}
                />
                <p
                  className={`text-[12px] font-medium ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-600"
                  }`}
                >
                  Use esta página como central de decisão para cenários futuros.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </PageTransition>
  );
}