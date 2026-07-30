import {
  getDefenderDefBounds,
  getDefenderHpBounds,
  getOffenseStatBounds,
  SCREENS,
  STAT_STAGES,
  WEATHERS,
} from "@/lib/calc-adapter"
import type { MatchupCatalog, MoveCategory } from "@/lib/catalog"
import {
  defenseTemplatesForState,
  offenseTemplatesForState,
  type TrackState,
} from "@/lib/scenario-pipeline"

export const SCENARIO_STORAGE_KEY = "pokemon-damage-calc:scenario"

const SCENARIO_STORAGE_VERSION = 1
const MOVE_CATEGORIES = ["physical", "special"] as const
const STAT_MODES = ["preset", "range"] as const
const PROBABILITY_MODES = ["rolls", "actual"] as const
const CRITICAL_STAGES = [0, 1, 2, 3] as const

export type ScenarioSnapshot = {
  version: typeof SCENARIO_STORAGE_VERSION
  attackerId: number
  defenderId: number
  moveCategory: MoveCategory
  trackState: TrackState
}

export type ScenarioSnapshotInput = Omit<ScenarioSnapshot, "version">

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

function isInteger(value: unknown): value is number {
  return Number.isInteger(value)
}

function isOneOf<T>(value: unknown, options: readonly T[]): value is T {
  return options.includes(value as T)
}

function isArrayOf<T>(
  value: unknown,
  predicate: (entry: unknown) => entry is T,
): value is T[] {
  return Array.isArray(value) && value.every(predicate)
}

function isString(value: unknown): value is string {
  return typeof value === "string"
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean"
}

function isNumberRange(value: unknown): value is { min: number; max: number } {
  return (
    isRecord(value) &&
    isFiniteNumber(value.min) &&
    isFiniteNumber(value.max) &&
    value.min <= value.max
  )
}

function isAllocationIndices(value: unknown): value is Record<string, number> {
  return (
    isRecord(value) &&
    Object.values(value).every((index) => isInteger(index) && index >= 0)
  )
}

function isTemporaryTemplate(
  value: unknown,
  valuesKind: "offense" | "defense",
): boolean {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    value.kind !== "temporary" ||
    !isRecord(value.values) ||
    value.values.kind !== valuesKind
  ) {
    return false
  }
  return valuesKind === "offense"
    ? isFiniteNumber(value.values.stat)
    : isFiniteNumber(value.values.hp) && isFiniteNumber(value.values.def)
}

function isMoveSnapshot(
  value: unknown,
): value is TrackState["moveSnapshots"][number] {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isInteger(value.moveId) &&
    isInteger(value.power) &&
    value.power >= 0 &&
    value.power <= 1000 &&
    isInteger(value.accuracy) &&
    value.accuracy >= 0 &&
    value.accuracy <= 100 &&
    isBoolean(value.alwaysHits) &&
    isOneOf(value.criticalStage, CRITICAL_STAGES) &&
    isBoolean(value.spreadEligible) &&
    isBoolean(value.spread)
  )
}

function isTrackState(value: unknown): value is TrackState {
  if (!isRecord(value) || !isRecord(value.defenderRanges)) return false
  return (
    isArrayOf(value.moveSnapshots, isMoveSnapshot) &&
    isArrayOf(value.selectedMoveSnapshotIds, isString) &&
    isOneOf(value.statMode, STAT_MODES) &&
    isArrayOf(value.offenseTemplateIds, isString) &&
    Array.isArray(value.offenseTemporaryTemplates) &&
    value.offenseTemporaryTemplates.every((template) =>
      isTemporaryTemplate(template, "offense"),
    ) &&
    isNumberRange(value.statRange) &&
    isBoolean(value.statRangeTouched) &&
    isBoolean(value.showOffenseActual) &&
    isAllocationIndices(value.offenseAllocationIndices) &&
    isArrayOf(value.attackerStages, (stage): stage is TrackState["attackerStages"][number] =>
      isOneOf(stage, STAT_STAGES),
    ) &&
    isArrayOf(value.attackerItemIds, isString) &&
    isArrayOf(value.attackerAbilityIds, isInteger) &&
    isArrayOf(value.weathers, (weather): weather is TrackState["weathers"][number] =>
      isOneOf(weather, WEATHERS),
    ) &&
    isOneOf(value.defenderMode, STAT_MODES) &&
    isArrayOf(value.defenseTemplateIds, isString) &&
    Array.isArray(value.defenseTemporaryTemplates) &&
    value.defenseTemporaryTemplates.every((template) =>
      isTemporaryTemplate(template, "defense"),
    ) &&
    isNumberRange(value.defenderRanges.hp) &&
    isNumberRange(value.defenderRanges.def) &&
    isBoolean(value.defenderRangeTouched) &&
    isBoolean(value.showDefenseActual) &&
    isBoolean(value.showResultActual) &&
    isAllocationIndices(value.defenseAllocationIndices) &&
    isArrayOf(value.defenderStages, (stage): stage is TrackState["defenderStages"][number] =>
      isOneOf(stage, STAT_STAGES),
    ) &&
    isArrayOf(value.defenderAbilityIds, isInteger) &&
    isArrayOf(value.screens, (screen): screen is TrackState["screens"][number] =>
      isOneOf(screen, SCREENS),
    ) &&
    isOneOf(value.probabilityMode, PROBABILITY_MODES)
  )
}

