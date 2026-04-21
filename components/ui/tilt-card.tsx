"use client";

/* eslint-disable jsx-a11y/no-static-element-interactions -- purely decorative mouse-driven tilt; no user action is triggered */

import React, { useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  maxTiltDeg?: number;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
};

/**
 * Lightweight 3D tilt on hover (no deps).
 * Respects prefers-reduced-motion.
 */
export default function TiltCard({
  children,
  maxTiltDeg = 7,
  scale = 1.015,
  className = "",
  style,
  disabled = false,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>("");

  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 2 * maxTiltDeg;
    const rotateX = -(y - 0.5) * 2 * maxTiltDeg;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${scale})`
    );
  };

  const handleMouseLeave = () => {
    setTransform("");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transform: transform || undefined,
        transition: "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
