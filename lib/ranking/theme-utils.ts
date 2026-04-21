/**
 * Temas visuais por categoria (Base, Graduados, Elite).
 * Cada tema define tokens de cor usados em bordas, backgrounds, textos, ícones e gráficos.
 * Esta é a ÚNICA fonte de temas visuais do aplicativo.
 */

export type CategoryAccent = "base" | "graduados" | "elite" | "neutral";

export type CategoryTheme = {
  shellGlow: string;
  primaryBorder: string;
  primaryRing: string;
  primaryBadge: string;
  primaryIconWrap: string;
  primaryIcon: string;
  heroBorder: string;
  heroBg: string;
  heroChip: string;
  titleBorder: string;
  titleBg: string;
  titlePill: string;
  titlePillText: string;
  titleIconWrap: string;
  titleIcon: string;
  titleSub: string;
  searchBorder: string;
  searchGlow: string;
  searchIcon: string;
  searchBadge: string;
  headerChip: string;
  tableHeadBg: string;
  statsSoft: string;
  statsIconWrap: string;
  statsIcon: string;
  chartBar: string;
  chartGrid: string;
  chartAxis: string;
  statAccentBg: string;
  statAccentRank: string;
  lineTrack: string;
  lineGlow: string;
  leaderGlow: string;
  darkAccentBorder: string;
  darkAccentBg: string;
  darkAccentBgSoft: string;
  darkAccentText: string;
  darkAccentIconWrap: string;
  darkAccentDivider: string;
  darkAccentCard: string;
  darkLeaderRow: string;
  darkSecondRow: string;
  darkThirdRow: string;
  darkTopBadge: string;
  darkChartBar: string;
};

const BASE_THEME: CategoryTheme = {
  shellGlow: "from-orange-500/10 via-white to-orange-100/60",
  primaryBorder: "border-orange-200/90",
  primaryRing: "via-orange-400/80",
  primaryBadge: "bg-orange-100 text-orange-800 border-orange-200",
  primaryIconWrap: "bg-orange-100",
  primaryIcon: "text-orange-700",
  heroBorder: "border-orange-200/80",
  heroBg: "from-orange-50 via-white to-orange-50/70",
  heroChip: "border-orange-200 bg-orange-100/80 text-orange-800",
  titleBorder: "border-orange-200/90",
  titleBg: "from-orange-50 via-white to-white",
  titlePill: "border-orange-200 bg-gradient-to-b from-orange-100 to-orange-200",
  titlePillText: "text-orange-950",
  titleIconWrap: "border-orange-200 bg-gradient-to-b from-orange-100 to-orange-200",
  titleIcon: "text-orange-700",
  titleSub: "text-orange-500/80",
  searchBorder: "border-orange-200/80",
  searchGlow: "focus-within:ring-orange-200/70",
  searchIcon: "text-orange-500",
  searchBadge: "border-orange-200 bg-orange-50 text-orange-700",
  headerChip: "border-orange-200 bg-orange-50 text-orange-700",
  tableHeadBg: "bg-orange-50/80",
  statsSoft: "from-orange-50 via-white to-orange-50/60",
  statsIconWrap: "bg-orange-100",
  statsIcon: "text-orange-700",
  chartBar: "#f97316",
  chartGrid: "rgba(249,115,22,0.12)",
  chartAxis: "#9a3412",
  statAccentBg: "border-orange-200 bg-orange-50",
  statAccentRank: "bg-orange-500 text-white",
  lineTrack: "from-orange-200 via-orange-300 to-orange-200",
  lineGlow: "bg-orange-300/50",
  leaderGlow: "shadow-[0_10px_22px_rgba(249,115,22,0.18)]",
  darkAccentBorder: "border-orange-500/30",
  darkAccentBg: "bg-orange-500/10",
  darkAccentBgSoft: "bg-orange-500/12",
  darkAccentText: "text-orange-300",
  darkAccentIconWrap: "bg-orange-500/15",
  darkAccentDivider: "bg-orange-500/20",
  darkAccentCard: "from-[#1a1a14] via-[#151922] to-[#111827]",
  darkLeaderRow:
    "bg-gradient-to-r from-orange-500/16 via-[#161e2b] to-[#111827] border-l-[4px] border-l-orange-400 shadow-[0_0_0_1px_rgba(249,115,22,0.16),0_12px_26px_rgba(0,0,0,0.32)]",
  darkSecondRow:
    "bg-gradient-to-r from-white/5 via-[#111827] to-[#111827] border-l-[4px] border-l-zinc-400 shadow-[0_0_0_1px_rgba(161,161,170,0.14),0_10px_22px_rgba(0,0,0,0.24)]",
  darkThirdRow:
    "bg-gradient-to-r from-amber-500/12 via-[#111827] to-[#111827] border-l-[4px] border-l-amber-500 shadow-[0_0_0_1px_rgba(245,158,11,0.16),0_10px_22px_rgba(0,0,0,0.24)]",
  darkTopBadge: "bg-orange-400 text-black",
  darkChartBar: "#fb923c",
};

