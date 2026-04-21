"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
};

interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const ICONS: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const STYLES: Record<ToastType, { wrap: string; icon: string }> = {
  success: {
    wrap: "border-emerald-200 bg-white text-zinc-950 dark:border-emerald-500/30 dark:bg-zinc-900 dark:text-white",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  error: {
    wrap: "border-red-200 bg-white text-zinc-950 dark:border-red-500/30 dark:bg-zinc-900 dark:text-white",
    icon: "text-red-600 dark:text-red-400",
  },
  info: {
    wrap: "border-zinc-200 bg-white text-zinc-950 dark:border-white/10 dark:bg-zinc-900 dark:text-white",
    icon: "text-zinc-600 dark:text-zinc-400",
  },
};

function ToastView({ toast, onClose }: { toast: ToastItem; onClose: (id: string) => void }) {
  const Icon = ICONS[toast.type];
  const style = STYLES[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 16, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 16, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`pointer-events-auto flex w-full items-start gap-3 rounded-[18px] border px-4 py-3 shadow-lg ${style.wrap}`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.icon}`} />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold">{toast.title}</p>
        {toast.message && <p className="mt-0.5 text-[12px] opacity-70">{toast.message}</p>}
      </div>
      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="shrink-0 rounded-lg p-1 opacity-50 transition-opacity hover:opacity-100"
        aria-label="Fechar"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    // Auto-dismiss after 4s for success/info, 6s for error
    const delay = toast.type === "error" ? 6000 : 4000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, delay);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div
        className="pointer-events-none fixed right-4 bottom-24 left-4 z-50 mx-auto flex max-w-md flex-col gap-2 lg:right-8 lg:bottom-8 lg:left-auto lg:mx-0 lg:max-w-sm"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastView key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
