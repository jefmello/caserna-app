"use client";

import React, { useMemo, useState } from "react";
import clsx from "clsx";
import type { CategoryTheme } from "@/lib/ranking/theme-utils";

export type HeatmapPilotRow = {
  name: string;
  /** Per-stage values. `null` means "no data" (rendered as empty cell). */
  values: Array<number | null>;
};

type Props = {
  pilots: HeatmapPilotRow[];
  maxColumns?: number;
  theme: CategoryTheme;
  isDark: boolean;
  /** Label for each column slot. */
  columnLabel?: (index: number) => string;
};

type Bucket = "empty" | "down" | "neutral" | "up" | "top";

function cellClass(bucket: Bucket, isDark: boolean): string {
  switch (bucket) {
    case "empty":
      return isDark
        ? "border border-dashed border-white/8 bg-transparent"
        : "border border-dashed border-zinc-200 bg-transparent";
    case "down":
      return "bg-red-500/40 border border-red-500/30";
    case "neutral":
      return "bg-zinc-500/40 border border-zinc-500/25";
    case "up":
      return "bg-emerald-500/60 border border-emerald-500/40";
    case "top":
      return "bg-emerald-400 border border-emerald-300";
  }
}

/**
 * Pure stateless consistency heatmap inspired by GitHub contributions.
 * Caller decides what "values" represent (usually per-stage points).
 * Buckets are computed relative to the global min/max of non-null values.
 */
export default function ConsistencyHeatmap({
  pilots,
  maxColumns,
  theme,
  isDark,
  columnLabel = (i) => `E${i + 1}`,
}: Props) {
  const { cols, min, max } = useMemo(() => {
    const derivedCols = pilots.reduce((n, p) => Math.max(n, p.values.length), 0);
    const resolvedCols = maxColumns ? Math.min(derivedCols, maxColumns) : derivedCols;
    let mn = Infinity;
    let mx = -Infinity;
    for (const p of pilots) {
      for (const v of p.values) {
        if (v == null) continue;
        if (v < mn) mn = v;
        if (v > mx) mx = v;
      }
    }
    if (!isFinite(mn)) mn = 0;
    if (!isFinite(mx)) mx = 0;
    return { cols: resolvedCols, min: mn, max: mx };
  }, [pilots, maxColumns]);

  const [hover, setHover] = useState<{
    name: string;
    col: number;
    value: number | null;
  } | null>(null);

  const bucketize = (v: number | null): Bucket => {
    if (v == null) return "empty";
    if (max === min) return "neutral";
    const t = (v - min) / (max - min);
    if (t >= 0.85) return "top";
    if (t >= 0.55) return "up";
    if (t >= 0.3) return "neutral";
    return "down";
  };

  return (
    <div
      className={clsx(
        "relative overflow-x-auto rounded-2xl border p-3 sm:p-4",
        isDark ? `${theme.darkAccentBorder} ${theme.darkAccentBg}` : "border-zinc-200 bg-white/80"
      )}
    >
      <div
        className="grid gap-y-1.5"
        style={{ gridTemplateColumns: `minmax(120px,1fr) repeat(${cols}, minmax(14px,1fr))` }}
      >
        <div />
        {Array.from({ length: cols }, (_, i) => (
          <div
            key={`col-${i}`}
            className={clsx(
              "pb-1 text-center text-[9px] font-semibold tracking-[0.1em] uppercase",
              isDark ? "text-white/45" : "text-zinc-400"
            )}
          >
            {columnLabel(i)}
          </div>
        ))}

        {pilots.map((pilot) => (
          <React.Fragment key={pilot.name}>
            <div
              className={clsx(
                "truncate pr-3 text-[11px] font-semibold",
                isDark ? "text-white/80" : "text-zinc-700"
              )}
            >
              {pilot.name}
            </div>
            {Array.from({ length: cols }, (_, i) => {
              const v = pilot.values[i] ?? null;
              const bucket = bucketize(v);
              const label = `${pilot.name} · ${columnLabel(i)} · ${
                v == null ? "sem dado" : `${v} pts`
              }`;
              return (
                <button
                  type="button"
                  key={`${pilot.name}-${i}`}
                  aria-label={label}
                  title={label}
                  className="relative flex items-center justify-center bg-transparent p-0"
                  onMouseEnter={() => setHover({ name: pilot.name, col: i, value: v })}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover({ name: pilot.name, col: i, value: v })}
                  onBlur={() => setHover(null)}
                >
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "h-4 w-4 rounded-[4px] transition-transform duration-150 hover:scale-125 sm:h-[18px] sm:w-[18px]",
                      cellClass(bucket, isDark)
                    )}
                  />
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {hover && (
        <div
          role="status"
          className={clsx(
            "pointer-events-none absolute right-3 bottom-3 rounded-lg border px-2 py-1 text-[11px] font-semibold shadow-lg",
            isDark
              ? "border-white/10 bg-[#0a0e18]/95 text-white"
              : "border-zinc-200 bg-white/95 text-zinc-800"
          )}
        >
          {hover.name} · {columnLabel(hover.col)} ·{" "}
          {hover.value == null ? "sem dado" : `${hover.value} pts`}
        </div>
      )}

      <div
        className={clsx(
          "mt-3 flex flex-wrap items-center gap-3 text-[10px] font-semibold tracking-[0.14em] uppercase",
          isDark ? "text-white/50" : "text-zinc-500"
        )}
      >
        <span>Baixo</span>
        <span className={clsx("h-3 w-3 rounded-[3px]", cellClass("down", isDark))} />
        <span className={clsx("h-3 w-3 rounded-[3px]", cellClass("neutral", isDark))} />
        <span className={clsx("h-3 w-3 rounded-[3px]", cellClass("up", isDark))} />
        <span className={clsx("h-3 w-3 rounded-[3px]", cellClass("top", isDark))} />
        <span>Alto</span>
      </div>
    </div>
  );
}
