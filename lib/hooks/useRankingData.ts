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

export type RankingMetaData = Record<string, any>;

export function useRankingData() {
  const [rankingData, setRankingData] = useState<RankingData>({});
  const [rankingMeta, setRankingMeta] = useState<RankingMetaData>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const timeout = setTimeout(() => {
          controller.abort();
        }, 8000);

        const response = await fetch("/api/ranking", {
          cache: "no-store",
          signal: controller.signal,
        });

        clearTimeout(timeout);

        const json = await response.json();

        if (!response.ok) {
          throw new Error(json?.error || "Erro ao carregar os dados.");
        }

        setRankingData(json.data || {});
        setRankingMeta(json.meta || {});
        setCategories(json.categories || []);
      } catch (err: any) {
        if (err.name === "AbortError") {
          setError("Tempo de resposta excedido.");
        } else {
          setError(err.message || "Erro desconhecido.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();

    return () => controller.abort();
  }, [retryCount]);

  return {
    rankingData,
    rankingMeta,
    categories,
    loading,
    error,
    retry,
  };
}