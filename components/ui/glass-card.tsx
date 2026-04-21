"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  isDark?: boolean;
  intensity?: "soft" | "medium" | "strong";
  className?: string;
};

const BLUR = {
  soft: "backdrop-blur-md",
  medium: "backdrop-blur-xl",
  strong: "backdrop-blur-2xl",
} as const;

/**
 * Glassmorphism container with subtle gradient mesh + blur.
 * Adapts to dark/light theme.
 */
export default function GlassCard({
  children,
  isDark,
  intensity = "medium",
  className = "",
}: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border ${BLUR[intensity]} ${
        isDark
          ? "border-white/10 bg-white/[0.04] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)]"
          : "border-white/60 bg-white/55 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.15)]"
      } ${className}`}
    >
      {/* Gradient mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: isDark
            ? `radial-gradient(90% 60% at 10% 0%, rgba(168,85,247,0.18) 0%, transparent 55%),
               radial-gradient(80% 50% at 90% 10%, rgba(56,189,248,0.15) 0%, transparent 60%),
               radial-gradient(60% 50% at 50% 100%, rgba(250,204,21,0.10) 0%, transparent 70%)`
            : `radial-gradient(90% 60% at 10% 0%, rgba(96,165,250,0.22) 0%, transparent 55%),
               radial-gradient(80% 50% at 90% 10%, rgba(251,191,36,0.18) 0%, transparent 60%),
               radial-gradient(60% 50% at 50% 100%, rgba(167,139,250,0.12) 0%, transparent 70%)`,
        }}
      />
      {/* Inner highlight */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-px ${
          isDark
            ? "bg-gradient-to-r from-transparent via-white/30 to-transparent"
            : "bg-gradient-to-r from-transparent via-white/80 to-transparent"
        }`}
      />
      {/* Noise grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
