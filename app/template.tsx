"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Route-level animated template. Next.js re-mounts this on every navigation,
 * so each route gets a fresh entry animation (fade + slide + slight blur-out).
 * Uses the same easing curve as PageTransition for consistency.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
