"use client";

import React from "react";
import RankingClassificationSection from "@/components/ranking/ranking-classification-section";
import RankingClassificationShareCard from "@/components/ranking/ranking-classification-share-card";
import RankingCompetitionContext from "@/components/ranking/sections/ranking-competition-context";
import RankingChampionshipNarrativeCard from "@/components/ranking/ranking-championship-narrative-card";
import RankingEditorialCards from "@/components/ranking/ranking-editorial-cards";
import {
  competitionLabels,
  getPilotFirstAndLastName,
} from "@/lib/ranking/ranking-utils";

type ClassificacaoHeroSectionProps = {
  isDarkMode: boolean;
  theme: any;
  category: string;
  competition: string;
  filteredRanking: any[];
  titleFightStatus: any;
  statsSummary: any;
  statsRadar: any;
  bestEfficiencyPilot: any;
  championshipNarrative: any;
  editorialCards: any[];
  isSharingImage: boolean;
  onShareClassification: () => void;
};

export default function ClassificacaoHeroSection({
  isDarkMode,
  theme,
  category,
  competition,
  filteredRanking,
  titleFightStatus,
  statsSummary,
  statsRadar,
  bestEfficiencyPilot,
  championshipNarrative,
  editorialCards,
  isSharingImage,
  onShareClassification,
}: ClassificacaoHeroSectionProps) {
  const top6 = filteredRanking.slice(0, 6);
  const leader = top6[0];
  const top6Cut = top6[5]?.pontos ?? 0;

  return (
    <RankingClassificationSection>
      {top6.length > 0 && (
        <div
          className={`mb-4 overflow-hidden rounded-[28px] border p-5 shadow-[0_20px_40px_rgba(0,0,0,0.28)] ${
            isDarkMode
              ? "border-white/8 bg-[linear-gradient(180deg,#0b0f16_0%,#0f172a_100%)]"
              : "border-black/5 bg-white"
          }`}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p
                className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                  isDarkMode ? "text-white/32" : "text-zinc-400"
                }`}
              >
                Zona de troféu
              </p>
              <h2
                className={`mt-1 text-[20px] font-extrabold tracking-[0.01em] ${
                  isDarkMode ? "text-white" : "text-zinc-950"
                }`}
              >
                Top 6 do campeonato
              </h2>
              <p
                className={`mt-1 text-sm ${
                  isDarkMode ? "text-white/52" : "text-zinc-500"
                }`}
              >
                {category} · {competitionLabels[competition] || competition}
              </p>
            </div>

            <div
              className={`rounded-full border px-3 py-1 text-[11px] font-bold ${
                isDarkMode
                  ? `${theme.darkAccentBorder} bg-[#111827] ${theme.darkAccentText} shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]`
                  : "border-black/5 bg-zinc-50 text-zinc-700"
              }`}
            >
              corte: {top6Cut} pts
            </div>
          </div>

          {leader && (
            <div
              className={`mb-4 flex items-center justify-between gap-4 rounded-[24px] border p-4 ${
                isDarkMode
                  ? `${theme.darkAccentBorder} bg-[linear-gradient(180deg,#111827_0%,#0f172a_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_14px_28px_rgba(0,0,0,0.24)]`
                  : "border-black/5 bg-zinc-50"
              }`}
            >
              <div className="min-w-0">
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                    isDarkMode ? theme.darkAccentText : "text-zinc-500"
                  }`}
                >
                  Líder
                </p>
                <p
                  className={`mt-1 truncate text-[24px] font-black leading-none ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  {getPilotFirstAndLastName(leader.piloto)}
                </p>
                <p
                  className={`mt-2 text-sm font-semibold ${
                    isDarkMode ? "text-white/62" : "text-zinc-600"
                  }`}
                >
                  {leader.pontos} pts
                </p>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-[0_8px_18px_rgba(0,0,0,0.16)] ${
                  isDarkMode
                    ? `${theme.darkAccentBorder} ${theme.darkAccentIconWrap}`
                    : "bg-zinc-100"
                }`}
              >
                <span className={isDarkMode ? theme.darkAccentText : "text-zinc-700"}>
                  🏆
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
            {top6.map((pilot, index) => {
              const isLeader = index === 0;
              const isCut = index === 5;

              return (
                <div
                  key={`${pilot.piloto}-${index}`}
                  className={`rounded-[22px] border p-3 transition-all ${
                    isDarkMode
                      ? isLeader
                        ? `${theme.darkAccentBorder} bg-[linear-gradient(180deg,#111827_0%,#0f172a_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_22px_rgba(0,0,0,0.2)]`
                        : isCut
                          ? "border-emerald-400/18 bg-[linear-gradient(180deg,rgba(6,78,59,0.18)_0%,rgba(15,23,42,0.96)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                          : "border-white/8 bg-[#111827] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                      : isLeader
                        ? "border-black/10 bg-zinc-50"
                        : isCut
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-black/5 bg-white"
                  }`}
                >
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                      isDarkMode
                        ? isLeader
                          ? theme.darkAccentText
                          : isCut
                            ? "text-emerald-300"
                            : "text-white/36"
                        : "text-zinc-500"
                    }`}
                  >
                    P{index + 1}
                  </p>

                  <p
                    className={`mt-2 truncate text-[13px] font-extrabold ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    {getPilotFirstAndLastName(pilot.piloto)}
                  </p>

                  <p
                    className={`mt-1 text-[11px] font-medium ${
                      isDarkMode ? "text-white/58" : "text-zinc-500"
                    }`}
                  >
                    {pilot.pontos} pts
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <RankingClassificationShareCard
        isDarkMode={isDarkMode}
        theme={theme}
        isSharingImage={isSharingImage}
        filteredRankingLength={filteredRanking.length}
        onShare={onShareClassification}
      />

      <RankingCompetitionContext
        isDarkMode={isDarkMode}
        theme={theme}
        titleFightStatus={titleFightStatus}
        statsSummary={statsSummary}
        statsRadar={statsRadar}
        bestEfficiencyPilot={bestEfficiencyPilot}
        getPilotFirstAndLastName={getPilotFirstAndLastName}
      />

      <RankingChampionshipNarrativeCard
        isDarkMode={isDarkMode}
        theme={theme}
        category={category}
        competitionLabel={competitionLabels[competition] || competition}
        narrative={championshipNarrative}
      />

      <RankingEditorialCards
        isDarkMode={isDarkMode}
        theme={theme}
        cards={editorialCards}
      />
    </RankingClassificationSection>
  );
}