function parseScenarioSnapshot(value: unknown): ScenarioSnapshot | null {
  if (
    !isRecord(value) ||
    value.version !== SCENARIO_STORAGE_VERSION ||
    !isInteger(value.attackerId) ||
    !isInteger(value.defenderId) ||
    !isOneOf(value.moveCategory, MOVE_CATEGORIES) ||
    !isTrackState(value.trackState)
  ) {
    return null
  }
  return value as ScenarioSnapshot
}

export function discardScenarioSnapshot(): void {
  try {
    localStorage.removeItem(SCENARIO_STORAGE_KEY)
  } catch {
    // Scenario persistence is a throwaway enhancement.
  }
}

export function loadScenarioSnapshot(): ScenarioSnapshot | null {
  try {
    const raw = localStorage.getItem(SCENARIO_STORAGE_KEY)
    if (!raw) return null
    const snapshot = parseScenarioSnapshot(JSON.parse(raw))
    if (snapshot) return snapshot
  } catch {
    // Invalid or unavailable storage falls through to the default home state.
  }
  discardScenarioSnapshot()
  return null
}

export function saveScenarioSnapshot(snapshot: ScenarioSnapshotInput): void {
  try {
    localStorage.setItem(
      SCENARIO_STORAGE_KEY,
      JSON.stringify({ version: SCENARIO_STORAGE_VERSION, ...snapshot }),
    )
  } catch {
    // Runtime state remains authoritative when persistence is unavailable.
  }
}

function hasOnlyKnownIds<T extends string | number>(
  values: readonly T[],
  known: ReadonlySet<T>,
): boolean {
  return values.every((value) => known.has(value))
}

function hasUniqueValues<T>(values: readonly T[]): boolean {
  return new Set(values).size === values.length
}

function rangeFits(
  range: { min: number; max: number },
  bounds: { min: number; max: number },
): boolean {
  return range.min >= bounds.min && range.max <= bounds.max
}

export function scenarioSnapshotMatchesCatalog(
  snapshot: ScenarioSnapshot,
  catalog: MatchupCatalog,
): boolean {
  if (
    snapshot.attackerId !== catalog.matchup.attackerId ||
    snapshot.defenderId !== catalog.matchup.defenderId ||
    snapshot.moveCategory !== catalog.moveCategory
  ) {
    return false
  }

  const state = snapshot.trackState
  if (
    state.attackerStages.length === 0 ||
    state.attackerItemIds.length === 0 ||
    state.attackerAbilityIds.length === 0 ||
    state.weathers.length === 0 ||
    state.defenderStages.length === 0 ||
    state.defenderAbilityIds.length === 0 ||
    state.screens.length === 0 ||
    !rangeFits(
      state.statRange,
      getOffenseStatBounds(
        catalog.matchup.attackerSpecies,
        catalog.moveCategory,
      ),
    ) ||
    !rangeFits(
      state.defenderRanges.hp,
      getDefenderHpBounds(catalog.matchup.defenderSpecies),
    ) ||
    !rangeFits(
      state.defenderRanges.def,
      getDefenderDefBounds(
        catalog.matchup.defenderSpecies,
        catalog.moveCategory,
      ),
    )
  ) {
    return false
  }

  const snapshotsById = new Map(
    state.moveSnapshots.map((moveSnapshot) => [moveSnapshot.id, moveSnapshot]),
  )
  if (snapshotsById.size !== state.moveSnapshots.length) return false

  const movesById = new Map(catalog.moves.map((move) => [move.id, move]))
  if (
    state.moveSnapshots.some((moveSnapshot) => {
      const move = movesById.get(moveSnapshot.moveId)
      return (
        !move ||
        moveSnapshot.spreadEligible !== move.isSpread ||
        (!moveSnapshot.spreadEligible && moveSnapshot.spread)
      )
    }) ||
    !state.selectedMoveSnapshotIds.every((id) => snapshotsById.has(id))
  ) {
    return false
  }

  const offenseTemplateIds =
    state.offenseTemplateIds.length === 0
      ? new Set<string>()
      : new Set(
          offenseTemplatesForState(catalog, state).map((template) => template.id),
        )
  const defenseTemplateIds =
    state.defenseTemplateIds.length === 0
      ? new Set<string>()
      : new Set(
          defenseTemplatesForState(catalog, state).map((template) => template.id),
        )

  return (
    hasUniqueValues(state.selectedMoveSnapshotIds) &&
    hasUniqueValues(state.offenseTemplateIds) &&
    hasUniqueValues(state.attackerStages) &&
    hasUniqueValues(state.attackerItemIds) &&
    hasUniqueValues(state.attackerAbilityIds) &&
    hasUniqueValues(state.weathers) &&
    hasUniqueValues(state.defenseTemplateIds) &&
    hasUniqueValues(state.defenderStages) &&
    hasUniqueValues(state.defenderAbilityIds) &&
    hasUniqueValues(state.screens) &&
    hasOnlyKnownIds(state.offenseTemplateIds, offenseTemplateIds) &&
    hasOnlyKnownIds(state.defenseTemplateIds, defenseTemplateIds) &&
    hasOnlyKnownIds(
      state.attackerItemIds,
      new Set(catalog.attackerItems.map((item) => item.id)),
    ) &&
    hasOnlyKnownIds(
      state.attackerAbilityIds,
      new Set(catalog.attackerAbilities.map((ability) => ability.id)),
    ) &&
    hasOnlyKnownIds(
      state.defenderAbilityIds,
      new Set(catalog.defenderAbilities.map((ability) => ability.id)),
    )
  )
}
