"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, BookOpen, Calendar, Flag } from "lucide-react";
import type { RevistaEntry } from "@/lib/revistas";

type Filtro = "tudo" | "etapa" | "informativa";

const tipoOf = (e: RevistaEntry): Filtro =>
  (e.tipo ?? "etapa") === "informativa" ? "informativa" : "etapa";

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

export default function RevistasGrid({ revistas }: { revistas: RevistaEntry[] }) {
  const [filtro, setFiltro] = useState<Filtro>("tudo");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    let etapa = 0;
    let informativa = 0;
    for (const r of revistas) {
      if (tipoOf(r) === "informativa") informativa++;
      else etapa++;
    }
    return { tudo: revistas.length, etapa, informativa };
  }, [revistas]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return revistas.filter((r) => {
      if (filtro !== "tudo" && tipoOf(r) !== filtro) return false;
      if (!q) return true;
      const haystack = [r.titulo, r.descricao ?? "", r.id].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [revistas, filtro, query]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar edições por título, descrição ou ID…"
            className="w-full rounded-full border border-white/10 bg-white/[0.04] py-2 pr-3 pl-9 text-[13px] text-white placeholder:text-white/35 focus:border-amber-400/50 focus:outline-none"
          />
        </label>
        <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1 text-[11px] font-bold tracking-[0.1em] uppercase">
          <FiltroPill
            label="Tudo"
            count={counts.tudo}
            active={filtro === "tudo"}
            onClick={() => setFiltro("tudo")}
          />
          <FiltroPill
            label="Etapa"
            count={counts.etapa}
            active={filtro === "etapa"}
            onClick={() => setFiltro("etapa")}
          />
          <FiltroPill
            label="Informativa"
            count={counts.informativa}
            active={filtro === "informativa"}
            onClick={() => setFiltro("informativa")}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[22px] border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-white/25" />
          <p className="mt-3 text-[14px] font-semibold text-white/70">
            Nenhuma edição com esses critérios.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <RevistaCard key={r.id} revista={r} />
          ))}
        </div>
      )}
    </div>
  );
}

function RevistaCard({ revista }: { revista: RevistaEntry }) {
  const cover = revista.cover ?? null;
  const informativa = tipoOf(revista) === "informativa";
  return (
    <Link
      href={`/revistas/${revista.id}`}
      className="group relative flex flex-col overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-[3px] hover:border-amber-400/40 hover:bg-white/[0.05] hover:shadow-[0_24px_50px_-20px_rgba(250,204,21,0.2)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(135deg,#0b1121_0%,#111827_100%)]">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
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

        <div
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] uppercase backdrop-blur-md ${
            informativa
              ? "border-sky-400/30 bg-sky-400/10 text-sky-300"
              : "border-amber-400/30 bg-amber-400/10 text-amber-300"
          }`}
        >
          {informativa ? "Informativa" : `T${revista.turno} · E${revista.etapa}`}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-[10px] font-bold tracking-[0.2em] text-white/45 uppercase">
          {informativa
            ? "Edição informativa"
            : `Edição Nº${String(revista.etapa ?? 0).padStart(2, "0")}`}
        </p>
        <h3 className="text-[16px] font-black tracking-tight text-white">{revista.titulo}</h3>
        {revista.descricao ? (
          <p className="line-clamp-2 text-[12px] leading-relaxed text-white/60">
            {revista.descricao}
          </p>
        ) : null}
        <div className="mt-auto flex items-center gap-3 pt-2 text-[11px] font-semibold text-white/55">
          {revista.data ? (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(revista.data)}
            </span>
          ) : null}
          {!informativa && revista.turno !== undefined ? (
            <span className="inline-flex items-center gap-1.5">
              <Flag className="h-3.5 w-3.5" />
              Turno {revista.turno}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

function FiltroPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1.5 transition ${
        active ? "bg-amber-400/20 text-amber-200" : "text-white/55 hover:text-white"
      }`}
    >
      {label}
      <span className="ml-1.5 text-white/40 tabular-nums">{count}</span>
    </button>
  );
}
