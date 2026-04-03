"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

type ThemeType = {
  darkAccentBorder: string;
  darkAccentBg: string;
  darkAccentText: string;
  darkAccentIconWrap: string;
  primaryIconWrap: string;
  primaryIcon: string;
  titleBorder: string;
  titleBg: string;
  headerChip: string;
  heroBorder: string;
  heroBg: string;
};

type RankingPilotPerformanceBlocksCardProps = {
  isDarkMode: boolean;
  theme: ThemeType;
  safeSelectedPilot: {
    vitorias: number;
    poles: number;
    mv: number;
    podios: number;
    participacoes: number;
    pos: number;
    pontos: number;
  };
  selectedPilotAverage: number;
  selectedPilotGap: string;
  selectedPilotLeaderGapValue: number;
  SwordsIcon: React.ElementType;
  BarChart3Icon: React.ElementType;
  TablePropertiesIcon: React.ElementType;
};

export default function RankingPilotPerformanceBlocksCard({
  isDarkMode,
  theme,
  safeSelectedPilot,
  selectedPilotAverage,
  selectedPilotGap,
  selectedPilotLeaderGapValue,
  SwordsIcon,
  BarChart3Icon,
  TablePropertiesIcon,
}: RankingPilotPerformanceBlocksCardProps) {
  return (
    <Card
      className={`rounded-[24px] shadow-sm ${
        isDarkMode
          ? `border ${theme.darkAccentBorder} bg-[#111827]`
          : `border ${theme.titleBorder} bg-gradient-to-br ${theme.titleBg}`
      }`}
    >
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
              Performance do piloto
            </p>
            <h3 className={`text-[18px] font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
              Leitura por blocos oficiais
            </h3>
          </div>

          <div className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText}` : theme.headerChip}`}>
            ataque · consistência · status
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Card
            className={`rounded-[22px] shadow-none ${
              isDarkMode
                ? `${theme.darkAccentBorder} bg-[#0f172a]`
                : `${theme.heroBorder} bg-gradient-to-b ${theme.heroBg}`
            }`}
          >
            <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                    Ataque
                  </p>
                  <h4 className={`mt-1 text-[16px] font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                    Força ofensiva
                  </h4>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap}`}>
                  <SwordsIcon className={`h-4.5 w-4.5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
                </div>
              </div>

              <div className="space-y-2">
                {[
                  ["Vitórias", safeSelectedPilot.vitorias],
                  ["Poles", safeSelectedPilot.poles],
                  ["Melhores voltas", safeSelectedPilot.mv],
                ].map(([label, value]) => (
                  <div key={String(label)} className={`rounded-[18px] border px-3 py-3 ${isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-white"}`}>
                    <div className="flex items-center justify-between gap-2.5">
                      <span className={`text-[11px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                        {label}
                      </span>
                      <span className={`text-[20px] font-extrabold leading-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                        {value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={`rounded-[22px] shadow-none ${isDarkMode ? "border border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"}`}>
            <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                    Consistência
                  </p>
                  <h4 className={`mt-1 text-[16px] font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                    Regularidade na temporada
                  </h4>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap}`}>
                  <BarChart3Icon className={`h-4.5 w-4.5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
                </div>
              </div>

              <div className="space-y-2">
                {[
                  ["Pódios", safeSelectedPilot.podios],
                  ["Participações", safeSelectedPilot.participacoes],
                  ["Média de pontos", selectedPilotAverage.toFixed(1)],
                ].map(([label, value]) => (
                  <div key={String(label)} className={`rounded-[18px] border px-3 py-3 ${isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-white"}`}>
                    <div className="flex items-center justify-between gap-2.5">
                      <span className={`text-[11px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                        {label}
                      </span>
                      <span className={`text-[20px] font-extrabold leading-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                        {value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={`rounded-[22px] shadow-none ${isDarkMode ? "border border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"}`}>
            <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                    Status no campeonato
                  </p>
                  <h4 className={`mt-1 text-[16px] font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                    Posição atual do piloto
                  </h4>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap}`}>
                  <TablePropertiesIcon className={`h-4.5 w-4.5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
                </div>
              </div>

              <div className="space-y-2">
                {[
                  ["Posição atual", `${safeSelectedPilot.pos}º`],
                  ["Pontos totais", safeSelectedPilot.pontos],
                  ["Diferença do líder", selectedPilotGap === "líder" ? "LÍDER" : `${selectedPilotLeaderGapValue} pts`],
                ].map(([label, value]) => (
                  <div key={String(label)} className={`rounded-[18px] border px-3 py-3 ${isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-white"}`}>
                    <div className="flex items-center justify-between gap-2.5">
                      <span className={`text-[11px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                        {label}
                      </span>
                      <span className={`text-[20px] font-extrabold leading-none ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                        {value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
