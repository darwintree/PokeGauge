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

/** Axis snap labels — 32 replaces max to avoid interval-upper-bound ambiguity */
export const OFFENSE_AXIS_SNAP_LABELS: Record<OffenseSnapPresetId, string> = {
  "neutral-zero": "0",
  "neutral-max": "32",
  extreme: "ex",
}

export const DEFENSE_HP_SNAP_IDS = ["min-bulk", "hp-32"] as const

export type DefenseHpSnapId = (typeof DEFENSE_HP_SNAP_IDS)[number]

export const DEFENSE_DEF_SNAP_IDS = ["min-bulk", "def-max", "standard-bulk"] as const

export type DefenseDefSnapId = (typeof DEFENSE_DEF_SNAP_IDS)[number]

export const DEFENSE_HP_AXIS_LABELS: Record<DefenseHpSnapId, string> = {
  "min-bulk": "0",
  "hp-32": "32",
}

export const DEFENSE_DEF_AXIS_LABELS: Record<DefenseDefSnapId, string> = {
  "min-bulk": "0",
  "def-max": "32",
  "standard-bulk": "ex",
}
