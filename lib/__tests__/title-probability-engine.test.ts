import { describe, it, expect } from "vitest";
import {
  getTitleProbabilityScenarioLabel,
  getTitleProbabilityLabel,
  buildTitleProbabilityCandidates,
} from "@/lib/ranking/title-probability-engine";
import type { RankingItem } from "@/types/ranking";

const make = (overrides: Partial<RankingItem>): RankingItem => ({
  pos: 1,
  pilotoId: "p",
  piloto: "x",
  nomeGuerra: "",
  pontos: 0,
  adv: 0,
  participacoes: 5,
  vitorias: 0,
  poles: 0,
  mv: 0,
  podios: 0,
  descarte: 0,
  categoriaAtual: "Base",
  competicao: "GERAL",
  categoria: "Base",
  ...overrides,
});

describe("getTitleProbabilityLabel", () => {
  it("tiers by probability", () => {
    expect(getTitleProbabilityLabel(50).label).toBe("FAVORITO");
    expect(getTitleProbabilityLabel(25).label).toBe("PERSEGUIDOR");
    expect(getTitleProbabilityLabel(15).label).toBe("NA BRIGA");
    expect(getTitleProbabilityLabel(8).label).toBe("DEPENDE");
    expect(getTitleProbabilityLabel(2).label).toBe("MILAGRE");
  });
});

describe("getTitleProbabilityScenarioLabel", () => {
  it("controls when leader with high prob", () => {
    expect(getTitleProbabilityScenarioLabel(40, 0)).toContain("controla");
  });

  it("pressures when high prob behind leader", () => {
    expect(getTitleProbabilityScenarioLabel(40, 5)).toContain("pressiona");
  });

  it("extreme scenario at low prob", () => {
    expect(getTitleProbabilityScenarioLabel(2, 50)).toContain("extremo");
  });
});

describe("buildTitleProbabilityCandidates", () => {
  it("returns empty for empty ranking", () => {
    const result = buildTitleProbabilityCandidates({
      ranking: [],
      competition: "GERAL",
      titlePointsStillAvailable: 100,
    });
    expect(result).toEqual([]);
  });

  it("probabilities sum ~100", () => {
    const ranking = [
      make({ pilotoId: "a", pontos: 100 }),
      make({ pilotoId: "b", pontos: 90 }),
      make({ pilotoId: "c", pontos: 80 }),
    ];
    const candidates = buildTitleProbabilityCandidates({
      ranking,
      competition: "GERAL",
      titlePointsStillAvailable: 50,
    });
    const sum = candidates.reduce((acc, c) => acc + c.probability, 0);
    expect(sum).toBeCloseTo(100, 0);
  });

  it("leader has highest probability", () => {
    const ranking = [make({ pilotoId: "a", pontos: 100 }), make({ pilotoId: "b", pontos: 50 })];
    const candidates = buildTitleProbabilityCandidates({
      ranking,
      competition: "GERAL",
      titlePointsStillAvailable: 20,
    });
    expect(candidates[0].pilot.pilotoId).toBe("a");
  });

  it("respects pointsOverrides to reorder by adjusted points", () => {
    const ranking = [make({ pilotoId: "a", pontos: 100 }), make({ pilotoId: "b", pontos: 50 })];
    const candidates = buildTitleProbabilityCandidates({
      ranking,
      competition: "GERAL",
      titlePointsStillAvailable: 20,
      pointsOverrides: { a: 40, b: 200 },
    });
    expect(candidates[0].pilot.pilotoId).toBe("b");
  });
});
