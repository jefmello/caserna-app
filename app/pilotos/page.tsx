"use client";

import { Suspense } from "react";
import AppMainLayout from "@/components/navigation/app-main-layout";
import AppSectionShell from "@/components/navigation/app-section-shell";
import PilotosPageContent from "@/components/pilotos/pilotos-page-content";

export default function PilotosPage() {
  return (
    <AppMainLayout>
      <AppSectionShell section="default">
        <Suspense fallback={<div className="p-6">Carregando pilotos...</div>}>
          <PilotosPageContent />
        </Suspense>
      </AppSectionShell>
    </AppMainLayout>
  );
}