import {
  type DefenderSetup,
  type StatSetup,
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
import {
  closestDefenderSetupHigh,
  closestDefenderSetupLow,
  closestOffenseSetupAtOrAbove,
  closestOffenseSetupAtOrBelow,
} from "@/lib/calc-adapter/stat-bounds"
import {
  defenseSetupForTemplate,
  offenseSetupForTemplate,
} from "@/lib/calc-adapter/template-range"
import type { MatchupCatalog } from "@/lib/catalog/types"
import {
  convolveDamageDistributions,
  createAtomicDamageDistribution,
  koProbability,
} from "@/lib/damage-distribution"
import { createMoveSnapshot } from "@/lib/move-snapshot"
import {
  buildSystemDefenseTemplates,
  buildSystemOffenseTemplates,
  defaultDefenseSelection,
  defaultOffenseSelection,
  formatTemplateActual,
  loadUserDefenseTemplates,
  loadUserOffenseTemplates,
  mergeTemplates,
  templateCardLabel,
  type StatNameStrategy,
  type StatValueTemplate,
} from "@/lib/stat-value-template"

import type {
  ProvenanceOptionSets,
  ScenarioPipelineResult,
  ScenarioProvenance,
  ScenarioRow,
  TrackState,
  UnavailableScenarioGroup,
} from "./types"
import { RANGE_DEFENDER_ID, RANGE_STAT_ID } from "./types"

export function offenseTemplatesForState(
  catalog: MatchupCatalog,
  trackState: TrackState,
): StatValueTemplate[] {
  const { attackerSpecies } = catalog.matchup
  const system = buildSystemOffenseTemplates(attackerSpecies, catalog.moveCategory)
  const user = loadUserOffenseTemplates(String(catalog.matchup.attackerId))
  return mergeTemplates(system, user, trackState.offenseTemporaryTemplates)
}

export function defenseTemplatesForState(
  catalog: MatchupCatalog,
  trackState: TrackState,
): StatValueTemplate[] {
  const { defenderSpecies } = catalog.matchup
  const system = buildSystemDefenseTemplates(defenderSpecies, catalog.moveCategory)
  const user = loadUserDefenseTemplates(String(catalog.matchup.defenderId))
  return mergeTemplates(system, user, trackState.defenseTemporaryTemplates)
}

function findTemplate(templates: StatValueTemplate[], id: string): StatValueTemplate | undefined {
  return templates.find((t) => t.id === id)
}

type PreparedStatChoice = {
  id: string
  low: StatSetup
  high: StatSetup
}

type PreparedDefenseChoice = {
  id: string
  low: DefenderSetup
  high: DefenderSetup
}

function average(rolls: readonly number[]): number {
  return rolls.reduce((sum, damage) => sum + damage, 0) / rolls.length
}

function mainRolls(point: DamageKernelResult["low"]): readonly number[] {
  const rolls = point.normal ?? point.critical
  if (!rolls) throw new Error("Compiled damage point has no damage branch")
  return rolls
}

function fixedKoProbabilities(
  point: DamageKernelResult["low"],
  probability: ProbabilityInput,
) {
  const atomic = createAtomicDamageDistribution({
    ...probability,
    normalDamageRolls: point.normal,
    criticalDamageRolls: point.critical,
  })
  return {
    ohko: koProbability(atomic, point.defenderHp),
    twoHit: koProbability(
      convolveDamageDistributions([atomic, atomic]),
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
  const lowKo = fixedKoProbabilities(low, probability)
  const highKo = fixedKoProbabilities(high, probability)
  const minDamage = Math.min(...lowMain)
  const maxDamage = Math.max(...highMain)
  const critMinDamage = Math.min(...lowCritical)
  const critMaxDamage = Math.max(...highCritical)
  const avgDamage = result.high ? (lowAverage + highAverage) / 2 : lowAverage
  const highOhkoRolls = highMain.filter((damage) => damage >= high.defenderHp).length

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
    ohkoChance: highOhkoRolls > 0 ? (highOhkoRolls / highMain.length) * 100 : undefined,
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
  catalog: MatchupCatalog,
  trackState: TrackState,
  templates: StatValueTemplate[],
): PreparedStatChoice[] {
  const species = catalog.matchup.attackerSpecies
  if (trackState.statMode === "range") {
    return [{
      id: RANGE_STAT_ID,
      low: closestOffenseSetupAtOrBelow(
        species,
        catalog.moveCategory,
        trackState.statRange.min,
      ),
      high: closestOffenseSetupAtOrAbove(
        species,
        catalog.moveCategory,
        Math.max(trackState.statRange.min, trackState.statRange.max),
      ),
    }]
  }

  return trackState.offenseTemplateIds.flatMap((id) => {
    const template = findTemplate(templates, id)
    if (!template) return []
    const setup = offenseSetupForTemplate(species, catalog.moveCategory, template)
    return [{ id, low: setup, high: setup }]
  })
}

function defenseChoices(
  catalog: MatchupCatalog,
  trackState: TrackState,
  templates: StatValueTemplate[],
): PreparedDefenseChoice[] {
  const species = catalog.matchup.defenderSpecies
  if (trackState.defenderMode === "range") {
    return [{
      id: RANGE_DEFENDER_ID,
      low: closestDefenderSetupLow(
        species,
        catalog.moveCategory,
        trackState.defenderRanges.hp.min,
        trackState.defenderRanges.def.min,
      ),
      high: closestDefenderSetupHigh(
        species,
        catalog.moveCategory,
        Math.max(trackState.defenderRanges.hp.min, trackState.defenderRanges.hp.max),
        Math.max(trackState.defenderRanges.def.min, trackState.defenderRanges.def.max),
      ),
    }]
  }

  return trackState.defenseTemplateIds.flatMap((id) => {
    const template = findTemplate(templates, id)
    if (!template) return []
    const setup = defenseSetupForTemplate(species, catalog.moveCategory, template)
    return [{ id, low: setup, high: setup }]
  })
}

function scenarioPoints(
  offense: PreparedStatChoice,
  defense: PreparedDefenseChoice,
): { lowOutcome: RawScenarioPoint; highOutcome?: RawScenarioPoint } {
  const lowOutcome = { offense: offense.low, defense: defense.high }
  if (offense.low === offense.high && defense.low === defense.high) return { lowOutcome }
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

type ScenarioRowContext = Pick<
  ScenarioRow,
  "snapshotId" | "moveId" | "attackerStatId" | "defenderId"
> & Pick<ScenarioRow, "statRange" | "defenderRanges">

type CalculableGroup = {
  outcome: CalculableScenario
  context: ScenarioRowContext
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
  const offenseTemplates = offenseTemplatesForState(catalog, trackState)
  const defenseTemplates = defenseTemplatesForState(catalog, trackState)
  const preparedOffense = offenseChoices(catalog, trackState, offenseTemplates)
  const preparedDefense = defenseChoices(catalog, trackState, defenseTemplates)

  for (const snapshot of trackState.moveSnapshots) {
    for (const attackerItemId of trackState.attackerItemIds) {
      for (const attackerAbilityId of trackState.attackerAbilityIds) {
        for (const weather of trackState.weathers) {
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
                        attackerAbilityId,
                        defenderAbilityId,
                        attackerStage,
                        defenderStage,
                        weather,
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
  const { attackerSpecies, defenderSpecies } = catalog.matchup
  const offenseSystem = buildSystemOffenseTemplates(attackerSpecies, catalog.moveCategory)
  const defenseSystem = buildSystemDefenseTemplates(defenderSpecies, catalog.moveCategory)
  const offenseUser = loadUserOffenseTemplates(String(catalog.matchup.attackerId))
  const defenseUser = loadUserDefenseTemplates(String(catalog.matchup.defenderId))

  return {
    moveSnapshots: catalog.defaultMoveIds.flatMap((moveId) => {
      const move = catalog.moves.find((candidate) => candidate.id === moveId)
      return move ? [createMoveSnapshot(move)] : []
    }),
    statMode: "preset",
    offenseTemplateIds: defaultOffenseSelection(offenseSystem, offenseUser),
    offenseTemporaryTemplates: [],
    statRange: defaultOffenseStatRange(attackerSpecies, catalog.moveCategory),
    statRangeTouched: false,
    showOffenseActual: false,
    offenseAllocationIndices: {},
    attackerStages: [0],
    attackerItemIds: [...catalog.defaultAttackerItemIds],
    attackerAbilityIds: [...catalog.defaultAttackerAbilityIds],
    weathers: ["none"],
    defenderMode: "preset",
    defenseTemplateIds: defaultDefenseSelection(defenseSystem, defenseUser),
    defenseTemporaryTemplates: [],
    defenderRanges: {
      hp: defaultDefenderHpRange(defenderSpecies),
      def: defaultDefenderDefRange(defenderSpecies, catalog.moveCategory),
    },
    defenderRangeTouched: false,
    showDefenseActual: false,
    showResultActual: false,
    defenseAllocationIndices: {},
    defenderStages: [0],
    defenderAbilityIds: [...catalog.defaultDefenderAbilityIds],
    screens: ["none"],
    probabilityMode: "rolls",
  }
}

export type RowLabelTemplates = {
  offense: StatValueTemplate[]
  defense: StatValueTemplate[]
}

export function rowLabels(
  catalog: MatchupCatalog,
  row: ScenarioRow,
  trackState: TrackState,
  statNameStrategy: StatNameStrategy,
  templates?: RowLabelTemplates,
): {
  move: string
  stat: string
  statActual: string | null
  defender: string
  defenderActual: string | null
} {
  const findItem = (options: { id: string | number; label: string }[], id: string | number) =>
    options.find((o) => o.id === id)?.label ?? id

  const defStatLabel = catalog.defenseStatLabel
  const offenseTemplates = templates?.offense ?? offenseTemplatesForState(catalog, trackState)
  const defenseTemplates = templates?.defense ?? defenseTemplatesForState(catalog, trackState)

  let statLabel: string
  let statActual: string | null = null
  if (row.attackerStatId === RANGE_STAT_ID && row.statRange) {
    statLabel = `${catalog.offenseStatLabel} ${row.statRange.min}–${row.statRange.max}`
  } else {
    const template = offenseTemplates.find((t) => t.id === row.attackerStatId)
    if (template) {
      statLabel = templateCardLabel(
        template,
        catalog.matchup.attackerSpecies,
        catalog.moveCategory,
        trackState.offenseAllocationIndices[template.id] ?? 0,
        statNameStrategy,
      )
      if (trackState.showResultActual) {
        statActual = formatTemplateActual(template)
      }
    } else {
      statLabel = row.attackerStatId
    }
  }

  let defenderLabel: string
  let defenderActual: string | null = null
  if (row.defenderId === RANGE_DEFENDER_ID && row.defenderRanges) {
    defenderLabel = `HP ${row.defenderRanges.hp.min}–${row.defenderRanges.hp.max} · ${defStatLabel} ${row.defenderRanges.def.min}–${row.defenderRanges.def.max}`
  } else {
    const template = defenseTemplates.find((t) => t.id === row.defenderId)
    if (template) {
      defenderLabel = templateCardLabel(
        template,
        catalog.matchup.defenderSpecies,
        catalog.moveCategory,
        trackState.defenseAllocationIndices[template.id] ?? 0,
        statNameStrategy,
      )
      if (trackState.showResultActual) {
        defenderActual = formatTemplateActual(template)
      }
    } else {
      defenderLabel = row.defenderId
    }
  }

  return {
    move: String(findItem(catalog.moves, row.moveId)),
    stat: statLabel,
    statActual,
    defender: defenderLabel,
    defenderActual,
  }
}

export function expectedRowCount(trackState: TrackState): number {
  const offenseCount =
    trackState.statMode === "range" ? 1 : trackState.offenseTemplateIds.length
  const defenderCount =
    trackState.defenderMode === "range" ? 1 : trackState.defenseTemplateIds.length
  return (
    trackState.moveSnapshots.length *
    offenseCount *
    trackState.attackerStages.length *
    trackState.attackerItemIds.length *
    trackState.attackerAbilityIds.length *
    trackState.weathers.length *
    defenderCount *
    trackState.defenderStages.length *
    trackState.defenderAbilityIds.length *
    trackState.screens.length
  )
}
