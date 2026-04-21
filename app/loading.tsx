import { Loader2 } from "lucide-react";
import { SkeletonCard } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      role="status"
      aria-label="Carregando"
    >
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" aria-hidden="true" />
          <p className="text-sm text-zinc-500">Carregando dados do campeonato…</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
