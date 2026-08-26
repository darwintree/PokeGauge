import { isSupportedLocale } from "@/lib/i18n"

export type ProductEvent = "page_view" | "scenario_ready" | "share" | "feedback"

export function trackProductEvent(event: ProductEvent, locale: string): void {
  if (typeof window === "undefined" || import.meta.env.DEV || !isSupportedLocale(locale)) return
  void fetch("/api/events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ event, locale }),
    keepalive: true,
  }).catch(() => undefined)
}
