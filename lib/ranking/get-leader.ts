export type RankingItem = {
  pos: number;
  piloto: string;
  pilotoId?: string;
  pontos: number;
  categoria: string;
  competicao: string;
};

type RankingResponse = {
  [categoria: string]: {
    T1: RankingItem[];
    T2: RankingItem[];
    T3: RankingItem[];
    Geral: RankingItem[];
  };
};

export async function getLeader(
  categoria: string,
  campeonato: string
) {
  try {
    const res = await fetch("/api/ranking", {
      cache: "no-store",
    });

    const data: RankingResponse = await res.json();

    const categoriaData = data[categoria];
    if (!categoriaData) return null;

    const lista = categoriaData[campeonato as keyof typeof categoriaData];
    if (!lista || lista.length === 0) return null;

    const leader = lista[0];
    const second = lista[1];

    const gap = second ? leader.pontos - second.pontos : 0;

    return {
      nome: leader.piloto,
      pontos: leader.pontos,
      pos: leader.pos,
      pilotoId: leader.pilotoId,
      gap,
    };
  } catch (err) {
    console.error("Erro ao buscar líder:", err);
    return null;
  }
}