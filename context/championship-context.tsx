"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { track } from "@/lib/analytics";

type ThemeMode = "dark" | "light";

type ChampionshipContextType = {
  categoria: string;
  campeonato: string;
  themeMode: ThemeMode;
  isDarkMode: boolean;
  setCategoria: (c: string) => void;
  setCampeonato: (c: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ChampionshipContext = createContext<ChampionshipContextType | null>(null);

const DEFAULT_CATEGORIA = "Elite";
const DEFAULT_CAMPEONATO = "Geral";
const DEFAULT_THEME_MODE: ThemeMode = "dark";

const STORAGE_CATEGORIA_KEY = "caserna-categoria";
const STORAGE_CAMPEONATO_KEY = "caserna-campeonato";
const STORAGE_THEME_KEY = "caserna-theme";

const DARK_BACKGROUND = "#05070a";
const LIGHT_BACKGROUND = "#f3f4f6";
const DARK_TEXT = "#ffffff";
const LIGHT_TEXT = "#18181b";

/**
 * Lê o tema do ambiente (localStorage > DOM > fallback).
 * Função pura — sem efeitos colaterais no DOM.
 */
function readThemeFromEnvironment(): ThemeMode {
  if (typeof window === "undefined") return DEFAULT_THEME_MODE;

  const stored = window.localStorage.getItem(STORAGE_THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;

  const rootDark = document.documentElement.classList.contains("dark");
  const bodyDark = document.body?.classList.contains("dark");
  if (rootDark || bodyDark) return "dark";

  return DEFAULT_THEME_MODE;
}

/**
 * Aplica o tema ao DOM de forma centralizada.
 * Usado apenas pelo ChampionshipProvider.
 */
function applyThemeToDom(mode: ThemeMode) {
  if (typeof window === "undefined") return;

  const isDark = mode === "dark";

  document.documentElement.classList.toggle("dark", isDark);
  document.body.classList.toggle("dark", isDark);

  document.documentElement.dataset.theme = mode;
  document.body.dataset.theme = mode;

  document.documentElement.style.backgroundColor = isDark ? DARK_BACKGROUND : LIGHT_BACKGROUND;
  document.body.style.backgroundColor = isDark ? DARK_BACKGROUND : LIGHT_BACKGROUND;

  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  document.body.style.color = isDark ? DARK_TEXT : LIGHT_TEXT;
}

export function ChampionshipProvider({ children }: { children: React.ReactNode }) {
  // Sempre inicia com defaults para o primeiro render bater entre server e
  // client. Os valores persistidos são lidos do localStorage no useEffect
  // abaixo, evitando hydration mismatch.
  const [categoria, setCategoriaState] = useState(DEFAULT_CATEGORIA);
  const [campeonato, setCampeonatoState] = useState(DEFAULT_CAMPEONATO);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedCategoria = window.localStorage.getItem(STORAGE_CATEGORIA_KEY);
    if (storedCategoria) setCategoriaState(storedCategoria);
    const storedCampeonato = window.localStorage.getItem(STORAGE_CAMPEONATO_KEY);
    if (storedCampeonato) setCampeonatoState(storedCampeonato);
  }, []);
  // Inicializa com o default em ambos os lados (server + primeiro render do
  // client) para evitar hydration mismatch. O tema real do usuário é lido
  // do localStorage logo após o mount, no useEffect abaixo.
  const [themeModeState, setThemeModeState] = useState<ThemeMode>(DEFAULT_THEME_MODE);

  useEffect(() => {
    const fromEnv = readThemeFromEnvironment();
    if (fromEnv !== themeModeState) setThemeModeState(fromEnv);
    // Roda só uma vez no mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Aplica tema ao DOM sempre que mudar
  useEffect(() => {
    applyThemeToDom(themeModeState);
  }, [themeModeState]);

  const setCategoria = useCallback((c: string) => {
    setCategoriaState(c);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_CATEGORIA_KEY, c);
    }
    track("category_changed", { category: c });
  }, []);

  const setCampeonato = useCallback((c: string) => {
    setCampeonatoState(c);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_CAMPEONATO_KEY, c);
    }
    track("competition_changed", { competition: c });
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_THEME_KEY, mode);
    }
    track("theme_mode_toggled", { mode });
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeModeState((current) => {
      const next = current === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_THEME_KEY, next);
      }
      track("theme_mode_toggled", { mode: next });
      return next;
    });
  }, []);

  const value = useMemo<ChampionshipContextType>(
    () => ({
      categoria,
      campeonato,
      themeMode: themeModeState,
      isDarkMode: themeModeState === "dark",
      setCategoria,
      setCampeonato,
      setThemeMode,
      toggleTheme,
    }),
    [categoria, campeonato, themeModeState, setCategoria, setCampeonato, setThemeMode, toggleTheme]
  );

  return <ChampionshipContext.Provider value={value}>{children}</ChampionshipContext.Provider>;
}

export function useChampionship() {
  const context = useContext(ChampionshipContext);
  if (!context) {
    throw new Error("useChampionship must be used within ChampionshipProvider");
  }
  return context;
}
