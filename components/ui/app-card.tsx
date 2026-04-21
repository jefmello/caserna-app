"use client";

import clsx from "clsx";

type Variant = "default" | "elevated" | "premium";

export default function AppCard({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
}) {
  return (
    <div
      className={clsx(
        "rounded-[24px] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01]",
        variant === "default" && [
          "dark:border-white/6 dark:bg-white/[0.03]",
          "border-zinc-200 bg-white",
        ],
        variant === "elevated" && [
          "dark:border-white/8 dark:bg-white/[0.04] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)] dark:hover:shadow-[0_14px_40px_rgba(0,0,0,0.35)]",
          "border-zinc-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.1)]",
        ],
        variant === "premium" && [
          "dark:border-white/10 dark:from-white/[0.06] dark:to-white/[0.02] dark:shadow-[0_20px_40px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_24px_48px_rgba(0,0,0,0.45)]",
          "border-zinc-200 bg-gradient-to-br from-zinc-50 to-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_24px_48px_rgba(0,0,0,0.12)]",
        ],
        className
      )}
    >
      {children}
    </div>
  );
}
