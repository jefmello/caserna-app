"use client";

import React from "react";
import { ArrowLeft, Share2, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type RankingPilotHeroCardProps = {
  isDarkMode: boolean;
  theme: any;
  category: string;
  categoryColors: Record<string, string>;
  competition: string;
  competitionLabels: Record<string, string>;
  handleBackToRanking: () => void;
  handleSharePilotCard: () => void;
  isSharingPilotImage: boolean;
  selectedPilot: any;
  selectedPilotShortName: string;
  selectedPilotWarName: string;
  safeSelectedPilot: any;
  selectedPilotGap: string;
  selectedPilotAverage: number;
  selectedPilotConsistency: string;
  selectedPilotMomentum: string;
  selectedPilotBestAttribute: { label: string; value: number };
  PilotPhotoSlot: React.ComponentType<{ pilot?: any; alt: string; isDark?: boolean }>;
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

              <div className="grid grid-cols-1 gap-3 md:grid-cols-[132px_1fr]">
                <div
                  className={`relative overflow-hidden rounded-[24px] shadow-[0_12px_28px_rgba(15,23,42,0.10)] ${
                    isDarkMode
                      ? `border ${theme.darkAccentBorder} bg-[#0f172a]`
                      : `${theme.heroBorder} bg-gradient-to-b ${theme.heroBg}`
                  }`}
                >
                  <div
                    className={`pointer-events-none absolute inset-x-6 top-0 z-10 h-[2px] bg-gradient-to-r from-transparent ${theme.primaryRing} to-transparent`}
                  />

                  <div className="relative w-full aspect-square">
                    <PilotPhotoSlot
                      pilot={selectedPilot}
                      alt={selectedPilotShortName}
                      isDark={isDarkMode}
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/72 via-black/16 to-transparent" />

                    <div className="absolute left-3 top-3 flex items-center gap-2">
                      <div
                        className={`inline-flex h-11 min-w-[54px] items-center justify-center rounded-[16px] border px-3 text-[18px] font-extrabold shadow-lg ${
                          isDarkMode
                            ? `${theme.darkAccentBorder} bg-black/45 text-white backdrop-blur-md`
                            : "border-white/70 bg-white/88 text-zinc-950 backdrop-blur-md"
                        }`}
                      >
                        {safeSelectedPilot.pos}º
                      </div>

                      <div
                        className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] shadow-sm ${
                          isDarkMode
                            ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                            : categoryColors[category] || "border-black/10 bg-white/90 text-zinc-700"
                        }`}
                      >
                        {category}
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <div
                        className={`rounded-[20px] border px-3 py-3 backdrop-blur-md ${
                          isDarkMode
                            ? "border-white/10 bg-black/30"
                            : "border-white/60 bg-white/72"
                        }`}
                      >
                        <p
                          className={`truncate text-[15px] font-extrabold leading-none tracking-tight ${
                            isDarkMode ? "text-white" : "text-zinc-950"
                          }`}
                        >
                          {selectedPilotShortName}
                        </p>

                        {selectedPilotWarName ? (
                          <p
                            className={`mt-1 truncate text-[11px] font-semibold italic ${
                              isDarkMode ? "text-zinc-300" : "text-zinc-600"
                            }`}
                          >
                            {selectedPilotWarName}
                          </p>
                        ) : null}

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${
                              isDarkMode
                                ? "border-white/10 bg-white/5 text-zinc-300"
                                : "border-black/5 bg-white/80 text-zinc-700"
                            }`}
                          >
                            piloto oficial
                          </span>

                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${
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

                <div className="min-w-0">
                  <p
                    className={`text-[11px] font-bold uppercase tracking-[0.18em] ${
                      isDarkMode ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    Perfil premium do piloto
                  </p>

                  <h2
                    className={`mt-2 break-words text-[28px] font-extrabold leading-[1.02] tracking-tight ${
                      isDarkMode ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    {selectedPilotShortName}
                  </h2>

                  {selectedPilotWarName ? (
                    <div className="mt-3">
                      <span
                        className={`inline-flex max-w-full break-words rounded-full border px-3 py-1.5 text-[11px] font-semibold italic ${
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
                      <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${isDarkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                        Posição atual
                      </p>
                      <p className={`mt-1 text-[24px] font-extrabold leading-none tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                        {safeSelectedPilot.pos}º
                      </p>
                      <p className={`mt-1 text-[11px] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
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
                      <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${isDarkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                        Pontuação oficial
                      </p>
                      <p className={`mt-1 text-[24px] font-extrabold leading-none tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                        {safeSelectedPilot.pontos}
                        <span className={`ml-1 text-[14px] font-bold ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                          pts
                        </span>
                      </p>
                      <p className={`mt-1 text-[11px] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
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
                        <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                          Análise oficial
                        </p>
                        <p className={`mt-1 text-[16px] font-extrabold leading-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                          {selectedPilotConsistency}
                        </p>
                        <p className={`mt-2 text-[12px] leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                          Momento: <span className="font-semibold">{selectedPilotMomentum}</span> · melhor fundamento atual em <span className="font-semibold">{selectedPilotBestAttribute.label.toLowerCase()}</span> ({selectedPilotBestAttribute.value}).
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
