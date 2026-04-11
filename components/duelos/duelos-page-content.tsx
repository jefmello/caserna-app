"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Flag,
  Gauge,
  Medal,
  ShieldAlert,
  Swords,
  Timer,
  Trophy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import RankingHeader from "@/components/ranking/ranking-header";
import useRankingData from "@/lib/hooks/useRankingData";
import useRankingFilters from "@/lib/hooks/useRankingFilters";
import useRankingScreenController from "@/lib/hooks/useRankingScreenController";
import {
  competitionLabels,
  getComparisonWinner,
  getDuelNarrative,
  getDuelProfileLabel,
  getPilotFirstAndLastName,
  getPilotWarNameDisplay,
} from "@/lib/ranking/ranking-utils";
import type { RankingItem } from "@/types/ranking";
import PageTransition from "@/components/ui/page-transition";

type DuelMetric = {
  label: string;
  shortLabel: string;
  a: number;
  b: number;
  lowerIsBetter: boolean;
  description: string;
};

type DuelSummary = {
  scoreA: number;
  scoreB: number;
  pointsWinner: "a" | "b" | "tie";
  advWinner: "a" | "b" | "tie";
  overallWinner: "a" | "b" | "tie";
  scoreDiff: number;
  pointsDiff: number;
  narrative: string;
  profileLabel: string;
};

function DuelSelectorCard({
  title,
  value,
  onChange,
  options,
  isDarkMode,
  theme,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  options: RankingItem[];
  isDarkMode: boolean;
  theme: any;
}) {
  return (
    <Card
      className={`rounded-[22px] shadow-sm ${
        isDarkMode
          ? "border border-white/10 bg-[#111827]"
          : "border-black/5 bg-white"
      }`}
    >
      <CardContent className="p-4">
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
            isDarkMode ? "text-zinc-500" : "text-zinc-400"
          }`}
        >
          {title}
        </p>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`mt-3 w-full rounded-[16px] border px-3 py-3 text-sm font-medium outline-none transition ${
            isDarkMode
              ? "border-white/10 bg-[#0f172a] text-white"
              : "border-black/5 bg-zinc-50 text-zinc-950"
          }`}
        >
          <option value="">Selecione um piloto</option>
          {options.map((pilot) => (
            <option
              key={`${title}-${pilot.pilotoId || pilot.piloto}`}
              value={pilot.pilotoId || pilot.piloto}
            >
              {getPilotFirstAndLastName(pilot.piloto)}
            </option>
          ))}
        </select>

        <p
          className={`mt-2 text-[12px] leading-snug ${
            isDarkMode ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          Escolha o piloto para montar o confronto premium.
        </p>
      </CardContent>
    </Card>
  );
}

