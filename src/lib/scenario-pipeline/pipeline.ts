import {
  defaultDefenderDefRange,
  defaultDefenderHpRange,
  defaultOffenseStatRange,
} from "@/lib/calc-adapter"
import {
  type DamageKernelResult,
  calculateDamageRolls,
} from "@/lib/calc-adapter/damage-kernel"
import {
  calculationIdentity,
  type CalculableScenario,
  type ProbabilityInput,
  type RawScenarioPoint,
  type ScenarioSource,
  compileScenario,
} from "@/lib/calc-adapter/scenario-compiler"
import type { MatchupCatalog } from "@/lib/catalog/types"
import {
  convolveAtomicDamageDistributions,
  createAtomicDamageDistribution,
  calculateKOProbability,
} from "@/lib/damage-distribution"
import { createMoveSnapshot } from "@/lib/move-snapshot"
import {
  buildSystemDefensePresets,
  buildSystemOffensePresets,
  defaultDefensePresetSelection,
  defaultOffensePresetSelection,
  defenseValuesOf,
  formatStatPresetValue,
  loadUserDefensePresets,
  loadUserOffensePresets,
  mergeStatPresets,
  offenseValueOf,
  statPresetLabel,
  type StatNameStrategy,
  type StatPreset,
} from "@/lib/stat-preset"

import type {
  ProvenanceOptionSets,
  ScenarioPipelineResult,
  ScenarioProvenance,
  ScenarioResult,
  TrackState,
  UnavailableScenarioGroup,
} from "./types"
import { RANGE_DEFENDER_ID, RANGE_STAT_ID } from "./types"

export function offensePresetsForState(
  catalog: MatchupCatalog,
  trackState: TrackState,
): StatPreset[] {
  const { attackerCalcName } = catalog.matchup
  const system = buildSystemOffensePresets(attackerCalcName, catalog.moveCategory)
  const user = loadUserOffensePresets(String(catalog.matchup.attackerId))
  return mergeStatPresets(system, user, trackState.offenseTemporaryPresets)
}

export function defensePresetsForState(
  catalog: MatchupCatalog,
  trackState: TrackState,
): StatPreset[] {
  const { defenderCalcName } = catalog.matchup
  const system = buildSystemDefensePresets(defenderCalcName, catalog.moveCategory)
  const user = loadUserDefensePresets(String(catalog.matchup.defenderId))
  return mergeStatPresets(system, user, trackState.defenseTemporaryPresets)
}

function findPreset(presets: StatPreset[], id: string): StatPreset | undefined {
  return presets.find((t) => t.id === id)
}

type PreparedStatChoice = {
  id: string
  low: number
  high: number
}

type PreparedDefenseChoice = {
  id: string
  low: RawScenarioPoint["defense"]
  high: RawScenarioPoint["defense"]
}

function average(rolls: readonly number[]): number {
  return rolls.reduce((sum, damage) => sum + damage, 0) / rolls.length
}

function mainRolls(point: DamageKernelResult["low"]): readonly number[] {
  const rolls = point.normal ?? point.critical
  if (!rolls) throw new Error("Compiled damage point has no damage branch")
  return rolls
}

function fixedKOProbabilities(
  point: DamageKernelResult["low"],
  probability: ProbabilityInput,
) {
  const atomic = createAtomicDamageDistribution({
    ...probability,
    normalDamageRolls: point.normal,
    criticalDamageRolls: point.critical,
  })
  return {
    ohko: calculateKOProbability(
      convolveAtomicDamageDistributions([atomic]),
      point.defenderHp,
    ),
    twoHit: calculateKOProbability(
      convolveAtomicDamageDistributions([atomic, atomic]),
      point.defenderHp,
    ),
  }
}

function summarizeDamage(
  result: DamageKernelResult,
  probability: ProbabilityInput,
) {
  const low = result.low
  const high = result.high ?? low
  const lowMain = mainRolls(low)
  const highMain = mainRolls(high)
  const lowCritical = low.critical ?? lowMain
  const highCritical = high.critical ?? highMain
  const lowAverage = average(lowMain)
  const highAverage = average(highMain)
  const lowKo = fixedKOProbabilities(low, probability)
  const highKo = fixedKOProbabilities(high, probability)
  const minDamage = Math.min(...lowMain)
  const maxDamage = Math.max(...highMain)
  const critMinDamage = Math.min(...lowCritical)
  const critMaxDamage = Math.max(...highCritical)
  const avgDamage = result.high ? (lowAverage + highAverage) / 2 : lowAverage

  return {
    minDamage,
    maxDamage,
    avgDamage,
    minPercent: (minDamage / low.defenderHp) * 100,
    maxPercent: (maxDamage / high.defenderHp) * 100,
    avgPercent: result.high
      ? ((lowAverage / low.defenderHp) * 100 + (highAverage / high.defenderHp) * 100) / 2
      : (avgDamage / low.defenderHp) * 100,
    critMinDamage,
    critMaxDamage,
    critMinPercent: (critMinDamage / low.defenderHp) * 100,
    critMaxPercent: (critMaxDamage / high.defenderHp) * 100,
    koProbabilities: result.high
      ? {
          ohko: {
            min: Math.min(lowKo.ohko, highKo.ohko),
            max: Math.max(lowKo.ohko, highKo.ohko),
          },
          twoHit: {
            min: Math.min(lowKo.twoHit, highKo.twoHit),
            max: Math.max(lowKo.twoHit, highKo.twoHit),
          },
        }
      : lowKo,
  }
}

