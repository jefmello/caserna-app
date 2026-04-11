import { useCallback, useEffect, useMemo, useState } from "react";
import type { RankingData, RankingMetaData } from "@/types/ranking";

type RankingApiResponse = {
  categories?: string[];
  data?: RankingData;
  meta?: RankingMetaData;
  error?: string;
};

type UseRankingDataParams = {
  initialCategory?: string;
  timeoutMs?: number;
  /**
   * Intervalo em ms para revalidação automática dos dados.
   * Define 0 para desativar revalidação periódica.
   * Padrão: 60000ms (1 minuto) — respeita o revalidate=120 da API route.
   */
  revalidateIntervalMs?: number;
};

type UseRankingDataReturn = {
  rankingData: RankingData;
  rankingMeta: RankingMetaData;
  categories: string[];
  loading: boolean;
  error: string;
  retryCount: number;
  retry: () => void;
  syncCategory: (currentCategory: string) => string;
};

// Cache em módulo para compartilhar entre instâncias do hook
let sharedCache: {
  data: RankingData;
  meta: RankingMetaData;
  categories: string[];
  timestamp: number;
} | null = null;

const CACHE_TTL_MS = 55000; // Um pouco menos que o revalidate=120 da API

export function useRankingData({
  initialCategory = "Base",
  timeoutMs = 20000,
  revalidateIntervalMs = 60000,
}: UseRankingDataParams = {}): UseRankingDataReturn {
  const [rankingData, setRankingData] = useState<RankingData>(
    () => sharedCache?.data ?? {}
  );
  const [rankingMeta, setRankingMeta] = useState<RankingMetaData>(
    () => sharedCache?.meta ?? {}
  );
  const [categories, setCategories] = useState<string[]>(
    () => sharedCache?.categories ?? []
  );
  const [loading, setLoading] = useState(!sharedCache);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  const syncCategory = useCallback(
    (currentCategory: string) => {
      if (categories.length === 0) {
        return currentCategory || initialCategory;
      }

      return categories.includes(currentCategory)
        ? currentCategory
        : categories[0];
    },
    [categories, initialCategory]
  );

  useEffect(() => {
    const controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let didTimeout = false;
    let isMounted = true;

    async function loadData() {
      try {
        if (!isMounted) return;

        // Se cache válido e não é retry, usar cache
        if (
          retryCount === 0 &&
          sharedCache &&
          Date.now() - sharedCache.timestamp < CACHE_TTL_MS
        ) {
          setRankingData(sharedCache.data);
          setRankingMeta(sharedCache.meta);
          setCategories(sharedCache.categories);
          setLoading(false);
          return;
        }

        setLoading(true);
        setError("");

        timeoutId = setTimeout(() => {
          didTimeout = true;
          controller.abort();
        }, timeoutMs);

        const response = await fetch("/api/ranking", {
          signal: controller.signal,
        });

        const json: RankingApiResponse = await response.json();

        if (!response.ok) {
          throw new Error(
            json?.error || "Erro ao carregar os dados da classificação."
          );
        }

        if (!isMounted) return;

        // Atualiza cache compartilhado
        sharedCache = {
          data: json.data || {},
          meta: json.meta || {},
          categories: json.categories || Object.keys(json.data || {}),
          timestamp: Date.now(),
        };

        setRankingData(sharedCache.data);
        setRankingMeta(sharedCache.meta);
        setCategories(sharedCache.categories);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          if (didTimeout && isMounted) {
            setError(
              "Tempo de resposta excedido ao carregar a classificação. Tente novamente em instantes."
            );
          }
          return;
        }

        console.error(err);

        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Erro desconhecido ao carregar a classificação."
          );
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    // Revalidação periódica
    if (revalidateIntervalMs > 0) {
      intervalId = setInterval(() => {
        if (isMounted) {
          loadData();
        }
      }, revalidateIntervalMs);
    }

    return () => {
      isMounted = false;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (intervalId) {
        clearInterval(intervalId);
      }

      controller.abort();
    };
  }, [retryCount, timeoutMs, revalidateIntervalMs]);

  return useMemo<UseRankingDataReturn>(
    () => ({
      rankingData,
      rankingMeta,
      categories,
      loading,
      error,
      retryCount,
      retry,
      syncCategory,
    }),
    [
      rankingData,
      rankingMeta,
      categories,
      loading,
      error,
      retryCount,
      retry,
      syncCategory,
    ]
  );
}

export default useRankingData;