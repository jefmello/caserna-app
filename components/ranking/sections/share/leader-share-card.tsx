"use client";

/* eslint-disable @next/next/no-img-element -- offscreen canvas rendered via html-to-image; next/Image is incompatible */

import React, { type RefObject } from "react";
import type { RankingItem, RankingMetaPilot } from "@/types/ranking";

type PilotLike = RankingItem | RankingMetaPilot;

type ThemeLike = {
  primaryBorder: string;
  primaryIconWrap: string;
  primaryIcon: string;
  heroBorder: string;
  darkAccentBorder: string;
  darkAccentBg: string;
  darkAccentBgSoft?: string;
  darkAccentText: string;
  searchBadge: string;
};

type Props = {
  cardRef: RefObject<HTMLDivElement | null>;
  isDarkMode: boolean;
  theme: ThemeLike;
  category: string;
  competition: string;
  competitionLabels: Record<string, string>;
  leader: PilotLike | null;
  filteredRanking: RankingItem[];
  statsSummary: { leaderAdvantage: number };
  getPilotFirstAndLastName: (name?: string) => string;
};

export default function LeaderShareCard({
  cardRef,
  isDarkMode,
  theme,
  category,
  competition,
  competitionLabels,
  leader,
  filteredRanking,
  statsSummary,
  getPilotFirstAndLastName,
}: Props) {
  return (
    <div
      ref={cardRef}
      className={`relative w-[1080px] overflow-hidden rounded-[36px] border p-8 ${
        isDarkMode ? `border-white/10 text-white` : `${theme.primaryBorder} text-zinc-950`
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
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div
        className={`relative rounded-[28px] border p-7 ${
          isDarkMode
            ? `${theme.darkAccentBorder} bg-[#111827]/90`
            : `${theme.heroBorder} bg-white/92`
        }`}
      >
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {leader && (
              <div
                className={`h-20 w-20 overflow-hidden rounded-[22px] border ${
                  isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-zinc-50"
                }`}
              >
                {(() => {
                  const pilotoId = leader?.pilotoId ?? null;
                  return pilotoId ? (
                    <img
                      src={`/pilotos/${pilotoId}.jpg`}
                      alt={getPilotFirstAndLastName(leader?.piloto)}
                      className="h-full w-full object-cover object-center"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      className={`flex h-full w-full items-center justify-center ${
                        isDarkMode ? "bg-white/5" : "bg-zinc-100"
                      }`}
                    >
                      <span className="text-2xl">🏎️</span>
                    </div>
                  );
                })()}
              </div>
            )}
            <div>
              <p
                className={`text-[15px] font-bold tracking-[0.22em] uppercase ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                Líder oficial do campeonato
              </p>
              <h2 className="mt-2 text-[40px] leading-none font-extrabold tracking-tight">
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
            {leader && (
              <div
                className={`rounded-full border px-4 py-1.5 text-[13px] font-bold tracking-[0.12em] uppercase ${
                  isDarkMode
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {(() => {
                  const v = leader.vitorias || 0;
                  const p = leader.podios || 0;
                  const r = leader.participacoes || 1;
                  if (v >= 3 && p / r >= 0.6) return "🔥 Dominante";
                  if (p / r >= 0.7) return "⭐ Consistência Elite";
                  if (v >= 2) return "💥 Ofensiva";
                  if (p >= 2) return "📈 Em Ascensão";
                  return "🏁 Ativo";
                })()}
              </div>
            )}
            <div
              className={`rounded-full border px-5 py-2 text-[15px] font-bold tracking-[0.14em] uppercase ${
                isDarkMode
                  ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                  : theme.searchBadge
              }`}
            >
              liderança oficial
            </div>
          </div>
        </div>

        {leader && filteredRanking.length >= 2 && (
          <div className="mt-5">
            <div className="flex items-center justify-between text-[12px] font-semibold">
              <span className={isDarkMode ? "text-zinc-400" : "text-zinc-500"}>
                Progresso para o título
              </span>
              <span className={isDarkMode ? theme.darkAccentText : theme.primaryIcon}>
                {Math.min(
                  Math.round(
                    ((leader.pontos || 0) /
                      Math.max((leader.pontos || 0) + (filteredRanking[1]?.pontos || 0), 1)) *
                      100
                  ),
                  100
                )}
                %
              </span>
            </div>
            <div
              className={`mt-2 h-3 w-full overflow-hidden rounded-full ${
                isDarkMode ? "bg-white/5" : "bg-zinc-100"
              }`}
            >
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
              className={`text-[12px] font-bold tracking-[0.16em] uppercase ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Pontos
            </p>
            <p className="mt-2 text-[30px] font-extrabold tabular-nums">{leader?.pontos || 0}</p>
          </div>
          <div
            className={`rounded-[22px] border px-4 py-4 ${
              isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
            }`}
          >
            <p
              className={`text-[12px] font-bold tracking-[0.16em] uppercase ${
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
              className={`text-[12px] font-bold tracking-[0.16em] uppercase ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Vitórias
            </p>
            <p className="mt-2 text-[30px] font-extrabold tabular-nums">{leader?.vitorias || 0}</p>
          </div>
          <div
            className={`rounded-[22px] border px-4 py-4 ${
              isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
            }`}
          >
            <p
              className={`text-[12px] font-bold tracking-[0.16em] uppercase ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Pódios
            </p>
            <p className="mt-2 text-[30px] font-extrabold tabular-nums">{leader?.podios || 0}</p>
          </div>
        </div>
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
