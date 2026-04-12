import type { Metadata } from "next";
import AppMainLayout from "@/components/navigation/app-main-layout";
import AppSectionShell from "@/components/navigation/app-section-shell";

export const metadata: Metadata = {
  title: "Pilotos - Caserna Kart Racing",
  description:
    "Conheça os pilotos do campeonato Caserna Kart Racing. Perfis individuais, estatísticas e histórico de cada competidor.",
};

export default function PilotosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppMainLayout>
      <AppSectionShell section="default">{children}</AppSectionShell>
    </AppMainLayout>
  );
}
