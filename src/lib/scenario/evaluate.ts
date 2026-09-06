import { evaluateExecutionPoint } from "@/lib/damage-calculation/hit-execution"
import {
  calculationIdentity,
  type ProbabilityMode,
  type HitFact,
  type CalculableScenario,
  type RawScenarioPoint,
  type ScenarioSource,
  type ScenarioTrack,
  type ScenarioSupport,
  compileScenario,
  projectMoveMechanics,
} from "@/lib/damage-calculation"
import type { MatchupCatalog } from "@/lib/catalog"
import {
  defenseValuesOf,
  offenseValueOf,
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
import { defensePresetsForState, offensePresetsForState } from "./state"

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

function percentOf(damage: number, hp: number): number {
  return damage / hp * 100
}

function summarizeDamage(scenario: CalculableScenario) {
  const lowPoint = scenario.calculation.low
  const highPoint = scenario.calculation.high ?? lowPoint
  const low = evaluateExecutionPoint(scenario, lowPoint)
  const high = scenario.calculation.high ? evaluateExecutionPoint(scenario, highPoint) : low
  const lowMain = low.normal ?? low.critical ?? { min: 0, max: 0 }
  const highMain = high.normal ?? high.critical ?? { min: 0, max: 0 }
  const lowCritical = low.critical ?? lowMain
  const highCritical = high.critical ?? highMain
  const lowBox = {
    minPercent: percentOf(lowMain.min, lowPoint.defenderHp),
    maxPercent: percentOf(lowMain.max, lowPoint.defenderHp),
  }
  const highBox = {
    minPercent: percentOf(highMain.min, highPoint.defenderHp),
    maxPercent: percentOf(highMain.max, highPoint.defenderHp),
  }
  return {
    minDamage: Math.min(lowMain.min, highMain.min),
    maxDamage: Math.max(lowMain.max, highMain.max),
    minPercent: Math.min(lowBox.minPercent, highBox.minPercent),
    maxPercent: Math.max(lowBox.maxPercent, highBox.maxPercent),
    ...(scenario.calculation.high ? { rangeEndpoints: { low: lowBox, high: highBox } } : {}),
    critMinDamage: Math.min(lowCritical.min, highCritical.min),
    critMaxDamage: Math.max(lowCritical.max, highCritical.max),
    critMinPercent: Math.min(percentOf(lowCritical.min, lowPoint.defenderHp), percentOf(highCritical.min, highPoint.defenderHp)),
    critMaxPercent: Math.max(percentOf(lowCritical.max, lowPoint.defenderHp), percentOf(highCritical.max, highPoint.defenderHp)),
    koProbabilities: scenario.calculation.high
      ? {
          ohko: { min: Math.min(low.ko.ohko, high.ko.ohko), max: Math.max(low.ko.ohko, high.ko.ohko) },
          twoHit: { min: Math.min(low.ko.twoHit, high.ko.twoHit), max: Math.max(low.ko.twoHit, high.ko.twoHit) },
        }
      : low.ko,
    moveMechanics: projectMoveMechanics(scenario, low),
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
    active: [],
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
  "snapshotId" | "moveId" | "moveType" | "attackerStatId" | "defenderId"
> & Pick<ScenarioResult, "statRange" | "defenderRanges">

type CalculableGroup = {
  outcome: CalculableScenario
  support: ScenarioSupport
  allAlwaysHits: boolean
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
  probabilityMode: ProbabilityMode = "battle-odds",
  preserveTrack: ScenarioTrack | null = null,
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
                          probabilityMode,
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

                        const calculationKey = calculationIdentity(outcome)
                        // Keep the selected raw branch separate, even when its effect is neutral.
                        const selections: Record<ScenarioTrack, string | number> = {
                          "attacker-stat": offense.id,
                          "defender-stat": defense.id,
                          "held-item": attackerItemId,
                          "defender-held-item": defenderItemId,
                          "attacker-ability": attackerAbilityId,
                          "defender-ability": defenderAbilityId,
                          "attacker-stage": attackerStage,
                          "defender-stage": defenderStage,
                          weather, terrain, screen,
                        }
                        // Classic removes accuracy from KO math, but multi-hit details
                        // still show the actual accuracy of each check.
                        const presentationKey = outcome.execution.powers.length > 1
                          ? JSON.stringify([calculationKey, outcome.hitFact === "always-hits" ? 100 : outcome.hitFact])
                          : calculationKey
                        const identity = preserveTrack
                          ? JSON.stringify([presentationKey, preserveTrack, selections[preserveTrack]])
                          : presentationKey
                        const group = calculableGroups.get(identity) ?? {
                          outcome,
                          support: outcome.support,
                          allAlwaysHits: true,
                          context: {
                            snapshotId: snapshot.id,
                            moveId: snapshot.moveId,
                            moveType: outcome.move.type,
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
                        group.allAlwaysHits &&= outcome.hitFact === "always-hits"
                        if (outcome.support === "semi-supported") group.support = outcome.support
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

  // Presentation partitions share calculation work but retain their own provenance.
  const summaries = new Map<string, ReturnType<typeof summarizeDamage>>()
  const rows = [...calculableGroups].map(([identity, group]) => {
    const calculationKey = calculationIdentity(group.outcome)
    let computed = summaries.get(calculationKey)
    if (!computed) {
      computed = summarizeDamage(group.outcome)
      summaries.set(calculationKey, computed)
    }
    let hitFact: HitFact = group.outcome.probability.hitProbability * 100
    if (group.allAlwaysHits) hitFact = "always-hits"
    else if (group.outcome.execution.powers.length > 1 && group.outcome.hitFact !== "always-hits") {
      hitFact = group.outcome.hitFact
    }
    return {
      calculationIdentity: identity,
      support: group.support,
      ...group.context,
      provenance: group.provenance,
      criticalOnly: group.outcome.calculation.low.normal === undefined,
      ...computed,
      moveMechanics: {
        ...computed.moveMechanics,
        hitFact,
      },
    }
  })

  return {
    rows,
    unavailable: [...unavailableGroups.values()].map(unavailableGroup),
  }
}
