import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Calendar, Flag } from "lucide-react";
import AppMainLayout from "@/components/navigation/app-main-layout";
import { readRevistaManifest, sortRevistas, type RevistaEntry } from "@/lib/revistas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Revistas — Caserna Kart Racing",
  description: "Edições oficiais da revista do campeonato Caserna Kart Racing.",
};

function formatDate(iso: string): string {
  try {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, (m ?? 1) - 1, d).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function RevistaCard({ revista }: { revista: RevistaEntry }) {
  const cover = revista.cover ?? null;
  return (
    <Link
      href={`/revistas/${revista.id}`}
      className="group relative flex flex-col overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-[3px] hover:border-amber-400/40 hover:bg-white/[0.05] hover:shadow-[0_24px_50px_-20px_rgba(250,204,21,0.2)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(135deg,#0b1121_0%,#111827_100%)]">
        {cover ? (
          <img
            src={cover}
            alt={`Capa — ${revista.titulo}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="h-12 w-12 text-white/15" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-amber-300 uppercase backdrop-blur-md">
          T{revista.turno} · E{revista.etapa}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-[10px] font-bold tracking-[0.2em] text-white/45 uppercase">
          Edição Nº{String(revista.etapa).padStart(2, "0")}
        </p>
        <h3 className="text-[16px] font-black tracking-tight text-white">{revista.titulo}</h3>
        {revista.descricao ? (
          <p className="line-clamp-2 text-[12px] leading-relaxed text-white/60">
            {revista.descricao}
          </p>
        ) : null}
        <div className="mt-auto flex items-center gap-3 pt-2 text-[11px] font-semibold text-white/55">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(revista.data)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Flag className="h-3.5 w-3.5" />
            Turno {revista.turno}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function RevistasPage() {
  const all = sortRevistas(await readRevistaManifest());

  return (
    <AppMainLayout>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <header className="mb-6 flex flex-col gap-2 md:mb-8">
          <p className="text-[11px] font-bold tracking-[0.24em] text-amber-400 uppercase">
            Editoria oficial
          </p>
          <h1 className="text-[24px] font-black tracking-tight text-white md:text-[32px]">
            Revistas
          </h1>
          <p className="max-w-2xl text-[13px] text-white/60 md:text-[14px]">
            Cada edição reúne a cobertura editorial de uma etapa do campeonato — narrativa, pódios,
            destaques e análise completa.
          </p>
        </header>

        {all.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-white/25" />
            <p className="mt-3 text-[14px] font-semibold text-white/70">Primeira edição em breve</p>
            <p className="mt-1 text-[12px] text-white/50">
              Envie um arquivo HTML pela página{" "}
              <Link href="/upload" className="text-amber-300 hover:underline">
                /upload
              </Link>{" "}
              para publicar uma edição.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {all.map((r) => (
              <RevistaCard key={r.id} revista={r} />
            ))}
          </div>
        )}
      </div>
    </AppMainLayout>
  );
}
