"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Gauge, TrendingUp, Trophy, Users } from "lucide-react";
import type { RankingItem, RankingMetaPilot } from "@/types/ranking";

type CategoryThemeLike = {
  darkAccentBorder: string;
  darkAccentBgSoft?: string;
  darkAccentIconWrap: string;
  primaryIconWrap: string;
  darkAccentText: string;
  searchIcon: string;
  searchBorder: string;
  primaryIcon: string;
};

type StatsSummaryLike = {
  totalPilots: number;
  leaderPoints: number;
  vicePoints: number;
  leaderAdvantage: number;
  top6CutPoints: number;
  avgPoints: number;
  totalVictories: number;
  totalPodiums: number;
};

type PilotLike = RankingItem | RankingMetaPilot;

type StatsRadarLike = {
  hottestPilot: PilotLike | null;
  hottestLabel: string;
  podiumPressure: number;
  titleHeat: string;
};

type TitleFightStatusLike = {
  label: string;
  tone: string;
};

type RankingCompetitionContextProps = {
  isDarkMode: boolean;
  theme: CategoryThemeLike;
  titleFightStatus: TitleFightStatusLike;
  statsSummary: StatsSummaryLike;
  statsRadar: StatsRadarLike;
  bestEfficiencyPilot: PilotLike | null;
  getPilotFirstAndLastName: (pilotName?: string | undefined) => string;
};

function RankingCompetitionContext({
  isDarkMode,
  theme,
  titleFightStatus,
  statsSummary,
  statsRadar,
  bestEfficiencyPilot,
  getPilotFirstAndLastName,
}: RankingCompetitionContextProps) {
  return (
    <Card
      className={`overflow-hidden rounded-[22px] shadow-sm transition-all duration-200 hover:-translate-y-[1px] ${
        isDarkMode
          ? `border ${theme.darkAccentBorder} bg-[#111827]`
          : `border ${theme.searchBorder} bg-gradient-to-br from-white via-white to-zinc-50/70`
      }`}
    >
      <CardContent className="p-2.5">
        <div className="mb-2.5 flex items-center gap-2">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] ${
              isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
            }`}
          >
            <Gauge
              className={`h-4.5 w-4.5 ${
                isDarkMode ? theme.darkAccentText : theme.searchIcon
              }`}
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-zinc-400">
              Contexto competitivo
            </p>
            <p
              className={`mt-0.5 text-[11px] font-semibold leading-tight ${
                isDarkMode ? "text-white" : "text-zinc-900"
              }`}
            >
              Leitura rápida oficial do campeonato selecionado
            </p>
          </div>

          <div
            className={`shrink-0 rounded-full border px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] ${
              isDarkMode
                ? titleFightStatus.label === "BRIGA ACIRRADA"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : titleFightStatus.label === "DISPUTA CONTROLADA"
                    ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                    : "border-white/10 bg-white/5 text-zinc-300"
                : titleFightStatus.tone
            }`}
          >
            {titleFightStatus.label}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div
            className={`rounded-[16px] border px-2.5 py-2.5 ${
              isDarkMode
                ? `${theme.darkAccentBorder} bg-[#0f172a]`
                : "border-black/5 bg-white/80"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Título
                </p>
                <p
                  className={`mt-1 text-[15px] font-extrabold leading-tight ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  {statsRadar.titleHeat}
                </p>
              </div>

              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl ${
                  isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                }`}
              >
                <Crown
                  className={`h-4 w-4 ${
                    isDarkMode ? theme.darkAccentText : theme.primaryIcon
                  }`}
                />
              </div>
            </div>

            <p
              className={`mt-1.5 text-[10px] leading-snug ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              {statsSummary.totalPilots > 1
                ? `${statsSummary.leaderAdvantage} pts entre líder e vice nesta leitura oficial.`
                : "Ainda não há confronto consolidado pela liderança."}
            </p>
          </div>

          <div
            className={`rounded-[16px] border px-2.5 py-2.5 ${
              isDarkMode
                ? `${theme.darkAccentBorder} bg-[#0f172a]`
                : "border-black/5 bg-white/80"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Corte Top 6
                </p>
                <p
                  className={`mt-1 text-[15px] font-extrabold leading-tight ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  {statsSummary.top6CutPoints} pts
                </p>
              </div>

              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl ${
                  isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                }`}
              >
                <Trophy
                  className={`h-4 w-4 ${
                    isDarkMode ? theme.darkAccentText : theme.primaryIcon
                  }`}
                />
              </div>
            </div>

            <p
              className={`mt-1.5 text-[10px] leading-snug ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              {statsSummary.totalPilots >= 6
                ? `${statsRadar.podiumPressure} pts separam o 3º do 6º colocado.`
                : "Leitura adaptada ao número atual de pilotos pontuando."}
            </p>
          </div>

          <div
            className={`rounded-[16px] border px-2.5 py-2.5 ${
              isDarkMode
                ? `${theme.darkAccentBorder} bg-[#0f172a]`
                : "border-black/5 bg-white/80"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Momento do grid
                </p>
                <p
                  className={`mt-1 text-[15px] font-extrabold leading-tight ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  {statsRadar.hottestLabel}
                </p>
              </div>

              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl ${
                  isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                }`}
              >
                <TrendingUp
                  className={`h-4 w-4 ${
                    isDarkMode ? theme.darkAccentText : theme.primaryIcon
                  }`}
                />
              </div>
            </div>

            <p
              className={`mt-1.5 text-[10px] leading-snug ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              {statsRadar.hottestPilot
                ? `${getPilotFirstAndLastName(statsRadar.hottestPilot.piloto)} lidera o impacto competitivo atual.`
                : "Sem piloto destacado nesta seleção."}
            </p>
          </div>

          <div
            className={`rounded-[16px] border px-2.5 py-2.5 ${
              isDarkMode
                ? `${theme.darkAccentBorder} bg-[#0f172a]`
                : "border-black/5 bg-white/80"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Eficiência premium
                </p>
                <p
                  className={`mt-1 text-[15px] font-extrabold leading-tight ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  {bestEfficiencyPilot
                    ? getPilotFirstAndLastName(bestEfficiencyPilot.piloto)
                    : "Sem leitura"}
                </p>
              </div>

              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl ${
                  isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                }`}
              >
                <Users
                  className={`h-4 w-4 ${
                    isDarkMode ? theme.darkAccentText : theme.primaryIcon
                  }`}
                />
              </div>
            </div>

            <p
              className={`mt-1.5 text-[10px] leading-snug ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              {bestEfficiencyPilot && "pontos" in bestEfficiencyPilot && "participacoes" in bestEfficiencyPilot
                ? `${(
                    bestEfficiencyPilot.pontos /
                    Math.max(bestEfficiencyPilot.participacoes, 1)
                  ).toFixed(1)} pts por participação.`
                : "Nenhuma participação registrada para calcular eficiência."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default React.memo(RankingCompetitionContext);
