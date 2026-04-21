import { describe, it, expect } from "vitest";
import {
  getTitleFightStatus,
  getComparisonWinner,
  getDuelWinnerLabel,
  getDuelNarrative,
  getDuelProfileLabel,
} from "@/lib/ranking/competition-utils";
import type { RankingItem } from "@/types/ranking";

const make = (pontos: number): RankingItem => ({
  pos: 1,
  pilotoId: String(pontos),
  piloto: "x",
  nomeGuerra: "",
  pontos,
  adv: 0,
  participacoes: 1,
  vitorias: 0,
  poles: 0,
  mv: 0,
  podios: 0,
  descarte: 0,
  categoriaAtual: "Base",
  competicao: "T1",
  categoria: "Base",
});

describe("getTitleFightStatus", () => {
  it("SEM DISPUTA when fewer than 2", () => {
    expect(getTitleFightStatus([]).label).toBe("SEM DISPUTA");
    expect(getTitleFightStatus([make(100)]).label).toBe("SEM DISPUTA");
  });

  it("BRIGA ACIRRADA when diff <= 3", () => {
    expect(getTitleFightStatus([make(100), make(98)]).label).toBe("BRIGA ACIRRADA");
  });

  it("DISPUTA CONTROLADA when diff 4-8", () => {
    expect(getTitleFightStatus([make(100), make(94)]).label).toBe("DISPUTA CONTROLADA");
  });

  it("LIDERANÇA ISOLADA when diff > 8", () => {
    expect(getTitleFightStatus([make(100), make(80)]).label).toBe("LIDERANÇA ISOLADA");
  });
});

describe("getComparisonWinner", () => {
  it("higher wins by default", () => {
    expect(getComparisonWinner(10, 5)).toBe("a");
    expect(getComparisonWinner(5, 10)).toBe("b");
  });

  it("tie on equality", () => {
    expect(getComparisonWinner(5, 5)).toBe("tie");
  });

  it("lower wins when lowerIsBetter", () => {
    expect(getComparisonWinner(3, 7, true)).toBe("a");
  });
});

describe("getDuelWinnerLabel", () => {
  it("returns proper label per winner", () => {
    expect(getDuelWinnerLabel("a")).toContain("A");
    expect(getDuelWinnerLabel("b")).toContain("B");
    expect(getDuelWinnerLabel("tie")).toBe("Empate técnico");
  });
});

describe("getDuelNarrative", () => {
  it("aberto when score tied and small points diff", () => {
    expect(getDuelNarrative({ scoreA: 2, scoreB: 2, pointsDiff: 1 })).toBe(
      "Duelo totalmente em aberto"
    );
  });

  it("superiority on large score diff", () => {
    expect(getDuelNarrative({ scoreA: 5, scoreB: 0, pointsDiff: 0 })).toBe(
      "Superioridade clara no duelo"
    );
  });

  it("apertado on minimal score diff", () => {
    expect(getDuelNarrative({ scoreA: 3, scoreB: 2, pointsDiff: 0 })).toBe("Duelo apertado");
  });
});

describe("getDuelProfileLabel", () => {
  it("domina when leader wins both scores", () => {
    expect(
      getDuelProfileLabel({ scoreA: 4, scoreB: 1, pointsWinner: "a", advWinner: "a" })
    ).toContain("domina");
  });

  it("espelhado when tied scores and tied points", () => {
    expect(
      getDuelProfileLabel({ scoreA: 2, scoreB: 2, pointsWinner: "tie", advWinner: "tie" })
    ).toBe("Confronto espelhado");
  });
});
