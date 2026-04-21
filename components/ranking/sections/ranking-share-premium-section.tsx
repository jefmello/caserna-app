"use client";

import React from "react";
import { BarChart3, Crown, MessageCircle, Share2, Swords } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type ThemeLike = {
  darkAccentBorder?: string;
  darkAccentBg?: string;
  darkAccentText?: string;
  darkAccentIconWrap?: string;
  primaryIconWrap?: string;
  primaryIcon?: string;
  searchBadge?: string;
};

function RankingSharePremiumSection({
  isDarkMode,
  theme,
  leader,
  championshipNarrative,
  comparePilotA,
  comparePilotB,
  isSharingLeaderImage,
  isSharingNarrativeImage,
  isSharingDuelImage,
  onShareLeader,
  onShareNarrative,
  onShareDuel,
  onWhatsAppLeader,
  onWhatsAppNarrative,
  onWhatsAppDuel,
}: {
  isDarkMode: boolean;
  theme: ThemeLike;
  leader: unknown;
  championshipNarrative: unknown;
  comparePilotA: unknown;
  comparePilotB: unknown;
  isSharingLeaderImage: boolean;
  isSharingNarrativeImage: boolean;
  isSharingDuelImage: boolean;
  onShareLeader: () => void;
  onShareNarrative: () => void;
  onShareDuel: () => void;
  onWhatsAppLeader: () => void;
  onWhatsAppNarrative: () => void;
  onWhatsAppDuel: () => void;
}) {
  return (
    <Card
      className={`overflow-hidden rounded-[22px] shadow-sm transition-all duration-200 hover:-translate-y-[1px] ${
        isDarkMode ? "border border-white/10 bg-[#111827]" : "border-black/5 bg-white"
      }`}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p
              className={`text-[9px] font-bold tracking-[0.18em] uppercase ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Share premium
            </p>
            <h3
              className={`mt-1 text-[16px] font-extrabold tracking-tight ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              Conteúdo oficial pronto para WhatsApp
            </h3>
            <p
              className={`mt-1 text-[12px] leading-snug ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Gere artes do líder, da narrativa oficial e do duelo da rodada com visual premium do
              campeonato.
            </p>
          </div>

          <div
            className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.12em] uppercase ${
              isDarkMode
                ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}`
                : theme.searchBadge
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            mídia oficial
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2.5 lg:grid-cols-3">
          <button
            type="button"
            onClick={onShareLeader}
            disabled={!leader || isSharingLeaderImage}
            className={`rounded-[18px] border px-3 py-3 text-left transition-all duration-200 ${
              isDarkMode
                ? `border-white/10 bg-[#0f172a] hover:border-white/20 hover:bg-[#162033] disabled:opacity-50`
                : "border-black/5 bg-zinc-50/80 hover:bg-white disabled:opacity-50"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-2xl ${
                  isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                }`}
              >
                <Crown
                  className={`h-4 w-4 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`}
                />
              </div>
              <span
                className={`text-[10px] font-bold tracking-[0.12em] uppercase ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                {isSharingLeaderImage ? "Gerando..." : "Líder"}
              </span>
            </div>
            <p
              className={`mt-2 text-[14px] font-extrabold tracking-tight ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              Arte do líder do campeonato
            </p>
            <p
              className={`mt-1 text-[11px] leading-snug ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Nome, pontuação, vantagem e contexto oficial da liderança.
            </p>
          </button>

          <button
            type="button"
            onClick={onShareNarrative}
            disabled={!championshipNarrative || isSharingNarrativeImage}
            className={`rounded-[18px] border px-3 py-3 text-left transition-all duration-200 ${
              isDarkMode
                ? `border-white/10 bg-[#0f172a] hover:border-white/20 hover:bg-[#162033] disabled:opacity-50`
                : "border-black/5 bg-zinc-50/80 hover:bg-white disabled:opacity-50"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-2xl ${
                  isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                }`}
              >
                <BarChart3
                  className={`h-4 w-4 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`}
                />
              </div>
              <span
                className={`text-[10px] font-bold tracking-[0.12em] uppercase ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                {isSharingNarrativeImage ? "Gerando..." : "Narrativa"}
              </span>
            </div>
            <p
              className={`mt-2 text-[14px] font-extrabold tracking-tight ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              Headline editorial oficial
            </p>
            <p
              className={`mt-1 text-[11px] leading-snug ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Headline, badges e leitura automática do cenário do campeonato.
            </p>
          </button>

          <button
            type="button"
            onClick={onShareDuel}
            disabled={!comparePilotA || !comparePilotB || isSharingDuelImage}
            className={`rounded-[18px] border px-3 py-3 text-left transition-all duration-200 ${
              isDarkMode
                ? `border-white/10 bg-[#0f172a] hover:border-white/20 hover:bg-[#162033] disabled:opacity-50`
                : "border-black/5 bg-zinc-50/80 hover:bg-white disabled:opacity-50"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-2xl ${
                  isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                }`}
              >
                <Swords
                  className={`h-4 w-4 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`}
                />
              </div>
              <span
                className={`text-[10px] font-bold tracking-[0.12em] uppercase ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                {isSharingDuelImage ? "Gerando..." : "Duelo"}
              </span>
            </div>
            <p
              className={`mt-2 text-[14px] font-extrabold tracking-tight ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              Confronto premium da rodada
            </p>
            <p
              className={`mt-1 text-[11px] leading-snug ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Comparativo visual entre dois pilotos com vencedor e contexto do duelo.
            </p>
          </button>
        </div>

        <div className="mt-2.5 grid grid-cols-1 gap-2.5 lg:grid-cols-3">
          <button
            type="button"
            onClick={onWhatsAppLeader}
            disabled={!leader || isSharingLeaderImage}
            className={`inline-flex items-center justify-center gap-2 rounded-[16px] border px-3 py-2.5 text-[12px] font-bold transition-all duration-200 ${
              isDarkMode
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15 disabled:opacity-50"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            {isSharingLeaderImage ? "Gerando..." : "WhatsApp • líder"}
          </button>

          <button
            type="button"
            onClick={onWhatsAppNarrative}
            disabled={!championshipNarrative || isSharingNarrativeImage}
            className={`inline-flex items-center justify-center gap-2 rounded-[16px] border px-3 py-2.5 text-[12px] font-bold transition-all duration-200 ${
              isDarkMode
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15 disabled:opacity-50"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            {isSharingNarrativeImage ? "Gerando..." : "WhatsApp • narrativa"}
          </button>

          <button
            type="button"
            onClick={onWhatsAppDuel}
            disabled={!comparePilotA || !comparePilotB || isSharingDuelImage}
            className={`inline-flex items-center justify-center gap-2 rounded-[16px] border px-3 py-2.5 text-[12px] font-bold transition-all duration-200 ${
              isDarkMode
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15 disabled:opacity-50"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            {isSharingDuelImage ? "Gerando..." : "WhatsApp • duelo"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default React.memo(RankingSharePremiumSection);
