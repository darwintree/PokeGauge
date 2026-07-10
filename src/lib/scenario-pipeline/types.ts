import type { KoProbabilities, ProbabilityMode } from "@/lib/calc-adapter"
import type { StatValueTemplate } from "@/lib/stat-value-template"

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
  visibleMoveIds: number[]
  moveIds: number[]
  statMode: StatSelectMode
  offenseTemplateIds: string[]
  offenseTemporaryTemplates: StatValueTemplate[]
  statRange: StatRange
  statRangeTouched: boolean
  showOffenseActual: boolean
  offenseAllocationIndices: Record<string, number>
  attackerItemIds: string[]
  defenderMode: StatSelectMode
  defenseTemplateIds: string[]
  defenseTemporaryTemplates: StatValueTemplate[]
  defenderRanges: DefenderStatRanges
  defenderRangeTouched: boolean
  showDefenseActual: boolean
  showResultActual: boolean
  defenseAllocationIndices: Record<string, number>
  probabilityMode: ProbabilityMode
}

export type ScenarioRow = {
  moveId: number
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
  koProbabilities?: KoProbabilities
}
