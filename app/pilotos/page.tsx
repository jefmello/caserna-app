"use client";

import AppMainLayout from "@/components/navigation/app-main-layout";
import AppSectionShell from "@/components/navigation/app-section-shell";
import PilotosPageContent from "@/components/pilotos/pilotos-page-content";

export default function PilotosPage() {
  return (
    <AppMainLayout>
      <AppSectionShell section="default">
        <PilotosPageContent />
      </AppSectionShell>
    </AppMainLayout>
  );
}