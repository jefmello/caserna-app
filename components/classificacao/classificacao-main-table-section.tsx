"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TableProperties } from "lucide-react";
import {
  competitionLabels,
  getPilotFirstAndLastName,
  getPilotWarNameDisplay,
  getTop6RowStyles,
  getTrendVisual,
  normalizePilotName,
} from "@/lib/ranking/ranking-utils";
import type { RankingItem } from "@/types/ranking";

type ClassificacaoMainTableSectionProps = {
  isDarkMode: boolean;
  theme: any;
  category: string;
  competition: string;
  filteredRanking: RankingItem[];
  leader: RankingItem | null;
  titleFightStatus: {
    label: string;
    tone: string;
  };
  pilotTrendMap: Record<string, string>;
  onSelectPilot: (pilot: RankingItem) => void;
};

export default function ClassificacaoMainTableSection({
  isDarkMode,
  theme,
  category,
  competition,
  filteredRanking,
  leader,
  titleFightStatus,
  pilotTrendMap,
  onSelectPilot,
}: ClassificacaoMainTableSectionProps) {
  return (
    <section className="space-y-3">
      <div
        className={`overflow-hidden rounded-[22px] shadow-sm transition-all duration-200 hover:-translate-y-px ${
          isDarkMode
            ? `border ${theme.darkAccentBorder} bg-[linear-gradient(180deg,#0b0f16_0%,#0f172a_100%)]`
            : `border ${theme.titleBorder} bg-gradient-to-br ${theme.titleBg}`
        }`}
      >
        <div className="relative px-4 py-4">
          <div
            className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${theme.primaryRing} to-transparent`}
          />

          <div className="flex items-center justify-between gap-2.5">
            <div className="flex flex-1 justify-center pr-1">
              <div className="flex flex-col items-center">
                <div
                  className={`inline-flex max-w-full items-center justify-center rounded-[18px] border px-4 py-2 shadow-[0_4px_10px_rgba(0,0,0,0.08)] ${
                    isDarkMode
                      ? `${theme.darkAccentBorder} bg-[#111827]`
                      : theme.titlePill
                  }`}
                >
                  <h2
                    className={`truncate text-[17px] font-extrabold uppercase leading-none tracking-[0.08em] ${
                      isDarkMode ? "text-white" : theme.titlePillText
                    }`}
                  >
                    Classificação Geral
                  </h2>
                </div>

                <p
                  className={`mt-2.5 w-[245px] max-w-full text-center text-[9px] font-semibold uppercase tracking-[0.12em] ${
                    isDarkMode ? "text-zinc-500" : theme.titleSub
                  }`}
                >
                  categoria e campeonato selecionados
                </p>
              </div>
            </div>

            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-[0_4px_10px_rgba(0,0,0,0.08)] ${
                isDarkMode
                  ? `${theme.darkAccentBorder} ${theme.darkAccentIconWrap}`
                  : theme.titleIconWrap
              }`}
            >
              <TableProperties
                className={`h-5 w-5 ${
                  isDarkMode ? theme.darkAccentText : theme.titleIcon
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      <Card
        className={`overflow-hidden rounded-[22px] shadow-sm transition-all duration-200 hover:-translate-y-px ${
          isDarkMode
            ? "border border-white/10 bg-[#0f172a]"
            : "border-black/5 bg-white"
        }`}
      >
        <CardContent className="p-0">
          <div
            className={`px-3 py-3 ${
              isDarkMode
                ? "border-b border-white/10 bg-[linear-gradient(180deg,#0b0f16_0%,#111827_100%)]"
                : "border-b border-black/5 bg-gradient-to-r from-white via-zinc-50/70 to-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
                    isDarkMode ? theme.darkAccentIconWrap : theme.titleIconWrap
                  }`}
                >
                  <TableProperties
                    className={`h-[18px] w-[18px] ${
                      isDarkMode ? theme.darkAccentText : theme.titleIcon
                    }`}
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className={`text-[8px] font-bold uppercase tracking-[0.18em] ${
                      isDarkMode ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    Painel oficial
                  </p>
                  <p
                    className={`text-[14px] font-extrabold tracking-[0.01em] ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    Grade de classificação
                  </p>
                  <p
                    className={`mt-0.5 text-[11px] font-medium ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    {category} · {competitionLabels[competition] || competition}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <div
                  className={`rounded-full border px-3 py-1 text-[11px] font-bold ${
                    isDarkMode
                      ? `${theme.darkAccentBorder} bg-[#111827] ${theme.darkAccentText}`
                      : "border-black/5 bg-zinc-50 text-zinc-700"
                  }`}
                >
                  {filteredRanking.length} piloto
                  {filteredRanking.length === 1 ? "" : "s"}
                </div>

                <div
                  className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${titleFightStatus.tone}`}
                >
                  {titleFightStatus.label}
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div
                className={`rounded-[16px] border px-3 py-2 ${
                  isDarkMode
                    ? "border-white/10 bg-[#111827]"
                    : "border-black/5 bg-white"
                }`}
              >
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.16em] ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Líder
                </p>
                <p
                  className={`mt-1 truncate text-[12px] font-extrabold ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  {leader ? getPilotFirstAndLastName(leader.piloto) : "-"}
                </p>
                <p
                  className={`mt-0.5 text-[11px] font-semibold ${
                    isDarkMode ? theme.darkAccentText : "text-zinc-700"
                  }`}
                >
                  {leader?.pontos || 0} pts
                </p>
              </div>

              <div
                className={`rounded-[16px] border px-3 py-2 ${
                  isDarkMode
                    ? "border-white/10 bg-[#111827]"
                    : "border-black/5 bg-white"
                }`}
              >
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.16em] ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Zona troféu
                </p>
                <p
                  className={`mt-1 text-[12px] font-extrabold ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  Top 6 oficial
                </p>
                <p
                  className={`mt-0.5 text-[11px] font-medium ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  corte: {filteredRanking[5]?.pontos ?? 0} pts
                </p>
              </div>

              <div
                className={`rounded-[16px] border px-3 py-2 ${
                  isDarkMode
                    ? "border-white/10 bg-[#111827]"
                    : "border-black/5 bg-white"
                }`}
              >
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.16em] ${
                    isDarkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  Pressão no topo
                </p>
                <p
                  className={`mt-1 text-[12px] font-extrabold ${
                    isDarkMode ? "text-white" : "text-zinc-950"
                  }`}
                >
                  {filteredRanking[1]
                    ? `${Math.max(
                        (leader?.pontos || 0) - filteredRanking[1].pontos,
                        0
                      )} pts`
                    : "0 pts"}
                </p>
                <p
                  className={`mt-0.5 text-[11px] font-medium ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  vantagem do líder
                </p>
              </div>
            </div>
          </div>

          <div className="max-h-[560px] overflow-y-auto">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-[42px]" />
                <col />
                <col className="w-[31px]" />
                <col className="w-[31px]" />
                <col className="w-[31px]" />
                <col className="w-9" />
                <col className="w-9" />
              </colgroup>

              <thead className="sticky top-0 z-10">
                <tr
                  className={`text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur ${
                    isDarkMode
                      ? `border-b border-white/10 bg-[#111827] ${theme.darkAccentText}`
                      : `border-b border-black/5 ${theme.tableHeadBg} text-zinc-500`
                  }`}
                >
                  <th className="whitespace-nowrap px-1 py-2.5 text-center">
                    Pos
                  </th>
                  <th className="whitespace-nowrap px-2 py-2.5 text-left">
                    Piloto
                  </th>
                  <th className="whitespace-nowrap px-0.5 py-2.5 text-center">
                    Pts
                  </th>
                  <th className="whitespace-nowrap px-0.5 py-2.5 text-center">
                    Vit
                  </th>
                  <th className="whitespace-nowrap px-0.5 py-2.5 text-center">
                    Pol
                  </th>
                  <th className="whitespace-nowrap px-0.5 py-2.5 text-center">
                    VMR
                  </th>
                  <th className="whitespace-nowrap px-0.5 py-2.5 text-center">
                    PDS
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRanking.map((item, index) => {
                  const nomeLinha1 = getPilotFirstAndLastName(item.piloto);
                  const nomeLinha2 = getPilotWarNameDisplay(item);
                  const isTop6 = index < 6;
                  const styles = getTop6RowStyles(index + 1);
                  const trendStatus =
                    pilotTrendMap[item.pilotoId || normalizePilotName(item.piloto)] ||
                    "stable";
                  const trendVisual = getTrendVisual(trendStatus as never, isDarkMode);
                  const TrendIcon = trendVisual.Icon;

                  const darkRow = isTop6
                    ? index === 0
                      ? "bg-[linear-gradient(90deg,rgba(250,204,21,0.14)_0%,#111827_18%,#0f172a_100%)] border-l-[4px] border-l-yellow-400 shadow-[0_0_0_1px_rgba(250,204,21,0.14),0_12px_28px_rgba(0,0,0,0.28)]"
                      : index === 1
                        ? "bg-[linear-gradient(90deg,rgba(212,212,216,0.10)_0%,#111827_18%,#0f172a_100%)] border-l-[4px] border-l-zinc-300 shadow-[0_0_0_1px_rgba(212,212,216,0.10),0_10px_24px_rgba(0,0,0,0.24)]"
                        : index === 2
                          ? "bg-[linear-gradient(90deg,rgba(251,191,36,0.10)_0%,#111827_18%,#0f172a_100%)] border-l-[4px] border-l-amber-400 shadow-[0_0_0_1px_rgba(251,191,36,0.10),0_10px_24px_rgba(0,0,0,0.24)]"
                          : index === 3
                            ? "bg-[linear-gradient(90deg,rgba(56,189,248,0.08)_0%,#111827_18%,#0f172a_100%)] border-l-[4px] border-l-sky-400 shadow-[0_0_0_1px_rgba(56,189,248,0.08),0_10px_22px_rgba(0,0,0,0.22)]"
                            : index === 4
                              ? "bg-[linear-gradient(90deg,rgba(168,85,247,0.08)_0%,#111827_18%,#0f172a_100%)] border-l-[4px] border-l-violet-400 shadow-[0_0_0_1px_rgba(168,85,247,0.08),0_10px_22px_rgba(0,0,0,0.22)]"
                              : "bg-[linear-gradient(90deg,rgba(52,211,153,0.08)_0%,#111827_18%,#0f172a_100%)] border-l-[4px] border-l-emerald-400 shadow-[0_0_0_1px_rgba(52,211,153,0.08),0_10px_22px_rgba(0,0,0,0.22)]"
                    : `${
                        index % 2 === 0 ? "bg-[#0f172a]" : "bg-[#0b0f16]"
                      } hover:bg-[#161e2b] hover:brightness-[1.03] hover:scale-[1.002]`;

                  return (
                    <tr
                      key={`${category}-${competition}-table-${item.pos}-${item.piloto}`}
                      onClick={() => onSelectPilot(item)}
                      className={`group cursor-pointer transition-all duration-200 ${
                        isDarkMode
                          ? darkRow
                          : `${styles.row || "bg-white"} hover:bg-zinc-50`
                      }`}
                      title="Abrir piloto"
                    >
                      <td className="px-1 py-2.5 text-center align-middle">
                        <div
                          className={`mx-auto flex h-8 w-8 items-center justify-center rounded-[14px] text-[11px] font-extrabold ${
                            isDarkMode
                              ? index === 0
                                ? "bg-white/10 text-white"
                                : "bg-white/5 text-zinc-200"
                              : styles.badge
                          }`}
                        >
                          {index + 1}
                        </div>
                      </td>

                      <td className="px-2 py-2.5 align-middle">
                        <div className="min-w-0">
                          <p
                            className={`truncate text-[12px] font-extrabold leading-tight ${
                              isDarkMode ? "text-white" : "text-zinc-950"
                            }`}
                          >
                            {nomeLinha1}
                          </p>
                          <div className="mt-1 flex items-center gap-1.5">
                            {nomeLinha2 ? (
                              <p
                                className={`truncate text-[10px] italic ${
                                  isDarkMode ? "text-zinc-400" : "text-zinc-500"
                                }`}
                              >
                                {nomeLinha2}
                              </p>
                            ) : null}

                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                                isDarkMode
                                  ? "bg-white/5 text-zinc-300"
                                  : "bg-zinc-100 text-zinc-600"
                              }`}
                            >
                              <TrendIcon className="h-3 w-3" />
                              {trendVisual.label}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td
                        className={`px-0.5 py-2.5 text-center text-[11px] font-extrabold ${
                          isDarkMode ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        {item.pontos}
                      </td>
                      <td
                        className={`px-0.5 py-2.5 text-center text-[11px] font-bold ${
                          isDarkMode ? "text-zinc-200" : "text-zinc-700"
                        }`}
                      >
                        {item.vitorias}
                      </td>
                      <td
                        className={`px-0.5 py-2.5 text-center text-[11px] font-bold ${
                          isDarkMode ? "text-zinc-200" : "text-zinc-700"
                        }`}
                      >
                        {item.poles}
                      </td>
                      <td
                        className={`px-0.5 py-2.5 text-center text-[11px] font-bold ${
                          isDarkMode ? "text-zinc-200" : "text-zinc-700"
                        }`}
                      >
                        {item.mv}
                      </td>
                      <td
                        className={`px-0.5 py-2.5 text-center text-[11px] font-bold ${
                          isDarkMode ? "text-zinc-200" : "text-zinc-700"
                        }`}
                      >
                        {item.podios}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}