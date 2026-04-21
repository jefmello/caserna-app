"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import type { RankingData, RankingMetaData } from "@/types/ranking";

type RankingApiResponse = {
  categories?: string[];
  data?: RankingData;
  meta?: RankingMetaData;
  error?: string;
};

type UseRankingDataParams = {
  initialCategory?: string;
  revalidateIntervalMs?: number;
  /** @deprecated handled by QueryClient defaults now */
  timeoutMs?: number;
  /** @deprecated filters are applied downstream; not used by the query */
  categoria?: string;
  /** @deprecated filters are applied downstream; not used by the query */
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

const QUERY_KEY = ["ranking"] as const;

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
  if (/429|rate/i.test(raw)) {
    return "Muitas requisições. Aguarde alguns segundos.";
  }
  return raw;
}

async function fetchRanking(): Promise<RankingApiResponse> {
  const res = await fetch("/api/ranking");
  const json = (await res.json()) as RankingApiResponse;
  if (!res.ok) {
    throw new Error(json?.error || `HTTP ${res.status}`);
  }
  return json;
}

export function useRankingData({
  initialCategory = "Elite",
  revalidateIntervalMs = 60_000,
}: UseRankingDataParams = {}): UseRankingDataReturn {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchRanking,
    refetchInterval: revalidateIntervalMs > 0 ? revalidateIntervalMs : false,
  });

  const rankingData = query.data?.data ?? {};
  const rankingMeta = query.data?.meta ?? {};
  const categories = useMemo(
    () => query.data?.categories ?? Object.keys(query.data?.data ?? {}),
    [query.data]
  );

  const retry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  }, [queryClient]);

  const syncCategory = useCallback(
    (currentCategory: string) => {
      if (categories.length === 0) return currentCategory || initialCategory;
      return categories.includes(currentCategory) ? currentCategory : categories[0];
    },
    [categories, initialCategory]
  );

  const errorMessage = query.error instanceof Error ? sanitizeApiError(query.error.message) : "";

  return {
    rankingData,
    rankingMeta,
    categories,
    loading: query.isPending,
    error: errorMessage,
    retryCount: query.failureCount,
    retry,
    syncCategory,
  };
}

export default useRankingData;