const GRADUADOS_THEME: CategoryTheme = {
  shellGlow: "from-blue-500/10 via-white to-blue-100/60",
  primaryBorder: "border-blue-200/90",
  primaryRing: "via-blue-400/80",
  primaryBadge: "bg-blue-100 text-blue-800 border-blue-200",
  primaryIconWrap: "bg-blue-100",
  primaryIcon: "text-blue-700",
  heroBorder: "border-blue-200/80",
  heroBg: "from-blue-50 via-white to-blue-50/70",
  heroChip: "border-blue-200 bg-blue-100/80 text-blue-800",
  titleBorder: "border-blue-200/90",
  titleBg: "from-blue-50 via-white to-white",
  titlePill: "border-blue-200 bg-gradient-to-b from-blue-100 to-blue-200",
  titlePillText: "text-blue-950",
  titleIconWrap: "border-blue-200 bg-gradient-to-b from-blue-100 to-blue-200",
  titleIcon: "text-blue-700",
  titleSub: "text-blue-500/80",
  searchBorder: "border-blue-200/80",
  searchGlow: "focus-within:ring-blue-200/70",
  searchIcon: "text-blue-500",
  searchBadge: "border-blue-200 bg-blue-50 text-blue-700",
  headerChip: "border-blue-200 bg-blue-50 text-blue-700",
  tableHeadBg: "bg-blue-50/80",
  statsSoft: "from-blue-50 via-white to-blue-50/60",
  statsIconWrap: "bg-blue-100",
  statsIcon: "text-blue-700",
  chartBar: "#3b82f6",
  chartGrid: "rgba(59,130,246,0.12)",
  chartAxis: "#1d4ed8",
  statAccentBg: "border-blue-200 bg-blue-50",
  statAccentRank: "bg-blue-500 text-white",
  lineTrack: "from-blue-200 via-blue-300 to-blue-200",
  lineGlow: "bg-blue-300/50",
  leaderGlow: "shadow-[0_10px_22px_rgba(59,130,246,0.18)]",
  darkAccentBorder: "border-blue-500/30",
  darkAccentBg: "bg-blue-500/10",
  darkAccentBgSoft: "bg-blue-500/12",
  darkAccentText: "text-blue-300",
  darkAccentIconWrap: "bg-blue-500/15",
  darkAccentDivider: "bg-blue-500/20",
  darkAccentCard: "from-[#121b2a] via-[#111827] to-[#0f172a]",
  darkLeaderRow:
    "bg-gradient-to-r from-blue-500/12 via-[#161e2b] to-[#111827] border-l-[4px] border-l-blue-400",
  darkSecondRow:
    "bg-gradient-to-r from-white/5 via-[#111827] to-[#111827] border-l-[4px] border-l-zinc-400 shadow-[0_0_0_1px_rgba(161,161,170,0.14),0_10px_22px_rgba(0,0,0,0.24)]",
  darkThirdRow:
    "bg-gradient-to-r from-amber-500/12 via-[#111827] to-[#111827] border-l-[4px] border-l-amber-500 shadow-[0_0_0_1px_rgba(245,158,11,0.16),0_10px_22px_rgba(0,0,0,0.24)]",
  darkTopBadge: "bg-blue-400 text-black",
  darkChartBar: "#60a5fa",
};

