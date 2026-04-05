"use client";

import { useMemo } from "react";
import type { RankingItem, RankingMetaPilot } from "@/types/ranking";

type TitleFightStatus = {
  label: string;
  tone: string;
};

type StatsSummary = {
  totalPilots: number;
  leaderPoints: number;
  vicePoints: number;
  leaderAdvantage: number;
  top6CutPoints: number;
  avgPoints: number;
  totalVictories: number;
  totalPodiums: number;
};

type StatsRadar = {
  hottestPilot: RankingMetaPilot | null;
  hottestLabel: string;
  podiumPressure: number;
  titleHeat: string;
};

export type ChampionshipNarrativeBadge = {
  label: string;
  value: string;
  tone: "hot" | "alert" | "stable" | "dominant" | "neutral";
};

export type ChampionshipNarrative = {
  kicker: string;
  headline: string;
  body: string;
  tone: "hot" | "alert" | "stable" | "dominant";
  badges: ChampionshipNarrativeBadge[];
  highlights: Array<{ label: string; value: string }>;
};

type Props = {
  category: string;
  competitionLabel: string;
  leader?: RankingItem | null;
  titleFightStatus: TitleFightStatus;
  statsSummary: StatsSummary;
  statsRadar: StatsRadar;
  bestEfficiencyPilot?: RankingItem | RankingMetaPilot | null;
};

function firstLastName(name?: string | null) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return parts[0] || "";
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

function pluralizePoints(value: number) {
  return `${value} ponto${value === 1 ? "" : "s"}`;
}

export default function useChampionshipNarrative({
  category,
  competitionLabel,
  leader,
  titleFightStatus,
  statsSummary,
  statsRadar,
  bestEfficiencyPilot,
}: Props): ChampionshipNarrative {
  return useMemo(() => {
    const leaderName = leader ? firstLastName(leader.piloto) : "Sem líder definido";
    const hottestPilotName = statsRadar.hottestPilot
      ? firstLastName(statsRadar.hottestPilot.piloto)
      : "sem nome em alta";
    const efficiencyPilotName = bestEfficiencyPilot
      ? firstLastName(bestEfficiencyPilot.piloto)
      : "sem leitura";

    const leaderDiff = statsSummary.leaderAdvantage;
    const top6Pressure = statsRadar.podiumPressure;
    const hasTop6Battle = statsSummary.totalPilots >= 6;

    let kicker = "Leitura editorial do campeonato";
    let headline = "Campeonato em leitura oficial";
    let tone: ChampionshipNarrative["tone"] = "stable";

    if (leaderDiff <= 3) {
      kicker = "Título em ebulição";
      headline = "A liderança segue completamente sob pressão";
      tone = "hot";
    } else if (leaderDiff <= 8) {
      kicker = "Pressão no topo";
      headline = "O líder ainda controla, mas o campeonato segue vivo";
      tone = "alert";
    } else if (leaderDiff <= 15) {
      kicker = "Controle parcial";
      headline = "Há vantagem real no topo, mas sem definição total";
      tone = "stable";
    } else {
      kicker = "Domínio no topo";
      headline = "O campeonato entra em zona de controle do líder";
      tone = "dominant";
    }

    const opening = leader
      ? `${leaderName} comanda a ${category} em ${competitionLabel} com ${leader.pontos} pontos e estabelece o ritmo da disputa atual.`
      : `A ${category} em ${competitionLabel} ainda não tem liderança consolidada para uma leitura editorial mais forte.`;

    const titleContext =
      leaderDiff <= 3
        ? `A vantagem para o vice é de apenas ${pluralizePoints(leaderDiff)}, cenário que mantém a briga pelo título totalmente aberta.`
        : leaderDiff <= 8
          ? `A margem de ${pluralizePoints(leaderDiff)} ainda não resolve o campeonato e mantém pressão direta sobre quem está no topo.`
          : leaderDiff <= 15
            ? `A diferença de ${pluralizePoints(leaderDiff)} dá um respiro estratégico ao líder, mas ainda não elimina reação dos adversários.`
            : `Com ${pluralizePoints(leaderDiff)} de frente, o líder entra em uma faixa de controle mais clara do campeonato.`;

    const top6Context = hasTop6Battle
      ? top6Pressure <= 3
        ? `A zona de troféu vive pressão máxima: apenas ${pluralizePoints(top6Pressure)} separam o 3º do 6º colocado.`
        : top6Pressure <= 6
          ? `O Top 6 segue em zona quente, com ${pluralizePoints(top6Pressure)} entre o 3º e o 6º, mantendo a disputa muito viva.`
          : top6Pressure <= 10
            ? `A disputa pelo Top 6 continua aberta, com corte em ${statsSummary.top6CutPoints} pontos e margem administrável entre os blocos.`
            : `O Top 6 apresenta cenário mais estável neste momento, embora o corte siga sendo referência central da categoria.`
      : `O grid ainda não tem volume suficiente para uma leitura completa da zona de troféu, então o foco permanece no topo da classificação.`;

    const heatContext = statsRadar.hottestPilot
      ? `${hottestPilotName} aparece como o nome mais quente do grid, sustentado pela leitura de ${statsRadar.hottestLabel.toLowerCase()}.`
      : `Ainda não existe um piloto em ascensão tão claro dentro da seleção atual.`;

    const efficiencyContext = bestEfficiencyPilot
      ? `${efficiencyPilotName} também se destaca pela eficiência e reforça a camada técnica desta leitura oficial.`
      : `A eficiência do grid segue sem um nome dominante nesta seleção.`;

    const body = [opening, titleContext, top6Context, heatContext, efficiencyContext].join(" ");

    const badges: ChampionshipNarrativeBadge[] = [
      {
        label: "Título",
        value:
          leaderDiff <= 3
            ? "Guerra total"
            : leaderDiff <= 8
              ? "Pressão direta"
              : leaderDiff <= 15
                ? "Controle parcial"
                : "Domínio claro",
        tone,
      },
      {
        label: "Top 6",
        value: hasTop6Battle
          ? top6Pressure <= 3
            ? "Pressão máxima"
            : top6Pressure <= 6
              ? "Zona quente"
              : top6Pressure <= 10
                ? "Disputa aberta"
                : "Corte estável"
          : "Grid em formação",
        tone: hasTop6Battle ? (top6Pressure <= 6 ? "hot" : top6Pressure <= 10 ? "alert" : "stable") : "neutral",
      },
      {
        label: "Momento",
        value: statsRadar.hottestPilot ? hottestPilotName : "Sem leitura",
        tone: statsRadar.hottestPilot ? "dominant" : "neutral",
      },
    ];

    return {
      kicker,
      headline,
      body,
      tone,
      badges,
      highlights: [
        { label: "Líder", value: leaderName },
        { label: "Vantagem", value: `${statsSummary.leaderAdvantage} pts` },
        { label: "Momento", value: statsRadar.hottestPilot ? hottestPilotName : "Sem leitura" },
        { label: "Top 6", value: `${statsSummary.top6CutPoints} pts` },
      ],
    };
  }, [
    bestEfficiencyPilot,
    category,
    competitionLabel,
    leader,
    statsRadar,
    statsSummary,
    titleFightStatus,
  ]);
}
