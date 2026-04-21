"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useChampionship } from "@/context/championship-context";
import AppSidebar from "./app-sidebar";
import RacingBackground from "@/components/ui/racing-background";

function AppMainLayoutContent({ children }: { children: React.ReactNode }) {
  const { themeMode, isDarkMode } = useChampionship();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isMobileSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileSidebarOpen]);

  return (
    <div
      data-theme={themeMode}
      className={`relative min-h-screen w-full overflow-x-clip transition-colors duration-300 ${
        isDarkMode ? "text-white" : "text-zinc-900"
      }`}
    >
      {/* Animated racing background (fixed, behind all content) */}
      <RacingBackground opacity={isDarkMode ? 0.9 : 0.5} />

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
        } bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] [mask-image:radial-gradient(circle_at_center,black,transparent_88%)] bg-[size:24px_24px]`}
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
        } bg-[linear-gradient(rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.02)_1px,transparent_1px)] [mask-image:radial-gradient(circle_at_center,black,transparent_88%)] bg-[size:24px_24px]`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 transition-opacity duration-300 ${
          isDarkMode ? "opacity-100" : "opacity-40"
        } bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.02),transparent_42%)]`}
      />

      <button
        type="button"
        onClick={() => setIsMobileSidebarOpen(true)}
        className={`fixed top-3 left-3 z-[70] inline-flex h-11 w-11 items-center justify-center rounded-2xl border shadow-[0_14px_28px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 lg:hidden ${
          isDarkMode
            ? "border-white/10 bg-[#0f172a]/88 text-white hover:bg-[#131c2c]"
            : "border-black/5 bg-white/90 text-zinc-900 hover:bg-white"
        }`}
        aria-label="Abrir menu"
        title="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <AppSidebar
        mobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <main className="relative z-[1] min-h-screen w-full pt-16 lg:pt-0 lg:pl-[288px]">
        {children}
      </main>
    </div>
  );
}

export default function AppMainLayout({ children }: { children: React.ReactNode }) {
  return <AppMainLayoutContent>{children}</AppMainLayoutContent>;
}
