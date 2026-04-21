"use client";

import { useMemo } from "react";
import type { RankingItem, RankingMetaPilot } from "@/types/ranking";

export type EditorialCardTone = "hot" | "alert" | "stable" | "dominant";

export type EditorialCardItem = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
  tone: EditorialCardTone;
};

type Props = {
  category: string;
  competitionLabel: string;
  leader: RankingItem | null;
  filteredRanking: RankingItem[];
  statsSummary: {
    leaderAdvantage: number;
    top6CutPoints: number;
    totalPilots: number;
  } | null;
  statsRadar: {
    hottestPilot: RankingMetaPilot | null;
    hottestLabel: string;
    podiumPressure: number;
    titleHeat: string;
  } | null;
  bestEfficiencyPilot: RankingMetaPilot | RankingItem | null;
};

function getPilotDisplayName(pilot: { piloto?: string | null } | null | undefined) {
  if (!pilot?.piloto) return "Sem leitura";
  const parts = pilot.piloto.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return parts[0] || "Sem leitura";
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

export default function useEditorialCards({
  category,
  competitionLabel,
  leader,
  filteredRanking,
  statsSummary,
  statsRadar,
  bestEfficiencyPilot,
}: Props) {
  return useMemo<EditorialCardItem[]>(() => {
    if (!leader || filteredRanking.length === 0) return [];

    const vice = filteredRanking[1] || null;
    const leaderAdvantage =
      statsSummary?.leaderAdvantage ?? Math.max((leader.pontos || 0) - (vice?.pontos || 0), 0);
    const podiumPressure = statsRadar?.podiumPressure ?? 0;
    const hottestPilot = statsRadar?.hottestPilot ?? null;
    const hottestLabel = statsRadar?.hottestLabel ?? "momento competitivo";
    const top6CutPoints =
      statsSummary?.top6CutPoints ??
      (filteredRanking[5]?.pontos || filteredRanking[filteredRanking.length - 1]?.pontos || 0);

    const cards: EditorialCardItem[] = [];

    if (leaderAdvantage <= 3 && vice) {
      cards.push({
        id: "title-fight",
        eyebrow: "Disputa do momento",
        title: "Título em guerra aberta",
        description: `${getPilotDisplayName(leader)} lidera a ${category} em ${competitionLabel}, mas a margem para ${getPilotDisplayName(vice)} é de apenas ${leaderAdvantage} ponto(s).`,
        badge: `${leaderAdvantage} pts`,
        tone: "hot",
      });
    } else if (leaderAdvantage <= 8 && vice) {
      cards.push({
        id: "title-pressure",
        eyebrow: "Pressão no topo",
        title: "Liderança sob ataque",
        description: `${getPilotDisplayName(leader)} segue na frente, mas ${getPilotDisplayName(vice)} mantém o campeonato pressionado na ${category}.`,
        badge: `${leaderAdvantage} pts`,
        tone: "alert",
      });
    } else {
      cards.push({
        id: "leader-control",
        eyebrow: "Leitura do líder",
        title: "Controle estratégico no topo",
        description: `${getPilotDisplayName(leader)} sustenta a liderança da ${category} em ${competitionLabel} com cenário mais confortável no topo da tabela.`,
        badge: `${leaderAdvantage} pts`,
        tone: leaderAdvantage >= 15 ? "dominant" : "stable",
      });
    }

    if (podiumPressure <= 3 && filteredRanking.length >= 6) {
      cards.push({
        id: "top6-hot",
        eyebrow: "Zona de troféu",
        title: "Top 6 em pressão máxima",
        description:
          "A linha de corte da zona de troféu está completamente aberta. Pouquíssimos pontos separam quem entra e quem fica fora.",
        badge: `corte ${top6CutPoints} pts`,
        tone: "hot",
      });
    } else {
      cards.push({
        id: "top6-read",
        eyebrow: "Linha de corte",
        title: "Zona de troféu em disputa",
        description: `A briga pelo Top 6 segue como uma das áreas mais vivas do grid, com corte atual em ${top6CutPoints} pontos.`,
        badge: "Top 6",
        tone: podiumPressure <= 6 ? "alert" : "stable",
      });
    }

    if (hottestPilot) {
      cards.push({
        id: "hot-pilot",
        eyebrow: "Piloto em alta",
        title: `${getPilotDisplayName(hottestPilot)} aquece o grid`,
        description: `${getPilotDisplayName(hottestPilot)} aparece como o nome mais forte do momento, impulsionado por ${hottestLabel.toLowerCase()}.`,
        badge: hottestLabel,
        tone: "hot",
      });
    }

    if (bestEfficiencyPilot && cards.length < 4) {
      cards.push({
        id: "efficiency",
        eyebrow: "Eficiência premium",
        title: `${getPilotDisplayName(bestEfficiencyPilot)} maximiza cada participação`,
        description: `Na leitura atual, ${getPilotDisplayName(bestEfficiencyPilot)} entrega uma das relações mais fortes entre presença e pontuação no campeonato.`,
        badge: "eficiência",
        tone: "stable",
      });
    }

    return cards.slice(0, 4);
  }, [
    category,
    competitionLabel,
    leader,
    filteredRanking,
    statsSummary,
    statsRadar,
    bestEfficiencyPilot,
  ]);
}
