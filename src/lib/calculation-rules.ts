export type CalculationRules = "champions" | "gen9"

export const DEFAULT_CALCULATION_RULES: CalculationRules = "champions"
export const CALCULATION_RULES_STORAGE_KEY = "pokegauge.calculation-rules"

export function loadCalculationRules(): CalculationRules {
  try {
    const value = localStorage.getItem(CALCULATION_RULES_STORAGE_KEY)
    if (value === "champions" || value === "gen9") return value
  } catch {
    // Storage can be unavailable in private browsing.
  }
  return DEFAULT_CALCULATION_RULES
}

export function saveCalculationRules(rules: CalculationRules): void {
  try {
    localStorage.setItem(CALCULATION_RULES_STORAGE_KEY, rules)
  } catch {
    // Keep the in-memory choice when storage is unavailable.
  }
}
