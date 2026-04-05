import { Newspaper, Crown, Gauge, Trophy, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ChampionshipNarrative } from "@/lib/hooks/useChampionshipNarrative";

type Props = {
  isDarkMode: boolean;
  theme: any;
  category: string;
  competitionLabel: string;
  narrative: ChampionshipNarrative;
};

const iconMap = {
  Líder: Crown,
  Vantagem: Gauge,
  Momento: TrendingUp,
  "Top 6": Trophy,
} as const;

function getBadgeTone(isDarkMode: boolean, tone: ChampionshipNarrative["badges"][number]["tone"]) {
  if (isDarkMode) {
    if (tone === "hot") return "border-red-500/30 bg-red-500/10 text-red-300";
    if (tone === "alert") return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
    if (tone === "dominant") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    if (tone === "stable") return "border-blue-500/30 bg-blue-500/10 text-blue-300";
    return "border-white/10 bg-white/5 text-zinc-300";
  }

  if (tone === "hot") return "border-red-200 bg-red-50 text-red-700";
  if (tone === "alert") return "border-yellow-200 bg-yellow-50 text-yellow-700";
  if (tone === "dominant") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (tone === "stable") return "border-blue-200 bg-blue-50 text-blue-700";
  return "border-zinc-200 bg-zinc-50 text-zinc-600";
}

export default function RankingChampionshipNarrativeCard({
  isDarkMode,
  theme,
  category,
  competitionLabel,
  narrative,
}: Props) {
  return (
    <Card
      className={`overflow-hidden rounded-[24px] shadow-sm transition-all duration-200 hover:-translate-y-[1px] ${
        isDarkMode
          ? `border ${theme.darkAccentBorder} bg-[#111827]`
          : `border ${theme.searchBorder} bg-gradient-to-br from-white via-white to-zinc-50/90`
      }`}
    >
      <CardContent className="p-3 sm:p-4 lg:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
              }`}
            >
              <Newspaper className={`h-5 w-5 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
            </div>

            <div className="min-w-0">
              <p
                className={`text-[9px] font-bold uppercase tracking-[0.18em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Narrativa oficial
              </p>
              <p
                className={`mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                  isDarkMode ? theme.darkAccentText : "text-zinc-600"
                }`}
              >
                {narrative.kicker}
              </p>
              <h3
                className={`mt-1 text-[18px] font-extrabold leading-tight tracking-[0.01em] ${
                  isDarkMode ? "text-white" : "text-zinc-950"
                }`}
              >
                {narrative.headline}
              </h3>
              <p
                className={`mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                {category} · {competitionLabel}
              </p>
            </div>
          </div>

          <div
            className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${getBadgeTone(
              isDarkMode,
              narrative.tone
            )}`}
          >
            leitura editorial
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {narrative.badges.map((badge) => (
            <div
              key={`${badge.label}-${badge.value}`}
              className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${getBadgeTone(
                isDarkMode,
                badge.tone
              )}`}
            >
              {badge.label}: {badge.value}
            </div>
          ))}
        </div>

        <div
          className={`mt-4 rounded-[20px] border px-4 py-4 ${
            isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white/80"
          }`}
        >
          <div className="mb-3 flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-2xl ${
                isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
              }`}
            >
              <Sparkles className={`h-4 w-4 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
              Leitura do momento
            </p>
          </div>
          <p className={`text-[13px] leading-6 ${isDarkMode ? "text-zinc-300" : "text-zinc-700"}`}>
            {narrative.body}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {narrative.highlights.map((item) => {
            const Icon = iconMap[item.label as keyof typeof iconMap] || Gauge;
            return (
              <div
                key={`${item.label}-${item.value}`}
                className={`rounded-[18px] border px-3 py-3 ${
                  isDarkMode ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-2xl ${
                      isDarkMode ? theme.darkAccentIconWrap : theme.primaryIconWrap
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isDarkMode ? theme.darkAccentText : theme.primaryIcon}`} />
                  </div>
                  <p className={`text-[9px] font-bold uppercase tracking-[0.16em] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                    {item.label}
                  </p>
                </div>
                <p className={`mt-2 text-[14px] font-extrabold leading-tight ${isDarkMode ? "text-white" : "text-zinc-950"}`}>
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
