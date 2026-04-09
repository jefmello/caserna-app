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
  } = refs;

  return (
    <div className="pointer-events-none fixed -left-[9999px] top-0 z-[-1] opacity-0">
      <div
        ref={leaderShareCardRef}
        className={`w-[1080px] overflow-hidden rounded-[36px] border p-8 ${
          isDarkMode
            ? `border-white/10 bg-gradient-to-br ${theme.darkAccentCard} text-white`
            : `${theme.primaryBorder} bg-gradient-to-br ${theme.shellGlow} text-zinc-950`
        }`}
      >
        <div
          className={`rounded-[28px] border p-7 ${
            isDarkMode
              ? `${theme.darkAccentBorder} bg-[#111827]`
              : `${theme.heroBorder} bg-white/92`
          }`}
        >
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-[22px] ${
                  isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                }`}
              >
                <span
                  className={`text-3xl ${
                    isDarkMode ? theme.darkAccentText : theme.primaryIcon
                  }`}
                >
                  🏆
                </span>
              </div>
              <div>
                <p
                  className={`text-[15px] font-bold uppercase tracking-[0.22em] ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  Líder oficial do campeonato
                </p>
                <h2 className="mt-2 text-[40px] font-extrabold leading-none tracking-tight">
                  {leader ? getPilotFirstAndLastName(leader.piloto) : "Sem líder"}
                </h2>
                <p
                  className={`mt-3 text-[20px] font-semibold ${
                    isDarkMode ? "text-zinc-300" : "text-zinc-700"
                  }`}
                >
                  {category} · {competitionLabels[competition] || competition}
                </p>
              </div>
            </div>

            <div
              className={`rounded-full border px-5 py-2 text-[15px] font-bold uppercase tracking-[0.14em] ${
                isDarkMode
                  ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                  : theme.searchBadge
              }`}
            >
              liderança oficial
            </div>
          </div>

          <div className="mt-7 grid grid-cols-4 gap-4">
            <div
              className={`rounded-[22px] border px-4 py-4 ${
                isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
              }`}
            >
              <p
                className={`text-[12px] font-bold uppercase tracking-[0.16em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Pontos
              </p>
              <p className="mt-2 text-[30px] font-extrabold tabular-nums">
                {"pontos" in (leader || {}) ? leader?.pontos || 0 : 0}
              </p>
            </div>
            <div
              className={`rounded-[22px] border px-4 py-4 ${
                isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
              }`}
            >
              <p
                className={`text-[12px] font-bold uppercase tracking-[0.16em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Vantagem
              </p>
              <p className="mt-2 text-[30px] font-extrabold tabular-nums">
                {statsSummary.leaderAdvantage} pts
              </p>
            </div>
            <div
              className={`rounded-[22px] border px-4 py-4 ${
                isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
              }`}
            >
              <p
                className={`text-[12px] font-bold uppercase tracking-[0.16em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Vitórias
              </p>
              <p className="mt-2 text-[30px] font-extrabold tabular-nums">
                {"vitorias" in (leader || {}) ? leader?.vitorias || 0 : 0}
              </p>
            </div>
            <div
              className={`rounded-[22px] border px-4 py-4 ${
                isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
              }`}
            >
              <p
                className={`text-[12px] font-bold uppercase tracking-[0.16em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Pódios
              </p>
              <p className="mt-2 text-[30px] font-extrabold tabular-nums">
                {"podios" in (leader || {}) ? leader?.podios || 0 : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={narrativeShareCardRef}
        className={`mt-6 w-[1080px] overflow-hidden rounded-[36px] border p-8 ${
          isDarkMode
            ? `border-white/10 bg-gradient-to-br ${theme.darkAccentCard} text-white`
            : `${theme.primaryBorder} bg-gradient-to-br ${theme.shellGlow} text-zinc-950`
        }`}
      >
        <div
          className={`rounded-[28px] border p-7 ${
            isDarkMode
              ? `${theme.darkAccentBorder} bg-[#111827]`
              : `${theme.heroBorder} bg-white/92`
          }`}
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <p
                className={`text-[15px] font-bold uppercase tracking-[0.22em] ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                Narrativa oficial
              </p>
              <h2 className="mt-2 text-[40px] font-extrabold leading-tight tracking-tight">
                {championshipNarrative.headline}
              </h2>
              <p
                className={`mt-3 text-[20px] font-semibold ${
                  isDarkMode ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                {category} · {competitionLabels[competition] || competition}
              </p>
            </div>

            <div
              className={`rounded-full border px-5 py-2 text-[15px] font-bold uppercase tracking-[0.14em] ${
                isDarkMode
                  ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                  : theme.searchBadge
              }`}
            >
              {championshipNarrative.kicker}
            </div>
          </div>

          <p
            className={`mt-6 text-[22px] leading-[1.5] ${
              isDarkMode ? "text-zinc-200" : "text-zinc-700"
            }`}
          >
            {championshipNarrative.body}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {championshipNarrative.badges.map((badge) => (
              <div
                key={`share-narrative-${badge.label}`}
                className={`rounded-[20px] border px-4 py-3 ${
                  isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
                }`}
              >
                <p
                  className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  {badge.label}
                </p>
                <p className="mt-2 text-[22px] font-extrabold tracking-tight">
                  {badge.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={duelShareCardRef}
        className={`mt-6 w-[1080px] overflow-hidden rounded-[36px] border p-8 ${
          isDarkMode
            ? `border-white/10 bg-gradient-to-br ${theme.darkAccentCard} text-white`
            : `${theme.primaryBorder} bg-gradient-to-br ${theme.shellGlow} text-zinc-950`
        }`}
      >
        <div
          className={`rounded-[28px] border p-7 ${
            isDarkMode
              ? `${theme.darkAccentBorder} bg-[#111827]`
              : `${theme.heroBorder} bg-white/92`
          }`}
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <p
                className={`text-[15px] font-bold uppercase tracking-[0.22em] ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                Duelo premium
              </p>
              <h2 className="mt-2 text-[40px] font-extrabold leading-tight tracking-tight">
                {comparePilotA
                  ? getPilotFirstAndLastName(comparePilotA.piloto)
                  : "Piloto A"}{" "}
                vs{" "}
                {comparePilotB
                  ? getPilotFirstAndLastName(comparePilotB.piloto)
                  : "Piloto B"}
              </h2>
              <p
                className={`mt-3 text-[20px] font-semibold ${
                  isDarkMode ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                {category} · {competitionLabels[competition] || competition}
              </p>
            </div>

            <div
              className={`rounded-full border px-5 py-2 text-[15px] font-bold uppercase tracking-[0.14em] ${duelIntensity.tone}`}
            >
              {duelIntensity.label}
            </div>
          </div>

          <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div
              className={`rounded-[24px] border px-5 py-5 ${
                isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
              }`}
            >
              <p className="text-[28px] font-extrabold tracking-tight">
                {comparePilotA
                  ? getPilotFirstAndLastName(comparePilotA.piloto)
                  : "Piloto A"}
              </p>
              <p
                className={`mt-2 text-[16px] ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                {comparePilotA
                  ? `${comparePilotA.pontos} pts · ${comparePilotA.vitorias} vitórias`
                  : "sem dados"}
              </p>
            </div>

            <div
              className={`rounded-[26px] border px-6 py-5 text-center ${
                isDarkMode
                  ? `${theme.darkAccentBorder} ${
                      theme.darkAccentBgSoft || theme.darkAccentBg
                    }`
                  : `${theme.primaryBorder} bg-white`
              }`}
            >
              <p
                className={`text-[12px] font-bold uppercase tracking-[0.16em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Score
              </p>
              <p className="mt-2 text-[34px] font-extrabold tabular-nums">
                {duelSummary ? `${duelSummary.scoreA} x ${duelSummary.scoreB}` : "- x -"}
              </p>
            </div>

            <div
              className={`rounded-[24px] border px-5 py-5 ${
                isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
              }`}
            >
              <p className="text-[28px] font-extrabold tracking-tight">
                {comparePilotB
                  ? getPilotFirstAndLastName(comparePilotB.piloto)
                  : "Piloto B"}
              </p>
              <p
                className={`mt-2 text-[16px] ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                {comparePilotB
                  ? `${comparePilotB.pontos} pts · ${comparePilotB.vitorias} vitórias`
                  : "sem dados"}
              </p>
            </div>
          </div>

          <p
            className={`mt-6 text-[20px] leading-[1.5] ${
              isDarkMode ? "text-zinc-200" : "text-zinc-700"
            }`}
          >
            {duelSummary
              ? duelSummary.narrative
              : "Selecione dois pilotos para gerar o confronto premium."}
          </p>
        </div>
      </div>

      <div
        ref={shareCardRef}
        className={`w-[1200px] overflow-hidden rounded-[36px] border p-10 ${
          isDarkMode
            ? `border-white/10 bg-gradient-to-br ${theme.darkAccentCard} text-white`
            : `${theme.primaryBorder} bg-gradient-to-br ${theme.shellGlow} text-zinc-950`
        }`}
      >
        <div
          className={`rounded-[28px] border px-8 py-7 ${
            isDarkMode
              ? `${theme.darkAccentBorder} bg-[#111827]`
              : `${theme.heroBorder} bg-white/90`
          }`}
        >
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-[22px] ${
                  isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                }`}
              >
                <span
                  className={`text-3xl ${
                    isDarkMode ? theme.darkAccentText : theme.primaryIcon
                  }`}
                >
                  🏆
                </span>
              </div>
              <div>
                <p
                  className={`text-[16px] font-bold uppercase tracking-[0.22em] ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  Classificação oficial
                </p>
                <h2 className="mt-2 text-[42px] font-extrabold leading-none tracking-[0.04em]">
                  CASERNA KART RACING
                </h2>
                <p
                  className={`mt-3 text-[22px] font-semibold ${
                    isDarkMode ? "text-zinc-300" : "text-zinc-700"
                  }`}
                >
                  {category} · {competitionLabels[competition] || competition}
                </p>
              </div>
            </div>

            <div
              className={`rounded-full border px-5 py-2 text-[18px] font-bold uppercase tracking-[0.12em] ${
                isDarkMode
                  ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                  : theme.searchBadge
              }`}
            >
              Top 6 oficial
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div
              className={`rounded-[22px] border px-5 py-4 ${
                isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
              }`}
            >
              <p
                className={`text-[14px] font-bold uppercase tracking-[0.16em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Líder
              </p>
              <p className="mt-2 text-[26px] font-extrabold tabular-nums">
                {leader ? getPilotFirstAndLastName(leader.piloto) : "-"}
              </p>
              <p
                className={`mt-1 text-[18px] font-semibold ${
                  isDarkMode ? theme.darkAccentText : "text-zinc-700"
                }`}
              >
                {"pontos" in (leader || {}) ? leader?.pontos || 0 : 0} pontos
              </p>
            </div>
            <div
              className={`rounded-[22px] border px-5 py-4 ${
                isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
              }`}
            >
              <p
                className={`text-[14px] font-bold uppercase tracking-[0.16em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Pilotos
              </p>
              <p className="mt-2 text-[26px] font-extrabold tabular-nums">
                {filteredRanking.length}
              </p>
              <p
                className={`mt-1 text-[18px] font-semibold ${
                  isDarkMode ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                na classificação atual
              </p>
            </div>
            <div
              className={`rounded-[22px] border px-5 py-4 ${
                isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
              }`}
            >
              <p
                className={`text-[14px] font-bold uppercase tracking-[0.16em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Vantagem
              </p>
              <p className="mt-2 text-[26px] font-extrabold tabular-nums">
                {filteredRanking[1] && leader && "pontos" in leader
                  ? Math.max((leader.pontos || 0) - filteredRanking[1].pontos, 0)
                  : 0}{" "}
                pts
              </p>
              <p
                className={`mt-1 text-[18px] font-semibold ${
                  isDarkMode ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                do líder para o vice
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {filteredRanking.slice(0, 6).map((item, index) => {
            const styles = getTop6RowStyles(index + 1);
            const trendStatus =
              pilotTrendMap[item.pilotoId || normalizePilotName(item.piloto)] ||
              "stable";
            const trendVisual = getTrendVisual(trendStatus as never, isDarkMode);
            const TrendIcon = trendVisual.Icon;

            return (
              <div
                key={`share-${item.pilotoId || item.piloto}-${index}`}
                className={`flex items-center justify-between rounded-[24px] border px-5 py-4 ${
                  isDarkMode
                    ? index === 0
                      ? theme.darkLeaderRow || "border-white/10 bg-[#111827]"
                      : index === 1
                        ? theme.darkSecondRow || "border-white/10 bg-[#111827]"
                        : index === 2
                          ? theme.darkThirdRow || "border-white/10 bg-[#111827]"
                          : "border-white/10 bg-[#111827]"
                    : styles.row || "border-black/5 bg-white"
                }`}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-[18px] text-[22px] font-extrabold ${
                      isDarkMode
                        ? index === 0
                          ? "bg-white/10 text-white"
                          : index === 1
                            ? "bg-white/10 text-white"
                            : index === 2
                              ? "bg-amber-500/15 text-amber-300"
                              : "bg-white/10 text-white"
                        : styles.badge
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[26px] font-extrabold tabular-nums tracking-tight">
                      {getPilotFirstAndLastName(item.piloto)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[13px] font-semibold ${trendVisual.className}`}
                      >
                        <TrendIcon className="h-3.5 w-3.5" />
                        {trendVisual.label}
                      </span>
                      {getPilotWarNameDisplay(item) ? (
                        <span
                          className={`text-[14px] italic ${
                            isDarkMode ? "text-zinc-400" : "text-zinc-500"
                          }`}
                        >
                          {getPilotWarNameDisplay(item)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-3 text-center">
                  {[
                    { label: "PTS", value: item.pontos },
                    { label: "VIT", value: item.vitorias },
                    { label: "POL", value: item.poles },
                    { label: "VMR", value: item.mv },
                    { label: "PDS", value: item.podios },
                  ].map((stat) => (
                    <div
                      key={`${item.pilotoId || item.piloto}-${stat.label}`}
                      className={`min-w-[74px] rounded-[18px] border px-3 py-2 ${
                        isDarkMode
                          ? "border-white/10 bg-[#0f172a]"
                          : "border-black/5 bg-white/90"
                      }`}
                    >
                      <p
                        className={`text-[11px] font-bold uppercase tracking-[0.14em] ${
                          isDarkMode ? "text-zinc-500" : "text-zinc-400"
                        }`}
                      >
                        {stat.label}
                      </p>
                      <p className="mt-1 text-[22px] font-extrabold leading-none tabular-nums">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        ref={fullClassificationShareCardRef}
        className={`mt-6 w-[1320px] overflow-hidden rounded-[36px] border p-10 ${
          isDarkMode
            ? `border-white/10 bg-gradient-to-br ${theme.darkAccentCard} text-white`
            : `${theme.primaryBorder} bg-gradient-to-br ${theme.shellGlow} text-zinc-950`
        }`}
      >
        <div
          className={`rounded-[28px] border px-8 py-7 ${
            isDarkMode
              ? `${theme.darkAccentBorder} bg-[#111827]`
              : `${theme.heroBorder} bg-white/92`
          }`}
        >
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-[22px] ${
                  isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                }`}
              >
                <span
                  className={`text-3xl ${
                    isDarkMode ? theme.darkAccentText : theme.primaryIcon
                  }`}
                >
                  📋
                </span>
              </div>
              <div>
                <p
                  className={`text-[16px] font-bold uppercase tracking-[0.22em] ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  Classificação completa oficial
                </p>
                <h2 className="mt-2 text-[42px] font-extrabold leading-none tracking-[0.04em]">
                  CASERNA KART RACING
                </h2>
                <p
                  className={`mt-3 text-[22px] font-semibold ${
                    isDarkMode ? "text-zinc-300" : "text-zinc-700"
                  }`}
                >
                  {category} · {competitionLabels[competition] || competition}
                </p>
              </div>
            </div>

            <div
              className={`rounded-full border px-5 py-2 text-[18px] font-bold uppercase tracking-[0.12em] ${
                isDarkMode
                  ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                  : theme.searchBadge
              }`}
            >
              tabela completa
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div
              className={`rounded-[22px] border px-5 py-4 ${
                isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
              }`}
            >
              <p
                className={`text-[14px] font-bold uppercase tracking-[0.16em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Líder
              </p>
              <p className="mt-2 text-[26px] font-extrabold tabular-nums">
                {leader ? getPilotFirstAndLastName(leader.piloto) : "-"}
              </p>
              <p
                className={`mt-1 text-[18px] font-semibold ${
                  isDarkMode ? theme.darkAccentText : "text-zinc-700"
                }`}
              >
                {"pontos" in (leader || {}) ? leader?.pontos || 0 : 0} pontos
              </p>
            </div>
            <div
              className={`rounded-[22px] border px-5 py-4 ${
                isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
              }`}
            >
              <p
                className={`text-[14px] font-bold uppercase tracking-[0.16em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Pilotos
              </p>
              <p className="mt-2 text-[26px] font-extrabold tabular-nums">
                {filteredRanking.length}
              </p>
              <p
                className={`mt-1 text-[18px] font-semibold ${
                  isDarkMode ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                com pontos no recorte atual
              </p>
            </div>
            <div
              className={`rounded-[22px] border px-5 py-4 ${
                isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
              }`}
            >
              <p
                className={`text-[14px] font-bold uppercase tracking-[0.16em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Vantagem
              </p>
              <p className="mt-2 text-[26px] font-extrabold tabular-nums">
                {filteredRanking[1] && leader && "pontos" in leader
                  ? Math.max((leader.pontos || 0) - filteredRanking[1].pontos, 0)
                  : 0}{" "}
                pts
              </p>
              <p
                className={`mt-1 text-[18px] font-semibold ${
                  isDarkMode ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                do líder para o vice
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {filteredRanking.map((item, index) => {
            const rank = index + 1;
            const styles = rank <= 6 ? getTop6RowStyles(rank) : null;
            const trendStatus =
              pilotTrendMap[item.pilotoId || normalizePilotName(item.piloto)] ||
              "stable";
            const trendVisual = getTrendVisual(trendStatus as never, isDarkMode);
            const TrendIcon = trendVisual.Icon;

            const rowClass = isDarkMode
              ? rank === 1
                ? theme.darkLeaderRow || "border-white/10 bg-[#111827]"
                : rank === 2
                  ? theme.darkSecondRow || "border-white/10 bg-[#111827]"
                  : rank === 3
                    ? theme.darkThirdRow || "border-white/10 bg-[#111827]"
                    : "border-white/10 bg-[#111827]"
              : styles?.row || "border-black/5 bg-white";

            const badgeClass = isDarkMode
              ? rank === 1
                ? "bg-white/10 text-white"
                : rank === 2
                  ? "bg-white/10 text-white"
                  : rank === 3
                    ? "bg-amber-500/15 text-amber-300"
                    : "bg-zinc-100 text-zinc-900"
              : styles?.badge || "bg-zinc-100 text-zinc-800";

            return (
              <div
                key={`share-full-${item.pilotoId || item.piloto}-${index}`}
                className={`flex items-center justify-between rounded-[22px] border px-5 py-3 ${rowClass}`}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-[16px] text-[20px] font-extrabold ${badgeClass}`}
                  >
                    {rank}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[22px] font-extrabold tracking-tight">
                      {getPilotFirstAndLastName(item.piloto)}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[12px] font-semibold ${trendVisual.className}`}
                      >
                        <TrendIcon className="h-3.5 w-3.5" />
                        {trendVisual.label}
                      </span>
                      {getPilotWarNameDisplay(item) ? (
                        <span
                          className={`text-[13px] italic ${
                            isDarkMode ? "text-zinc-400" : "text-zinc-500"
                          }`}
                        >
                          {getPilotWarNameDisplay(item)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-3 text-center">
                  {[
                    { label: "PTS", value: item.pontos },
                    { label: "VIT", value: item.vitorias },
                    { label: "POL", value: item.poles },
                    { label: "VMR", value: item.mv },
                    { label: "PDS", value: item.podios },
                  ].map((stat) => (
                    <div
                      key={`full-${item.pilotoId || item.piloto}-${stat.label}`}
                      className={`min-w-[72px] rounded-[16px] border px-3 py-2 ${
                        isDarkMode
                          ? "border-white/10 bg-[#0f172a]"
                          : "border-black/5 bg-white/90"
                      }`}
                    >
                      <p
                        className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                          isDarkMode ? "text-zinc-500" : "text-zinc-400"
                        }`}
                      >
                        {stat.label}
                      </p>
                      <p className="mt-1 text-[20px] font-extrabold leading-none tabular-nums">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default React.memo(RankingShareCanvas);