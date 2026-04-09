"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Trophy,
  Users,
  BarChart3,
  LineChart,
  Swords,
  Image as ImageIcon,
  ChevronLeft,
  X,
} from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useChampionship } from "@/context/championship-context";
import { getLeader } from "@/lib/ranking/get-leader";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

type AppSidebarProps = {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
};

const primaryNav: NavItem[] = [
  { label: "Painel", href: "/", icon: LayoutDashboard },
  { label: "Classificação", href: "/classificacao", icon: Trophy },
  { label: "Pilotos", href: "/pilotos", icon: Users },
  { label: "Estatísticas", href: "/estatisticas", icon: BarChart3 },
];

const secondaryNav: NavItem[] = [
  { label: "Simulações", href: "/simulacoes", icon: LineChart },
  { label: "Duelos", href: "/duelos", icon: Swords },
  { label: "Mídia", href: "/midia", icon: ImageIcon },
];

const SIDEBAR_BRAND_IMAGE_SRC = "/branding/sidebar-brand.png";
const SIDEBAR_BRAND_IMAGE_ALT = "Caserna Kart Racing";
const SIDEBAR_BRAND_COMPACT_IMAGE_SRC = "/branding/sidebar-brand-compact.png";
const SIDEBAR_BRAND_COMPACT_IMAGE_ALT = "Caserna";

function readThemeFromEnvironment() {
  if (typeof window === "undefined") return true;

  const storedTheme = window.localStorage.getItem("caserna-theme");
  const rootHasDark = document.documentElement.classList.contains("dark");
  const bodyHasDark = document.body.classList.contains("dark");

  return storedTheme === "dark" || rootHasDark || bodyHasDark;
}

