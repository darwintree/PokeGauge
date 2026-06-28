export type StatSelectMode = "preset" | "range"

/** Placeholder stat id for offense range-mode rows (not in catalog) */
export const RANGE_STAT_ID = "__range__"

/** Placeholder defender id for defender range-mode rows (not in catalog) */
export const RANGE_DEFENDER_ID = "__def_range__"

export type StatRange = {
  min: number
  max: number
}

export type DefenderStatRanges = {
  hp: StatRange
  def: StatRange
}

export type TrackState = {
  moveIds: string[]
  statMode: StatSelectMode
  attackerStatIds: string[]
  statRange: StatRange
  statRangeTouched: boolean
  attackerItemIds: string[]
  defenderMode: StatSelectMode
  defenderIds: string[]
  defenderRanges: DefenderStatRanges
  defenderRangeTouched: boolean
}

export type ScenarioRow = {
  moveId: string
  attackerStatId: string
  attackerItemId: string
  defenderId: string
  statRange?: StatRange
  defenderRanges?: DefenderStatRanges
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
