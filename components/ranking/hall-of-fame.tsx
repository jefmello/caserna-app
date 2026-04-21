"use client";

import { useMemo } from "react";
import { Trophy, Crown, Star, ChevronDown, Calendar } from "lucide-react";
import { getCategoryTheme } from "@/lib/ranking/theme-utils";
import { getArchivedSeasons, SEASONS, type ArchivedSeasonData, type Season } from "@/lib/seasons";

function ChampionBadge({
  champion,
  category,
  isDarkMode,
  theme,
  index,
}: {
  champion: ArchivedSeasonData["champions"][number];
  category: string;
  isDarkMode: boolean;
  theme: ReturnType<typeof getCategoryTheme>;
  index: number;
}) {
  const categoryThemes: Record<string, ReturnType<typeof getCategoryTheme>> = {
    Base: getCategoryTheme("Base"),
    Graduados: getCategoryTheme("Graduados"),
    Elite: getCategoryTheme("Elite"),
  };
  const catTheme = categoryThemes[category] || theme;

  return (
    <div
      key={`${category}-${champion.piloto}-${index}`}
      className={`rounded-xl border p-4 transition ${
        isDarkMode
          ? `${catTheme.darkAccentBorder} ${catTheme.darkAccentBgSoft}`
          : `${catTheme.primaryBorder} bg-gradient-to-r ${catTheme.heroBg}`
      }`}
    >
      <div className="flex items-center gap-2">
        <Crown
          className={`h-4 w-4 ${isDarkMode ? catTheme.darkAccentText : catTheme.primaryIcon}`}
        />
        <span
          className={`text-[10px] font-bold tracking-wider uppercase ${
            isDarkMode ? "text-zinc-500" : "text-zinc-400"
          }`}
        >
          {category}
        </span>
      </div>
      <p
        className={`mt-2 truncate text-base font-extrabold ${
          isDarkMode ? "text-white" : "text-zinc-950"
        }`}
      >
        {champion.piloto}
      </p>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Trophy className={`h-3 w-3 ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`} />
          <span className={`text-sm font-bold ${isDarkMode ? "text-zinc-300" : "text-zinc-700"}`}>
            {champion.pontos} pts
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Star className={`h-3 w-3 ${isDarkMode ? "text-orange-400" : "text-orange-600"}`} />
          <span className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
            {champion.vitorias}V · {champion.podios}P
          </span>
        </div>
      </div>
    </div>
  );
}

function SeasonCard({
  data,
  isDarkMode,
  theme,
}: {
  data: ArchivedSeasonData;
  isDarkMode: boolean;
  theme: ReturnType<typeof getCategoryTheme>;
}) {
  const year = data.season.year;
  const champions = data.champions;

  return (
    <div
      className={`rounded-2xl border p-5 ${
        isDarkMode ? "border-white/10 bg-[#111827]" : "border-black/5 bg-white"
      }`}
    >
      <div className="flex items-center gap-2">
        <Calendar className={`h-5 w-5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
        <h3 className={`text-lg font-extrabold ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
          {year}
        </h3>
        <span
          className={`ml-auto rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
            isDarkMode
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          Finalizada
        </span>
      </div>
      <p className={`mt-1 text-xs ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
        {new Date(data.archivedAt).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {champions.map((champ, i) => (
          <ChampionBadge
            key={`${champ.categoria}-${i}`}
            champion={champ}
            category={champ.categoria}
            isDarkMode={isDarkMode}
            theme={theme}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

function ActiveSeasonCard({
  season,
  isDarkMode,
  theme,
}: {
  season: Season;
  isDarkMode: boolean;
  theme: ReturnType<typeof getCategoryTheme>;
}) {
  return (
    <div
      className={`rounded-2xl border-2 border-dashed p-6 ${
        isDarkMode
          ? `${theme.darkAccentBorder} ${theme.darkAccentBgSoft}`
          : "border-black/10 bg-zinc-50/80"
      }`}
    >
      <div className="flex items-center gap-2">
        <Calendar className={`h-5 w-5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
        <h3 className={`text-lg font-extrabold ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
          {season.label}
        </h3>
        <span
          className={`ml-auto rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
            isDarkMode
              ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          Em andamento
        </span>
      </div>
      <p className={`mt-2 text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
        Esta temporada ainda está em disputa. Os campeões serão definidos ao final do campeonato.
      </p>
      <div className="mt-3 flex items-center gap-1.5">
        <ChevronDown
          className={`h-4 w-4 animate-bounce ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}
        />
        <span className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
          Continue acompanhando na Classificação Geral
        </span>
      </div>
    </div>
  );
}

export default function HallOfFame({
  isDarkMode,
  category,
}: {
  isDarkMode: boolean;
  category: string;
}) {
  const theme = getCategoryTheme(category);

  const archivedSeasons = useMemo(() => getArchivedSeasons(), []);
  const activeSeason = useMemo(() => SEASONS.find((s) => s.isActive) || null, []);

  const hasHistory = archivedSeasons.length > 0;

  if (!hasHistory && !activeSeason) {
    return (
      <div
        className={`rounded-2xl border border-dashed p-8 text-center ${
          isDarkMode
            ? "border-white/10 bg-[#0f172a] text-zinc-400"
            : "border-black/10 bg-zinc-50 text-zinc-500"
        }`}
      >
        <Trophy className="mx-auto mb-3 h-8 w-8 opacity-40" />
        <p className="text-sm font-semibold">Nenhuma temporada registrada</p>
        <p className="mt-1 text-xs">
          O Hall da Fama aparecerá aqui quando temporadas forem finalizadas e arquivadas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeSeason && (
        <ActiveSeasonCard season={activeSeason} isDarkMode={isDarkMode} theme={theme} />
      )}

      {hasHistory && (
        <>
          <div className="flex items-center gap-2">
            <Trophy className={`h-5 w-5 ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`} />
            <h2 className={`text-lg font-extrabold ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
              Hall da Fama
            </h2>
          </div>
          <div className="space-y-4">
            {archivedSeasons.map((season) => (
              <SeasonCard
                key={season.season.year}
                data={season}
                isDarkMode={isDarkMode}
                theme={theme}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
