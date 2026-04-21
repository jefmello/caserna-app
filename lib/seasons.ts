/**
 * Definições de temporadas do campeonato Caserna Kart Racing.
 * Cada temporada representa um ano/completa edição do campeonato.
 */

export type Season = {
  year: number;
  label: string;
  isActive: boolean;
  startDate: string;
  endDate: string | null;
  champion:
    | {
        categoria: string;
        piloto: string;
        pontos: number;
      }[]
    | null;
};

/**
 * Temporadas históricas do campeonato.
 * Adicionar novas temporadas aqui quando uma nova edição começar.
 */
export const SEASONS: Season[] = [
  {
    year: 2025,
    label: "Temporada 2025",
    isActive: true,
    startDate: "2025-03-01",
    endDate: null,
    champion: null, // será preenchido ao final da temporada
  },
  // Adicione temporadas passadas aqui quando necessário:
  // {
  //   year: 2024,
  //   label: "Temporada 2024",
  //   isActive: false,
  //   startDate: "2024-03-01",
  //   endDate: "2024-11-30",
  //   champion: [
  //     { categoria: "Base", piloto: "Fulano", pontos: 245 },
  //     { categoria: "Graduados", piloto: "Ciclano", pontos: 260 },
  //     { categoria: "Elite", piloto: "Beltrano", pontos: 280 },
  //   ],
  // },
];

/**
 * Retorna a temporada ativa.
 */
export function getActiveSeason(): Season | undefined {
  return SEASONS.find((s) => s.isActive);
}

/**
 * Retorna todas as temporadas finalizadas.
 */
export function getCompletedSeasons(): Season[] {
  return SEASONS.filter((s) => !s.isActive && s.endDate !== null);
}

/**
 * Retorna todas as temporadas (ativas + finalizadas).
 */
export function getAllSeasons(): Season[] {
  return SEASONS;
}

/**
 * Chave de localStorage para dados arquivados de temporadas.
 */
export const SEASON_STORAGE_KEY = "caserna-archived-seasons";

/**
 * Dados arquivados de uma temporada (snapshot do ranking final).
 */
export type ArchivedSeasonData = {
  season: Season;
  champions: {
    categoria: string;
    competicao: string;
    piloto: string;
    pilotoId: string;
    pontos: number;
    vitorias: number;
    poles: number;
    mv: number;
    podios: number;
  }[];
  archivedAt: string; // ISO date
};

/**
 * Salva snapshot de uma temporada finalizada no localStorage.
 */
export function archiveSeason(data: ArchivedSeasonData): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getArchivedSeasons();
    // Remove duplicata se existir
    const filtered = existing.filter((s) => s.season.year !== data.season.year);
    filtered.push(data);
    // Ordena por ano decrescente
    filtered.sort((a, b) => b.season.year - a.season.year);
    window.localStorage.setItem(SEASON_STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // Ignora erro de armazenamento
  }
}

/**
 * Retorna todas as temporadas arquivadas no localStorage.
 */
export function getArchivedSeasons(): ArchivedSeasonData[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(SEASON_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ArchivedSeasonData[];
  } catch {
    return [];
  }
}

/**
 * Lista combinada de temporadas: arquivadas + definidas no código.
 */
export function getCombinedSeasons(): (Season | ArchivedSeasonData["season"])[] {
  const archived = getArchivedSeasons().map((a) => a.season);
  const defined = SEASONS.filter((s) => !archived.some((a) => a.year === s.year));
  return [...archived, ...defined].sort((a, b) => b.year - a.year);
}
