import type { MatchupCatalog } from "@/lib/catalog"
import { createMoveSnapshot, type MoveSnapshot } from "@/lib/move"
import {
  findPresetByDefenseValues,
  findPresetByOffenseValue,
  newTemporaryDefensePreset,
  newTemporaryOffensePreset,
  type StatPreset,
} from "@/lib/stat-preset"

import { defaultTrackState } from "./state"
import type { DefenderStatRanges, TrackState } from "./types"

function rangeEndpoints(min: number, max: number): number[] {
  return max === min ? [min] : [min, max]
}

export function normalizeScreens(screens: TrackState["screens"]): TrackState["screens"] {
  return screens.length > 0 ? screens : ["none"]
}

export function reconcileOffenseFromRange(
  allPresets: StatPreset[],
  statRange: TrackState["statRange"],
  existingTemp: StatPreset[],
): { selectedIds: string[]; temporary: StatPreset[] } {
  const temporary = [...existingTemp]
  const selectedIds: string[] = []

  for (const value of rangeEndpoints(statRange.min, statRange.max)) {
    let match =
      findPresetByOffenseValue(allPresets, value) ??
      findPresetByOffenseValue(temporary, value)
    if (!match) {
      match = newTemporaryOffensePreset(value)
      temporary.push(match)
    }
    selectedIds.push(match.id)
  }

  return { selectedIds, temporary }
}

export function reconcileDefenseFromRange(
  allPresets: StatPreset[],
  ranges: DefenderStatRanges,
  existingTemp: StatPreset[],
): { selectedIds: string[]; temporary: StatPreset[] } {
  const temporary = [...existingTemp]
  const selectedIds: string[] = []

  for (const hp of rangeEndpoints(ranges.hp.min, ranges.hp.max)) {
    for (const def of rangeEndpoints(ranges.def.min, ranges.def.max)) {
      let match =
        findPresetByDefenseValues(allPresets, hp, def) ??
        findPresetByDefenseValues(temporary, hp, def)
      if (!match) {
        match = newTemporaryDefensePreset(hp, def)
        temporary.push(match)
      }
      if (!selectedIds.includes(match.id)) selectedIds.push(match.id)
    }
  }

  return { selectedIds, temporary }
}

function itemSelectionFits(
  selectedIds: TrackState["attackerItemIds"],
  options: MatchupCatalog["attackerItems"],
): boolean {
  return selectedIds.every((id) => options.some((option) => option.id === id))
}

export function trackStateAfterCatalogTransition(
  state: TrackState,
  catalog: MatchupCatalog,
  changes: {
    attackerOwnerChanged: boolean
    attackerChanged: boolean
    defenderChanged: boolean
  },
): TrackState {
  const { attackerOwnerChanged, attackerChanged, defenderChanged } = changes
  return {
    ...defaultTrackState(catalog),
    screens: state.screens,
    ...(attackerChanged && catalog.attackerPreservesItem &&
      itemSelectionFits(state.attackerItemIds, catalog.attackerItems) && {
      attackerItemPoolIds: state.attackerItemPoolIds,
      attackerItemIds: state.attackerItemIds,
    }),
    ...(defenderChanged && catalog.defenderPreservesItem &&
      itemSelectionFits(state.defenderItemIds, catalog.defenderItems) && {
      defenderItemPoolIds: state.defenderItemPoolIds,
      defenderItemIds: state.defenderItemIds,
    }),
    ...(!attackerChanged && {
      attackerAbilityIds: state.attackerAbilityIds,
    }),
    ...(!defenderChanged && {
      defenderAbilityIds: state.defenderAbilityIds,
    }),
    ...(!attackerOwnerChanged && {
      moveSnapshots: state.moveSnapshots,
      selectedMoveSnapshotIds: state.selectedMoveSnapshotIds,
    }),
  }
}

export function snapshotsForMoveIds(
  catalog: MatchupCatalog,
  moveIds: readonly number[],
): MoveSnapshot[] {
  return moveIds.flatMap((moveId) => {
    const move = catalog.moves.find((candidate) => candidate.id === moveId)
    return move ? [createMoveSnapshot(move)] : []
  })
}

export function snapshotMoveIds(snapshots: readonly MoveSnapshot[]): number[] {
  return snapshots.map((snapshot) => snapshot.moveId)
}

export function selectedSnapshotMoveIds(
  snapshots: readonly MoveSnapshot[],
  selectedSnapshotIds: readonly string[],
): number[] {
  const selected = new Set(selectedSnapshotIds)
  return snapshots
    .filter((snapshot) => selected.has(snapshot.id))
    .map((snapshot) => snapshot.moveId)
}
