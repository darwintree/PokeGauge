export type UsageSource = "champions" | "smogon"
export const USAGE_SOURCE_STORAGE_KEY = "pokegauge.usage-source"
export function loadUsageSource(): UsageSource {
  try { const value = localStorage.getItem(USAGE_SOURCE_STORAGE_KEY); if (value === "champions" || value === "smogon") return value } catch {}
  return "champions"
}
export function saveUsageSource(source: UsageSource): void { try { localStorage.setItem(USAGE_SOURCE_STORAGE_KEY, source) } catch {} }
