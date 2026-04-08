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
        "rounded-[24px] transition-all",
        variant === "default" &&
          "border border-white/6 bg-white/[0.03]",
        variant === "elevated" &&
          "border border-white/8 bg-white/[0.04] shadow-[0_10px_30px_rgba(0,0,0,0.25)]",
        variant === "premium" &&
          "border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] shadow-[0_20px_40px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      {children}
    </div>
  );
}