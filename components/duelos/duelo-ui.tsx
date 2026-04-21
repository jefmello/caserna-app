"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  getPilotFirstAndLastName,
  getPilotWarNameDisplay,
  getCategoryTheme,
} from "@/lib/ranking/ranking-utils";
import type { RankingItem } from "@/types/ranking";

export function DuelSelectorCard({
  title,
  value,
  onChange,
  options,
  isDarkMode,
  theme: _theme,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  options: RankingItem[];
  isDarkMode: boolean;
  theme: ReturnType<typeof getCategoryTheme>;
}) {
  return (
    <Card
      className={`rounded-[22px] shadow-sm ${
        isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
      }`}
    >
      <CardContent className="p-4">
        <p
          className={`text-[10px] font-bold tracking-[0.16em] uppercase ${
            isDarkMode ? "text-zinc-500" : "text-zinc-400"
          }`}
        >
          {title}
        </p>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`mt-3 w-full rounded-[16px] border px-3 py-3 text-sm font-medium transition outline-none ${
            isDarkMode
              ? "border-white/10 bg-[#0f172a] text-white"
              : "border-black/5 bg-zinc-50 text-zinc-950"
          }`}
        >
          <option value="">Selecione um piloto</option>
          {options.map((pilot) => (
            <option
              key={`${title}-${pilot.pilotoId || pilot.piloto}`}
              value={pilot.pilotoId || pilot.piloto}
            >
              {getPilotFirstAndLastName(pilot.piloto)}
            </option>
          ))}
        </select>

        <p
          className={`mt-2 text-[12px] leading-snug ${
            isDarkMode ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          Escolha o piloto para montar o confronto premium.
        </p>
      </CardContent>
    </Card>
  );
}

export function PilotInfoCard({
  title,
  pilot,
  position,
  score,
  isWinner,
  isDarkMode,
  theme,
}: {
  title: string;
  pilot: RankingItem;
  position: number;
  score: number;
  isWinner: boolean;
  isDarkMode: boolean;
  theme: ReturnType<typeof getCategoryTheme>;
}) {
  return (
    <Card
      className={`rounded-[24px] shadow-sm transition-all duration-200 ${
        isDarkMode
          ? isWinner
            ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}`
            : "border border-white/10 bg-[#111827]"
          : isWinner
            ? "border-yellow-300/70 bg-yellow-50/80"
            : "border-black/5 bg-white"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p
              className={`text-[10px] font-bold tracking-[0.16em] uppercase ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              {title}
            </p>
            <p
              className={`mt-2 text-[20px] leading-tight font-bold ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              #{position} {getPilotFirstAndLastName(pilot.piloto)}
            </p>

            {getPilotWarNameDisplay(pilot) ? (
              <p
                className={`mt-1 text-[12px] italic ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                {getPilotWarNameDisplay(pilot)}
              </p>
            ) : null}
          </div>

          <div
            className={`rounded-full border px-3 py-1 text-[11px] font-bold ${
              isDarkMode
                ? isWinner
                  ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                  : "border-white/10 bg-white/5 text-zinc-300"
                : isWinner
                  ? "border-yellow-300 bg-yellow-100 text-yellow-800"
                  : "border-black/5 bg-zinc-50 text-zinc-700"
            }`}
          >
            {score} pts duelo
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            { label: "Pontos", value: pilot.pontos },
            { label: "Vitórias", value: pilot.vitorias },
            { label: "Pódios", value: pilot.podios },
            { label: "ADV", value: pilot.adv },
          ].map(({ label, value }) => (
            <div
              key={label}
              className={`rounded-[16px] border px-3 py-2 ${
                isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50/80"
              }`}
            >
              <p
                className={`text-[9px] font-bold tracking-[0.14em] uppercase ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                {label}
              </p>
              <p
                className={`mt-1 text-[16px] font-semibold ${
                  isDarkMode ? "text-white" : "text-zinc-950"
                }`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export type DuelMetricWithWinner = {
  label: string;
  shortLabel: string;
  a: number;
  b: number;
  lowerIsBetter: boolean;
  description: string;
  winner: "a" | "b" | "tie";
};

export function MetricRow({
  metric,
  isDarkMode,
  pilotAName,
  pilotBName,
}: {
  metric: DuelMetricWithWinner;
  isDarkMode: boolean;
  pilotAName: string;
  pilotBName: string;
}) {
  return (
    <div
      className={`grid grid-cols-[72px_1fr_56px_56px] items-center gap-2 rounded-[18px] border px-3 py-3 ${
        isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-white"
      }`}
    >
      <div>
        <p
          className={`text-[10px] font-bold tracking-[0.14em] uppercase ${
            isDarkMode ? "text-zinc-500" : "text-zinc-400"
          }`}
        >
          {metric.shortLabel}
        </p>
      </div>

      <div className="min-w-0">
        <p className={`text-[14px] font-bold ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
          {metric.label}
        </p>
        <p
          className={`mt-0.5 truncate text-[12px] ${
            isDarkMode ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          {metric.description}
        </p>
        {metric.a + metric.b > 0 && (
          <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full">
            <div
              className={`transition-all duration-300 ${
                metric.winner === "a"
                  ? "bg-emerald-500"
                  : isDarkMode
                    ? "bg-zinc-600"
                    : "bg-zinc-300"
              }`}
              style={{ width: `${(metric.a / (metric.a + metric.b)) * 100}%` }}
            />
            <div
              className={`transition-all duration-300 ${
                metric.winner === "b"
                  ? "bg-emerald-500"
                  : isDarkMode
                    ? "bg-zinc-600"
                    : "bg-zinc-300"
              }`}
              style={{ width: `${(metric.b / (metric.a + metric.b)) * 100}%` }}
            />
          </div>
        )}
        {metric.a + metric.b > 0 && (
          <div className="mt-0.5 flex justify-between">
            <span
              className={`text-[9px] font-semibold ${isDarkMode ? "text-zinc-600" : "text-zinc-400"}`}
            >
              {pilotAName}
            </span>
            <span
              className={`text-[9px] font-semibold ${isDarkMode ? "text-zinc-600" : "text-zinc-400"}`}
            >
              {pilotBName}
            </span>
          </div>
        )}
      </div>

      <div
        className={`rounded-[14px] px-2 py-2 text-center text-[12px] font-bold ${
          metric.winner === "a"
            ? isDarkMode
              ? "bg-emerald-500/10 text-emerald-300"
              : "bg-emerald-50 text-emerald-700"
            : isDarkMode
              ? "bg-white/5 text-zinc-300"
              : "bg-zinc-50 text-zinc-700"
        }`}
      >
        {metric.a}
      </div>

      <div
        className={`rounded-[14px] px-2 py-2 text-center text-[12px] font-bold ${
          metric.winner === "b"
            ? isDarkMode
              ? "bg-emerald-500/10 text-emerald-300"
              : "bg-emerald-50 text-emerald-700"
            : isDarkMode
              ? "bg-white/5 text-zinc-300"
              : "bg-zinc-50 text-zinc-700"
        }`}
      >
        {metric.b}
      </div>
    </div>
  );
}
