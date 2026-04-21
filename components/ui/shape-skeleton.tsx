"use client";

import React from "react";

type BaseProps = {
  isDark?: boolean;
  className?: string;
};

const shimmer = "animate-pulse bg-gradient-to-r";
const lightBg = "from-zinc-100 via-zinc-200 to-zinc-100";
const darkBg = "from-white/5 via-white/10 to-white/5";

function bg(isDark?: boolean) {
  return `${shimmer} ${isDark ? darkBg : lightBg} rounded-xl`;
}

/**
 * Shape-matched skeleton for a pilot row (badge + name + stats).
 */
export function PilotRowSkeleton({ isDark, className = "" }: BaseProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
        isDark ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
      } ${className}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className={`h-10 w-10 rounded-full ${bg(isDark)}`} />
        <div className="min-w-0 space-y-2">
          <div className={`h-3.5 w-32 ${bg(isDark)}`} />
          <div className={`h-2.5 w-20 ${bg(isDark)}`} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {[24, 32, 28].map((w, i) => (
          <div key={i} className={`h-3.5 ${bg(isDark)}`} style={{ width: w }} />
        ))}
      </div>
    </div>
  );
}

/**
 * Shape-matched skeleton for the full classification table (N rows).
 */
export function ClassificationSkeleton({
  rows = 8,
  isDark,
  className = "",
}: BaseProps & { rows?: number }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <PilotRowSkeleton key={i} isDark={isDark} />
      ))}
    </div>
  );
}

/**
 * Hero leader card skeleton — matches podium-badge + title + stat grid layout.
 */
export function LeaderHeroSkeleton({ isDark, className = "" }: BaseProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-5 ${
        isDark ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`h-14 w-14 rounded-full ${bg(isDark)}`} />
          <div className="min-w-0 space-y-2">
            <div className={`h-3 w-20 ${bg(isDark)}`} />
            <div className={`h-6 w-44 ${bg(isDark)}`} />
            <div className={`h-3 w-28 ${bg(isDark)}`} />
          </div>
        </div>
        <div className={`h-7 w-24 rounded-full ${bg(isDark)}`} />
      </div>
      <div className="mt-5 grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-2xl border p-3 ${
              isDark ? "border-white/10 bg-[#111827]" : "border-black/5 bg-zinc-50/50"
            }`}
          >
            <div className={`h-2.5 w-12 ${bg(isDark)}`} />
            <div className={`mt-2 h-7 w-16 ${bg(isDark)}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for a stat card grid (3-6 boxes).
 */
export function StatGridSkeleton({
  cells = 4,
  isDark,
  className = "",
}: BaseProps & { cells?: number }) {
  return (
    <div
      className={`grid gap-3 ${
        cells <= 3 ? "grid-cols-3" : "grid-cols-2 lg:grid-cols-4"
      } ${className}`}
    >
      {Array.from({ length: cells }).map((_, i) => (
        <div
          key={i}
          className={`rounded-2xl border p-4 ${
            isDark ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
          }`}
        >
          <div className={`h-2.5 w-14 ${bg(isDark)}`} />
          <div className={`mt-3 h-8 w-20 ${bg(isDark)}`} />
          <div className={`mt-3 h-2 w-24 ${bg(isDark)}`} />
        </div>
      ))}
    </div>
  );
}
