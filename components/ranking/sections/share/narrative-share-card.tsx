"use client";

import React, { type RefObject } from "react";

type ThemeLike = {
  primaryBorder: string;
  primaryIconWrap: string;
  heroBorder: string;
  darkAccentBorder: string;
  darkAccentBg: string;
  darkAccentText: string;
  searchBadge: string;
};

type NarrativeLike = {
  headline: string;
  kicker: string;
  body: string;
  badges: { label: string; value: string }[];
};

type Props = {
  cardRef: RefObject<HTMLDivElement | null>;
  isDarkMode: boolean;
  theme: ThemeLike;
  category: string;
  competition: string;
  competitionLabels: Record<string, string>;
  championshipNarrative: NarrativeLike;
};

export default function NarrativeShareCard({
  cardRef,
  isDarkMode,
  theme,
  category,
  competition,
  competitionLabels,
  championshipNarrative,
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
              Narrativa oficial
            </p>
            <h2 className="mt-2 text-[40px] leading-tight font-extrabold tracking-tight">
              {championshipNarrative.headline}
            </h2>
            <p
              className={`mt-3 text-[20px] font-semibold ${
                isDarkMode ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              {category} · {competitionLabels[competition] || competition}
            </p>
          </div>

          <div
            className={`rounded-full border px-5 py-2 text-[15px] font-bold tracking-[0.14em] uppercase ${
              isDarkMode
                ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                : theme.searchBadge
            }`}
          >
            {championshipNarrative.kicker}
          </div>
        </div>

        <p
          className={`mt-6 text-[22px] leading-[1.5] ${
            isDarkMode ? "text-zinc-200" : "text-zinc-700"
          }`}
        >
          {championshipNarrative.body}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {championshipNarrative.badges.map((badge) => (
            <div
              key={`share-narrative-${badge.label}`}
              className={`rounded-[20px] border px-4 py-3 ${
                isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
              }`}
            >
              <p
                className={`text-[11px] font-bold tracking-[0.16em] uppercase ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                {badge.label}
              </p>
              <p className="mt-2 text-[22px] font-extrabold tracking-tight">{badge.value}</p>
            </div>
          ))}
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
