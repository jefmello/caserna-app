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

export type ChampionshipNarrative = {
  headline: string;
  body: string;
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

    let headline = "Leitura oficial do campeonato";
    if (titleFightStatus.label === "BRIGA ACIRRADA") {
      headline = "Briga acirrada pelo título";
    } else if (titleFightStatus.label === "DISPUTA CONTROLADA") {
      headline = "Liderança sob pressão";
    } else if (titleFightStatus.label === "LIDERANÇA ISOLADA") {
      headline = "Controle parcial do campeonato";
    } else if (statsRadar.podiumPressure > 0) {
      headline = "Zona de troféu em ebulição";
    }

    const leaderSentence = leader
      ? `${leaderName} comanda a ${category} em ${competitionLabel} com ${leader.pontos} ponto${leader.pontos === 1 ? "" : "s"}.`
      : `Ainda não existe liderança consolidada na ${category} em ${competitionLabel}.`;

    const titleSentence = statsSummary.totalPilots > 1
      ? titleFightStatus.label === "BRIGA ACIRRADA"
        ? `A vantagem para o vice é curta, apenas ${statsSummary.leaderAdvantage} ponto${statsSummary.leaderAdvantage === 1 ? "" : "s"}, e mantém a disputa totalmente aberta.`
        : titleFightStatus.label === "DISPUTA CONTROLADA"
          ? `Existe uma margem real de ${statsSummary.leaderAdvantage} ponto${statsSummary.leaderAdvantage === 1 ? "" : "s"}, mas ainda há pressão direta na briga pelo topo.`
          : `O líder abriu ${statsSummary.leaderAdvantage} ponto${statsSummary.leaderAdvantage === 1 ? "" : "s"} de vantagem e sustenta um cenário de maior controle.`
      : "Ainda não há massa crítica suficiente para uma leitura de título mais forte.";

    const top6Sentence = statsSummary.totalPilots >= 6
      ? `A zona de troféu segue viva, com corte em ${statsSummary.top6CutPoints} pontos e ${statsRadar.podiumPressure} ponto${statsRadar.podiumPressure === 1 ? "" : "s"} separando o 3º do 6º colocado.`
      : `O grid ainda está em formação, então a leitura do Top 6 segue adaptada ao número atual de pilotos pontuando.`;

    const momentumSentence = statsRadar.hottestPilot
      ? `No momento, ${hottestPilotName} aparece como o nome mais quente do grid, sustentado pela leitura de ${statsRadar.hottestLabel.toLowerCase()}.`
      : "No momento, o grid ainda não tem um piloto em alta claramente destacado.";

    const efficiencySentence = bestEfficiencyPilot
      ? `${efficiencyPilotName} também lidera a eficiência da seleção atual, reforçando a consistência do campeonato.`
      : "A leitura de eficiência ainda não encontrou um nome dominante nesta seleção.";

    const body = [leaderSentence, titleSentence, top6Sentence, momentumSentence, efficiencySentence].join(" ");

    return {
      headline,
      body,
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
