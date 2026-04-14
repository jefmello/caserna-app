import { Suspense } from "react";
import ClassificacaoPageContent from "@/components/classificacao/classificacao-page-content";

export default function ClassificacaoPage() {
  return (
    <Suspense fallback={<ClassificacaoLoadingSkeleton />}>
      <ClassificacaoPageContent />
    </Suspense>
  );
}

function ClassificacaoLoadingSkeleton() {
  return (
    <div className="mt-4 space-y-4 lg:space-y-5 xl:space-y-6">
      <div className="animate-pulse rounded-[24px] bg-zinc-200/50 p-6" />
      <div className="animate-pulse rounded-[24px] bg-zinc-200/50 p-6" />
    </div>
  );
}