function offenseChoices(
  trackState: TrackState,
  presets: StatPreset[],
): PreparedStatChoice[] {
  if (trackState.statMode === "range") {
    return [{
      id: RANGE_STAT_ID,
      low: trackState.statRange.min,
      high: Math.max(trackState.statRange.min, trackState.statRange.max),
    }]
  }

  return trackState.offensePresetIds.flatMap((id) => {
    const preset = findPreset(presets, id)
    if (!preset) return []
    const value = offenseValueOf(preset)
    return [{ id, low: value, high: value }]
  })
}

function defenseChoices(
  trackState: TrackState,
  presets: StatPreset[],
): PreparedDefenseChoice[] {
  if (trackState.defenderMode === "range") {
    return [{
      id: RANGE_DEFENDER_ID,
      low: {
        hp: trackState.defenderRanges.hp.min,
        def: trackState.defenderRanges.def.min,
      },
      high: {
        hp: Math.max(
          trackState.defenderRanges.hp.min,
          trackState.defenderRanges.hp.max,
        ),
        def: Math.max(
          trackState.defenderRanges.def.min,
          trackState.defenderRanges.def.max,
        ),
      },
    }]
  }

  return trackState.defensePresetIds.flatMap((id) => {
    const preset = findPreset(presets, id)
    if (!preset) return []
    const values = defenseValuesOf(preset)
    return [{ id, low: values, high: values }]
  })
}

function scenarioPoints(
  offense: PreparedStatChoice,
  defense: PreparedDefenseChoice,
): { lowOutcome: RawScenarioPoint; highOutcome?: RawScenarioPoint } {
  const lowOutcome = { offense: offense.low, defense: defense.high }
  if (
    offense.low === offense.high &&
    defense.low.hp === defense.high.hp &&
    defense.low.def === defense.high.def
  ) {
    return { lowOutcome }
  }
  return {
    lowOutcome,
    highOutcome: { offense: offense.high, defense: defense.low },
  }
}

function emptyOptionSets(): ProvenanceOptionSets {
  return {
    effective: [],
    inactive: [],
    unsupported: [],
    neutral: [],
  }
}

function addSources(
  provenance: ScenarioProvenance,
  sources: readonly ScenarioSource[],
): void {
  for (const source of sources) {
    const optionSets = provenance[source.track] ?? emptyOptionSets()
    provenance[source.track] = optionSets
    if (!optionSets[source.state].includes(source.optionId)) {
      optionSets[source.state].push(source.optionId)
    }
  }
}

type ScenarioResultContext = Pick<
  ScenarioResult,
  "snapshotId" | "moveId" | "attackerStatId" | "defenderId"
> & Pick<ScenarioResult, "statRange" | "defenderRanges">

type CalculableGroup = {
  outcome: CalculableScenario
  context: ScenarioResultContext
  provenance: ScenarioProvenance
}

type UnavailableGroupBuilder = {
  snapshotId: string
  moveId: number
  reasons: Set<UnavailableScenarioGroup["reasons"][number]>
  missingFields: Set<UnavailableScenarioGroup["missingFields"][number]>
  provenance: ScenarioProvenance
}

function unavailableGroup(
  builder: UnavailableGroupBuilder,
): UnavailableScenarioGroup {
  return {
    snapshotId: builder.snapshotId,
    moveId: builder.moveId,
    reasons: [...builder.reasons],
    missingFields: [...builder.missingFields],
    provenance: builder.provenance,
  }
}

