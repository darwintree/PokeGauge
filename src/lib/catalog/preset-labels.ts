/** Pill / snap labels — docs/traces/2026-06-28-stat-tier-color-tokens-grill.md */

export const OFFENSE_PRESET_LABELS = {
  "neutral-zero": "0",
  "neutral-max": "max",
  extreme: "ex",
} as const

export type OffensePresetId = keyof typeof OFFENSE_PRESET_LABELS

export const DEFENSE_PRESET_LABELS = {
  "min-bulk": "0",
  "hp-32": "32HP",
  "standard-bulk": "ex",
} as const

export type DefensePresetId = keyof typeof DEFENSE_PRESET_LABELS

/** Range axis snap anchors — offense tier subset (0 / max / ex) */
export const OFFENSE_SNAP_PRESET_IDS = ["neutral-zero", "neutral-max", "extreme"] as const

export type OffenseSnapPresetId = (typeof OFFENSE_SNAP_PRESET_IDS)[number]
