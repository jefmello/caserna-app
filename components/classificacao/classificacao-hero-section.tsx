"use client";

import React from "react";
// RankingClassificationSection was a pass-through wrapper — removed.
import RankingClassificationShareCard from "@/components/ranking/ranking-classification-share-card";
import RankingChampionshipNarrativeCard from "@/components/ranking/ranking-championship-narrative-card";
import RankingEditorialCards from "@/components/ranking/ranking-editorial-cards";
import { competitionLabels, getPilotFirstAndLastName } from "@/lib/ranking/ranking-utils";
import type { CategoryTheme } from "@/lib/ranking/theme-utils";
import type {
  RankingItem,
  RankingMetaPilot,
  StatsRadar,
  StatsSummary,
  TitleFightStatus,
} from "@/types/ranking";
import type { ChampionshipNarrative } from "@/lib/hooks/useChampionshipNarrative";
import type { EditorialCardItem } from "@/lib/hooks/useEditorialCards";

type ClassificacaoHeroSectionProps = {
  isDarkMode: boolean;
  theme: CategoryTheme;
  category: string;
  competition: string;
  filteredRanking: RankingItem[];
  titleFightStatus: TitleFightStatus;
  statsSummary: StatsSummary;
  statsRadar: StatsRadar;
  bestEfficiencyPilot: RankingMetaPilot | RankingItem | null;
  championshipNarrative: ChampionshipNarrative;
  editorialCards: EditorialCardItem[];
  isSharingImage: boolean;
  onShareClassification: () => void;
};

