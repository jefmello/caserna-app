"use client";

import AppMainLayout from "@/components/navigation/app-main-layout";
import AppSectionShell from "@/components/navigation/app-section-shell";
import EstatisticasPageContent from "@/components/estatisticas/estatisticas-page-content";

export default function EstatisticasPage() {
  return (
    <AppMainLayout>
      <AppSectionShell>
        <EstatisticasPageContent />
      </AppSectionShell>
    </AppMainLayout>
  );
}