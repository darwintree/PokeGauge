import type {
  KOProbabilities,
  MoveMechanics,
  Screen,
  ScenarioTrack,
  ScenarioSupport,
  TrackSelectionActivation,
  StatStage,
  Terrain,
  UnavailableReason,
  Weather,
} from "@/lib/damage-calculation"
import type { PokemonType } from "@/lib/pokemon"
import type { StatRange } from "@/lib/stat-calculation"
import type { MoveSnapshot } from "@/lib/move"
import type { StatPreset } from "@/lib/stat-preset"
import type { HeldItemId } from "@/lib/held-item"

export type { ScenarioSupport } from "@/lib/damage-calculation"

export type { StatRange } from "@/lib/stat-calculation"

export type StatSelectMode = "preset" | "range"

/** Placeholder stat id for offense range-mode rows (not in catalog) */
export const RANGE_STAT_ID = "__range__"

/** Placeholder defender id for defender range-mode rows (not in catalog) */
export const RANGE_DEFENDER_ID = "__def_range__"

export type DefenderStatRanges = {
  hp: StatRange
  def: StatRange
}

export type TrackState = {
  moveSnapshots: MoveSnapshot[]
  selectedMoveSnapshotIds: string[]
  statMode: StatSelectMode
  offensePresetIds: string[]
  offenseTemporaryPresets: StatPreset[]
  statRange: StatRange
  offenseAllocationIndices: Record<string, number>
  attackerStages: StatStage[]
  attackerStagePool: StatStage[]
  attackerItemPoolIds: HeldItemId[]
  defenderItemPoolIds: HeldItemId[]
  attackerItemIds: HeldItemId[]
  defenderItemIds: HeldItemId[]
  attackerAbilityIds: number[]
  weatherPool: Weather[]
  weathers: Weather[]
  terrainPool: Terrain[]
  terrains: Terrain[]
  defenderMode: StatSelectMode
  defensePresetIds: string[]
  defenseTemporaryPresets: StatPreset[]
  defenderRanges: DefenderStatRanges
  defenseAllocationIndices: Record<string, number>
  defenderStages: StatStage[]
  defenderStagePool: StatStage[]
  defenderAbilityIds: number[]
  screens: Screen[]
}

export type ScenarioResult = {
  support: ScenarioSupport
  calculationIdentity: string
  snapshotId: string
  moveId: number
  /** Scenario Move Type used for calculation and result badges. */
  moveType: PokemonType
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
  /** Present when the row is a Stat Range envelope: each endpoint is its own 16-roll box. */
  rangeEndpoints?: {
    low: { minPercent: number; maxPercent: number }
    high: { minPercent: number; maxPercent: number }
  }
  critMinDamage: number
  critMaxDamage: number
  critMinPercent: number
  critMaxPercent: number
  koProbabilities?: KOProbabilities
}

export type ProvenanceOptionSets = Record<TrackSelectionActivation, string[]>

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
  rows: ScenarioResult[]
  unavailable: UnavailableScenarioGroup[]
}
