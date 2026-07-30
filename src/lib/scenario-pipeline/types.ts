import type {
  KoProbabilities,
  MoveMechanics,
  ProbabilityMode,
  Screen,
  ScenarioTrack,
  SourceState,
  StatStage,
  Terrain,
  UnavailableReason,
  Weather,
} from "@/lib/calc-adapter"
import type { MoveSnapshot } from "@/lib/move-snapshot"
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
  moveSnapshots: MoveSnapshot[]
  selectedMoveSnapshotIds: string[]
  statMode: StatSelectMode
  offenseTemplateIds: string[]
  offenseTemporaryTemplates: StatValueTemplate[]
  statRange: StatRange
  statRangeTouched: boolean
  showOffenseActual: boolean
  offenseAllocationIndices: Record<string, number>
  attackerStages: StatStage[]
  attackerItemIds: string[]
  attackerAbilityIds: number[]
  weathers: Weather[]
  terrains: Terrain[]
  defenderMode: StatSelectMode
  defenseTemplateIds: string[]
  defenseTemporaryTemplates: StatValueTemplate[]
  defenderRanges: DefenderStatRanges
  defenderRangeTouched: boolean
  showDefenseActual: boolean
  showResultActual: boolean
  defenseAllocationIndices: Record<string, number>
  defenderStages: StatStage[]
  defenderAbilityIds: number[]
  screens: Screen[]
  probabilityMode: ProbabilityMode
}

export type ScenarioRow = {
  calculationIdentity: string
  snapshotId: string
  moveId: number
  attackerStatId: string
  defenderId: string
  provenance: ScenarioProvenance
  criticalOnly: boolean
  moveMechanics: MoveMechanics
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

export type ProvenanceOptionSets = Record<SourceState, string[]>

export type ScenarioProvenance = Partial<
  Record<ScenarioTrack, ProvenanceOptionSets>
>

export type UnavailableScenarioGroup = {
  snapshotId: string
  moveId: number
  reasons: UnavailableReason[]
  missingFields: Array<"power" | "accuracy">
  provenance: ScenarioProvenance
}

export type ScenarioPipelineResult = {
  rows: ScenarioRow[]
  unavailable: UnavailableScenarioGroup[]
}
