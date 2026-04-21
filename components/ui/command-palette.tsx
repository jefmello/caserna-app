"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  BarChart3,
  Clapperboard,
  LineChart,
  Moon,
  Palette,
  Search,
  Sun,
  Swords,
  Trophy,
  User,
  Users,
} from "lucide-react";
import { useChampionship } from "@/context/championship-context";
import useRankingData from "@/lib/hooks/useRankingData";
import useThemeVariant from "@/lib/hooks/useThemeVariant";
import { THEME_VARIANTS, type ThemeVariant } from "@/lib/theme-variants";
import type { RankingItem } from "@/types/ranking";

type Route = {
  label: string;
  href: string;
  icon: React.ElementType;
  hint: string;
};

const ROUTES: Route[] = [
  { label: "Classificação", href: "/classificacao", icon: Trophy, hint: "Ranking oficial" },
  { label: "Pilotos", href: "/pilotos", icon: Users, hint: "Perfis individuais" },
  { label: "Estatísticas", href: "/estatisticas", icon: BarChart3, hint: "Leitura agregada" },
  { label: "Duelos", href: "/duelos", icon: Swords, hint: "Comparação 1v1" },
  { label: "Simulações", href: "/simulacoes", icon: LineChart, hint: "Cenários" },
  { label: "Mídia", href: "/midia", icon: Clapperboard, hint: "Galeria" },
  { label: "Replay da Temporada", href: "/replay", icon: LineChart, hint: "Timeline animada" },
];

/**
 * Global command palette. Toggled by Cmd+K / Ctrl+K anywhere in the app.
 * Lists static routes, flat list of all pilots, and quick actions
 * (toggle theme, swap livery).
 */
