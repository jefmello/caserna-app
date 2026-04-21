"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useChampionship } from "@/context/championship-context";

type ErrorBannerProps = {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  hint?: string;
};

/**
 * Lista de mensagens de erro técnicas que devem ser sanitizadas
 * antes de serem exibidas ao usuário final.
 */
const KNOWN_TECHNICAL_ERRORS: [RegExp, string][] = [
  [
    /SyntaxError|Unexpected token|JSON|parse/i,
    "Erro ao processar os dados recebidos. Tente novamente.",
  ],
  [
    /AbortError|abort|signal/i,
    "A conexão foi interrompida. Verifique sua internet e tente novamente.",
  ],
  [
    /TypeError: Failed to fetch|NetworkError|fetch/i,
    "Não foi possível conectar ao servidor. Verifique sua internet.",
  ],
  [
    /timeout|Timeout|excedido/i,
    "O tempo de resposta excedeu o limite. Tente novamente em instantes.",
  ],
  [/ENOENT|not found|404/i, "Recurso não encontrado."],
];

function sanitizeErrorMessage(raw: string): string {
  for (const [pattern, friendly] of KNOWN_TECHNICAL_ERRORS) {
    if (pattern.test(raw)) return friendly;
  }
  return raw;
}

export default function ErrorBanner({
  message,
  onRetry,
  retryLabel = "Tentar novamente",
  hint,
}: ErrorBannerProps) {
  const { isDarkMode } = useChampionship();

  const friendlyMessage = sanitizeErrorMessage(message);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`mx-auto flex w-full max-w-2xl flex-col items-center gap-4 rounded-2xl border p-6 text-center transition-colors duration-300 ${
        isDarkMode
          ? "border-red-500/20 bg-red-950/30 text-red-200"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      <AlertTriangle
        className={`h-8 w-8 ${isDarkMode ? "text-red-400" : "text-red-500"}`}
        aria-hidden="true"
      />

      <div className="flex flex-col items-center gap-2">
        <p className="text-lg font-semibold">{friendlyMessage}</p>

        {hint && (
          <p className={`text-xs ${isDarkMode ? "text-red-300/60" : "text-red-500"}`}>{hint}</p>
        )}
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] ${
            isDarkMode
              ? "border border-red-500/30 bg-red-900/50 text-red-100 hover:bg-red-900/70"
              : "border border-red-300 bg-white text-red-700 hover:bg-red-100"
          }`}
          aria-label={retryLabel}
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          {retryLabel}
        </button>
      )}
    </div>
  );
}
