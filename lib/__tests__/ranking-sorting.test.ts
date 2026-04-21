import { describe, it, expect } from "vitest";
import { sortRanking } from "@/lib/ranking/ranking-sorting";
import type { RankingItem } from "@/types/ranking";

const pilot = (overrides: Partial<RankingItem>): RankingItem => ({
  pos: 99,
  pilotoId: `p-${Math.random()}`,
  piloto: "X",
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

describe("sortRanking", () => {
  it("sorts by points desc primarily", () => {
    const out = sortRanking([
      pilot({ piloto: "A", pontos: 80 }),
      pilot({ piloto: "B", pontos: 100 }),
      pilot({ piloto: "C", pontos: 90 }),
    ]);
    expect(out.map((p) => p.piloto)).toEqual(["B", "C", "A"]);
  });

  it("breaks tie on points by fewer ADV", () => {
    const out = sortRanking([
      pilot({ piloto: "A", pontos: 100, adv: 3 }),
      pilot({ piloto: "B", pontos: 100, adv: 1 }),
    ]);
    expect(out[0].piloto).toBe("B");
  });

  it("then by participações desc", () => {
    const out = sortRanking([
      pilot({ piloto: "A", pontos: 100, adv: 0, participacoes: 3 }),
      pilot({ piloto: "B", pontos: 100, adv: 0, participacoes: 5 }),
    ]);
    expect(out[0].piloto).toBe("B");
  });

  it("then by vitorias, poles, mv, podios", () => {
    const out = sortRanking([
      pilot({ piloto: "A", pontos: 100, vitorias: 1, poles: 2 }),
      pilot({ piloto: "B", pontos: 100, vitorias: 1, poles: 5 }),
    ]);
    expect(out[0].piloto).toBe("B");
  });

  it("finally falls back to pos ascending", () => {
    const out = sortRanking([
      pilot({ piloto: "A", pontos: 0, pos: 10 }),
      pilot({ piloto: "B", pontos: 0, pos: 5 }),
    ]);
    expect(out[0].piloto).toBe("B");
  });

  it("does not mutate input", () => {
    const input = [pilot({ piloto: "A", pontos: 10 }), pilot({ piloto: "B", pontos: 20 })];
    const snapshot = [...input];
    sortRanking(input);
    expect(input).toEqual(snapshot);
  });
});
