import { SCREENS, STAT_STAGES, TERRAINS, WEATHERS } from "@/lib/damage-calculation"
import { abilityIsSelectable } from "@/lib/ability"
import {
  getDefenderDefBounds,
  getDefenderHpBounds,
  getOffenseStatBounds,
} from "@/lib/stat-calculation"
import type { MatchupCatalog, MoveCategory } from "@/lib/catalog"
import { moveCanBecomeSpread, moveHitProfile } from "@/lib/move"
import {
  defensePresetsForState,
  mergeStagePool,
  offensePresetsForState,
} from "../state"
import {
  isDualStoreTrackState,
  stripTouched,
  trackStateAfterDefenseRanges,
  trackStateAfterOffenseRange,
  withDefenseEnvelope,
  withOffenseEnvelope,
  type PersistedTrackState,
} from "../stat-selection"
import type { TrackState } from "../types"

export const SCENARIO_STORAGE_KEY = "pokegauge:scenario"

const SCENARIO_STORAGE_VERSION = 5
const LEGACY_SCENARIO_STORAGE_VERSION = 3
const PREVIOUS_SCENARIO_STORAGE_VERSION = 4
const MOVE_CATEGORIES = ["physical", "special"] as const
const STAT_MODES = ["preset", "range"] as const
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

function isHeldItemId(value: unknown): value is TrackState["attackerItemIds"][number] {
  return value === "none" || value === "unknown-mega-stone" || isInteger(value)
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

function isTemporaryPreset(
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
    (!moveHitProfile(value.moveId) || value.power === moveHitProfile(value.moveId)!.powers[0]) &&
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
    isArrayOf(value.offensePresetIds, isString) &&
    Array.isArray(value.offenseTemporaryPresets) &&
    value.offenseTemporaryPresets.every((preset) =>
      isTemporaryPreset(preset, "offense"),
    ) &&
    isNumberRange(value.statRange) &&
    (value.statRangeTouched === undefined || isBoolean(value.statRangeTouched)) &&
    isAllocationIndices(value.offenseAllocationIndices) &&
    isArrayOf(value.attackerStages, (stage): stage is TrackState["attackerStages"][number] =>
      isOneOf(stage, STAT_STAGES),
    ) &&
    isArrayOf(value.attackerStagePool, (stage): stage is TrackState["attackerStagePool"][number] =>
      isOneOf(stage, STAT_STAGES),
    ) &&
    isArrayOf(value.attackerItemPoolIds, isHeldItemId) &&
    isArrayOf(value.defenderItemPoolIds, isHeldItemId) &&
    isArrayOf(value.attackerItemIds, isHeldItemId) &&
    isArrayOf(value.defenderItemIds, isHeldItemId) &&
    isArrayOf(value.attackerAbilityIds, isInteger) &&

    isArrayOf(value.weatherPool, (value): value is TrackState["weatherPool"][number] =>
      isOneOf(value, WEATHERS),
    ) &&
    isArrayOf(value.weathers, (weather): weather is TrackState["weathers"][number] =>
      isOneOf(weather, WEATHERS),
    ) &&
    isArrayOf(value.terrainPool, (value): value is TrackState["terrainPool"][number] =>
      isOneOf(value, TERRAINS),
    ) &&
    isArrayOf(value.terrains, (terrain): terrain is TrackState["terrains"][number] =>
      isOneOf(terrain, TERRAINS),
    ) &&
    isOneOf(value.defenderMode, STAT_MODES) &&
    isArrayOf(value.defensePresetIds, isString) &&
    Array.isArray(value.defenseTemporaryPresets) &&
    value.defenseTemporaryPresets.every((preset) =>
      isTemporaryPreset(preset, "defense"),
    ) &&
    isNumberRange(value.defenderRanges.hp) &&
    isNumberRange(value.defenderRanges.def) &&
    (value.defenderRangeTouched === undefined || isBoolean(value.defenderRangeTouched)) &&
    isAllocationIndices(value.defenseAllocationIndices) &&
    isArrayOf(value.defenderStages, (stage): stage is TrackState["defenderStages"][number] =>
      isOneOf(stage, STAT_STAGES),
    ) &&
    isArrayOf(value.defenderStagePool, (stage): stage is TrackState["defenderStagePool"][number] =>
      isOneOf(stage, STAT_STAGES),
    ) &&
    isArrayOf(value.defenderAbilityIds, isInteger) &&
    isArrayOf(value.screens, (screen): screen is TrackState["screens"][number] =>
      isOneOf(screen, SCREENS),
    )
  )
}

