"use client";

import React, { type RefObject } from "react";
import {
  competitionLabels as defaultCompetitionLabels,
  getTop6RowStyles as defaultGetTop6RowStyles,
  getTrendVisual as defaultGetTrendVisual,
  normalizePilotName as defaultNormalizePilotName,
} from "@/lib/ranking/ranking-utils";
import type { RankingItem, RankingMetaPilot } from "@/types/ranking";
import PodiumShareCard from "./share/podium-share-card";
import EvolutionShareCard from "./share/evolution-share-card";
import FullClassificationShareCard from "./share/full-classification-share-card";
import Top6ShareCard from "./share/top6-share-card";
import DuelShareCard from "./share/duel-share-card";
import NarrativeShareCard from "./share/narrative-share-card";
import LeaderShareCard from "./share/leader-share-card";

type PilotLike = RankingItem | RankingMetaPilot;

type CategoryThemeLike = {
  darkAccentBorder: string;
  darkAccentCard: string;
  darkAccentBg: string;
  darkAccentBgSoft?: string;
  darkAccentText: string;
  darkAccentIconWrap: string;
  darkLeaderRow?: string;
  darkSecondRow?: string;
  darkThirdRow?: string;
  primaryBorder: string;
  shellGlow: string;
  heroBorder: string;
  primaryIconWrap: string;
  primaryIcon: string;
  searchBadge: string;
};

type NarrativeBadgeLike = {
  label: string;
  value: string;
};

type ChampionshipNarrativeLike = {
  headline: string;
  kicker: string;
  body: string;
  badges: NarrativeBadgeLike[];
};

type DuelSummaryLike = {
  scoreA: number;
  scoreB: number;
  narrative: string;
} | null;

type DuelIntensityLike = {
  label: string;
  tone: string;
};

type TrendMapLike = Record<string, string>;

type ShareCanvasRefs = {
  leaderShareCardRef: RefObject<HTMLDivElement | null>;
  narrativeShareCardRef: RefObject<HTMLDivElement | null>;
  duelShareCardRef: RefObject<HTMLDivElement | null>;
  shareCardRef: RefObject<HTMLDivElement | null>;
  fullClassificationShareCardRef: RefObject<HTMLDivElement | null>;
  podiumCardRef: RefObject<HTMLDivElement | null>;
  evolutionCardRef: RefObject<HTMLDivElement | null>;
};

type RankingShareCanvasProps = {
  isDarkMode: boolean;
  theme: CategoryThemeLike;
  category: string;
  competition: string;
  competitionLabels?: Record<string, string>;
  leader: PilotLike | null;
  statsSummary: {
    leaderAdvantage: number;
    totalPilots?: number;
    totalVictories?: number;
    totalPodiums?: number;
    avgPoints?: number;
  };
  championshipNarrative: ChampionshipNarrativeLike;
  comparePilotA: RankingItem | null;
  comparePilotB: RankingItem | null;
  duelSummary: DuelSummaryLike;
  duelIntensity: DuelIntensityLike;
  filteredRanking: RankingItem[];
  pilotTrendMap: TrendMapLike;
  getPilotFirstAndLastName: (pilotName?: string | undefined) => string;
  getPilotWarNameDisplay: (pilot?: RankingItem | null | undefined) => string;
  getTop6RowStyles?: typeof defaultGetTop6RowStyles;
  getTrendVisual?: typeof defaultGetTrendVisual;
  normalizePilotName?: typeof defaultNormalizePilotName;
  refs: ShareCanvasRefs;
};

