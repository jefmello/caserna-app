"use client";

/* eslint-disable @next/next/no-img-element -- sponsor logos use native img to preserve marquee animation styles and onError handling */

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { sponsorLogos } from "@/lib/ranking/ranking-utils";

type SponsorLogoItem = {
  name: string;
  src: string;
  wrapper: string;
  surfaceLight: string;
  surfaceDark: string;
  image: string;
  shareImage?: string;
};

const FALLBACK_SPONSOR_LOGOS: SponsorLogoItem[] = [
  {
    name: "LazyKart",
    src: "/patrocinadores/lazykart.png",
    wrapper: "px-3",
    surfaceLight: "bg-white",
    surfaceDark: "bg-white/5",
    image: "h-auto max-h-[28px] w-auto max-w-[84%] object-contain md:max-h-[34px]",
  },
  {
    name: "Lumine",
    src: "/patrocinadores/lumine.png",
    wrapper: "px-3",
    surfaceLight: "bg-white",
    surfaceDark: "bg-white/5",
    image: "h-auto max-h-[28px] w-auto max-w-[84%] object-contain md:max-h-[34px]",
  },
  {
    name: "Precision",
    src: "/patrocinadores/precision.png",
    wrapper: "px-3",
    surfaceLight: "bg-white",
    surfaceDark: "bg-white/5",
    image: "h-auto max-h-[28px] w-auto max-w-[84%] object-contain md:max-h-[34px]",
  },
  {
    name: "Skyflow",
    src: "/patrocinadores/skyflow.png",
    wrapper: "px-3",
    surfaceLight: "bg-white",
    surfaceDark: "bg-white/5",
    image: "h-auto max-h-[28px] w-auto max-w-[84%] object-contain md:max-h-[34px]",
  },
  {
    name: "Vits",
    src: "/patrocinadores/vits.png",
    wrapper: "px-3",
    surfaceLight: "bg-white",
    surfaceDark: "bg-white/5",
    image: "h-auto max-h-[28px] w-auto max-w-[84%] object-contain md:max-h-[34px]",
  },
  {
    name: "Astera",
    src: "/patrocinadores/astera.png",
    wrapper: "px-3",
    surfaceLight: "bg-white",
    surfaceDark: "bg-white/5",
    image: "h-auto max-h-[28px] w-auto max-w-[84%] object-contain md:max-h-[34px]",
  },
];

function readThemeFromEnvironment(explicitIsDarkMode?: boolean) {
  if (typeof explicitIsDarkMode === "boolean") return explicitIsDarkMode;
  if (typeof window === "undefined") return true;

  const storedTheme = window.localStorage.getItem("caserna-theme");
  const rootHasDark = document.documentElement.classList.contains("dark");
  const bodyHasDark = document.body.classList.contains("dark");

  return storedTheme === "dark" || rootHasDark || bodyHasDark;
}

function normalizeSponsorName(name: string) {
  return name.trim().toLowerCase();
}

