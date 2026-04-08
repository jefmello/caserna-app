"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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

export function ChampionshipProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categoria, setCategoriaState] = useState(DEFAULT_CATEGORIA);
  const [campeonato, setCampeonatoState] = useState(DEFAULT_CAMPEONATO);
  const [themeModeState, setThemeModeState] =
    useState<ThemeMode>(DEFAULT_THEME_MODE);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedCategoria = window.localStorage.getItem(STORAGE_CATEGORIA_KEY);
    const savedCampeonato = window.localStorage.getItem(STORAGE_CAMPEONATO_KEY);
    const savedTheme = window.localStorage.getItem(STORAGE_THEME_KEY);

    if (savedCategoria) {
      setCategoriaState(savedCategoria);
    }

    if (savedCampeonato) {
      setCampeonatoState(savedCampeonato);
    }

    if (savedTheme === "light" || savedTheme === "dark") {
      setThemeModeState(savedTheme);
    }
  }, []);

  const setCategoria = useCallback((c: string) => {
    setCategoriaState(c);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_CATEGORIA_KEY, c);
    }
  }, []);

  const setCampeonato = useCallback((c: string) => {
    setCampeonatoState(c);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_CAMPEONATO_KEY, c);
    }
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_THEME_KEY, mode);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeModeState((current) => {
      const nextMode: ThemeMode = current === "dark" ? "light" : "dark";

      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_THEME_KEY, nextMode);
      }

      return nextMode;
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
    [
      categoria,
      campeonato,
      themeModeState,
      setCategoria,
      setCampeonato,
      setThemeMode,
      toggleTheme,
    ]
  );

  return (
    <ChampionshipContext.Provider value={value}>
      {children}
    </ChampionshipContext.Provider>
  );
}

export function useChampionship() {
  const context = useContext(ChampionshipContext);

  if (!context) {
    throw new Error("useChampionship must be used within provider");
  }

  return context;
}