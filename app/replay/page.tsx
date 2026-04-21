import type { Metadata } from "next";
import AppMainLayout from "@/components/navigation/app-main-layout";
import AppSectionShell from "@/components/navigation/app-section-shell";
import ReplayTemporada from "@/components/ranking/replay-temporada";
import Breadcrumb from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Replay da Temporada - Caserna Kart Racing",
  description:
    "Reviva a temporada do campeonato Caserna Kart Racing etapa a etapa com a classificação animada.",
};

export default function ReplayPage() {
  return (
    <AppMainLayout>
      <AppSectionShell section="default">
        <div className="mt-4 space-y-4 lg:space-y-5 xl:space-y-6">
          <Breadcrumb items={[{ label: "Replay", href: "/replay" }]} />
          <ReplayTemporada />
        </div>
      </AppSectionShell>
    </AppMainLayout>
  );
}
