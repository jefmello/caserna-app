"use client";

import AppMainLayout from "@/components/navigation/app-main-layout";
import AppSectionShell from "@/components/navigation/app-section-shell";
import SimulacoesPageContent from "@/components/simulacoes/simulacoes-page-content";

export default function SimulacoesPage() {
  return (
    <AppMainLayout>
      <AppSectionShell>
        <SimulacoesPageContent />
      </AppSectionShell>
    </AppMainLayout>
  );
}