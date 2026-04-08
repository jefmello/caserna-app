"use client";

import { useEffect } from "react";
import {
  ChampionshipProvider,
  useChampionship,
} from "@/context/championship-context";
import AppSidebar from "./app-sidebar";

type ThemeMode = "dark" | "light";

const DARK_BACKGROUND = "#05070a";
const LIGHT_BACKGROUND = "#f3f4f6";
const DARK_TEXT = "#ffffff";
const LIGHT_TEXT = "#18181b";

function resolveThemeModeFromEnvironment(): ThemeMode {
  if (typeof window === "undefined") return "dark";

  const storedTheme = window.localStorage.getItem("caserna-theme");
  const rootHasDark = document.documentElement.classList.contains("dark");
  const bodyHasDark = document.body.classList.contains("dark");

  if (storedTheme === "light") return "light";
  if (storedTheme === "dark") return "dark";
  if (rootHasDark || bodyHasDark) return "dark";

  return "light";
}

function applyThemeToDocument(themeMode: ThemeMode) {
  if (typeof window === "undefined") return;

  const isDarkMode = themeMode === "dark";

  document.documentElement.classList.toggle("dark", isDarkMode);
  document.body.classList.toggle("dark", isDarkMode);

  document.documentElement.dataset.theme = themeMode;
  document.body.dataset.theme = themeMode;

  document.documentElement.style.backgroundColor = isDarkMode
    ? DARK_BACKGROUND
    : LIGHT_BACKGROUND;
  document.body.style.backgroundColor = isDarkMode
    ? DARK_BACKGROUND
    : LIGHT_BACKGROUND;

  document.documentElement.style.colorScheme = isDarkMode ? "dark" : "light";
  document.body.style.color = isDarkMode ? DARK_TEXT : LIGHT_TEXT;
}

function AppMainLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { themeMode, isDarkMode, setThemeMode } = useChampionship();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncThemeFromEnvironment = () => {
      const resolvedTheme = resolveThemeModeFromEnvironment();
      setThemeMode(resolvedTheme);
    };

    syncThemeFromEnvironment();

    const rootObserver = new MutationObserver(() => {
      const resolvedTheme = resolveThemeModeFromEnvironment();
      if (resolvedTheme !== themeMode) {
        setThemeMode(resolvedTheme);
      }
    });

    const bodyObserver = new MutationObserver(() => {
      const resolvedTheme = resolveThemeModeFromEnvironment();
      if (resolvedTheme !== themeMode) {
        setThemeMode(resolvedTheme);
      }
    });

    rootObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const handleStorage = () => {
      const resolvedTheme = resolveThemeModeFromEnvironment();
      setThemeMode(resolvedTheme);
    };

    const handleVisibilityChange = () => {
      const resolvedTheme = resolveThemeModeFromEnvironment();
      setThemeMode(resolvedTheme);
    };

    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      rootObserver.disconnect();
      bodyObserver.disconnect();
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [setThemeMode, themeMode]);

  useEffect(() => {
    applyThemeToDocument(themeMode);
  }, [themeMode]);

  return (
    <div
      data-theme={themeMode}
      className={`relative min-h-screen w-full overflow-x-clip transition-colors duration-300 ${
        isDarkMode
          ? "bg-[#05070a] text-white"
          : "bg-[#f3f4f6] text-zinc-900"
      }`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 transition-opacity duration-300 ${
          isDarkMode ? "opacity-100" : "opacity-0"
        } bg-[linear-gradient(180deg,#040609_0%,#070b11_22%,#0a1017_48%,#070b11_76%,#05070a_100%)]`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 transition-opacity duration-300 ${
          isDarkMode ? "opacity-100" : "opacity-0"
        } bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.045),transparent_24%),radial-gradient(circle_at_18%_20%,rgba(249,115,22,0.06),transparent_18%),radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_22%),radial-gradient(circle_at_82%_16%,rgba(250,204,21,0.055),transparent_20%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.02),transparent_30%)]`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 transition-opacity duration-300 ${
          isDarkMode ? "opacity-100" : "opacity-0"
        } bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(circle_at_center,black,transparent_88%)]`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 transition-opacity duration-300 ${
          isDarkMode ? "opacity-0" : "opacity-100"
        } bg-[linear-gradient(180deg,#f8fafc_0%,#f3f4f6_38%,#eef2f7_100%)]`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 transition-opacity duration-300 ${
          isDarkMode ? "opacity-0" : "opacity-100"
        } bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.05),transparent_28%),radial-gradient(circle_at_18%_18%,rgba(249,115,22,0.08),transparent_18%),radial-gradient(circle_at_82%_16%,rgba(250,204,21,0.085),transparent_20%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.06),transparent_24%)]`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 transition-opacity duration-300 ${
          isDarkMode ? "opacity-0" : "opacity-100"
        } bg-[linear-gradient(rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(circle_at_center,black,transparent_88%)]`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 transition-opacity duration-300 ${
          isDarkMode ? "opacity-100" : "opacity-40"
        } bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.02),transparent_42%)]`}
      />

      <AppSidebar />

      <main className="relative z-[1] min-h-screen w-full lg:pl-[288px]">
        {children}
      </main>
    </div>
  );
}

export default function AppMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChampionshipProvider>
      <AppMainLayoutContent>{children}</AppMainLayoutContent>
    </ChampionshipProvider>
  );
}