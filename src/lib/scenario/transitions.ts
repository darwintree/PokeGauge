import type { MatchupCatalog } from "@/lib/catalog"
import { createMoveSnapshot, type MoveSnapshot } from "@/lib/move"

import { defaultTrackState } from "./state"
import { projectAbilitySelections } from "./ability-projection"
import type { TrackState } from "./types"

export function normalizeScreens(screens: TrackState["screens"]): TrackState["screens"] {
  return screens.length > 0 ? screens : ["none"]
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
  const identityChanged = attackerChanged || defenderChanged
  const next = {
    ...defaultTrackState(catalog),
    screens: state.screens,
    ...(!identityChanged && {
      weathers: state.weathers,
      terrains: state.terrains,
    }),
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
  return identityChanged
    ? next
    : projectAbilitySelections(next, catalog.moveCategory, undefined, undefined, true)
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
