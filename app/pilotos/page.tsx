import { Suspense } from "react";
import { SkeletonCard } from "@/components/ui/skeleton";
import PilotosPageContent from "@/components/pilotos/pilotos-page-content";

export default function PilotosPage() {
  return (
    <Suspense fallback={<PilotosLoadingSkeleton />}>
      <PilotosPageContent />
    </Suspense>
  );
}

function PilotosLoadingSkeleton() {
  return (
    <div className="mt-4 space-y-4 lg:space-y-5 xl:space-y-6">
      <div className="animate-pulse rounded-[24px] bg-zinc-200/50 p-6" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
