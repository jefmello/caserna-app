/**
 * Provider-neutral analytics shim.
 *
 * Events are pushed to `window.dataLayer` (the de-facto convention used by
 * GA4 / GTM / Segment / Vercel Analytics adapters). Any external provider
 * can be wired later by reading from dataLayer; no SDK is required here
 * yet, keeping the bundle lean until a provider is chosen.
 *
 * In development, events are also logged to the console for debugging.
 */

export type AnalyticsEventName =
  | "theme_variant_changed"
  | "theme_mode_toggled"
  | "sponsor_clicked"
  | "pilot_shared"
  | "command_palette_opened"
  | "category_changed"
  | "competition_changed";

export type AnalyticsEvent = {
  event: AnalyticsEventName;
  properties?: Record<string, unknown>;
  timestamp: number;
};

declare global {
  interface Window {
    dataLayer?: AnalyticsEvent[];
  }
}

export function track(event: AnalyticsEventName, properties?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const payload: AnalyticsEvent = {
    event,
    properties,
    timestamp: Date.now(),
  };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  if (process.env.NODE_ENV === "development") {
     
    console.debug("[analytics]", event, properties ?? {});
  }
}
