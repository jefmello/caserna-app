"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log do erro para monitoramento
    if (process.env.NODE_ENV === "development") {
      console.error("[Error Boundary]", error);
    }
  }, [error]);

  const isNetworkError = error.message.includes("fetch") ||
    error.message.includes("network") ||
    error.message.includes("AbortError") ||
    error.message.includes("timeout");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div
        role="alert"
        aria-live="assertive"
        className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-red-500/20 bg-red-950/30 p-8 text-center dark:border-red-500/20 dark:bg-red-950/30"
      >
        <AlertTriangle className="h-12 w-12 text-red-400" aria-hidden="true" />

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-red-200">
            Algo deu errado
          </h2>
          <p className="text-sm text-red-300/80">
            {isNetworkError
              ? "Não foi possível carregar os dados. Verifique sua conexão e tente novamente."
              : "Ocorreu um erro inesperado. Tente recarregar a página."}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-900/50 px-4 py-2.5 text-sm font-medium text-red-100 transition-all duration-200 hover:bg-red-900/70 hover:scale-[1.03] active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Tentar novamente
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-all duration-200 hover:bg-zinc-700 hover:scale-[1.03] active:scale-[0.98]"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Ir para o início
          </Link>
        </div>

        {error.digest && process.env.NODE_ENV === "development" && (
          <p className="text-xs text-red-400/50 font-mono break-all">
            {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
