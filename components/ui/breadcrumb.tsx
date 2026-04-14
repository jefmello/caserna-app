"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  isDark?: boolean;
}

export default function Breadcrumb({ items, isDark = false }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className="flex items-center gap-1 text-xs">
        <li>
          <Link
            href="/"
            className={`flex items-center gap-1 rounded-md px-1.5 py-1 transition ${
              isDark
                ? "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            }`}
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href || item.label} className="flex items-center gap-1">
              <ChevronRight
                className={`h-3 w-3 ${
                  isDark ? "text-zinc-600" : "text-zinc-300"
                }`}
              />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={`rounded-md px-1.5 py-1 transition ${
                    isDark
                      ? "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                      : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`px-1.5 py-1 font-medium ${
                    isDark ? "text-zinc-200" : "text-zinc-700"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