function getSponsorLogoClassName(sponsor: SponsorLogoItem, isDarkMode: boolean) {
  const name = normalizeSponsorName(sponsor.name);

  const base = "h-auto w-auto object-contain transition-all duration-300 group-hover:scale-[1.055]";

  if (isDarkMode) {
    switch (name) {
      case "lazykart":
        return `${base} max-h-[48px] max-w-[76%] brightness-[1.04] contrast-[1.16] saturate-[1.03] drop-shadow-[0_4px_12px_rgba(255,255,255,0.08)] md:max-h-[54px]`;
      case "lumine":
        return `${base} max-h-[76px] max-w-[97%] brightness-[1.1] contrast-[1.22] saturate-[1.08] drop-shadow-[0_4px_14px_rgba(251,191,36,0.16)] md:max-h-[86px]`;
      case "precision":
        return `${base} max-h-[116px] max-w-[148%] brightness-[1.08] contrast-[1.22] saturate-[1.05] drop-shadow-[0_4px_12px_rgba(255,255,255,0.08)] md:max-h-[128px]`;
      case "skyflow":
        return `${base} max-h-[118px] max-w-[152%] brightness-[1.12] contrast-[1.28] saturate-[1.06] drop-shadow-[0_4px_12px_rgba(255,255,255,0.1)] md:max-h-[130px]`;
      case "vits":
        return `${base} max-h-[114px] max-w-[144%] brightness-[1.06] contrast-[1.18] saturate-[1.08] drop-shadow-[0_4px_12px_rgba(239,68,68,0.1)] md:max-h-[126px]`;
      case "astera":
        return `${base} max-h-[52px] max-w-[80%] brightness-[1.08] contrast-[1.2] saturate-[1.1] drop-shadow-[0_4px_14px_rgba(250,204,21,0.18)] md:max-h-[58px]`;
      default:
        return `${base} max-h-[74px] max-w-[96%] brightness-[1.06] contrast-[1.14] saturate-[1.04] md:max-h-[84px]`;
    }
  }

  switch (name) {
    case "lazykart":
      return `${base} max-h-[46px] max-w-[74%] brightness-[0.58] contrast-[1.92] saturate-[1.04] drop-shadow-[0_3px_8px_rgba(15,23,42,0.14)] md:max-h-[52px]`;
    case "lumine":
      return `${base} max-h-[76px] max-w-[97%] brightness-[0.96] contrast-[1.54] saturate-[1.22] drop-shadow-[0_4px_12px_rgba(0,0,0,0.18)] md:max-h-[86px]`;
    case "precision":
      return `${base} max-h-[118px] max-w-[150%] brightness-[0.82] contrast-[1.6] saturate-[1.08] drop-shadow-[0_3px_8px_rgba(15,23,42,0.14)] md:max-h-[130px]`;
    case "skyflow":
      return `${base} max-h-[120px] max-w-[154%] brightness-[0.54] contrast-[2.12] saturate-[1.14] drop-shadow-[0_4px_12px_rgba(0,0,0,0.18)] md:max-h-[132px]`;
    case "vits":
      return `${base} max-h-[116px] max-w-[146%] brightness-[0.94] contrast-[1.46] saturate-[1.14] drop-shadow-[0_3px_8px_rgba(127,29,29,0.10)] md:max-h-[128px]`;
    case "astera":
      return `${base} max-h-[50px] max-w-[78%] brightness-[0.95] contrast-[1.58] saturate-[1.22] drop-shadow-[0_4px_12px_rgba(0,0,0,0.18)] md:max-h-[56px]`;
    default:
      return `${base} max-h-[74px] max-w-[96%] brightness-[0.78] contrast-[1.46] saturate-[1.08] drop-shadow-[0_3px_8px_rgba(15,23,42,0.10)] md:max-h-[84px]`;
  }
}

function getSponsorInnerSurfaceClassName(sponsor: SponsorLogoItem, isDarkMode: boolean) {
  const name = normalizeSponsorName(sponsor.name);

  if (isDarkMode) {
    switch (name) {
      case "lumine":
        return "bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.09),rgba(255,255,255,0.02)_42%,transparent_78%)]";
      case "astera":
        return "bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.09),rgba(255,255,255,0.02)_42%,transparent_78%)]";
      case "vits":
        return "bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.065),rgba(255,255,255,0.02)_42%,transparent_78%)]";
      case "skyflow":
        return "bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.06),rgba(255,255,255,0.02)_42%,transparent_78%)]";
      default:
        return "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_76%)]";
    }
  }

  switch (name) {
    case "lumine":
      return "bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.18),rgba(255,255,255,0.18)_38%,transparent_78%)]";
    case "astera":
      return "bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.18),rgba(255,255,255,0.18)_38%,transparent_78%)]";
    case "vits":
      return "bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.10),rgba(255,255,255,0.34)_38%,transparent_78%)]";
    case "skyflow":
      return "bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.12),rgba(255,255,255,0.16)_38%,transparent_78%)]";
    default:
      return "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.92),rgba(255,255,255,0.32)_40%,transparent_76%)]";
  }
}

