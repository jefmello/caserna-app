import { describe, it, expect } from "vitest";
import {
  rankingItemSchema,
  categorySchema,
  competitionSchema,
  pilotDuelSchema,
  pilotIdParamSchema,
  validateRankingList,
} from "@/lib/validation-schemas";

const validItem = {
  pos: 1,
  pilotoId: "p1",
  piloto: "João",
  nomeGuerra: "",
  pontos: 100,
  adv: 0,
  participacoes: 5,
  vitorias: 2,
  poles: 1,
  mv: 0,
  podios: 3,
  descarte: 0,
  categoriaAtual: "Base",
  competicao: "T1",
  categoria: "Base",
};

describe("rankingItemSchema", () => {
  it("accepts valid item", () => {
    expect(rankingItemSchema.safeParse(validItem).success).toBe(true);
  });

  it("rejects negative points", () => {
    expect(rankingItemSchema.safeParse({ ...validItem, pontos: -1 }).success).toBe(false);
  });

  it("rejects missing pilot name", () => {
    expect(rankingItemSchema.safeParse({ ...validItem, piloto: "" }).success).toBe(false);
  });

  it("rejects non-integer participacoes", () => {
    expect(rankingItemSchema.safeParse({ ...validItem, participacoes: 3.5 }).success).toBe(false);
  });
});

describe("categorySchema / competitionSchema", () => {
  it("accepts known categories", () => {
    expect(categorySchema.safeParse("Base").success).toBe(true);
    expect(categorySchema.safeParse("Graduados").success).toBe(true);
    expect(categorySchema.safeParse("Elite").success).toBe(true);
  });

  it("rejects unknown category", () => {
    expect(categorySchema.safeParse("Outros").success).toBe(false);
  });

  it("accepts known competitions", () => {
    for (const c of ["T1", "T2", "T3", "GERAL"]) {
      expect(competitionSchema.safeParse(c).success).toBe(true);
    }
  });
});

describe("pilotDuelSchema", () => {
  it("accepts two different pilots", () => {
    expect(pilotDuelSchema.safeParse({ comparePilotAId: "a", comparePilotBId: "b" }).success).toBe(
      true
    );
  });

  it("rejects same pilot on both sides", () => {
    const result = pilotDuelSchema.safeParse({ comparePilotAId: "x", comparePilotBId: "x" });
    expect(result.success).toBe(false);
  });

  it("rejects empty selection", () => {
    expect(pilotDuelSchema.safeParse({ comparePilotAId: "", comparePilotBId: "b" }).success).toBe(
      false
    );
  });
});

describe("pilotIdParamSchema", () => {
  it("accepts reasonable id", () => {
    expect(pilotIdParamSchema.safeParse("p42").success).toBe(true);
  });

  it("rejects empty", () => {
    expect(pilotIdParamSchema.safeParse("").success).toBe(false);
  });

  it("rejects overly long input", () => {
    expect(pilotIdParamSchema.safeParse("x".repeat(200)).success).toBe(false);
  });
});

describe("validateRankingList", () => {
  it("collects valid + errors separately", () => {
    const list = [validItem, { ...validItem, pontos: -5 }, validItem];
    const { valid, errors } = validateRankingList(list);
    expect(valid).toHaveLength(2);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("1");
  });
});
