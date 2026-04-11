"use client";

import { useCallback, useMemo, useState } from "react";
import { Flag, RotateCcw, Trophy, TrendingUp, TrendingDown, Minus, Sparkles, AlertTriangle } from "lucide-react";
import type { RankingItem } from "@/types/ranking";
import { getPilotFirstAndLastName } from "@/lib/ranking/pilot-name-utils";
import { getCategoryTheme } from "@/lib/ranking/theme-utils";
import { resolvePilotKey } from "@/lib/ranking/stage-points-engine";
import {
  runCustomScenario,
  calculateStagePoints,
  isValidPosition,
  type CustomScenarioAssignment,
  type CustomScenarioResult,
} from "@/lib/ranking/custom-scenario-engine";

const MAX_POSITIONS = 28;

function PositionSelector({
  availablePositions,
  selectedPosition,
  onSelect,
  isDarkMode,
  theme,
}: {
  availablePositions: number[];
  selectedPosition: number | null;
  onSelect: (pos: number | null) => void;
  isDarkMode: boolean;
  theme: ReturnType<typeof getCategoryTheme>;
}) {
  return (
    <select
      value={selectedPosition || ""}
      onChange={(e) => onSelect(e.target.value ? Number(e.target.value) : null)}
      className={`w-20 rounded-xl border px-2 py-2 text-center text-sm font-bold transition ${
        isDarkMode
          ? selectedPosition
            ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft} ${theme.darkAccentText}`
            : "border-white/10 bg-[#0f172a] text-zinc-400"
          : selectedPosition
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-black/5 bg-zinc-50 text-zinc-500"
      }`}
    >
      <option value="">—</option>
      {availablePositions.map((pos) => (
        <option key={pos} value={pos}>
          {pos}º ({calculateStagePoints(pos, 1)} pts)
        </option>
      ))}
    </select>
  );
}

function PilotRow({
  pilot,
  currentPosition,
  availablePositions,
  assignedPosition,
  onPositionChange,
  isDarkMode,
  theme,
}: {
  pilot: RankingItem;
  currentPosition: number;
  availablePositions: number[];
  assignedPosition: number | null;
  onPositionChange: (pilotKey: string, pos: number | null) => void;
  isDarkMode: boolean;
  theme: ReturnType<typeof getCategoryTheme>;
}) {
  const pilotKey = resolvePilotKey(pilot);

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition ${
        isDarkMode
          ? assignedPosition
            ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}`
            : "border border-white/5 bg-[#0f172a]/60"
          : assignedPosition
            ? "border border-emerald-200 bg-emerald-50/50"
            : "border border-black/5 bg-zinc-50/40"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold ${
              isDarkMode ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            #{currentPosition}
          </span>
          <p
            className={`truncate text-sm font-semibold ${
              isDarkMode ? "text-white" : "text-zinc-950"
            }`}
          >
            {getPilotFirstAndLastName(pilot.piloto)}
          </p>
        </div>
        <p
          className={`mt-0.5 text-xs ${
            isDarkMode ? "text-zinc-500" : "text-zinc-400"
          }`}
        >
          {pilot.pontos} pts
        </p>
      </div>

      <PositionSelector
        availablePositions={availablePositions}
        selectedPosition={assignedPosition}
        onSelect={(pos) => onPositionChange(pilotKey, pos)}
        isDarkMode={isDarkMode}
        theme={theme}
      />
    </div>
  );
}

function ScenarioResults({
  result,
  isDarkMode,
  theme,
  onSelectPilot,
}: {
  result: CustomScenarioResult;
  isDarkMode: boolean;
  theme: ReturnType<typeof getCategoryTheme>;
  onSelectPilot: (pilot: RankingItem) => void;
}) {
  const { projectedRanking, leaderChange, biggestGainer, biggestLoser } = result;

  return (
    <div className="space-y-4">
      {/* Leader change banner */}
      {leaderChange.oldLeader !== leaderChange.newLeader && (
        <div
          className={`rounded-2xl border p-4 text-center ${
            isDarkMode
              ? "border-yellow-500/30 bg-yellow-500/10"
              : "border-yellow-200 bg-yellow-50"
          }`}
        >
          <p
            className={`text-sm font-bold ${
              isDarkMode ? "text-yellow-300" : "text-yellow-700"
            }`}
          >
            ⚡ Troca na liderança!
          </p>
          <p
            className={`mt-1 text-xs ${
              isDarkMode ? "text-yellow-400/80" : "text-yellow-600"
            }`}
          >
            {leaderChange.newLeader && getPilotFirstAndLastName(leaderChange.newLeader)} assume com{" "}
            {projectedRanking[0]?.projectedPoints || 0} pts
          </p>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        {biggestGainer && (
          <div
            className={`rounded-xl border p-3 ${
              isDarkMode
                ? "border-emerald-500/30 bg-emerald-500/10"
                : "border-emerald-200 bg-emerald-50"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <TrendingUp
                className={`h-3.5 w-3.5 ${
                  isDarkMode ? "text-emerald-300" : "text-emerald-600"
                }`}
              />
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isDarkMode ? "text-emerald-400" : "text-emerald-700"
                }`}
              >
                Maior alta
              </span>
            </div>
            <p
              className={`mt-1 truncate text-sm font-bold ${
                isDarkMode ? "text-emerald-200" : "text-emerald-800"
              }`}
            >
              {biggestGainer.pilotName}
            </p>
          </div>
        )}

        {biggestLoser && (
          <div
            className={`rounded-xl border p-3 ${
              isDarkMode
                ? "border-red-500/30 bg-red-500/10"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <TrendingDown
                className={`h-3.5 w-3.5 ${
                  isDarkMode ? "text-red-300" : "text-red-600"
                }`}
              />
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isDarkMode ? "text-red-400" : "text-red-700"
                }`}
              >
                Maior queda
              </span>
            </div>
            <p
              className={`mt-1 truncate text-sm font-bold ${
                isDarkMode ? "text-red-200" : "text-red-800"
              }`}
            >
              {biggestLoser.pilotName}
            </p>
          </div>
        )}
      </div>

      {/* Projected ranking list */}
      <div className="space-y-2">
        <p
          className={`text-[10px] font-bold uppercase tracking-wider ${
            isDarkMode ? "text-zinc-500" : "text-zinc-400"
          }`}
        >
          Classificação projetada
        </p>
        {projectedRanking.slice(0, 10).map((pilot, index) => {
          const isTop3 = index < 3;
          const movedUp = pilot.positionChange > 0;
          const movedDown = pilot.positionChange < 0;

          return (
            <button
              key={`projected-${resolvePilotKey(pilot)}`}
              type="button"
              onClick={() => onSelectPilot(pilot)}
              title="Abrir piloto"
              className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                isDarkMode
                  ? isTop3
                    ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}`
                    : "border-white/5 bg-[#0f172a] hover:border-white/10"
                  : isTop3
                    ? `${theme.primaryBorder} bg-gradient-to-r ${theme.heroBg}`
                    : "border-black/5 bg-white hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        isDarkMode ? theme.darkAccentText : theme.primaryIcon
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <p
                      className={`truncate text-sm font-semibold ${
                        isDarkMode ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      {getPilotFirstAndLastName(pilot.piloto)}
                    </p>
                    {movedUp && (
                      <span className="flex items-center gap-0.5 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
                        <TrendingUp className="h-2.5 w-2.5" />+{pilot.positionChange}
                      </span>
                    )}
                    {movedDown && (
                      <span className="flex items-center gap-0.5 rounded-full border border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
                        <TrendingDown className="h-2.5 w-2.5" />{pilot.positionChange}
                      </span>
                    )}
                    {!movedUp && !movedDown && (
                      <span
                        className={`rounded-full border px-1.5 py-0.5 text-[10px] font-bold ${
                          isDarkMode
                            ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                            : "border-yellow-200 bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        <Minus className="inline h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-0.5 text-xs ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    {pilot.projectedPoints} pts{" "}
                    {pilot.pointsGained > 0 && `(+${pilot.pointsGained})`}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
        {projectedRanking.length > 10 && (
          <p
            className={`text-center text-xs ${
              isDarkMode ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            +{projectedRanking.length - 10} pilotos
          </p>
        )}
      </div>
    </div>
  );
}

export default function CustomScenarioBuilder({
  ranking,
  stageNumber,
  category,
  isDarkMode,
  onSelectPilot,
}: {
  ranking: RankingItem[];
  stageNumber: number | null;
  category: string;
  isDarkMode: boolean;
  onSelectPilot: (pilot: RankingItem) => void;
}) {
  const theme = getCategoryTheme(category);
  const [assignments, setAssignments] = useState<CustomScenarioAssignment>({});
  const [result, setResult] = useState<CustomScenarioResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const usedPositions = useMemo(() => new Set(Object.values(assignments)), [assignments]);

  const availablePositions = useMemo(
    () => Array.from({ length: MAX_POSITIONS }, (_, i) => i + 1).filter((p) => !usedPositions.has(p)),
    [usedPositions]
  );

  const handlePositionChange = useCallback(
    (pilotKey: string, position: number | null) => {
      setAssignments((prev) => {
        const next = { ...prev };
        if (position === null) {
          delete next[pilotKey];
        } else {
          next[pilotKey] = position;
        }
        return next;
      });
      setResult(null);
      setShowResults(false);
    },
    []
  );

  const handleReset = useCallback(() => {
    setAssignments({});
    setResult(null);
    setShowResults(false);
  }, []);

  const handleRunScenario = useCallback(() => {
    if (!stageNumber || Object.keys(assignments).length === 0) return;

    const scenarioResult = runCustomScenario({
      ranking,
      assignments,
      stageNumber,
      competition: "GERAL",
    });

    setResult(scenarioResult);
    setShowResults(true);
  }, [ranking, assignments, stageNumber]);

  const assignedCount = Object.keys(assignments).length;
  const canRun = stageNumber && assignedCount >= 2;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div
        className={`rounded-2xl border p-4 ${
          isDarkMode
            ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}`
            : "border-black/5 bg-zinc-50/80"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Cenário personalizado
            </p>
            <p
              className={`mt-1 text-base font-extrabold ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              Monte sua projeção para a etapa {stageNumber || "?"}
            </p>
            <p
              className={`mt-1 text-xs ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Escolha a posição de chegada para cada piloto e veja o impacto no campeonato.
            </p>
          </div>

          {assignedCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className={`shrink-0 rounded-xl border px-2.5 py-2 text-xs font-semibold transition ${
                isDarkMode
                  ? "border-white/10 bg-[#0f172a] text-zinc-300 hover:bg-white/5"
                  : "border-black/5 bg-white text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Progress */}
        <div className="mt-3 flex items-center gap-3">
          <div
            className={`h-1.5 flex-1 overflow-hidden rounded-full ${
              isDarkMode ? "bg-white/10" : "bg-zinc-200"
            }`}
          >
            <div
              className={`h-full rounded-full transition-all ${
                isDarkMode ? theme.darkAccentBg : "bg-emerald-500"
              }`}
              style={{ width: `${(assignedCount / ranking.length) * 100}%` }}
            />
          </div>
          <span
            className={`text-xs font-bold ${
              isDarkMode ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            {assignedCount}/{ranking.length}
          </span>
        </div>
      </div>

      {/* Pilot assignment list */}
      {!showResults && (
        <div className="space-y-2">
          {ranking
            .filter((p) => p.pontos > 0)
            .map((pilot) => (
              <PilotRow
                key={`assign-${resolvePilotKey(pilot)}`}
                pilot={pilot}
                currentPosition={pilot.pos}
                availablePositions={availablePositions}
                assignedPosition={assignments[resolvePilotKey(pilot)] || null}
                onPositionChange={handlePositionChange}
                isDarkMode={isDarkMode}
                theme={theme}
              />
            ))}
        </div>
      )}

      {/* Warning if not enough pilots assigned */}
      {!showResults && assignedCount > 0 && assignedCount < 2 && (
        <div
          className={`flex items-center gap-2 rounded-xl border p-3 text-xs ${
            isDarkMode
              ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Escolha pelo menos 2 pilotos para simular.
        </div>
      )}

      {/* Action button */}
      {!showResults && (
        <button
          type="button"
          onClick={handleRunScenario}
          disabled={!canRun}
          className={`w-full rounded-2xl px-4 py-3.5 text-sm font-bold transition ${
            canRun
              ? isDarkMode
                ? `${theme.darkAccentBorder} ${theme.darkAccentBg} ${theme.darkAccentText} hover:brightness-110`
                : `${theme.primaryBorder} ${theme.primaryIconWrap} ${theme.primaryIcon}`
              : isDarkMode
                ? "border border-white/5 bg-white/5 text-zinc-600 cursor-not-allowed"
                : "border border-black/5 bg-zinc-100 text-zinc-400 cursor-not-allowed"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            Simular cenário
          </span>
        </button>
      )}

      {/* Results */}
      {showResults && result && (
        <ScenarioResults
          result={result}
          isDarkMode={isDarkMode}
          theme={theme}
          onSelectPilot={onSelectPilot}
        />
      )}
    </div>
  );
}
