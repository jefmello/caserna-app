"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  ChevronRight,
  Clapperboard,
  ListOrdered,
  Share2,
  Swords,
  Monitor,
  Smartphone,
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
import { useChampionship } from "@/context/championship-context";
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
import type { RankingMetaPilot } from "@/types/ranking";
import PageTransition from "@/components/ui/page-transition";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top";
import Breadcrumb from "@/components/ui/breadcrumb";
import { useToast } from "@/components/ui/toast";
import EmptyStateIllustration from "@/components/ui/empty-state-illustration";
import Link from "next/link";

const RankingShareCanvas = dynamic(
  () => import("@/components/ranking/sections/ranking-share-canvas"),
  { ssr: false }
);

const RankingShareStoriesCanvas = dynamic(
  () => import("@/components/ranking/sections/ranking-share-stories-canvas"),
  { ssr: false }
);

export default function MidiaPageContent() {
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

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [comparePilotAId, setComparePilotAId] = useState("");
  const [comparePilotBId, setComparePilotBId] = useState("");

  const shareCardRef = useRef<HTMLDivElement | null>(null);
  const fullClassificationShareCardRef = useRef<HTMLDivElement | null>(null);
  const leaderShareCardRef = useRef<HTMLDivElement | null>(null);
  const duelShareCardRef = useRef<HTMLDivElement | null>(null);
  const narrativeShareCardRef = useRef<HTMLDivElement | null>(null);
  const podiumCardRef = useRef<HTMLDivElement | null>(null);
  const evolutionCardRef = useRef<HTMLDivElement | null>(null);

  // Stories refs
  const storiesLeaderRef = useRef<HTMLDivElement | null>(null);
  const storiesNarrativeRef = useRef<HTMLDivElement | null>(null);
  const storiesClassificationRef = useRef<HTMLDivElement | null>(null);
  const storiesPodiumRef = useRef<HTMLDivElement | null>(null);
  const storiesEvolutionRef = useRef<HTMLDivElement | null>(null);

  const [shareFormat, setShareFormat] = useState<"landscape" | "stories">("landscape");

  const classificationSectionRef = useRef<HTMLDivElement | null>(null);
  const premiumSectionRef = useRef<HTMLDivElement | null>(null);
  const whatsappSectionRef = useRef<HTMLDivElement | null>(null);

  const [isSharingImage, setIsSharingImage] = useState(false);
  const [isSharingFullClassificationImage, setIsSharingFullClassificationImage] = useState(false);
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

  const { theme, pilotTrendMap, titleFightStatus } = useRankingScreenController({
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
      filteredRanking.find((item) => (item.pilotoId || item.piloto) === comparePilotAId) || null,
    [filteredRanking, comparePilotAId]
  );

  const comparePilotB = useMemo(
    () =>
      filteredRanking.find((item) => (item.pilotoId || item.piloto) === comparePilotBId) || null,
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

  const { generateImage, download, shareDataUrlToWhatsApp } = useRankingShare({
    isDarkMode,
  });

  const { addToast } = useToast();

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
      if (!dataUrl) {
        addToast({
          type: "error",
          title: "Erro ao gerar imagem",
          message: "Não foi possível gerar a classificação.",
        });
        return;
      }

      download(dataUrl, `classificacao-${category.toLowerCase()}-${competition.toLowerCase()}.png`);
      addToast({
        type: "success",
        title: "Imagem salva",
        message: "Classificação exportada com sucesso.",
      });
    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        title: "Erro ao gerar imagem",
        message: "Não foi possível gerar a classificação.",
      });
    } finally {
      setIsSharingImage(false);
    }
  };

  const handleShareFullClassification = async () => {
    if (!fullClassificationShareCardRef.current || isSharingFullClassificationImage) return;

    try {
      setIsSharingFullClassificationImage(true);
      const dataUrl = await generateImage(fullClassificationShareCardRef.current);
      if (!dataUrl) {
        addToast({
          type: "error",
          title: "Erro ao gerar imagem",
          message: "Não foi possível gerar a classificação completa.",
        });
        return;
      }

      download(
        dataUrl,
        `classificacao-completa-${category.toLowerCase()}-${competition.toLowerCase()}.png`
      );
      addToast({
        type: "success",
        title: "Imagem salva",
        message: "Classificação completa exportada com sucesso.",
      });
    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        title: "Erro ao gerar imagem",
        message: "Não foi possível gerar a classificação completa.",
      });
    } finally {
      setIsSharingFullClassificationImage(false);
    }
  };

  const handleShareLeaderCard = async () => {
    const ref = shareFormat === "stories" ? storiesLeaderRef.current : leaderShareCardRef.current;
    if (!leader || !ref || isSharingLeaderImage) return;

    try {
      setIsSharingLeaderImage(true);
      const dataUrl = await generateImage(ref);
      if (!dataUrl) {
        addToast({
          type: "error",
          title: "Erro ao gerar imagem",
          message: "Não foi possível gerar o card do líder.",
        });
        return;
      }

      download(
        dataUrl,
        shareFormat === "stories"
          ? `lider-stories-${category.toLowerCase()}-${competition.toLowerCase()}.png`
          : `lider-${category.toLowerCase()}-${competition.toLowerCase()}.png`
      );
      addToast({
        type: "success",
        title: "Imagem salva",
        message: "Card do líder exportado com sucesso.",
      });
    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        title: "Erro ao gerar imagem",
        message: "Não foi possível gerar o card do líder.",
      });
    } finally {
      setIsSharingLeaderImage(false);
    }
  };

  const handleShareNarrativeCard = async () => {
    const ref =
      shareFormat === "stories" ? storiesNarrativeRef.current : narrativeShareCardRef.current;
    if (!championshipNarrative || !ref || isSharingNarrativeImage) {
      return;
    }

    try {
      setIsSharingNarrativeImage(true);
      const dataUrl = await generateImage(ref);
      if (!dataUrl) {
        addToast({
          type: "error",
          title: "Erro ao gerar imagem",
          message: "Não foi possível gerar o card da narrativa.",
        });
        return;
      }

      download(
        dataUrl,
        shareFormat === "stories"
          ? `narrativa-stories-${category.toLowerCase()}-${competition.toLowerCase()}.png`
          : `narrativa-${category.toLowerCase()}-${competition.toLowerCase()}.png`
      );
      addToast({
        type: "success",
        title: "Imagem salva",
        message: "Card da narrativa exportado com sucesso.",
      });
    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        title: "Erro ao gerar imagem",
        message: "Não foi possível gerar o card da narrativa.",
      });
    } finally {
      setIsSharingNarrativeImage(false);
    }
  };

  const handleShareDuelCard = async () => {
    // Duelo não tem versão Stories — usa sempre landscape
    if (!comparePilotA || !comparePilotB || !duelShareCardRef.current || isSharingDuelImage) {
      return;
    }

    try {
      setIsSharingDuelImage(true);
      const dataUrl = await generateImage(duelShareCardRef.current);
      if (!dataUrl) {
        addToast({
          type: "error",
          title: "Erro ao gerar imagem",
          message: "Não foi possível gerar o card do duelo.",
        });
        return;
      }

      download(dataUrl, `duelo-${category.toLowerCase()}-${competition.toLowerCase()}.png`);
      addToast({
        type: "success",
        title: "Imagem salva",
        message: "Card do duelo exportado com sucesso.",
      });
    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        title: "Erro ao gerar imagem",
        message: "Não foi possível gerar o card do duelo.",
      });
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
      addToast({
        type: "success",
        title: "Enviado para WhatsApp",
        message: "Card do líder compartilhado.",
      });
    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        title: "Erro ao enviar",
        message: "Não foi possível enviar para o WhatsApp.",
      });
    } finally {
      setIsSharingLeaderImage(false);
    }
  };

  const handleWhatsAppNarrativeCard = async () => {
    if (!championshipNarrative || !narrativeShareCardRef.current || isSharingNarrativeImage) {
      return;
    }

    try {
      setIsSharingNarrativeImage(true);
      const dataUrl = await generateImage(narrativeShareCardRef.current);
      if (!dataUrl) {
        addToast({
          type: "error",
          title: "Erro ao gerar imagem",
          message: "Não foi possível gerar o card da narrativa.",
        });
        return;
      }

      await shareDataUrlToWhatsApp({
        dataUrl,
        fileName: `narrativa-${category.toLowerCase()}-${competition.toLowerCase()}.png`,
        text: `🧠 Narrativa oficial do campeonato
${championshipNarrative.headline}
${championshipNarrative.body}

${category} - ${competitionLabels[competition] || competition}
Caserna Kart Racing`,
      });
      addToast({
        type: "success",
        title: "Enviado para WhatsApp",
        message: "Card da narrativa compartilhado.",
      });
    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        title: "Erro ao enviar",
        message: "Não foi possível enviar para o WhatsApp.",
      });
    } finally {
      setIsSharingNarrativeImage(false);
    }
  };

  const handleWhatsAppDuelCard = async () => {
    if (!comparePilotA || !comparePilotB || !duelShareCardRef.current || isSharingDuelImage) {
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
      addToast({
        type: "success",
        title: "Enviado para WhatsApp",
        message: "Card do duelo compartilhado.",
      });
    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        title: "Erro ao enviar",
        message: "Não foi possível enviar para o WhatsApp.",
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
        <p className="text-xl font-semibold tracking-tight">Carregando central de mídia...</p>
        <p className={`mt-2 text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
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
          categories={[]}
          category={category}
          setCategory={setCategory}
          availableCompetitions={availableCompetitions}
          competition={competition}
          setCompetition={setCompetition}
          competitionLabels={competitionLabels}
          toggleDarkMode={handleToggleDarkMode}
        />

        <Breadcrumb items={[{ label: "Mídia", href: "/midia" }]} isDark={isDarkMode} />

        <Card
          className={`rounded-[24px] shadow-sm ${
            isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className={`text-[10px] font-bold tracking-[0.16em] uppercase ${
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
                  Gere cards da classificação, do líder, da narrativa e do duelo em um único módulo,
                  sem poluir as telas principais do app.
                </p>
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                  isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                }`}
              >
                <Clapperboard
                  className={`h-5 w-5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Format toggle: Landscape / Stories */}
        <Card
          className={`rounded-[24px] shadow-sm ${
            isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-[10px] font-bold tracking-[0.16em] uppercase ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Formato do card
                </p>
                <h3
                  className={`mt-1 text-[16px] font-bold tracking-tight ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  Escolha o formato de compartilhamento
                </h3>
              </div>

              <div
                className={`flex overflow-hidden rounded-xl border ${
                  isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setShareFormat("landscape")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition ${
                    shareFormat === "landscape"
                      ? isDarkMode
                        ? `${theme.darkAccentBgSoft} ${theme.darkAccentText}`
                        : `${theme.primaryIconWrap} ${theme.primaryIcon}`
                      : isDarkMode
                        ? "text-zinc-500 hover:text-zinc-300"
                        : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  Paisagem
                </button>
                <button
                  type="button"
                  onClick={() => setShareFormat("stories")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition ${
                    shareFormat === "stories"
                      ? isDarkMode
                        ? `${theme.darkAccentBgSoft} ${theme.darkAccentText}`
                        : `${theme.primaryIconWrap} ${theme.primaryIcon}`
                      : isDarkMode
                        ? "text-zinc-500 hover:text-zinc-300"
                        : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  Stories
                </button>
              </div>
            </div>
            <p className={`mt-2 text-[11px] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
              {shareFormat === "stories"
                ? "1080×1920 · Ideal para Instagram Stories"
                : "1080px · Ideal para feed e grupos de WhatsApp"}
            </p>
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
                  isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p
                        className={`text-[10px] font-bold tracking-[0.16em] uppercase ${
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
                        Gera uma screen de toda a classificação oficial do recorte atual, com todos
                        os pilotos com pontos.
                      </p>
                    </div>

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                        isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
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
                    disabled={isSharingFullClassificationImage || filteredRanking.length === 0}
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
                isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
              }`}
            >
              <CardContent className="p-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={`text-[10px] font-bold tracking-[0.16em] uppercase ${
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
                      htmlFor="compare-pilot-a"
                      className={`mb-1.5 block text-[10px] font-bold tracking-[0.14em] uppercase ${
                        isDarkMode ? "text-zinc-500" : "text-zinc-400"
                      }`}
                    >
                      Piloto A
                    </label>
                    <select
                      id="compare-pilot-a"
                      value={comparePilotAId}
                      onChange={(e) => setComparePilotAId(e.target.value)}
                      className={`w-full rounded-[16px] border px-3 py-3 text-sm font-medium transition outline-none ${
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
                      htmlFor="compare-pilot-b"
                      className={`mb-1.5 block text-[10px] font-bold tracking-[0.14em] uppercase ${
                        isDarkMode ? "text-zinc-500" : "text-zinc-400"
                      }`}
                    >
                      Piloto B
                    </label>
                    <select
                      id="compare-pilot-b"
                      value={comparePilotBId}
                      onChange={(e) => setComparePilotBId(e.target.value)}
                      className={`w-full rounded-[16px] border px-3 py-3 text-sm font-medium transition outline-none ${
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
                    isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p
                        className={`text-[10px] font-bold tracking-[0.14em] uppercase ${
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
                      className={`rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.12em] uppercase ${duelIntensity.tone}`}
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

                {!comparePilotA || !comparePilotB ? (
                  <div className="mt-4">
                    <EmptyStateIllustration
                      variant="photos"
                      title="Monte um duelo para gerar a arte"
                      description="Escolha dois pilotos acima ou vá para /duelos para explorar confrontos premium."
                      isDark={isDarkMode}
                      action={
                        <Link
                          href="/duelos"
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                            isDarkMode
                              ? `${theme.darkAccentBgSoft} ${theme.darkAccentText} hover:opacity-90`
                              : `${theme.primaryIconWrap} ${theme.primaryIcon} hover:opacity-90`
                          }`}
                        >
                          Abrir duelos
                        </Link>
                      }
                    />
                  </div>
                ) : null}
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
            isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
          }`}
        >
          <CardContent className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Share2
                className={`h-4.5 w-4.5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`}
              />
              <p
                className={`text-[12px] font-bold tracking-[0.14em] uppercase ${
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
              podiumCardRef,
              evolutionCardRef,
            }}
          />
          <RankingShareStoriesCanvas
            isDarkMode={isDarkMode}
            theme={theme}
            category={category}
            competition={competition}
            competitionLabels={competitionLabels}
            leader={leader}
            statsSummary={statsSummary}
            championshipNarrative={championshipNarrative}
            filteredRanking={filteredRanking}
            pilotTrendMap={pilotTrendMap}
            getPilotFirstAndLastName={getPilotFirstAndLastName}
            getPilotWarNameDisplay={getPilotWarNameDisplay}
            getTop6RowStyles={getTop6RowStyles}
            getTrendVisual={getTrendVisual}
            normalizePilotName={normalizePilotName}
            refs={{
              storiesLeaderRef,
              storiesNarrativeRef,
              storiesClassificationRef,
              storiesPodiumRef,
              storiesEvolutionRef,
            }}
          />
        </div>
      </div>
      <ScrollToTopButton isDark={isDarkMode} />
    </PageTransition>
  );
}
