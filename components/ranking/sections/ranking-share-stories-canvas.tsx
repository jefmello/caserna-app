"use client";

import React, { type RefObject } from "react";
import {
  competitionLabels as defaultCompetitionLabels,
  getTop6RowStyles as defaultGetTop6RowStyles,
  getTrendVisual as defaultGetTrendVisual,
  normalizePilotName as defaultNormalizePilotName,
} from "@/lib/ranking/ranking-utils";
import type { RankingItem, RankingMetaPilot } from "@/types/ranking";

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

type ShareStoriesCanvasRefs = {
  storiesLeaderRef: RefObject<HTMLDivElement | null>;
  storiesNarrativeRef: RefObject<HTMLDivElement | null>;
  storiesClassificationRef: RefObject<HTMLDivElement | null>;
};

type RankingShareStoriesCanvasProps = {
  isDarkMode: boolean;
  theme: CategoryThemeLike;
  category: string;
  competition: string;
  competitionLabels?: Record<string, string>;
  leader: PilotLike | null;
  statsSummary: {
    leaderAdvantage: number;
    totalPilots: number;
  };
  championshipNarrative: ChampionshipNarrativeLike;
  filteredRanking: RankingItem[];
  pilotTrendMap: Record<string, string>;
  getPilotFirstAndLastName: (pilotName?: string | undefined) => string;
  getPilotWarNameDisplay: (pilot?: RankingItem | null | undefined) => string;
  getTop6RowStyles?: typeof defaultGetTop6RowStyles;
  getTrendVisual?: typeof defaultGetTrendVisual;
  normalizePilotName?: typeof defaultNormalizePilotName;
  refs: ShareStoriesCanvasRefs;
};

