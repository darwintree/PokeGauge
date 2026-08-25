import type { ProbabilityMode } from "@/lib/damage-calculation"

export const PROBABILITY_MODE_STORAGE_KEY = "pokegauge.probability-mode"

export function loadProbabilityMode(): ProbabilityMode {
  try {
    const value = localStorage.getItem(PROBABILITY_MODE_STORAGE_KEY)
    if (value === "classic" || value === "battle-odds") return value
  } catch {
    // Storage is optional; calculation stays available with the default.
  }
  return "battle-odds"
}

export function saveProbabilityMode(mode: ProbabilityMode): void {
  try {
    localStorage.setItem(PROBABILITY_MODE_STORAGE_KEY, mode)
  } catch {
    // Runtime preference remains authoritative when storage is unavailable.
  }
}
