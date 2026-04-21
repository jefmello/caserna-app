"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

const STALE_TIME_MS = 60_000;
const GC_TIME_MS = 5 * 60_000;

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: STALE_TIME_MS,
            gcTime: GC_TIME_MS,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              if (error instanceof Error && /429|rate/i.test(error.message)) return false;
              return failureCount < 2;
            },
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
          },
        },
      })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
