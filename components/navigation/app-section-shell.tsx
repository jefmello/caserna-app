"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useChampionship } from "@/context/championship-context";
import AppSponsorsStrip from "./app-sponsors-strip";
import { normalizeCategoryAccent, type CategoryAccent } from "@/lib/ranking/ranking-utils";

type AppSectionShellProps = {
  children: React.ReactNode;
  isDarkMode?: boolean;
  section?: "default" | "home";
  categoryAccent?: CategoryAccent;
};

type CasernaCategoryAccentDetail = {
  accent?: string | null;
};

declare global {
  interface WindowEventMap {
    "caserna-category-accent-change": CustomEvent<CasernaCategoryAccentDetail>;
  }
}

function getAccentLayers(
  categoryAccent: CategoryAccent,
  isDarkMode: boolean
) {
  if (isDarkMode) {
    switch (categoryAccent) {
      case "base":
        return {
          glow:
            "bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.18),transparent_34%),radial-gradient(circle_at_18%_18%,rgba(251,146,60,0.09),transparent_24%),radial-gradient(circle_at_bottom,rgba(249,115,22,0.06),transparent_28%)]",
          line: "from-orange-400/40 via-orange-300/14 to-transparent",
          ring: "border-orange-400/20",
          edgeGlow: "shadow-[0_0_0_1px_rgba(251,146,60,0.08),0_28px_90px_rgba(249,115,22,0.12)]",
        };
      case "graduados":
        return {
          glow:
            "bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_18%_18%,rgba(96,165,250,0.09),transparent_24%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.06),transparent_28%)]",
          line: "from-blue-400/42 via-blue-300/14 to-transparent",
          ring: "border-blue-400/20",
          edgeGlow: "shadow-[0_0_0_1px_rgba(96,165,250,0.08),0_28px_90px_rgba(59,130,246,0.12)]",
        };
      case "elite":
        return {
          glow:
            "bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.2),transparent_34%),radial-gradient(circle_at_18%_18%,rgba(253,224,71,0.1),transparent_24%),radial-gradient(circle_at_bottom,rgba(250,204,21,0.06),transparent_28%)]",
          line: "from-yellow-300/44 via-yellow-200/15 to-transparent",
          ring: "border-yellow-300/22",
          edgeGlow: "shadow-[0_0_0_1px_rgba(253,224,71,0.08),0_28px_90px_rgba(250,204,21,0.13)]",
        };
      default:
        return {
          glow:
            "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_34%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.02),transparent_28%)]",
          line: "from-white/18 via-white/6 to-transparent",
          ring: "border-white/10",
          edgeGlow: "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_80px_rgba(0,0,0,0.12)]",
        };
    }
  }

  switch (categoryAccent) {
    case "base":
      return {
        glow:
          "bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.14),transparent_34%),radial-gradient(circle_at_18%_18%,rgba(251,146,60,0.08),transparent_24%),radial-gradient(circle_at_bottom,rgba(249,115,22,0.05),transparent_28%)]",
        line: "from-orange-500/30 via-orange-300/12 to-transparent",
        ring: "border-orange-300/45",
        edgeGlow: "shadow-[0_0_0_1px_rgba(251,146,60,0.05),0_24px_80px_rgba(249,115,22,0.08)]",
      };
    case "graduados":
      return {
        glow:
          "bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_34%),radial-gradient(circle_at_18%_18%,rgba(96,165,250,0.08),transparent_24%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.05),transparent_28%)]",
        line: "from-blue-500/30 via-blue-300/12 to-transparent",
        ring: "border-blue-300/45",
        edgeGlow: "shadow-[0_0_0_1px_rgba(96,165,250,0.05),0_24px_80px_rgba(59,130,246,0.08)]",
      };
    case "elite":
      return {
        glow:
          "bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.16),transparent_34%),radial-gradient(circle_at_18%_18%,rgba(253,224,71,0.08),transparent_24%),radial-gradient(circle_at_bottom,rgba(250,204,21,0.06),transparent_28%)]",
        line: "from-yellow-500/32 via-yellow-300/13 to-transparent",
        ring: "border-yellow-300/48",
        edgeGlow: "shadow-[0_0_0_1px_rgba(253,224,71,0.05),0_24px_80px_rgba(250,204,21,0.08)]",
      };
    default:
      return {
        glow:
          "bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.05),transparent_36%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.025),transparent_28%)]",
        line: "from-slate-500/18 via-slate-400/8 to-transparent",
        ring: "border-black/5",
        edgeGlow: "shadow-[0_24px_80px_rgba(15,23,42,0.08)]",
      };
  }
}

