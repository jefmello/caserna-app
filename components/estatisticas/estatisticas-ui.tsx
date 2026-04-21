"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getCategoryTheme,
  getPilotFirstAndLastName,
  getPilotWarNameDisplay,
} from "@/lib/ranking/ranking-utils";
import type { RankingItem } from "@/types/ranking";

function resolveCategoryTheme(categoryTheme: unknown): ReturnType<typeof getCategoryTheme> {
  if (categoryTheme && typeof categoryTheme === "object") {
    return categoryTheme as ReturnType<typeof getCategoryTheme>;
  }
  return getCategoryTheme("Base");
}

export function CompactStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = false,
  isDark = false,
  categoryTheme,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  accent?: boolean;
  isDark?: boolean;
  categoryTheme: unknown;
}) {
  const resolvedCategoryTheme = resolveCategoryTheme(categoryTheme);

  return (
    <Card
      className={`rounded-[18px] border shadow-none transition-all duration-200 hover:-translate-y-[1px] ${
        isDark
          ? accent
            ? `${resolvedCategoryTheme.darkAccentBorder} ${resolvedCategoryTheme.darkAccentBgSoft}`
            : "border-white/10 bg-[#111827]"
          : accent
            ? "border-yellow-300/80 bg-yellow-50/70"
            : "border-black/5 bg-white"
      }`}
    >
      <CardContent className="p-3">
        <div className="mb-1.5 flex items-center justify-between gap-1.5">
          <p
            className={`text-[10px] font-semibold tracking-[0.14em] uppercase ${
              isDark ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            {title}
          </p>
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-2xl ${
              isDark
                ? accent
                  ? resolvedCategoryTheme.darkAccentIconWrap
                  : "bg-white/5"
                : accent
                  ? "bg-yellow-100"
                  : "bg-zinc-100"
            }`}
          >
            <Icon
              className={`h-3.5 w-3.5 ${
                isDark
                  ? accent
                    ? resolvedCategoryTheme.darkAccentText
                    : "text-zinc-300"
                  : accent
                    ? "text-yellow-700"
                    : "text-zinc-600"
              }`}
            />
          </div>
        </div>

        <p
          className={`text-[22px] leading-none font-bold tracking-tight tabular-nums ${
            isDark ? "text-white" : "text-zinc-950"
          }`}
        >
          {value}
        </p>

        <p
          className={`mt-1 text-[12px] leading-snug ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
        >
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
}

export function HighlightCard({
  title,
  icon: Icon,
  children,
  accent = false,
  accentStyles,
  compact = false,
  isDark = false,
  categoryTheme,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  accent?: boolean;
  accentStyles?: {
    border: string;
    bg: string;
    iconWrap: string;
    icon: string;
    text: string;
    divider: string;
  };
  compact?: boolean;
  isDark?: boolean;
  categoryTheme: unknown;
}) {
  const resolvedCategoryTheme = resolveCategoryTheme(categoryTheme);
  const defaultAccent = {
    border: "border-yellow-300",
    bg: "bg-gradient-to-b from-yellow-50 to-white",
    iconWrap: "bg-yellow-100",
    icon: "text-yellow-700",
    text: "text-yellow-800",
    divider: "bg-yellow-200/80",
  };

  const appliedAccent = accentStyles || defaultAccent;

  return (
    <Card
      className={`rounded-[22px] border shadow-none transition-all duration-200 hover:-translate-y-[1px] ${
        compact ? "h-[144px]" : "h-auto min-h-[168px]"
      } ${
        isDark
          ? accent
            ? `${resolvedCategoryTheme.darkAccentBorder} bg-gradient-to-b ${resolvedCategoryTheme.darkAccentCard}`
            : "border-white/10 bg-[#111827]"
          : accent
            ? `${appliedAccent.border} ${appliedAccent.bg}`
            : "border-black/5 bg-white"
      }`}
    >
      <CardContent
        className={`${compact ? "flex h-full flex-col" : "flex flex-col"} ${
          compact ? "px-2.5 pt-2 pb-2.5" : "px-3 pt-2 pb-3"
        }`}
      >
        <div className="mb-0.5 flex items-start justify-between gap-1.5">
          <p
            className={`w-full text-center leading-none font-bold uppercase ${
              compact ? "text-[10px] tracking-[0.16em]" : "text-[12px] tracking-[0.18em]"
            } ${
              isDark
                ? accent
                  ? resolvedCategoryTheme.darkAccentText
                  : "text-zinc-400"
                : accent
                  ? appliedAccent.text
                  : "text-zinc-500"
            }`}
          >
            {title}
          </p>

          <div
            className={`-mt-1 flex shrink-0 items-center justify-center rounded-xl ${
              compact ? "h-5 w-5" : "h-6 w-6"
            } ${
              isDark
                ? accent
                  ? resolvedCategoryTheme.darkAccentIconWrap
                  : "bg-white/5"
                : accent
                  ? appliedAccent.iconWrap
                  : "bg-zinc-100"
            }`}
          >
            <Icon
              className={`${compact ? "h-2.5 w-2.5" : "h-3 w-3"} ${
                isDark
                  ? accent
                    ? resolvedCategoryTheme.darkAccentText
                    : "text-zinc-300"
                  : accent
                    ? appliedAccent.icon
                    : "text-zinc-600"
              }`}
            />
          </div>
        </div>

        <div
          className={`mb-1 h-px w-full ${
            isDark
              ? accent
                ? resolvedCategoryTheme.darkAccentDivider
                : "bg-white/10"
              : accent
                ? appliedAccent.divider
                : "bg-zinc-100"
          }`}
        />

        <div className="flex-1 pt-0.5">{children}</div>
      </CardContent>
    </Card>
  );
}

export function StatRankingCard({
  title,
  icon: Icon,
  items,
  metricKey,
  emptyLabel,
  theme,
  isDark = false,
  onSelectPilot,
}: {
  title: string;
  icon: React.ElementType;
  items: RankingItem[];
  metricKey: "vitorias" | "poles" | "mv" | "podios";
  emptyLabel: string;
  theme: ReturnType<typeof getCategoryTheme>;
  isDark?: boolean;
  onSelectPilot: (pilot: RankingItem) => void;
}) {
  return (
    <Card
      className={`overflow-hidden rounded-[22px] shadow-sm transition-all duration-200 hover:-translate-y-[1px] ${
        isDark ? "border-white/10 bg-[#111827]" : "border-black/5 bg-white"
      }`}
    >
      <CardHeader
        className={`pb-2.5 ${
          isDark
            ? "border-b border-white/10 bg-gradient-to-r from-[#111827] via-[#161e2b] to-[#111827]"
            : "border-b border-black/5 bg-gradient-to-r from-white via-zinc-50/70 to-white"
        }`}
      >
        <CardTitle
          className={`flex items-center gap-1.5 text-sm font-bold ${
            isDark ? "text-white" : "text-zinc-950"
          }`}
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-[18px] ${
              isDark ? theme.darkAccentIconWrap : theme.statsIconWrap
            }`}
          >
            <Icon className={`h-4 w-4 ${isDark ? theme.darkAccentText : theme.statsIcon}`} />
          </div>
          <div>
            <p
              className={`text-[9px] font-bold tracking-[0.14em] uppercase ${
                isDark ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Ranking estatístico
            </p>
            <p
              className={`text-[14px] font-extrabold tracking-[0.01em] ${
                isDark ? "text-white" : "text-zinc-950"
              }`}
            >
              {title}
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-3">
        {items.length === 0 ? (
          <div
            className={`rounded-2xl px-3 py-5 text-center text-sm ${
              isDark
                ? "border border-dashed border-white/10 bg-[#0f172a] text-zinc-400"
                : "border border-dashed border-black/10 bg-zinc-50 text-zinc-500"
            }`}
          >
            {emptyLabel}
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => {
              const value = item[metricKey];
              const isFirst = index === 0;

              return (
                <button
                  key={`${title}-${item.pilotoId}-${index}`}
                  type="button"
                  onClick={() => onSelectPilot(item)}
                  title="Abrir piloto"
                  className={`flex w-full items-center justify-between gap-2.5 rounded-[18px] border px-2.5 py-2.5 text-left transition-all duration-200 ${
                    isDark
                      ? isFirst
                        ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft} hover:brightness-110`
                        : "border-white/10 bg-[#0f172a] hover:border-white/20 hover:bg-[#162033]"
                      : isFirst
                        ? `${theme.statAccentBg} hover:brightness-[0.98]`
                        : "border-black/5 bg-zinc-50/70 hover:bg-white"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[18px] text-[12px] font-semibold ${
                        isDark
                          ? isFirst
                            ? theme.darkTopBadge
                            : "bg-white/10 text-zinc-200"
                          : isFirst
                            ? theme.statAccentRank
                            : "bg-zinc-200 text-zinc-800"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`truncate text-[14px] font-semibold tracking-tight ${
                          isDark ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        {getPilotFirstAndLastName(item.piloto)}
                      </p>

                      {getPilotWarNameDisplay(item) ? (
                        <p
                          className={`mt-0.5 truncate text-[10px] italic ${
                            isDark ? "text-zinc-400" : "text-zinc-500"
                          }`}
                        >
                          {getPilotWarNameDisplay(item)}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div
                    className={`shrink-0 rounded-2xl px-3 py-1.5 text-sm font-semibold ${
                      isDark
                        ? isFirst
                          ? `${theme.darkAccentBg} ${theme.darkAccentText}`
                          : "bg-white/5 text-zinc-200"
                        : isFirst
                          ? `${theme.primaryBadge}`
                          : "bg-white text-zinc-800"
                    }`}
                  >
                    <span>{value}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function StatRankingCardConnected({
  title,
  icon,
  items,
  metricKey,
  emptyLabel,
  theme,
  isDark,
}: {
  title: string;
  icon: React.ElementType;
  items: RankingItem[];
  metricKey: "vitorias" | "poles" | "mv" | "podios";
  emptyLabel: string;
  theme: ReturnType<typeof getCategoryTheme>;
  isDark?: boolean;
}) {
  const router = useRouter();

  const handleSelectPilot = useCallback(
    (pilot: RankingItem) => {
      const pilotId = pilot.pilotoId || "";
      router.push(pilotId ? `/pilotos?pilotId=${pilotId}` : "/pilotos");
    },
    [router]
  );

  return (
    <StatRankingCard
      title={title}
      icon={icon}
      items={items}
      metricKey={metricKey}
      emptyLabel={emptyLabel}
      theme={theme}
      isDark={isDark}
      onSelectPilot={handleSelectPilot}
    />
  );
}
