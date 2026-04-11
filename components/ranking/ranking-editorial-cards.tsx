"use client";

import { Flame, ShieldAlert, Activity, Crown } from "lucide-react";
import type { EditorialCardItem } from "@/lib/hooks/useEditorialCards";

type ThemeLike = {
  darkAccentBorder?: string;
  darkAccentBgSoft?: string;
  darkAccentIconWrap?: string;
  darkAccentText?: string;
};

function getToneClasses(tone: EditorialCardItem["tone"], isDarkMode: boolean) {
  if (isDarkMode) {
    switch (tone) {
      case "hot":
        return {
          card: "border-orange-500/30 bg-[linear-gradient(180deg,rgba(249,115,22,0.12),rgba(17,24,39,0.92))]",
          badge: "border-orange-500/30 bg-orange-500/10 text-orange-300",
          iconWrap: "bg-orange-500/12",
          icon: "text-orange-300",
        };
      case "alert":
        return {
          card: "border-yellow-500/30 bg-[linear-gradient(180deg,rgba(234,179,8,0.12),rgba(17,24,39,0.92))]",
          badge: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
          iconWrap: "bg-yellow-500/12",
          icon: "text-yellow-300",
        };
      case "dominant":
        return {
          card: "border-emerald-500/30 bg-[linear-gradient(180deg,rgba(16,185,129,0.12),rgba(17,24,39,0.92))]",
          badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
          iconWrap: "bg-emerald-500/12",
          icon: "text-emerald-300",
        };
      default:
        return {
          card: "border-white/10 bg-[#111827]",
          badge: "border-white/10 bg-white/5 text-zinc-300",
          iconWrap: "bg-white/5",
          icon: "text-zinc-300",
        };
    }
  }

  switch (tone) {
    case "hot":
      return {
        card: "border-orange-200 bg-[linear-gradient(180deg,rgba(255,237,213,0.9),rgba(255,255,255,0.96))]",
        badge: "border-orange-200 bg-orange-50 text-orange-700",
        iconWrap: "bg-orange-100",
        icon: "text-orange-700",
      };
    case "alert":
      return {
        card: "border-yellow-200 bg-[linear-gradient(180deg,rgba(254,249,195,0.85),rgba(255,255,255,0.96))]",
        badge: "border-yellow-200 bg-yellow-50 text-yellow-700",
        iconWrap: "bg-yellow-100",
        icon: "text-yellow-700",
      };
    case "dominant":
      return {
        card: "border-emerald-200 bg-[linear-gradient(180deg,rgba(209,250,229,0.85),rgba(255,255,255,0.96))]",
        badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
        iconWrap: "bg-emerald-100",
        icon: "text-emerald-700",
      };
    default:
      return {
        card: "border-black/5 bg-white",
        badge: "border-black/5 bg-zinc-50 text-zinc-700",
        iconWrap: "bg-zinc-100",
        icon: "text-zinc-700",
      };
  }
}

function getToneIcon(tone: EditorialCardItem["tone"]) {
  switch (tone) {
    case "hot":
      return Flame;
    case "alert":
      return ShieldAlert;
    case "dominant":
      return Crown;
    default:
      return Activity;
  }
}

export default function RankingEditorialCards({
  isDarkMode,
  theme,
  cards,
}: {
  isDarkMode: boolean;
  theme: ThemeLike;
  cards: EditorialCardItem[];
}) {
  if (!cards.length) return null;

  return (
    <section className="space-y-2.5 lg:space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`text-[9px] font-bold uppercase tracking-[0.18em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
            Leitura editorial
          </p>
          <h3 className={`mt-1 text-[16px] font-semibold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
            Cards automáticos do campeonato
          </h3>
        </div>
        <div className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? `${theme.darkAccentBorder || "border-white/10"} bg-white/5 ${theme.darkAccentText || "text-zinc-200"}` : "border-black/5 bg-white text-zinc-700"}`}>
          atualização dinâmica
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {cards.map((card) => {
          const tone = getToneClasses(card.tone, isDarkMode);
          const Icon = getToneIcon(card.tone);

          return (
            <article
              key={card.id}
              className={`rounded-[22px] border p-4 shadow-sm transition-all duration-200 hover:-translate-y-[1px] ${tone.card}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className={`text-[9px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                    {card.eyebrow}
                  </p>
                  <h4 className={`mt-1 text-[16px] font-bold leading-tight tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                    {card.title}
                  </h4>
                </div>

                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${tone.iconWrap}`}>
                  <Icon className={`h-4.5 w-4.5 ${tone.icon}`} />
                </div>
              </div>

              <p className={`mt-3 text-[12px] leading-relaxed ${isDarkMode ? "text-zinc-300" : "text-zinc-600"}`}>
                {card.description}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${tone.badge}`}>
                  {card.badge}
                </div>
                <div className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                  card editorial
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
