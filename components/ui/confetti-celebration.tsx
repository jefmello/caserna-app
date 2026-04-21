"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

type Props = {
  /** Play once when this key changes (e.g. new leader id). */
  trigger?: string | number | null;
  /** Total ms of the burst. */
  durationMs?: number;
  /** Colors array; defaults to podium gold/silver/bronze. */
  colors?: string[];
  /** Origin (0-1 each axis). */
  origin?: { x: number; y: number };
};

const DEFAULT_COLORS = ["#facc15", "#eab308", "#f59e0b", "#e4e4e7", "#fbbf24", "#fde68a"];

/**
 * Fires a celebration confetti burst once when `trigger` changes.
 * Respects prefers-reduced-motion.
 */
export default function ConfettiCelebration({
  trigger,
  durationMs = 1500,
  colors = DEFAULT_COLORS,
  origin = { x: 0.5, y: 0.35 },
}: Props) {
  const lastTriggerRef = useRef<typeof trigger>(null);

  useEffect(() => {
    if (trigger == null) return;
    if (trigger === lastTriggerRef.current) return;
    lastTriggerRef.current = trigger;

    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const end = Date.now() + durationMs;
    const baseOptions: confetti.Options = {
      startVelocity: 28,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
      colors,
      scalar: 0.9,
    };

    const frame = () => {
      confetti({
        ...baseOptions,
        particleCount: 6,
        origin: { x: origin.x - 0.15, y: origin.y },
      });
      confetti({
        ...baseOptions,
        particleCount: 6,
        origin: { x: origin.x + 0.15, y: origin.y },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [trigger, durationMs, colors, origin]);

  return null;
}
