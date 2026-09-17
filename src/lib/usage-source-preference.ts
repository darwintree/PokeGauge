import { USAGE_SOURCES, isUsageSource, type UsageSource } from "./usage-rules"
export { USAGE_SOURCES, isUsageSource, type UsageSource, type UsageRule } from "./usage-rules"
export const USAGE_SOURCE_STORAGE_KEY = "pokegauge.usage-source"
export const USAGE_PREFERENCE_STORAGE_KEY = "pokegauge.usage-preference"
export const USAGE_CACHE_STORAGE_PREFIX = "pokegauge.usage-cache:"
/** Fixed background-refresh interval. Not a user setting. */
export const USAGE_STALE_MS = 12 * 60 * 60 * 1000

export type UsagePreference = {
  source: UsageSource
  /** Last chosen rule per source. Missing key → that source's own default. */
  ruleBySource: Partial<Record<UsageSource, string>>
}

export type UsageCacheSnapshot = {
  fetchedAt: number
  fingerprint: string
  pokemonIds: number[]
}

/** Message id for the display name of a usage source. */
export function usageSourceMessageId(source: UsageSource): string {
  return `usageSource.${source}`
}

export function usageCacheStorageKey(source: UsageSource, ruleId: string, date?: string | null): string {
  // v2 drops Pikalytics snapshots that ranked Gigantamax ids the picker cannot show.
  if (source === "pikalytics") return `${USAGE_CACHE_STORAGE_PREFIX}v2:${source}:${ruleId}${date ? `:${date}` : ""}`
  return `${USAGE_CACHE_STORAGE_PREFIX}${source}:${ruleId}`
}

export function usageIsStale(fetchedAt: number, now = Date.now()): boolean {
  return now - fetchedAt >= USAGE_STALE_MS
}

function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as unknown
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Persistence is optional; in-memory state stays authoritative.
  }
}

function isPreference(value: unknown): value is UsagePreference {
  if (!value || typeof value !== "object") return false
  const record = value as Record<string, unknown>
  if (!isUsageSource(typeof record.source === "string" ? record.source : null)) return false
  if (!record.ruleBySource || typeof record.ruleBySource !== "object") return false
  return true
}

function isCacheSnapshot(value: unknown): value is UsageCacheSnapshot {
  if (!value || typeof value !== "object") return false
  const record = value as Record<string, unknown>
  return (
    typeof record.fetchedAt === "number" &&
    Number.isFinite(record.fetchedAt) &&
    typeof record.fingerprint === "string" &&
    Array.isArray(record.pokemonIds) &&
    record.pokemonIds.every((id) => typeof id === "number" && Number.isInteger(id))
  )
}

/** Global cold start: Pokémon Champions. Rule is filled from that source's default. */
export function defaultUsagePreference(): UsagePreference {
  return { source: "champions", ruleBySource: {} }
}

export function loadUsagePreference(): UsagePreference {
  const stored = readJson(USAGE_PREFERENCE_STORAGE_KEY)
  if (isPreference(stored)) {
    const ruleBySource: UsagePreference["ruleBySource"] = {}
    for (const source of USAGE_SOURCES) {
      const ruleId = stored.ruleBySource[source]
      if (typeof ruleId === "string" && ruleId.length > 0) ruleBySource[source] = ruleId
    }
    return {
      source: stored.source,
      ruleBySource,
    }
  }
  try {
    const legacy = localStorage.getItem(USAGE_SOURCE_STORAGE_KEY)
    if (isUsageSource(legacy)) return { source: legacy, ruleBySource: {} }
  } catch {
    // Fall through to the global default.
  }
  return defaultUsagePreference()
}

export function saveUsagePreference(preference: UsagePreference): void {
  writeJson(USAGE_PREFERENCE_STORAGE_KEY, preference)
  try {
    localStorage.setItem(USAGE_SOURCE_STORAGE_KEY, preference.source)
  } catch {
    // Same optional-storage contract as the legacy key.
  }
}

export function rememberedRuleId(preference: UsagePreference, source: UsageSource): string | undefined {
  return preference.ruleBySource[source]
}

export function withRememberedRule(
  preference: UsagePreference,
  source: UsageSource,
  ruleId: string,
): UsagePreference {
  return {
    ...preference,
    ruleBySource: { ...preference.ruleBySource, [source]: ruleId },
  }
}

export function loadUsageCache(source: UsageSource, ruleId: string, date?: string | null): UsageCacheSnapshot | null {
  const stored = readJson(usageCacheStorageKey(source, ruleId, date))
  return isCacheSnapshot(stored) ? stored : null
}

export function saveUsageCache(
  source: UsageSource,
  ruleId: string,
  snapshot: UsageCacheSnapshot,
  date?: string | null,
): void {
  writeJson(usageCacheStorageKey(source, ruleId, date), snapshot)
}

export function usageFingerprint(parts: Array<string | number>): string {
  return parts.map(String).join("|")
}
