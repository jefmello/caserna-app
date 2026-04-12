import type { Metadata } from "next";
import AppMainLayout from "@/components/navigation/app-main-layout";
import AppSectionShell from "@/components/navigation/app-section-shell";

export const metadata: Metadata = {
  title: "Mídia - Caserna Kart Racing",
  description:
    "Galeria de imagens e conteúdo visual do campeonato Caserna Kart Racing. Fotos, gráficos e destaques das etapas.",
};

export default function MidiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppMainLayout>
      <AppSectionShell>{children}</AppSectionShell>
    </AppMainLayout>
  );
}
