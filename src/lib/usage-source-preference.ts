export type UsageSource = "champions" | "smogon" | "pikalytics"
export const USAGE_SOURCE_STORAGE_KEY = "pokegauge.usage-source"
export function loadUsageSource(): UsageSource {
  try { const value = localStorage.getItem(USAGE_SOURCE_STORAGE_KEY); if (value === "champions" || value === "smogon" || value === "pikalytics") return value } catch {}
  return "champions"
}
export function saveUsageSource(source: UsageSource): void { try { localStorage.setItem(USAGE_SOURCE_STORAGE_KEY, source) } catch {} }
