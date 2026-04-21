import { describe, it, expect } from "vitest";
import {
  getPilotPositionInList,
  getPilotTrendStatus,
  getTrendVisual,
} from "@/lib/ranking/pilot-trend";
import type { RankingItem, RankingByCompetition } from "@/types/ranking";

const make = (overrides: Partial<RankingItem>): RankingItem => ({
  pos: 0,
  pilotoId: "p",
  piloto: "x",
  nomeGuerra: "",
  pontos: 0,
  adv: 0,
  participacoes: 0,
  vitorias: 0,
  poles: 0,
  mv: 0,
  podios: 0,
  descarte: 0,
  categoriaAtual: "Base",
  competicao: "T1",
  categoria: "Base",
  ...overrides,
});

describe("getPilotPositionInList", () => {
  it("finds by pilotoId", () => {
    const list = [make({ pilotoId: "a" }), make({ pilotoId: "b" }), make({ pilotoId: "c" })];
    expect(getPilotPositionInList(list, "b", "")).toBe(2);
  });

  it("falls back to name match when no pilotoId", () => {
    const list = [make({ piloto: "joão" }), make({ piloto: "maria" })];
    expect(getPilotPositionInList(list, "", "Maria")).toBe(2);
  });

  it("returns null when not found", () => {
    expect(getPilotPositionInList([make({ pilotoId: "a" })], "z", "")).toBeNull();
  });
});

describe("getPilotTrendStatus", () => {
  const pilot = make({ pilotoId: "p1", piloto: "joão" });

  const categoryData: RankingByCompetition = {
    T1: [make({ pilotoId: "p1" }), make({ pilotoId: "p2" })],
    T2: [make({ pilotoId: "p2" }), make({ pilotoId: "p1" })],
    T3: [make({ pilotoId: "p1" }), make({ pilotoId: "p2" })],
    GERAL: [make({ pilotoId: "p1" }), make({ pilotoId: "p2" })],
  };

  it("stable when no categoryData", () => {
    expect(getPilotTrendStatus({ pilot, competition: "GERAL", categoryData: undefined })).toBe(
      "stable"
    );
  });

  it("up when current pos < best turno pos (GERAL)", () => {
    const data: RankingByCompetition = {
      T1: [make({ pilotoId: "other" }), make({ pilotoId: "p1" })],
      T2: [make({ pilotoId: "other" }), make({ pilotoId: "p1" })],
      T3: [make({ pilotoId: "other" }), make({ pilotoId: "p1" })],
      GERAL: [make({ pilotoId: "p1" })],
    };
    expect(getPilotTrendStatus({ pilot, competition: "GERAL", categoryData: data })).toBe("up");
  });

  it("stable when positions aligned", () => {
    expect(getPilotTrendStatus({ pilot, competition: "T1", categoryData })).toBe("stable");
  });
});

describe("getTrendVisual", () => {
  it("up returns emerald classes", () => {
    expect(getTrendVisual("up", false).label).toBe("em alta");
    expect(getTrendVisual("up", false).className).toContain("emerald");
  });

  it("down returns red classes", () => {
    expect(getTrendVisual("down", false).label).toBe("em queda");
    expect(getTrendVisual("down", false).className).toContain("red");
  });

  it("stable returns yellow classes", () => {
    expect(getTrendVisual("stable", false).label).toBe("estável");
  });

  it("applies dark variant", () => {
    const dark = getTrendVisual("up", true).className;
    const light = getTrendVisual("up", false).className;
    expect(dark).not.toBe(light);
  });
});
