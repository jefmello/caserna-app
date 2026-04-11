"use client";

import { useMemo, useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { getCategoryTheme } from "@/lib/ranking/theme-utils";
import {
  getCombinedSeasons,
  SEASONS,
  type Season,
} from "@/lib/seasons";

/**
 * Seletor de temporada para a sidebar/header.
 * Permite alternar entre temporadas ativas e arquivadas.
 */
export default function SeasonSelector({
  isDarkMode,
  category,
}: {
  isDarkMode: boolean;
  category: string;
}) {
  const theme = getCategoryTheme(category);
  const [isOpen, setIsOpen] = useState(false);

  const seasons = useMemo(() => getCombinedSeasons(), []);
  const activeSeason = useMemo(
    () => SEASONS.find((s) => s.isActive) || null,
    []
  );

  const currentLabel = activeSeason?.label || `Temporada ${new Date().getFullYear()}`;

  if (seasons.length <= 1) return null; // Só mostra se houver múltiplas temporadas

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition ${
          isDarkMode
            ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft} ${theme.darkAccentText} hover:brightness-110`
            : `${theme.primaryBorder} bg-white ${theme.primaryIcon} hover:bg-zinc-50`
        }`}
      >
        <Calendar className="h-3.5 w-3.5" />
        <span>{currentLabel}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div
            className={`absolute right-0 z-50 mt-1 w-56 overflow-hidden rounded-xl border shadow-lg ${
              isDarkMode
                ? "border-white/10 bg-[#111827]"
                : "border-black/5 bg-white"
            }`}
          >
            {seasons.map((season) => {
              const isActive = season.isActive;
              return (
                <button
                  key={season.year}
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={`w-full px-3 py-2.5 text-left transition ${
                    isActive
                      ? isDarkMode
                        ? `${theme.darkAccentBgSoft} ${theme.darkAccentText}`
                        : `${theme.primaryIconWrap} ${theme.primaryIcon}`
                      : isDarkMode
                        ? "text-zinc-400 hover:bg-white/5"
                        : "text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{season.label}</span>
                    {isActive && (
                      <span
                        className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                          isDarkMode
                            ? "border-emerald-500/30 text-emerald-300"
                            : "border-emerald-200 text-emerald-700"
                        }`}
                      >
                        Atual
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
