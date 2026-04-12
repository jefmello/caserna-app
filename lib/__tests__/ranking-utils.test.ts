/**
 * Testes unitários para as funções utilitárias de parsing de CSV na route de ranking.
 * Extraímos as funções puras para testar isoladamente.
 */

import { describe, it, expect } from "vitest";

// Funções extraídas do route.ts para teste unitário
function normalizeText(value: string) {
  return (value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeName(value: string) {
  if (!value) return "";
  return value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeCategory(value: string) {
  const v = normalizeText(value);
  if (v === "base") return "Base";
  if (v === "graduados") return "Graduados";
  if (v === "elite") return "Elite";
  return value?.trim() || "Base";
}

function normalizeCompetition(value: string) {
  const v = normalizeText(value).toUpperCase();
  if (v === "T1") return "T1";
  if (v === "T2") return "T2";
  if (v === "T3") return "T3";
  if (v === "GERAL") return "GERAL";
  return (value || "").trim().toUpperCase();
}

function toNumber(value: string) {
  if (!value) return 0;
  const cleaned = value.replace(/\./g, "").replace(",", ".").trim();
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
}

function detectSeparator(line: string) {
  const commaCount = (line.match(/,/g) || []).length;
  const semicolonCount = (line.match(/;/g) || []).length;
  const tabCount = (line.match(/\t/g) || []).length;
  if (tabCount > commaCount && tabCount > semicolonCount) return "\t";
  if (semicolonCount > commaCount) return ";";
  return ",";
}

describe("normalizeText", () => {
  it("deve normalizar texto para lowercase sem acentos", () => {
    expect(normalizeText("João")).toBe("joao");
    expect(normalizeText("  São Paulo  ")).toBe("sao paulo");
    expect(normalizeText("")).toBe("");
    expect(normalizeText("   ")).toBe("");
  });
});

describe("normalizeName", () => {
  it("deve capitalizar corretamente nomes próprios", () => {
    expect(normalizeName("joão da silva")).toBe("João Da Silva");
    expect(normalizeName("  maria   souza  ")).toBe("Maria Souza");
    expect(normalizeName("")).toBe("");
  });
});

describe("normalizeCategory", () => {
  it("deve normalizar categorias conhecidas", () => {
    expect(normalizeCategory("base")).toBe("Base");
    expect(normalizeCategory("BASE")).toBe("Base");
    expect(normalizeCategory("Graduados")).toBe("Graduados");
    expect(normalizeCategory("graduados")).toBe("Graduados");
    expect(normalizeCategory("elite")).toBe("Elite");
    expect(normalizeCategory("ELITE")).toBe("Elite");
    expect(normalizeCategory("")).toBe("Base");
    expect(normalizeCategory("invalida")).toBe("invalida");
  });
});

describe("normalizeCompetition", () => {
  it("deve normalizar competições conhecidas", () => {
    expect(normalizeCompetition("T1")).toBe("T1");
    expect(normalizeCompetition("t1")).toBe("T1");
    expect(normalizeCompetition("T2")).toBe("T2");
    expect(normalizeCompetition("T3")).toBe("T3");
    expect(normalizeCompetition("GERAL")).toBe("GERAL");
    expect(normalizeCompetition("geral")).toBe("GERAL");
    expect(normalizeCompetition("INVALID")).toBe("INVALID");
  });
});

describe("toNumber", () => {
  it("deve converter strings numéricas corretamente", () => {
    expect(toNumber("35")).toBe(35);
    expect(toNumber("35,5")).toBe(35.5);
    expect(toNumber("1.234,56")).toBe(1234.56);
    expect(toNumber("")).toBe(0);
    expect(toNumber("invalid")).toBe(0);
    expect(toNumber("  42  ")).toBe(42);
  });
});

describe("detectSeparator", () => {
  it("deve detectar vírgula como separador padrão", () => {
    expect(detectSeparator("a,b,c")).toBe(",");
  });

  it("deve detectar ponto e vírgula quando predominante", () => {
    expect(detectSeparator("a;b;c")).toBe(";");
  });

  it("deve detectar tab quando predominante", () => {
    expect(detectSeparator("a\tb\tc")).toBe("\t");
  });
});
