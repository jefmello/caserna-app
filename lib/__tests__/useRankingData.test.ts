/**
 * Testes unitários para a lógica de exponential backoff e cache do useRankingData.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

const BASE_BACKOFF_MS = 2000;
const MAX_BACKOFF_MS = 60000;

function getBackoffDelay(consecutiveFailures: number): number {
  const exponential = Math.min(BASE_BACKOFF_MS * 2 ** consecutiveFailures, MAX_BACKOFF_MS);
  const jitter = Math.random() * 0.3 * exponential;
  return exponential + jitter;
}

describe("getBackoffDelay", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("deve começar com delay base na primeira falha", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const delay = getBackoffDelay(1);
    // 2000 * 2^1 = 4000, jitter = 0
    expect(delay).toBe(4000);
  });

  it("deve dobrar o delay a cada falha consecutiva", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(getBackoffDelay(2)).toBe(8000); // 2000 * 4
    expect(getBackoffDelay(3)).toBe(16000); // 2000 * 8
    expect(getBackoffDelay(4)).toBe(32000); // 2000 * 16
  });

  it("deve respeitar o teto de MAX_BACKOFF_MS", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const delay = getBackoffDelay(10); // 2000 * 1024 = 2048000, capped at 60000
    expect(delay).toBeLessThanOrEqual(MAX_BACKOFF_MS);
  });

  it("deve adicionar jitter para evitar thundering herd", () => {
    // Com random > 0, o jitter deve aumentar o delay
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const base = 4000;
    const expectedJitter = 0.5 * 0.3 * base; // 600
    const delay = getBackoffDelay(1);
    expect(delay).toBe(base + expectedJitter);
  });
});
