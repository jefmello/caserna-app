import type { Metadata } from "next";
import AppMainLayout from "@/components/navigation/app-main-layout";
import AppSectionShell from "@/components/navigation/app-section-shell";

export const metadata: Metadata = {
  title: "Estatísticas - Caserna Kart Racing",
  description:
    "Análise estatística completa do campeonato Caserna Kart Racing. Eficiência, consistência, momentum e tendências dos pilotos.",
};

export default function EstatisticasLayout({
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
