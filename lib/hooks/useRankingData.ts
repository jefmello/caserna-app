import { useCallback, useEffect, useState } from "react";
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

export function useRankingData({
  initialCategory = "Base",
  timeoutMs = 8000,
}: UseRankingDataParams = {}): UseRankingDataReturn {
  const [rankingData, setRankingData] = useState<RankingData>({});
  const [rankingMeta, setRankingMeta] = useState<RankingMetaData>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
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
    let didTimeout = false;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        timeoutId = setTimeout(() => {
          didTimeout = true;
          controller.abort("request-timeout");
        }, timeoutMs);

        const response = await fetch("/api/ranking", {
          cache: "no-store",
          signal: controller.signal,
        });

        const json: RankingApiResponse = await response.json();

        if (!response.ok) {
          throw new Error(json?.error || "Erro ao carregar os dados.");
        }

        setRankingData(json.data || {});
        setRankingMeta(json.meta || {});

        const nextCategories = json.categories || Object.keys(json.data || {});
        setCategories(nextCategories);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          if (didTimeout) {
            setError("Tempo de resposta excedido. Verifique a conexão.");
          }
          return;
        }

        console.error(err);
        setError(err instanceof Error ? err.message : "Erro desconhecido.");
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        setLoading(false);
      }
    }

    loadData();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      controller.abort("effect-cleanup");
    };
  }, [retryCount, timeoutMs]);

  return {
    rankingData,
    rankingMeta,
    categories,
    loading,
    error,
    retryCount,
    retry,
    syncCategory,
  };
}

export default useRankingData;