export default function CommandPalette() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useChampionship();
  const { variant, setVariant } = useThemeVariant();
  const { rankingData } = useRankingData();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => {
          // Clearing the search text is part of closing the palette, so it
          // belongs in the state transition — not in a separate effect.
          if (o) setSearch("");
          return !o;
        });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleOpenChange = (next: boolean) => {
    if (!next) setSearch("");
    setOpen(next);
  };

  const pilots = useMemo<RankingItem[]>(() => {
    const seen = new Set<string>();
    const flat: RankingItem[] = [];
    for (const category of Object.values(rankingData ?? {})) {
      for (const competitionList of Object.values(category)) {
        for (const pilot of competitionList) {
          const key = pilot.pilotoId || `${pilot.piloto}-${pilot.categoria}`;
          if (seen.has(key)) continue;
          seen.add(key);
          flat.push(pilot);
        }
      }
    }
    flat.sort((a, b) => a.piloto.localeCompare(b.piloto, "pt-BR"));
    return flat;
  }, [rankingData]);

  const goto = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const pickVariant = (next: ThemeVariant) => {
    setVariant(next);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        className="sr-only"
        onClick={() => setOpen(true)}
      />
    );
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={handleOpenChange}
      label="Paleta de comandos"
      className="fixed inset-0 z-[80] flex items-start justify-center bg-black/50 backdrop-blur-sm"
      contentClassName="mt-[12vh] w-full max-w-xl"
      shouldFilter
    >
      <div
        className={`mx-4 w-full overflow-hidden rounded-2xl border shadow-[0_40px_80px_-20px_rgba(0,0,0,0.65)] ${
          isDarkMode
            ? "border-white/10 bg-[#0a0e18]/95 text-white"
            : "border-zinc-200 bg-white/98 text-zinc-900"
        }`}
      >
        <div
          className={`flex items-center gap-2 border-b px-4 py-3 ${
            isDarkMode ? "border-white/8" : "border-zinc-200"
          }`}
        >
          <Search className={`h-4 w-4 ${isDarkMode ? "text-white/55" : "text-zinc-400"}`} />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Buscar pilotos, telas ou ações…"
            className={`w-full bg-transparent text-sm outline-none placeholder:font-normal ${
              isDarkMode
                ? "text-white placeholder:text-white/40"
                : "text-zinc-900 placeholder:text-zinc-400"
            }`}
          />
          <kbd
            className={`hidden rounded-md border px-1.5 py-0.5 text-[10px] font-semibold sm:inline-flex ${
              isDarkMode
                ? "border-white/10 bg-white/[0.05] text-white/60"
                : "border-zinc-200 bg-zinc-50 text-zinc-500"
            }`}
          >
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto px-2 py-2">
          <Command.Empty
            className={`px-4 py-6 text-center text-sm ${
              isDarkMode ? "text-white/55" : "text-zinc-500"
            }`}
          >
            Nada encontrado.
          </Command.Empty>

          <Command.Group
            heading="Telas"
            className={`text-[10px] font-semibold tracking-[0.14em] uppercase ${
              isDarkMode ? "text-white/45" : "text-zinc-400"
            }`}
          >
            {ROUTES.map((route) => {
              const Icon = route.icon;
              return (
                <Command.Item
                  key={route.href}
                  value={`rota ${route.label} ${route.href}`}
                  onSelect={() => goto(route.href)}
                  className={`mt-0.5 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm transition aria-selected:${
                    isDarkMode ? "bg-white/[0.08]" : "bg-zinc-100"
                  } ${isDarkMode ? "text-white/85" : "text-zinc-800"}`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 font-medium">{route.label}</span>
                  <span className={`text-[11px] ${isDarkMode ? "text-white/45" : "text-zinc-400"}`}>
                    {route.hint}
                  </span>
                </Command.Item>
              );
            })}
          </Command.Group>

          <Command.Group
            heading="Ações"
            className={`mt-2 text-[10px] font-semibold tracking-[0.14em] uppercase ${
              isDarkMode ? "text-white/45" : "text-zinc-400"
            }`}
          >
            <Command.Item
              value="acao alternar modo claro escuro tema"
              onSelect={() => {
                toggleTheme();
                setOpen(false);
              }}
              className={`mt-0.5 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm ${
                isDarkMode ? "text-white/85" : "text-zinc-800"
              }`}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="flex-1 font-medium">
                {isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
              </span>
            </Command.Item>

            {(Object.keys(THEME_VARIANTS) as ThemeVariant[]).map((key) => {
              const v = THEME_VARIANTS[key];
              const active = key === variant;
              return (
                <Command.Item
                  key={key}
                  value={`acao tema variante livery ${v.label}`}
                  onSelect={() => pickVariant(key)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm ${
                    isDarkMode ? "text-white/85" : "text-zinc-800"
                  }`}
                >
                  <Palette className="h-4 w-4" />
                  <span className="flex-1 font-medium">Tema: {v.label}</span>
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-black/25"
                    style={{ background: v.swatch }}
                    aria-hidden="true"
                  />
                  {active && (
                    <span
                      className={`text-[10px] font-semibold tracking-[0.14em] uppercase ${
                        isDarkMode ? "text-white/55" : "text-zinc-500"
                      }`}
                    >
                      Atual
                    </span>
                  )}
                </Command.Item>
              );
            })}
          </Command.Group>

          {pilots.length > 0 && (
            <Command.Group
              heading="Pilotos"
              className={`mt-2 text-[10px] font-semibold tracking-[0.14em] uppercase ${
                isDarkMode ? "text-white/45" : "text-zinc-400"
              }`}
            >
              {pilots.map((pilot) => (
                <Command.Item
                  key={pilot.pilotoId || pilot.piloto}
                  value={`piloto ${pilot.piloto} ${pilot.nomeGuerra} ${pilot.categoria}`}
                  onSelect={() => {
                    setOpen(false);
                    if (pilot.pilotoId) {
                      router.push(`/pilotos?pilotId=${encodeURIComponent(pilot.pilotoId)}`);
                    } else {
                      router.push("/pilotos");
                    }
                  }}
                  className={`mt-0.5 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm ${
                    isDarkMode ? "text-white/85" : "text-zinc-800"
                  }`}
                >
                  <User className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate font-medium">{pilot.piloto}</span>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] uppercase ${
                      isDarkMode
                        ? "border-white/10 bg-white/[0.04] text-white/60"
                        : "border-zinc-200 bg-zinc-50 text-zinc-500"
                    }`}
                  >
                    {pilot.categoria}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>

        <div
          className={`flex items-center justify-between border-t px-3 py-2 text-[10px] font-semibold tracking-[0.12em] uppercase ${
            isDarkMode ? "border-white/8 text-white/40" : "border-zinc-200 text-zinc-400"
          }`}
        >
          <span>Cmd/Ctrl + K</span>
          <span>Caserna · Paleta</span>
        </div>
      </div>
    </Command.Dialog>
  );
}