const ELITE_THEME: CategoryTheme = {
  shellGlow: "from-yellow-500/10 via-white to-yellow-100/60",
  primaryBorder: "border-yellow-200/90",
  primaryRing: "via-yellow-400/80",
  primaryBadge: "bg-yellow-100 text-yellow-800 border-yellow-200",
  primaryIconWrap: "bg-yellow-100",
  primaryIcon: "text-yellow-700",
  heroBorder: "border-yellow-200/80",
  heroBg: "from-yellow-50 via-white to-yellow-50/70",
  heroChip: "border-yellow-200 bg-yellow-100/80 text-yellow-800",
  titleBorder: "border-yellow-200/90",
  titleBg: "from-yellow-50 via-white to-white",
  titlePill: "border-yellow-200 bg-gradient-to-b from-[#fff9d8] to-[#f8edb2]",
  titlePillText: "text-zinc-950",
  titleIconWrap: "border-yellow-200 bg-gradient-to-b from-[#fff9d8] to-[#f8edb2]",
  titleIcon: "text-yellow-700",
  titleSub: "text-yellow-700/70",
  searchBorder: "border-yellow-200/80",
  searchGlow: "focus-within:ring-yellow-200/70",
  searchIcon: "text-yellow-600",
  searchBadge: "border-yellow-200 bg-yellow-50 text-yellow-700",
  headerChip: "border-yellow-200 bg-yellow-50 text-yellow-700",
  tableHeadBg: "bg-yellow-50/80",
  statsSoft: "from-yellow-50 via-white to-yellow-50/60",
  statsIconWrap: "bg-yellow-100",
  statsIcon: "text-yellow-700",
  chartBar: "#facc15",
  chartGrid: "rgba(250,204,21,0.18)",
  chartAxis: "#a16207",
  statAccentBg: "border-yellow-200 bg-yellow-50",
  statAccentRank: "bg-yellow-400 text-black",
  lineTrack: "from-yellow-200 via-yellow-300 to-yellow-200",
  lineGlow: "bg-yellow-300/50",
  leaderGlow: "shadow-[0_10px_22px_rgba(234,179,8,0.18)]",
  darkAccentBorder: "border-yellow-500/30",
  darkAccentBg: "bg-yellow-500/10",
  darkAccentBgSoft: "bg-yellow-500/12",
  darkAccentText: "text-yellow-300",
  darkAccentIconWrap: "bg-yellow-500/15",
  darkAccentDivider: "bg-yellow-500/20",
  darkAccentCard: "from-[#1f1b10] via-[#151922] to-[#111827]",
  darkLeaderRow:
    "bg-gradient-to-r from-yellow-500/12 via-[#161e2b] to-[#111827] border-l-[4px] border-l-yellow-400",
  darkSecondRow:
    "bg-gradient-to-r from-white/5 via-[#111827] to-[#111827] border-l-[4px] border-l-zinc-400 shadow-[0_0_0_1px_rgba(161,161,170,0.14),0_10px_22px_rgba(0,0,0,0.24)]",
  darkThirdRow:
    "bg-gradient-to-r from-amber-500/12 via-[#111827] to-[#111827] border-l-[4px] border-l-amber-500 shadow-[0_0_0_1px_rgba(245,158,11,0.16),0_10px_22px_rgba(0,0,0,0.24)]",
  darkTopBadge: "bg-yellow-400 text-black",
  darkChartBar: "#facc15",
};

const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  Base: BASE_THEME,
  Graduados: GRADUADOS_THEME,
  Elite: ELITE_THEME,
};

/**
 * Cache memoization para evitar recriar objetos de tema a cada chamada.
 */
const THEME_CACHE = new Map<string, CategoryTheme>();

/**
 * Retorna o tema visual completo para uma categoria.
 * Usa cache para evitar alocação desnecessária.
 */
export function getCategoryTheme(category: string): CategoryTheme {
  const cached = THEME_CACHE.get(category);
  if (cached) return cached;

  const theme = CATEGORY_THEMES[category] ?? ELITE_THEME;
  THEME_CACHE.set(category, theme);
  return theme;
}

/**
 * Retorna estilos específicos para o card spotlight (destaque do líder).
 */
