/**
 * Global theme skins (not tied to category).
 * Users can switch between racing liveries independent of the category accent.
 * Persisted in localStorage under "caserna-theme-variant".
 */

export type ThemeVariant = "midnight" | "gulf" | "ferrari" | "stealth";

export type ThemeVariantTokens = {
  label: string;
  description: string;
  /** Full-page background gradient (dark context). */
  bgGradient: string;
  /** Accent color in "r, g, b" for streaks/glows. */
  accent: string;
  /** Hex swatch used in the picker UI. */
  swatch: string;
};

export const THEME_VARIANTS: Record<ThemeVariant, ThemeVariantTokens> = {
  midnight: {
    label: "Midnight",
    description: "Slate escuro com brilho âmbar",
    bgGradient: "linear-gradient(180deg,#04060b 0%,#0a0f1c 55%,#05070a 100%)",
    accent: "250, 204, 21",
    swatch: "#0a1020",
  },
  gulf: {
    label: "Gulf",
    description: "Azul profundo · laranja corrida",
    bgGradient: "linear-gradient(180deg,#001a3a 0%,#003876 55%,#001428 100%)",
    accent: "255, 102, 0",
    swatch: "#003876",
  },
  ferrari: {
    label: "Ferrari",
    description: "Carmesim profundo · amarelo",
    bgGradient: "linear-gradient(180deg,#180000 0%,#2d0000 55%,#0e0000 100%)",
    accent: "255, 242, 0",
    swatch: "#2d0000",
  },
  stealth: {
    label: "Stealth",
    description: "Preto fosco · prata discreta",
    bgGradient: "linear-gradient(180deg,#030303 0%,#080808 55%,#000000 100%)",
    accent: "192, 192, 192",
    swatch: "#080808",
  },
};

export const DEFAULT_THEME_VARIANT: ThemeVariant = "midnight";

export const THEME_VARIANT_STORAGE_KEY = "caserna-theme-variant";
export const THEME_VARIANT_EVENT = "caserna-theme-variant-change";

export function isThemeVariant(value: string | null | undefined): value is ThemeVariant {
  return value === "midnight" || value === "gulf" || value === "ferrari" || value === "stealth";
}
