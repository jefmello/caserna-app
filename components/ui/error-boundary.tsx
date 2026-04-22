"use client";

import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { track } from "@/lib/analytics";

type Props = {
  children: React.ReactNode;
  /** Optional custom fallback. Receives the caught error and a reset fn. */
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
  /** Name used in analytics so we can tell boundaries apart in reports. */
  name?: string;
};

type State = { hasError: boolean; error: Error | null };

/**
 * Catches render-time errors in its subtree and renders a graceful fallback
 * instead of unmounting the whole app. Reports to window.dataLayer via the
 * shared analytics shim. Class component is required — hooks can't catch
 * descendant render errors.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    track("error_boundary_caught", {
      boundary: this.props.name ?? "anonymous",
      message: error.message,
      stack: error.stack?.slice(0, 600),
      componentStack: info.componentStack?.slice(0, 600),
    });
    if (process.env.NODE_ENV === "development") {
       
      console.error("[error-boundary]", this.props.name, error, info);
    }
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError || !this.state.error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(this.state.error, this.reset);
    return <DefaultFallback name={this.props.name} onReset={this.reset} />;
  }
}

function DefaultFallback({ name, onReset }: { name?: string; onReset: () => void }) {
  return (
    <div
      role="alert"
      className="mx-auto my-6 flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-6 text-center"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/15 text-amber-400">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <p className="text-[12px] font-bold tracking-[0.18em] text-amber-400 uppercase">
        Algo não carregou
      </p>
      <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
        {name ? `Falha em "${name}". ` : null}
        Tente recarregar este bloco. O restante da página continua funcionando.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-[12px] font-bold tracking-[0.1em] text-amber-300 uppercase transition hover:border-amber-400/70 hover:bg-amber-400/20"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Tentar de novo
      </button>
    </div>
  );
}
