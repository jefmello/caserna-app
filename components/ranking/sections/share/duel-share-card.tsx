"use client";

import React, { type RefObject } from "react";
import type { RankingItem } from "@/types/ranking";
import { normalizePilotName as defaultNormalizePilotName } from "@/lib/ranking/ranking-utils";

type ThemeLike = {
  primaryBorder: string;
  primaryIconWrap: string;
  heroBorder: string;
  darkAccentBorder: string;
  darkAccentBg: string;
  darkAccentBgSoft?: string;
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

type Props = {
  cardRef: RefObject<HTMLDivElement | null>;
  isDarkMode: boolean;
  theme: ThemeLike;
  category: string;
  competition: string;
  competitionLabels: Record<string, string>;
  comparePilotA: RankingItem | null;
  comparePilotB: RankingItem | null;
  duelSummary: DuelSummaryLike;
  duelIntensity: DuelIntensityLike;
  getPilotFirstAndLastName: (name?: string) => string;
  normalizePilotName?: typeof defaultNormalizePilotName;
};

export default function DuelShareCard({
  cardRef,
  isDarkMode,
  theme,
  category,
  competition,
  competitionLabels,
  comparePilotA,
  comparePilotB,
  duelSummary,
  duelIntensity,
  getPilotFirstAndLastName,
  normalizePilotName = defaultNormalizePilotName,
}: Props) {
  return (
    <div
      ref={cardRef}
      className={`relative mt-6 w-[1080px] overflow-hidden rounded-[36px] border p-8 ${
        isDarkMode ? "border-white/10 text-white" : `${theme.primaryBorder} text-zinc-950`
      }`}
      style={{
        background: isDarkMode
          ? `linear-gradient(135deg, #0b0f16 0%, #111827 40%, #0f172a 100%)`
          : `linear-gradient(135deg, #ffffff 0%, #fafafa 100%)`,
      }}
    >
      <div
        className={`absolute -top-20 -right-20 h-80 w-80 rounded-full blur-3xl ${
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
              className={`text-[15px] font-bold tracking-[0.22em] uppercase ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Duelo premium
            </p>
            <h2 className="mt-2 text-[40px] leading-tight font-extrabold tracking-tight">
              {comparePilotA
                ? comparePilotA.nomeGuerra
                  ? `"${normalizePilotName(comparePilotA.nomeGuerra)}"`
                  : getPilotFirstAndLastName(comparePilotA.piloto)
                : "Piloto A"}{" "}
              <span className={isDarkMode ? "text-zinc-500" : "text-zinc-400"}>vs</span>{" "}
              {comparePilotB
                ? comparePilotB.nomeGuerra
                  ? `"${normalizePilotName(comparePilotB.nomeGuerra)}"`
                  : getPilotFirstAndLastName(comparePilotB.piloto)
                : "Piloto B"}
            </h2>
            {comparePilotA &&
              comparePilotB &&
              comparePilotA.nomeGuerra &&
              comparePilotB.nomeGuerra && (
                <p
                  className={`mt-1 text-[18px] font-medium ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  {getPilotFirstAndLastName(comparePilotA.piloto)} vs{" "}
                  {getPilotFirstAndLastName(comparePilotB.piloto)}
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
            className={`rounded-full border px-5 py-2 text-[15px] font-bold tracking-[0.14em] uppercase ${duelIntensity.tone}`}
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
              {comparePilotA ? getPilotFirstAndLastName(comparePilotA.piloto) : "Piloto A"}
            </p>
            <p className={`mt-2 text-[16px] ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
              {comparePilotA
                ? `${comparePilotA.pontos} pts · ${comparePilotA.vitorias} vitórias`
                : "sem dados"}
            </p>
          </div>

          <div
            className={`rounded-[26px] border px-6 py-5 text-center ${
              isDarkMode
                ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft || theme.darkAccentBg}`
                : `${theme.primaryBorder} bg-white`
            }`}
          >
            <p
              className={`text-[12px] font-bold tracking-[0.16em] uppercase ${
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
              {comparePilotB ? getPilotFirstAndLastName(comparePilotB.piloto) : "Piloto B"}
            </p>
            <p className={`mt-2 text-[16px] ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
              {comparePilotB
                ? `${comparePilotB.pontos} pts · ${comparePilotB.vitorias} vitórias`
                : "sem dados"}
            </p>
          </div>
        </div>

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
                  <span
                    className={`w-16 text-right text-[12px] font-bold ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}
                  >
                    {metric.label}
                  </span>
                  <div className="flex flex-1 items-center gap-2">
                    <div
                      className={`h-5 flex-1 overflow-hidden rounded-full ${isDarkMode ? "bg-white/5" : "bg-zinc-100"}`}
                    >
                      <div
                        className={`h-full rounded-full ${isDarkMode ? theme.darkAccentBgSoft : theme.primaryIconWrap}`}
                        style={{ width: `${(metric.a / maxVal) * 100}%` }}
                      />
                    </div>
                    <span
                      className={`w-8 text-center text-[13px] font-bold tabular-nums ${isDarkMode ? "text-zinc-200" : "text-zinc-700"}`}
                    >
                      {metric.a}
                    </span>
                  </div>
                  <div className="flex flex-1 items-center gap-2">
                    <span
                      className={`w-8 text-center text-[13px] font-bold tabular-nums ${isDarkMode ? "text-zinc-200" : "text-zinc-700"}`}
                    >
                      {metric.b}
                    </span>
                    <div
                      className={`h-5 flex-1 overflow-hidden rounded-full ${isDarkMode ? "bg-white/5" : "bg-zinc-100"}`}
                    >
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
        <p
          className={`text-[12px] font-bold tracking-[0.2em] uppercase ${
            isDarkMode ? "text-zinc-600" : "text-zinc-300"
          }`}
        >
          CASERNA KART RACING
        </p>
        <p className={`text-[12px] ${isDarkMode ? "text-zinc-600" : "text-zinc-300"}`}>
          {new Date().toLocaleDateString("pt-BR")} às{" "}
          {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}
