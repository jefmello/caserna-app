import type { getCategoryTheme as _getCategoryTheme } from "@/lib/ranking/theme-utils";

/**
 * Cores padrão por categoria para badges simples.
 */
export const categoryColors: Record<string, string> = {
  Base: "bg-orange-50 text-orange-700 border-orange-200",
  Graduados: "bg-blue-50 text-blue-700 border-blue-200",
  Elite: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

/**
 * Retorna estilos visuais para posição no Top 6 (cards de troféu).
 */
export function getTop6RowStyles(position: number) {
  switch (position) {
    case 1:
      return {
        row: "border-l-[4px] border-l-yellow-500 bg-gradient-to-r from-yellow-100 via-yellow-50 to-white shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_0_0_1px_rgba(234,179,8,0.16),0_10px_24px_rgba(234,179,8,0.18)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_0_0_1px_rgba(234,179,8,0.22),0_14px_28px_rgba(234,179,8,0.24)]",
        badge: "bg-yellow-400 text-black",
        points: "text-yellow-700",
        name: "text-zinc-950",
        chip: "border-yellow-300 bg-yellow-100 text-yellow-800",
      };
    case 2:
      return {
        row: "border-l-[4px] border-l-zinc-400 bg-gradient-to-r from-zinc-100 via-zinc-50 to-white shadow-[0_0_0_1px_rgba(161,161,170,0.14),0_8px_20px_rgba(113,113,122,0.12)] hover:shadow-[0_0_0_1px_rgba(161,161,170,0.18),0_12px_24px_rgba(113,113,122,0.18)]",
        badge: "bg-zinc-300 text-zinc-900",
        points: "text-zinc-800",
        name: "text-zinc-950",
        chip: "border-zinc-300 bg-white text-zinc-700",
      };
    case 3:
      return {
        row: "border-l-[4px] border-l-amber-700 bg-gradient-to-r from-amber-50 via-amber-50/80 to-white shadow-[0_0_0_1px_rgba(217,119,6,0.12),0_8px_20px_rgba(180,83,9,0.12)] hover:shadow-[0_0_0_1px_rgba(217,119,6,0.16),0_12px_24px_rgba(180,83,9,0.18)]",
        badge: "bg-amber-600 text-white",
        points: "text-amber-800",
        name: "text-zinc-950",
        chip: "border-amber-200 bg-white text-amber-800",
      };
    case 4:
      return {
        row: "border-l-[4px] border-l-sky-500 bg-gradient-to-r from-sky-50 via-sky-50/70 to-white shadow-[0_0_0_1px_rgba(14,165,233,0.12),0_8px_20px_rgba(14,165,233,0.12)] hover:shadow-[0_0_0_1px_rgba(14,165,233,0.18),0_12px_24px_rgba(14,165,233,0.18)]",
        badge: "bg-sky-500 text-white",
        points: "text-sky-700",
        name: "text-zinc-950",
        chip: "border-sky-200 bg-white text-sky-800",
      };
    case 5:
      return {
        row: "border-l-[4px] border-l-violet-500 bg-gradient-to-r from-violet-50 via-violet-50/70 to-white shadow-[0_0_0_1px_rgba(139,92,246,0.12),0_8px_20px_rgba(139,92,246,0.12)] hover:shadow-[0_0_0_1px_rgba(139,92,246,0.18),0_12px_24px_rgba(139,92,246,0.18)]",
        badge: "bg-violet-500 text-white",
        points: "text-violet-700",
        name: "text-zinc-950",
        chip: "border-violet-200 bg-white text-violet-800",
      };
    case 6:
      return {
        row: "border-l-[4px] border-l-emerald-500 bg-gradient-to-r from-emerald-50 via-emerald-50/70 to-white shadow-[0_0_0_1px_rgba(16,185,129,0.12),0_8px_20px_rgba(16,185,129,0.12)] hover:shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_12px_24px_rgba(16,185,129,0.18)]",
        badge: "bg-emerald-500 text-white",
        points: "text-emerald-700",
        name: "text-zinc-950",
        chip: "border-emerald-200 bg-white text-emerald-800",
      };
    default:
      return {
        row: "",
        badge: "bg-zinc-100 text-zinc-800",
        points: "text-zinc-950",
        name: "text-zinc-950",
        chip: "border-yellow-200 bg-yellow-50 text-yellow-800",
      };
  }
}
