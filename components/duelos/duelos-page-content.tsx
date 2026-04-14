"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Download,
  Flag,
  Gauge,
  Medal,
  Share2,
  ShieldAlert,
  Swords,
  Timer,
  Trophy,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SectionDivider from "@/components/ui/section-divider";
import RankingHeader from "@/components/ranking/ranking-header";
import { useChampionship } from "@/context/championship-context";
import useRankingData from "@/lib/hooks/useRankingData";
import useRankingFilters from "@/lib/hooks/useRankingFilters";
import useRankingScreenController from "@/lib/hooks/useRankingScreenController";
import useRankingShare from "@/lib/hooks/useRankingShare";
import {
  competitionLabels,
  getComparisonWinner,
  getDuelNarrative,
  getDuelProfileLabel,
  getPilotFirstAndLastName,
  getPilotWarNameDisplay,
} from "@/lib/ranking/ranking-utils";
import { resolvePilotKey } from "@/lib/ranking/stage-points-engine";
import type { RankingItem } from "@/types/ranking";
import PageTransition from "@/components/ui/page-transition";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

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
  position,
  score,
  isWinner,
  isDarkMode,
  theme,
}: {
  title: string;
  pilot: RankingItem;
  position: number;
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
              #{position} {getPilotFirstAndLastName(pilot.piloto)}
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
  pilotAName,
  pilotBName,
}: {
  metric: DuelMetric & { winner: "a" | "b" | "tie" };
  isDarkMode: boolean;
  pilotAName: string;
  pilotBName: string;
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
        {metric.a + metric.b > 0 && (
          <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full">
            <div
              className={`transition-all duration-300 ${
                metric.winner === "a"
                  ? "bg-emerald-500"
                  : isDarkMode
                    ? "bg-zinc-600"
                    : "bg-zinc-300"
              }`}
              style={{ width: `${(metric.a / (metric.a + metric.b)) * 100}%` }}
            />
            <div
              className={`transition-all duration-300 ${
                metric.winner === "b"
                  ? "bg-emerald-500"
                  : isDarkMode
                    ? "bg-zinc-600"
                    : "bg-zinc-300"
              }`}
              style={{ width: `${(metric.b / (metric.a + metric.b)) * 100}%` }}
            />
          </div>
        )}
        {metric.a + metric.b > 0 && (
          <div className="mt-0.5 flex justify-between">
            <span className={`text-[9px] font-semibold ${isDarkMode ? "text-zinc-600" : "text-zinc-400"}`}>
              {pilotAName}
            </span>
            <span className={`text-[9px] font-semibold ${isDarkMode ? "text-zinc-600" : "text-zinc-400"}`}>
              {pilotBName}
            </span>
          </div>
        )}
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
    currentCompetitionMeta,
  } = useRankingFilters({
    rankingData,
    rankingMeta,
    categories,
  });


  const [comparePilotAId, setComparePilotAId] = useState("");
  const [comparePilotBId, setComparePilotBId] = useState("");

  // Share state
  const duelCardRef = useRef<HTMLDivElement | null>(null);
  const [isSharingDuel, setIsSharingDuel] = useState(false);
  const { generateImage, download, shareDataUrlToWhatsApp } = useRankingShare({ isDarkMode });

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

  // Efficiency
  const efficiencyA = useMemo(
    () => comparePilotA && comparePilotA.participacoes > 0 ? Math.round((comparePilotA.pontos / comparePilotA.participacoes) * 10) / 10 : 0,
    [comparePilotA]
  );
  const efficiencyB = useMemo(
    () => comparePilotB && comparePilotB.participacoes > 0 ? Math.round((comparePilotB.pontos / comparePilotB.participacoes) * 10) / 10 : 0,
    [comparePilotB]
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
      {
        label: "Eficiência",
        shortLabel: "EF",
        a: efficiencyA,
        b: efficiencyB,
        lowerIsBetter: false,
        description: "pontos por participação",
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

  // Position in ranking
  const positionA = useMemo(
    () => filteredRanking.findIndex((p) => resolvePilotKey(p) === comparePilotAId) + 1,
    [filteredRanking, comparePilotAId]
  );
  const positionB = useMemo(
    () => filteredRanking.findIndex((p) => resolvePilotKey(p) === comparePilotBId) + 1,
    [filteredRanking, comparePilotBId]
  );

  // Radar data (normalized 0-100)
  const radarData = useMemo(() => {
    if (!comparePilotA || !comparePilotB) return [];
    const maxPts = Math.max(comparePilotA.pontos, comparePilotB.pontos, 1);
    const maxVit = Math.max(comparePilotA.vitorias, comparePilotB.vitorias, 1);
    const maxPol = Math.max(comparePilotA.poles, comparePilotB.poles, 1);
    const maxMv = Math.max(comparePilotA.mv, comparePilotB.mv, 1);
    const maxPod = Math.max(comparePilotA.podios, comparePilotB.podios, 1);
    return [
      { metric: "Pontos", A: Math.round((comparePilotA.pontos / maxPts) * 100), B: Math.round((comparePilotB.pontos / maxPts) * 100) },
      { metric: "Vitórias", A: Math.round((comparePilotA.vitorias / maxVit) * 100), B: Math.round((comparePilotB.vitorias / maxVit) * 100) },
      { metric: "Poles", A: Math.round((comparePilotA.poles / maxPol) * 100), B: Math.round((comparePilotB.poles / maxPol) * 100) },
      { metric: "VMR", A: Math.round((comparePilotA.mv / maxMv) * 100), B: Math.round((comparePilotB.mv / maxMv) * 100) },
      { metric: "Pódios", A: Math.round((comparePilotA.podios / maxPod) * 100), B: Math.round((comparePilotB.podios / maxPod) * 100) },
    ];
  }, [comparePilotA, comparePilotB]);

  const handleToggleDarkMode = toggleTheme;

  const handleSelectPilotA = (value: string) => {
    // Bloquear duelo do mesmo piloto
    if (value && value === comparePilotBId) return;
    setComparePilotAId(value);
  };

  const handleSelectPilotB = (value: string) => {
    // Bloquear duelo do mesmo piloto
    if (value && value === comparePilotAId) return;
    setComparePilotBId(value);
  };

  // Suggest duels
  const suggestedDuels = useMemo(() => {
    if (filteredRanking.length < 2) return [];
    const duels: { label: string; a: string; b: string; icon: string }[] = [];

    // Líder vs Vice
    if (filteredRanking.length >= 2) {
      duels.push({
        label: "Líder vs Vice",
        a: filteredRanking[0].pilotoId || filteredRanking[0].piloto,
        b: filteredRanking[1].pilotoId || filteredRanking[1].piloto,
        icon: "🏆",
      });
    }

    // Top 6 mais próximo (menor diferença de pontos)
    let closestDiff = Infinity;
    let closestA = "";
    let closestB = "";
    for (let i = 0; i < Math.min(filteredRanking.length - 1, 5); i++) {
      const diff = filteredRanking[i].pontos - filteredRanking[i + 1].pontos;
      if (diff < closestDiff && diff > 0) {
        closestDiff = diff;
        closestA = filteredRanking[i].pilotoId || filteredRanking[i].piloto;
        closestB = filteredRanking[i + 1].pilotoId || filteredRanking[i + 1].piloto;
      }
    }
    if (closestA && closestB) {
      duels.push({
        label: "Batalha mais próxima",
        a: closestA,
        b: closestB,
        icon: "⚡",
      });
    }

    // Maior rival de categoria (2º vs 3º)
    if (filteredRanking.length >= 3) {
      duels.push({
        label: "Rivalidade direta",
        a: filteredRanking[1].pilotoId || filteredRanking[1].piloto,
        b: filteredRanking[2].pilotoId || filteredRanking[2].piloto,
        icon: "🔥",
      });
    }

    return duels;
  }, [filteredRanking]);

  const handleShareDuel = async () => {
    if (!comparePilotA || !comparePilotB || !duelCardRef.current || isSharingDuel) return;
    try {
      setIsSharingDuel(true);
      const dataUrl = await generateImage(duelCardRef.current);
      if (!dataUrl) return;
      const pilotAName = getPilotFirstAndLastName(comparePilotA.piloto).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
      const pilotBName = getPilotFirstAndLastName(comparePilotB.piloto).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
      download(dataUrl, `duelo-${pilotAName}-vs-${pilotBName}-${category.toLowerCase()}-${competition.toLowerCase()}.png`);
    } catch (err) {
      console.error(err);
      window.alert("Não foi possível gerar a imagem do duelo.");
    } finally {
      setIsSharingDuel(false);
    }
  };

  const handleShareDuelWhatsApp = async () => {
    if (!comparePilotA || !comparePilotB || !duelCardRef.current || isSharingDuel) return;
    try {
      setIsSharingDuel(true);
      const dataUrl = await generateImage(duelCardRef.current);
      if (!dataUrl) return;
      const pilotAName = getPilotFirstAndLastName(comparePilotA.piloto).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
      const pilotBName = getPilotFirstAndLastName(comparePilotB.piloto).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
      shareDataUrlToWhatsApp({
        dataUrl,
        fileName: `duelo-${pilotAName}-vs-${pilotBName}.png`,
        text: `⚔️ ${getPilotFirstAndLastName(comparePilotA.piloto)} vs ${getPilotFirstAndLastName(comparePilotB.piloto)} — Duelo oficial ${competitionLabels[competition] || competition} · ${category}`,
      });
    } catch (err) {
      console.error(err);
      window.alert("Não foi possível compartilhar o duelo.");
    } finally {
      setIsSharingDuel(false);
    }
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
          onChange={handleSelectPilotA}
          options={filteredRanking.filter((p) => (p.pilotoId || p.piloto) !== comparePilotBId)}
          isDarkMode={isDarkMode}
          theme={theme}
        />

        <DuelSelectorCard
          title="Piloto B"
          value={comparePilotBId}
          onChange={handleSelectPilotB}
          options={filteredRanking.filter((p) => (p.pilotoId || p.piloto) !== comparePilotAId)}
          isDarkMode={isDarkMode}
          theme={theme}
        />
      </div>

      <SectionDivider />

      {!comparePilotA || !comparePilotB ? (
        <>
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

          {/* Suggested Duels */}
          {suggestedDuels.length > 0 && (
            <Card
              className={`rounded-[24px] shadow-sm ${
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
                  Sugestões de confronto
                </p>
                <p
                  className={`mt-1 text-[16px] font-bold ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  Duelos em alta
                </p>
                <div className="mt-4 space-y-2">
                  {suggestedDuels.map((duel) => (
                    <button
                      key={`suggested-${duel.label}`}
                      type="button"
                      onClick={() => {
                        handleSelectPilotA(duel.a);
                        handleSelectPilotB(duel.b);
                      }}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                        isDarkMode
                          ? "border-white/10 bg-[#0f172a] hover:border-white/20"
                          : "border-black/5 bg-zinc-50 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                            {duel.icon} {duel.label}
                          </p>
                        </div>
                        <ArrowRight
                          className={`h-4 w-4 ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <>
          <div ref={duelCardRef} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_120px_minmax(0,1fr)] xl:items-stretch">
            <PilotInfoCard
              title={getPilotWarNameDisplay(comparePilotA) || getPilotFirstAndLastName(comparePilotA.piloto)}
              pilot={comparePilotA}
              position={positionA}
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
                <motion.p
                  className={`mt-2 text-[30px] font-extrabold leading-none ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {duelSummary ? `${duelSummary.scoreA} x ${duelSummary.scoreB}` : "- x -"}
                </motion.p>
                <p
                  className={`mt-3 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${duelIntensity.tone}`}
                >
                  {duelIntensity.label}
                </p>
              </CardContent>
            </Card>

            <PilotInfoCard
              title={getPilotWarNameDisplay(comparePilotB) || getPilotFirstAndLastName(comparePilotB.piloto)}
              pilot={comparePilotB}
              position={positionB}
              score={duelSummary?.scoreB || 0}
              isWinner={duelSummary?.overallWinner === "b"}
              isDarkMode={isDarkMode}
              theme={theme}
            />
          </div>

          <SectionDivider />

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
                      className={`rounded-[12px] px-2 py-1 text-[10px] font-bold truncate ${
                        isDarkMode
                          ? `${theme.darkAccentBgSoft} ${theme.darkAccentText}`
                          : `${theme.primaryIconWrap} ${theme.primaryIcon}`
                      }`}
                    >
                      {getPilotWarNameDisplay(comparePilotA) || getPilotFirstAndLastName(comparePilotA.piloto)}
                    </div>
                    <div
                      className={`rounded-[12px] px-2 py-1 text-[10px] font-bold truncate ${
                        isDarkMode
                          ? `${theme.darkAccentBgSoft} ${theme.darkAccentText}`
                          : `${theme.primaryIconWrap} ${theme.primaryIcon}`
                      }`}
                    >
                      {getPilotWarNameDisplay(comparePilotB) || getPilotFirstAndLastName(comparePilotB.piloto)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {duelMetricsWithWinner.map((metric) => (
                    <MetricRow
                      key={`duel-metric-${metric.label}`}
                      metric={metric}
                      isDarkMode={isDarkMode}
                      pilotAName={getPilotWarNameDisplay(comparePilotA) || getPilotFirstAndLastName(comparePilotA.piloto)}
                      pilotBName={getPilotWarNameDisplay(comparePilotB) || getPilotFirstAndLastName(comparePilotB.piloto)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={`rounded-[24px] shadow-sm ${isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"}`}>
              <CardContent className="p-4">
                <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                  Radar comparativo
                </p>
                <h3 className={`mt-1 text-[20px] font-bold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                  Perfil de desempenho
                </h3>
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: isDarkMode ? "#a1a1aa" : "#71717a", fontSize: 11 }} />
                      <Radar name={getPilotWarNameDisplay(comparePilotA) || getPilotFirstAndLastName(comparePilotA.piloto)} dataKey="A" stroke={theme.chartBar || "#f97316"} fill={theme.chartBar || "#f97316"} fillOpacity={0.3} />
                      <Radar name={getPilotWarNameDisplay(comparePilotB) || getPilotFirstAndLastName(comparePilotB.piloto)} dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                    </RadarChart>
                  </ResponsiveContainer>
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

                    <div className={`rounded-[18px] border px-3 py-3 ${isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50/80"}`}>
                      <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                        Compartilhar duelo
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button onClick={handleShareDuel} disabled={isSharingDuel} className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${isDarkMode ? "border border-white/10 bg-[#111827] text-zinc-300 hover:bg-white/5" : "border border-black/5 bg-white text-zinc-700 hover:bg-zinc-50"}`}>
                          <Download className="h-3.5 w-3.5" /> Download
                        </button>
                        <button onClick={handleShareDuelWhatsApp} disabled={isSharingDuel} className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${isDarkMode ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15" : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
                          <Share2 className="h-3.5 w-3.5" /> WhatsApp
                        </button>
                      </div>
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
        </div>
        </>
      )}
    </div>
    </PageTransition>
  );
}