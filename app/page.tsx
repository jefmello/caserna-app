"use client";

import AppMainLayout from "@/components/navigation/app-main-layout";
import AppSectionShell from "@/components/navigation/app-section-shell";
import HomePageContent from "@/components/home/home-page-content";

export default function HomePage() {
  return (
    <AppMainLayout>
      <AppSectionShell section="home">
        <HomePageContent />
      </AppSectionShell>
    </AppMainLayout>
  );
}