export default function AppSectionShell({
  children,
  section = "default",
  categoryAccent = "neutral",
}: AppSectionShellProps) {
  const { isDarkMode } = useChampionship();
  const [liveCategoryAccent, setLiveCategoryAccent] = useState<CategoryAccent>(
    normalizeCategoryAccent(categoryAccent)
  );

  useEffect(() => {
    setLiveCategoryAccent(normalizeCategoryAccent(categoryAccent));
  }, [categoryAccent]);

  useEffect(() => {
    const handleCategoryAccentChange = (
      event: WindowEventMap["caserna-category-accent-change"]
    ) => {
      const nextAccent = normalizeCategoryAccent(event.detail?.accent);
      setLiveCategoryAccent(nextAccent);
    };

    window.addEventListener(
      "caserna-category-accent-change",
      handleCategoryAccentChange
    );

    return () => {
      window.removeEventListener(
        "caserna-category-accent-change",
        handleCategoryAccentChange
      );
    };
  }, []);

  const accentLayers = useMemo(
    () => getAccentLayers(liveCategoryAccent, isDarkMode),
    [liveCategoryAccent, isDarkMode]
  );

  const contentWidthClass =
    section === "home"
      ? "max-w-md sm:max-w-2xl lg:max-w-5xl xl:max-w-[1320px]"
      : "max-w-md sm:max-w-2xl lg:max-w-5xl xl:max-w-[1280px]";

  const contentSpacingClass =
    section === "home"
      ? "gap-4 px-2.5 pb-28 pt-3 sm:gap-5 sm:px-4 sm:pb-32 sm:pt-4 lg:gap-5 lg:px-6 lg:pb-36 lg:pt-5 xl:gap-6 xl:px-8 xl:pb-40 xl:pt-6"
      : "gap-4 px-2.5 pb-28 pt-3 sm:gap-5 sm:px-4 sm:pb-32 sm:pt-4 lg:gap-5 lg:px-6 lg:pb-36 lg:pt-5 xl:gap-6 xl:px-7 xl:pb-40 xl:pt-6";

  return (
    <div
      data-section={section}
      data-theme={isDarkMode ? "dark" : "light"}
      data-category-accent={liveCategoryAccent}
      className={`relative min-h-screen w-full transition-colors duration-300 ${
        isDarkMode
          ? "bg-transparent text-white"
          : "bg-transparent text-zinc-950"
      }`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-[340px] transition-opacity duration-300 ${accentLayers.glow}`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${accentLayers.line}`}
      />

      <div
        className={`relative mx-auto flex w-full flex-col ${contentWidthClass} ${contentSpacingClass}`}
      >
        <div
          className={`relative overflow-hidden rounded-[30px] border transition-[border-color,background,box-shadow] duration-300 ${accentLayers.edgeGlow} ${
            isDarkMode
              ? `bg-[linear-gradient(180deg,rgba(17,24,39,0.8)_0%,rgba(10,15,24,0.74)_100%)] backdrop-blur-xl ${accentLayers.ring}`
              : `bg-[linear-gradient(180deg,rgba(255,255,255,0.93)_0%,rgba(248,250,252,0.9)_100%)] backdrop-blur-xl ${accentLayers.ring}`
          }`}
        >
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 ${
              isDarkMode
                ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,transparent_18%,transparent_82%,rgba(255,255,255,0.02)_100%)]"
                : "bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,transparent_16%,transparent_84%,rgba(255,255,255,0.24)_100%)]"
            }`}
          />

          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 ${
              isDarkMode
                ? "bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] opacity-35 [mask-image:radial-gradient(circle_at_center,black,transparent_88%)]"
                : "bg-[linear-gradient(rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_88%)]"
            }`}
          />

          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 top-0 h-[140px] transition-opacity duration-300 ${
              isDarkMode ? "opacity-100" : "opacity-80"
            } ${accentLayers.glow}`}
          />

          <div className="relative z-[1] p-3 sm:p-4 lg:p-5 xl:p-6">
            {children}
          </div>
        </div>

        <AppSponsorsStrip isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}