export default function ClassificacaoHeroSection({
  isDarkMode,
  theme,
  category,
  competition,
  filteredRanking,
  titleFightStatus: _titleFightStatus,
  statsSummary,
  statsRadar,
  bestEfficiencyPilot: _bestEfficiencyPilot,
  championshipNarrative,
  editorialCards,
  isSharingImage,
  onShareClassification,
}: ClassificacaoHeroSectionProps) {
  const top6 = filteredRanking.slice(0, 6);
  const leader = top6[0];
  const sixthPlace = top6[5] ?? null;
  const seventhPlace = filteredRanking[6] ?? null;

  const top6Average =
    top6.length === 0
      ? 0
      : Math.round(top6.reduce((sum, item) => sum + (item.pontos || 0), 0) / top6.length);

  const trophyCutLabel = sixthPlace ? `${sixthPlace.pontos} pts` : "—";
  const trophyMargin =
    sixthPlace && seventhPlace
      ? Math.max((sixthPlace.pontos || 0) - (seventhPlace.pontos || 0), 0)
      : null;

  const trophyMarginLabel =
    trophyMargin === null
      ? "Sem perseguidor direto"
      : trophyMargin === 0
        ? "Corte empatado"
        : `+${trophyMargin} pts para manter o troféu`;

  const leaderAdvantageLabel =
    statsSummary?.leaderAdvantage > 0
      ? `+${statsSummary.leaderAdvantage} pts sobre o vice`
      : "Liderança empatada";

  const hottestPilotName = statsRadar?.hottestPilot?.piloto
    ? getPilotFirstAndLastName(statsRadar.hottestPilot.piloto)
    : null;

  return (
    <>
      {top6.length > 0 && (
        <div
          className={`mb-4 overflow-hidden rounded-3xl border p-5 shadow-[0_20px_40px_rgba(0,0,0,0.28)] ${
            isDarkMode
              ? "border-white/8 bg-[linear-gradient(180deg,#111827_0%,#0f172a_100%)]"
              : "border-black/5 bg-white"
          }`}
        >
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p
                className={`text-[10px] font-bold tracking-[0.2em] uppercase ${
                  isDarkMode ? "text-white/35" : "text-zinc-400"
                }`}
              >
                Zona de troféu
              </p>
              <h2
                className={`mt-1 text-[20px] font-bold tracking-[0.01em] ${
                  isDarkMode ? "text-white" : "text-zinc-950"
                }`}
              >
                Top 6 do campeonato
              </h2>
              <p className={`mt-1 text-sm ${isDarkMode ? "text-white/55" : "text-zinc-500"}`}>
                {category} · {competitionLabels[competition] || competition}
              </p>
            </div>

            <div
              className={`inline-flex w-fit rounded-full border px-3 py-1 text-[11px] font-bold ${
                isDarkMode
                  ? `${theme.darkAccentBorder} bg-white/[0.04] ${theme.darkAccentText}`
                  : "border-black/5 bg-zinc-50 text-zinc-700"
              }`}
            >
              corte oficial: {trophyCutLabel}
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            {leader && (
              <div
                className={`rounded-3xl border p-4 ${
                  isDarkMode
                    ? `${theme.darkAccentBorder} bg-white/[0.03]`
                    : "border-black/5 bg-zinc-50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p
                      className={`text-[10px] font-bold tracking-[0.16em] uppercase ${
                        isDarkMode ? theme.darkAccentText : "text-zinc-500"
                      }`}
                    >
                      Líder da zona de troféu
                    </p>
                    <p
                      className={`mt-1 text-[24px] leading-none font-black ${
                        isDarkMode ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      {getPilotFirstAndLastName(leader.piloto)}
                    </p>
                    <p
                      className={`mt-2 text-sm font-semibold ${
                        isDarkMode ? "text-white/65" : "text-zinc-600"
                      }`}
                    >
                      {leader.pontos} pts
                    </p>
                    <p
                      className={`mt-1 text-[12px] ${
                        isDarkMode ? "text-white/50" : "text-zinc-500"
                      }`}
                    >
                      {leaderAdvantageLabel}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      isDarkMode ? theme.darkAccentIconWrap : "bg-zinc-100"
                    }`}
                  >
                    <span className={isDarkMode ? theme.darkAccentText : "text-zinc-700"}>🏆</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div
                className={`rounded-3xl border p-3 ${
                  isDarkMode
                    ? "border-emerald-400/20 bg-emerald-400/[0.06]"
                    : "border-emerald-200 bg-emerald-50"
                }`}
              >
                <p
                  className={`text-[10px] font-bold tracking-[0.14em] uppercase ${
                    isDarkMode ? "text-emerald-300" : "text-emerald-700"
                  }`}
                >
                  Margem do corte
                </p>
                <p
                  className={`mt-1 text-[20px] font-bold ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  {trophyMarginLabel}
                </p>
              </div>

              <div
                className={`rounded-3xl border p-3 ${
                  isDarkMode ? "border-white/8 bg-[#0f172a]" : "border-black/5 bg-zinc-50"
                }`}
              >
                <p
                  className={`text-[10px] font-bold tracking-[0.14em] uppercase ${
                    isDarkMode ? "text-white/38" : "text-zinc-500"
                  }`}
                >
                  Média do Top 6
                </p>
                <p
                  className={`mt-1 text-[20px] font-bold ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  {top6Average} pts
                </p>
              </div>

              <div
                className={`rounded-3xl border p-3 ${
                  isDarkMode ? "border-white/8 bg-[#0f172a]" : "border-black/5 bg-zinc-50"
                }`}
              >
                <p
                  className={`text-[10px] font-bold tracking-[0.14em] uppercase ${
                    isDarkMode ? "text-white/38" : "text-zinc-500"
                  }`}
                >
                  Pressão atual
                </p>
                <p
                  className={`mt-1 text-[20px] font-bold ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  {statsRadar?.titleHeat || "Sem leitura"}
                </p>
                {hottestPilotName && (
                  <p
                    className={`mt-1 text-[11px] ${isDarkMode ? "text-white/55" : "text-zinc-500"}`}
                  >
                    Em alta: {hottestPilotName}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
            {top6.map((pilot, index) => {
              const isLeader = index === 0;
              const isCut = index === 5;
              const nextPilot = filteredRanking[index + 1] ?? null;
              const cushion =
                nextPilot && typeof nextPilot.pontos === "number"
                  ? Math.max((pilot.pontos || 0) - nextPilot.pontos, 0)
                  : null;

              return (
                <div
                  key={`${pilot.piloto}-${index}`}
                  className={`rounded-3xl border p-3 transition-all ${
                    isDarkMode
                      ? isLeader
                        ? `${theme.darkAccentBorder} bg-white/[0.04]`
                        : isCut
                          ? "border-emerald-400/20 bg-emerald-400/[0.06]"
                          : "border-white/8 bg-[#0f172a]"
                      : isLeader
                        ? "border-black/10 bg-zinc-50"
                        : isCut
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-black/5 bg-white"
                  }`}
                >
                  <p
                    className={`text-[10px] font-bold tracking-[0.14em] uppercase ${
                      isDarkMode
                        ? isLeader
                          ? theme.darkAccentText
                          : isCut
                            ? "text-emerald-300"
                            : "text-white/38"
                        : "text-zinc-500"
                    }`}
                  >
                    P{index + 1}
                  </p>

                  <p
                    className={`mt-2 line-clamp-2 text-[14px] leading-tight font-semibold ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    {getPilotFirstAndLastName(pilot.piloto)}
                  </p>

                  <p
                    className={`mt-1 text-[11px] font-medium ${
                      isDarkMode ? "text-white/60" : "text-zinc-500"
                    }`}
                  >
                    {pilot.pontos} pts
                  </p>

                  <p
                    className={`mt-1 text-[10px] font-semibold ${
                      isDarkMode ? "text-white/45" : "text-zinc-400"
                    }`}
                  >
                    {cushion === null
                      ? "sem perseguidor direto"
                      : cushion === 0
                        ? "empate técnico"
                        : `${cushion} pts de margem`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(280px,0.38fr)_minmax(0,0.62fr)]">
        <div className="xl:sticky xl:top-4">
          <div className="mx-auto w-full max-w-[420px] xl:mx-0 xl:max-w-none">
            <RankingClassificationShareCard
              isDarkMode={isDarkMode}
              theme={theme}
              isSharingImage={isSharingImage}
              filteredRankingLength={filteredRanking.length}
              onShare={onShareClassification}
            />
          </div>
        </div>

        <div className="space-y-4">
          <RankingChampionshipNarrativeCard
            isDarkMode={isDarkMode}
            theme={theme}
            category={category}
            competitionLabel={competitionLabels[competition] || competition}
            narrative={championshipNarrative}
          />

          <RankingEditorialCards isDarkMode={isDarkMode} theme={theme} cards={editorialCards} />
        </div>
      </div>
    </>
  );
}
