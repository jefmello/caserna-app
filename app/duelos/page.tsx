"use client";

import AppMainLayout from "@/components/navigation/app-main-layout";
import AppSectionShell from "@/components/navigation/app-section-shell";
import DuelosPageContent from "@/components/duelos/duelos-page-content";

export default function DuelosPage() {
  return (
    <AppMainLayout>
      <AppSectionShell>
        <DuelosPageContent />
      </AppSectionShell>
    </AppMainLayout>
  );
}