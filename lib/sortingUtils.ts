import type { RankingItem } from "@/types/ranking";

type SortableRankingItem = Pick<
  RankingItem,
  "pos" | "pontos" | "adv" | "participacoes" | "vitorias" | "poles" | "mv" | "podios"
>;

export function sortRanking<T extends SortableRankingItem>(items: T[]): T[] {
  if (!Array.isArray(items)) {
    throw new Error("Invalid input: expected an array of ranking items.");
  }

  return [...items].sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    if (a.adv !== b.adv) return a.adv - b.adv;
    if (b.participacoes !== a.participacoes) return b.participacoes - a.participacoes;
    if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
    if (b.poles !== a.poles) return b.poles - a.poles;
    if (b.mv !== a.mv) return b.mv - a.mv;
    if (b.podios !== a.podios) return b.podios - a.podios;
    return a.pos - b.pos;
  });
}

export default sortRanking;
