"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * PageTransition — wrapper component que aplica animação de entrada
 * consistente em todas as páginas do app.
 *
 * Uso: envolver o conteúdo raiz de cada page content component.
 */
export default function PageTransition({
  children,
  delay = 0,
  duration = 0.4,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // easeOut custom — suave e profissional
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer — wrapper para grids com animação sequencial.
 * Children devem ser envoltos em StaggerItem.
 */
export function StaggerContainer({
  children,
  staggerDelay = 0.06,
  className,
}: {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem — item individual dentro de StaggerContainer.
 * Aplica fade-in + slide-up sequencial.
 */
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
