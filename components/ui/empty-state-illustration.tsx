"use client";

import React from "react";

type Variant = "search" | "duel" | "photos" | "data" | "pilot";

type Props = {
  variant: Variant;
  title: string;
  description?: string;
  isDark?: boolean;
  action?: React.ReactNode;
  className?: string;
};

/**
 * Illustrated empty state. Five variants with custom inline SVG.
 */
export default function EmptyStateIllustration({
  variant,
  title,
  description,
  isDark,
  action,
  className = "",
}: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-3xl border px-6 py-12 text-center ${
        isDark
          ? "border-white/10 bg-[#0f172a] text-zinc-300"
          : "border-black/5 bg-zinc-50/80 text-zinc-600"
      } ${className}`}
    >
      <div className="mb-5 h-40 w-40">
        <Illustration variant={variant} isDark={isDark} />
      </div>
      <p className={`text-lg font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-950"}`}>
        {title}
      </p>
      {description && <p className="mt-2 max-w-sm text-sm leading-relaxed">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function Illustration({ variant, isDark }: { variant: Variant; isDark?: boolean }) {
  const stroke = isDark ? "#94a3b8" : "#64748b";
  const accent = isDark ? "#facc15" : "#eab308";
  const bg = isDark ? "#1e293b" : "#fef9c3";

  switch (variant) {
    case "duel":
      return (
        <svg
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="80" cy="80" r="70" fill={bg} opacity="0.4" />
          <path
            d="M45 110 L70 55 L75 60 L50 115 Z"
            fill={accent}
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M115 110 L90 55 L85 60 L110 115 Z"
            fill={accent}
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="80" cy="40" r="10" fill="none" stroke={stroke} strokeWidth="2" />
          <path d="M80 55 L80 95" stroke={stroke} strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      );
    case "photos":
      return (
        <svg
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="80" cy="80" r="70" fill={bg} opacity="0.4" />
          <rect
            x="40"
            y="50"
            width="80"
            height="60"
            rx="8"
            fill="none"
            stroke={stroke}
            strokeWidth="2"
          />
          <circle cx="80" cy="80" r="14" fill="none" stroke={stroke} strokeWidth="2" />
          <circle cx="80" cy="80" r="6" fill={accent} />
          <circle cx="105" cy="62" r="2" fill={stroke} />
        </svg>
      );
    case "search":
      return (
        <svg
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="80" cy="80" r="70" fill={bg} opacity="0.4" />
          <circle cx="70" cy="70" r="24" fill="none" stroke={stroke} strokeWidth="3" />
          <path d="M90 90 L115 115" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
          <path
            d="M58 70 L62 74 L80 56"
            stroke={accent}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );
    case "data":
      return (
        <svg
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="80" cy="80" r="70" fill={bg} opacity="0.4" />
          <rect x="50" y="90" width="14" height="30" rx="3" fill={accent} />
          <rect x="72" y="70" width="14" height="50" rx="3" fill={stroke} opacity="0.45" />
          <rect x="94" y="50" width="14" height="70" rx="3" fill={accent} />
          <path d="M40 120 L120 120" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "pilot":
    default:
      return (
        <svg
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="80" cy="80" r="70" fill={bg} opacity="0.4" />
          <circle cx="80" cy="65" r="18" fill="none" stroke={stroke} strokeWidth="2" />
          <path
            d="M45 120 Q80 90 115 120"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M62 60 L98 60" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
  }
}
