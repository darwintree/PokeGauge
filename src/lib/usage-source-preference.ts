export type UsageSource = "champions" | "smogon" | "pikalytics"
export const USAGE_SOURCES: readonly UsageSource[] = ["champions", "smogon", "pikalytics"]
export const USAGE_SOURCE_STORAGE_KEY = "pokegauge.usage-source"
/** Message id for the display name of a usage source. */
export function usageSourceMessageId(source: UsageSource): string {
  return `usageSource.${source}`
}
function isUsageSource(value: string | null): value is UsageSource {
  return USAGE_SOURCES.some((source) => source === value)
}
export function loadUsageSource(): UsageSource {
  try { const value = localStorage.getItem(USAGE_SOURCE_STORAGE_KEY); if (isUsageSource(value)) return value } catch {}
  return "champions"
}
export function saveUsageSource(source: UsageSource): void { try { localStorage.setItem(USAGE_SOURCE_STORAGE_KEY, source) } catch {} }
