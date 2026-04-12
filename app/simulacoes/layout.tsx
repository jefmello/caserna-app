import type { Metadata } from "next";
import AppMainLayout from "@/components/navigation/app-main-layout";
import AppSectionShell from "@/components/navigation/app-section-shell";

export const metadata: Metadata = {
  title: "Simulações - Caserna Kart Racing",
  description:
    "Simule cenários personalizados do campeonato Caserna Kart Racing. Teste diferentes resultados e veja como ficaria a classificação.",
};

export default function SimulacoesLayout({
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
