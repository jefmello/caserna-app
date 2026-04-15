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
    <div className="pointer-events-none fixed -left-[9999px] top-0 z-[-1] opacity-0">
      {/* Leader card */}
      <div
        ref={leaderShareCardRef}
        className={`relative w-[1080px] overflow-hidden rounded-[36px] border p-8 ${
          isDarkMode
            ? `border-white/10 text-white`
            : `${theme.primaryBorder} text-zinc-950`
        }`}
        style={{
          background: isDarkMode
            ? `linear-gradient(135deg, #0b0f16 0%, #111827 40%, #0f172a 100%)`
            : `linear-gradient(135deg, #ffffff 0%, #fafafa 100%)`,
        }}
      >
        {/* Accent color bleed */}
        <div
          className={`absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl ${
            isDarkMode ? "bg-white/5" : `${theme.primaryIconWrap} opacity-30`
          }`}
        />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

        <div
          className={`relative rounded-[28px] border p-7 ${
            isDarkMode
              ? `${theme.darkAccentBorder} bg-[#111827]/90`
              : `${theme.heroBorder} bg-white/92`
          }`}
        >
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Pilot photo */}
              {leader && (
                <div className={`h-20 w-20 overflow-hidden rounded-[22px] border ${
                  isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50"
                }`}>
                  {(() => {
                    const pilotoId = "pilotoId" in (leader || {}) ? leader?.pilotoId : null;
                    return pilotoId ? (
                      <img
                        src={`/pilotos/${pilotoId}.jpg`}
                        alt={getPilotFirstAndLastName((leader as any)?.piloto)}
                        className="h-full w-full object-cover object-center"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className={`flex h-full w-full items-center justify-center ${
                        isDarkMode ? "bg-white/5" : "bg-zinc-100"
                      }`}>
                        <span className="text-2xl">🏎️</span>
                      </div>
                    );
                  })()}
                </div>
              )}
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

            <div className="flex items-center gap-3">
              {/* Streak badge */}
              {leader && (
                <div
                  className={`rounded-full border px-4 py-1.5 text-[13px] font-bold uppercase tracking-[0.12em] ${
                    isDarkMode
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {(() => {
                    const v = (leader as RankingItem).vitorias || 0;
                    const p = (leader as RankingItem).podios || 0;
                    const r = (leader as RankingItem).participacoes || 1;
                    if (v >= 3 && p / r >= 0.6) return "🔥 Dominante";
                    if (p / r >= 0.7) return "⭐ Consistência Elite";
                    if (v >= 2) return "💥 Ofensiva";
                    if (p >= 2) return "📈 Em Ascensão";
                    return "🏁 Ativo";
                  })()}
                </div>
              )}
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
          </div>

          {/* Title progress bar */}
          {leader && filteredRanking.length >= 2 && (
            <div className="mt-5">
              <div className="flex items-center justify-between text-[12px] font-semibold">
                <span className={isDarkMode ? "text-zinc-400" : "text-zinc-500"}>Progresso para o título</span>
                <span className={isDarkMode ? theme.darkAccentText : theme.primaryIcon}>
                  {Math.min(Math.round(((leader.pontos || 0) / Math.max((leader.pontos || 0) + (filteredRanking[1]?.pontos || 0), 1)) * 100), 100)}%
                </span>
              </div>
              <div className={`mt-2 h-3 w-full overflow-hidden rounded-full ${
                isDarkMode ? "bg-white/5" : "bg-zinc-100"
              }`}>
                <div
                  className={`h-full rounded-full transition-all ${
                    isDarkMode ? theme.darkAccentBgSoft : theme.primaryIconWrap
                  }`}
                  style={{
                    width: `${Math.min(((leader.pontos || 0) / Math.max((leader.pontos || 0) + (filteredRanking[1]?.pontos || 0), 1)) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="mt-5 grid grid-cols-4 gap-4">
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

        {/* Watermark + timestamp footer */}
        <div className="mt-4 flex items-center justify-between px-2">
          <p className={`text-[12px] font-bold uppercase tracking-[0.2em] ${
            isDarkMode ? "text-zinc-600" : "text-zinc-300"
          }`}>
            CASERNA KART RACING
          </p>
          <p className={`text-[12px] ${
            isDarkMode ? "text-zinc-600" : "text-zinc-300"
          }`}>
            {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>

      {/* Narrative card */}
      <div
        ref={narrativeShareCardRef}
        className={`relative mt-6 w-[1080px] overflow-hidden rounded-[36px] border p-8 ${
          isDarkMode
            ? "border-white/10 text-white"
            : `${theme.primaryBorder} text-zinc-950`
        }`}
        style={{
          background: isDarkMode
            ? `linear-gradient(135deg, #0b0f16 0%, #111827 40%, #0f172a 100%)`
            : `linear-gradient(135deg, #ffffff 0%, #fafafa 100%)`,
        }}
      >
        <div
          className={`absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl ${
            isDarkMode ? "bg-white/5" : `${theme.primaryIconWrap} opacity-30`
          }`}
        />

        <div
          className={`relative rounded-[28px] border p-7 ${
            isDarkMode
              ? `${theme.darkAccentBorder} bg-[#111827]/90`
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

        <div className="mt-4 flex items-center justify-between px-2">
          <p className={`text-[12px] font-bold uppercase tracking-[0.2em] ${
            isDarkMode ? "text-zinc-600" : "text-zinc-300"
          }`}>
            CASERNA KART RACING
          </p>
          <p className={`text-[12px] ${
            isDarkMode ? "text-zinc-600" : "text-zinc-300"
          }`}>
            {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>

      {/* Duel card */}
      <div
        ref={duelShareCardRef}
        className={`relative mt-6 w-[1080px] overflow-hidden rounded-[36px] border p-8 ${
          isDarkMode
            ? "border-white/10 text-white"
            : `${theme.primaryBorder} text-zinc-950`
        }`}
        style={{
          background: isDarkMode
            ? `linear-gradient(135deg, #0b0f16 0%, #111827 40%, #0f172a 100%)`
            : `linear-gradient(135deg, #ffffff 0%, #fafafa 100%)`,
        }}
      >
        <div
          className={`absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl ${
            isDarkMode ? "bg-white/5" : `${theme.primaryIconWrap} opacity-30`
          }`}
        />

        <div
          className={`relative rounded-[28px] border p-7 ${
            isDarkMode
              ? `${theme.darkAccentBorder} bg-[#111827]/90`
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
              {/* Dramatic headline with war names */}
              <h2 className="mt-2 text-[40px] font-extrabold leading-tight tracking-tight">
                {comparePilotA
                  ? (comparePilotA.nomeGuerra
                      ? `"${normalizePilotName(comparePilotA.nomeGuerra)}"`
                      : getPilotFirstAndLastName(comparePilotA.piloto))
                  : "Piloto A"}{" "}
                <span className={isDarkMode ? "text-zinc-500" : "text-zinc-400"}>vs</span>{" "}
                {comparePilotB
                  ? (comparePilotB.nomeGuerra
                      ? `"${normalizePilotName(comparePilotB.nomeGuerra)}"`
                      : getPilotFirstAndLastName(comparePilotB.piloto))
                  : "Piloto B"}
              </h2>
              {/* Sub-line with full names */}
              {comparePilotA && comparePilotB && comparePilotA.nomeGuerra && comparePilotB.nomeGuerra && (
                <p
                  className={`mt-1 text-[18px] font-medium ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  {getPilotFirstAndLastName(comparePilotA.piloto)} vs {getPilotFirstAndLastName(comparePilotB.piloto)}
                </p>
              )}
              <p
                className={`mt-2 text-[20px] font-semibold ${
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

          {/* VS score center */}
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

          {/* Visual comparison bars */}
          {comparePilotA && comparePilotB && (
            <div className="mt-6 space-y-3">
              {[
                { label: "Pontos", a: comparePilotA.pontos, b: comparePilotB.pontos },
                { label: "Vitórias", a: comparePilotA.vitorias, b: comparePilotB.vitorias },
                { label: "Poles", a: comparePilotA.poles, b: comparePilotB.poles },
                { label: "VMR", a: comparePilotA.mv, b: comparePilotB.mv },
                { label: "Pódios", a: comparePilotA.podios, b: comparePilotB.podios },
              ].map((metric) => {
                const maxVal = Math.max(metric.a, metric.b, 1);
                return (
                  <div key={`duel-bar-${metric.label}`} className="flex items-center gap-3">
                    <span className={`w-16 text-right text-[12px] font-bold ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>{metric.label}</span>
                    {/* Bar A */}
                    <div className="flex flex-1 items-center gap-2">
                      <div className={`h-5 flex-1 overflow-hidden rounded-full ${isDarkMode ? "bg-white/5" : "bg-zinc-100"}`}>
                        <div
                          className={`h-full rounded-full ${isDarkMode ? theme.darkAccentBgSoft : theme.primaryIconWrap}`}
                          style={{ width: `${(metric.a / maxVal) * 100}%` }}
                        />
                      </div>
                      <span className={`w-8 text-center text-[13px] font-bold tabular-nums ${isDarkMode ? "text-zinc-200" : "text-zinc-700"}`}>{metric.a}</span>
                    </div>
                    {/* Bar B */}
                    <div className="flex flex-1 items-center gap-2">
                      <span className={`w-8 text-center text-[13px] font-bold tabular-nums ${isDarkMode ? "text-zinc-200" : "text-zinc-700"}`}>{metric.b}</span>
                      <div className={`h-5 flex-1 overflow-hidden rounded-full ${isDarkMode ? "bg-white/5" : "bg-zinc-100"}`}>
                        <div
                          className={`h-full rounded-full ${isDarkMode ? "bg-blue-500/30" : "bg-blue-200"}`}
                          style={{ width: `${(metric.b / maxVal) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

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

        <div className="mt-4 flex items-center justify-between px-2">
          <p className={`text-[12px] font-bold uppercase tracking-[0.2em] ${
            isDarkMode ? "text-zinc-600" : "text-zinc-300"
          }`}>
            CASERNA KART RACING
          </p>
          <p className={`text-[12px] ${
            isDarkMode ? "text-zinc-600" : "text-zinc-300"
          }`}>
            {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>

      <div
        ref={shareCardRef}
        className={`relative w-[1200px] overflow-hidden rounded-[36px] border p-10 ${
          isDarkMode
            ? `border-white/10 text-white`
            : `${theme.primaryBorder} text-zinc-950`
        }`}
        style={{
          background: isDarkMode
            ? `linear-gradient(135deg, #0b0f16 0%, #111827 40%, #0f172a 100%)`
            : `linear-gradient(135deg, #ffffff 0%, #fafafa 100%)`,
        }}
      >
        {/* Accent color bleed */}
        <div
          className={`absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl ${
            isDarkMode ? "bg-white/5" : `${theme.primaryIconWrap} opacity-30`
          }`}
        />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
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

        {/* Watermark + timestamp footer */}
        <div className="mt-4 flex items-center justify-between px-2">
          <p className={`text-[12px] font-bold uppercase tracking-[0.2em] ${
            isDarkMode ? "text-zinc-600" : "text-zinc-300"
          }`}>
            CASERNA KART RACING
          </p>
          <p className={`text-[12px] ${
            isDarkMode ? "text-zinc-600" : "text-zinc-300"
          }`}>
            {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>

      <div
        ref={fullClassificationShareCardRef}
        className={`relative mt-6 w-[1260px] overflow-hidden rounded-[34px] border p-7 ${
          isDarkMode
            ? `border-white/10 text-white`
            : `${theme.primaryBorder} text-zinc-950`
        }`}
        style={{
          background: isDarkMode
            ? `linear-gradient(135deg, #0b0f16 0%, #111827 40%, #0f172a 100%)`
            : `linear-gradient(135deg, #ffffff 0%, #fafafa 100%)`,
        }}
      >
        {/* Accent color bleed */}
        <div
          className={`absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl ${
            isDarkMode ? "bg-white/5" : `${theme.primaryIconWrap} opacity-30`
          }`}
        />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        <div
          className={`rounded-[26px] border px-6 py-5 ${
            isDarkMode
              ? `${theme.darkAccentBorder} bg-[#111827]`
              : `${theme.heroBorder} bg-white/92`
          }`}
        >
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-[20px] ${
                  isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                }`}
              >
                <span
                  className={`text-[28px] ${
                    isDarkMode ? theme.darkAccentText : theme.primaryIcon
                  }`}
                >
                  📋
                </span>
              </div>

              <div>
                <p
                  className={`text-[13px] font-bold uppercase tracking-[0.2em] ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  Classificação completa oficial
                </p>
                <h2 className="mt-1.5 text-[34px] font-extrabold leading-none tracking-[0.03em]">
                  CASERNA KART RACING
                </h2>
                <p
                  className={`mt-2 text-[18px] font-semibold ${
                    isDarkMode ? "text-zinc-300" : "text-zinc-700"
                  }`}
                >
                  {category} · {competitionLabels[competition] || competition}
                </p>
              </div>
            </div>

            <div
              className={`rounded-full border px-4 py-1.5 text-[14px] font-bold uppercase tracking-[0.12em] ${
                isDarkMode
                  ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                  : theme.searchBadge
              }`}
            >
              tabela completa
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div
              className={`rounded-[18px] border px-4 py-3 ${
                isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
              }`}
            >
              <p
                className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Líder
              </p>
              <p className="mt-1.5 text-[21px] font-extrabold tracking-tight">
                {leader ? getPilotFirstAndLastName(leader.piloto) : "-"}
              </p>
              <p
                className={`mt-1 text-[14px] font-semibold ${
                  isDarkMode ? theme.darkAccentText : "text-zinc-700"
                }`}
              >
                {"pontos" in (leader || {}) ? leader?.pontos || 0 : 0} pontos
              </p>
            </div>

            <div
              className={`rounded-[18px] border px-4 py-3 ${
                isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
              }`}
            >
              <p
                className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Pilotos
              </p>
              <p className="mt-1.5 text-[21px] font-extrabold tabular-nums">
                {filteredRanking.length}
              </p>
              <p
                className={`mt-1 text-[14px] font-semibold ${
                  isDarkMode ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                com pontos no recorte atual
              </p>
            </div>

            <div
              className={`rounded-[18px] border px-4 py-3 ${
                isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
              }`}
            >
              <p
                className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Vantagem
              </p>
              <p className="mt-1.5 text-[21px] font-extrabold tabular-nums">
                {filteredRanking[1] && leader && "pontos" in leader
                  ? Math.max((leader.pontos || 0) - filteredRanking[1].pontos, 0)
                  : 0}{" "}
                pts
              </p>
              <p
                className={`mt-1 text-[14px] font-semibold ${
                  isDarkMode ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                do líder para o vice
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
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
                className={`flex items-center justify-between rounded-[20px] border px-4 py-2.5 ${rowClass}`}
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-[14px] text-[17px] font-extrabold ${badgeClass}`}
                  >
                    {rank}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[18px] font-extrabold tracking-tight">
                      {getPilotFirstAndLastName(item.piloto)}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${trendVisual.className}`}
                      >
                        <TrendIcon className="h-3 w-3" />
                        {trendVisual.label}
                      </span>
                      {getPilotWarNameDisplay(item) ? (
                        <span
                          className={`text-[12px] italic ${
                            isDarkMode ? "text-zinc-400" : "text-zinc-500"
                          }`}
                        >
                          {getPilotWarNameDisplay(item)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2.5 text-center">
                  {[
                    { label: "PTS", value: item.pontos },
                    { label: "VIT", value: item.vitorias },
                    { label: "POL", value: item.poles },
                    { label: "VMR", value: item.mv },
                    { label: "PDS", value: item.podios },
                  ].map((stat) => (
                    <div
                      key={`full-${item.pilotoId || item.piloto}-${stat.label}`}
                      className={`min-w-[66px] rounded-[14px] border px-2.5 py-1.5 ${
                        isDarkMode
                          ? "border-white/10 bg-[#0f172a]"
                          : "border-black/5 bg-white/90"
                      }`}
                    >
                      <p
                        className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                          isDarkMode ? "text-zinc-500" : "text-zinc-400"
                        }`}
                      >
                        {stat.label}
                      </p>
                      <p className="mt-1 text-[17px] font-extrabold leading-none tabular-nums">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Watermark + timestamp footer */}
        <div className="mt-4 flex items-center justify-between px-2">
          <p className={`text-[12px] font-bold uppercase tracking-[0.2em] ${
            isDarkMode ? "text-zinc-600" : "text-zinc-300"
          }`}>
            CASERNA KART RACING
          </p>
          <p className={`text-[12px] ${
            isDarkMode ? "text-zinc-600" : "text-zinc-300"
          }`}>
            {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>

      {/* Top 6 Podium card */}
      <div
        ref={refs.podiumCardRef}
        className={`relative mt-6 w-[1080px] overflow-hidden rounded-[36px] border p-8 ${
          isDarkMode
            ? `border-white/10 text-white`
            : `${theme.primaryBorder} text-zinc-950`
        }`}
        style={{
          background: isDarkMode
            ? `linear-gradient(135deg, #0b0f16 0%, #111827 40%, #0f172a 100%)`
            : `linear-gradient(135deg, #ffffff 0%, #fafafa 100%)`,
        }}
      >
        {/* Accent color bleed */}
        <div
          className={`absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl ${
            isDarkMode ? "bg-white/5" : `${theme.primaryIconWrap} opacity-30`
          }`}
        />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

        <div
          className={`relative rounded-[28px] border p-7 ${
            isDarkMode
              ? `${theme.darkAccentBorder} bg-[#111827]/90`
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
                Pódio oficial
              </p>
              <h2 className="mt-2 text-[40px] font-extrabold leading-tight tracking-tight">
                Top 6 — {category}
              </h2>
              <p
                className={`mt-2 text-[20px] font-semibold ${
                  isDarkMode ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                {competitionLabels[competition] || competition}
              </p>
            </div>

            <div
              className={`rounded-full border px-5 py-2 text-[15px] font-bold uppercase tracking-[0.14em] ${
                isDarkMode
                  ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                  : theme.searchBadge
              }`}
            >
              Pódio
            </div>
          </div>

          {/* Podium: 6 pilots with distinct styling */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[0, 2, 1].map((posIdx) => {
              const pilot = filteredRanking[posIdx];
              if (!pilot) return null;
              const podiumStyles = getTop6RowStyles(posIdx + 1);
              const posLabels = ["1°", "2°", "3°"];
              const posBadges = [
                "from-yellow-400 to-amber-500",
                "from-gray-300 to-gray-400",
                "from-amber-600 to-amber-800"
              ];
              const posLabels2 = ["1° LUGAR", "2° LUGAR", "3° LUGAR"];

              return (
                <div
                  key={`podium-top-${posIdx}`}
                  className={`flex flex-col items-center rounded-[24px] border px-5 py-6 ${
                    isDarkMode
                      ? "border-white/10 bg-[#0f172a]"
                      : podiumStyles.row || "border-black/5 bg-white"
                  }`}
                >
                  {/* Position badge */}
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-xl font-black text-white shadow-lg ${posBadges[posIdx]}`}>
                    {posLabels[posIdx]}
                  </div>

                  {/* Pilot photo placeholder */}
                  {(() => {
                    const pilotoId = pilot.pilotoId || null;
                    return pilotoId ? (
                      <div className={`mt-4 h-20 w-20 overflow-hidden rounded-[18px] border ${
                        isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-zinc-50"
                      }`}>
                        <img
                          src={`/pilotos/${pilotoId}.jpg`}
                          alt={getPilotFirstAndLastName(pilot.piloto)}
                          className="h-full w-full object-cover object-center"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                            (e.target as HTMLImageElement).parentElement!.style.display = "flex";
                            (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex h-full w-full items-center justify-center bg-zinc-100 text-2xl">🏎️</div>';
                          }}
                        />
                      </div>
                    ) : (
                      <div className={`mt-4 flex h-20 w-20 items-center justify-center rounded-[18px] border text-3xl ${
                        isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-zinc-100"
                      }`}>
                        🏎️
                      </div>
                    );
                  })()}

                  <p className={`mt-3 text-[22px] font-extrabold text-center ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}>
                    {getPilotFirstAndLastName(pilot.piloto)}
                  </p>
                  {pilot.nomeGuerra && (
                    <p className={`text-[16px] italic ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                      "{normalizePilotName(pilot.nomeGuerra)}"
                    </p>
                  )}

                  <p className={`mt-2 text-[32px] font-extrabold tabular-nums ${
                    isDarkMode ? theme.darkAccentText : theme.primaryIcon
                  }`}>
                    {pilot.pontos} pts
                  </p>

                  <div className="mt-3 flex gap-3 text-center">
                    <div>
                      <p className={`text-[11px] font-bold ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>VIT</p>
                      <p className={`text-lg font-extrabold tabular-nums ${isDarkMode ? "text-zinc-200" : "text-zinc-700"}`}>{pilot.vitorias}</p>
                    </div>
                    <div>
                      <p className={`text-[11px] font-bold ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>PDS</p>
                      <p className={`text-lg font-extrabold tabular-nums ${isDarkMode ? "text-zinc-200" : "text-zinc-700"}`}>{pilot.podios}</p>
                    </div>
                    <div>
                      <p className={`text-[11px] font-bold ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>POL</p>
                      <p className={`text-lg font-extrabold tabular-nums ${isDarkMode ? "text-zinc-200" : "text-zinc-700"}`}>{pilot.poles}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Positions 4, 5, 6 */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[3, 4, 5].map((posIdx) => {
              const pilot = filteredRanking[posIdx];
              if (!pilot) return null;
              const pos4Badges = [
                "from-sky-400 to-blue-500",
                "from-violet-400 to-purple-500",
                "from-emerald-400 to-green-500"
              ];
              const posLabels = ["4°", "5°", "6°"];
              const podiumStyles = getTop6RowStyles(posIdx + 1);

              return (
                <div
                  key={`podium-bottom-${posIdx}`}
                  className={`flex items-center gap-4 rounded-[20px] border px-4 py-4 ${
                    isDarkMode
                      ? "border-white/10 bg-[#0f172a]"
                      : podiumStyles.row || "border-black/5 bg-white"
                  }`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-base font-black text-white shadow ${pos4Badges[posIdx - 3]}`}>
                    {posLabels[posIdx - 3]}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-[20px] font-extrabold ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                      {getPilotFirstAndLastName(pilot.piloto)}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[24px] font-extrabold tabular-nums ${
                        isDarkMode ? theme.darkAccentText : theme.primaryIcon
                      }`}>
                        {pilot.pontos} pts
                      </span>
                      <span className={`text-[13px] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                        · {pilot.vitorias}V · {pilot.podios}P
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Watermark + timestamp footer */}
        <div className="mt-4 flex items-center justify-between px-2">
          <p className={`text-[12px] font-bold uppercase tracking-[0.2em] ${
            isDarkMode ? "text-zinc-600" : "text-zinc-300"
          }`}>
            CASERNA KART RACING
          </p>
          <p className={`text-[12px] ${
            isDarkMode ? "text-zinc-600" : "text-zinc-300"
          }`}>
            {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>

      {/* Championship Evolution card */}
      <div
        ref={refs.evolutionCardRef}
        className={`relative mt-6 w-[1080px] overflow-hidden rounded-[36px] border p-8 ${
          isDarkMode
            ? `border-white/10 text-white`
            : `${theme.primaryBorder} text-zinc-950`
        }`}
        style={{
          background: isDarkMode
            ? `linear-gradient(135deg, #0b0f16 0%, #111827 40%, #0f172a 100%)`
            : `linear-gradient(135deg, #ffffff 0%, #fafafa 100%)`,
        }}
      >
        {/* Accent color bleed */}
        <div
          className={`absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl ${
            isDarkMode ? "bg-white/5" : `${theme.primaryIconWrap} opacity-30`
          }`}
        />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

        <div
          className={`relative rounded-[28px] border p-7 ${
            isDarkMode
              ? `${theme.darkAccentBorder} bg-[#111827]/90`
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
                Panorama do campeonato
              </p>
              <h2 className="mt-2 text-[40px] font-extrabold leading-tight tracking-tight">
                {category} · {competitionLabels[competition] || competition}
              </h2>
            </div>

            <div
              className={`rounded-full border px-5 py-2 text-[15px] font-bold uppercase tracking-[0.14em] ${
                isDarkMode
                  ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                  : theme.searchBadge
              }`}
            >
              Evolução
            </div>
          </div>

          {/* Championship headline */}
          <div className={`mt-5 rounded-[20px] border px-5 py-4 ${
            isDarkMode
              ? `border-white/10 bg-[#0f172a]`
              : `border-black/5 bg-white`
          }`}>
            <p className={`text-[13px] font-bold uppercase tracking-[0.16em] ${
              isDarkMode ? "text-zinc-500" : "text-zinc-400"
            }`}>
              {championshipNarrative.headline}
            </p>
            <p className={`mt-1 text-[18px] leading-snug ${
              isDarkMode ? "text-zinc-200" : "text-zinc-600"
            }`}>
              {championshipNarrative.body}
            </p>
          </div>

          {/* Top 3 trend indicators */}
          <p className={`mt-5 text-[13px] font-bold uppercase tracking-[0.16em] ${
            isDarkMode ? "text-zinc-500" : "text-zinc-400"
          }`}>
            Posição atual e tendência
          </p>
          <div className="mt-3 space-y-3">
            {filteredRanking.slice(0, 6).map((item, index) => {
              const styles = getTop6RowStyles(index + 1);
              const trendStatus =
                pilotTrendMap[item.pilotoId || normalizePilotName(item.piloto)] ||
                "stable";
              const trendV = getTrendVisual(trendStatus as never, isDarkMode);
              const TrendI = trendV.Icon;

              return (
                <div
                  key={`evo-${item.pilotoId || item.piloto}-${index}`}
                  className={`flex items-center justify-between rounded-[20px] border px-4 py-3 ${
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
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-[14px] text-[16px] font-extrabold ${
                      isDarkMode
                        ? index === 0
                          ? "bg-white/10 text-white"
                          : index === 1
                            ? "bg-white/10 text-white"
                            : index === 2
                              ? "bg-amber-500/15 text-amber-300"
                              : "bg-white/10 text-white"
                        : styles.badge
                    }`}>
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className={`truncate text-[20px] font-extrabold tabular-nums ${
                        isDarkMode ? "text-white" : "text-zinc-950"
                      }`}>
                        {getPilotFirstAndLastName(item.piloto)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Trend badge */}
                    <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-bold ${trendV.className}`}>
                      <TrendI className="h-3.5 w-3.5" />
                      {trendV.label}
                    </div>
                    {/* Points */}
                    <p className={`text-[22px] font-extrabold tabular-nums ${
                      isDarkMode ? theme.darkAccentText : theme.primaryIcon
                    }`}>
                      {item.pontos} pts
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Aggregate stats */}
          <div className="mt-5 grid grid-cols-4 gap-3">
            <div className={`rounded-[18px] border px-4 py-3 text-center ${
              isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
            }`}>
              <p className={`text-[11px] font-bold uppercase tracking-[0.14em] ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}>Pilotos</p>
              <p className={`mt-1 text-[24px] font-extrabold tabular-nums ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                {statsSummary.totalPilots}
              </p>
            </div>
            <div className={`rounded-[18px] border px-4 py-3 text-center ${
              isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
            }`}>
              <p className={`text-[11px] font-bold uppercase tracking-[0.14em] ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}>Vitórias</p>
              <p className={`mt-1 text-[24px] font-extrabold tabular-nums ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                {statsSummary.totalVictories || 0}
              </p>
            </div>
            <div className={`rounded-[18px] border px-4 py-3 text-center ${
              isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
            }`}>
              <p className={`text-[11px] font-bold uppercase tracking-[0.14em] ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}>Pódios</p>
              <p className={`mt-1 text-[24px] font-extrabold tabular-nums ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                {statsSummary.totalPodiums || 0}
              </p>
            </div>
            <div className={`rounded-[18px] border px-4 py-3 text-center ${
              isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
            }`}>
              <p className={`text-[11px] font-bold uppercase tracking-[0.14em] ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}>Média</p>
              <p className={`mt-1 text-[24px] font-extrabold tabular-nums ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                {Math.round(statsSummary.avgPoints || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Watermark + timestamp footer */}
        <div className="mt-4 flex items-center justify-between px-2">
          <p className={`text-[12px] font-bold uppercase tracking-[0.2em] ${
            isDarkMode ? "text-zinc-600" : "text-zinc-300"
          }`}>
            CASERNA KART RACING
          </p>
          <p className={`text-[12px] ${
            isDarkMode ? "text-zinc-600" : "text-zinc-300"
          }`}>
            {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default React.memo(RankingShareCanvas);