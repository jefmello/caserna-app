"use client";

import React from "react";
import { Star, TableProperties } from "lucide-react";
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

type ThemeType = {
  darkAccentBorder: string;
  darkAccentBg: string;
  darkAccentBgSoft: string;
  darkAccentText: string;
  darkAccentIconWrap: string;
  darkLeaderRow: string;
  darkSecondRow: string;
  darkThirdRow: string;
  darkTopBadge: string;
  titleBorder: string;
  titleBg: string;
  primaryRing: string;
  titlePill: string;
  titlePillText: string;
  titleSub: string;
  titleIconWrap: string;
  titleIcon: string;
  tableHeadBg: string;
};

type TrendVisual = {
  Icon: React.ElementType;
  label: string;
  className: string;
};

type Top6Styles = {
  row: string;
  badge: string;
  points: string;
  name: string;
  chip: string;
};

type Props = {
  isDarkMode: boolean;
  theme: ThemeType;
  category: string;
  competition: string;
  competitionLabels: Record<string, string>;
  filteredRanking: RankingItem[];
  leader?: RankingItem | null;
  titleFightStatus: {
    label: string;
    tone: string;
  };
  pilotTrendMap: Record<string, "up" | "stable" | "down">;
  handleSelectPilot: (pilot: RankingItem) => void;
  getPilotFirstAndLastName: (name?: string) => string;
  getPilotWarNameDisplay: (pilot?: RankingItem | null) => string;
  getTop6RowStyles: (position: number) => Top6Styles;
  getTrendVisual: (status: "up" | "stable" | "down", isDark: boolean) => TrendVisual;
  normalizePilotName: (name?: string) => string;
};

