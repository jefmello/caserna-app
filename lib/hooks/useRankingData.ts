import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

type CacheEntry = {
  data: RankingData;
  meta: RankingMetaData;
  categories: string[];
  timestamp: number;
};

// Cache com chave (categoria@competicao) para evitar dados stale
const cache = new Map<string, CacheEntry>();

const CACHE_TTL_MS = 55000;
const BASE_BACKOFF_MS = 2000;
const MAX_BACKOFF_MS = 60000;

/**
 * Calcula o delay com exponential backoff + jitter para evitar thundering herd.
 */
function getBackoffDelay(consecutiveFailures: number): number {
  const exponential = Math.min(
    BASE_BACKOFF_MS * 2 ** consecutiveFailures,
    MAX_BACKOFF_MS
  );
  const jitter = Math.random() * 0.3 * exponential;
  return exponential + jitter;
}

/**
 * Sanitiza mensagens de erro para não expor detalhes técnicos ao usuário.
 */
function sanitizeApiError(raw: string): string {
  if (/SyntaxError|Unexpected token|JSON|parse/i.test(raw)) {
    return "Erro ao processar os dados recebidos. Tente novamente.";
  }
  if (/AbortError|abort|signal|timeout|excedido/i.test(raw)) {
    return "Tempo de resposta excedido. Tente novamente em instantes.";
  }
  if (/Failed to fetch|NetworkError|network/i.test(raw)) {
    return "Não foi possível conectar ao servidor. Verifique sua internet.";
  }
  return raw;
}

/**
 * Gera a chave de cache com base no contexto atual (vazio = dados gerais).
 */
function getCacheKey(): string {
  return "global";
}

export function useRankingData({
  initialCategory = "Base",
  timeoutMs = 20000,
  revalidateIntervalMs = 60000,
}: UseRankingDataParams = {}): UseRankingDataReturn {
  const initialData = useMemo(() => {
    const entry = cache.get(getCacheKey());
    return entry ?? null;
  }, []);

  const [rankingData, setRankingData] = useState<RankingData>(
    () => initialData?.data ?? {}
  );
  const [rankingMeta, setRankingMeta] = useState<RankingMetaData>(
    () => initialData?.meta ?? {}
  );
  const [categories, setCategories] = useState<string[]>(
    () => initialData?.categories ?? []
  );
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const consecutiveFailuresRef = useRef(0);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Invalida o cache quando chamado — útil ao trocar de contexto.
   */
  const invalidateCache = useCallback(() => {
    cache.delete(getCacheKey());
  }, []);

  const retry = useCallback(() => {
    invalidateCache();
    setRetryCount((prev) => prev + 1);
    consecutiveFailuresRef.current = 0; // Reseta backoff no retry manual
  }, [invalidateCache]);

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

    async function loadData() {
      try {
        if (!isMountedRef.current) return;

        // Se cache válido e não é retry, usar cache
        const cKey = getCacheKey();
        const cached = cache.get(cKey);

        if (
          retryCount === 0 &&
          cached &&
          Date.now() - cached.timestamp < CACHE_TTL_MS
        ) {
          setRankingData(cached.data);
          setRankingMeta(cached.meta);
          setCategories(cached.categories);
          setLoading(false);
          consecutiveFailuresRef.current = 0;
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

        let json: RankingApiResponse;
        try {
          json = await response.json();
        } catch {
          // Erro de parse JSON — não expor stack trace
          if (!isMountedRef.current) return;
          setError("Erro ao processar os dados recebidos. Tente novamente.");
          consecutiveFailuresRef.current++;
          return;
        }

        if (!response.ok) {
          throw new Error(
            (json?.error as string) ||
              "Erro ao carregar os dados da classificação."
          );
        }

        if (!isMountedRef.current) return;

        // Atualiza cache compartilhado
        const entry: CacheEntry = {
          data: json.data || {},
          meta: json.meta || {},
          categories: json.categories || Object.keys(json.data || {}),
          timestamp: Date.now(),
        };
        cache.set(cKey, entry);

        setRankingData(entry.data);
        setRankingMeta(entry.meta);
        setCategories(entry.categories);
        consecutiveFailuresRef.current = 0; // Reseta falhas consecutivas
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          if (didTimeout && isMountedRef.current) {
            setError("Tempo de resposta excedido. Tente novamente em instantes.");
          }
          return;
        }

        // Log em development, não expõe stack em produção
        if (process.env.NODE_ENV === "development") {
          console.error("[Ranking API Error]", err);
        }

        if (isMountedRef.current) {
          const rawMessage =
            err instanceof Error ? err.message : "Erro desconhecido.";
          setError(sanitizeApiError(rawMessage));
          consecutiveFailuresRef.current++;
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    }

    loadData();

    // Revalidação periódica com exponential backoff em caso de falhas
    if (revalidateIntervalMs > 0) {
      const scheduleNext = () => {
        const failures = consecutiveFailuresRef.current;

        // Se há falhas consecutivas, usa backoff; senão, usa intervalo normal
        const delay =
          failures > 0
            ? getBackoffDelay(failures)
            : revalidateIntervalMs;

        intervalId = setTimeout(() => {
          if (!isMountedRef.current) return;

          loadData().then(() => {
            if (isMountedRef.current) {
              scheduleNext(); // Re-agenda após conclusão
            }
          });
        }, delay);
      };

      scheduleNext();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearTimeout(intervalId);
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
