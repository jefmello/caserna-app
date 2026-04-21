import { Suspense } from "react";
import { SkeletonCard } from "@/components/ui/skeleton";
import SimulacoesPageContent from "@/components/simulacoes/simulacoes-page-content";

export default function SimulacoesPage() {
  return (
    <Suspense fallback={<SimulacoesLoadingSkeleton />}>
      <SimulacoesPageContent />
    </Suspense>
  );
}

function SimulacoesLoadingSkeleton() {
  return (
    <div className="mt-4 space-y-4 lg:space-y-5 xl:space-y-6">
      <div className="animate-pulse rounded-[24px] bg-zinc-200/50 p-6" />
      <div className="animate-pulse rounded-[22px] bg-zinc-200/50 p-4" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
        {[...Array(2)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
