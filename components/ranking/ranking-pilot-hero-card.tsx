"use client";

import React from "react";
import { ArrowLeft, Share2, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PodiumBadge from "@/components/ui/podium-badge";
import type { CategoryTheme } from "@/lib/ranking/theme-utils";
import type { RankingItem } from "@/types/ranking";

type RankingPilotHeroCardProps = {
  isDarkMode: boolean;
  theme: CategoryTheme;
  category: string;
  categoryColors: Record<string, string>;
  competition: string;
  competitionLabels: Record<string, string>;
  handleBackToRanking: () => void;
  handleSharePilotCard: () => void;
  isSharingPilotImage: boolean;
  selectedPilot: RankingItem | null;
  selectedPilotShortName: string;
  selectedPilotWarName: string;
  safeSelectedPilot: RankingItem;
  selectedPilotGap: string;
  selectedPilotAverage: number;
  selectedPilotConsistency: string;
  selectedPilotMomentum: string;
  selectedPilotBestAttribute: { label: string; value: number };
  PilotPhotoSlot: React.ComponentType<{
    pilot?: RankingItem | null;
    alt: string;
    isDark?: boolean;
  }>;
};

export default function RankingPilotHeroCard({
  isDarkMode,
  theme,
  category,
  categoryColors,
  competition,
  competitionLabels,
  handleBackToRanking,
  handleSharePilotCard,
  isSharingPilotImage,
  selectedPilot,
  selectedPilotShortName,
  selectedPilotWarName,
  safeSelectedPilot,
  selectedPilotGap,
  selectedPilotAverage,
  selectedPilotConsistency,
  selectedPilotMomentum,
  selectedPilotBestAttribute,
  PilotPhotoSlot,
}: RankingPilotHeroCardProps) {
  return (
    <Card
      className={`overflow-hidden rounded-[22px] shadow-sm ${
        isDarkMode
          ? `border ${theme.darkAccentBorder} bg-gradient-to-br ${theme.darkAccentCard}`
          : `${theme.primaryBorder} bg-gradient-to-br ${theme.shellGlow}`
      }`}
    >
      <CardContent className="p-0">
        <div className="relative">
          <div
            className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent ${theme.primaryRing} to-transparent`}
          />

          <div className="p-3">
            <div
              className={`rounded-[24px] p-3 shadow-[0_10px_24px_rgba(15,23,42,0.06)] ${
                isDarkMode
                  ? "border border-white/10 bg-[#0f172a]"
                  : "border border-black/5 bg-white"
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={handleBackToRanking}
                  className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition ${
                    isDarkMode
                      ? `border ${theme.darkAccentBorder} ${theme.darkAccentBg} text-zinc-100 hover:opacity-90`
                      : "border border-black/5 bg-zinc-50 text-zinc-800 hover:bg-zinc-100"
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </button>

                <div className="flex flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleSharePilotCard}
                    disabled={isSharingPilotImage}
                    className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition disabled:opacity-50 ${
                      isDarkMode
                        ? `border ${theme.darkAccentBorder} ${theme.darkAccentBg} text-zinc-100 hover:opacity-90`
                        : "border border-black/5 bg-zinc-50 text-zinc-800 hover:bg-zinc-100"
                    }`}
                  >
                    <Share2 className="h-4 w-4" />
                    {isSharingPilotImage ? "Gerando..." : "Compartilhar piloto"}
                  </button>

                  <Badge
                    variant="outline"
                    className={
                      isDarkMode
                        ? `${theme.darkAccentBorder} ${theme.darkAccentBg} text-zinc-200`
                        : categoryColors[category] || "border-black/10 text-zinc-700"
                    }
                  >
                    {category}
                  </Badge>

                  <Badge
                    variant="outline"
                    className={
                      isDarkMode
                        ? "border-white/10 bg-white/5 text-zinc-200"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700"
                    }
                  >
                    {competitionLabels[competition] || competition}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(255px,39%)_1fr] md:gap-5 lg:grid-cols-[minmax(420px,45%)_1fr] lg:gap-7 xl:grid-cols-[minmax(510px,48%)_1fr] xl:gap-8">
                {/* Premium photo frame: blurred backdrop + metallic ring + motion streaks */}
                <div className="relative mx-auto w-full max-w-[340px] md:mx-0 md:max-w-none">
                  {/* Blurred backdrop of same photo — fills column edges with motion blur feel */}
                  <div className="pointer-events-none absolute -inset-4 overflow-hidden rounded-[36px] opacity-70 lg:-inset-6 lg:rounded-[48px]">
                    <div className="absolute inset-0 scale-[1.6] blur-3xl saturate-[1.2]">
                      <PilotPhotoSlot pilot={selectedPilot} alt="" isDark={isDarkMode} />
                    </div>
                    <div
                      className={`absolute inset-0 ${
                        isDarkMode
                          ? "bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,7,10,0.72)_80%)]"
                          : "bg-[radial-gradient(circle_at_center,transparent_0%,rgba(248,250,252,0.78)_80%)]"
                      }`}
                    />
                  </div>

                  {/* Motion-blur streaks (horizontal) — racing feel, scale up on desktop */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute top-1/2 -left-6 h-12 w-6 -translate-y-1/2 rounded-full blur-md lg:-left-10 lg:h-24 lg:w-10 lg:blur-xl ${
                      isDarkMode
                        ? `${theme.darkAccentBgSoft} opacity-60`
                        : `${theme.primaryIconWrap} opacity-70`
                    }`}
                  />
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute top-1/3 -right-5 h-10 w-4 rounded-full blur-md lg:-right-9 lg:h-20 lg:w-8 lg:blur-xl ${
                      isDarkMode
                        ? `${theme.darkAccentBgSoft} opacity-50`
                        : `${theme.primaryIconWrap} opacity-60`
                    }`}
                  />

                  {/* Secondary streak (bottom, desktop-only) for extra speed feel */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute bottom-6 -left-8 hidden h-6 w-16 rounded-full blur-xl lg:block ${
                      isDarkMode
                        ? `${theme.darkAccentBgSoft} opacity-40`
                        : `${theme.primaryIconWrap} opacity-50`
                    }`}
                  />

                  {/* Photo frame with metallic chrome ring — thicker on desktop */}
                  <div
                    className="relative overflow-hidden rounded-[28px] p-[2px] shadow-[0_20px_40px_rgba(0,0,0,0.35)] lg:rounded-[36px] lg:p-[3px] lg:shadow-[0_28px_58px_rgba(0,0,0,0.4)]"
                    style={{
                      background: isDarkMode
                        ? "linear-gradient(145deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.22) 65%, rgba(255,255,255,0.04) 100%)"
                        : "linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(212,212,216,0.6) 35%, rgba(255,255,255,0.95) 65%, rgba(212,212,216,0.6) 100%)",
                    }}
                  >
                    <div
                      className={`relative overflow-hidden rounded-[26px] lg:rounded-[33px] ${
                        isDarkMode ? "bg-[#0f172a]" : "bg-zinc-50"
                      }`}
                    >
                      <div
                        className={`pointer-events-none absolute inset-x-8 top-0 z-10 h-[2px] bg-gradient-to-r from-transparent ${theme.primaryRing} to-transparent lg:inset-x-12 lg:h-[3px]`}
                      />

                      <div className="relative aspect-square w-full">
                        <PilotPhotoSlot
                          pilot={selectedPilot}
                          alt={selectedPilotShortName}
                          isDark={isDarkMode}
                        />

                        {/* Bottom gradient fade to pedestal */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/82 via-black/20 to-transparent" />

                        {/* Top-left: metallic podium badge for position */}
                        <div className="absolute top-3 left-3 flex flex-col items-start gap-2 lg:top-5 lg:left-5 lg:gap-3">
                          <PodiumBadge position={safeSelectedPilot.pos} size="lg" />
                          <div
                            className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.16em] uppercase shadow-sm backdrop-blur-md lg:px-4 lg:py-1.5 lg:text-[12px] ${
                              isDarkMode
                                ? `${theme.darkAccentBorder} bg-black/45 ${theme.darkAccentText}`
                                : categoryColors[category] ||
                                  "border-black/10 bg-white/90 text-zinc-700"
                            }`}
                          >
                            {category}
                          </div>
                        </div>

                        {/* Bottom: name + war name pedestal */}
                        <div className="absolute inset-x-0 bottom-0 p-3 lg:p-5">
                          <div
                            className={`rounded-[20px] border px-3 py-3 backdrop-blur-xl lg:rounded-[24px] lg:px-5 lg:py-4 ${
                              isDarkMode
                                ? "border-white/10 bg-black/40"
                                : "border-white/70 bg-white/75"
                            }`}
                          >
                            <p
                              className={`truncate text-[16px] leading-none font-bold tracking-tight lg:text-[22px] ${
                                isDarkMode ? "text-white" : "text-zinc-950"
                              }`}
                            >
                              {selectedPilotShortName}
                            </p>

                            {selectedPilotWarName ? (
                              <p
                                className={`mt-1 truncate text-[11px] font-semibold italic lg:mt-2 lg:text-[14px] ${
                                  isDarkMode ? "text-zinc-300" : "text-zinc-600"
                                }`}
                              >
                                {selectedPilotWarName}
                              </p>
                            ) : null}

                            <div className="mt-2 flex items-center justify-between gap-2 lg:mt-3">
                              <span
                                className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] uppercase lg:px-3 lg:py-1.5 lg:text-[10px] ${
                                  isDarkMode
                                    ? "border-white/10 bg-white/5 text-zinc-300"
                                    : "border-black/5 bg-white/80 text-zinc-700"
                                }`}
                              >
                                piloto oficial
                              </span>

                              <span
                                className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] uppercase lg:px-3 lg:py-1.5 lg:text-[10px] ${
                                  isDarkMode
                                    ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                                    : theme.heroChip
                                }`}
                              >
                                {competitionLabels[competition] || competition}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <p
                    className={`text-[11px] font-bold tracking-[0.18em] uppercase ${
                      isDarkMode ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    Perfil premium do piloto
                  </p>

                  <h2
                    className={`mt-2 text-[30px] leading-[1.02] font-black tracking-tight break-words ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    {selectedPilotShortName}
                  </h2>

                  {selectedPilotWarName ? (
                    <div className="mt-3">
                      <span
                        className={`inline-flex max-w-full rounded-full border px-3 py-1.5 text-[11px] font-semibold break-words italic ${
                          isDarkMode
                            ? `${theme.darkAccentBorder} ${theme.darkAccentBg} text-zinc-300`
                            : theme.heroChip
                        }`}
                      >
                        {selectedPilotWarName}
                      </span>
                    </div>
                  ) : null}

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div
                      className={`rounded-[16px] border px-2.5 py-2.5 ${
                        isDarkMode
                          ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}`
                          : `${theme.heroBorder} bg-gradient-to-b ${theme.heroBg}`
                      }`}
                    >
                      <p
                        className={`text-[10px] font-bold tracking-[0.14em] uppercase ${isDarkMode ? "text-zinc-500" : "text-zinc-500"}`}
                      >
                        Posição atual
                      </p>
                      <p
                        className={`mt-1 text-[24px] leading-none font-black tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}
                      >
                        {safeSelectedPilot.pos}º
                      </p>
                      <p
                        className={`mt-1 text-[11px] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}
                      >
                        {selectedPilotGap}
                      </p>
                    </div>

                    <div
                      className={`rounded-[16px] border px-2.5 py-2.5 ${
                        isDarkMode
                          ? `${theme.darkAccentBorder} bg-[#111827]`
                          : "border-black/5 bg-zinc-50/80"
                      }`}
                    >
                      <p
                        className={`text-[10px] font-bold tracking-[0.14em] uppercase ${isDarkMode ? "text-zinc-500" : "text-zinc-500"}`}
                      >
                        Pontuação oficial
                      </p>
                      <p
                        className={`mt-1 text-[24px] leading-none font-black tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}
                      >
                        {safeSelectedPilot.pontos}
                        <span
                          className={`ml-1 text-[14px] font-bold ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}
                        >
                          pts
                        </span>
                      </p>
                      <p
                        className={`mt-1 text-[11px] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}
                      >
                        média {selectedPilotAverage.toFixed(1)} por participação
                      </p>
                    </div>
                  </div>

                  <div
                    className={`mt-3 rounded-[20px] border p-3 ${
                      isDarkMode
                        ? `${theme.darkAccentBorder} bg-gradient-to-r from-[#111827] to-[#161e2b]`
                        : `${theme.heroBorder} bg-gradient-to-r ${theme.heroBg}`
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[10px] font-bold tracking-[0.16em] uppercase ${isDarkMode ? "text-zinc-500" : "text-zinc-500"}`}
                        >
                          Análise oficial
                        </p>
                        <p
                          className={`mt-1 text-[20px] leading-tight font-bold ${isDarkMode ? "text-white" : "text-zinc-950"}`}
                        >
                          {selectedPilotConsistency}
                        </p>
                        <p
                          className={`mt-2 text-[12px] leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}
                        >
                          Momento: <span className="font-semibold">{selectedPilotMomentum}</span> ·
                          melhor fundamento atual em{" "}
                          <span className="font-semibold">
                            {selectedPilotBestAttribute.label.toLowerCase()}
                          </span>{" "}
                          ({selectedPilotBestAttribute.value}).
                        </p>
                      </div>

                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                          isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                        }`}
                      >
                        <User
                          className={`h-5 w-5 ${
                            isDarkMode ? theme.darkAccentText : theme.primaryIcon
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
