"use client";

import React from "react";
import { ChevronRight, Swords } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type RankingItem = {
  pos: number;
  pilotoId: string;
  piloto: string;
  nomeGuerra: string;
  pontos: number;
  adv: number;
  participacoes: number;
  vitorias: number;
  poles: number;
  mv: number;
  podios: number;
  descarte: number;
  categoriaAtual: string;
  competicao: string;
  categoria: string;
};

type RankingTitleFightCardProps = {
  isDarkMode: boolean;
  theme: any;
  titleFightStatus: {
    label: string;
    tone: string;
  };
  top3TitleFight: RankingItem[];
  category: string;
  handleSelectPilot: (pilot: RankingItem) => void;
  getGapToLeader: (leaderPoints: number, pilotPoints: number) => string;
  getPilotFirstAndLastName: (name?: string) => string;
  getPilotWarNameDisplay: (pilot?: RankingItem | null) => string;
};

export default function RankingTitleFightCard({
  isDarkMode,
  theme,
  titleFightStatus,
  top3TitleFight,
  category,
  handleSelectPilot,
  getGapToLeader,
  getPilotFirstAndLastName,
  getPilotWarNameDisplay,
}: RankingTitleFightCardProps) {
  return (
    <Card
      className={`overflow-hidden rounded-[22px] shadow-sm ${
        isDarkMode
          ? `border ${theme.darkAccentBorder} bg-[#111827]`
          : `border ${theme.titleBorder} bg-gradient-to-br ${theme.titleBg}`
      }`}
    >
      <CardContent className="p-0">
        <div className="relative px-4 py-4">
          <div
            className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${theme.primaryRing} to-transparent`}
          />

          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-2.5">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                  isDarkMode
                    ? `${theme.darkAccentIconWrap} border ${theme.darkAccentBorder}`
                    : theme.titleIconWrap
                }`}
              >
                <Swords
                  className={`h-5 w-5 ${
                    isDarkMode ? theme.darkAccentText : theme.titleIcon
                  }`}
                />
              </div>

              <div className="min-w-0">
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Corrida pelo campeonato
                </p>
                <h2
                  className={`text-[17px] font-extrabold tracking-tight ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  Disputa pelo título
                </h2>
              </div>
            </div>

            <div
              className={`w-fit rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${titleFightStatus.tone}`}
            >
              {titleFightStatus.label}
            </div>
          </div>

          {top3TitleFight.length === 0 ? (
            <div
              className={`rounded-[20px] px-4 py-6 text-center text-sm ${
                isDarkMode
                  ? "border border-dashed border-white/10 bg-[#0f172a] text-zinc-400"
                  : "border border-dashed border-black/10 bg-zinc-50 text-zinc-500"
              }`}
            >
              Nenhum piloto com pontos para exibir a disputa pelo título.
            </div>
          ) : (
            <div className="relative">
              <div className="pointer-events-none absolute left-[21px] top-[36px] bottom-[36px] w-[2px]">
                <div
                  className={`absolute inset-0 rounded-full ${
                    isDarkMode
                      ? `${theme.darkAccentDivider}`
                      : `bg-gradient-to-b ${theme.lineTrack}`
                  }`}
                />
                <div
                  className={`absolute left-1/2 top-0 h-full w-[10px] -translate-x-1/2 rounded-full blur-md ${
                    isDarkMode ? theme.darkAccentBg : theme.lineGlow
                  }`}
                />
              </div>

              <div className="space-y-3">
                {top3TitleFight.map((pilot, index) => {
                  const isLeader = index === 0;
                  const gapLabel = getGapToLeader(
                    top3TitleFight[0]?.pontos || 0,
                    pilot.pontos
                  );
                  const pilotName = getPilotFirstAndLastName(pilot.piloto);
                  const warName = getPilotWarNameDisplay(pilot);

                  const positionBadgeStyles =
                    index === 0
                      ? isDarkMode
                        ? theme.darkTopBadge
                        : `${theme.primaryBadge}`
                      : index === 1
                        ? isDarkMode
                          ? "bg-white/10 text-zinc-100"
                          : "bg-zinc-200 text-zinc-900"
                        : isDarkMode
                          ? "bg-amber-500/15 text-amber-300"
                          : "bg-amber-100 text-amber-800";

                  const cardPadding = isLeader ? "py-4" : "py-3";
                  const cardRadius = isLeader ? "rounded-[24px]" : "rounded-[22px]";
                  const positionSize = isLeader
                    ? "h-14 w-14 text-[18px]"
                    : "h-11 w-11 text-sm";
                  const nameSize = isLeader ? "text-[13px] sm:text-[14px]" : "text-[13px]";
                  const pointsValueSize = isLeader ? "text-[28px]" : "text-[20px]";
                  const pointsLabelSize = isLeader ? "text-[11px]" : "text-[10px]";

                  const leaderDotClass =
                    category === "Base"
                      ? "bg-orange-400"
                      : category === "Graduados"
                        ? "bg-blue-400"
                        : "bg-yellow-400";

                  return (
                    <div
                      key={`title-fight-${pilot.pilotoId}-${index}`}
                      className="relative pl-10"
                    >
                      <div className="absolute left-[12px] top-1/2 z-10 -translate-y-1/2">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                            isDarkMode ? "bg-[#111827]" : "bg-white"
                          } ${
                            isLeader
                              ? theme.darkAccentBorder
                              : index === 1
                                ? isDarkMode
                                  ? "border-zinc-500"
                                  : "border-zinc-400"
                                : "border-amber-500"
                          }`}
                        >
                          <div
                            className={`h-2.5 w-2.5 rounded-full ${
                              isLeader
                                ? isDarkMode
                                  ? leaderDotClass
                                  : "bg-yellow-400"
                                : index === 1
                                  ? "bg-zinc-400"
                                  : "bg-amber-500"
                            }`}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectPilot(pilot)}
                        className={`w-full border px-3 ${cardPadding} ${cardRadius} text-left transition hover:scale-[0.995] active:scale-[0.99] ${
                          isDarkMode
                            ? isLeader
                              ? `${theme.darkAccentBorder} ${theme.darkLeaderRow} shadow-[0_10px_22px_rgba(0,0,0,0.35)]`
                              : "border-white/10 bg-[#111827] hover:bg-[#161e2b]"
                            : isLeader
                              ? `${theme.heroBorder} ${theme.leaderGlow} bg-gradient-to-r ${theme.heroBg}`
                              : "border-black/5 bg-white hover:bg-zinc-50/80"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex shrink-0 items-center justify-center rounded-[20px] font-extrabold ${positionSize} ${positionBadgeStyles}`}
                          >
                            {index + 1}º
                          </div>

                          <div className="min-w-0 flex-1">
                            <div
                              className={`${
                                isLeader
                                  ? "flex items-center justify-between gap-3"
                                  : "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p
                                    className={`min-w-0 truncate font-extrabold leading-none tracking-tight ${
                                      isDarkMode ? "text-white" : "text-zinc-950"
                                    } ${nameSize}`}
                                  >
                                    {pilotName}
                                  </p>
                                </div>

                                {isLeader ? (
                                  warName ? (
                                    <div className="mt-1.5">
                                      <p
                                        className={`truncate text-[10px] italic ${
                                          isDarkMode ? "text-zinc-400" : "text-zinc-500"
                                        }`}
                                      >
                                        {warName}
                                      </p>
                                    </div>
                                  ) : null
                                ) : (
                                  <div className="mt-1.5 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                                    {warName ? (
                                      <p
                                        className={`truncate text-[10px] italic ${
                                          isDarkMode ? "text-zinc-400" : "text-zinc-500"
                                        }`}
                                      >
                                        {warName}
                                      </p>
                                    ) : null}

                                    <span
                                      className={`inline-flex w-fit max-w-full whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                                        isDarkMode
                                          ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                                          : "border-zinc-200 bg-white text-zinc-600"
                                      }`}
                                    >
                                      {gapLabel}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="shrink-0 self-end sm:self-center">
                                {isLeader ? (
                                  <div className="flex min-w-[88px] flex-col items-end gap-2">
                                    <span
                                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ${
                                        isDarkMode
                                          ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                                          : theme.heroChip
                                      }`}
                                    >
                                      líder
                                    </span>

                                    <div className="flex items-center gap-2">
                                      <div className="min-w-[62px] text-right">
                                        <p
                                          className={`font-bold uppercase tracking-[0.12em] ${
                                            isDarkMode ? "text-zinc-500" : "text-zinc-400"
                                          } ${pointsLabelSize}`}
                                        >
                                          Pontos
                                        </p>
                                        <p
                                          className={`font-extrabold leading-none tracking-tight ${
                                            isDarkMode ? "text-white" : "text-zinc-950"
                                          } ${pointsValueSize}`}
                                        >
                                          {pilot.pontos}
                                        </p>
                                      </div>

                                      <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-[18px] ${
                                          isDarkMode
                                            ? theme.darkAccentIconWrap
                                            : "bg-zinc-100"
                                        }`}
                                      >
                                        <ChevronRight
                                          className={`h-4 w-4 ${
                                            isDarkMode
                                              ? theme.darkAccentText
                                              : "text-zinc-500"
                                          }`}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <div className="min-w-[62px] text-right">
                                      <p
                                        className={`font-bold uppercase tracking-[0.12em] ${
                                          isDarkMode ? "text-zinc-500" : "text-zinc-400"
                                        } ${pointsLabelSize}`}
                                      >
                                        Pontos
                                      </p>
                                      <p
                                        className={`font-extrabold leading-none tracking-tight ${
                                          isDarkMode ? "text-white" : "text-zinc-950"
                                        } ${pointsValueSize}`}
                                      >
                                        {pilot.pontos}
                                      </p>
                                    </div>

                                    <div
                                      className={`flex h-8 w-8 items-center justify-center rounded-[18px] ${
                                        isDarkMode
                                          ? theme.darkAccentIconWrap
                                          : "bg-zinc-100"
                                      }`}
                                    >
                                      <ChevronRight
                                        className={`h-4 w-4 ${
                                          isDarkMode
                                            ? theme.darkAccentText
                                            : "text-zinc-500"
                                        }`}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}