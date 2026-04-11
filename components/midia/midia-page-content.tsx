"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  Camera,
  ChevronRight,
  Clapperboard,
  ListOrdered,
  Share2,
  Swords,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import RankingHeader from "@/components/ranking/ranking-header";
import RankingClassificationShareCard from "@/components/ranking/ranking-classification-share-card";
import RankingSharePremiumSection from "@/components/ranking/sections/ranking-share-premium-section";
import useRankingData from "@/lib/hooks/useRankingData";
import useRankingFilters from "@/lib/hooks/useRankingFilters";
import useChampionshipNarrative from "@/lib/hooks/useChampionshipNarrative";
import useRankingScreenController from "@/lib/hooks/useRankingScreenController";
import useRankingShare from "@/lib/hooks/useRankingShare";
import {
  competitionLabels,
  getComparisonWinner,
  getDuelNarrative,
  getDuelProfileLabel,
  getPilotFirstAndLastName,
  getPilotWarNameDisplay,
  getTop6RowStyles,
  getTrendVisual,
  normalizePilotName,
} from "@/lib/ranking/ranking-utils";
import type { RankingItem, RankingMetaPilot } from "@/types/ranking";

const RankingShareCanvas = dynamic(
  () => import("@/components/ranking/sections/ranking-share-canvas"),
  { ssr: false }
);

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