export default function AppSidebar({
  mobileOpen = false,
  onCloseMobile,
}: AppSidebarProps) {
  const pathname = usePathname();
  const { categoria, campeonato, setCategoria } = useChampionship();

  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [leader, setLeader] = useState<{
    nome: string;
    pontos: number;
    pilotoId?: string;
    gap: number;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) {
      setCollapsed(saved === "true");
    }
  }, []);

  useEffect(() => {
    const syncTheme = () => {
      setIsDarkMode(readThemeFromEnvironment());
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("storage", syncTheme);
    window.addEventListener("caserna-theme-change", syncTheme as EventListener);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener(
        "caserna-theme-change",
        syncTheme as EventListener
      );
    };
  }, []);

  useEffect(() => {
    async function loadLeader() {
      const data = await getLeader(categoria, campeonato);
      setLeader(data);
    }

    loadLeader();
  }, [categoria, campeonato]);

  useEffect(() => {
    if (mobileOpen && onCloseMobile) {
      onCloseMobile();
    }
  }, [pathname]);

  const isExpanded = !collapsed || hovered;

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  const categoryOptions = [
    {
      key: "Base",
      label: "Base",
      activeClass:
        "border-orange-400/50 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.18),transparent_68%),linear-gradient(180deg,rgba(249,115,22,0.16)_0%,rgba(249,115,22,0.06)_100%)] text-orange-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_28px_rgba(249,115,22,0.18)] ring-1 ring-orange-400/38",
      idleClass: isDarkMode
        ? "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045)_0%,rgba(255,255,255,0.02)_100%)] text-white/68 hover:border-orange-400/24 hover:bg-[linear-gradient(180deg,rgba(249,115,22,0.10)_0%,rgba(249,115,22,0.04)_100%)] hover:text-orange-300"
        : "border-zinc-200 bg-white text-zinc-600 hover:border-orange-300/50 hover:bg-orange-50 hover:text-orange-700",
    },
    {
      key: "Graduados",
      label: "Graduados",
      activeClass:
        "border-sky-400/50 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_68%),linear-gradient(180deg,rgba(14,165,233,0.16)_0%,rgba(14,165,233,0.06)_100%)] text-sky-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_28px_rgba(14,165,233,0.18)] ring-1 ring-sky-400/38",
      idleClass: isDarkMode
        ? "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045)_0%,rgba(255,255,255,0.02)_100%)] text-white/68 hover:border-sky-400/24 hover:bg-[linear-gradient(180deg,rgba(14,165,233,0.10)_0%,rgba(14,165,233,0.04)_100%)] hover:text-sky-300"
        : "border-zinc-200 bg-white text-zinc-600 hover:border-sky-300/50 hover:bg-sky-50 hover:text-sky-700",
    },
    {
      key: "Elite",
      label: "Elite",
      activeClass:
        "border-amber-400/50 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.18),transparent_68%),linear-gradient(180deg,rgba(245,158,11,0.16)_0%,rgba(245,158,11,0.06)_100%)] text-amber-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_28px_rgba(245,158,11,0.18)] ring-1 ring-amber-400/38",
      idleClass: isDarkMode
        ? "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045)_0%,rgba(255,255,255,0.02)_100%)] text-white/68 hover:border-amber-400/24 hover:bg-[linear-gradient(180deg,rgba(245,158,11,0.10)_0%,rgba(245,158,11,0.04)_100%)] hover:text-amber-300"
        : "border-zinc-200 bg-white text-zinc-600 hover:border-amber-300/50 hover:bg-amber-50 hover:text-amber-700",
    },
  ] as const;

  const leaderCardStyles = {
    Base: {
      card: isDarkMode
        ? "border-orange-400/18 bg-[linear-gradient(145deg,rgba(249,115,22,0.12),rgba(255,255,255,0.025))] shadow-[0_18px_40px_rgba(0,0,0,0.28),0_0_32px_rgba(249,115,22,0.12)]"
        : "border-orange-200 bg-[linear-gradient(145deg,rgba(249,115,22,0.08),rgba(255,255,255,0.9))] shadow-[0_12px_24px_rgba(15,23,42,0.06)]",
      label: isDarkMode ? "text-orange-300" : "text-orange-700",
      badge: isDarkMode
        ? "border-orange-400/22 bg-orange-400/[0.10] text-orange-300"
        : "border-orange-200 bg-orange-50 text-orange-700",
      trophy: isDarkMode
        ? "border-orange-400/24 bg-orange-400/[0.12] text-orange-300 shadow-[0_0_18px_rgba(249,115,22,0.16)]"
        : "border-orange-200 bg-orange-50 text-orange-700",
      gap: isDarkMode
        ? "border-orange-400/18 bg-orange-400/[0.08] text-orange-300"
        : "border-orange-200 bg-orange-50 text-orange-700",
    },
    Graduados: {
      card: isDarkMode
        ? "border-sky-400/18 bg-[linear-gradient(145deg,rgba(14,165,233,0.12),rgba(255,255,255,0.025))] shadow-[0_18px_40px_rgba(0,0,0,0.28),0_0_32px_rgba(14,165,233,0.12)]"
        : "border-sky-200 bg-[linear-gradient(145deg,rgba(14,165,233,0.08),rgba(255,255,255,0.9))] shadow-[0_12px_24px_rgba(15,23,42,0.06)]",
      label: isDarkMode ? "text-sky-300" : "text-sky-700",
      badge: isDarkMode
        ? "border-sky-400/22 bg-sky-400/[0.10] text-sky-300"
        : "border-sky-200 bg-sky-50 text-sky-700",
      trophy: isDarkMode
        ? "border-sky-400/24 bg-sky-400/[0.12] text-sky-300 shadow-[0_0_18px_rgba(14,165,233,0.16)]"
        : "border-sky-200 bg-sky-50 text-sky-700",
      gap: isDarkMode
        ? "border-sky-400/18 bg-sky-400/[0.08] text-sky-300"
        : "border-sky-200 bg-sky-50 text-sky-700",
    },
    Elite: {
      card: isDarkMode
        ? "border-amber-400/18 bg-[linear-gradient(145deg,rgba(245,158,11,0.12),rgba(255,255,255,0.025))] shadow-[0_18px_40px_rgba(0,0,0,0.28),0_0_32px_rgba(245,158,11,0.12)]"
        : "border-amber-200 bg-[linear-gradient(145deg,rgba(245,158,11,0.08),rgba(255,255,255,0.9))] shadow-[0_12px_24px_rgba(15,23,42,0.06)]",
      label: isDarkMode ? "text-amber-300" : "text-amber-700",
      badge: isDarkMode
        ? "border-amber-400/22 bg-amber-400/[0.10] text-amber-300"
        : "border-amber-200 bg-amber-50 text-amber-700",
      trophy: isDarkMode
        ? "border-amber-400/24 bg-amber-400/[0.12] text-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.16)]"
        : "border-amber-200 bg-amber-50 text-amber-700",
      gap: isDarkMode
        ? "border-amber-400/18 bg-amber-400/[0.08] text-amber-300"
        : "border-amber-200 bg-amber-50 text-amber-700",
    },
  } as const;

  const compactBrandStyles = {
    Base: {
      card: isDarkMode
        ? "border-orange-400/28 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.20),transparent_72%),linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.035)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_0_1px_rgba(249,115,22,0.14),0_18px_34px_rgba(249,115,22,0.18)]"
        : "border-orange-300/40 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.12),transparent_72%),linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.86)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_0_0_1px_rgba(249,115,22,0.12),0_16px_32px_rgba(249,115,22,0.12)]",
      glow: isDarkMode
        ? "bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.24),transparent_46%)]"
        : "bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.18),transparent_46%)]",
      line: isDarkMode ? "via-orange-300/20" : "via-orange-300/60",
    },
    Graduados: {
      card: isDarkMode
        ? "border-sky-400/28 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.20),transparent_72%),linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.035)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_0_1px_rgba(14,165,233,0.14),0_18px_34px_rgba(14,165,233,0.18)]"
        : "border-sky-300/40 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.12),transparent_72%),linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.86)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_0_0_1px_rgba(14,165,233,0.12),0_16px_32px_rgba(14,165,233,0.12)]",
      glow: isDarkMode
        ? "bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.24),transparent_46%)]"
        : "bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_46%)]",
      line: isDarkMode ? "via-sky-300/20" : "via-sky-300/60",
    },
    Elite: {
      card: isDarkMode
        ? "border-amber-400/28 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.20),transparent_72%),linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.035)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_0_1px_rgba(245,158,11,0.14),0_18px_34px_rgba(245,158,11,0.18)]"
        : "border-amber-300/40 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.12),transparent_72%),linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.86)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_0_0_1px_rgba(245,158,11,0.12),0_16px_32px_rgba(245,158,11,0.12)]",
      glow: isDarkMode
        ? "bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.24),transparent_46%)]"
        : "bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_46%)]",
      line: isDarkMode ? "via-amber-300/20" : "via-amber-300/60",
    },
  } as const;

  const currentLeaderStyles =
    leaderCardStyles[
      (categoria in leaderCardStyles ? categoria : "Elite") as keyof typeof leaderCardStyles
    ];

  const currentCompactBrandStyles =
    compactBrandStyles[
      (categoria in compactBrandStyles ? categoria : "Elite") as keyof typeof compactBrandStyles
    ];

  const renderItem = (item: NavItem, mobile = false) => {
    const isHome = item.href === "/";
    const isActive = isHome
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`);
    const Icon = item.icon;

    const content = (
      <motion.div
        whileHover={{ scale: mobile ? 1 : 1.015, x: mobile ? 0 : 1 }}
        transition={{ duration: 0.18 }}
        className={clsx(
          "group relative overflow-hidden rounded-2xl border transition-all duration-200",
          mobile
            ? "flex items-center gap-3 px-4 py-3.5"
            : isExpanded
              ? "flex items-center gap-3 px-3 py-3"
              : "flex items-center justify-center px-0 py-2.5",
          isActive
            ? isDarkMode
              ? "border-white/10 bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_10px_30px_rgba(0,0,0,0.25)]"
              : "border-zinc-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
            : isDarkMode
              ? "border-transparent bg-white/[0.02] hover:border-white/8 hover:bg-white/[0.045]"
              : "border-transparent bg-white/70 hover:border-zinc-200 hover:bg-white"
        )}
      >
        {isActive && !mobile && (
          <>
            {isExpanded ? (
              <motion.div
                layoutId="sidebar-active-pill"
                className={clsx(
                  "absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full",
                  isDarkMode
                    ? "bg-white shadow-[0_0_14px_rgba(255,255,255,0.55)]"
                    : "bg-zinc-900 shadow-[0_0_10px_rgba(24,24,27,0.16)]"
                )}
              />
            ) : (
              <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2">
                <div
                  className={clsx(
                    "h-8 w-[3px] rounded-full blur-[1px]",
                    isDarkMode ? "bg-white/90" : "bg-zinc-900/90"
                  )}
                />
                <div
                  className={clsx(
                    "absolute inset-0 h-8 w-[3px] rounded-full",
                    isDarkMode ? "bg-white" : "bg-zinc-900"
                  )}
                />
              </div>
            )}

            <div
              className={clsx(
                "absolute inset-0 bg-gradient-to-r via-transparent to-transparent",
                isDarkMode ? "from-white/[0.05]" : "from-black/[0.03]"
              )}
            />
          </>
        )}

        <div
          className={clsx(
            "relative z-[1] flex shrink-0 items-center justify-center border transition-all duration-200",
            mobile
              ? "h-11 w-11 rounded-2xl"
              : isExpanded
                ? "h-10 w-10 rounded-xl"
                : "h-11 w-11 rounded-2xl",
            isActive
              ? isDarkMode
                ? "border-white/10 bg-white/[0.10] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                : "border-zinc-200 bg-zinc-50 text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
              : isDarkMode
                ? "border-white/6 bg-white/[0.04] text-white/75 group-hover:border-white/10 group-hover:bg-white/[0.08] group-hover:text-white"
                : "border-zinc-200 bg-white text-zinc-600 group-hover:border-zinc-300 group-hover:bg-zinc-50 group-hover:text-zinc-900"
          )}
        >
          <Icon
            className={clsx(
              mobile ? "h-5 w-5" : isExpanded ? "h-[18px] w-[18px]" : "h-[19px] w-[19px]"
            )}
          />
        </div>

        {(mobile || isExpanded) && (
          <div className="relative z-[1] min-w-0 flex-1">
            <div
              className={clsx(
                "truncate font-semibold tracking-[0.01em] transition-colors",
                mobile ? "text-[15px]" : "text-sm",
                isActive
                  ? isDarkMode
                    ? "text-white"
                    : "text-zinc-950"
                  : isDarkMode
                    ? "text-white/72 group-hover:text-white"
                    : "text-zinc-700 group-hover:text-zinc-950"
              )}
            >
              {item.label}
            </div>
          </div>
        )}

        {(mobile || isExpanded) && isActive && (
          <div
            className={clsx(
              "relative z-[1] h-2.5 w-2.5 rounded-full",
              isDarkMode
                ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                : "bg-zinc-900 shadow-[0_0_10px_rgba(24,24,27,0.22)]"
            )}
          />
        )}
      </motion.div>
    );

    return (
      <Link key={`${mobile ? "mobile" : "desktop"}-${item.href}`} href={item.href}>
        {content}
      </Link>
    );
  };

  const MobileSidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 pb-3 pt-4">
        <div className="min-w-0">
          <p
            className={clsx(
              "text-[11px] font-black uppercase tracking-[0.22em]",
              isDarkMode ? "text-zinc-400" : "text-zinc-500"
            )}
          >
            Caserna Kart Racing
          </p>
          <p className="mt-1 text-lg font-semibold tracking-tight">Menu</p>
        </div>

        <button
          type="button"
          onClick={onCloseMobile}
          className={clsx(
            "inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-200",
            isDarkMode
              ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
              : "border-black/5 bg-white text-zinc-900 hover:bg-zinc-50"
          )}
          aria-label="Fechar menu"
          title="Fechar menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-4 pb-4">
        <div
          className={clsx(
            "relative h-[108px] overflow-hidden rounded-[24px] border",
            isDarkMode
              ? "border-white/8 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_38px_rgba(0,0,0,0.30)]"
              : "border-zinc-200/70 bg-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.76),0_14px_32px_rgba(15,23,42,0.10)]"
          )}
        >
          <div
            className={clsx(
              "pointer-events-none absolute inset-0",
              isDarkMode
                ? "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.09),transparent_42%)]"
                : "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_42%)]"
            )}
          />
          <div
            className={clsx(
              "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent",
              isDarkMode ? "via-white/12" : "via-white/60"
            )}
          />
          <div className="relative h-full w-full px-4 py-3">
            <Image
              src={SIDEBAR_BRAND_IMAGE_SRC}
              alt={SIDEBAR_BRAND_IMAGE_ALT}
              fill
              className="object-contain px-4 py-3"
              priority
              sizes="280px"
            />
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div
          className={clsx(
            "rounded-[24px] border p-3",
            isDarkMode
              ? "border-white/8 bg-[linear-gradient(180deg,rgba(17,24,39,0.92)_0%,rgba(15,23,42,0.96)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_14px_32px_rgba(0,0,0,0.22)]"
              : "border-zinc-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(248,250,252,0.96)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_14px_28px_rgba(15,23,42,0.06)]"
          )}
        >
          <div className="mb-3 flex items-center gap-2">
            <p
              className={clsx(
                "text-[10px] font-semibold uppercase tracking-[0.22em]",
                isDarkMode ? "text-white/32" : "text-zinc-400"
              )}
            >
              Categoria
            </p>
            <div
              className={clsx(
                "h-px flex-1 bg-gradient-to-r from-transparent to-transparent",
                isDarkMode ? "via-white/10" : "via-zinc-200"
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {categoryOptions.map((option) => {
              const isActive = categoria === option.key;

              return (
                <button
                  key={`mobile-${option.key}`}
                  type="button"
                  onClick={() => setCategoria(option.key as typeof categoria)}
                  className={clsx(
                    "flex h-11 min-w-0 items-center justify-center rounded-[18px] border px-2 text-[11px] font-semibold tracking-[0.01em] transition-all duration-200",
                    isActive ? option.activeClass : option.idleClass
                  )}
                >
                  <span className="truncate">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {leader && (
        <div className="px-4 pb-4">
          <div
            className={clsx(
              "overflow-hidden rounded-[28px] border p-4",
              currentLeaderStyles.card
            )}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div
                className={clsx(
                  "text-[11px] font-semibold uppercase tracking-[0.22em]",
                  currentLeaderStyles.label
                )}
              >
                Líder do campeonato
              </div>
              <span
                className={clsx(
                  "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
                  currentLeaderStyles.badge
                )}
              >
                LÍDER
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  "relative h-14 w-14 shrink-0 overflow-hidden rounded-full border",
                  isDarkMode
                    ? "border-white/10 bg-white/[0.06] shadow-[0_10px_24px_rgba(0,0,0,0.3)]"
                    : "border-zinc-200 bg-zinc-50 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                )}
              >
                {leader.pilotoId ? (
                  <img
                    src={`/pilotos/${leader.pilotoId}.jpg`}
                    alt={leader.nome}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className={clsx(
                      "flex h-full w-full items-center justify-center text-xs font-semibold",
                      isDarkMode ? "text-white/55" : "text-zinc-500"
                    )}
                  >
                    P1
                  </div>
                )}

                <div
                  className={clsx(
                    "pointer-events-none absolute inset-0 rounded-full ring-1",
                    isDarkMode ? "ring-white/10" : "ring-zinc-200"
                  )}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className={clsx(
                    "truncate text-base font-semibold tracking-[0.01em]",
                    isDarkMode ? "text-white" : "text-zinc-950"
                  )}
                >
                  {leader.nome}
                </div>
                <div
                  className={clsx(
                    "mt-1 text-sm",
                    isDarkMode ? "text-white/72" : "text-zinc-600"
                  )}
                >
                  {leader.pontos} pts
                </div>
              </div>

              <div
                className={clsx(
                  "flex h-10 w-10 items-center justify-center rounded-2xl border",
                  currentLeaderStyles.trophy
                )}
              >
                <Trophy className="h-4 w-4" />
              </div>
            </div>

            {leader.gap > 0 && (
              <div
                className={clsx(
                  "mt-4 rounded-2xl border px-3 py-2 text-[12px] font-medium",
                  currentLeaderStyles.gap
                )}
              >
                +{leader.gap} pts para P2
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="mb-5">
          <div
            className={clsx(
              "mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.24em]",
              isDarkMode ? "text-white/32" : "text-zinc-400"
            )}
          >
            Principal
          </div>

          <div className="flex flex-col gap-2">
            {primaryNav.map((item) => renderItem(item, true))}
          </div>
        </div>

        <div>
          <div
            className={clsx(
              "mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.24em]",
              isDarkMode ? "text-white/32" : "text-zinc-400"
            )}
          >
            Explorar
          </div>

          <div className="flex flex-col gap-2">
            {secondaryNav.map((item) => renderItem(item, true))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-[80] transition-all duration-300 lg:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        <button
          type="button"
          aria-label="Fechar menu"
          className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
          onClick={onCloseMobile}
        />

        <aside
          className={clsx(
            "absolute left-0 top-0 h-full w-[88vw] max-w-[340px] border-r shadow-[0_24px_60px_rgba(0,0,0,0.34)] transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
            isDarkMode
              ? "border-white/10 bg-[linear-gradient(180deg,#0b0f16_0%,#0f172a_48%,#111827_100%)] text-white"
              : "border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_42%,#eef2f7_100%)] text-zinc-900"
          )}
        >
          <div
            className={clsx(
              "absolute inset-x-0 top-0 h-[3px]",
              isDarkMode
                ? "bg-gradient-to-r from-transparent via-white/25 to-transparent"
                : "bg-gradient-to-r from-transparent via-zinc-300 to-transparent"
            )}
          />
          {MobileSidebarContent}
        </aside>
      </div>

      <motion.aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{ width: isExpanded ? 288 : 88 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className={clsx(
          "fixed left-0 top-0 z-50 hidden h-screen flex-col border-r lg:flex",
          isDarkMode
            ? "border-white/6 bg-[linear-gradient(180deg,#05070b_0%,#090b10_42%,#05070a_100%)]"
            : "border-zinc-200 bg-[linear-gradient(180deg,#f8fafc_0%,#f5f7fb_42%,#eef2f7_100%)]"
        )}
      >
        <div
          className={clsx(
            "pointer-events-none absolute inset-0",
            isDarkMode
              ? "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(250,204,21,0.05),transparent_24%)]"
              : "bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.04),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.05),transparent_24%)]"
          )}
        />
        <div
          className={clsx(
            "pointer-events-none absolute inset-y-0 right-0 w-px",
            isDarkMode ? "bg-white/6" : "bg-zinc-200"
          )}
        />

        <div
          className={clsx(
            "sidebar-scroll relative z-[1] flex h-full flex-col overflow-y-auto px-4",
            isExpanded ? "py-5" : "py-3"
          )}
        >
          <div
            className={clsx(
              "flex",
              isExpanded
                ? "mb-5 items-start justify-between gap-3"
                : "mb-5 flex-col items-center justify-center gap-4 pt-1"
            )}
          >
            {isExpanded ? (
              <>
                <div className="min-w-0 flex-1">
                  <div
                    className={clsx(
                      "relative h-[122px] w-full overflow-hidden rounded-[28px] border",
                      isDarkMode
                        ? "border-white/8 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_38px_rgba(0,0,0,0.30)]"
                        : "border-zinc-200/70 bg-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.76),0_14px_32px_rgba(15,23,42,0.10)]"
                    )}
                  >
                    <div
                      className={clsx(
                        "pointer-events-none absolute inset-0",
                        isDarkMode
                          ? "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.09),transparent_42%)]"
                          : "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_42%)]"
                      )}
                    />
                    <div
                      className={clsx(
                        "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent",
                        isDarkMode ? "via-white/12" : "via-white/60"
                      )}
                    />
                    <div className="relative h-full w-full px-4 py-3">
                      <Image
                        src={SIDEBAR_BRAND_IMAGE_SRC}
                        alt={SIDEBAR_BRAND_IMAGE_ALT}
                        fill
                        className="object-contain px-4 py-3"
                        priority
                        sizes="240px"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={toggleSidebar}
                  className={clsx(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-all duration-200",
                    isDarkMode
                      ? "border-white/8 bg-white/[0.04] text-white/75 hover:border-white/12 hover:bg-white/[0.08] hover:text-white"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
                  )}
                  aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
                >
                  <ChevronLeft
                    className={clsx(
                      "h-4 w-4 transition-transform duration-200",
                      collapsed && !hovered && "rotate-180"
                    )}
                  />
                </button>
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.03, y: -1 }}
                  transition={{ duration: 0.18 }}
                  className={clsx(
                    "relative flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-[24px]",
                    currentCompactBrandStyles.card
                  )}
                >
                  <div
                    className={clsx(
                      "pointer-events-none absolute inset-0",
                      currentCompactBrandStyles.glow
                    )}
                  />
                  <div
                    className={clsx(
                      "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent",
                      currentCompactBrandStyles.line
                    )}
                  />
                  <div className="relative h-full w-full px-3 py-2.5">
                    <Image
                      src={SIDEBAR_BRAND_COMPACT_IMAGE_SRC}
                      alt={SIDEBAR_BRAND_COMPACT_IMAGE_ALT}
                      fill
                      className="object-contain px-3 py-2.5"
                      priority
                      sizes="72px"
                    />
                  </div>
                </motion.div>

                <button
                  onClick={toggleSidebar}
                  className={clsx(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-all duration-200",
                    isDarkMode
                      ? "border-white/8 bg-white/[0.04] text-white/75 hover:border-white/12 hover:bg-white/[0.08] hover:text-white"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
                  )}
                  aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
                >
                  <ChevronLeft
                    className={clsx(
                      "h-4 w-4 transition-transform duration-200",
                      collapsed && !hovered && "rotate-180"
                    )}
                  />
                </button>
              </>
            )}
          </div>

          {isExpanded && (
            <div
              className={clsx(
                "mb-5 rounded-[24px] border p-3",
                isDarkMode
                  ? "border-white/8 bg-[linear-gradient(180deg,rgba(17,24,39,0.92)_0%,rgba(15,23,42,0.96)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_14px_32px_rgba(0,0,0,0.22)]"
                  : "border-zinc-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(248,250,252,0.96)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_14px_28px_rgba(15,23,42,0.06)]"
              )}
            >
              <div className="mb-3 flex items-center gap-2">
                <p
                  className={clsx(
                    "text-[10px] font-semibold uppercase tracking-[0.22em]",
                    isDarkMode ? "text-white/32" : "text-zinc-400"
                  )}
                >
                  Categoria
                </p>
                <div
                  className={clsx(
                    "h-px flex-1 bg-gradient-to-r from-transparent to-transparent",
                    isDarkMode ? "via-white/10" : "via-zinc-200"
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {categoryOptions.map((option) => {
                  const isActive = categoria === option.key;

                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setCategoria(option.key as typeof categoria)}
                      className={clsx(
                        "flex h-11 min-w-0 items-center justify-center rounded-[18px] border px-2 text-[11px] font-semibold tracking-[0.01em] transition-all duration-200",
                        isActive ? option.activeClass : option.idleClass
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isExpanded && leader && (
            <motion.div
              key={`${categoria}-${campeonato}-${leader.nome}-${leader.pontos}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className={clsx(
                "mb-5 overflow-hidden rounded-[28px] border p-4",
                currentLeaderStyles.card
              )}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div
                  className={clsx(
                    "text-[11px] font-semibold uppercase tracking-[0.22em]",
                    currentLeaderStyles.label
                  )}
                >
                  Líder do campeonato
                </div>
                <span
                  className={clsx(
                    "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
                    currentLeaderStyles.badge
                  )}
                >
                  LÍDER
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={clsx(
                    "relative h-14 w-14 shrink-0 overflow-hidden rounded-full border",
                    isDarkMode
                      ? "border-white/10 bg-white/[0.06] shadow-[0_10px_24px_rgba(0,0,0,0.3)]"
                      : "border-zinc-200 bg-zinc-50 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                  )}
                >
                  {leader.pilotoId ? (
                    <img
                      src={`/pilotos/${leader.pilotoId}.jpg`}
                      alt={leader.nome}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className={clsx(
                        "flex h-full w-full items-center justify-center text-xs font-semibold",
                        isDarkMode ? "text-white/55" : "text-zinc-500"
                      )}
                    >
                      P1
                    </div>
                  )}

                  <div
                    className={clsx(
                      "pointer-events-none absolute inset-0 rounded-full ring-1",
                      isDarkMode ? "ring-white/10" : "ring-zinc-200"
                    )}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div
                    className={clsx(
                      "truncate text-base font-semibold tracking-[0.01em]",
                      isDarkMode ? "text-white" : "text-zinc-950"
                    )}
                  >
                    {leader.nome}
                  </div>
                  <div
                    className={clsx(
                      "mt-1 text-sm",
                      isDarkMode ? "text-white/72" : "text-zinc-600"
                    )}
                  >
                    {leader.pontos} pts
                  </div>
                </div>

                <div
                  className={clsx(
                    "flex h-10 w-10 items-center justify-center rounded-2xl border",
                    currentLeaderStyles.trophy
                  )}
                >
                  <Trophy className="h-4 w-4" />
                </div>
              </div>

              {leader.gap > 0 && (
                <div
                  className={clsx(
                    "mt-4 rounded-2xl border px-3 py-2 text-[12px] font-medium",
                    currentLeaderStyles.gap
                  )}
                >
                  +{leader.gap} pts para P2
                </div>
              )}
            </motion.div>
          )}

          <div className={clsx(isExpanded ? "mb-5" : "mb-4")}>
            {isExpanded && (
              <div
                className={clsx(
                  "mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.24em]",
                  isDarkMode ? "text-white/32" : "text-zinc-400"
                )}
              >
                Principal
              </div>
            )}

            <div
              className={clsx("flex flex-col", isExpanded ? "gap-2" : "gap-1.5")}
            >
              {primaryNav.map((item) => renderItem(item))}
            </div>
          </div>

          <div className={clsx(isExpanded ? "mb-5" : "mb-4")}>
            {isExpanded && (
              <div
                className={clsx(
                  "mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.24em]",
                  isDarkMode ? "text-white/32" : "text-zinc-400"
                )}
              >
                Explorar
              </div>
            )}

            <div
              className={clsx("flex flex-col", isExpanded ? "gap-2" : "gap-1.5")}
            >
              {secondaryNav.map((item) => renderItem(item))}
            </div>
          </div>

          {isExpanded && (
            <div
              className={clsx(
                "mt-auto rounded-[24px] border p-4",
                isDarkMode
                  ? "border-white/6 bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                  : "border-zinc-200 bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_10px_24px_rgba(15,23,42,0.05)]"
              )}
            >
              <div
                className={clsx(
                  "text-[10px] font-semibold uppercase tracking-[0.22em]",
                  isDarkMode ? "text-white/30" : "text-zinc-400"
                )}
              >
                Plataforma
              </div>
              <div
                className={clsx(
                  "mt-2 text-sm font-semibold",
                  isDarkMode ? "text-white" : "text-zinc-950"
                )}
              >
                Caserna Racing App
              </div>
              <div
                className={clsx(
                  "mt-1 text-xs leading-relaxed",
                  isDarkMode ? "text-white/50" : "text-zinc-500"
                )}
              >
                Sistema premium com navegação contextual, dados vivos e
                hierarquia oficial.
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}