function PilotInfoCard({
  title,
  pilot,
  score,
  isWinner,
  isDarkMode,
  theme,
}: {
  title: string;
  pilot: RankingItem;
  score: number;
  isWinner: boolean;
  isDarkMode: boolean;
  theme: any;
}) {
  return (
    <Card
      className={`rounded-[24px] shadow-sm transition-all duration-200 ${
        isDarkMode
          ? isWinner
            ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}`
            : "border border-white/10 bg-[#111827]"
          : isWinner
            ? "border-yellow-300/70 bg-yellow-50/80"
            : "border-black/5 bg-white"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p
              className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              {title}
            </p>
            <p
              className={`mt-2 text-[20px] font-bold leading-tight ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              {getPilotFirstAndLastName(pilot.piloto)}
            </p>

            {getPilotWarNameDisplay(pilot) ? (
              <p
                className={`mt-1 text-[12px] italic ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                {getPilotWarNameDisplay(pilot)}
              </p>
            ) : null}
          </div>

          <div
            className={`rounded-full border px-3 py-1 text-[11px] font-bold ${
              isDarkMode
                ? isWinner
                  ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                  : "border-white/10 bg-white/5 text-zinc-300"
                : isWinner
                  ? "border-yellow-300 bg-yellow-100 text-yellow-800"
                  : "border-black/5 bg-zinc-50 text-zinc-700"
            }`}
          >
            {score} pts duelo
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div
            className={`rounded-[16px] border px-3 py-2 ${
              isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50/80"
            }`}
          >
            <p
              className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Pontos
            </p>
            <p
              className={`mt-1 text-[16px] font-semibold ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              {pilot.pontos}
            </p>
          </div>

          <div
            className={`rounded-[16px] border px-3 py-2 ${
              isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50/80"
            }`}
          >
            <p
              className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Vitórias
            </p>
            <p
              className={`mt-1 text-[16px] font-semibold ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              {pilot.vitorias}
            </p>
          </div>

          <div
            className={`rounded-[16px] border px-3 py-2 ${
              isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50/80"
            }`}
          >
            <p
              className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Pódios
            </p>
            <p
              className={`mt-1 text-[16px] font-semibold ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              {pilot.podios}
            </p>
          </div>

          <div
            className={`rounded-[16px] border px-3 py-2 ${
              isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50/80"
            }`}
          >
            <p
              className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              ADV
            </p>
            <p
              className={`mt-1 text-[16px] font-semibold ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              {pilot.adv}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricRow({
  metric,
  isDarkMode,
}: {
  metric: DuelMetric & { winner: "a" | "b" | "tie" };
  isDarkMode: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[72px_1fr_56px_56px] items-center gap-2 rounded-[18px] border px-3 py-3 ${
        isDarkMode
          ? "border-white/10 bg-[#111827]"
          : "border-black/5 bg-white"
      }`}
    >
      <div>
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
            isDarkMode ? "text-zinc-500" : "text-zinc-400"
          }`}
        >
          {metric.shortLabel}
        </p>
      </div>

      <div className="min-w-0">
        <p
          className={`text-[14px] font-bold ${
            isDarkMode ? "text-white" : "text-zinc-950"
          }`}
        >
          {metric.label}
        </p>
        <p
          className={`mt-0.5 truncate text-[12px] ${
            isDarkMode ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          {metric.description}
        </p>
      </div>

      <div
        className={`rounded-[14px] px-2 py-2 text-center text-[12px] font-bold ${
          metric.winner === "a"
            ? isDarkMode
              ? "bg-emerald-500/10 text-emerald-300"
              : "bg-emerald-50 text-emerald-700"
            : isDarkMode
              ? "bg-white/5 text-zinc-300"
              : "bg-zinc-50 text-zinc-700"
        }`}
      >
        {metric.a}
      </div>

      <div
        className={`rounded-[14px] px-2 py-2 text-center text-[12px] font-bold ${
          metric.winner === "b"
            ? isDarkMode
              ? "bg-emerald-500/10 text-emerald-300"
              : "bg-emerald-50 text-emerald-700"
            : isDarkMode
              ? "bg-white/5 text-zinc-300"
              : "bg-zinc-50 text-zinc-700"
        }`}
      >
        {metric.b}
      </div>
    </div>
  );
}

export default function DuelosPageContent() {
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

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [comparePilotAId, setComparePilotAId] = useState("");
  const [comparePilotBId, setComparePilotBId] = useState("");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("caserna-theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("caserna-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const { theme } = useRankingScreenController({
    category,
    competition,
    isDarkMode,
    filteredRanking,
    rankingData,
    leader,
    currentCompetitionMeta,
  });

  const comparePilotA = useMemo(
    () =>
      filteredRanking.find((item) => (item.pilotoId || item.piloto) === comparePilotAId) ||
      null,
    [filteredRanking, comparePilotAId]
  );

  const comparePilotB = useMemo(
    () =>
      filteredRanking.find((item) => (item.pilotoId || item.piloto) === comparePilotBId) ||
      null,
    [filteredRanking, comparePilotBId]
  );

  const duelMetrics = useMemo<DuelMetric[]>(() => {
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

  const duelSummary = useMemo<DuelSummary | null>(() => {
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

  const duelMetricsWithWinner = useMemo(() => {
    return duelMetrics.map((metric) => ({
      ...metric,
      winner: getComparisonWinner(metric.a, metric.b, metric.lowerIsBetter),
    }));
  }, [duelMetrics]);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleRetry = () => {
    retry();
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
          Carregando duelos...
        </p>
        <p
          className={`mt-2 text-sm ${
            isDarkMode ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          Preparando confronto premium entre pilotos
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

      <Card
        className={`rounded-[24px] shadow-sm ${
          isDarkMode
            ? "border border-white/10 bg-[#111827]"
            : "border-black/5 bg-white"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Confronto premium
              </p>
              <h3
                className={`mt-1 text-[20px] font-bold tracking-tight ${
                  isDarkMode ? "text-white" : "text-zinc-950"
                }`}
              >
                Duelo oficial da rodada
              </h3>
              <p
                className={`mt-2 text-[12px] leading-snug ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                Compare dois pilotos do recorte atual e entenda quem chega mais forte
                em pontos, ritmo, consistência e disciplina.
              </p>
            </div>

            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
              }`}
            >
              <Swords
                className={`h-5 w-5 ${
                  isDarkMode ? theme.darkAccentText : theme.primaryIcon
                }`}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DuelSelectorCard
          title="Piloto A"
          value={comparePilotAId}
          onChange={setComparePilotAId}
          options={filteredRanking}
          isDarkMode={isDarkMode}
          theme={theme}
        />

        <DuelSelectorCard
          title="Piloto B"
          value={comparePilotBId}
          onChange={setComparePilotBId}
          options={filteredRanking}
          isDarkMode={isDarkMode}
          theme={theme}
        />
      </div>

      {!comparePilotA || !comparePilotB ? (
        <Card
          className={`rounded-[24px] shadow-sm ${
            isDarkMode
              ? "border border-white/10 bg-[#111827]"
              : "border-black/5 bg-white"
          }`}
        >
          <CardContent className="p-6 text-center">
            <div
              className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-3xl ${
                isDarkMode ? "bg-white/5" : "bg-zinc-100"
              }`}
            >
              <ShieldAlert
                className={`h-6 w-6 ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-500"
                }`}
              />
            </div>

            <p
              className={`text-[20px] font-bold tracking-tight ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              Selecione dois pilotos
            </p>

            <p
              className={`mt-2 text-[14px] leading-snug ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              O comparativo premium será montado automaticamente quando os dois lados
              do duelo estiverem definidos.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_120px_minmax(0,1fr)] xl:items-stretch">
            <PilotInfoCard
              title="Piloto A"
              pilot={comparePilotA}
              score={duelSummary?.scoreA || 0}
              isWinner={duelSummary?.overallWinner === "a"}
              isDarkMode={isDarkMode}
              theme={theme}
            />

            <Card
              className={`rounded-[24px] shadow-sm ${
                isDarkMode
                  ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}`
                  : "border-black/5 bg-white"
              }`}
            >
              <CardContent className="flex h-full flex-col items-center justify-center p-4 text-center">
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Score
                </p>
                <p
                  className={`mt-2 text-[30px] font-extrabold leading-none ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  {duelSummary ? `${duelSummary.scoreA} x ${duelSummary.scoreB}` : "- x -"}
                </p>
                <p
                  className={`mt-3 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${duelIntensity.tone}`}
                >
                  {duelIntensity.label}
                </p>
              </CardContent>
            </Card>

            <PilotInfoCard
              title="Piloto B"
              pilot={comparePilotB}
              score={duelSummary?.scoreB || 0}
              isWinner={duelSummary?.overallWinner === "b"}
              isDarkMode={isDarkMode}
              theme={theme}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <Card
              className={`rounded-[24px] shadow-sm ${
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
                      Leitura por métricas
                    </p>
                    <h3
                      className={`mt-1 text-[20px] font-bold tracking-tight ${
                        isDarkMode ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      Territórios do duelo
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-center">
                    <div
                      className={`rounded-[12px] px-2 py-1 text-[10px] font-bold ${
                        isDarkMode ? "bg-white/5 text-zinc-300" : "bg-zinc-50 text-zinc-700"
                      }`}
                    >
                      A
                    </div>
                    <div
                      className={`rounded-[12px] px-2 py-1 text-[10px] font-bold ${
                        isDarkMode ? "bg-white/5 text-zinc-300" : "bg-zinc-50 text-zinc-700"
                      }`}
                    >
                      B
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {duelMetricsWithWinner.map((metric) => (
                    <MetricRow
                      key={`duel-metric-${metric.label}`}
                      metric={metric}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card
                className={`rounded-[24px] shadow-sm ${
                  isDarkMode
                    ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}`
                    : "border-black/5 bg-white"
                }`}
              >
                <CardContent className="p-4">
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                      isDarkMode ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    Narrativa oficial
                  </p>
                  <p
                    className={`mt-2 text-[20px] font-bold leading-tight ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    {duelSummary?.profileLabel}
                  </p>
                  <p
                    className={`mt-2 text-[14px] leading-snug ${
                      isDarkMode ? "text-zinc-300" : "text-zinc-700"
                    }`}
                  >
                    {duelSummary?.narrative}
                  </p>
                </CardContent>
              </Card>

              <Card
                className={`rounded-[24px] shadow-sm ${
                  isDarkMode
                    ? "border border-white/10 bg-[#111827]"
                    : "border-black/5 bg-white"
                }`}
              >
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Gauge
                      className={`h-4.5 w-4.5 ${
                        isDarkMode ? theme.darkAccentText : theme.primaryIcon
                      }`}
                    />
                    <p
                      className={`text-[12px] font-bold uppercase tracking-[0.14em] ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      Leituras rápidas
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div
                      className={`rounded-[18px] border px-3 py-3 ${
                        isDarkMode
                          ? "border-white/10 bg-[#0f172a]"
                          : "border-black/5 bg-zinc-50/80"
                      }`}
                    >
                      <p
                        className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                          isDarkMode ? "text-zinc-500" : "text-zinc-400"
                        }`}
                      >
                        Quem lidera em pontos
                      </p>
                      <p
                        className={`mt-1 text-[14px] font-semibold ${
                          isDarkMode ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        {duelSummary?.pointsWinner === "a"
                          ? getPilotFirstAndLastName(comparePilotA.piloto)
                          : duelSummary?.pointsWinner === "b"
                            ? getPilotFirstAndLastName(comparePilotB.piloto)
                            : "Empate"}
                      </p>
                    </div>

                    <div
                      className={`rounded-[18px] border px-3 py-3 ${
                        isDarkMode
                          ? "border-white/10 bg-[#0f172a]"
                          : "border-black/5 bg-zinc-50/80"
                      }`}
                    >
                      <p
                        className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                          isDarkMode ? "text-zinc-500" : "text-zinc-400"
                        }`}
                      >
                        Melhor disciplina
                      </p>
                      <p
                        className={`mt-1 text-[14px] font-semibold ${
                          isDarkMode ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        {duelSummary?.advWinner === "a"
                          ? getPilotFirstAndLastName(comparePilotA.piloto)
                          : duelSummary?.advWinner === "b"
                            ? getPilotFirstAndLastName(comparePilotB.piloto)
                            : "Empate"}
                      </p>
                    </div>

                    <div
                      className={`rounded-[18px] border px-3 py-3 ${
                        isDarkMode
                          ? "border-white/10 bg-[#0f172a]"
                          : "border-black/5 bg-zinc-50/80"
                      }`}
                    >
                      <p
                        className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                          isDarkMode ? "text-zinc-500" : "text-zinc-400"
                        }`}
                      >
                        Próximo movimento
                      </p>
                      <Link
                        href="/midia"
                        className={`mt-1 inline-flex items-center gap-2 text-[14px] font-semibold ${
                          isDarkMode ? theme.darkAccentText : "text-zinc-950"
                        }`}
                      >
                        Gerar arte do duelo
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <p
                        className={`mt-1 text-[11px] ${
                          isDarkMode ? "text-zinc-400" : "text-zinc-500"
                        }`}
                      >
                        Use a central de mídia para exportar o confronto.
                      </p>
                    </div>
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
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      className={`rounded-[16px] border px-3 py-3 ${
                        isDarkMode
                          ? "border-white/10 bg-[#0f172a]"
                          : "border-black/5 bg-zinc-50/80"
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <Trophy
                          className={`h-4 w-4 ${
                            isDarkMode ? theme.darkAccentText : theme.primaryIcon
                          }`}
                        />
                        <p
                          className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                            isDarkMode ? "text-zinc-500" : "text-zinc-400"
                          }`}
                        >
                          Pontos
                        </p>
                      </div>
                      <p
                        className={`text-[16px] font-semibold ${
                          isDarkMode ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        {Math.abs(comparePilotA.pontos - comparePilotB.pontos)}
                      </p>
                    </div>

                    <div
                      className={`rounded-[16px] border px-3 py-3 ${
                        isDarkMode
                          ? "border-white/10 bg-[#0f172a]"
                          : "border-black/5 bg-zinc-50/80"
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <Flag
                          className={`h-4 w-4 ${
                            isDarkMode ? theme.darkAccentText : theme.primaryIcon
                          }`}
                        />
                        <p
                          className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                            isDarkMode ? "text-zinc-500" : "text-zinc-400"
                          }`}
                        >
                          Vitórias
                        </p>
                      </div>
                      <p
                        className={`text-[16px] font-semibold ${
                          isDarkMode ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        {Math.abs(comparePilotA.vitorias - comparePilotB.vitorias)}
                      </p>
                    </div>

                    <div
                      className={`rounded-[16px] border px-3 py-3 ${
                        isDarkMode
                          ? "border-white/10 bg-[#0f172a]"
                          : "border-black/5 bg-zinc-50/80"
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <Medal
                          className={`h-4 w-4 ${
                            isDarkMode ? theme.darkAccentText : theme.primaryIcon
                          }`}
                        />
                        <p
                          className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                            isDarkMode ? "text-zinc-500" : "text-zinc-400"
                          }`}
                        >
                          Pódios
                        </p>
                      </div>
                      <p
                        className={`text-[16px] font-semibold ${
                          isDarkMode ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        {Math.abs(comparePilotA.podios - comparePilotB.podios)}
                      </p>
                    </div>

                    <div
                      className={`rounded-[16px] border px-3 py-3 ${
                        isDarkMode
                          ? "border-white/10 bg-[#0f172a]"
                          : "border-black/5 bg-zinc-50/80"
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <Timer
                          className={`h-4 w-4 ${
                            isDarkMode ? theme.darkAccentText : theme.primaryIcon
                          }`}
                        />
                        <p
                          className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                            isDarkMode ? "text-zinc-500" : "text-zinc-400"
                          }`}
                        >
                          VMR
                        </p>
                      </div>
                      <p
                        className={`text-[16px] font-semibold ${
                          isDarkMode ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        {Math.abs(comparePilotA.mv - comparePilotB.mv)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
    </PageTransition>
  );
}