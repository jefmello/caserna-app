"use client";

import React from "react";
import { BarChart3, Swords, TableProperties, User } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

type RankingTabsProps = {
  activeTab: string;
  category: string;
  isDarkMode: boolean;
};

const TAB_ITEMS = [
  {
    value: "classificacao",
    label: "Classificação",
    icon: TableProperties,
  },
  {
    value: "piloto",
    label: "Piloto",
    icon: User,
  },
  {
    value: "comparador",
    label: "Comparar",
    icon: Swords,
  },
  {
    value: "stats",
    label: "Stats",
    icon: BarChart3,
  },
] as const;

export default function RankingTabs({
  activeTab,
  category,
  isDarkMode,
}: RankingTabsProps) {
  return (
    <TabsList className="relative z-10 mb-6 grid h-auto w-full grid-cols-4 gap-2.5 bg-transparent p-0 shadow-none">
      {TAB_ITEMS.map((tabItem) => {
        const Icon = tabItem.icon;
        const isActive = activeTab === tabItem.value;

        const activeGlow =
          category === "Base"
            ? isDarkMode
              ? "shadow-[0_10px_22px_rgba(249,115,22,0.24),0_0_0_1px_rgba(249,115,22,0.28)]"
              : "shadow-[0_10px_22px_rgba(249,115,22,0.18),0_0_0_1px_rgba(249,115,22,0.16)]"
            : category === "Graduados"
              ? isDarkMode
                ? "shadow-[0_10px_22px_rgba(59,130,246,0.24),0_0_0_1px_rgba(59,130,246,0.28)]"
                : "shadow-[0_10px_22px_rgba(59,130,246,0.18),0_0_0_1px_rgba(59,130,246,0.16)]"
              : isDarkMode
                ? "shadow-[0_10px_22px_rgba(234,179,8,0.24),0_0_0_1px_rgba(234,179,8,0.28)]"
                : "shadow-[0_10px_22px_rgba(234,179,8,0.18),0_0_0_1px_rgba(234,179,8,0.16)]";

        const activeSurface =
          category === "Base"
            ? isDarkMode
              ? "border-orange-500/40 bg-gradient-to-b from-orange-500/12 to-[#161e2b] text-white"
              : "border-orange-300 bg-gradient-to-b from-orange-50 to-white text-zinc-950"
            : category === "Graduados"
              ? isDarkMode
                ? "border-blue-500/40 bg-gradient-to-b from-blue-500/12 to-[#161e2b] text-white"
                : "border-blue-300 bg-gradient-to-b from-blue-50 to-white text-zinc-950"
              : isDarkMode
                ? "border-yellow-500/40 bg-gradient-to-b from-yellow-500/12 to-[#161e2b] text-white"
                : "border-yellow-300 bg-gradient-to-b from-yellow-50 to-white text-zinc-950";

        return (
          <TabsTrigger
            key={tabItem.value}
            value={tabItem.value}
            className={`h-[64px] rounded-[18px] px-2 py-1.5 shadow-sm transition-all duration-300 ${
              isActive
                ? `${activeSurface} ${activeGlow} scale-[1.01]`
                : isDarkMode
                  ? "border border-white/10 bg-[#111827] text-zinc-400 hover:border-white/15 hover:bg-[#161e2b]"
                  : "border border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50"
            }`}
          >
            <div className="flex h-full flex-col items-center justify-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-[12px] transition-all duration-300 ${
                  isActive
                    ? category === "Base"
                      ? isDarkMode
                        ? "bg-orange-500/15 text-orange-300"
                        : "bg-orange-100 text-orange-700"
                      : category === "Graduados"
                        ? isDarkMode
                          ? "bg-blue-500/15 text-blue-300"
                          : "bg-blue-100 text-blue-700"
                        : isDarkMode
                          ? "bg-yellow-500/15 text-yellow-300"
                          : "bg-yellow-100 text-yellow-700"
                    : isDarkMode
                      ? "bg-white/5 text-zinc-300"
                      : "bg-zinc-50 text-zinc-500"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <span
                className={`max-w-full text-center font-bold uppercase whitespace-nowrap ${
                  tabItem.value === "classificacao"
                    ? "text-[8px] leading-none tracking-[0.06em]"
                    : "text-[9px] leading-none tracking-[0.1em]"
                }`}
              >
                {tabItem.label}
              </span>
            </div>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}
