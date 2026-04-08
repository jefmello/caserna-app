"use client";

import React, { useEffect, useState } from "react";

type AppPageHeaderProps = {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  isDarkMode?: boolean;
};

function getStoredTheme() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("caserna-theme") === "dark";
}

export default function AppPageHeader({
  title,
  subtitle,
  rightElement,
  isDarkMode,
}: AppPageHeaderProps) {
  const [resolvedDarkMode, setResolvedDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const syncTheme = () => {
      setResolvedDarkMode(
        typeof isDarkMode === "boolean" ? isDarkMode : getStoredTheme()
      );
    };

    syncTheme();
    setMounted(true);

    window.addEventListener("storage", syncTheme);
    window.addEventListener("caserna-theme-change", syncTheme as EventListener);

    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener(
        "caserna-theme-change",
        syncTheme as EventListener
      );
    };
  }, [isDarkMode]);

  const dark = !mounted || resolvedDarkMode;

  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h1
          className={`text-[18px] font-extrabold tracking-tight ${
            dark ? "text-white" : "text-zinc-950"
          }`}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className={`mt-1 text-[12px] font-medium ${
              dark ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>

      {rightElement && <div className="shrink-0">{rightElement}</div>}
    </div>
  );
}