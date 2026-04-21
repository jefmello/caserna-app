import { describe, it, expect } from "vitest";
import {
  getCategoryTheme,
  normalizeCategoryAccent,
  getSpotlightCategoryStyles,
} from "@/lib/ranking/theme-utils";

describe("getCategoryTheme", () => {
  it("returns distinct themes per known category", () => {
    const base = getCategoryTheme("Base");
    const graduados = getCategoryTheme("Graduados");
    const elite = getCategoryTheme("Elite");

    expect(base.chartBar).not.toBe(graduados.chartBar);
    expect(graduados.chartBar).not.toBe(elite.chartBar);
  });

  it("falls back to Elite for unknown category", () => {
    const unknown = getCategoryTheme("Xpto");
    const elite = getCategoryTheme("Elite");
    expect(unknown).toEqual(elite);
  });

  it("memoizes: returns same instance on repeated call", () => {
    const a = getCategoryTheme("Base");
    const b = getCategoryTheme("Base");
    expect(a).toBe(b);
  });
});

describe("normalizeCategoryAccent", () => {
  it("maps known categories case/accent-insensitively", () => {
    expect(normalizeCategoryAccent("Base")).toBe("base");
    expect(normalizeCategoryAccent("BASE")).toBe("base");
    expect(normalizeCategoryAccent("Graduados")).toBe("graduados");
    expect(normalizeCategoryAccent("gradúados")).toBe("graduados");
    expect(normalizeCategoryAccent("Elite")).toBe("elite");
  });

  it("returns neutral for unknown/empty", () => {
    expect(normalizeCategoryAccent()).toBe("neutral");
    expect(normalizeCategoryAccent(null)).toBe("neutral");
    expect(normalizeCategoryAccent("")).toBe("neutral");
    expect(normalizeCategoryAccent("Xpto")).toBe("neutral");
  });
});

describe("getSpotlightCategoryStyles", () => {
  it("returns different palettes per category in dark mode", () => {
    const base = getSpotlightCategoryStyles("Base", true);
    const grad = getSpotlightCategoryStyles("Graduados", true);
    const elite = getSpotlightCategoryStyles("Elite", true);
    expect(base.label).toBe("text-orange-300");
    expect(grad.label).toBe("text-blue-300");
    expect(elite.label).toBe("text-yellow-300");
  });

  it("returns different styles between dark and light", () => {
    const dark = getSpotlightCategoryStyles("Base", true);
    const light = getSpotlightCategoryStyles("Base", false);
    expect(dark.badge).not.toBe(light.badge);
  });
});