function withChoicePools(trackState: Record<string, unknown>): Record<string, unknown> {
  const {
    showOffenseStatValue: _showOffenseStatValue,
    showDefenseStatValue: _showDefenseStatValue,
    showResultStatValue: _showResultStatValue,
    probabilityMode: _probabilityMode,
    ...rest
  } = trackState
  const attackerStages = Array.isArray(trackState.attackerStages)
    ? trackState.attackerStages.filter((stage): stage is TrackState["attackerStages"][number] =>
      isOneOf(stage, STAT_STAGES),
    )
    : []
  const defenderStages = Array.isArray(trackState.defenderStages)
    ? trackState.defenderStages.filter((stage): stage is TrackState["defenderStages"][number] =>
      isOneOf(stage, STAT_STAGES),
    )
    : []
  return {
    ...rest,
    terrainPool: trackState.terrainPool ?? [
      ...new Set(["none", ...(Array.isArray(trackState.terrains) ? trackState.terrains : [])]),
    ],
    weatherPool: trackState.weatherPool ?? [
      ...new Set(["none", ...(Array.isArray(trackState.weathers) ? trackState.weathers : [])]),
    ],
    attackerItemPoolIds: Array.isArray(trackState.attackerItemPoolIds)
      ? trackState.attackerItemPoolIds
      : trackState.attackerItemIds,
    defenderItemPoolIds: Array.isArray(trackState.defenderItemPoolIds)
      ? trackState.defenderItemPoolIds
      : trackState.defenderItemIds,
    attackerStagePool: Array.isArray(trackState.attackerStagePool)
      ? trackState.attackerStagePool
      : mergeStagePool([], attackerStages),
    defenderStagePool: Array.isArray(trackState.defenderStagePool)
      ? trackState.defenderStagePool
      : mergeStagePool([], defenderStages),
  }
}

function migrateLegacyScenarioSnapshot(value: unknown): unknown {
  if (!isRecord(value) || !isRecord(value.trackState)) return value

  if (value.version === LEGACY_SCENARIO_STORAGE_VERSION) {
    const {
      offenseTemplateIds,
      offenseTemporaryTemplates,
      defenseTemplateIds,
      defenseTemporaryTemplates,
      showOffenseActual: _showOffenseActual,
      showDefenseActual: _showDefenseActual,
      showResultActual: _showResultActual,
      probabilityMode: _probabilityMode,
      ...trackState
    } = value.trackState

    return {
      ...value,
      version: SCENARIO_STORAGE_VERSION,
      trackState: withChoicePools({
        ...trackState,
        offensePresetIds: offenseTemplateIds,
        offenseTemporaryPresets: offenseTemporaryTemplates,
        defensePresetIds: defenseTemplateIds,
        defenseTemporaryPresets: defenseTemporaryTemplates,
      }),
    }
  }

  if (value.version === PREVIOUS_SCENARIO_STORAGE_VERSION) {
    return {
      ...value,
      version: SCENARIO_STORAGE_VERSION,
      trackState: withChoicePools(value.trackState),
    }
  }

  return {
    ...value,
    trackState: withChoicePools(value.trackState),
  }
}

