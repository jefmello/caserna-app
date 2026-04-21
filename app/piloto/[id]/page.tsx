import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Flag, Medal, Star, Target, Timer, Trophy } from "lucide-react";
import PodiumBadge from "@/components/ui/podium-badge";
import { fetchPilotById } from "./fetch-pilot";

type PageProps = { params: Promise<{ id: string }> };

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-amber-300">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold tracking-[0.18em] text-white/55 uppercase">
          {label}
        </span>
        <span className="text-lg font-bold text-white tabular-nums">{value}</span>
      </div>
    </div>
  );
}

export default async function PilotoPublicPage({ params }: PageProps) {
  const { id } = await params;
  const pilot = await fetchPilotById(id);

  if (!pilot) notFound();

  const position = Math.max(1, Math.min(pilot.pos, 6)) as 1 | 2 | 3 | 4 | 5 | 6;

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[linear-gradient(180deg,#04060b_0%,#0a0f1c_55%,#05070a_100%)] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.08),transparent_60%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.06),transparent_55%)]"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col items-stretch justify-center gap-5 px-5 py-10">
        <Link
          href="/classificacao"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-white/70 uppercase transition hover:border-white/20 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Classificação
        </Link>

        <article className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
          />

          <header className="flex flex-col gap-5 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
            <PodiumBadge position={position} size="lg" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.18em] text-amber-300 uppercase">
                <Trophy className="h-3 w-3" /> {pilot.categoria}
              </span>
              <h1 className="truncate text-2xl leading-tight font-black sm:text-3xl">
                {pilot.piloto}
              </h1>
              {pilot.nomeGuerra && pilot.nomeGuerra !== pilot.piloto && (
                <p className="text-sm font-semibold tracking-[0.08em] text-white/55 uppercase">
                  &ldquo;{pilot.nomeGuerra}&rdquo;
                </p>
              )}
            </div>
          </header>

          <section className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <Stat icon={Trophy} label="Pontos" value={pilot.pontos} />
            <Stat icon={Flag} label="Vitórias" value={pilot.vitorias} />
            <Stat icon={Star} label="Poles" value={pilot.poles} />
            <Stat icon={Medal} label="Pódios" value={pilot.podios} />
            <Stat icon={Timer} label="MV" value={pilot.mv} />
            <Stat icon={Target} label="Participações" value={pilot.participacoes} />
          </section>

          <section className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold tracking-[0.18em] text-white/55 uppercase">
                Posição atual
              </span>
              <span className="text-xl font-black tabular-nums">#{pilot.pos}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-semibold tracking-[0.18em] text-white/55 uppercase">
                Vantagem
              </span>
              <span className="text-xl font-black tabular-nums">
                {pilot.adv > 0 ? `+${pilot.adv}` : pilot.adv}
              </span>
            </div>
          </section>

          <footer className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-[10px] font-semibold tracking-[0.2em] text-white/45 uppercase">
            <span>Caserna Kart Racing</span>
            <span>{pilot.competicao}</span>
          </footer>
        </article>
      </div>
    </main>
  );
}
