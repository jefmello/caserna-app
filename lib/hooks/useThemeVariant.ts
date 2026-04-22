"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  DEFAULT_THEME_VARIANT,
  THEME_VARIANT_EVENT,
  THEME_VARIANT_STORAGE_KEY,
  THEME_VARIANTS,
  type ThemeVariant,
  isThemeVariant,
} from "@/lib/theme-variants";

function readStoredVariant(): ThemeVariant {
  if (typeof window === "undefined") return DEFAULT_THEME_VARIANT;
  try {
    const raw = window.localStorage.getItem(THEME_VARIANT_STORAGE_KEY);
    if (isThemeVariant(raw)) return raw;
  } catch {
    // localStorage may be unavailable (private mode); fall back silently.
  }
  return DEFAULT_THEME_VARIANT;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(THEME_VARIANT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(THEME_VARIANT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getServerSnapshot(): ThemeVariant {
  return DEFAULT_THEME_VARIANT;
}

type UseThemeVariantReturn = {
  variant: ThemeVariant;
  setVariant: (v: ThemeVariant) => void;
};

/**
 * Reactive hook around the global theme variant. Syncs across components via
 * a custom window event + localStorage, so every mounted consumer updates
 * instantly when the toggle is clicked.
 *
 * Uses useSyncExternalStore so the read-from-storage happens without a
 * post-mount setState (avoids the React 19 lint rule against cascading renders).
 */
export default function useThemeVariant(): UseThemeVariantReturn {
  const variant = useSyncExternalStore(subscribe, readStoredVariant, getServerSnapshot);

  const setVariant = useCallback((next: ThemeVariant) => {
    try {
      window.localStorage.setItem(THEME_VARIANT_STORAGE_KEY, next);
    } catch {
      // Non-fatal: dispatching the event still triggers subscribers.
    }
    // Update the CSS custom property so the <html> background repaints
    // instantly without waiting for RacingBackground to re-render.
    try {
      document.documentElement.style.setProperty(
        "--caserna-bg-gradient",
        THEME_VARIANTS[next].bgGradient
      );
    } catch {
      // Ignore; SSR or locked-down environments.
    }
    window.dispatchEvent(new CustomEvent(THEME_VARIANT_EVENT));
  }, []);

  return { variant, setVariant };
}
