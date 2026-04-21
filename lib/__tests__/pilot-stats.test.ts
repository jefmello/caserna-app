import { describe, it, expect } from "vitest";
import {
  getGapToLeader,
  getPerformancePercentage,
  getSelectedPilotBestAttribute,
  getPilotConsistencyLabel,
  getPilotMomentumLabel,
  getPilotEfficiency,
  getTopMetricRanking,
  getTopPointsChartData,
} from "@/lib/ranking/pilot-stats";
import type { RankingItem } from "@/types/ranking";

const make = (overrides: Partial<RankingItem>): RankingItem => ({
  pos: 1,
  pilotoId: "p",
  piloto: "joao silva",
  nomeGuerra: "",
  pontos: 0,
  adv: 0,
  participacoes: 10,
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

describe("getGapToLeader", () => {
  it("returns 'líder' when tied or ahead", () => {
    expect(getGapToLeader(100, 100)).toBe("líder");
    expect(getGapToLeader(90, 100)).toBe("líder");
  });

  it("returns negative gap string", () => {
    expect(getGapToLeader(100, 75)).toBe("-25 pts do líder");
  });
});

describe("getPerformancePercentage", () => {
  it("clamps to 0–100", () => {
    expect(getPerformancePercentage(50, 100)).toBe(50);
    expect(getPerformancePercentage(150, 100)).toBe(100);
    expect(getPerformancePercentage(-10, 100)).toBe(0);
  });

  it("returns 0 when total is 0", () => {
    expect(getPerformancePercentage(50, 0)).toBe(0);
  });
});

describe("getSelectedPilotBestAttribute", () => {
  it("picks highest of vitorias/poles/mv/podios", () => {
    const pilot = make({ vitorias: 1, poles: 4, mv: 2, podios: 3 });
    expect(getSelectedPilotBestAttribute(pilot)).toEqual({ label: "Poles", value: 4 });
  });

  it("returns fallback for null pilot", () => {
    expect(getSelectedPilotBestAttribute(null)).toEqual({ label: "Sem dados", value: 0 });
  });
});

describe("getPilotConsistencyLabel", () => {
  it("elite when podium>=70% and adv<=20%", () => {
    expect(getPilotConsistencyLabel(make({ podios: 8, adv: 1 }))).toBe("Consistência de elite");
  });

  it("perfil vencedor with 35%+ wins", () => {
    expect(getPilotConsistencyLabel(make({ vitorias: 4 }))).toBe("Perfil vencedor");
  });

  it("atenção disciplina when many adv", () => {
    expect(getPilotConsistencyLabel(make({ adv: 6 }))).toBe("Atenção na disciplina");
  });

  it("no base when no participacoes", () => {
    expect(getPilotConsistencyLabel(make({ participacoes: 0 }))).toBe("Sem base suficiente");
  });
});

describe("getPilotMomentumLabel", () => {
  it("marks self as referência", () => {
    const leader = make({ pilotoId: "p1" });
    expect(getPilotMomentumLabel(leader, leader)).toBe("Referência da categoria");
  });

  it("na briga direta when gap <= 3", () => {
    const leader = make({ pilotoId: "L", pontos: 100 });
    const pilot = make({ pilotoId: "P", pontos: 98 });
    expect(getPilotMomentumLabel(pilot, leader)).toBe("Na briga direta");
  });

  it("busca recuperação when gap > 20", () => {
    const leader = make({ pilotoId: "L", pontos: 100 });
    const pilot = make({ pilotoId: "P", pontos: 50 });
    expect(getPilotMomentumLabel(pilot, leader)).toBe("Busca recuperação");
  });
});

describe("getPilotEfficiency", () => {
  it("returns pontos/participacoes rounded to 1 decimal", () => {
    expect(getPilotEfficiency(make({ pontos: 100, participacoes: 4 }))).toBe(25);
    expect(getPilotEfficiency(make({ pontos: 75, participacoes: 3 }))).toBe(25);
  });

  it("returns 0 when no participacoes", () => {
    expect(getPilotEfficiency(make({ participacoes: 0 }))).toBe(0);
  });
});

describe("getTopMetricRanking", () => {
  it("filters out zeros and sorts by metric desc", () => {
    const list = [
      make({ pilotoId: "a", vitorias: 0 }),
      make({ pilotoId: "b", vitorias: 3, pontos: 50 }),
      make({ pilotoId: "c", vitorias: 5, pontos: 30 }),
    ];
    const top = getTopMetricRanking(list, "vitorias");
    expect(top.map((p) => p.pilotoId)).toEqual(["c", "b"]);
  });
});

describe("getTopPointsChartData", () => {
  it("maps to firstName + points, limited", () => {
    const list = [
      make({ piloto: "john smith", pontos: 100 }),
      make({ piloto: "mary jane", pontos: 90 }),
    ];
    expect(getTopPointsChartData(list, 1)).toEqual([{ piloto: "John", pontos: 100 }]);
  });
});