export default function RankingGeneralClassificationSection({
  isDarkMode,
  theme,
  category,
  competition,
  competitionLabels,
  filteredRanking,
  leader,
  titleFightStatus,
  pilotTrendMap,
  handleSelectPilot,
  getPilotFirstAndLastName,
  getPilotWarNameDisplay,
  getTop6RowStyles,
  getTrendVisual,
  normalizePilotName,
}: Props) {
  return (
    <section className="space-y-3">
      <div
        className={`overflow-hidden rounded-[22px] shadow-sm ${
          isDarkMode
            ? `border ${theme.darkAccentBorder} bg-[#111827]`
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
                      ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}`
                      : theme.titlePill
                  }`}
                >
                  <h2
                    className={`truncate text-[17px] font-extrabold uppercase leading-none tracking-[0.05em] ${
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
        className={`overflow-hidden rounded-[22px] shadow-sm ${
          isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
        }`}
      >
        <CardContent className="p-0">
          <div
            className={`px-3 py-3 ${
              isDarkMode
                ? "border-b border-white/10 bg-gradient-to-r from-[#111827] via-[#161e2b] to-[#111827]"
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
                    className={`h-4.5 w-4.5 ${
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
                    className={`text-[14px] font-extrabold tracking-tight ${
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
                      ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
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
                    ? "border-white/10 bg-[#0f172a]"
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
                    ? "border-white/10 bg-[#0f172a]"
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
                    ? "border-white/10 bg-[#0f172a]"
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
                    ? `${Math.max((leader?.pontos || 0) - filteredRanking[1].pontos, 0)} pts`
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
                <col className="w-[36px]" />
                <col className="w-[36px]" />
              </colgroup>

              <thead className="sticky top-0 z-10">
                <tr
                  className={`text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur ${
                    isDarkMode
                      ? `border-b border-white/10 bg-[#161e2b] ${theme.darkAccentText}`
                      : `border-b border-black/5 ${theme.tableHeadBg} text-zinc-500`
                  }`}
                >
                  <th className="whitespace-nowrap px-1 py-2.5 text-center">Pos</th>
                  <th className="whitespace-nowrap px-2 py-2.5 text-left">Piloto</th>
                  <th className="whitespace-nowrap px-0.5 py-2.5 text-center">Pts</th>
                  <th className="whitespace-nowrap px-0.5 py-2.5 text-center">Vit</th>
                  <th className="whitespace-nowrap px-0.5 py-2.5 text-center">Pol</th>
                  <th className="whitespace-nowrap px-0.5 py-2.5 text-center">VMR</th>
                  <th className="whitespace-nowrap px-0.5 py-2.5 text-center">PDS</th>
                </tr>
              </thead>

              <tbody>
                {filteredRanking.map((item, index) => {
                  const nomeLinha1 = getPilotFirstAndLastName(item.piloto);
                  const nomeLinha2 = getPilotWarNameDisplay(item);
                  const isTop6 = index < 6;
                  const isLeader = index === 0;
                  const styles = getTop6RowStyles(index + 1);
                  const trendStatus =
                    pilotTrendMap[item.pilotoId || normalizePilotName(item.piloto)] ||
                    "stable";
                  const trendVisual = getTrendVisual(trendStatus, isDarkMode);
                  const TrendIcon = trendVisual.Icon;

                  const darkRow = isTop6
                    ? index === 0
                      ? `${theme.darkLeaderRow} shadow-[0_0_0_1px_rgba(250,204,21,0.14),0_12px_26px_rgba(0,0,0,0.28)]`
                      : index === 1
                        ? `${theme.darkSecondRow} shadow-[0_0_0_1px_rgba(161,161,170,0.14),0_10px_22px_rgba(0,0,0,0.22)]`
                        : index === 2
                          ? `${theme.darkThirdRow} shadow-[0_0_0_1px_rgba(245,158,11,0.14),0_10px_22px_rgba(0,0,0,0.22)]`
                          : index === 3
                            ? "bg-gradient-to-r from-sky-500/10 via-[#161e2b] to-[#111827] border-l-[4px] border-l-sky-400 shadow-[0_0_0_1px_rgba(56,189,248,0.12),0_10px_22px_rgba(0,0,0,0.2)]"
                            : index === 4
                              ? "bg-gradient-to-r from-violet-500/10 via-[#161e2b] to-[#111827] border-l-[4px] border-l-violet-400 shadow-[0_0_0_1px_rgba(168,85,247,0.12),0_10px_22px_rgba(0,0,0,0.2)]"
                              : "bg-gradient-to-r from-emerald-500/10 via-[#161e2b] to-[#111827] border-l-[4px] border-l-emerald-400 shadow-[0_0_0_1px_rgba(52,211,153,0.12),0_10px_22px_rgba(0,0,0,0.2)]"
                    : `${index % 2 === 0 ? "bg-[#111827]" : "bg-[#0f172a]"} hover:bg-[#161e2b]`;

                  return (
                    <tr
                      key={`${category}-${competition}-table-${item.pos}-${item.piloto}`}
                      className={`group transition ${
                        isDarkMode
                          ? darkRow
                          : isTop6
                            ? styles.row
                            : `${index % 2 === 0 ? "bg-white" : "bg-zinc-50/40"} hover:bg-zinc-50`
                      }`}
                    >
                      <td className="px-1 py-2.5 text-center align-middle">
                        <button
                          type="button"
                          onClick={() => handleSelectPilot(item)}
                          className="mx-auto flex h-7 w-7 items-center justify-center rounded-[10px] text-[11px] font-bold transition active:scale-95"
                        >
                          <span
                            className={`relative flex h-7 w-7 items-center justify-center rounded-[10px] ${isTop6 ? "shadow-[0_6px_14px_rgba(0,0,0,0.14)]" : "shadow-sm"} ${
                              isDarkMode
                                ? index === 0
                                  ? theme.darkTopBadge
                                  : index === 1
                                    ? "bg-white/10 text-white"
                                    : index === 2
                                      ? "bg-amber-500/20 text-amber-300"
                                      : "bg-white/10 text-white"
                                : styles.badge
                            }`}
                          >
                            {isLeader ? (
                              <Star className="absolute -right-1 -top-1 h-3 w-3 fill-yellow-300 text-yellow-500" />
                            ) : null}
                            {index + 1}
                          </span>
                        </button>
                      </td>

                      <td className="min-w-0 px-2 py-2.5 align-middle">
                        <button
                          type="button"
                          onClick={() => handleSelectPilot(item)}
                          className="block w-full text-left transition active:scale-[0.99]"
                        >
                          <div className="min-w-0">
                            <div className="flex items-start justify-between gap-1.5">
                              <span
                                className={`block min-w-0 flex-1 whitespace-normal break-words text-[12px] font-extrabold leading-[1.1] tracking-tight ${
                                  isDarkMode ? "text-white" : styles.name
                                }`}
                              >
                                {nomeLinha1}
                              </span>

                              <span
                                className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] ${trendVisual.className}`}
                              >
                                <TrendIcon className="h-3 w-3" />
                                {trendVisual.label}
                              </span>
                            </div>

                            {nomeLinha2 ? (
                              <div className="mt-0.5 flex items-center gap-1">
                                <span
                                  className={`inline-flex max-w-full whitespace-normal break-words rounded-full border px-1.5 py-0.5 text-[9px] font-semibold italic tracking-[0.02em] ${
                                    isDarkMode
                                      ? `${theme.darkAccentBorder} ${theme.darkAccentBg} text-zinc-200`
                                      : styles.chip
                                  }`}
                                >
                                  {nomeLinha2}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        </button>
                      </td>

                      <td
                        className={`px-0.5 py-2.5 text-center align-middle text-[11px] font-extrabold ${
                          isDarkMode
                            ? index === 0
                              ? theme.darkAccentText
                              : "text-white"
                            : isTop6
                              ? styles.points
                              : "text-zinc-950"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectPilot(item)}
                          className="w-full transition active:scale-95"
                        >
                          {item.pontos}
                        </button>
                      </td>

                      <td
                        className={`px-0.5 py-2.5 text-center align-middle text-[11px] font-semibold ${
                          isDarkMode ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectPilot(item)}
                          className="w-full transition active:scale-95"
                        >
                          {item.vitorias}
                        </button>
                      </td>

                      <td
                        className={`px-0.5 py-2.5 text-center align-middle text-[11px] font-semibold ${
                          isDarkMode ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectPilot(item)}
                          className="w-full transition active:scale-95"
                        >
                          {item.poles}
                        </button>
                      </td>

                      <td
                        className={`px-0.5 py-2.5 text-center align-middle text-[11px] font-semibold ${
                          isDarkMode ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectPilot(item)}
                          className="w-full transition active:scale-95"
                        >
                          {item.mv}
                        </button>
                      </td>

                      <td
                        className={`px-0.5 py-2.5 text-center align-middle text-[11px] font-semibold ${
                          isDarkMode ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectPilot(item)}
                          className="w-full transition active:scale-95"
                        >
                          {item.podios}
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredRanking.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className={`px-4 py-8 text-center text-sm ${
                        isDarkMode ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      Nenhum piloto com pontos encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
