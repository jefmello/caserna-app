"use client";

import AppMainLayout from "@/components/navigation/app-main-layout";
import AppSectionShell from "@/components/navigation/app-section-shell";
import MidiaPageContent from "@/components/midia/midia-page-content";

export default function MidiaPage() {
  return (
    <AppMainLayout>
      <AppSectionShell>
        <MidiaPageContent />
      </AppSectionShell>
    </AppMainLayout>
  );
}