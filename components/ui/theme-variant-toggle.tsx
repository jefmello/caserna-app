"use client";

import React, { useEffect, useRef, useState } from "react";
import { Palette, Check } from "lucide-react";
import clsx from "clsx";
import useThemeVariant from "@/lib/hooks/useThemeVariant";
import { THEME_VARIANTS, type ThemeVariant } from "@/lib/theme-variants";
import { useChampionship } from "@/context/championship-context";

const ORDER: ThemeVariant[] = ["midnight", "gulf", "ferrari", "stealth"];

/**
 * Dropdown picker for the global theme variant (livery).
 * Mounts anywhere, reads/writes localStorage via useThemeVariant.
 */
export default function ThemeVariantToggle({ className = "" }: { className?: string }) {
  const { isDarkMode } = useChampionship();
  const { variant, setVariant } = useThemeVariant();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = THEME_VARIANTS[variant];

  return (
    <div ref={rootRef} className={clsx("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Escolher variante de tema"
        title={`Tema: ${current.label}`}
        className={clsx(
          "flex h-9 items-center gap-2 rounded-xl border px-2.5 text-[11px] font-semibold tracking-[0.08em] uppercase transition-all duration-200",
          isDarkMode
            ? "border-white/10 bg-white/[0.04] text-white/75 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
        )}
      >
        <span
          className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/20"
          style={{ background: current.swatch }}
          aria-hidden="true"
        />
        <Palette className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">{current.label}</span>
      </button>

      {open && (
        <div
          role="menu"
          className={clsx(
            "absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border p-1.5 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.5)] backdrop-blur-xl",
            isDarkMode
              ? "border-white/10 bg-[#0a0e18]/90 text-white"
              : "border-zinc-200 bg-white/95 text-zinc-900"
          )}
        >
          {ORDER.map((key) => {
            const v = THEME_VARIANTS[key];
            const active = key === variant;
            return (
              <button
                key={key}
                role="menuitemradio"
                aria-checked={active}
                type="button"
                onClick={() => {
                  setVariant(key);
                  setOpen(false);
                }}
                className={clsx(
                  "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition",
                  active
                    ? isDarkMode
                      ? "bg-white/[0.08]"
                      : "bg-zinc-100"
                    : isDarkMode
                      ? "hover:bg-white/[0.05]"
                      : "hover:bg-zinc-50"
                )}
              >
                <span
                  className="h-6 w-6 shrink-0 rounded-full border border-black/25 shadow-inner"
                  style={{
                    background: `${v.swatch}`,
                    boxShadow: `inset 0 0 0 2px rgba(${v.accent},0.65)`,
                  }}
                  aria-hidden="true"
                />
                <span className="flex-1">
                  <span className="block text-[12px] font-semibold">{v.label}</span>
                  <span
                    className={clsx(
                      "block text-[10px] leading-tight",
                      isDarkMode ? "text-white/55" : "text-zinc-500"
                    )}
                  >
                    {v.description}
                  </span>
                </span>
                {active && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
