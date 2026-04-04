import { useCallback, useEffect, useState } from "react";

export type RankingItem = {
  pos: number;
  pilotoId: string;
  piloto: string;
  nomeGuerra: string;
  pontos: number;
  adv: number;
  participacoes: number;
  vitorias: number;
  poles: number;
  mv: number;
  podios: number;
  descarte: number;
  categoriaAtual: string;
  competicao: string;
  categoria: string;
};

export type RankingByCompetition = Record<string, RankingItem[]>;
export type RankingData = Record<string, RankingByCompetition>;

export type RankingMetaPilot = {
  pos: number;
  pilotoId: string;
  piloto: string;
  nomeGuerra: string;
  pontos: number;
  adv: number;
  participacoes: number;
  vitorias: number;
  poles: number;
  mv: number;
  podios: number;
  descarte: number;
};

export type RankingCompetitionMeta = {
  summary: {
    totalPilots: number;
    leaderPoints: number;
    vicePoints: number;
    leaderAdvantage: number;
    top6CutPoints: number;
    avgPoints: number;
    totalVictories: number;
    totalPodiums: number;
  };
  radar: {
    hottestPilot: RankingMetaPilot | null;
    hottestLabel: string;
    podiumPressure: number;
    titleHeat: string;
  };
  titleFight: {
    label: string;
    tone: string;
  };
  bestEfficiencyPilot: RankingMetaPilot | null;
};

export type RankingMetaData = Record<string, Record<string, RankingCompetitionMeta>>;

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

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        timeoutId = setTimeout(() => {
          controller.abort();
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
        console.error(err);

        if (err instanceof DOMException && err.name === "AbortError") {
          setError("Tempo de resposta excedido. Verifique a conexão.");
          return;
        }

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

      controller.abort();
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
