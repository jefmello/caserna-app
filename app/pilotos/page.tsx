"use client";

import { Suspense } from "react";
import PilotosPageContent from "@/components/pilotos/pilotos-page-content";

export default function PilotosPage() {
  return (
    <Suspense fallback={<div className="p-6">Carregando pilotos...</div>}>
      <PilotosPageContent />
    </Suspense>
  );
}