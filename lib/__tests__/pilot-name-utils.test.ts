import { describe, it, expect } from "vitest";
import {
  normalizePilotName,
  getPilotNameParts,
  getPilotFirstAndLastName,
  getPilotWarName,
  getPilotWarNameDisplay,
  getPilotHighlightName,
  getPilotPhotoPath,
} from "@/lib/ranking/pilot-name-utils";
import type { RankingItem } from "@/types/ranking";

const mockPilot = (overrides: Partial<RankingItem> = {}): RankingItem => ({
  pos: 1,
  pilotoId: "p1",
  piloto: "joão da silva",
  nomeGuerra: "zeca",
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
  ...overrides,
});

describe("normalizePilotName", () => {
  it("returns '-' for empty input", () => {
    expect(normalizePilotName()).toBe("-");
    expect(normalizePilotName("")).toBe("-");
  });

  it("title-cases multi-word names", () => {
    expect(normalizePilotName("joão da silva")).toBe("João Da Silva");
    expect(normalizePilotName("  MARIA   SOUZA  ")).toBe("Maria Souza");
  });
});

describe("getPilotNameParts", () => {
  it("returns first/last for two+ words", () => {
    expect(getPilotNameParts("pedro augusto costa")).toEqual({
      firstName: "Pedro",
      lastName: "Costa",
    });
  });

  it("returns firstName only when single word", () => {
    expect(getPilotNameParts("pedro")).toEqual({ firstName: "Pedro", lastName: "" });
  });

  it("handles empty gracefully", () => {
    expect(getPilotNameParts()).toEqual({ firstName: "-", lastName: "" });
  });
});

describe("getPilotFirstAndLastName", () => {
  it("joins first + last when both exist", () => {
    expect(getPilotFirstAndLastName("ana beatriz souza")).toBe("Ana Souza");
  });

  it("returns single word unchanged", () => {
    expect(getPilotFirstAndLastName("Madonna")).toBe("Madonna");
  });
});

describe("getPilotWarName / getPilotWarNameDisplay", () => {
  it("returns war name normalized", () => {
    expect(getPilotWarName(mockPilot({ nomeGuerra: "zeca" }))).toBe("Zeca");
  });

  it("returns empty string when no war name", () => {
    expect(getPilotWarName(mockPilot({ nomeGuerra: "" }))).toBe("");
  });

  it("wraps display in quotes", () => {
    expect(getPilotWarNameDisplay(mockPilot({ nomeGuerra: "veloz" }))).toBe('"Veloz"');
    expect(getPilotWarNameDisplay(mockPilot({ nomeGuerra: "" }))).toBe("");
  });
});

describe("getPilotHighlightName", () => {
  it("uppercases normalized name", () => {
    expect(getPilotHighlightName("joão silva")).toBe("JOÃO SILVA");
  });

  it("keeps '-' for empty", () => {
    expect(getPilotHighlightName("")).toBe("-");
  });
});

describe("getPilotPhotoPath", () => {
  it("builds path from pilotoId", () => {
    expect(getPilotPhotoPath(mockPilot({ pilotoId: "p42" }))).toBe("/pilotos/p42.jpg");
  });

  it("returns null without pilotoId", () => {
    expect(getPilotPhotoPath(mockPilot({ pilotoId: "" }))).toBeNull();
    expect(getPilotPhotoPath(null)).toBeNull();
  });
});
