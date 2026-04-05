"use client";

import React, { useMemo } from "react";
import { BarChart3, Crown, Flag, Gauge, Swords, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  getCategoryTheme,
  getComparisonWinner,
  getDuelWinnerLabel,
  getDuelNarrative,
  getDuelProfileLabel,
  getPilotFirstAndLastName,
  getPilotNameParts,
  getPilotWarNameDisplay,
} from "@/lib/ranking/ranking-utils";
import type { RankingItem } from "@/types/ranking";

type DuelMetric = {
  label: string;
  shortLabel: string;
  a: number;
  b: number;
  lowerIsBetter: boolean;
  description: string;
};

type DuelSummary = {
  scoreA: number;
  scoreB: number;
  pointsWinner: "a" | "b" | "tie";
  advWinner: "a" | "b" | "tie";
  overallWinner: "a" | "b" | "tie";
  scoreDiff: number;
  pointsDiff: number;
  narrative: string;
  profileLabel: string;
};

type DuelIntensity = {
  label: string;
  tone: string;
  description: string;
};

export default function RankingPilotDuelCard({
  pilotA,
  pilotB,
  isDarkMode = false,
  category = "Elite",
}: {
  pilotA?: RankingItem | null;
  pilotB?: RankingItem | null;
  isDarkMode?: boolean;
  category?: string;
}) {
  const theme = getCategoryTheme(category);

  const duelMetrics = useMemo<DuelMetric[]>(() => {
    if (!pilotA || !pilotB) return [];

    return [
      {
        label: "Pontos",
        shortLabel: "PTS",
        a: pilotA.pontos,
        b: pilotB.pontos,
        lowerIsBetter: false,
        description: "força no campeonato atual",
      },
      {
        label: "Vitórias",
        shortLabel: "VIT",
        a: pilotA.vitorias,
        b: pilotB.vitorias,
        lowerIsBetter: false,
        description: "capacidade de decidir corridas",
      },
      {
        label: "Poles",
        shortLabel: "POL",
        a: pilotA.poles,
        b: pilotB.poles,
        lowerIsBetter: false,
        description: "arrancada de classificação",
      },
      {
        label: "VMR",
        shortLabel: "VMR",
        a: pilotA.mv,
        b: pilotB.mv,
        lowerIsBetter: false,
        description: "ritmo de volta rápida",
      },
      {
        label: "Pódios",
        shortLabel: "PDS",
        a: pilotA.podios,
        b: pilotB.podios,
        lowerIsBetter: false,
        description: "presença no top 6",
      },
      {
        label: "Participações",
        shortLabel: "PART",
        a: pilotA.participacoes,
        b: pilotB.participacoes,
        lowerIsBetter: false,
        description: "volume competitivo",
      },
      {
        label: "ADV",
        shortLabel: "ADV",
        a: pilotA.adv,
        b: pilotB.adv,
        lowerIsBetter: true,
        description: "disciplina na pista",
      },
    ];
  }, [pilotA, pilotB]);

  const duelSummary = useMemo<DuelSummary | null>(() => {
    if (!pilotA || !pilotB || duelMetrics.length === 0) return null;

    let scoreA = 0;
    let scoreB = 0;

    duelMetrics.forEach((metric) => {
      const winner = getComparisonWinner(metric.a, metric.b, metric.lowerIsBetter);
      if (winner === "a") scoreA += 1;
      if (winner === "b") scoreB += 1;
    });

    const pointsWinner = getComparisonWinner(pilotA.pontos, pilotB.pontos, false);
    const advWinner = getComparisonWinner(pilotA.adv, pilotB.adv, true);
    const overallWinner = scoreA === scoreB ? pointsWinner : scoreA > scoreB ? "a" : "b";
    const scoreDiff = Math.abs(scoreA - scoreB);
    const pointsDiff = Math.abs(pilotA.pontos - pilotB.pontos);

    return {
      scoreA,
      scoreB,
      pointsWinner,
      advWinner,
      overallWinner,
      scoreDiff,
      pointsDiff,
      narrative: getDuelNarrative({ scoreA, scoreB, pointsDiff }),
      profileLabel: getDuelProfileLabel({ scoreA, scoreB, pointsWinner, advWinner }),
    };
  }, [pilotA, pilotB, duelMetrics]);

  const duelIntensity = useMemo<DuelIntensity>(() => {
    if (!duelSummary) {
      return {
        label: "SEM LEITURA",
        tone: isDarkMode
          ? "border-white/10 bg-white/5 text-zinc-300"
          : "border-zinc-200 bg-zinc-50 text-zinc-600",
        description: "Aguardando confronto válido.",
      };
    }

    if (duelSummary.overallWinner === "tie") {
      if (duelSummary.pointsDiff <= 3) {
        return {
          label: "EMPATE TÉCNICO",
          tone: isDarkMode
            ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
            : "border-yellow-200 bg-yellow-50 text-yellow-700",
          description: "Nenhum piloto conseguiu abrir vantagem clara.",
        };
      }

      return {
        label: "PRESSÃO NOS DETALHES",
        tone: isDarkMode
          ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
          : "border-blue-200 bg-blue-50 text-blue-700",
          description: "O duelo está equilibrado, mas com leve inclinação pontual.",
        };
    }

    if (duelSummary.scoreDiff >= 4) {
      return {
        label: "SUPERIORIDADE CLARA",
        tone: isDarkMode
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-emerald-200 bg-emerald-50 text-emerald-700",
        description: "Um dos lados domina a maior parte dos territórios do confronto.",
      };
    }

    if (duelSummary.scoreDiff >= 2) {
      return {
        label: "VANTAGEM CONSISTENTE",
        tone: isDarkMode
          ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
          : "border-blue-200 bg-blue-50 text-blue-700",
        description: "Há superioridade real, mas ainda existe espaço para reação.",
      };
    }

    return {
      label: "DUELO APERTADO",
      tone: isDarkMode
        ? "border-orange-500/30 bg-orange-500/10 text-orange-300"
        : "border-orange-200 bg-orange-50 text-orange-700",
      description: "A disputa segue aberta e sensível a qualquer mudança de ritmo.",
    };
  }, [duelSummary, isDarkMode]);

  const duelWinnerPilot = useMemo(() => {
    if (!duelSummary || !pilotA || !pilotB) return null;
    if (duelSummary.overallWinner === "a") return pilotA;
    if (duelSummary.overallWinner === "b") return pilotB;
    return null;
  }, [duelSummary, pilotA, pilotB]);

  if (!pilotA || !pilotB || !duelSummary) {
    return null;
  }

  return (
    <div className="w-full space-y-4 overflow-x-hidden">
      <div
        className={`w-full overflow-hidden rounded-[24px] border ${
          isDarkMode
            ? `${theme.darkAccentBorder} bg-gradient-to-br ${theme.darkAccentCard}`
            : `${theme.primaryBorder} bg-gradient-to-br ${theme.heroBg}`
        }`}
      >
        <div className="relative px-3 py-3 sm:px-4 sm:py-4">
          <div
            className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${theme.primaryRing} to-transparent`}
          />

          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p
                className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Arena do duelo
              </p>
              <h3
                className={`max-w-[220px] text-[18px] font-extrabold tracking-tight ${
                  isDarkMode ? "text-white" : "text-zinc-950"
                }`}
              >
                Confronto direto premium
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div
                className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] ${duelIntensity.tone}`}
              >
                {duelIntensity.label}
              </div>
              <div
                className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] ${
                  isDarkMode
                    ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                    : theme.heroChip
                }`}
              >
                F1 mode
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[pilotA, pilotB].map((pilot, index) => {
              const side = index === 0 ? "a" : "b";
              const isWinner = duelSummary.overallWinner === side;
              const pilotScore = side === "a" ? duelSummary.scoreA : duelSummary.scoreB;
              const performanceWins = duelMetrics.filter(
                (metric) => getComparisonWinner(metric.a, metric.b, metric.lowerIsBetter) === side
              ).length;
              const sideLabel =
                getPilotWarNameDisplay(pilot) || getPilotNameParts(pilot.piloto).firstName;

              return (
                <div
                  key={`${side}-${pilot.pilotoId || pilot.piloto}`}
                  className={`relative min-w-0 rounded-[24px] border p-3 sm:p-4 ${
                    isDarkMode
                      ? isWinner
                        ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft} shadow-[0_14px_32px_rgba(0,0,0,0.34)]`
                        : "border-white/10 bg-[#0f172a]"
                      : isWinner
                        ? `${theme.heroBorder} bg-white/95 shadow-[0_16px_34px_rgba(15,23,42,0.08)]`
                        : "border-black/5 bg-white/88 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                  }`}
                >
                  {isWinner ? (
                    <div className="mb-3 flex items-center gap-1.5">
                      <div
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] ${
                          isDarkMode
                            ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                            : "border-yellow-200 bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        <Crown className="h-3 w-3" />
                        Vencedor do duelo
                      </div>
                    </div>
                  ) : null}

                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p
                        className={`truncate text-[10px] font-bold uppercase tracking-[0.16em] ${
                          isDarkMode ? "text-zinc-500" : "text-zinc-400"
                        }`}
                      >
                        {sideLabel}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                            isDarkMode
                              ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                              : theme.heroChip
                          }`}
                        >
                          Score {pilotScore}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p
                        className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                          isDarkMode ? "text-zinc-500" : "text-zinc-400"
                        }`}
                      >
                        Pontos
                      </p>
                      <p
                        className={`mt-1 text-[28px] font-black leading-none tracking-tight ${
                          isDarkMode ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        {pilot.pontos}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`text-[17px] font-black leading-[1.02] tracking-tight ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    {getPilotFirstAndLastName(pilot.piloto)}
                  </p>

                  {getPilotWarNameDisplay(pilot) ? (
                    <p
                      className={`mt-1 text-[11px] italic ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      {getPilotWarNameDisplay(pilot)}
                    </p>
                  ) : null}

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div
                      className={`rounded-[18px] border px-3 py-2 ${
                        isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-zinc-50/70"
                      }`}
                    >
                      <p
                        className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                          isDarkMode ? "text-zinc-500" : "text-zinc-400"
                        }`}
                      >
                        Métricas vencidas
                      </p>
                      <p
                        className={`mt-1 text-[19px] font-black leading-none ${
                          isDarkMode ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        {performanceWins}
                      </p>
                    </div>

                    <div
                      className={`rounded-[18px] border px-3 py-2 ${
                        isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-zinc-50/70"
                      }`}
                    >
                      <p
                        className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                          isDarkMode ? "text-zinc-500" : "text-zinc-400"
                        }`}
                      >
                        ADV
                      </p>
                      <p
                        className={`mt-1 text-[19px] font-black leading-none ${
                          isDarkMode ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        {pilot.adv}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      { label: "VIT", value: pilot.vitorias, icon: Trophy },
                      { label: "VMR", value: pilot.mv, icon: Gauge },
                      { label: "POL", value: pilot.poles, icon: Flag },
                    ].map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div
                          key={`${pilot.pilotoId || pilot.piloto}-${stat.label}`}
                          className={`min-w-0 rounded-[18px] border px-2.5 py-2 ${
                            isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-zinc-50/70"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <Icon
                              className={`h-3.5 w-3.5 shrink-0 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`}
                            />
                            <p
                              className={`truncate text-[9px] font-bold uppercase tracking-[0.14em] ${
                                isDarkMode ? "text-zinc-500" : "text-zinc-400"
                              }`}
                            >
                              {stat.label}
                            </p>
                          </div>
                          <p
                            className={`mt-1 text-[16px] font-black leading-none ${
                              isDarkMode ? "text-white" : "text-zinc-950"
                            }`}
                          >
                            {stat.value}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="flex flex-col items-center justify-center gap-2 px-1 py-1">
              <div
                className={`w-full max-w-[220px] rounded-[28px] border px-4 py-3 text-center ${
                  isDarkMode
                    ? `${theme.darkAccentBorder} bg-[#0f172a] shadow-[0_10px_28px_rgba(0,0,0,0.26)]`
                    : `${theme.primaryBorder} bg-white shadow-[0_14px_28px_rgba(15,23,42,0.06)]`
                }`}
              >
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.18em] ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Placar oficial
                </p>
                <p
                  className={`mt-1 text-[34px] font-black leading-none tracking-tight ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  {duelSummary.scoreA}
                  <span className={isDarkMode ? "text-zinc-500" : "text-zinc-400"}> x </span>
                  {duelSummary.scoreB}
                </p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full border ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                        : `${theme.primaryBorder} bg-zinc-50 text-zinc-950`
                    }`}
                  >
                    <Swords className="h-4.5 w-4.5" />
                  </div>
                </div>
                <p
                  className={`mt-2 text-[11px] font-semibold leading-snug ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  {duelSummary.narrative}
                </p>
              </div>

              <div
                className={`w-full max-w-[220px] rounded-[22px] border px-3 py-2 text-center ${
                  isDarkMode ? `${theme.darkAccentBorder} ${theme.darkAccentBg}` : theme.searchBadge
                }`}
              >
                <p
                  className={`text-[9px] font-black uppercase tracking-[0.16em] ${
                    isDarkMode ? theme.darkAccentText : "inherit"
                  }`}
                >
                  {duelSummary.profileLabel}
                </p>
              </div>

              <div
                className={`w-full max-w-[220px] rounded-[22px] border px-3 py-3 text-center ${
                  isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white/90"
                }`}
              >
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.16em] ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Vencedor do duelo
                </p>
                <p
                  className={`mt-1 text-[15px] font-black leading-tight ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  {duelWinnerPilot ? getPilotFirstAndLastName(duelWinnerPilot.piloto) : "Empate técnico"}
                </p>
                <p
                  className={`mt-1 text-[11px] leading-snug ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  {duelIntensity.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card
          className={`rounded-[24px] shadow-sm ${
            isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
          }`}
        >
          <CardContent className="p-4">
            <div className="mb-4 flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                  isDarkMode ? theme.darkAccentIconWrap : theme.statsIconWrap
                }`}
              >
                <BarChart3 className={`h-4.5 w-4.5 ${isDarkMode ? theme.darkAccentText : theme.statsIcon}`} />
              </div>
              <div className="min-w-0">
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Métrica por métrica
                </p>
                <h3
                  className={`text-[16px] font-extrabold tracking-tight ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  Leitura visual do confronto
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {duelMetrics.map((metric) => {
                const winner = getComparisonWinner(metric.a, metric.b, metric.lowerIsBetter);
                const maxValue = Math.max(metric.a, metric.b, 1);
                const widthA = `${(metric.a / maxValue) * 100}%`;
                const widthB = `${(metric.b / maxValue) * 100}%`;

                return (
                  <div
                    key={metric.label}
                    className={`rounded-[22px] border p-3 ${
                      isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50/70"
                    }`}
                  >
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p
                          className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                            isDarkMode ? "text-zinc-500" : "text-zinc-400"
                          }`}
                        >
                          {metric.shortLabel}
                        </p>
                        <h4
                          className={`text-[14px] font-extrabold tracking-tight ${
                            isDarkMode ? "text-white" : "text-zinc-950"
                          }`}
                        >
                          {metric.label}
                        </h4>
                      </div>

                      <div
                        className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${
                          isDarkMode
                            ? winner === "tie"
                              ? "border-white/10 bg-white/5 text-zinc-300"
                              : `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                            : winner === "tie"
                              ? "border-zinc-200 bg-zinc-100 text-zinc-700"
                              : theme.primaryBadge
                        }`}
                      >
                        {winner === "tie" ? "Empate" : getDuelWinnerLabel(winner)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="mb-1 flex items-center justify-between gap-2 text-[12px] font-semibold">
                          <span className={isDarkMode ? "text-zinc-300" : "text-zinc-700"}>
                            {getPilotNameParts(pilotA.piloto).firstName}
                          </span>
                          <span className={isDarkMode ? "text-white" : "text-zinc-950"}>{metric.a}</span>
                        </div>
                        <div className={`h-2.5 overflow-hidden rounded-full ${isDarkMode ? "bg-white/10" : "bg-zinc-200"}`}>
                          <div
                            className={`h-full rounded-full ${
                              winner === "a"
                                ? isDarkMode
                                  ? "bg-emerald-400"
                                  : "bg-emerald-500"
                                : isDarkMode
                                  ? "bg-zinc-500"
                                  : "bg-zinc-400"
                            }`}
                            style={{ width: widthA }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="mb-1 flex items-center justify-between gap-2 text-[12px] font-semibold">
                          <span className={isDarkMode ? "text-zinc-300" : "text-zinc-700"}>
                            {getPilotNameParts(pilotB.piloto).firstName}
                          </span>
                          <span className={isDarkMode ? "text-white" : "text-zinc-950"}>{metric.b}</span>
                        </div>
                        <div className={`h-2.5 overflow-hidden rounded-full ${isDarkMode ? "bg-white/10" : "bg-zinc-200"}`}>
                          <div
                            className={`h-full rounded-full ${
                              winner === "b"
                                ? isDarkMode
                                  ? "bg-emerald-400"
                                  : "bg-emerald-500"
                                : isDarkMode
                                  ? "bg-zinc-500"
                                  : "bg-zinc-400"
                            }`}
                            style={{ width: widthB }}
                          />
                        </div>
                      </div>
                    </div>

                    <p
                      className={`mt-3 text-[11px] leading-snug ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      {metric.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card
          className={`rounded-[24px] shadow-sm ${
            isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
          }`}
        >
          <CardContent className="p-4">
            <div className="mb-4 flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                  isDarkMode ? theme.darkAccentIconWrap : theme.statsIconWrap
                }`}
              >
                <Trophy className={`h-4.5 w-4.5 ${isDarkMode ? theme.darkAccentText : theme.statsIcon}`} />
              </div>
              <div className="min-w-0">
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Síntese executiva
                </p>
                <h3
                  className={`text-[16px] font-extrabold tracking-tight ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  Diagnóstico do duelo
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div
                className={`rounded-[20px] border p-3 ${
                  isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50/70"
                }`}
              >
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Pontuação
                </p>
                <p
                  className={`mt-1 text-[14px] font-extrabold leading-tight ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  {duelSummary.pointsWinner === "tie"
                    ? "Empate em pontos"
                    : duelSummary.pointsWinner === "a"
                      ? `${getPilotNameParts(pilotA.piloto).firstName} na frente`
                      : `${getPilotNameParts(pilotB.piloto).firstName} na frente`}
                </p>
                <p
                  className={`mt-1 text-[11px] leading-relaxed ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  leitura com base em pontos totais e volume geral de resultado.
                </p>
              </div>

              <div
                className={`rounded-[20px] border p-3 ${
                  isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50/70"
                }`}
              >
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Disciplina
                </p>
                <p
                  className={`mt-1 text-[14px] font-extrabold leading-tight ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  {duelSummary.advWinner === "tie"
                    ? "Empate disciplinar"
                    : duelSummary.advWinner === "a"
                      ? `${getPilotNameParts(pilotA.piloto).firstName} mais limpo`
                      : `${getPilotNameParts(pilotB.piloto).firstName} mais limpo`}
                </p>
                <p
                  className={`mt-1 text-[11px] leading-relaxed ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  leitura com base em advertências dentro do campeonato selecionado.
                </p>
              </div>

              <div
                className={`rounded-[20px] border p-3 ${
                  isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50/70"
                }`}
              >
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Leitura final
                </p>
                <p
                  className={`mt-1 text-[14px] font-extrabold leading-tight ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  {duelSummary.profileLabel}
                </p>
                <p
                  className={`mt-1 text-[11px] leading-relaxed ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  síntese automática do pacote competitivo entre os dois pilotos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