export function runScenarioPipeline(
  catalog: MatchupCatalog,
  trackState: TrackState,
): ScenarioPipelineResult {
  const calculableGroups = new Map<string, CalculableGroup>()
  const unavailableGroups = new Map<string, UnavailableGroupBuilder>()
  const offensePresets = offensePresetsForState(catalog, trackState)
  const defensePresets = defensePresetsForState(catalog, trackState)
  const preparedOffense = offenseChoices(trackState, offensePresets)
  const preparedDefense = defenseChoices(trackState, defensePresets)
  const selectedMoveSnapshotIds = new Set(trackState.selectedMoveSnapshotIds)

  for (const snapshot of trackState.moveSnapshots) {
    if (!selectedMoveSnapshotIds.has(snapshot.id)) continue
    for (const attackerItemId of trackState.attackerItemIds) {
      for (const defenderItemId of trackState.defenderItemIds) {
       for (const attackerAbilityId of trackState.attackerAbilityIds) {
        for (const weather of trackState.weathers) {
          for (const terrain of trackState.terrains) {
            for (const attackerStage of trackState.attackerStages) {
              for (const defenderStage of trackState.defenderStages) {
                for (const defenderAbilityId of trackState.defenderAbilityIds) {
                  for (const screen of trackState.screens) {
                    for (const offense of preparedOffense) {
                      for (const defense of preparedDefense) {
                        const outcome = compileScenario({
                          snapshot,
                          attackerId: catalog.matchup.attackerId,
                          defenderId: catalog.matchup.defenderId,
                          attackerItemId,
                          defenderItemId,
                          attackerAbilityId,
                          defenderAbilityId,
                          attackerStage,
                          defenderStage,
                          weather,
                          terrain,
                          screen,
                          probabilityMode: trackState.probabilityMode,
                          sourceOptionIds: {
                            attackerStat: offense.id,
                            defenderStat: defense.id,
                          },
                          ...scenarioPoints(offense, defense),
                        })
                        if (outcome.kind === "unavailable") {
                          const group = unavailableGroups.get(snapshot.id) ?? {
                            snapshotId: snapshot.id,
                            moveId: snapshot.moveId,
                            reasons: new Set(),
                            missingFields: new Set(),
                            provenance: {},
                          }
                          group.reasons.add(outcome.reason)
                          for (const field of outcome.missingFields ?? []) {
                            group.missingFields.add(field)
                          }
                          addSources(group.provenance, outcome.sources)
                          unavailableGroups.set(snapshot.id, group)
                          continue
                        }

                        const identity = calculationIdentity(outcome)
                        const group = calculableGroups.get(identity) ?? {
                          outcome,
                          context: {
                            snapshotId: snapshot.id,
                            moveId: snapshot.moveId,
                            attackerStatId: offense.id,
                            defenderId: defense.id,
                            ...(offense.id === RANGE_STAT_ID
                              ? { statRange: { ...trackState.statRange } }
                              : {}),
                            ...(defense.id === RANGE_DEFENDER_ID
                              ? {
                                  defenderRanges: {
                                    hp: { ...trackState.defenderRanges.hp },
                                    def: { ...trackState.defenderRanges.def },
                                  },
                                }
                              : {}),
                          },
                          provenance: {},
                        }
                        addSources(group.provenance, outcome.sources)
                        calculableGroups.set(identity, group)
                      }
                    }
                  }
                }
              }
            }
          }
        }
       }
      }
    }
  }

  const rows = [...calculableGroups].map(([identity, group]) => {
    const computed = summarizeDamage(
      calculateDamageRolls(group.outcome.calculation),
      group.outcome.probability,
    )
    return {
      calculationIdentity: identity,
      ...group.context,
      provenance: group.provenance,
      criticalOnly: group.outcome.calculation.low.normal === undefined,
      moveMechanics: group.outcome.moveMechanics,
      ...computed,
    }
  })

  return {
    rows,
    unavailable: [...unavailableGroups.values()].map(unavailableGroup),
  }
}

