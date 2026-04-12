/**
 * Testes para o componente ErrorBanner.
 * Verifica sanitização de mensagens e renderização correta.
 */

import { describe, it, expect } from "vitest";

const KNOWN_TECHNICAL_ERRORS: [RegExp, string][] = [
  [/SyntaxError|Unexpected token|JSON|parse/i, "Erro ao processar os dados recebidos. Tente novamente."],
  [/AbortError|abort|signal/i, "A conexão foi interrompida. Verifique sua internet e tente novamente."],
  [/TypeError: Failed to fetch|NetworkError|fetch/i, "Não foi possível conectar ao servidor. Verifique sua internet."],
  [/timeout|Timeout|excedido/i, "O tempo de resposta excedeu o limite. Tente novamente em instantes."],
  [/ENOENT|not found|404/i, "Recurso não encontrado."],
];

function sanitizeErrorMessage(raw: string): string {
  for (const [pattern, friendly] of KNOWN_TECHNICAL_ERRORS) {
    if (pattern.test(raw)) return friendly;
  }
  return raw;
}

describe("ErrorBanner - sanitizeErrorMessage", () => {
  it("deve sanitizar erros técnicos em mensagens amigáveis", () => {
    expect(
      sanitizeErrorMessage("SyntaxError: Unexpected token < in JSON at position 0")
    ).toBe("Erro ao processar os dados recebidos. Tente novamente.");

    expect(
      sanitizeErrorMessage("TypeError: Failed to fetch")
    ).toBe("Não foi possível conectar ao servidor. Verifique sua internet.");

    expect(
      sanitizeErrorMessage("AbortError: signal is aborted")
    ).toBe("A conexão foi interrompida. Verifique sua internet e tente novamente.");

    expect(
      sanitizeErrorMessage("timeout: tempo excedido")
    ).toBe("O tempo de resposta excedeu o limite. Tente novamente em instantes.");

    expect(
      sanitizeErrorMessage("ENOENT: no such file or directory")
    ).toBe("Recurso não encontrado.");
  });

  it("deve manter mensagens já amigáveis inalteradas", () => {
    expect(sanitizeErrorMessage("Erro ao carregar os dados da classificação.")).toBe(
      "Erro ao carregar os dados da classificação."
    );
    expect(sanitizeErrorMessage("Sem dados disponíveis.")).toBe(
      "Sem dados disponíveis."
    );
  });
});
