/**
 * Escala tipográfica unificada do Caserna App.
 *
 * Todos os componentes devem usar APENAS estes 6 níveis.
 * Eliminar text-[Xpx] arbitrários — mapear para o nível mais próximo.
 *
 * Nível   | Tailwind  | px   | Uso típico
 * --------|-----------|------|----------------------------------
 * xxs     | 9px       | 9    | Micro-labels (badges, ranks numerados)
 * xs      | 10px      | 10   | Labels uppercase, tracking amplo
 * sm      | 12px      | 12   | Corpo secundário, subtitles, descrições
 * base    | 14px      | 14   | Corpo principal, nomes em listas
 * lg      | 16px      | 16   | Títulos de card, destaques médios
 * xl      | 20px      | 20   | Títulos de seção, headlines
 * 2xl     | 24px      | 24   | Números de destaque, hero stats
 * 3xl     | 30px      | 30   | Score de duelo, display numbers
 */

// Tailwind já fornece: text-xs(12px), text-sm(14px), text-base(16px),
// text-lg(18px), text-xl(20px), text-2xl(24px), text-3xl(30px)
// Definimos apenas os customizados que não existem no scale padrão.

export const TYPE_SCALE = {
  // Micro-labels (ranks numerados, badges mínimos)
  xxs: "text-[9px]",
  // Labels uppercase com tracking
  xs: "text-[10px]",
  // Corpo secundário, descrições
  sm: "text-[12px]",
  // Corpo principal, nomes
  base: "text-[14px]",
  // Títulos de card
  lg: "text-[16px]",
  // Títulos de seção
  xl: "text-[20px]",
  // Números de destaque
  "2xl": "text-[24px]",
  // Display / score de duelo
  "3xl": "text-[30px]",
} as const;

/**
 * Pesos tipográficos recomendados.
 * Regra: usar o peso MÍNIMO necessário para o nível hierárquico.
 * Se tudo é extrabold, nada se destaca.
 */
export const TYPE_WEIGHTS = {
  // Labels uppercase micro
  label: "font-bold", // 700
  // Corpo secundário
  bodySecondary: "font-medium", // 500
  // Corpo principal
  body: "font-normal", // 400
  // Nomes, títulos de lista
  title: "font-semibold", // 600
  // Títulos de card, headlines
  heading: "font-bold", // 700
  // Números de destaque, hero
  display: "font-extrabold", // 800 — RESERVADO para display
} as const;

/**
 * Tracking recomendado para labels uppercase.
 */
export const TYPE_TRACKING = {
  // Labels micro (9-10px)
  tight: "tracking-[0.08em]",
  // Labels padrão (10-12px)
  normal: "tracking-[0.12em]",
  // Labels proeminentes
  wide: "tracking-[0.16em]",
} as const;
