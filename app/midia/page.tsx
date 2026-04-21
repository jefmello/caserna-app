import { Suspense } from "react";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import MidiaPageContent from "@/components/midia/midia-page-content";

export default function MidiaPage() {
  return (
    <Suspense fallback={<MidiaLoadingSkeleton />}>
      <MidiaPageContent />
    </Suspense>
  );
}

function MidiaLoadingSkeleton() {
  return (
    <div className="mt-4 space-y-4 lg:space-y-5 xl:space-y-6">
      <div className="animate-pulse rounded-[24px] bg-zinc-200/50 p-6" />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonCard />
      </div>
      <Skeleton className="h-48 w-full rounded-[24px] bg-zinc-200/50" />
    </div>
  );
}
