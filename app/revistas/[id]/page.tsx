import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { findRevistaById, isInformativa } from "@/lib/revistas";
import RevistaShareActions from "@/components/revistas/revista-share-actions";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const revista = await findRevistaById(id);
  if (!revista) {
    return { title: "Edição não encontrada — Caserna Kart Racing" };
  }
  const title = `${revista.titulo} — Caserna Kart Racing`;
  const fallbackDescription = isInformativa(revista)
    ? `Edição informativa${revista.data ? ` · ${revista.data}` : ""}`
    : `Edição Nº${String(revista.etapa ?? 0).padStart(2, "0")}${
        revista.turno !== undefined ? ` · Turno ${revista.turno}` : ""
      }${revista.data ? ` · ${revista.data}` : ""}`;
  const description = revista.descricao ?? fallbackDescription;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: revista.cover ? [{ url: revista.cover }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: revista.cover ? [revista.cover] : undefined,
    },
  };
}

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

export default async function RevistaReaderPage({ params }: PageProps) {
  const { id } = await params;
  const revista = await findRevistaById(id);
  if (!revista) notFound();

  const fileUrl = `/revistas/${revista.arquivo}`;
  const pageUrl = `/revistas/${revista.id}`;

  return (
    <div className="flex min-h-screen flex-col bg-[#05070a]">
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-white/10 bg-[#05070a]/95 px-4 py-3 backdrop-blur-xl">
        <Link
          href="/revistas"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[11px] font-bold tracking-[0.1em] text-white/80 uppercase transition hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar
        </Link>

        <div className="hidden min-w-0 flex-1 flex-col items-center px-3 text-center md:flex">
          <p
            className={`truncate text-[10px] font-bold tracking-[0.2em] uppercase ${
              isInformativa(revista) ? "text-sky-300" : "text-amber-400"
            }`}
          >
            {isInformativa(revista)
              ? `Informativa${revista.data ? ` · ${formatDate(revista.data)}` : ""}`
              : `T${revista.turno ?? "—"} · Etapa ${revista.etapa ?? "—"}${
                  revista.data ? ` · ${formatDate(revista.data)}` : ""
                }`}
          </p>
          <p className="truncate text-[14px] font-black tracking-tight text-white">
            {revista.titulo}
          </p>
        </div>

        <RevistaShareActions title={revista.titulo} fileUrl={fileUrl} pageUrl={pageUrl} />
      </header>

      <iframe
        src={fileUrl}
        title={revista.titulo}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        className="w-full flex-1 border-0"
        style={{ height: "calc(100vh - 56px)" }}
      />
    </div>
  );
}
