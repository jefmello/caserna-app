import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import AppMainLayout from "@/components/navigation/app-main-layout";
import { readRevistaManifest, sortRevistas } from "@/lib/revistas";
import RevistasGrid from "./revistas-grid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Revistas — Caserna Kart Racing",
  description: "Edições oficiais da revista do campeonato Caserna Kart Racing.",
};

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
          <RevistasGrid revistas={all} />
        )}
      </div>
    </AppMainLayout>
  );
}
