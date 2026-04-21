"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PodiumBadge from "@/components/ui/podium-badge";
import type { RankingItem } from "@/types/ranking";
import type { CategoryTheme } from "@/lib/ranking/theme-utils";
import { getPilotFirstAndLastName } from "@/lib/ranking/ranking-utils";

type Props = {
  top3: RankingItem[];
  isDark: boolean;
  theme: CategoryTheme;
  category: string;
};

/**
 * Sticky top-bar showing the top-3 pilots (podium chips) after the user
 * scrolls past ~200px. Slides down when appearing, up when hiding.
 * Sits at z-[55] so it stays above page content but below modals.
 */
export default function ClassificacaoStickyPodium({ top3, isDark, theme, category }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (top3.length === 0) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="sticky-podium"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed inset-x-0 top-0 z-[55] border-b backdrop-blur-xl ${
            isDark
              ? "border-white/8 bg-[#050810]/72 shadow-[0_10px_28px_rgba(0,0,0,0.42)]"
              : "border-zinc-200/70 bg-white/78 shadow-[0_10px_28px_rgba(15,23,42,0.08)]"
          }`}
          aria-label={`Mini pódio ${category}`}
        >
          <div className="mx-auto flex w-full max-w-[1600px] items-center gap-2 overflow-x-auto px-3 py-2 sm:gap-3 sm:px-4 lg:pl-[304px]">
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold tracking-[0.18em] uppercase ${
                isDark
                  ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                  : theme.headerChip
              }`}
            >
              {category} · Pódio
            </span>
            <div className="flex items-center gap-2 sm:gap-3">
              {top3.map((pilot, idx) => {
                const position = (idx + 1) as 1 | 2 | 3;
                const firstName = getPilotFirstAndLastName(pilot.piloto).split(" ")[0];
                return (
                  <div
                    key={pilot.pilotoId || `${pilot.piloto}-${idx}`}
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-2 py-1 sm:px-2.5 sm:py-1.5 ${
                      isDark ? "border-white/10 bg-white/[0.04]" : "border-zinc-200 bg-white/80"
                    }`}
                  >
                    <PodiumBadge position={position} size="sm" />
                    <span
                      className={`text-[12px] font-semibold ${
                        isDark ? "text-white/88" : "text-zinc-800"
                      }`}
                    >
                      {firstName}
                    </span>
                    <span
                      className={`text-[11px] font-semibold tabular-nums ${
                        isDark ? "text-white/60" : "text-zinc-500"
                      }`}
                    >
                      {pilot.pontos} pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
