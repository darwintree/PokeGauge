export type StatSelectMode = "preset" | "range"

/** Placeholder stat id for range-mode rows (not in catalog) */
export const RANGE_STAT_ID = "__range__"

export type StatRange = {
  min: number
  max: number
}

export type TrackState = {
  moveIds: string[]
  statMode: StatSelectMode
  attackerStatIds: string[]
  statRange: StatRange
  attackerItemIds: string[]
  defenderIds: string[]
}

export type ScenarioRow = {
  moveId: string
  attackerStatId: string
  attackerItemId: string
  defenderId: string
  statRange?: StatRange
  minDamage: number
  maxDamage: number
  avgDamage: number
  minPercent: number
  maxPercent: number
  avgPercent: number
  critMinDamage: number
  critMaxDamage: number
  critMinPercent: number
  critMaxPercent: number
  ohkoChance?: number
}

export type ScenarioRowLabels = {
  moveLabel: string
  statLabel: string
  itemLabel: string
  defenderLabel: string
}
