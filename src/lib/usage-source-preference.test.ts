import { afterEach, describe, expect, it, vi } from "vitest"

import {
  USAGE_PREFERENCE_STORAGE_KEY,
  USAGE_SOURCE_STORAGE_KEY,
  USAGE_STALE_MS,
  currentSeriesYearFromDefaultId,
  defaultUsagePreference,
  isCurrentSeriesUsageRule,
  loadUsageCache,
  loadUsagePreference,
  rememberedRuleId,
  saveUsageCache,
  saveUsagePreference,
  usageFingerprint,
  usageIsStale,
  visibleUsageRules,
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
  })

  it("migrates a legacy source-only key and keeps per-source rules", () => {
    const storage = memoryStorage()
    storage.setItem(USAGE_SOURCE_STORAGE_KEY, "pikalytics")
    vi.stubGlobal("localStorage", storage)

    expect(loadUsagePreference()).toEqual({ source: "pikalytics", ruleBySource: {}, currentSeriesOnly: true })

    saveUsagePreference(withRememberedRule(loadUsagePreference(), "pikalytics", "gen9championsvgc2026regma-1760"))
    saveUsagePreference(withRememberedRule(loadUsagePreference(), "smogon", "2026-08/gen9championsvgc2026regmb-0"))
    expect(loadUsagePreference()).toEqual({
      source: "pikalytics",
      ruleBySource: {
        pikalytics: "gen9championsvgc2026regma-1760",
        smogon: "2026-08/gen9championsvgc2026regmb-0",
      },
      currentSeriesOnly: true,
    })
    expect(rememberedRuleId(loadUsagePreference(), "champions")).toBeUndefined()
    expect(storage.getItem(USAGE_PREFERENCE_STORAGE_KEY)).toContain("pikalytics")
    expect(storage.getItem(USAGE_SOURCE_STORAGE_KEY)).toBe("pikalytics")
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

  it("keeps current-series VGC/Champions formats and can pin a selected outlier", () => {
    expect(currentSeriesYearFromDefaultId("gen9championsvgc2026regmc-1760")).toBe(2026)
    const rules = [
      { id: "modest", label: "Modest" },
      { id: "gen9championsvgc2026regmc-1760", label: "Champions VGC 2026 M-C" },
      { id: "gen9vgc2026regi-1760", label: "VGC 2026 Reg I" },
      { id: "gen9ou-1825", label: "OverUsed" },
      { id: "gen9vgc2025regh-1760", label: "VGC 2025 Reg H" },
    ]
    expect(rules.filter((rule) => isCurrentSeriesUsageRule(rule, "pikalytics", 2026)).map((rule) => rule.id)).toEqual([
      "gen9championsvgc2026regmc-1760",
      "gen9vgc2026regi-1760",
    ])
    expect(visibleUsageRules(rules, "pikalytics", true, "gen9ou-1825", 2026).map((rule) => rule.id)).toEqual([
      "gen9ou-1825",
      "gen9championsvgc2026regmc-1760",
      "gen9vgc2026regi-1760",
    ])
    expect(visibleUsageRules(
      [{ id: "Current", label: "Current" }, { id: "M6", label: "M6" }],
      "champions",
      true,
      "Current",
      2026,
    ).map((rule) => rule.id)).toEqual(["Current", "M6"])
  })
})
