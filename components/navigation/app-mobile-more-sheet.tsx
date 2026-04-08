"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  BarChart3,
  Clapperboard,
  Home,
  Trophy,
  UserRound,
  X,
  Sparkles,
  Swords,
} from "lucide-react";

type AppMobileMoreSheetProps = {
  open: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
  pathname: string;
};

type SheetItem = {
  href: string;
  label: string;
  description: string;
  icon: React.ElementType;
};

const primaryItems: SheetItem[] = [
  {
    href: "/",
    label: "Home",
    description: "Painel principal do campeonato",
    icon: Home,
  },
  {
    href: "/classificacao",
    label: "Classificação",
    description: "Tabela oficial e Top 6",
    icon: Trophy,
  },
  {
    href: "/pilotos",
    label: "Pilotos",
    description: "Análise individual",
    icon: UserRound,
  },
  {
    href: "/estatisticas",
    label: "Estatísticas",
    description: "Leitura analítica",
    icon: BarChart3,
  },
];

const secondaryItems: SheetItem[] = [
  {
    href: "/simulacoes",
    label: "Simulações",
    description: "Projeções e cenários",
    icon: Sparkles,
  },
  {
    href: "/midia",
    label: "Mídia",
    description: "Cards e compartilhamento",
    icon: Clapperboard,
  },
  {
    href: "/duelos",
    label: "Duelos",
    description: "Comparação direta entre pilotos",
    icon: Swords,
  },
];

function isItemActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppMobileMoreSheet({
  open,
  onClose,
  isDarkMode = false,
  pathname,
}: AppMobileMoreSheetProps) {
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] md:hidden">
      <button
        type="button"
        aria-label="Fechar menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />

      <div
        className={`absolute inset-x-0 bottom-0 rounded-t-[28px] border-t shadow-[0_-18px_60px_rgba(0,0,0,0.28)] ${
          isDarkMode
            ? "border-white/10 bg-[#0b1220] text-white"
            : "border-black/5 bg-white text-zinc-950"
        }`}
      >
        <div className="px-4 pb-7 pt-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p
                className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Navegação expandida
              </p>
              <h3 className="mt-1 text-[20px] font-extrabold tracking-tight">
                Mais opções
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${
                isDarkMode
                  ? "bg-white/5 text-zinc-300 hover:bg-white/10"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <p
                className={`mb-2 text-[10px] font-bold uppercase tracking-[0.16em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Principais
              </p>

              <div className="grid grid-cols-1 gap-2">
                {primaryItems.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`rounded-[20px] border px-3 py-3 transition-all duration-200 ${
                        isDarkMode
                          ? active
                            ? "border-yellow-500/30 bg-yellow-500/10"
                            : "border-white/10 bg-[#111827] hover:border-white/20 hover:bg-[#162033]"
                          : active
                            ? "border-yellow-300 bg-yellow-50"
                            : "border-black/5 bg-zinc-50 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                            isDarkMode
                              ? active
                                ? "bg-yellow-500/15 text-yellow-300"
                                : "bg-white/5 text-zinc-300"
                              : active
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[14px] font-extrabold">{item.label}</p>
                          <p
                            className={`mt-0.5 text-[11px] ${
                              isDarkMode ? "text-zinc-400" : "text-zinc-500"
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <p
                className={`mb-2 text-[10px] font-bold uppercase tracking-[0.16em] ${
                  isDarkMode ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Extras
              </p>

              <div className="grid grid-cols-1 gap-2">
                {secondaryItems.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`rounded-[20px] border px-3 py-3 transition-all duration-200 ${
                        isDarkMode
                          ? active
                            ? "border-yellow-500/30 bg-yellow-500/10"
                            : "border-white/10 bg-[#111827] hover:border-white/20 hover:bg-[#162033]"
                          : active
                            ? "border-yellow-300 bg-yellow-50"
                            : "border-black/5 bg-zinc-50 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                            isDarkMode
                              ? active
                                ? "bg-yellow-500/15 text-yellow-300"
                                : "bg-white/5 text-zinc-300"
                              : active
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[14px] font-extrabold">{item.label}</p>
                          <p
                            className={`mt-0.5 text-[11px] ${
                              isDarkMode ? "text-zinc-400" : "text-zinc-500"
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}