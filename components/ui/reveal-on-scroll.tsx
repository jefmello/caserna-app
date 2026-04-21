"use client";

import { motion } from "framer-motion";
import React from "react";

type Props = {
  children: React.ReactNode;
  delay?: number;
  /** Vertical offset in pixels for the initial state. */
  offsetY?: number;
  /** CSS className forwarded to wrapper. */
  className?: string;
  /** Trigger once vs every time it enters view. */
  once?: boolean;
};

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.55;

const baseHidden = { opacity: 0, y: 24, filter: "blur(4px)" };
const baseVisible = { opacity: 1, y: 0, filter: "blur(0px)" };

/**
 * Fades + slides + un-blurs its children when they enter the viewport.
 * Uses framer-motion; safe for SSR (renders as motion.div).
 */
export default function RevealOnScroll({
  children,
  delay = 0,
  offsetY = 24,
  className = "",
  once = true,
}: Props) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15, margin: "0px 0px -80px 0px" }}
      variants={{
        hidden: { ...baseHidden, y: offsetY },
        visible: {
          ...baseVisible,
          transition: { duration: DURATION, ease: EASE, delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
