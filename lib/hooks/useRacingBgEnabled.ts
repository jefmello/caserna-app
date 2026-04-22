"use client";

import { useCallback, useSyncExternalStore } from "react";

export const RACING_BG_STORAGE_KEY = "caserna-racing-bg";
export const RACING_BG_EVENT = "caserna-racing-bg-change";

function readStored(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = window.localStorage.getItem(RACING_BG_STORAGE_KEY);
    if (raw === "off") return false;
    return true;
  } catch {
    return true;
  }
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(RACING_BG_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(RACING_BG_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getServerSnapshot(): boolean {
  return true;
}

type Return = {
  enabled: boolean;
  setEnabled: (next: boolean) => void;
  toggle: () => void;
};

/**
 * Reactive hook over the "animated racing background" user preference.
 * Stored in localStorage, synced across components via a custom event.
 * Defaults to enabled.
 */
export default function useRacingBgEnabled(): Return {
  const enabled = useSyncExternalStore(subscribe, readStored, getServerSnapshot);

  const setEnabled = useCallback((next: boolean) => {
    try {
      window.localStorage.setItem(RACING_BG_STORAGE_KEY, next ? "on" : "off");
    } catch {
      // Fall through — event still fires so subscribers can react.
    }
    window.dispatchEvent(new CustomEvent(RACING_BG_EVENT));
  }, []);

  const toggle = useCallback(() => setEnabled(!enabled), [enabled, setEnabled]);

  return { enabled, setEnabled, toggle };
}