function getSponsorContentClassName(sponsor: SponsorLogoItem) {
  const name = normalizeSponsorName(sponsor.name);

  switch (name) {
    case "precision":
      return "px-0 py-0 md:px-0";
    case "skyflow":
      return "px-0 py-0 md:px-0";
    case "vits":
      return "px-0 py-0 md:px-0";
    case "lazykart":
      return "px-6 py-1 md:px-7";
    case "astera":
      return "px-5 py-1 md:px-6";
    case "lumine":
      return "px-2 py-0.5 md:px-3";
    default:
      return `${sponsor.wrapper} md:px-3`;
  }
}

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

  const logoClassName = getSponsorLogoClassName(sponsor, isDarkMode);
  const innerSurfaceClassName = getSponsorInnerSurfaceClassName(sponsor, isDarkMode);
  const surfaceClassName = isDarkMode ? sponsor.surfaceDark : sponsor.surfaceLight;
  const contentClassName = getSponsorContentClassName(sponsor);

  return (
    <div
      className={`group relative flex h-[88px] min-w-[228px] items-center justify-center overflow-hidden rounded-[22px] border px-3 transition-all duration-300 md:h-[92px] md:min-w-[248px] xl:min-w-[264px] ${
        isDarkMode
          ? "border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.985)_0%,rgba(6,10,24,0.985)_52%,rgba(2,6,23,0.985)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_14px_34px_rgba(0,0,0,0.34)] hover:-translate-y-[1px] hover:border-white/20 hover:bg-[linear-gradient(180deg,rgba(22,31,50,1)_0%,rgba(8,13,28,1)_54%,rgba(5,8,20,1)_100%)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_20px_42px_rgba(0,0,0,0.42)]"
          : "border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.995)_0%,rgba(250,250,252,0.995)_36%,rgba(241,245,249,0.99)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,1),0_10px_26px_rgba(15,23,42,0.08),0_1px_0_rgba(255,255,255,0.9)] hover:-translate-y-[1px] hover:border-black/10 hover:bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(252,252,253,1)_36%,rgba(238,242,247,1)_100%)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_16px_32px_rgba(15,23,42,0.12)]"
      }`}
      title={sponsor.name}
    >
      <div
        className={`pointer-events-none absolute inset-[1px] rounded-[21px] ${
          isDarkMode
            ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,transparent_30%,transparent_100%)]"
            : "bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.72)_22%,rgba(255,255,255,0.2)_62%,transparent_100%)]"
        }`}
      />

      <div
        className={`pointer-events-none absolute inset-[5px] rounded-[18px] border ${
          isDarkMode ? "border-white/8" : "border-white/80"
        } ${surfaceClassName}`}
      />

      <div
        className={`pointer-events-none absolute inset-[6px] rounded-[18px] ${innerSurfaceClassName}`}
      />

      <div
        className={`pointer-events-none absolute inset-x-[16%] top-0 h-px ${
          isDarkMode ? "bg-white/14" : "bg-white"
        }`}
      />

      <div
        className={`pointer-events-none absolute inset-x-[8%] bottom-[5px] h-[24px] rounded-full blur-2xl ${
          isDarkMode
            ? "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_72%)]"
            : "bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.08),transparent_72%)]"
        }`}
      />

      <div
        className={`pointer-events-none absolute inset-0 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100 ${
          isDarkMode
            ? "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.11),transparent_62%)]"
            : "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.55),rgba(15,23,42,0.05)_42%,transparent_70%)]"
        }`}
      />

      {!isDarkMode && (
        <>
          <div className="pointer-events-none absolute inset-x-6 bottom-2 h-6 rounded-full bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.05),transparent_74%)] blur-xl" />
          <div className="pointer-events-none absolute inset-x-10 top-2 h-7 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.95),transparent_70%)] blur-xl" />
          <div className="pointer-events-none absolute top-3 right-5 h-8 w-20 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.72),transparent_72%)] blur-xl" />
        </>
      )}

      {hasError ? (
        <span
          className={`relative z-10 px-3 text-center text-[12px] font-bold tracking-[0.14em] uppercase md:text-[14px] ${
            isDarkMode ? "text-white/85" : "text-zinc-700"
          }`}
        >
          {sponsor.name}
        </span>
      ) : (
        <div
          className={`relative z-10 flex h-full w-full items-center justify-center ${contentClassName}`}
        >
          <img
            src={sponsor.src}
            alt={sponsor.name}
            className={logoClassName}
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
          ? "border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.985)_0%,rgba(6,10,24,0.985)_52%,rgba(2,6,23,0.99)_100%)] shadow-[0_22px_54px_rgba(0,0,0,0.3)]"
          : "border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(251,252,253,1)_38%,rgba(240,244,248,0.995)_100%)] shadow-[0_18px_42px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,1)]"
      }`}
    >
      <CardContent className="p-0">
        <div className="relative px-4 py-4 md:px-5 md:py-5 xl:px-6 xl:py-6">
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
              animation: casernaSponsorsMarquee 34s linear infinite;
              will-change: transform;
            }

            .caserna-sponsors-marquee:hover {
              animation-play-state: paused;
            }

            @media (max-width: 768px) {
              .caserna-sponsors-marquee {
                animation-duration: 26s;
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .caserna-sponsors-marquee {
                animation: none;
              }
            }
          `}</style>

          <div
            className={`pointer-events-none absolute inset-x-0 top-0 h-px ${
              resolvedDarkMode ? "bg-white/10" : "bg-white"
            }`}
          />

          {!resolvedDarkMode && (
            <>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_38%)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.06),transparent_72%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.016)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.016)_1px,transparent_1px)] [mask-image:radial-gradient(circle_at_center,black,transparent_88%)] bg-[size:24px_24px] opacity-45" />
              <div className="pointer-events-none absolute inset-x-[12%] top-0 h-20 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.92),transparent_72%)] blur-2xl" />
            </>
          )}

          {resolvedDarkMode && (
            <>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_64%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] [mask-image:radial-gradient(circle_at_center,black,transparent_90%)] bg-[size:28px_28px] opacity-20" />
            </>
          )}

          <div className="relative mb-5 flex items-center justify-center">
            <div
              className={`absolute top-1/2 left-0 h-px w-[18%] -translate-y-1/2 md:w-[22%] ${
                resolvedDarkMode
                  ? "bg-gradient-to-r from-transparent via-white/10 to-white/10"
                  : "bg-gradient-to-r from-transparent via-zinc-300/80 to-zinc-400/70"
              }`}
            />

            <div className="relative flex items-center justify-center px-4 md:px-6">
              <div
                className={`pointer-events-none absolute inset-0 rounded-full blur-xl ${
                  resolvedDarkMode
                    ? "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_70%)]"
                    : "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.96),rgba(15,23,42,0.05)_58%,transparent_78%)]"
                }`}
              />

              <h3
                className={`relative text-center text-[12px] font-bold tracking-[0.28em] uppercase md:text-[14px] ${
                  resolvedDarkMode
                    ? "text-white/88"
                    : "bg-[linear-gradient(180deg,#111827_0%,#374151_100%)] bg-clip-text text-transparent"
                }`}
              >
                PATROCINADORES OFICIAIS
              </h3>
            </div>

            <div
              className={`absolute top-1/2 right-0 h-px w-[18%] -translate-y-1/2 md:w-[22%] ${
                resolvedDarkMode
                  ? "bg-gradient-to-l from-transparent via-white/10 to-white/10"
                  : "bg-gradient-to-l from-transparent via-zinc-300/80 to-zinc-400/70"
              }`}
            />
          </div>

          <div
            className={`relative overflow-hidden rounded-[24px] border ${
              resolvedDarkMode
                ? "border-white/8"
                : "border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.22)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]"
            }`}
          >
            <div
              className={`pointer-events-none absolute inset-y-0 left-0 z-20 w-10 md:w-14 ${
                resolvedDarkMode
                  ? "bg-gradient-to-r from-[#09111d] via-[#09111d]/84 to-transparent"
                  : "bg-gradient-to-r from-[#f8fafc] via-[#f8fafc]/84 to-transparent"
              }`}
            />
            <div
              className={`pointer-events-none absolute inset-y-0 right-0 z-20 w-10 md:w-14 ${
                resolvedDarkMode
                  ? "bg-gradient-to-l from-[#09111d] via-[#09111d]/84 to-transparent"
                  : "bg-gradient-to-l from-[#f8fafc] via-[#f8fafc]/84 to-transparent"
              }`}
            />

            {!resolvedDarkMode && (
              <>
                <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-white" />
                <div className="pointer-events-none absolute inset-x-8 bottom-0 h-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.06),transparent_74%)] blur-2xl" />
              </>
            )}

            <div className="overflow-hidden px-0.5 py-0.5">
              <div className="caserna-sponsors-marquee flex items-center gap-3 md:gap-4">
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
