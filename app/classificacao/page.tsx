"use client";

import AppMainLayout from "@/components/navigation/app-main-layout";
import AppSectionShell from "@/components/navigation/app-section-shell";
import ClassificacaoPageContent from "@/components/classificacao/classificacao-page-content";

export default function ClassificacaoPage() {
  return (
    <AppMainLayout>
      <AppSectionShell section="default">
        <ClassificacaoPageContent />
      </AppSectionShell>
    </AppMainLayout>
  );
}