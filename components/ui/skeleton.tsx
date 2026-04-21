import clsx from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx("animate-pulse rounded-lg bg-zinc-200 dark:bg-white/[0.06]", className)} />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-[#111827]",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
