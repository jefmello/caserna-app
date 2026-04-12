import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Carregando">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" aria-hidden="true" />
        <p className="text-sm text-zinc-500">Carregando…</p>
      </div>
    </div>
  );
}