export default function MidiaPageContent() {
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

  const shareCardRef = useRef<HTMLDivElement | null>(null);
  const fullClassificationShareCardRef = useRef<HTMLDivElement | null>(null);
  const leaderShareCardRef = useRef<HTMLDivElement | null>(null);
  const duelShareCardRef = useRef<HTMLDivElement | null>(null);
  const narrativeShareCardRef = useRef<HTMLDivElement | null>(null);

  const classificationSectionRef = useRef<HTMLDivElement | null>(null);
  const premiumSectionRef = useRef<HTMLDivElement | null>(null);
  const whatsappSectionRef = useRef<HTMLDivElement | null>(null);

  const [isSharingImage, setIsSharingImage] = useState(false);
  const [isSharingFullClassificationImage, setIsSharingFullClassificationImage] =
    useState(false);
  const [isSharingLeaderImage, setIsSharingLeaderImage] = useState(false);
  const [isSharingDuelImage, setIsSharingDuelImage] = useState(false);
  const [isSharingNarrativeImage, setIsSharingNarrativeImage] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("caserna-theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("caserna-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const { theme, pilotTrendMap, titleFightStatus } =
    useRankingScreenController({
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
      filteredRanking.find(
        (item) => (item.pilotoId || item.piloto) === comparePilotAId
      ) || null,
    [filteredRanking, comparePilotAId]
  );

  const comparePilotB = useMemo(
    () =>
      filteredRanking.find(
        (item) => (item.pilotoId || item.piloto) === comparePilotBId
      ) || null,
    [filteredRanking, comparePilotBId]
  );

  const duelMetrics = useMemo(() => {
    if (!comparePilotA || !comparePilotB) return [];

    return [
      {
        label: "Pontos",
        a: comparePilotA.pontos,
        b: comparePilotB.pontos,
        lowerIsBetter: false,
      },
      {
        label: "Vitórias",
        a: comparePilotA.vitorias,
        b: comparePilotB.vitorias,
        lowerIsBetter: false,
      },
      {
        label: "Poles",
        a: comparePilotA.poles,
        b: comparePilotB.poles,
        lowerIsBetter: false,
      },
      {
        label: "VMR",
        a: comparePilotA.mv,
        b: comparePilotB.mv,
        lowerIsBetter: false,
      },
      {
        label: "Pódios",
        a: comparePilotA.podios,
        b: comparePilotB.podios,
        lowerIsBetter: false,
      },
      {
        label: "Participações",
        a: comparePilotA.participacoes,
        b: comparePilotB.participacoes,
        lowerIsBetter: false,
      },
      {
        label: "ADV",
        a: comparePilotA.adv,
        b: comparePilotB.adv,
        lowerIsBetter: true,
      },
    ];
  }, [comparePilotA, comparePilotB]);

  const duelSummary = useMemo(() => {
    if (!comparePilotA || !comparePilotB || duelMetrics.length === 0) {
      return null;
    }

    let scoreA = 0;
    let scoreB = 0;

    duelMetrics.forEach((metric) => {
      const winner = getComparisonWinner(
        metric.a,
        metric.b,
        metric.lowerIsBetter
      );
      if (winner === "a") scoreA += 1;
      if (winner === "b") scoreB += 1;
    });

    const pointsWinner = getComparisonWinner(
      comparePilotA.pontos,
      comparePilotB.pontos,
      false
    );
    const advWinner = getComparisonWinner(
      comparePilotA.adv,
      comparePilotB.adv,
      true
    );
    const overallWinner =
      scoreA === scoreB ? pointsWinner : scoreA > scoreB ? "a" : "b";
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
        description:
          "O duelo está equilibrado, mas com leve inclinação pontual.",
      };
    }

    if (duelSummary.scoreDiff >= 4) {
      return {
        label: "SUPERIORIDADE CLARA",
        tone: isDarkMode
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-emerald-200 bg-emerald-50 text-emerald-700",
        description:
          "Um dos lados domina a maior parte dos territórios do confronto.",
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
      description:
        "A disputa segue aberta e sensível a qualquer mudança de ritmo.",
    };
  }, [duelSummary, isDarkMode]);

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

  const { generateImage, download, shareDataUrlToWhatsApp } = useRankingShare({
    isDarkMode,
  });

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleRetry = () => {
    retry();
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

  const handleShareFullClassification = async () => {
    if (
      !fullClassificationShareCardRef.current ||
      isSharingFullClassificationImage
    )
      return;

    try {
      setIsSharingFullClassificationImage(true);
      const dataUrl = await generateImage(fullClassificationShareCardRef.current);
      if (!dataUrl) return;

      download(
        dataUrl,
        `classificacao-completa-${category.toLowerCase()}-${competition.toLowerCase()}.png`
      );
    } catch (err) {
      console.error(err);
      window.alert("Não foi possível gerar a imagem da classificação completa.");
    } finally {
      setIsSharingFullClassificationImage(false);
    }
  };

  const handleShareLeaderCard = async () => {
    if (!leader || !leaderShareCardRef.current || isSharingLeaderImage) return;

    try {
      setIsSharingLeaderImage(true);
      const dataUrl = await generateImage(leaderShareCardRef.current);
      if (!dataUrl) return;

      download(
        dataUrl,
        `lider-${category.toLowerCase()}-${competition.toLowerCase()}.png`
      );
    } catch (err) {
      console.error(err);
      window.alert("Não foi possível gerar a imagem do líder.");
    } finally {
      setIsSharingLeaderImage(false);
    }
  };

  const handleShareNarrativeCard = async () => {
    if (
      !championshipNarrative ||
      !narrativeShareCardRef.current ||
      isSharingNarrativeImage
    ) {
      return;
    }

    try {
      setIsSharingNarrativeImage(true);
      const dataUrl = await generateImage(narrativeShareCardRef.current);
      if (!dataUrl) return;

      download(
        dataUrl,
        `narrativa-${category.toLowerCase()}-${competition.toLowerCase()}.png`
      );
    } catch (err) {
      console.error(err);
      window.alert("Não foi possível gerar a imagem da narrativa.");
    } finally {
      setIsSharingNarrativeImage(false);
    }
  };

  const handleShareDuelCard = async () => {
    if (
      !comparePilotA ||
      !comparePilotB ||
      !duelShareCardRef.current ||
      isSharingDuelImage
    ) {
      return;
    }

    try {
      setIsSharingDuelImage(true);
      const dataUrl = await generateImage(duelShareCardRef.current);
      if (!dataUrl) return;

      download(
        dataUrl,
        `duelo-${category.toLowerCase()}-${competition.toLowerCase()}.png`
      );
    } catch (err) {
      console.error(err);
      window.alert("Não foi possível gerar a imagem do duelo.");
    } finally {
      setIsSharingDuelImage(false);
    }
  };

  const handleWhatsAppLeaderCard = async () => {
    if (!leader || !leaderShareCardRef.current || isSharingLeaderImage) return;

    try {
      setIsSharingLeaderImage(true);
      const dataUrl = await generateImage(leaderShareCardRef.current);
      if (!dataUrl) return;

      const leaderDiff = filteredRanking[1]
        ? Math.max((leader.pontos || 0) - filteredRanking[1].pontos, 0)
        : 0;

      await shareDataUrlToWhatsApp({
        dataUrl,
        fileName: `lider-${category.toLowerCase()}-${competition.toLowerCase()}.png`,
        text: `🏁 Líder oficial do campeonato
${getPilotFirstAndLastName(leader.piloto)} lidera ${category} - ${
          competitionLabels[competition] || competition
        } com ${leader.pontos} pts e vantagem de ${leaderDiff} pts.

Caserna Kart Racing`,
      });
    } finally {
      setIsSharingLeaderImage(false);
    }
  };

  const handleWhatsAppNarrativeCard = async () => {
    if (
      !championshipNarrative ||
      !narrativeShareCardRef.current ||
      isSharingNarrativeImage
    ) {
      return;
    }

    try {
      setIsSharingNarrativeImage(true);
      const dataUrl = await generateImage(narrativeShareCardRef.current);
      if (!dataUrl) return;

      await shareDataUrlToWhatsApp({
        dataUrl,
        fileName: `narrativa-${category.toLowerCase()}-${competition.toLowerCase()}.png`,
        text: `🧠 Narrativa oficial do campeonato
${championshipNarrative.headline}
${championshipNarrative.body}

${category} - ${competitionLabels[competition] || competition}
Caserna Kart Racing`,
      });
    } finally {
      setIsSharingNarrativeImage(false);
    }
  };

  const handleWhatsAppDuelCard = async () => {
    if (
      !comparePilotA ||
      !comparePilotB ||
      !duelShareCardRef.current ||
      isSharingDuelImage
    ) {
      return;
    }

    try {
      setIsSharingDuelImage(true);
      const dataUrl = await generateImage(duelShareCardRef.current);
      if (!dataUrl) return;

      const duelText = duelSummary
        ? `⚔️ Duelo oficial
${getPilotFirstAndLastName(comparePilotA.piloto)} ${duelSummary.scoreA} x ${
            duelSummary.scoreB
          } ${getPilotFirstAndLastName(comparePilotB.piloto)}
${duelSummary.narrative}

${category} - ${competitionLabels[competition] || competition}
Caserna Kart Racing`
        : `⚔️ Duelo oficial
${getPilotFirstAndLastName(comparePilotA.piloto)} x ${getPilotFirstAndLastName(
            comparePilotB.piloto
          )}
${category} - ${competitionLabels[competition] || competition}
Caserna Kart Racing`;

      await shareDataUrlToWhatsApp({
        dataUrl,
        fileName: `duelo-${category.toLowerCase()}-${competition.toLowerCase()}.png`,
        text: duelText,
      });
    } finally {
      setIsSharingDuelImage(false);
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
          Carregando central de mídia...
        </p>
        <p
          className={`mt-2 text-sm ${
            isDarkMode ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          Preparando artes e compartilhamentos oficiais
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
        categories={[]}
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
                Centro de mídia
              </p>
              <h3
                className={`mt-1 text-[20px] font-extrabold tracking-tight ${
                  isDarkMode ? "text-white" : "text-zinc-950"
                }`}
              >
                Compartilhamento oficial do campeonato
              </h3>
              <p
                className={`mt-2 text-[12px] leading-snug ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                Gere cards da classificação, do líder, da narrativa e do duelo
                em um único módulo, sem poluir as telas principais do app.
              </p>
            </div>

            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
              }`}
            >
              <Clapperboard
                className={`h-5 w-5 ${
                  isDarkMode ? theme.darkAccentText : theme.primaryIcon
                }`}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          <div ref={classificationSectionRef} className="space-y-4">
            <RankingClassificationShareCard
              isDarkMode={isDarkMode}
              theme={theme}
              isSharingImage={isSharingImage}
              filteredRankingLength={filteredRanking.length}
              onShare={handleShareClassification}
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
                      Classificação completa
                    </p>
                    <h3
                      className={`mt-1 text-[20px] font-extrabold tracking-tight ${
                        isDarkMode ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      Compartilhar a tabela inteira
                    </h3>
                    <p
                      className={`mt-2 text-[12px] leading-snug ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      Gera uma screen de toda a classificação oficial do recorte
                      atual, com todos os pilotos com pontos.
                    </p>
                  </div>

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                      isDarkMode
                        ? theme.darkAccentIconWrap
                        : theme.primaryIconWrap
                    }`}
                  >
                    <ListOrdered
                      className={`h-4.5 w-4.5 ${
                        isDarkMode ? theme.darkAccentText : theme.primaryIcon
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleShareFullClassification}
                  disabled={
                    isSharingFullClassificationImage ||
                    filteredRanking.length === 0
                  }
                  className={`mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-[18px] border px-4 py-3 text-sm font-semibold transition ${
                    isDarkMode
                      ? "border-white/10 bg-[#0f172a] text-white hover:bg-[#162033] disabled:opacity-50"
                      : "border-black/5 bg-zinc-50 text-zinc-950 hover:bg-white disabled:opacity-50"
                  }`}
                >
                  {isSharingFullClassificationImage
                    ? "Gerando imagem completa..."
                    : `Compartilhar classificação completa (${filteredRanking.length} pilotos)`}
                </button>
              </CardContent>
            </Card>
          </div>

          <Card
            className={`rounded-[24px] shadow-sm ${
              isDarkMode
                ? "border border-white/10 bg-[#111827]"
                : "border-black/5 bg-white"
            }`}
          >
            <CardContent className="p-4">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                      isDarkMode ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    Duelo premium
                  </p>
                  <h3
                    className={`mt-1 text-[20px] font-extrabold tracking-tight ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    Monte o confronto para mídia
                  </h3>
                </div>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                    isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                  }`}
                >
                  <Swords
                    className={`h-4.5 w-4.5 ${
                      isDarkMode ? theme.darkAccentText : theme.primaryIcon
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label
                    className={`mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] ${
                      isDarkMode ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    Piloto A
                  </label>
                  <select
                    value={comparePilotAId}
                    onChange={(e) => setComparePilotAId(e.target.value)}
                    className={`w-full rounded-[16px] border px-3 py-3 text-sm font-medium outline-none transition ${
                      isDarkMode
                        ? "border-white/10 bg-[#0f172a] text-white"
                        : "border-black/5 bg-zinc-50 text-zinc-950"
                    }`}
                  >
                    <option value="">Selecione</option>
                    {filteredRanking.map((pilot) => (
                      <option
                        key={`media-pilot-a-${pilot.pilotoId || pilot.piloto}`}
                        value={pilot.pilotoId || pilot.piloto}
                      >
                        {getPilotFirstAndLastName(pilot.piloto)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className={`mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] ${
                      isDarkMode ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    Piloto B
                  </label>
                  <select
                    value={comparePilotBId}
                    onChange={(e) => setComparePilotBId(e.target.value)}
                    className={`w-full rounded-[16px] border px-3 py-3 text-sm font-medium outline-none transition ${
                      isDarkMode
                        ? "border-white/10 bg-[#0f172a] text-white"
                        : "border-black/5 bg-zinc-50 text-zinc-950"
                    }`}
                  >
                    <option value="">Selecione</option>
                    {filteredRanking.map((pilot) => (
                      <option
                        key={`media-pilot-b-${pilot.pilotoId || pilot.piloto}`}
                        value={pilot.pilotoId || pilot.piloto}
                      >
                        {getPilotFirstAndLastName(pilot.piloto)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                className={`mt-4 rounded-[18px] border px-3 py-3 ${
                  isDarkMode
                    ? "border-white/10 bg-[#0f172a]"
                    : "border-black/5 bg-zinc-50/80"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p
                      className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                        isDarkMode ? "text-zinc-500" : "text-zinc-400"
                      }`}
                    >
                      Status do duelo
                    </p>
                    <p
                      className={`mt-1 text-[14px] font-semibold ${
                        isDarkMode ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      {comparePilotA && comparePilotB
                        ? `${getPilotFirstAndLastName(
                            comparePilotA.piloto
                          )} x ${getPilotFirstAndLastName(comparePilotB.piloto)}`
                        : "Selecione dois pilotos"}
                    </p>
                  </div>

                  <div
                    className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${duelIntensity.tone}`}
                  >
                    {duelIntensity.label}
                  </div>
                </div>

                <p
                  className={`mt-2 text-[12px] leading-snug ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  {duelSummary
                    ? duelSummary.narrative
                    : "A comparação premium será liberada quando dois pilotos forem selecionados."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div ref={premiumSectionRef}>
          <div ref={whatsappSectionRef}>
            <RankingSharePremiumSection
              isDarkMode={isDarkMode}
              theme={theme}
              leader={leader}
              championshipNarrative={championshipNarrative}
              comparePilotA={comparePilotA}
              comparePilotB={comparePilotB}
              isSharingLeaderImage={isSharingLeaderImage}
              isSharingNarrativeImage={isSharingNarrativeImage}
              isSharingDuelImage={isSharingDuelImage}
              onShareLeader={handleShareLeaderCard}
              onShareNarrative={handleShareNarrativeCard}
              onShareDuel={handleShareDuelCard}
              onWhatsAppLeader={handleWhatsAppLeaderCard}
              onWhatsAppNarrative={handleWhatsAppNarrativeCard}
              onWhatsAppDuel={handleWhatsAppDuelCard}
            />
          </div>
        </div>
      </div>

      <Card
        className={`rounded-[24px] shadow-sm ${
          isDarkMode
            ? "border border-white/10 bg-[#111827]"
            : "border-black/5 bg-white"
        }`}
      >
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Share2
              className={`h-4.5 w-4.5 ${
                isDarkMode ? theme.darkAccentText : theme.primaryIcon
              }`}
            />
            <p
              className={`text-[12px] font-bold uppercase tracking-[0.14em] ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Operação da central de mídia
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <button
              type="button"
              onClick={() => scrollToSection(classificationSectionRef)}
              className={`group rounded-[18px] border px-3 py-3 text-left transition-all duration-200 ${
                isDarkMode
                  ? "border-white/10 bg-[#0f172a] hover:border-white/20 hover:bg-[#162033]"
                  : "border-black/5 bg-zinc-50/80 hover:bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className={`text-[12px] font-semibold ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    Classificação
                  </p>
                  <p
                    className={`mt-1 text-[12px] leading-snug ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    Use para gerar a arte da grade oficial e também a classificação completa.
                  </p>
                </div>

                <ChevronRight
                  className={`mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                />
              </div>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection(premiumSectionRef)}
              className={`group rounded-[18px] border px-3 py-3 text-left transition-all duration-200 ${
                isDarkMode
                  ? "border-white/10 bg-[#0f172a] hover:border-white/20 hover:bg-[#162033]"
                  : "border-black/5 bg-zinc-50/80 hover:bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className={`text-[12px] font-semibold ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    Narrativa e líder
                  </p>
                  <p
                    className={`mt-1 text-[12px] leading-snug ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    Ideal para cards rápidos de contexto e liderança do campeonato.
                  </p>
                </div>

                <ChevronRight
                  className={`mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                />
              </div>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection(whatsappSectionRef)}
              className={`group rounded-[18px] border px-3 py-3 text-left transition-all duration-200 ${
                isDarkMode
                  ? "border-white/10 bg-[#0f172a] hover:border-white/20 hover:bg-[#162033]"
                  : "border-black/5 bg-zinc-50/80 hover:bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className={`text-[12px] font-semibold ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    WhatsApp
                  </p>
                  <p
                    className={`mt-1 text-[12px] leading-snug ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    Envie direto os cards do líder, da narrativa e do duelo para uso rápido.
                  </p>
                </div>

                <ChevronRight
                  className={`mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                />
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

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
          comparePilotA={comparePilotA}
          comparePilotB={comparePilotB}
          duelSummary={duelSummary}
          duelIntensity={duelIntensity}
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
          }}
        />
      </div>
    </div>
  );
}