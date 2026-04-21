"use client";

import React from "react";
import { Trophy, Crown, Medal, Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type LeaderLike = {
  piloto?: string;
  nomeGuerra?: string;
  pontos?: number;
  vitorias?: number;
  podios?: number;
  mv?: number;
};

type LeaderName = {
  firstName: string;
  lastName: string;
};

type ThemeLike = {
  darkAccentCard: string;
  primaryBorder: string;
  shellGlow: string;
  darkAccentBorder: string;
  heroBorder: string;
  heroBg: string;
  darkAccentIconWrap: string;
  primaryIconWrap: string;
  darkAccentText: string;
  primaryIcon: string;
};

type SpotlightStylesLike = {
  leftCard: string;
  leftSubcard: string;
  badge: string;
  statCard: string;
  label: string;
  iconBubble: string;
};

type PilotPhotoSlotProps = {
  pilot?: LeaderLike | null;
  alt: string;
  isDark?: boolean;
};

export default function RankingSpotlight({
  isDarkMode,
  theme,
  spotlightStyles,
  leader,
  leaderName,
  PilotPhotoSlot,
  getPilotHighlightName,
  getPilotWarName,
}: {
  isDarkMode: boolean;
  theme: ThemeLike;
  spotlightStyles: SpotlightStylesLike;
  leader?: LeaderLike | null;
  leaderName: LeaderName;
  PilotPhotoSlot: React.ComponentType<PilotPhotoSlotProps>;
  getPilotHighlightName: (name?: string) => string;
  getPilotWarName: (pilot?: LeaderLike | null) => string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-[24px] border px-3 py-3 shadow-sm ${
        isDarkMode
          ? "border-white/8 bg-[linear-gradient(180deg,#0b0f16_0%,#0f172a_100%)]"
          : `${theme.primaryBorder} bg-gradient-to-br ${theme.shellGlow}`
      }`}
    >
      <div
        className={`mb-3 rounded-[18px] border px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${
          isDarkMode
            ? `${theme.darkAccentBorder} bg-[linear-gradient(180deg,#111827_0%,#0f172a_100%)]`
            : `${theme.heroBorder} bg-gradient-to-b ${theme.heroBg}`
        }`}
      >
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] shadow-sm ${
                isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
              }`}
            >
              <Trophy
                className={`h-5.5 w-5.5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`}
              />
            </div>

            <div className="flex flex-col justify-center">
              <p
                className={`text-[20px] leading-none font-black tracking-[0.14em] uppercase ${
                  isDarkMode ? "text-white" : "text-zinc-950"
                }`}
              >
                PILOTO DESTAQUE
              </p>
              <p
                className={`mt-1 text-[8.5px] font-semibold tracking-[0.08em] whitespace-nowrap uppercase sm:text-[9px] ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                LÍDER DA CATEGORIA E CAMPEONATO SELECIONADO
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex min-h-[288px] flex-col gap-2.5">
          <Card
            className={`h-[162px] overflow-hidden rounded-[24px] shadow-none ${
              isDarkMode
                ? "border border-white/8 bg-[linear-gradient(180deg,#111827_0%,#0f172a_100%)]"
                : spotlightStyles.leftCard
            }`}
          >
            <CardContent className="h-full p-0">
              <div className="relative h-full w-full overflow-hidden">
                <PilotPhotoSlot
                  pilot={leader}
                  alt={getPilotHighlightName(leader?.piloto)}
                  isDark={isDarkMode}
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/38 via-black/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-2 z-20 px-3">
                  <div
                    className={`mx-auto flex max-w-[74%] items-center justify-center rounded-[15px] border px-2.5 py-1.5 backdrop-blur-md ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} bg-[#111827]/88 ${theme.darkAccentText}`
                        : spotlightStyles.badge
                    }`}
                  >
                    <p className="truncate text-[9.5px] font-black tracking-[0.12em] whitespace-nowrap uppercase">
                      {getPilotWarName(leader)
                        ? getPilotWarName(leader).toUpperCase()
                        : getPilotHighlightName(leader?.piloto)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`h-[123px] overflow-hidden rounded-[24px] shadow-none ${
              isDarkMode
                ? "border border-white/8 bg-[linear-gradient(180deg,#111827_0%,#0f172a_100%)]"
                : spotlightStyles.leftSubcard
            }`}
          >
            <CardContent className="flex h-full items-center justify-center px-3 py-2.5">
              <div className="flex h-full w-full flex-col items-center justify-center text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <p
                    className={`text-[8px] font-bold tracking-[0.22em] uppercase ${
                      isDarkMode ? "text-zinc-400" : spotlightStyles.label
                    }`}
                  >
                    Líder
                  </p>
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[12px] ${
                      isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                    }`}
                  >
                    <Crown
                      className={`h-3.5 w-3.5 ${
                        isDarkMode ? theme.darkAccentText : theme.primaryIcon
                      }`}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center leading-none">
                  <p
                    className={`text-[18px] font-black tracking-tight ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    {leaderName.firstName.toUpperCase()}
                  </p>
                  <p
                    className={`mt-1 text-[10.5px] font-semibold tracking-[0.08em] ${
                      isDarkMode ? "text-zinc-300" : "text-zinc-800"
                    }`}
                  >
                    {leaderName.lastName ? leaderName.lastName.toUpperCase() : ""}
                  </p>
                </div>

                <div className="mt-3 flex justify-center">
                  <div
                    className={`inline-flex items-center rounded-full border px-4 py-1.5 ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} bg-[#111827] ${theme.darkAccentText}`
                        : spotlightStyles.badge
                    }`}
                  >
                    <p className="text-[10.5px] leading-none font-black">
                      {leader?.pontos || 0} pontos
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex min-h-[288px] flex-col gap-2">
          {[
            {
              title: "Vitórias",
              value: leader?.vitorias || 0,
              subtitle: "ataque vencedor",
              icon: Medal,
            },
            {
              title: "Pódios",
              value: leader?.podios || 0,
              subtitle: "presença top 6",
              icon: Trophy,
            },
            {
              title: "VMR",
              value: leader?.mv || 0,
              subtitle: "ritmo mais rápido",
              icon: Timer,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className={`h-[92px] overflow-hidden rounded-[22px] shadow-none ${
                  isDarkMode
                    ? "border border-white/8 bg-[linear-gradient(180deg,#111827_0%,#0f172a_100%)]"
                    : spotlightStyles.statCard
                }`}
              >
                <CardContent className="relative h-full p-3">
                  <div className="flex h-full items-center justify-between gap-2">
                    <div className="flex w-[40%] min-w-0 flex-col items-center justify-center text-center">
                      <p
                        className={`text-[10px] font-bold tracking-[0.18em] uppercase ${
                          isDarkMode ? "text-white/72" : "text-white/92"
                        }`}
                      >
                        {item.title}
                      </p>
                      <p
                        className={`mt-2 text-[30px] leading-none font-black tracking-tight ${
                          isDarkMode ? "text-white" : "text-white"
                        }`}
                      >
                        {item.value}
                      </p>
                    </div>

                    <div className="flex w-[44%] min-w-0 flex-col items-end justify-center gap-2 pr-1">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          isDarkMode
                            ? `${theme.darkAccentIconWrap} ${theme.darkAccentText}`
                            : spotlightStyles.iconBubble
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </div>

                      <p
                        className={`max-w-[82px] text-right text-[8.5px] leading-[1.15] font-semibold tracking-[0.08em] uppercase ${
                          isDarkMode ? "text-white/68" : "text-white/86"
                        }`}
                      >
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
