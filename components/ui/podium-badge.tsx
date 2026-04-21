"use client";

import React from "react";

type Props = {
  position: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-lg",
} as const;

/**
 * Metallic podium badge for positions 1-6.
 * Each position gets a distinct metallic gradient + glow.
 * Fallback to neutral for positions > 6.
 */
export default function PodiumBadge({ position, size = "md", className = "" }: Props) {
  const palette = getPalette(position);
  const sizeClass = SIZES[size];

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full font-black tracking-tight shadow-[0_6px_16px_rgba(0,0,0,0.18)] ${sizeClass} ${className}`}
      style={{
        background: palette.background,
        color: palette.foreground,
        boxShadow: `0 0 0 1px ${palette.ring}, 0 8px 20px ${palette.glow}`,
      }}
    >
      <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">{position}</span>
      <span
        className="pointer-events-none absolute inset-0 rounded-full mix-blend-overlay"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.25) 100%)",
        }}
      />
    </div>
  );
}

function getPalette(position: number) {
  switch (position) {
    case 1:
      // Gold — polished
      return {
        background:
          "conic-gradient(from 210deg at 50% 40%, #fde68a 0%, #facc15 18%, #eab308 36%, #ca8a04 55%, #fbbf24 75%, #fde68a 100%)",
        foreground: "#3f2d05",
        ring: "rgba(234,179,8,0.65)",
        glow: "rgba(234,179,8,0.45)",
      };
    case 2:
      // Silver — brushed
      return {
        background:
          "conic-gradient(from 200deg at 50% 40%, #f4f4f5 0%, #d4d4d8 22%, #a1a1aa 45%, #e4e4e7 70%, #f4f4f5 100%)",
        foreground: "#1f2937",
        ring: "rgba(161,161,170,0.6)",
        glow: "rgba(161,161,170,0.4)",
      };
    case 3:
      // Bronze
      return {
        background:
          "conic-gradient(from 220deg at 50% 40%, #fed7aa 0%, #f59e0b 20%, #b45309 45%, #d97706 70%, #fbbf24 100%)",
        foreground: "#3a1e03",
        ring: "rgba(217,119,6,0.65)",
        glow: "rgba(217,119,6,0.45)",
      };
    case 4:
      // Sky — cool metallic blue
      return {
        background: "linear-gradient(145deg, #dbeafe 0%, #60a5fa 35%, #2563eb 65%, #60a5fa 100%)",
        foreground: "#0b1f4d",
        ring: "rgba(37,99,235,0.55)",
        glow: "rgba(37,99,235,0.38)",
      };
    case 5:
      // Violet
      return {
        background: "linear-gradient(145deg, #ede9fe 0%, #a78bfa 35%, #7c3aed 65%, #a78bfa 100%)",
        foreground: "#1e1038",
        ring: "rgba(124,58,237,0.55)",
        glow: "rgba(124,58,237,0.38)",
      };
    case 6:
      // Emerald — podium cut line
      return {
        background: "linear-gradient(145deg, #d1fae5 0%, #34d399 35%, #059669 65%, #34d399 100%)",
        foreground: "#053224",
        ring: "rgba(5,150,105,0.55)",
        glow: "rgba(5,150,105,0.38)",
      };
    default:
      return {
        background: "linear-gradient(145deg, #f4f4f5 0%, #d4d4d8 50%, #e4e4e7 100%)",
        foreground: "#27272a",
        ring: "rgba(161,161,170,0.45)",
        glow: "rgba(0,0,0,0.12)",
      };
  }
}
