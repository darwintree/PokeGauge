export type StatSelectMode = "preset" | "range"

export type TrackState = {
  moveIds: string[]
  statMode: StatSelectMode
  attackerStatIds: string[]
  attackerItemIds: string[]
  defenderIds: string[]
}

export type ScenarioRow = {
  moveId: string
  attackerStatId: string
  attackerItemId: string
  defenderId: string
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
