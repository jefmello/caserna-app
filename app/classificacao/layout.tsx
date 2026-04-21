import type { Metadata } from "next";
import AppMainLayout from "@/components/navigation/app-main-layout";
import AppSectionShell from "@/components/navigation/app-section-shell";

export const metadata: Metadata = {
  title: "Classificação - Caserna Kart Racing",
  description:
    "Veja a tabela de classificação completa do campeonato Caserna Kart Racing. Pontos, vitórias, poles e muito mais.",
};

export default function ClassificacaoLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppMainLayout>
      <AppSectionShell section="default">{children}</AppSectionShell>
    </AppMainLayout>
  );
}
