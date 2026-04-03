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