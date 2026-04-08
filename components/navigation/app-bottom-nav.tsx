"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  BarChart3,
  Home,
  Menu,
  Trophy,
  UserRound,
} from "lucide-react";
import AppMobileMoreSheet from "@/components/navigation/app-mobile-more-sheet";

type AppBottomNavProps = {
  isDarkMode?: boolean;
};

type NavItem = {
  href?: string;
  label: string;
  icon: React.ElementType;
  type: "link" | "action";
};

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: Home,
    type: "link",
  },
  {
    href: "/classificacao",
    label: "Classif.",
    icon: Trophy,
    type: "link",
  },
  {
    href: "/pilotos",
    label: "Pilotos",
    icon: UserRound,
    type: "link",
  },
  {
    href: "/estatisticas",
    label: "Stats",
    icon: BarChart3,
    type: "link",
  },
  {
    label: "Mais",
    icon: Menu,
    type: "action",
  },
];

function isActivePath(pathname: string, href?: string) {
  if (!href) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppBottomNav({
  isDarkMode = false,
}: AppBottomNavProps) {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const hasSecondaryRouteActive = useMemo(() => {
    return ["/simulacoes", "/midia", "/duelos"].some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
  }, [pathname]);

  return (
    <>
      <nav
        className={`fixed inset-x-0 bottom-0 z-[70] border-t md:hidden ${
          isDarkMode
            ? "border-white/10 bg-[#0b1220]/95 text-white backdrop-blur-xl"
            : "border-black/5 bg-white/95 text-zinc-950 backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto grid max-w-xl grid-cols-5 gap-1 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.type === "action") {
              const active = isMoreOpen || hasSecondaryRouteActive;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setIsMoreOpen(true)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 transition-all duration-200 ${
                    active
                      ? isDarkMode
                        ? "bg-yellow-500/10 text-yellow-300"
                        : "bg-yellow-50 text-yellow-700"
                      : isDarkMode
                        ? "text-zinc-400 hover:bg-white/5 hover:text-white"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  <span className="text-[10px] font-bold tracking-tight">
                    {item.label}
                  </span>
                </button>
              );
            }

            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 transition-all duration-200 ${
                  active
                    ? isDarkMode
                      ? "bg-yellow-500/10 text-yellow-300"
                      : "bg-yellow-50 text-yellow-700"
                    : isDarkMode
                      ? "text-zinc-400 hover:bg-white/5 hover:text-white"
                      : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                <span className="text-[10px] font-bold tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <AppMobileMoreSheet
        open={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        isDarkMode={isDarkMode}
        pathname={pathname}
      />
    </>
  );
}