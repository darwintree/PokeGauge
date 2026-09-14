import { afterEach, expect, it, vi } from "vitest"
import { CALCULATION_RULES_STORAGE_KEY, loadCalculationRules, saveCalculationRules } from "./calculation-rules"

afterEach(() => vi.unstubAllGlobals())

it("defaults to Champions and persists either supported ruleset", () => {
  const values = new Map<string, string>()
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  })
  expect(loadCalculationRules()).toBe("champions")
  for (const rules of ["gen9", "champions"] as const) {
    saveCalculationRules(rules)
    expect(loadCalculationRules()).toBe(rules)
  }
  values.set(CALCULATION_RULES_STORAGE_KEY, "invalid")
  expect(loadCalculationRules()).toBe("champions")
})

it("works when preference storage is unavailable", () => {
  vi.stubGlobal("localStorage", {
    getItem: () => { throw new Error("Storage unavailable") },
    setItem: () => { throw new Error("Storage unavailable") },
  })
  expect(loadCalculationRules()).toBe("champions")
  expect(() => saveCalculationRules("gen9")).not.toThrow()
})
