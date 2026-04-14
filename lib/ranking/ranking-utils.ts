/**
 * Barrel file — re-exporta todos os módulos de ranking.
 * Mantido para compatibilidade com imports existentes.
 *
 * Módulos especializados:
 * - pilot-name-utils.ts   → formatação de nomes
 * - ranking-sorting.ts    → ordenação de classificação
 * - pilot-trend.ts        → tendência de posição
 * - pilot-stats.ts        → métricas e estatísticas
 * - competition-utils.ts  → labels e duelo
 * - theme-utils.ts        → temas visuais por categoria
 * - visual-styles.ts      → estilos Top 6 e cores
 * - sponsor-logos.ts      → logos de patrocinadores
 */

// Nome de pilotos
export {
  normalizePilotName,
  getPilotNameParts,
  getPilotFirstAndLastName,
  getPilotWarName,
  getPilotWarNameDisplay,
  getPilotHighlightName,
  getPilotPhotoPath,
} from "@/lib/ranking/pilot-name-utils";

// Ordenação
export { sortRanking } from "@/lib/ranking/ranking-sorting";

// Tendência de posição
export {
  type PilotTrendStatus,
  getPilotPositionInList,
  getPilotTrendStatus,
  getTrendVisual,
} from "@/lib/ranking/pilot-trend";

// Métricas e stats
export {
  getGapToLeader,
  getPerformancePercentage,
  getSelectedPilotBestAttribute,
  getPilotConsistencyLabel,
  getPilotMomentumLabel,
  getPilotEfficiency,
  getTopMetricRanking,
  getTopPointsChartData,
} from "@/lib/ranking/pilot-stats";

// Competição e duelos
export {
  competitionLabels,
  getTitleFightStatus,
  getComparisonWinner,
  getComparisonCardTone,
  getDuelWinnerLabel,
  getDuelNarrative,
  getDuelProfileLabel,
} from "@/lib/ranking/competition-utils";

// Temas visuais
export {
  getCategoryTheme,
  getSpotlightCategoryStyles,
  normalizeCategoryAccent,
  type CategoryAccent,
} from "@/lib/ranking/theme-utils";

// Estilos visuais
export {
  categoryColors,
  getTop6RowStyles,
} from "@/lib/ranking/visual-styles";

// Patrocinadores
export { sponsorLogos } from "@/lib/ranking/sponsor-logos";
