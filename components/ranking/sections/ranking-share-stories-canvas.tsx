"use client";

import React, { type RefObject } from "react";
import {
  competitionLabels as defaultCompetitionLabels,
  getTop6RowStyles as defaultGetTop6RowStyles,
  getTrendVisual as defaultGetTrendVisual,
  normalizePilotName as defaultNormalizePilotName,
} from "@/lib/ranking/ranking-utils";
import type { RankingItem, RankingMetaPilot } from "@/types/ranking";
import type { PilotTrendStatus } from "@/lib/ranking/pilot-trend";

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
  storiesPodiumRef: RefObject<HTMLDivElement | null>;
  storiesEvolutionRef: RefObject<HTMLDivElement | null>;
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
    totalVictories?: number;
    totalPodiums?: number;
    avgPoints?: number;
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
  getPilotWarNameDisplay: _getPilotWarNameDisplay,
  getTop6RowStyles = defaultGetTop6RowStyles,
  getTrendVisual = defaultGetTrendVisual,
  normalizePilotName = defaultNormalizePilotName,
  refs,
}: RankingShareStoriesCanvasProps) {
  const {
    storiesLeaderRef,
    storiesNarrativeRef,
    storiesClassificationRef,
    storiesPodiumRef,
    storiesEvolutionRef,
  } = refs;
  const top6 = filteredRanking.filter((p) => p.pontos > 0).slice(0, 6);

  const textPrimary = isDarkMode ? "text-white" : "text-zinc-950";
  const textSecondary = isDarkMode ? "text-zinc-400" : "text-zinc-500";
  const textAccent = isDarkMode ? theme.darkAccentText : theme.primaryIcon;

  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR");
  const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="fixed top-0 -left-[9999px] z-[-1]" aria-hidden="true">
      {/* Stories: Líder (1080x1920) */}
      <div
        ref={storiesLeaderRef}
        className={`relative flex w-[1080px] flex-col ${isDarkMode ? "bg-[#0b0f16]" : "bg-white"}`}
        style={{ height: 1920 }}
      >
        {/* Background gradient with radial glow */}
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_45%)]"
              : "bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.03),transparent_45%)]"
          }`}
        />

        {/* Spotlight effect on leader */}
        {leader && (
          <div
            className={`absolute inset-0 ${
              isDarkMode
                ? "bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.04),transparent_60%)]"
                : "bg-[radial-gradient(circle_at_50%_30%,rgba(0,0,0,0.02),transparent_60%)]"
            }`}
          />
        )}

        {/* Noise texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Progress dots */}
        <div className="relative z-10 flex justify-center gap-2 pt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={`prog-dot-${i}`}
              className={`h-2.5 w-2.5 rounded-full ${
                i === 0
                  ? isDarkMode
                    ? "bg-white/80"
                    : "bg-zinc-800"
                  : isDarkMode
                    ? "bg-white/20"
                    : "bg-zinc-200"
              }`}
            />
          ))}
        </div>

        {/* Top badge */}
        <div className="relative z-10 mt-12 flex items-center justify-center gap-3">
          <div
            className={`rounded-full px-6 py-3 text-lg font-bold tracking-[0.2em] uppercase ${
              isDarkMode
                ? `${theme.darkAccentBgSoft} border ${theme.darkAccentBorder} ${textAccent}`
                : `border ${theme.primaryBorder} bg-zinc-50 ${theme.primaryIcon}`
            }`}
          >
            Líder da Classificação
          </div>
        </div>

        {/* Pilot name */}
        <div className="relative z-10 mt-12 text-center">
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
        <div className="relative z-10 mt-16 flex justify-center gap-12">
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
          <div
            className={`relative z-10 mt-12 rounded-2xl border px-8 py-4 ${
              isDarkMode
                ? `border-yellow-500/30 bg-yellow-500/10`
                : `border-yellow-200 bg-yellow-50`
            }`}
          >
            <p
              className={`text-center text-2xl font-bold ${
                isDarkMode ? "text-yellow-300" : "text-yellow-700"
              }`}
            >
              +{statsSummary.leaderAdvantage} pts de vantagem
            </p>
          </div>
        )}

        {/* Watermark */}
        <div className="absolute right-0 bottom-24 left-0 z-10 text-center">
          <p className={`text-lg font-semibold ${textSecondary}`}>
            Caserna Kart Racing · {competitionLabels[competition] || competition} · {category}
          </p>
          <p className={`mt-1 text-sm ${isDarkMode ? "text-zinc-600" : "text-zinc-300"}`}>
            {dateStr} às {timeStr}
          </p>
        </div>
      </div>

      {/* Stories: Narrativa (1080x1920) */}
      <div
        ref={storiesNarrativeRef}
        className={`relative flex w-[1080px] flex-col ${isDarkMode ? "bg-[#0b0f16]" : "bg-white"}`}
        style={{ height: 1920 }}
      >
        {/* Background gradient */}
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_45%)]"
              : "bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.03),transparent_45%)]"
          }`}
        />

        {/* Noise texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Progress dots */}
        <div className="relative z-10 flex justify-center gap-2 pt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={`narr-prog-dot-${i}`}
              className={`h-2.5 w-2.5 rounded-full ${
                i === 1
                  ? isDarkMode
                    ? "bg-white/80"
                    : "bg-zinc-800"
                  : isDarkMode
                    ? "bg-white/20"
                    : "bg-zinc-200"
              }`}
            />
          ))}
        </div>

        {/* Kicker */}
        <div className={`relative z-10 mt-12 mb-8 flex justify-center`}>
          <div
            className={`rounded-full border px-8 py-3 ${
              isDarkMode
                ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft} ${textAccent}`
                : `border ${theme.primaryBorder} bg-zinc-50 ${theme.primaryIcon}`
            }`}
          >
            <p className="text-xl font-bold tracking-[0.2em] uppercase">
              {championshipNarrative.kicker}
            </p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 px-20 text-center">
          <p className={`text-5xl leading-tight font-black ${textPrimary}`}>
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
        <div className="relative z-10 mt-16 flex flex-wrap justify-center gap-6 px-8">
          {championshipNarrative.badges.map((badge) => (
            <div
              key={badge.label}
              className={`rounded-2xl border px-6 py-4 text-center ${
                isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-zinc-50"
              }`}
            >
              <p className={`text-sm font-bold tracking-wider uppercase ${textSecondary}`}>
                {badge.label}
              </p>
              <p className={`mt-1 text-xl font-extrabold ${textPrimary}`}>{badge.value}</p>
            </div>
          ))}
        </div>

        {/* Watermark */}
        <div className="absolute right-0 bottom-24 left-0 z-10 text-center">
          <p className={`text-lg font-semibold ${textSecondary}`}>
            Caserna Kart Racing · {competitionLabels[competition] || competition} · {category}
          </p>
          <p className={`mt-1 text-sm ${isDarkMode ? "text-zinc-600" : "text-zinc-300"}`}>
            {dateStr} às {timeStr}
          </p>
        </div>
      </div>

      {/* Stories: Classificação Top 6 (1080x1920) */}
      <div
        ref={storiesClassificationRef}
        className={`relative flex w-[1080px] flex-col ${isDarkMode ? "bg-[#0b0f16]" : "bg-white"}`}
        style={{ height: 1920 }}
      >
        {/* Background gradient */}
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_45%)]"
              : "bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.03),transparent_45%)]"
          }`}
        />

        {/* Noise texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Progress dots */}
        <div className="relative z-10 flex justify-center gap-2 pt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={`class-prog-dot-${i}`}
              className={`h-2.5 w-2.5 rounded-full ${
                i === 2
                  ? isDarkMode
                    ? "bg-white/80"
                    : "bg-zinc-800"
                  : isDarkMode
                    ? "bg-white/20"
                    : "bg-zinc-200"
              }`}
            />
          ))}
        </div>

        {/* Header */}
        <div className={`relative z-10 flex w-full items-center justify-between px-12 pt-8 pb-8`}>
          <div>
            <p className={`text-lg font-bold tracking-[0.16em] uppercase ${textSecondary}`}>
              Classificação Oficial
            </p>
            <p className={`mt-1 text-3xl font-extrabold ${textPrimary}`}>
              {competitionLabels[competition] || competition} · {category}
            </p>
          </div>
          <div
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              isDarkMode
                ? `${theme.darkAccentBgSoft} ${textAccent}`
                : `bg-zinc-100 ${theme.primaryIcon}`
            }`}
          >
            Top 6
          </div>
        </div>

        {/* Stats row */}
        <div className="relative z-10 flex justify-around px-12 py-8">
          <div className="text-center">
            <p className={`text-5xl font-black ${textPrimary}`}>{leader?.pontos ?? 0}</p>
            <p className={`mt-1 text-lg ${textSecondary}`}>Pts do líder</p>
          </div>
          <div className="text-center">
            <p className={`text-5xl font-black ${textPrimary}`}>{statsSummary.totalPilots}</p>
            <p className={`mt-1 text-lg ${textSecondary}`}>Pilotos</p>
          </div>
          <div className="text-center">
            <p className={`text-5xl font-black ${textPrimary}`}>+{statsSummary.leaderAdvantage}</p>
            <p className={`mt-1 text-lg ${textSecondary}`}>Vantagem</p>
          </div>
        </div>

        {/* Top 6 list */}
        <div className="relative z-10 flex-1 px-8 py-6">
          {top6.map((pilot, index) => {
            const styles = getTop6RowStyles(index + 1);
            const trendKey = pilot.pilotoId || normalizePilotName(pilot.piloto);
            const trend = pilotTrendMap[trendKey];
            const trendInfo = trend ? getTrendVisual(trend as PilotTrendStatus, isDarkMode) : null;

            return (
              <div
                key={`stories-top6-${pilot.pilotoId || pilot.piloto}`}
                className={`mb-4 flex items-center justify-between rounded-2xl border px-6 py-5 ${styles.row}`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl font-black ${styles.badge}`}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className={`text-3xl font-bold ${styles.name}`}>
                      {getPilotFirstAndLastName(pilot.piloto)}
                    </p>
                    {trendInfo && (
                      <span
                        className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-sm font-bold ${trendInfo.className}`}
                      >
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

        {/* Watermark */}
        <div className="relative z-10 px-12 py-8 text-center">
          <p className={`text-lg font-semibold ${textSecondary}`}>CASERNA KART RACING</p>
          <p className={`mt-1 text-sm ${isDarkMode ? "text-zinc-600" : "text-zinc-300"}`}>
            {dateStr} às {timeStr}
          </p>
        </div>
      </div>

      {/* Stories: Pódio (1080x1920) */}
      <div
        ref={storiesPodiumRef}
        className={`relative flex w-[1080px] flex-col items-center ${isDarkMode ? "bg-[#0b0f16]" : "bg-white"}`}
        style={{ height: 1920 }}
      >
        {/* Background gradient */}
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_45%)]"
              : "bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.03),transparent_45%)]"
          }`}
        />

        {/* Noise texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Progress dots */}
        <div className="relative z-10 flex justify-center gap-2 pt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={`podium-prog-dot-${i}`}
              className={`h-2.5 w-2.5 rounded-full ${
                i === 0
                  ? isDarkMode
                    ? "bg-white/80"
                    : "bg-zinc-800"
                  : isDarkMode
                    ? "bg-white/20"
                    : "bg-zinc-200"
              }`}
            />
          ))}
        </div>

        {/* Title */}
        <div className="relative z-10 mt-8 mb-6 text-center">
          <p className={`text-xl font-bold tracking-[0.2em] uppercase ${textSecondary}`}>
            Pódio Oficial
          </p>
          <p className={`mt-2 text-5xl font-black ${textPrimary}`}>Top 6 · {category}</p>
          <p className={`mt-2 text-2xl font-semibold ${textSecondary}`}>
            {competitionLabels[competition] || competition}
          </p>
        </div>

        {/* Top 3 podium */}
        <div className="relative z-10 mt-6 flex justify-center gap-6 px-8">
          {[1, 0, 2].map((idx) => {
            const pilot = top6[idx];
            if (!pilot) return null;
            const podiumBadges = [
              "from-yellow-400 to-amber-500",
              "from-gray-300 to-gray-400",
              "from-amber-600 to-amber-800",
            ];
            const posLabels = ["1°", "2°", "3°"];
            const heights = ["h-[280px]", "h-[240px]", "h-[200px]"];

            return (
              <div
                key={`stories-podium-${idx}`}
                className={`flex w-1/3 flex-col items-center justify-end rounded-2xl border px-4 py-6 ${heights[idx]} ${
                  isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
                }`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br text-xl font-black text-white shadow-lg ${podiumBadges[idx]}`}
                >
                  {posLabels[idx]}
                </div>
                <p
                  className={`mt-3 text-center text-xl leading-tight font-extrabold ${textPrimary}`}
                >
                  {getPilotFirstAndLastName(pilot.piloto)}
                </p>
                <p
                  className={`mt-1 text-3xl font-black tabular-nums ${
                    isDarkMode ? theme.darkAccentText : theme.primaryIcon
                  }`}
                >
                  {pilot.pontos} pts
                </p>
                <p className={`mt-1 text-sm ${textSecondary}`}>
                  {pilot.vitorias}V · {pilot.podios}P
                </p>
              </div>
            );
          })}
        </div>

        {/* Positions 4, 5, 6 */}
        <div className="relative z-10 mt-6 w-full px-8">
          {[3, 4, 5].map((idx) => {
            const pilot = top6[idx];
            if (!pilot) return null;
            const styles = getTop6RowStyles(idx + 1);
            const posLabels = ["4°", "5°", "6°"];
            const bottomBadges = [
              "from-sky-400 to-blue-500",
              "from-violet-400 to-purple-500",
              "from-emerald-400 to-green-500",
            ];

            return (
              <div
                key={`stories-bottom-${idx}`}
                className={`mb-3 flex items-center justify-between rounded-2xl border px-6 py-4 ${styles.row}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-base font-black text-white shadow ${bottomBadges[idx - 3]}`}
                  >
                    {posLabels[idx - 3]}
                  </div>
                  <p className={`text-2xl font-extrabold ${textPrimary}`}>
                    {getPilotFirstAndLastName(pilot.piloto)}
                  </p>
                </div>
                <p
                  className={`text-3xl font-black tabular-nums ${
                    isDarkMode ? theme.darkAccentText : theme.primaryIcon
                  }`}
                >
                  {pilot.pontos} pts
                </p>
              </div>
            );
          })}
        </div>

        {/* Watermark */}
        <div className="absolute right-0 bottom-24 left-0 z-10 text-center">
          <p className={`text-lg font-semibold ${textSecondary}`}>CASERNA KART RACING</p>
          <p className={`mt-1 text-sm ${isDarkMode ? "text-zinc-600" : "text-zinc-300"}`}>
            {dateStr} às {timeStr}
          </p>
        </div>
      </div>

      {/* Stories: Evolução do Campeonato (1080x1920) */}
      <div
        ref={storiesEvolutionRef}
        className={`relative flex w-[1080px] flex-col ${isDarkMode ? "bg-[#0b0f16]" : "bg-white"}`}
        style={{ height: 1920 }}
      >
        {/* Background gradient */}
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_45%)]"
              : "bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.03),transparent_45%)]"
          }`}
        />

        {/* Noise texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Progress dots */}
        <div className="relative z-10 flex justify-center gap-2 pt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={`evo-prog-dot-${i}`}
              className={`h-2.5 w-2.5 rounded-full ${
                i === 1
                  ? isDarkMode
                    ? "bg-white/80"
                    : "bg-zinc-800"
                  : isDarkMode
                    ? "bg-white/20"
                    : "bg-zinc-200"
              }`}
            />
          ))}
        </div>

        {/* Title */}
        <div className="relative z-10 mt-8 mb-6 px-10 text-center">
          <p className={`text-xl font-bold tracking-[0.2em] uppercase ${textSecondary}`}>
            Panorama do Campeonato
          </p>
          <p className={`mt-2 text-4xl leading-tight font-black ${textPrimary}`}>
            {category} · {competitionLabels[competition] || competition}
          </p>
        </div>

        {/* Championship headline */}
        <div
          className={`relative z-10 mx-10 rounded-2xl border px-6 py-4 ${
            isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-zinc-50"
          }`}
        >
          <p className={`text-xl font-bold ${textPrimary}`}>{championshipNarrative.headline}</p>
          <p className={`mt-2 text-lg leading-relaxed ${textSecondary}`}>
            {championshipNarrative.body}
          </p>
        </div>

        {/* Top 6 with trends */}
        <div className="relative z-10 mt-6 px-8">
          {filteredRanking.slice(0, 6).map((item, index) => {
            const styles = getTop6RowStyles(index + 1);
            const trendStatus =
              pilotTrendMap[item.pilotoId || normalizePilotName(item.piloto)] || "stable";
            const trendInfo = getTrendVisual(trendStatus as never, isDarkMode);
            const TrendI = trendInfo.Icon;

            return (
              <div
                key={`stories-evo-${item.pilotoId || item.piloto}-${index}`}
                className={`mb-3 flex items-center justify-between rounded-2xl border px-6 py-4 ${styles.row}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-black ${styles.badge}`}
                  >
                    {index + 1}
                  </span>
                  <p className={`text-2xl font-extrabold ${styles.name}`}>
                    {getPilotFirstAndLastName(item.piloto)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold ${trendInfo.className}`}
                  >
                    <TrendI className="h-3.5 w-3.5" />
                    {trendInfo.label}
                  </span>
                  <p
                    className={`text-3xl font-black tabular-nums ${
                      isDarkMode ? theme.darkAccentText : theme.primaryIcon
                    }`}
                  >
                    {item.pontos} pts
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Aggregate stats */}
        <div className="relative z-10 mt-6 flex justify-around px-8">
          <div className="text-center">
            <p className={`text-4xl font-black ${textPrimary}`}>{statsSummary.totalPilots}</p>
            <p className={`mt-1 text-sm ${textSecondary}`}>Pilotos</p>
          </div>
          <div className="text-center">
            <p className={`text-4xl font-black ${textPrimary}`}>
              {statsSummary.totalVictories || 0}
            </p>
            <p className={`mt-1 text-sm ${textSecondary}`}>Vitórias</p>
          </div>
          <div className="text-center">
            <p className={`text-4xl font-black ${textPrimary}`}>{statsSummary.totalPodiums || 0}</p>
            <p className={`mt-1 text-sm ${textSecondary}`}>Pódios</p>
          </div>
        </div>

        {/* Watermark */}
        <div className="absolute right-0 bottom-24 left-0 z-10 text-center">
          <p className={`text-lg font-semibold ${textSecondary}`}>CASERNA KART RACING</p>
          <p className={`mt-1 text-sm ${isDarkMode ? "text-zinc-600" : "text-zinc-300"}`}>
            {dateStr} às {timeStr}
          </p>
        </div>
      </div>
    </div>
  );
}
