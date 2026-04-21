import type { Metadata } from "next";
import { fetchPilotById } from "./fetch-pilot";

type LayoutParams = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: LayoutParams): Promise<Metadata> {
  const { id } = await params;
  const pilot = await fetchPilotById(id);

  if (!pilot) {
    return {
      title: "Piloto não encontrado — Caserna Kart Racing",
      description: "O piloto solicitado não foi encontrado no campeonato Caserna Kart Racing.",
    };
  }

  const title = `${pilot.piloto} — Caserna Kart Racing`;
  const description = `${pilot.piloto} · ${pilot.categoria} · ${pilot.pontos} pts · ${pilot.vitorias} vitórias · ${pilot.podios} pódios no campeonato Caserna Kart Racing.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      locale: "pt_BR",
      siteName: "Caserna Kart Racing",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function PilotoPublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
