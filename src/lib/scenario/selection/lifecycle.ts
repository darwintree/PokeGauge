import { defaultTrackState } from "../state"
import { projectAbilitySelections } from "../ability-projection"
import {
  selectedSnapshotMoveIds, snapshotMoveIds, snapshotsForMoveIds,
  trackStateAfterCatalogTransition,
} from "../transitions"
import type { TrackState } from "../types"
import { AUTOMATIC_TRACKS, type AutomaticTrack, type SelectionContext, type SelectionState } from "./types"

function sameIds<T>(a: readonly T[], b: readonly T[]): boolean {
  return a.length === b.length && a.every((id, index) => id === b[index])
}

export function projectSelections(state: SelectionState, tracks = state.trackState): TrackState {
  return projectAbilitySelections(tracks, state.context.catalog.moveCategory, {
    weather: state.edited.has("weather"),
    terrain: state.edited.has("terrain"),
    attackerStages: state.edited.has("attackerStage"),
  })
}

function applyDefaults(state: SelectionState): SelectionState {
  const { catalog } = state.context
  const { edited } = state
  let tracks = state.trackState
  let project = state.abilityProjectionPending

  if (catalog.defaultStatPickStatus === "ready" && !edited.has("offense") &&
    !sameIds(tracks.offensePresetIds, [catalog.defaultOffensePresetId])) {
    const defaults = defaultTrackState(catalog)
    tracks = {
      ...tracks,
      statMode: defaults.statMode,
      offensePresetIds: defaults.offensePresetIds,
      offenseTemporaryPresets: defaults.offenseTemporaryPresets,
      statRange: defaults.statRange,
      offenseAllocationIndices: defaults.offenseAllocationIndices,
    }
  }

  if (catalog.defaultMovePickStatus === "ready" && !edited.has("moves")) {
    const poolMatches = sameIds(snapshotMoveIds(tracks.moveSnapshots), catalog.defaultMovePoolIds)
    const selectionMatches = sameIds(
      selectedSnapshotMoveIds(tracks.moveSnapshots, tracks.selectedMoveSnapshotIds),
      catalog.defaultMoveIds,
    )
    if (!poolMatches || !selectionMatches) {
      const snapshots = poolMatches
        ? tracks.moveSnapshots : snapshotsForMoveIds(catalog, catalog.defaultMovePoolIds)
      tracks = {
        ...tracks,
        moveSnapshots: snapshots,
        selectedMoveSnapshotIds: snapshots
          .filter((snapshot) => catalog.defaultMoveIds.includes(snapshot.moveId))
          .map((snapshot) => snapshot.id),
      }
    }
  }

  for (const side of ["attacker", "defender"] as const) {
    const abilityKey = `${side}AbilityIds` as const
    const abilityDefaults = side === "attacker"
      ? catalog.defaultAttackerAbilityIds : catalog.defaultDefenderAbilityIds
    if (catalog.defaultAbilityPickStatus === "ready" && !edited.has(`${side}Ability`) &&
      !sameIds(tracks[abilityKey], abilityDefaults)) {
      tracks = { ...tracks, [abilityKey]: [...abilityDefaults] }
      project = true
    }
    const itemKey = `${side}ItemIds` as const
    const poolKey = `${side}ItemPoolIds` as const
    const itemDefaults = side === "attacker"
      ? catalog.defaultAttackerItemIds : catalog.defaultDefenderItemIds
    const poolDefaults = side === "attacker"
      ? catalog.defaultAttackerItemPoolIds : catalog.defaultDefenderItemPoolIds
    if (catalog.defaultItemPickStatus !== "loading" && !edited.has(`${side}Item`) &&
      (!sameIds(tracks[itemKey], itemDefaults) || !sameIds(tracks[poolKey], poolDefaults))) {
      tracks = { ...tracks, [itemKey]: [...itemDefaults], [poolKey]: [...poolDefaults] }
    }
  }

  if (project && catalog.defaultAbilityPickStatus === "ready") {
    tracks = projectSelections(state, tracks)
    project = false
  }
  return { ...state, trackState: tracks, abilityProjectionPending: project }
}

export function createSelectionState(context: SelectionContext, restored?: TrackState): SelectionState {
  const edited = new Set<AutomaticTrack>(restored ? AUTOMATIC_TRACKS : [])
  return applyDefaults({
    context,
    trackState: restored ?? defaultTrackState(context.catalog),
    edited,
    abilityProjectionPending: !restored,
  })
}

export function syncSelectionContext(state: SelectionState, context: SelectionContext): SelectionState {
  if (context === state.context) return state
  const previous = state.context.catalog
  const { catalog } = context
  const attackerChanged = previous.matchup.attackerId !== catalog.matchup.attackerId
  const defenderChanged = previous.matchup.defenderId !== catalog.matchup.defenderId
  const attackerOwnerChanged = attackerChanged || previous.moveCategory !== catalog.moveCategory
  if (!attackerOwnerChanged && !defenderChanged) {
    return applyDefaults({ ...state, context })
  }

  const identityChanged = attackerChanged || defenderChanged
  const edited = new Set(state.edited)
  if (attackerChanged) {
    edited.delete("attackerAbility")
    edited.delete("attackerItem")
  }
  if (defenderChanged) {
    edited.delete("defenderAbility")
    edited.delete("defenderItem")
  }
  if (attackerOwnerChanged) {
    edited.delete("moves")
    edited.delete("offense")
  }
  if (identityChanged) {
    edited.delete("weather")
    edited.delete("terrain")
  }
  edited.delete("attackerStage")
  const trackState = trackStateAfterCatalogTransition(state.trackState, catalog, {
    attackerOwnerChanged, attackerChanged, defenderChanged,
  })
  // A legal form transition can carry an existing item selection into the new
  // identity. Treat that carried choice as explicit, including during loading.
  if (attackerChanged && trackState.attackerItemIds === state.trackState.attackerItemIds) {
    edited.add("attackerItem")
  }
  if (defenderChanged && trackState.defenderItemIds === state.trackState.defenderItemIds) {
    edited.add("defenderItem")
  }
  return applyDefaults({
    context,
    edited,
    trackState,
    abilityProjectionPending: identityChanged || state.abilityProjectionPending,
  })
}

export function selectionIsSettled(state: SelectionState): boolean {
  const { catalog } = state.context
  const { edited } = state
  return !(
    (catalog.defaultMovePickStatus === "loading" && !edited.has("moves")) ||
    (catalog.defaultStatPickStatus === "loading" && !edited.has("offense")) ||
    (catalog.defaultAbilityPickStatus === "loading" &&
      (!edited.has("attackerAbility") || !edited.has("defenderAbility"))) ||
    (catalog.defaultItemPickStatus === "loading" &&
      (!edited.has("attackerItem") || !edited.has("defenderItem")))
  )
}