function RankingShareCanvas({
  isDarkMode,
  theme,
  category,
  competition,
  competitionLabels = defaultCompetitionLabels,
  leader,
  statsSummary,
  championshipNarrative,
  comparePilotA,
  comparePilotB,
  duelSummary,
  duelIntensity,
  filteredRanking,
  pilotTrendMap,
  getPilotFirstAndLastName,
  getPilotWarNameDisplay,
  getTop6RowStyles = defaultGetTop6RowStyles,
  getTrendVisual = defaultGetTrendVisual,
  normalizePilotName = defaultNormalizePilotName,
  refs,
}: RankingShareCanvasProps) {
  const {
    leaderShareCardRef,
    narrativeShareCardRef,
    duelShareCardRef,
    shareCardRef,
    fullClassificationShareCardRef,
    podiumCardRef,
    evolutionCardRef,
  } = refs;

  return (
    <div className="pointer-events-none fixed top-0 -left-[9999px] z-[-1] opacity-0">
      <LeaderShareCard
        cardRef={leaderShareCardRef}
        isDarkMode={isDarkMode}
        theme={theme}
        category={category}
        competition={competition}
        competitionLabels={competitionLabels}
        leader={leader}
        filteredRanking={filteredRanking}
        statsSummary={statsSummary}
        getPilotFirstAndLastName={getPilotFirstAndLastName}
      />

      <NarrativeShareCard
        cardRef={narrativeShareCardRef}
        isDarkMode={isDarkMode}
        theme={theme}
        category={category}
        competition={competition}
        competitionLabels={competitionLabels}
        championshipNarrative={championshipNarrative}
      />

      <DuelShareCard
        cardRef={duelShareCardRef}
        isDarkMode={isDarkMode}
        theme={theme}
        category={category}
        competition={competition}
        competitionLabels={competitionLabels}
        comparePilotA={comparePilotA}
        comparePilotB={comparePilotB}
        duelSummary={duelSummary}
        duelIntensity={duelIntensity}
        getPilotFirstAndLastName={getPilotFirstAndLastName}
        normalizePilotName={normalizePilotName}
      />

      <Top6ShareCard
        cardRef={shareCardRef}
        isDarkMode={isDarkMode}
        theme={theme}
        category={category}
        competition={competition}
        competitionLabels={competitionLabels}
        leader={leader}
        filteredRanking={filteredRanking}
        pilotTrendMap={pilotTrendMap}
        getPilotFirstAndLastName={getPilotFirstAndLastName}
        getPilotWarNameDisplay={getPilotWarNameDisplay}
        getTop6RowStyles={getTop6RowStyles}
        getTrendVisual={getTrendVisual}
        normalizePilotName={normalizePilotName}
      />

      <FullClassificationShareCard
        cardRef={fullClassificationShareCardRef}
        isDarkMode={isDarkMode}
        theme={theme}
        category={category}
        competition={competition}
        competitionLabels={competitionLabels}
        leader={leader}
        filteredRanking={filteredRanking}
        pilotTrendMap={pilotTrendMap}
        getPilotFirstAndLastName={getPilotFirstAndLastName}
        getPilotWarNameDisplay={getPilotWarNameDisplay}
        getTop6RowStyles={getTop6RowStyles}
        getTrendVisual={getTrendVisual}
        normalizePilotName={normalizePilotName}
      />

      <PodiumShareCard
        cardRef={podiumCardRef}
        isDarkMode={isDarkMode}
        theme={theme}
        category={category}
        competition={competition}
        competitionLabels={competitionLabels}
        filteredRanking={filteredRanking}
        getPilotFirstAndLastName={getPilotFirstAndLastName}
        getTop6RowStyles={getTop6RowStyles}
        normalizePilotName={normalizePilotName}
      />

      <EvolutionShareCard
        cardRef={evolutionCardRef}
        isDarkMode={isDarkMode}
        theme={theme}
        category={category}
        competition={competition}
        competitionLabels={competitionLabels}
        championshipNarrative={championshipNarrative}
        filteredRanking={filteredRanking}
        pilotTrendMap={pilotTrendMap}
        statsSummary={statsSummary}
        getPilotFirstAndLastName={getPilotFirstAndLastName}
        getTop6RowStyles={getTop6RowStyles}
        getTrendVisual={getTrendVisual}
        normalizePilotName={normalizePilotName}
      />
    </div>
  );
}

export default React.memo(RankingShareCanvas);
