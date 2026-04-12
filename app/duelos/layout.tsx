import type { Metadata } from "next";
import AppMainLayout from "@/components/navigation/app-main-layout";
import AppSectionShell from "@/components/navigation/app-section-shell";

export const metadata: Metadata = {
  title: "Duelos - Caserna Kart Racing",
  description:
    "Compare pilotos lado a lado e veja quem leva vantagem nos confrontos diretos do campeonato Caserna Kart Racing.",
};

export default function DuelosLayout({
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
