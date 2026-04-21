"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LineChart } from "lucide-react";
import useRankingData from "@/lib/hooks/useRankingData";
import useRankingFilters from "@/lib/hooks/useRankingFilters";
import { useChampionship } from "@/context/championship-context";
import { getCategoryTheme } from "@/lib/ranking/theme-utils";
import { getPilotFirstAndLastName } from "@/lib/ranking/ranking-utils";
import PodiumBadge from "@/components/ui/podium-badge";
import type { RankingItem } from "@/types/ranking";

const STAGE_COUNT = 8;

type StageRow = {
  pilotoId: string;
  piloto: string;
  points: number;
  categoria: string;
};

/**
 * Seeded jitter so the replay is deterministic across renders — no React
 * hydration flicker. Returns a value in [-4, 4].
 */
function jitter(seedA: number, seedB: number): number {
  return ((seedA * 31 + seedB * 17) % 9) - 4;
}

/**
 * Computes a per-pilot per-stage distribution: pilots with more wins get more
 * points on "highlight" stages, and the remainder is spread evenly.
 * This is a preview derived from the final totals; real stage-by-stage data
 * is not yet in the CSV.
 */
function buildStageMatrix(pilots: RankingItem[], stages: number) {
  return pilots.map((p, idx) => {
    const perStage: number[] = new Array(stages).fill(0);
    const stagesParticipated = Math.min(stages, Math.max(p.participacoes || stages, 1));
    const highlightStages = Math.min(
      stagesParticipated,
      p.vitorias + Math.ceil((p.podios || 0) / 2)
    );
    const avg = stagesParticipated > 0 ? p.pontos / stagesParticipated : 0;
    for (let i = 0; i < stagesParticipated; i++) {
      const boost = i < highlightStages ? 1.25 : 0.85;
      perStage[i] = Math.max(0, avg * boost + jitter(i, idx));
    }
    // Re-scale so cumulative at stages == pilot.pontos
    const total = perStage.reduce((a, b) => a + b, 0);
    if (total > 0) {
      const scale = p.pontos / total;
      for (let i = 0; i < perStage.length; i++) perStage[i] *= scale;
    }
    return { pilot: p, perStage };
  });
}

export default function ReplayTemporada() {
  const { isDarkMode, categoria, campeonato } = useChampionship();
  const { rankingData, rankingMeta, categories } = useRankingData({
    categoria,
    campeonato,
  });
  const { filteredRanking, category } = useRankingFilters({
    rankingData,
    rankingMeta,
    categories,
  });

  const theme = getCategoryTheme(category);
  const [stage, setStage] = useState(STAGE_COUNT);

  const matrix = useMemo(() => buildStageMatrix(filteredRanking, STAGE_COUNT), [filteredRanking]);

  const rows: StageRow[] = useMemo(() => {
    const snapshot = matrix.map(({ pilot, perStage }) => {
      let points = 0;
      for (let i = 0; i < Math.min(stage, perStage.length); i++) {
        points += perStage[i];
      }
      return {
        pilotoId: pilot.pilotoId || pilot.piloto,
        piloto: pilot.piloto,
        categoria: pilot.categoria,
        points: Math.round(points),
      };
    });
    snapshot.sort((a, b) => b.points - a.points);
    return snapshot;
  }, [matrix, stage]);

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1
            className={`flex items-center gap-2 text-2xl font-black tracking-tight ${
              isDarkMode ? "text-white" : "text-zinc-900"
            }`}
          >
            <LineChart className="h-5 w-5 text-amber-400" />
            Replay da Temporada
          </h1>
          <p
            className={`mt-1 text-[12px] font-medium tracking-[0.04em] ${
              isDarkMode ? "text-white/55" : "text-zinc-500"
            }`}
          >
            Arraste o slider para ver a classificação evoluir etapa a etapa. Preview — dados reais
            por etapa requerem enriquecimento do CSV.
          </p>
        </div>
      </header>

      <div
        className={`rounded-2xl border p-3 sm:p-4 ${
          isDarkMode
            ? `${theme.darkAccentBorder} ${theme.darkAccentBg}`
            : "border-zinc-200 bg-white/80"
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`shrink-0 text-[11px] font-semibold tracking-[0.14em] uppercase ${
              isDarkMode ? "text-white/60" : "text-zinc-500"
            }`}
          >
            Etapa {stage}/{STAGE_COUNT}
          </span>
          <input
            type="range"
            min={0}
            max={STAGE_COUNT}
            step={1}
            value={stage}
            onChange={(e) => setStage(Number(e.target.value))}
            aria-label="Progresso da temporada"
            className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-gradient-to-r from-amber-400/30 via-amber-400/60 to-amber-400 accent-amber-400"
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] font-semibold tracking-[0.14em] uppercase">
          {Array.from({ length: STAGE_COUNT + 1 }, (_, i) => (
            <span key={i} className={isDarkMode ? "text-white/40" : "text-zinc-400"}>
              {i === 0 ? "Início" : `E${i}`}
            </span>
          ))}
        </div>
      </div>

      <div
        className={`relative h-[500px] overflow-y-auto rounded-2xl border ${
          isDarkMode ? "border-white/10 bg-white/[0.02]" : "border-zinc-200 bg-white/70"
        }`}
      >
        <ol className="flex flex-col gap-1.5 p-3">
          {rows.map((row, idx) => {
            const position = idx + 1;
            const badgePosition = Math.max(1, Math.min(position, 6)) as 1 | 2 | 3 | 4 | 5 | 6;
            return (
              <motion.li
                key={row.pilotoId}
                layout
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${
                  isDarkMode ? "border-white/8 bg-white/[0.04]" : "border-zinc-200 bg-white/90"
                }`}
              >
                <span
                  className={`w-7 shrink-0 text-center text-[11px] font-black tabular-nums ${
                    isDarkMode ? "text-white/65" : "text-zinc-500"
                  }`}
                >
                  {position}
                </span>
                {position <= 6 ? (
                  <PodiumBadge position={badgePosition} size="sm" />
                ) : (
                  <span
                    className={`h-8 w-8 shrink-0 rounded-full border ${
                      isDarkMode ? "border-white/10 bg-white/[0.03]" : "border-zinc-200 bg-zinc-50"
                    }`}
                  />
                )}
                <span
                  className={`flex-1 truncate text-sm font-semibold ${
                    isDarkMode ? "text-white/90" : "text-zinc-800"
                  }`}
                >
                  {getPilotFirstAndLastName(row.piloto)}
                </span>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] uppercase ${
                    isDarkMode
                      ? "border-white/10 bg-white/[0.04] text-white/55"
                      : "border-zinc-200 bg-zinc-50 text-zinc-500"
                  }`}
                >
                  {row.categoria}
                </span>
                <span
                  className={`w-14 shrink-0 text-right text-sm font-black tabular-nums ${
                    isDarkMode ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {row.points}
                </span>
              </motion.li>
            );
          })}
          {rows.length === 0 && (
            <li
              className={`rounded-xl border p-4 text-center text-sm ${
                isDarkMode
                  ? "border-white/10 bg-white/[0.03] text-white/55"
                  : "border-zinc-200 bg-zinc-50 text-zinc-500"
              }`}
            >
              Sem pilotos no recorte atual.
            </li>
          )}
        </ol>
      </div>
    </section>
  );
}
