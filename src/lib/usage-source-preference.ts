export type UsageSource = "champions" | "smogon" | "pikalytics"
export const USAGE_SOURCES: readonly UsageSource[] = ["champions", "smogon", "pikalytics"]
export const USAGE_SOURCE_STORAGE_KEY = "pokegauge.usage-source"
export const USAGE_PREFERENCE_STORAGE_KEY = "pokegauge.usage-preference"
export const USAGE_CACHE_STORAGE_PREFIX = "pokegauge.usage-cache:"
/** Fixed background-refresh interval. Not a user setting. */
export const USAGE_STALE_MS = 12 * 60 * 60 * 1000

export type UsageRule = { id: string; label: string }

export type UsagePreference = {
  source: UsageSource
  /** Last chosen rule per source. Missing key → that source's own default. */
  ruleBySource: Partial<Record<UsageSource, string>>
  /** Default true: the rule dropdown shows current-series VGC / Champions formats. */
  currentSeriesOnly: boolean
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

export function usageCacheStorageKey(source: UsageSource, ruleId: string): string {
  return `${USAGE_CACHE_STORAGE_PREFIX}${source}:${ruleId}`
}

export function isUsageSource(value: string | null | undefined): value is UsageSource {
  return USAGE_SOURCES.some((source) => source === value)
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
  return { source: "champions", ruleBySource: {}, currentSeriesOnly: true }
}

/** Year stamped on the source's own default rule, else the UTC calendar year. */
export function currentSeriesYearFromDefaultId(defaultId: string, now = new Date()): number {
  const match = defaultId.match(/vgc(\d{4})/i)
  return match ? Number(match[1]) : now.getUTCFullYear()
}

/**
 * Current-series VGC / Pokémon Champions VGC formats for `year`.
 * Champions seasons are already that series, so they all stay.
 */
export function isCurrentSeriesUsageRule(
  rule: UsageRule,
  source: UsageSource,
  year: number,
): boolean {
  if (source === "champions") return true
  const id = rule.id.toLowerCase()
  return id.includes(`championsvgc${year}`) || id.includes(`vgc${year}`)
}

export function visibleUsageRules(
  rules: readonly UsageRule[],
  source: UsageSource,
  currentSeriesOnly: boolean,
  selectedId: string | null,
  year: number,
): UsageRule[] {
  if (!currentSeriesOnly) return [...rules]
  const kept = rules.filter((rule) => isCurrentSeriesUsageRule(rule, source, year))
  if (selectedId && !kept.some((rule) => rule.id === selectedId)) {
    const selected = rules.find((rule) => rule.id === selectedId)
    if (selected) return [selected, ...kept]
  }
  return kept
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
      currentSeriesOnly: stored.currentSeriesOnly !== false,
    }
  }
  try {
    const legacy = localStorage.getItem(USAGE_SOURCE_STORAGE_KEY)
    if (isUsageSource(legacy)) return { source: legacy, ruleBySource: {}, currentSeriesOnly: true }
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

export function loadUsageCache(source: UsageSource, ruleId: string): UsageCacheSnapshot | null {
  const stored = readJson(usageCacheStorageKey(source, ruleId))
  return isCacheSnapshot(stored) ? stored : null
}

export function saveUsageCache(
  source: UsageSource,
  ruleId: string,
  snapshot: UsageCacheSnapshot,
): void {
  writeJson(usageCacheStorageKey(source, ruleId), snapshot)
}

export function usageFingerprint(parts: Array<string | number>): string {
  return parts.map(String).join("|")
}