export function getSpotlightCategoryStyles(category: string, isDark: boolean) {
  if (isDark) {
    if (category === "Base") {
      return {
        leftCard:
          "border-orange-500/30 bg-[linear-gradient(180deg,#1f1b16_0%,#151922_48%,#111827_100%)]",
        leftSubcard:
          "border-orange-500/30 bg-[linear-gradient(180deg,rgba(249,115,22,0.12),rgba(17,24,39,0.96))]",
        badge:
          "border-orange-400/35 bg-[linear-gradient(180deg,rgba(251,146,60,0.32),rgba(124,45,18,0.92))] text-white shadow-[0_14px_26px_rgba(249,115,22,0.24)]",
        statCard:
          "border-orange-500/30 bg-[linear-gradient(135deg,#7c2d12_0%,#9a3412_48%,#7c2d12_100%)]",
        label: "text-orange-300",
        iconBubble: "border border-white/10 bg-white/10 text-white",
      };
    }

    if (category === "Graduados") {
      return {
        leftCard:
          "border-blue-500/30 bg-[linear-gradient(180deg,#14233d_0%,#151922_48%,#111827_100%)]",
        leftSubcard:
          "border-blue-500/30 bg-[linear-gradient(180deg,rgba(59,130,246,0.14),rgba(17,24,39,0.96))]",
        badge:
          "border-blue-300/35 bg-[linear-gradient(180deg,rgba(96,165,250,0.34),rgba(30,64,175,0.92))] text-white shadow-[0_14px_26px_rgba(59,130,246,0.22)]",
        statCard:
          "border-blue-500/30 bg-[linear-gradient(135deg,#274a9b_0%,#4169c6_52%,#274a9b_100%)]",
        label: "text-blue-300",
        iconBubble: "border border-white/10 bg-white/10 text-white",
      };
    }

    return {
      leftCard:
        "border-yellow-500/30 bg-[linear-gradient(180deg,#2a2412_0%,#151922_48%,#111827_100%)]",
      leftSubcard:
        "border-yellow-500/30 bg-[linear-gradient(180deg,rgba(234,179,8,0.14),rgba(17,24,39,0.96))]",
      badge:
        "border-yellow-300/35 bg-[linear-gradient(180deg,rgba(250,204,21,0.34),rgba(161,98,7,0.94))] text-white shadow-[0_14px_26px_rgba(234,179,8,0.22)]",
      statCard:
        "border-yellow-500/30 bg-[linear-gradient(135deg,#8a6a08_0%,#b88a10_48%,#8a6a08_100%)]",
      label: "text-yellow-300",
      iconBubble: "border border-white/10 bg-white/10 text-white",
    };
  }

  // Light mode
  if (category === "Base") {
    return {
      leftCard:
        "border-orange-200 bg-[linear-gradient(180deg,#fff7ed_0%,#ffedd5_46%,#fed7aa_100%)]",
      leftSubcard: "border-orange-200 bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_100%)]",
      badge:
        "border-orange-300 bg-[linear-gradient(180deg,#fb923c_0%,#ea580c_100%)] text-white shadow-[0_14px_24px_rgba(249,115,22,0.20)]",
      statCard:
        "border-orange-200 bg-[linear-gradient(135deg,#f97316_0%,#fb923c_50%,#ea580c_100%)]",
      label: "text-orange-600",
      iconBubble: "border border-white/20 bg-white/18 text-white",
    };
  }

  if (category === "Graduados") {
    return {
      leftCard: "border-blue-200 bg-[linear-gradient(180deg,#eff6ff_0%,#dbeafe_46%,#bfdbfe_100%)]",
      leftSubcard: "border-blue-200 bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_100%)]",
      badge:
        "border-blue-300 bg-[linear-gradient(180deg,#6ea0ff_0%,#3b82f6_100%)] text-white shadow-[0_14px_24px_rgba(59,130,246,0.20)]",
      statCard: "border-blue-200 bg-[linear-gradient(135deg,#4f7fdb_0%,#6e9bf1_52%,#456fc3_100%)]",
      label: "text-blue-600",
      iconBubble: "border border-white/20 bg-white/18 text-white",
    };
  }

  return {
    leftCard: "border-yellow-200 bg-[linear-gradient(180deg,#fefce8_0%,#fef3c7_46%,#fde68a_100%)]",
    leftSubcard: "border-yellow-200 bg-[linear-gradient(180deg,#fefce8_0%,#ffffff_100%)]",
    badge:
      "border-yellow-300 bg-[linear-gradient(180deg,#f5cd3a_0%,#d4a614_100%)] text-white shadow-[0_14px_24px_rgba(234,179,8,0.20)]",
    statCard: "border-yellow-200 bg-[linear-gradient(135deg,#b88a10_0%,#d4a614_52%,#9a7410_100%)]",
    label: "text-yellow-700",
    iconBubble: "border border-white/20 bg-white/18 text-white",
  };
}

/**
 * Normaliza uma categoria para o identificador de accent CSS.
 * Usado por múltiplos componentes para reagir a mudanças de categoria.
 */
export function normalizeCategoryAccent(
  category?: string | null
): "base" | "graduados" | "elite" | "neutral" {
  if (!category) return "neutral";

  const normalized = category
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  if (normalized === "base") return "base";
  if (normalized === "graduados") return "graduados";
  if (normalized === "elite") return "elite";

  return "neutral";
}