function parseScenarioSnapshot(value: unknown): ScenarioSnapshot | null {
  const migrated = migrateLegacyScenarioSnapshot(value)
  if (
    !isRecord(migrated) ||
    migrated.version !== SCENARIO_STORAGE_VERSION ||
    !isInteger(migrated.attackerId) ||
    !isInteger(migrated.defenderId) ||
    !isOneOf(migrated.moveCategory, MOVE_CATEGORIES) ||
    !isTrackState(migrated.trackState)
  ) {
    return null
  }
  return migrated as ScenarioSnapshot
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

export function restorePersistedTrackState(
  raw: PersistedTrackState,
  catalog: MatchupCatalog,
): TrackState {
  const dualStore = isDualStoreTrackState(raw)
  let state = stripTouched(raw)
  const offensePresets = offensePresetsForState(catalog, state)
  const defensePresets = defensePresetsForState(catalog, state)

  if (dualStore && raw.statMode === "range") {
    state = trackStateAfterOffenseRange(state, raw.statRange, offensePresets)
  } else {
    state = withOffenseEnvelope(state, offensePresets)
  }

  if (dualStore && raw.defenderMode === "range") {
    state = trackStateAfterDefenseRanges(state, raw.defenderRanges, defensePresets)
  } else {
    state = withDefenseEnvelope(state, defensePresets)
  }

  return state
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
    state.defenderItemIds.length === 0 ||
    state.attackerAbilityIds.length === 0 ||
    state.weathers.length === 0 ||
    state.terrains.length === 0 ||
    state.defenderStages.length === 0 ||
    state.defenderAbilityIds.length === 0 ||
    state.screens.length === 0 ||
    !rangeFits(
      state.statRange,
      getOffenseStatBounds(
        catalog.matchup.attackerCalcName,
        catalog.moveCategory,
      ),
    ) ||
    !rangeFits(
      state.defenderRanges.hp,
      getDefenderHpBounds(catalog.matchup.defenderCalcName),
    ) ||
    !rangeFits(
      state.defenderRanges.def,
      getDefenderDefBounds(
        catalog.matchup.defenderCalcName,
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
        moveSnapshot.spreadEligible !==
          (move.isSpread || moveCanBecomeSpread(move.id)) ||
        (!moveSnapshot.spreadEligible && moveSnapshot.spread)
      )
    }) ||
    !state.selectedMoveSnapshotIds.every((id) => snapshotsById.has(id))
  ) {
    return false
  }

  const offensePresetIds =
    state.offensePresetIds.length === 0
      ? new Set<string>()
      : new Set(
          offensePresetsForState(catalog, state).map((preset) => preset.id),
        )
  const defensePresetIds =
    state.defensePresetIds.length === 0
      ? new Set<string>()
      : new Set(
          defensePresetsForState(catalog, state).map((preset) => preset.id),
        )

  return (
    hasUniqueValues(state.selectedMoveSnapshotIds) &&
    hasUniqueValues(state.offensePresetIds) &&
    hasUniqueValues(state.attackerStages) &&
    hasUniqueValues(state.attackerStagePool) &&
    hasUniqueValues(state.attackerItemIds) &&
    hasUniqueValues(state.defenderItemIds) &&
    hasUniqueValues(state.attackerAbilityIds) &&
    hasUniqueValues(state.weatherPool) &&
    hasUniqueValues(state.weathers) &&
    hasUniqueValues(state.terrainPool) &&
    hasUniqueValues(state.terrains) &&
    hasUniqueValues(state.defensePresetIds) &&
    hasUniqueValues(state.defenderStages) &&
    hasUniqueValues(state.defenderStagePool) &&
    hasUniqueValues(state.defenderAbilityIds) &&
    hasUniqueValues(state.screens) &&
    hasOnlyKnownIds(state.offensePresetIds, offensePresetIds) &&
    hasOnlyKnownIds(state.defensePresetIds, defensePresetIds) &&
    hasOnlyKnownIds(
      state.attackerItemIds,
      new Set(catalog.attackerItems.map((item) => item.id)),
    ) &&
    hasOnlyKnownIds(
      state.defenderItemIds,
      new Set(catalog.defenderItems.map((item) => item.id)),
    ) &&
    (catalog.attackerLockedItemId === null ||
      state.attackerItemIds.length === 1 &&
      state.attackerItemIds[0] === catalog.attackerLockedItemId) &&
    (catalog.defenderLockedItemId === null ||
      state.defenderItemIds.length === 1 &&
      state.defenderItemIds[0] === catalog.defenderLockedItemId) &&
    hasOnlyKnownIds(
      state.attackerAbilityIds,
      new Set(catalog.attackerAbilities
        .filter((ability) => abilityIsSelectable(ability.id))
        .map((ability) => ability.id)),
    ) &&
    hasOnlyKnownIds(
      state.defenderAbilityIds,
      new Set(catalog.defenderAbilities
        .filter((ability) => abilityIsSelectable(ability.id))
        .map((ability) => ability.id)),
    )
  )
}
