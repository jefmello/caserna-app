import { describe, it, expect } from "vitest";
import {
  STAGE_POINTS_BY_POSITION,
  NO_POLE_STAGES,
  CHAMPIONSHIP_STAGE_MAP,
  getRemainingChampionshipStages,
  getStageMaxPoints,
  getMaxPointsFromStages,
  getStagePodiumScenarioPoints,
  resolvePilotKey,
} from "@/lib/ranking/stage-points-engine";

describe("STAGE_POINTS_BY_POSITION", () => {
  it("winner gets 35 points", () => {
    expect(STAGE_POINTS_BY_POSITION[1]).toBe(35);
  });

  it("28th still scores 1", () => {
    expect(STAGE_POINTS_BY_POSITION[28]).toBe(1);
  });
});

describe("getRemainingChampionshipStages", () => {
  it("filters out completed stages", () => {
    expect(getRemainingChampionshipStages("T1", [1])).toEqual([2, 3]);
  });

  it("GERAL spans 4-9", () => {
    expect(getRemainingChampionshipStages("GERAL", [])).toEqual(CHAMPIONSHIP_STAGE_MAP.GERAL);
  });

  it("returns empty for unknown competition", () => {
    expect(getRemainingChampionshipStages("XYZ", [])).toEqual([]);
  });
});

describe("getStageMaxPoints", () => {
  it("regular stage: base + pole + fastestLap = 35+1+1 = 37", () => {
    expect(getStageMaxPoints(1)).toBe(37);
  });

  it("no-pole stages skip pole point: 35+0+1 = 36", () => {
    for (const s of NO_POLE_STAGES) {
      expect(getStageMaxPoints(s)).toBe(36);
    }
  });
});

describe("getMaxPointsFromStages", () => {
  it("sums up max points across stages", () => {
    // T1 = [1,2,3]: 37 + 36 + 37 = 110
    expect(getMaxPointsFromStages([1, 2, 3])).toBe(110);
  });

  it("empty list = 0", () => {
    expect(getMaxPointsFromStages([])).toBe(0);
  });
});

describe("getStagePodiumScenarioPoints", () => {
  it("3rd place + fastest lap = 30+1 = 31", () => {
    expect(getStagePodiumScenarioPoints(1)).toBe(31);
  });
});

describe("resolvePilotKey", () => {
  it("prefers pilotoId", () => {
    expect(resolvePilotKey({ pilotoId: "id1", piloto: "name" })).toBe("id1");
  });

  it("falls back to piloto", () => {
    expect(resolvePilotKey({ pilotoId: "", piloto: "name" })).toBe("name");
  });
});
