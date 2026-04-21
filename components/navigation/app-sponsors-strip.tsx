"use client";

/* eslint-disable @next/next/no-img-element -- sponsor logos use native img to preserve marquee animation styles and onError handling */

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { sponsorLogos } from "@/lib/ranking/ranking-utils";

type SponsorLogoItem = {
  name: string;
  src: string;
  wrapper?: string;
  surfaceLight?: string;
  surfaceDark?: string;
  image?: string;
  shareImage?: string;
};

const FALLBACK_SPONSOR_LOGOS: SponsorLogoItem[] = [
  { name: "LazyKart", src: "/patrocinadores/lazykart.png" },
  { name: "Lumine", src: "/patrocinadores/lumine.png" },
  { name: "Precision", src: "/patrocinadores/precision.png" },
  { name: "Skyflow", src: "/patrocinadores/skyflow.png" },
  { name: "Vits", src: "/patrocinadores/vits.png" },
  { name: "Astera", src: "/patrocinadores/astera.png" },
];

function readThemeFromEnvironment(explicitIsDarkMode?: boolean) {
  if (typeof explicitIsDarkMode === "boolean") return explicitIsDarkMode;
  if (typeof window === "undefined") return true;

  const storedTheme = window.localStorage.getItem("caserna-theme");
  const rootHasDark = document.documentElement.classList.contains("dark");
  const bodyHasDark = document.body.classList.contains("dark");

  return storedTheme === "dark" || rootHasDark || bodyHasDark;
}

/**
 * Sponsor marquee card — premium F1-style panel.
 *
 * Design principles:
 * - Inner surface is always a light panel regardless of theme (logos are designed
 *   for white backgrounds; this guarantees legibility everywhere).
 * - Outer frame adapts to theme: dark cards in dark mode, neutral cards in light.
 * - Single logo size (h-16 / md:h-20) — all sponsors get equal visual weight.
 * - Subtle 3D depth via top highlight + bottom inner shadow, no distracting tints.
 */
