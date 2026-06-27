export type StatTierTokenSet =
  | "stat-tier-0"
  | "stat-offense-max"
  | "stat-bulk-mid"
  | "stat-tier-ex"

const OFFENSE_STAT_TIER: Record<string, StatTierTokenSet> = {
  "neutral-zero": "stat-tier-0",
  "neutral-max": "stat-offense-max",
  extreme: "stat-tier-ex",
}

const DEFENSE_STAT_TIER: Record<string, StatTierTokenSet> = {
  "min-bulk": "stat-tier-0",
  "hp-32": "stat-bulk-mid",
  "standard-bulk": "stat-tier-ex",
}

/** Static class names — Tailwind cannot scan dynamically built arbitrary utilities. */
const STAT_TIER_CHIP_CLASS: Record<StatTierTokenSet, string> = {
  "stat-tier-0": "stat-tier-chip stat-tier-chip--0 shadow-none",
  "stat-offense-max": "stat-tier-chip stat-tier-chip--offense-max shadow-none",
  "stat-bulk-mid": "stat-tier-chip stat-tier-chip--bulk-mid shadow-none",
  "stat-tier-ex": "stat-tier-chip stat-tier-chip--ex shadow-none",
}

export const STAT_TIER_CHIP_MUTED_CLASS = "stat-tier-chip-muted"

export function offenseStatTier(optionId: string): StatTierTokenSet | null {
  return OFFENSE_STAT_TIER[optionId] ?? null
}

export function defenderBulkTier(optionId: string): StatTierTokenSet | null {
  return DEFENSE_STAT_TIER[optionId] ?? null
}

export function statTierChipClasses(tokenSet: StatTierTokenSet): string {
  return STAT_TIER_CHIP_CLASS[tokenSet]
}
