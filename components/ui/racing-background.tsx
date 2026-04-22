"use client";

import { useEffect, useRef, useState } from "react";
import useThemeVariant from "@/lib/hooks/useThemeVariant";
import useRacingBgEnabled from "@/lib/hooks/useRacingBgEnabled";
import { THEME_VARIANTS } from "@/lib/theme-variants";

type Props = {
  /** Number of speed streaks. Higher = denser motion. */
  streakCount?: number;
  /** Base speed multiplier (1 = normal, 2 = fast). */
  speed?: number;
  /** Opacity multiplier for the whole layer (0-1). */
  opacity?: number;
};

type Streak = {
  angle: number;
  distance: number;
  length: number;
  speed: number;
  width: number;
};

/**
 * Canvas-based racing background: perspective grid converging to a vanishing
 * point with speed streaks flying toward the viewer. Creates the sensation
 * of driving fast through a track.
 *
 * - Respects prefers-reduced-motion (renders static gradient instead).
 * - Pauses animation when tab is hidden (Page Visibility API).
 * - Adapts to dark/light by observing the root <html> class.
 * - Sits fixed behind all content at z-[-10].
 */
export default function RacingBackground({ streakCount = 140, speed = 1, opacity = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const streaksRef = useRef<Streak[]>([]);
  const { variant } = useThemeVariant();
  const { enabled: racingBgEnabled } = useRacingBgEnabled();
  const variantTokens = THEME_VARIANTS[variant];
  // Sempre `true` no primeiro render (server + client) para o React não
  // detectar hydration mismatch quando o user prefere light. O useEffect
  // logo abaixo lê o tema real do <html class="dark"> + localStorage e
  // corrige no próximo paint, antes do canvas começar a animar.
  const [isDark, setIsDark] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    // Disable the animated canvas on small viewports (battery + bandwidth),
    // when the user opted into reduced motion, or when Save-Data is enabled.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
    if (window.innerWidth < 640) return true;
    type ConnectionLike = { saveData?: boolean };
    const nav = navigator as Navigator & { connection?: ConnectionLike };
    if (nav.connection?.saveData) return true;
    return false;
  });

  // Sync theme from <html class="dark">
  useEffect(() => {
    const read = () => {
      if (typeof document === "undefined") return;
      const html = document.documentElement;
      const body = document.body;
      const stored =
        typeof window !== "undefined" ? window.localStorage.getItem("caserna-theme") : null;
      setIsDark(
        stored === "dark" || html.classList.contains("dark") || body.classList.contains("dark")
      );
    };

    read();

    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("storage", read);
    window.addEventListener("caserna-theme-change", read);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", read);
      window.removeEventListener("caserna-theme-change", read);
    };
  }, []);

  // Reduced motion preference + viewport guard — listen for runtime changes
  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const recompute = () => {
      if (motionMq.matches) return setReducedMotion(true);
      if (window.innerWidth < 640) return setReducedMotion(true);
      type ConnectionLike = { saveData?: boolean };
      const nav = navigator as Navigator & { connection?: ConnectionLike };
      if (nav.connection?.saveData) return setReducedMotion(true);
      setReducedMotion(false);
    };
    motionMq.addEventListener("change", recompute);
    window.addEventListener("resize", recompute);
    return () => {
      motionMq.removeEventListener("change", recompute);
      window.removeEventListener("resize", recompute);
    };
  }, []);

  // Initialize streaks
  useEffect(() => {
    const pool: Streak[] = [];
    for (let i = 0; i < streakCount; i++) {
      pool.push(createStreak());
    }
    streaksRef.current = pool;
  }, [streakCount]);

  // Animation loop
  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const cx = width / 2;
      const cy = height * 0.42; // vanishing point slightly above middle

      ctx.clearRect(0, 0, width, height);

      // Perspective grid — receding horizontal lines below horizon
      const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.06)";
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;

      const horizonY = cy;
      const linesBelow = 14;
      for (let i = 1; i <= linesBelow; i++) {
        const t = i / linesBelow;
        // non-linear spacing: closer = further apart (perspective)
        const progress = Math.pow(t, 2.3);
        const y = horizonY + progress * (height - horizonY);
        ctx.globalAlpha = 0.35 + 0.55 * t;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Perspective grid — converging vertical lines
      const columns = 18;
      for (let i = 0; i <= columns; i++) {
        const xRatio = i / columns;
        const topX = cx + (xRatio - 0.5) * width * 0.06;
        const bottomX = xRatio * width;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.moveTo(topX, horizonY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      // Speed streaks flying outward from vanishing point
      // Dark mode uses the variant accent for livery flavor; light mode stays slate.
      const streakBase = isDark ? variantTokens.accent : "15, 23, 42";
      const streaks = streaksRef.current;
      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i];
        s.distance += s.speed * speed;

        // Recycle if off-screen
        if (s.distance > 1.2) {
          streaks[i] = createStreak();
          continue;
        }

        const curve = Math.pow(s.distance, 2.1);
        const maxRadius = Math.hypot(width, height) * 0.75;
        const radius = curve * maxRadius;
        const x = cx + Math.cos(s.angle) * radius;
        const y = cy + Math.sin(s.angle) * radius * 1.15;
        const x2 = cx + Math.cos(s.angle) * radius * 0.85;
        const y2 = cy + Math.sin(s.angle) * radius * 0.85 * 1.15;

        const alpha = Math.min(0.85, s.distance * 1.6);
        ctx.strokeStyle = `rgba(${streakBase}, ${alpha * 0.55})`;
        ctx.lineWidth = s.width * Math.max(0.4, curve);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const start = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(draw);
    };

    const stop = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, [isDark, speed, reducedMotion, variantTokens.accent]);

  // Static gradient fallback for reduced motion and light mode.
  const staticBg = isDark
    ? variantTokens.bgGradient
    : "linear-gradient(180deg,#f5f7fb 0%,#eef2f8 60%,#e5e9f0 100%)";

  // User opted out — render nothing so zero CPU/battery impact. The page
  // still shows the theme-variant gradient via <html> css var.
  if (!racingBgEnabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ opacity }}
    >
      {/* Base gradient */}
      <div className="absolute inset-0" style={{ background: staticBg }} />

      {/* Animated canvas */}
      {!reducedMotion && <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />}

      {/* Top vignette (softens sky) */}
      <div
        className="absolute inset-x-0 top-0 h-[42vh]"
        style={{
          background: isDark
            ? "radial-gradient(ellipse_at_top,rgba(250,204,21,0.06),transparent_62%)"
            : "radial-gradient(ellipse_at_top,rgba(234,179,8,0.08),transparent_60%)",
        }}
      />

      {/* Bottom vignette (darkens road edges) */}
      <div
        className="absolute inset-x-0 bottom-0 h-[30vh]"
        style={{
          background: isDark
            ? "linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.42)_100%)"
            : "linear-gradient(180deg,transparent_0%,rgba(15,23,42,0.08)_100%)",
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

function createStreak(): Streak {
  // Angle biased toward the horizontal but spanning the full circle (360°)
  const angle = Math.random() * Math.PI * 2;
  return {
    angle,
    distance: Math.random() * 0.4, // start partway
    length: 0,
    speed: 0.003 + Math.random() * 0.008,
    width: 0.6 + Math.random() * 1.4,
  };
}