function SponsorMarqueeCard({
  sponsor,
  isDarkMode,
}: {
  sponsor: SponsorLogoItem;
  isDarkMode: boolean;
}) {
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(sponsor.src);
  if (sponsor.src !== prevSrc) {
    setPrevSrc(sponsor.src);
    setHasError(false);
  }

  return (
    <div
      title={sponsor.name}
      className={`group relative flex h-[112px] min-w-[240px] items-center justify-center overflow-hidden rounded-[22px] border px-3 transition-all duration-300 md:h-[120px] md:min-w-[260px] xl:min-w-[280px] ${
        isDarkMode
          ? "border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#0b1120_60%,#070b14_100%)] shadow-[0_16px_38px_rgba(0,0,0,0.4)] hover:-translate-y-[2px] hover:border-white/20 hover:shadow-[0_24px_50px_rgba(0,0,0,0.5)]"
          : "border-black/5 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)] hover:-translate-y-[2px] hover:border-black/10 hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)]"
      }`}
    >
      {/* Outer top highlight — 1px bright line for glass/metal feel */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-[10%] top-0 h-px ${
          isDarkMode ? "bg-white/20" : "bg-white"
        }`}
      />

      {/* Inner light panel — ALWAYS light so logos (designed for white) render native */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[6px] rounded-[16px] border border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_55%,#f3f4f6_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-6px_14px_rgba(15,23,42,0.04)]"
      />

      {/* Inner top highlight on the panel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[14%] top-[7px] h-px bg-white"
      />

      {/* Soft spotlight on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[6px] rounded-[16px] bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.9),transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Content — logo or name fallback */}
      {hasError ? (
        <span className="relative z-10 px-3 text-center text-[14px] font-bold tracking-[0.14em] text-zinc-700 uppercase">
          {sponsor.name}
        </span>
      ) : (
        <div className="relative z-10 flex h-full w-full items-center justify-center px-5 py-3 md:px-6 md:py-4">
          <img
            src={sponsor.src}
            alt={sponsor.name}
            className="h-auto max-h-[64px] w-auto max-w-[88%] object-contain transition-transform duration-300 group-hover:scale-[1.04] md:max-h-[72px]"
            onError={() => setHasError(true)}
          />
        </div>
      )}
    </div>
  );
}

export default function AppSponsorsStrip({ isDarkMode }: { isDarkMode?: boolean }) {
  const [resolvedDarkMode, setResolvedDarkMode] = useState(true);

  useEffect(() => {
    const syncTheme = () => {
      setResolvedDarkMode(readThemeFromEnvironment(isDarkMode));
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("storage", syncTheme);
    window.addEventListener("caserna-theme-change", syncTheme as EventListener);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("caserna-theme-change", syncTheme as EventListener);
    };
  }, [isDarkMode]);

  const resolvedSponsorLogos = useMemo<SponsorLogoItem[]>(() => {
    if (Array.isArray(sponsorLogos) && sponsorLogos.length > 0) {
      return sponsorLogos as SponsorLogoItem[];
    }
    return FALLBACK_SPONSOR_LOGOS;
  }, []);

  const marqueeItems = useMemo(() => {
    if (!resolvedSponsorLogos.length) return [];
    return [...resolvedSponsorLogos, ...resolvedSponsorLogos];
  }, [resolvedSponsorLogos]);

  if (!resolvedSponsorLogos.length) {
    return null;
  }

  return (
    <Card
      className={`relative overflow-hidden rounded-[28px] border transition-all duration-300 ${
        resolvedDarkMode
          ? "border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.75)_0%,rgba(8,12,24,0.8)_100%)] shadow-[0_22px_54px_rgba(0,0,0,0.3)] backdrop-blur-xl"
          : "border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(248,250,252,0.95)_100%)] shadow-[0_18px_42px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,1)] backdrop-blur-xl"
      }`}
    >
      <CardContent className="p-0">
        <div className="relative px-4 py-5 md:px-6 md:py-6">
          <style jsx>{`
            @keyframes casernaSponsorsMarquee {
              0% {
                transform: translate3d(0, 0, 0);
              }
              100% {
                transform: translate3d(-50%, 0, 0);
              }
            }

            .caserna-sponsors-marquee {
              width: max-content;
              animation: casernaSponsorsMarquee 40s linear infinite;
              will-change: transform;
            }

            .caserna-sponsors-marquee:hover {
              animation-play-state: paused;
            }

            @media (max-width: 768px) {
              .caserna-sponsors-marquee {
                animation-duration: 28s;
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .caserna-sponsors-marquee {
                animation: none;
              }
            }
          `}</style>

          {/* Section header */}
          <div className="relative mb-5 flex items-center justify-center">
            <div
              className={`absolute top-1/2 left-0 h-px w-[16%] -translate-y-1/2 md:w-[22%] ${
                resolvedDarkMode
                  ? "bg-gradient-to-r from-transparent to-white/15"
                  : "bg-gradient-to-r from-transparent to-zinc-300"
              }`}
            />

            <h3
              className={`px-4 text-center text-[11px] font-bold tracking-[0.32em] uppercase md:text-[13px] ${
                resolvedDarkMode ? "text-white/75" : "text-zinc-600"
              }`}
            >
              Patrocinadores Oficiais
            </h3>

            <div
              className={`absolute top-1/2 right-0 h-px w-[16%] -translate-y-1/2 md:w-[22%] ${
                resolvedDarkMode
                  ? "bg-gradient-to-l from-transparent to-white/15"
                  : "bg-gradient-to-l from-transparent to-zinc-300"
              }`}
            />
          </div>

          {/* Marquee container — edge fades to blend scroll edges */}
          <div className="relative overflow-hidden rounded-[24px]">
            <div
              className={`pointer-events-none absolute inset-y-0 left-0 z-20 w-12 md:w-16 ${
                resolvedDarkMode
                  ? "bg-gradient-to-r from-[#0a1020] via-[#0a1020]/80 to-transparent"
                  : "bg-gradient-to-r from-white via-white/80 to-transparent"
              }`}
            />
            <div
              className={`pointer-events-none absolute inset-y-0 right-0 z-20 w-12 md:w-16 ${
                resolvedDarkMode
                  ? "bg-gradient-to-l from-[#0a1020] via-[#0a1020]/80 to-transparent"
                  : "bg-gradient-to-l from-white via-white/80 to-transparent"
              }`}
            />

            <div className="overflow-hidden py-1">
              <div className="caserna-sponsors-marquee flex items-stretch gap-4 md:gap-5">
                {marqueeItems.map((sponsor, index) => (
                  <SponsorMarqueeCard
                    key={`global-sponsor-marquee-${sponsor.name}-${index}`}
                    sponsor={sponsor}
                    isDarkMode={resolvedDarkMode}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
