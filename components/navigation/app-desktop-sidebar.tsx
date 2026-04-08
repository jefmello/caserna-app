"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Clapperboard,
  House,
  Swords,
  Trophy,
  UserRound,
  WandSparkles,
} from "lucide-react";

type AppDesktopSidebarProps = {
  isDarkMode?: boolean;
};

const navItems = [
  {
    label: "Início",
    href: "/",
    icon: House,
  },
  {
    label: "Classificação",
    href: "/classificacao",
    icon: Trophy,
  },
  {
    label: "Pilotos",
    href: "/pilotos",
    icon: UserRound,
  },
  {
    label: "Duelos",
    href: "/duelos",
    icon: Swords,
  },
  {
    label: "Estatísticas",
    href: "/estatisticas",
    icon: BarChart3,
  },
  {
    label: "Simulações",
    href: "/simulacoes",
    icon: WandSparkles,
  },
  {
    label: "Mídia",
    href: "/midia",
    icon: Clapperboard,
  },
];

export default function AppDesktopSidebar({
  isDarkMode = false,
}: AppDesktopSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 lg:block">
      <div
        className={`flex h-full flex-col border-r px-5 py-6 ${
          isDarkMode
            ? "border-white/10 bg-[#0b1220]"
            : "border-black/5 bg-white"
        }`}
      >
        <div className="mb-8">
          <div
            className={`rounded-[24px] border px-4 py-4 ${
              isDarkMode
                ? "border-white/10 bg-[#111827]"
                : "border-black/5 bg-zinc-50"
            }`}
          >
            <p
              className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Caserna Kart Racing
            </p>

            <h1
              className={`mt-2 text-[20px] font-extrabold leading-tight tracking-tight ${
                isDarkMode ? "text-white" : "text-zinc-950"
              }`}
            >
              Painel oficial do campeonato
            </h1>

            <p
              className={`mt-2 text-[12px] leading-snug ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Navegue pelos módulos do app com uma estrutura mais profissional e organizada.
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-[18px] border px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? isDarkMode
                      ? "border-white/10 bg-white/10 text-white"
                      : "border-black/5 bg-zinc-100 text-zinc-950"
                    : isDarkMode
                      ? "border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/5 hover:text-white"
                      : "border-transparent text-zinc-500 hover:border-black/5 hover:bg-zinc-50 hover:text-zinc-950"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                    isActive
                      ? isDarkMode
                        ? "bg-white/10"
                        : "bg-white"
                      : isDarkMode
                        ? "bg-white/5"
                        : "bg-white"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold tracking-tight">
                    {item.label}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>

        <div
          className={`mt-6 rounded-[22px] border px-4 py-4 ${
            isDarkMode
              ? "border-white/10 bg-[#111827]"
              : "border-black/5 bg-zinc-50"
          }`}
        >
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
              isDarkMode ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            Estrutura nova
          </p>

          <p
            className={`mt-2 text-[13px] font-semibold leading-snug ${
              isDarkMode ? "text-white" : "text-zinc-900"
            }`}
          >
            O app agora está evoluindo para uma navegação por módulos.
          </p>

          <p
            className={`mt-2 text-[12px] leading-snug ${
              isDarkMode ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            Isso reduz concentração visual e melhora a experiência mobile e desktop.
          </p>
        </div>
      </div>
    </aside>
  );
}