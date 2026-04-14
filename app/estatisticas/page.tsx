import { Suspense } from "react";
import EstatisticasPageContent from "@/components/estatisticas/estatisticas-page-content";

export default function EstatisticasPage() {
  return (
    <Suspense fallback={<EstatisticasLoadingSkeleton />}>
      <EstatisticasPageContent />
    </Suspense>
  );
}

function EstatisticasLoadingSkeleton() {
  return (
    <div className="mt-4 space-y-4 lg:space-y-5 xl:space-y-6">
      <div className="animate-pulse rounded-[24px] bg-zinc-200/50 p-6" />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="animate-pulse rounded-[24px] bg-zinc-200/50 p-6" />
        <div className="animate-pulse rounded-[24px] bg-zinc-200/50 p-6" />
      </div>
    </div>
  );
}