export default function RankingShareStoriesCanvas({
  isDarkMode,
  theme,
  category,
  competition,
  competitionLabels = defaultCompetitionLabels,
  leader,
  statsSummary,
  championshipNarrative,
  filteredRanking,
  pilotTrendMap,
  getPilotFirstAndLastName,
  getPilotWarNameDisplay,
  getTop6RowStyles = defaultGetTop6RowStyles,
  getTrendVisual = defaultGetTrendVisual,
  normalizePilotName = defaultNormalizePilotName,
  refs,
}: RankingShareStoriesCanvasProps) {
  const top6 = filteredRanking.filter((p) => p.pontos > 0).slice(0, 6);

  const bg = isDarkMode
    ? "bg-[#0b0f16]"
    : "bg-white";

  const textPrimary = isDarkMode ? "text-white" : "text-zinc-950";
  const textSecondary = isDarkMode ? "text-zinc-400" : "text-zinc-500";
  const textAccent = isDarkMode ? theme.darkAccentText : theme.primaryIcon;

  return (
    <div className="fixed -left-[9999px] top-0 z-[-1]" aria-hidden="true">
      {/* Stories: Líder (1080x1920) */}
      <div
        ref={refs.storiesLeaderRef}
        className={`relative flex w-[1080px] flex-col items-center justify-center ${bg}`}
        style={{ height: 1920 }}
      >
        {/* Background gradient */}
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_40%)]"
              : "bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.02),transparent_40%)]"
          }`}
        />

        {/* Top badge */}
        <div className="relative z-10 mb-12 flex items-center gap-3">
          <div className={`rounded-full px-6 py-3 text-lg font-bold uppercase tracking-[0.2em] ${
            isDarkMode
              ? `${theme.darkAccentBgSoft} border ${theme.darkAccentBorder} ${textAccent}`
              : `border ${theme.primaryBorder} bg-zinc-50 ${theme.primaryIcon}`
          }`}>
            Líder da Classificação
          </div>
        </div>

        {/* Pilot name */}
        <div className="relative z-10 text-center">
          <p className={`text-6xl font-extrabold tracking-tight ${textPrimary}`}>
            {leader ? getPilotFirstAndLastName(leader.piloto) : "Sem líder"}
          </p>
          {leader && (
            <p className={`mt-4 text-3xl font-medium ${textSecondary}`}>
              {leader.nomeGuerra ? `"${normalizePilotName(leader.nomeGuerra)}"` : ""}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="relative z-10 mt-16 flex gap-12">
          <div className="text-center">
            <p className={`text-7xl font-black tabular-nums ${textPrimary}`}>
              {leader?.pontos ?? 0}
            </p>
            <p className={`mt-2 text-xl font-medium ${textSecondary}`}>Pontos</p>
          </div>
          <div className="text-center">
            <p className={`text-7xl font-black tabular-nums ${textPrimary}`}>
              {leader?.vitorias ?? 0}
            </p>
            <p className={`mt-2 text-xl font-medium ${textSecondary}`}>Vitórias</p>
          </div>
          <div className="text-center">
            <p className={`text-7xl font-black tabular-nums ${textPrimary}`}>
              {leader?.podios ?? 0}
            </p>
            <p className={`mt-2 text-xl font-medium ${textSecondary}`}>Pódios</p>
          </div>
        </div>

        {/* Vantagem */}
        {statsSummary.leaderAdvantage > 0 && leader && (
          <div className={`relative z-10 mt-12 rounded-2xl border px-8 py-4 ${
            isDarkMode
              ? `border-yellow-500/30 bg-yellow-500/10`
              : `border-yellow-200 bg-yellow-50`
          }`}>
            <p className={`text-2xl font-bold ${
              isDarkMode ? "text-yellow-300" : "text-yellow-700"
            }`}>
              +{statsSummary.leaderAdvantage} pts de vantagem
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="absolute bottom-16 left-0 right-0 z-10 text-center">
          <p className={`text-lg font-semibold ${textSecondary}`}>
            Caserna Kart Racing · {competitionLabels[competition] || competition} · {category}
          </p>
        </div>
      </div>

      {/* Stories: Narrativa (1080x1920) */}
      <div
        ref={refs.storiesNarrativeRef}
        className={`relative flex w-[1080px] flex-col items-center justify-center ${bg}`}
        style={{ height: 1920 }}
      >
        {/* Background gradient */}
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_40%)]"
              : "bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.02),transparent_40%)]"
          }`}
        />

        {/* Kicker */}
        <div className={`relative z-10 mb-8 rounded-full border px-8 py-3 ${
          isDarkMode
            ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft} ${textAccent}`
            : `border ${theme.primaryBorder} bg-zinc-50 ${theme.primaryIcon}`
        }`}>
          <p className="text-xl font-bold uppercase tracking-[0.2em]">
            {championshipNarrative.kicker}
          </p>
        </div>

        {/* Headline */}
        <div className="relative z-10 px-20 text-center">
          <p className={`text-5xl font-black leading-tight ${textPrimary}`}>
            {championshipNarrative.headline}
          </p>
        </div>

        {/* Body */}
        <div className="relative z-10 mt-12 px-20">
          <p className={`text-2xl leading-relaxed ${textSecondary}`}>
            {championshipNarrative.body}
          </p>
        </div>

        {/* Badges */}
        <div className="relative z-10 mt-16 flex gap-6">
          {championshipNarrative.badges.map((badge) => (
            <div
              key={badge.label}
              className={`rounded-2xl border px-6 py-4 text-center ${
                isDarkMode
                  ? "border-white/10 bg-[#111827]"
                  : "border-black/5 bg-zinc-50"
              }`}
            >
              <p className={`text-sm font-bold uppercase tracking-wider ${textSecondary}`}>
                {badge.label}
              </p>
              <p className={`mt-1 text-xl font-extrabold ${textPrimary}`}>
                {badge.value}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-16 left-0 right-0 z-10 text-center">
          <p className={`text-lg font-semibold ${textSecondary}`}>
            Caserna Kart Racing · {competitionLabels[competition] || competition} · {category}
          </p>
        </div>
      </div>

      {/* Stories: Classificação Top 6 (1080x1920) */}
      <div
        ref={refs.storiesClassificationRef}
        className={`relative flex w-[1080px] flex-col ${bg}`}
        style={{ height: 1920 }}
      >
        {/* Header */}
        <div className={`flex w-full items-center justify-between px-12 pt-12 pb-8 ${
          isDarkMode
            ? `${theme.darkAccentBorder} border-b ${theme.darkAccentBgSoft}`
            : `border-b ${theme.primaryBorder}`
        }`}>
          <div>
            <p className={`text-lg font-bold uppercase tracking-[0.16em] ${textSecondary}`}>
              Classificação Oficial
            </p>
            <p className={`mt-1 text-3xl font-extrabold ${textPrimary}`}>
              {competitionLabels[competition] || competition} · {category}
            </p>
          </div>
          <div className={`rounded-full px-4 py-2 text-sm font-bold ${
            isDarkMode ? `${theme.darkAccentBgSoft} ${textAccent}` : `bg-zinc-100 ${theme.primaryIcon}`
          }`}>
            Top 6
          </div>
        </div>

        {/* Stats row */}
        <div className="flex justify-around px-12 py-8">
          <div className="text-center">
            <p className={`text-5xl font-black ${textPrimary}`}>
              {leader?.pontos ?? 0}
            </p>
            <p className={`mt-1 text-lg ${textSecondary}`}>Pts do líder</p>
          </div>
          <div className="text-center">
            <p className={`text-5xl font-black ${textPrimary}`}>
              {statsSummary.totalPilots}
            </p>
            <p className={`mt-1 text-lg ${textSecondary}`}>Pilotos</p>
          </div>
          <div className="text-center">
            <p className={`text-5xl font-black ${textPrimary}`}>
              +{statsSummary.leaderAdvantage}
            </p>
            <p className={`mt-1 text-lg ${textSecondary}`}>Vantagem</p>
          </div>
        </div>

        {/* Top 6 list */}
        <div className="flex-1 px-8 py-6">
          {top6.map((pilot, index) => {
            const styles = getTop6RowStyles(index + 1);
            const trendKey = pilot.pilotoId || normalizePilotName(pilot.piloto);
            const trend = pilotTrendMap[trendKey];
            const trendInfo = trend ? getTrendVisual(trend as any, isDarkMode) : null;

            return (
              <div
                key={`stories-top6-${pilot.pilotoId || pilot.piloto}`}
                className={`mb-4 flex items-center justify-between rounded-2xl border px-6 py-5 ${styles.row}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl font-black ${styles.badge}`}>
                    {index + 1}
                  </span>
                  <div>
                    <p className={`text-3xl font-bold ${styles.name}`}>
                      {getPilotFirstAndLastName(pilot.piloto)}
                    </p>
                    {trendInfo && (
                      <span className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-sm font-bold ${trendInfo.className}`}>
                        <trendInfo.Icon className="h-3 w-3" />
                        {trendInfo.label}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-4xl font-black tabular-nums ${styles.points}`}>
                    {pilot.pontos}
                  </p>
                  <p className={`text-lg ${textSecondary}`}>
                    {pilot.vitorias}V · {pilot.podios}P
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`px-12 py-8 text-center ${
          isDarkMode ? "border-t border-white/10" : "border-t border-black/5"
        }`}>
          <p className={`text-lg font-semibold ${textSecondary}`}>
            Caserna Kart Racing · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
