"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  isDark?: boolean;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  isDark = false,
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-[24px] border px-6 py-12 text-center ${
        isDark
          ? "border-white/10 bg-[#111827] text-white"
          : "border-black/5 bg-white text-zinc-950"
      }`}
    >
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-3xl ${
          isDark ? "bg-white/5" : "bg-zinc-100"
        }`}
      >
        <Icon
          className={`h-7 w-7 ${
            isDark ? "text-zinc-500" : "text-zinc-400"
          }`}
        />
      </div>
      <p className="mt-4 text-base font-semibold">{title}</p>
      <p
        className={`mt-2 text-sm ${
          isDark ? "text-zinc-400" : "text-zinc-500"
        }`}
      >
        {description}
      </p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={`mt-5 inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
            isDark
              ? "bg-white/10 text-white hover:bg-white/15"
              : "bg-zinc-900 text-white hover:bg-zinc-800"
          }`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
