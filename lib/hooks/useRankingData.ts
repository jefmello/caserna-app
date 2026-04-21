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
  categoria?: string;
  campeonato?: string;
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

// Cache global do resultado raw da API — todos os hooks compartilham
// uma única Promise de fetch, evitando N requisições simultâneas
let sharedFetchPromise: Promise<RankingApiResponse> | null = null;
let sharedFetchTimestamp = 0;

const CACHE_TTL_MS = 120000;
const BASE_BACKOFF_MS = 2000;
const MAX_BACKOFF_MS = 60000;

/**
 * Calcula o delay com exponential backoff + jitter para evitar thundering herd.
 */
function getBackoffDelay(consecutiveFailures: number): number {
  const exponential = Math.min(BASE_BACKOFF_MS * 2 ** consecutiveFailures, MAX_BACKOFF_MS);
  const jitter = Math.random() * 0.3 * exponential;
  return exponential + jitter;
}

/**
 * Fetch compartilhado — evita que múltiplos hooks disparem requisições
 * simultâneas para a mesma URL. Todos os hooks compartilham a mesma
 * Promise enquanto ela estiver dentro do TTL.
 */
function getSharedFetch(): Promise<RankingApiResponse> {
  const now = Date.now();
  // Reusa Promise in-flight ou cacheada dentro do TTL
  if (sharedFetchPromise && now - sharedFetchTimestamp < CACHE_TTL_MS) {
    return sharedFetchPromise;
  }

  sharedFetchPromise = fetch("/api/ranking").then(async (res) => {
    const json = await res.json();
    if (!res.ok) {
      throw new Error((json?.error as string) || "Erro ao carregar os dados da classificação.");
    }
    return json as RankingApiResponse;
  });
  sharedFetchTimestamp = now;

  // Limpa referência quando a Promise terminar (com ou sem erro)
  // para que o próximo ciclo possa tentar novamente
  sharedFetchPromise.catch(() => {}); // evita unhandled rejection
  sharedFetchPromise.finally(() => {
    // Mantém a Promise por mais um breve período para que outros
    // hooks que montarem logo depois possam reusá-la
    setTimeout(() => {
      sharedFetchPromise = null;
    }, 2000);
  });

  return sharedFetchPromise;
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
 * Gera a chave de cache com base na categoria e campeonato.
 * Ex: "Elite@Geral", "Base@T1"
 */
function getCacheKey(categoria?: string, campeonato?: string): string {
  return `${categoria || "global"}@${campeonato || "geral"}`;
}

export function useRankingData({
  initialCategory = "Elite",
  timeoutMs: _timeoutMs = 20000,
  revalidateIntervalMs = 60000,
  categoria,
  campeonato,
}: UseRankingDataParams = {}): UseRankingDataReturn {
  const cKey = getCacheKey(categoria, campeonato);

  const initialData = useMemo(() => {
    const entry = cache.get(cKey);
    return entry ?? null;
  }, [cKey]);

  const [rankingData, setRankingData] = useState<RankingData>(() => initialData?.data ?? {});
  const [rankingMeta, setRankingMeta] = useState<RankingMetaData>(() => initialData?.meta ?? {});
  const [categories, setCategories] = useState<string[]>(() => initialData?.categories ?? []);
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
    cache.delete(cKey);
  }, [cKey]);

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

      return categories.includes(currentCategory) ? currentCategory : categories[0];
    },
    [categories, initialCategory]
  );

  useEffect(() => {
    let intervalId: ReturnType<typeof setTimeout> | null = null;

    async function loadData() {
      try {
        if (!isMountedRef.current) return;

        // Se cache válido e não é retry, usar cache
        const cached = cache.get(cKey);

        if (retryCount === 0 && cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
          setRankingData(cached.data);
          setRankingMeta(cached.meta);
          setCategories(cached.categories);
          setLoading(false);
          consecutiveFailuresRef.current = 0;
          return;
        }

        setLoading(true);
        setError("");

        // Usa fetch compartilhado para evitar N requisições simultâneas
        let json: RankingApiResponse;
        try {
          json = await getSharedFetch();
        } catch {
          if (!isMountedRef.current) return;
          setError("Erro ao processar os dados recebidos. Tente novamente.");
          consecutiveFailuresRef.current++;
          return;
        }

        if (!isMountedRef.current) return;

        // Atualiza cache compartilhado
        const newCategories: string[] = json.categories || Object.keys(json.data || {});

        // Estabiliza referência: só cria novo array se o conteúdo mudou
        const prevCached = cache.get(cKey);
        const stableCategories =
          prevCached?.categories &&
          prevCached.categories.length === newCategories.length &&
          prevCached.categories.every((c, i) => c === newCategories[i])
            ? prevCached.categories
            : newCategories;

        const entry: CacheEntry = {
          data: json.data || {},
          meta: json.meta || {},
          categories: stableCategories,
          timestamp: Date.now(),
        };
        cache.set(cKey, entry);

        setRankingData(entry.data);
        setRankingMeta(entry.meta);
        setCategories(entry.categories);
        consecutiveFailuresRef.current = 0;
      } catch (err: unknown) {
        if (isMountedRef.current) {
          const rawMessage = err instanceof Error ? err.message : "Erro desconhecido.";
          setError(sanitizeApiError(rawMessage));
          consecutiveFailuresRef.current++;
        }
      } finally {
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
        const delay = failures > 0 ? getBackoffDelay(failures) : revalidateIntervalMs;

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
      if (intervalId) clearTimeout(intervalId);
    };
  }, [retryCount, revalidateIntervalMs, cKey]);

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
    [rankingData, rankingMeta, categories, loading, error, retryCount, retry, syncCategory]
  );
}

export default useRankingData;
