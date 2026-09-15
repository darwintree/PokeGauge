import { afterEach, describe, expect, it, vi } from "vitest"

import {
  USAGE_PREFERENCE_STORAGE_KEY,
  USAGE_SOURCE_STORAGE_KEY,
  USAGE_STALE_MS,
  defaultUsagePreference,
  loadUsageCache,
  loadUsagePreference,
  loadUsageSource,
  rememberedRuleId,
  saveUsageCache,
  saveUsagePreference,
  usageFingerprint,
  usageIsStale,
  withRememberedRule,
} from "./usage-source-preference"

function memoryStorage() {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value)
    },
    values,
  }
}

describe("usage preference", () => {
  afterEach(() => vi.unstubAllGlobals())

  it("cold-starts on Champions with no remembered rule", () => {
    vi.stubGlobal("localStorage", memoryStorage())
    expect(loadUsagePreference()).toEqual(defaultUsagePreference())
    expect(loadUsageSource()).toBe("champions")
  })

  it("migrates a legacy source-only key and keeps per-source rules", () => {
    const storage = memoryStorage()
    storage.setItem(USAGE_SOURCE_STORAGE_KEY, "pikalytics")
    vi.stubGlobal("localStorage", storage)

    expect(loadUsagePreference()).toEqual({ source: "pikalytics", ruleBySource: {} })

    saveUsagePreference(withRememberedRule(loadUsagePreference(), "pikalytics", "gen9championsvgc2026regma-1760"))
    saveUsagePreference(withRememberedRule(loadUsagePreference(), "smogon", "2026-08/gen9championsvgc2026regmb-0"))
    expect(loadUsagePreference()).toEqual({
      source: "pikalytics",
      ruleBySource: {
        pikalytics: "gen9championsvgc2026regma-1760",
        smogon: "2026-08/gen9championsvgc2026regmb-0",
      },
    })
    expect(rememberedRuleId(loadUsagePreference(), "champions")).toBeUndefined()
    expect(storage.getItem(USAGE_PREFERENCE_STORAGE_KEY)).toContain("pikalytics")
  })

  it("treats a 12-hour-old snapshot as stale and a newer one as fresh", () => {
    expect(usageIsStale(0, USAGE_STALE_MS)).toBe(true)
    expect(usageIsStale(1, USAGE_STALE_MS)).toBe(false)
    expect(usageIsStale(USAGE_STALE_MS, USAGE_STALE_MS * 2)).toBe(true)
  })

  it("round-trips a ranking cache snapshot", () => {
    vi.stubGlobal("localStorage", memoryStorage())
    const snapshot = {
      fetchedAt: 1_000,
      fingerprint: usageFingerprint(["v1", 6, 25]),
      pokemonIds: [6, 25],
    }
    saveUsageCache("champions", "Current", snapshot)
    expect(loadUsageCache("champions", "Current")).toEqual(snapshot)
    expect(loadUsageCache("champions", "M6")).toBeNull()
  })
})