export function defaultTrackState(catalog: MatchupCatalog): TrackState {
  const { attackerCalcName, defenderCalcName } = catalog.matchup
  const offenseSystem = buildSystemOffensePresets(attackerCalcName, catalog.moveCategory)
  const defenseSystem = buildSystemDefensePresets(defenderCalcName, catalog.moveCategory)
  const offenseUser = loadUserOffensePresets(String(catalog.matchup.attackerId))
  const defenseUser = loadUserDefensePresets(String(catalog.matchup.defenderId))
  const moveSnapshots = catalog.defaultMovePoolIds.flatMap((moveId) => {
    const move = catalog.moves.find((candidate) => candidate.id === moveId)
    return move ? [createMoveSnapshot(move)] : []
  })

  return {
    moveSnapshots,
    selectedMoveSnapshotIds: moveSnapshots
      .filter((snapshot) => catalog.defaultMoveIds.includes(snapshot.moveId))
      .map((snapshot) => snapshot.id),
    statMode: "preset",
    offensePresetIds: defaultOffensePresetSelection(offenseSystem, offenseUser),
    offenseTemporaryPresets: [],
    statRange: defaultOffenseStatRange(attackerCalcName, catalog.moveCategory),
    statRangeTouched: false,
    showOffenseStatValue: false,
    offenseAllocationIndices: {},
    attackerStages: [0],
    attackerItemIds: [...catalog.defaultAttackerItemIds],
    defenderItemIds: [...catalog.defaultDefenderItemIds],
    attackerAbilityIds: [...catalog.defaultAttackerAbilityIds],
    weathers: ["none"],
    terrains: ["none"],
    defenderMode: "preset",
    defensePresetIds: defaultDefensePresetSelection(defenseSystem, defenseUser),
    defenseTemporaryPresets: [],
    defenderRanges: {
      hp: defaultDefenderHpRange(defenderCalcName),
      def: defaultDefenderDefRange(defenderCalcName, catalog.moveCategory),
    },
    defenderRangeTouched: false,
    showDefenseStatValue: false,
    showResultStatValue: false,
    defenseAllocationIndices: {},
    defenderStages: [0],
    defenderAbilityIds: [...catalog.defaultDefenderAbilityIds],
    screens: ["none"],
    probabilityMode: "classic",
  }
}

export type RowLabelPresets = {
  offense: StatPreset[]
  defense: StatPreset[]
}

export function rowLabels(
  catalog: MatchupCatalog,
  row: ScenarioResult,
  trackState: TrackState,
  statNameStrategy: StatNameStrategy,
  presets?: RowLabelPresets,
): {
  move: string
  stat: string
  offenseStatValueLabel: string | null
  defender: string
  defenseStatValueLabel: string | null
} {
  const findItem = (options: { id: string | number; label: string }[], id: string | number) =>
    options.find((o) => o.id === id)?.label ?? id

  const defStatLabel = catalog.defenseStatLabel
  const offensePresets = presets?.offense ?? offensePresetsForState(catalog, trackState)
  const defensePresets = presets?.defense ?? defensePresetsForState(catalog, trackState)

  let statLabel: string
  let offenseStatValueLabel: string | null = null
  if (row.attackerStatId === RANGE_STAT_ID && row.statRange) {
    statLabel = `${catalog.offenseStatLabel} ${row.statRange.min}-${row.statRange.max}`
  } else {
    const preset = offensePresets.find((t) => t.id === row.attackerStatId)
    if (preset) {
      statLabel = statPresetLabel(
        preset,
        catalog.matchup.attackerCalcName,
        catalog.moveCategory,
        trackState.offenseAllocationIndices[preset.id] ?? 0,
        statNameStrategy,
      )
      if (trackState.showResultStatValue) {
        const statValueText = formatStatPresetValue(preset)
        offenseStatValueLabel = statValueText === statLabel ? null : statValueText
      }
    } else {
      statLabel = row.attackerStatId
    }
  }

  let defenderLabel: string
  let defenseStatValueLabel: string | null = null
  if (row.defenderId === RANGE_DEFENDER_ID && row.defenderRanges) {
    defenderLabel = `HP ${row.defenderRanges.hp.min}-${row.defenderRanges.hp.max} · ${defStatLabel} ${row.defenderRanges.def.min}-${row.defenderRanges.def.max}`
  } else {
    const preset = defensePresets.find((t) => t.id === row.defenderId)
    if (preset) {
      defenderLabel = statPresetLabel(
        preset,
        catalog.matchup.defenderCalcName,
        catalog.moveCategory,
        trackState.defenseAllocationIndices[preset.id] ?? 0,
        statNameStrategy,
      )
      if (trackState.showResultStatValue) {
        const statValueText = formatStatPresetValue(preset)
        defenseStatValueLabel = statValueText === defenderLabel ? null : statValueText
      }
    } else {
      defenderLabel = row.defenderId
    }
  }

  return {
    move: String(findItem(catalog.moves, row.moveId)),
    stat: statLabel,
    offenseStatValueLabel,
    defender: defenderLabel,
    defenseStatValueLabel,
  }
}

export function expectedRowCount(trackState: TrackState): number {
  const offenseCount =
    trackState.statMode === "range" ? 1 : trackState.offensePresetIds.length
  const defenderCount =
    trackState.defenderMode === "range" ? 1 : trackState.defensePresetIds.length
  return (
    trackState.selectedMoveSnapshotIds.length *
    offenseCount *
    trackState.attackerStages.length *
    trackState.attackerItemIds.length *
    trackState.defenderItemIds.length *
    trackState.attackerAbilityIds.length *
    trackState.weathers.length *
    trackState.terrains.length *
    defenderCount *
    trackState.defenderStages.length *
    trackState.defenderAbilityIds.length *
    trackState.screens.length
  )
}
