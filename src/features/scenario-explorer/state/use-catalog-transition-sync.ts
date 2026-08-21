import { useEffect, useRef, type Dispatch, type SetStateAction } from "react"

import type { MatchupCatalog } from "@/lib/catalog"
import type { HeldItemId } from "@/lib/held-item"
import {
  defaultTrackState,
  projectAbilitySelections,
  selectedSnapshotMoveIds,
  snapshotMoveIds,
  snapshotsForMoveIds,
  trackStateAfterCatalogTransition,
  type TrackState,
} from "@/lib/scenario"

function sameIds<T>(a: readonly T[], b: readonly T[]): boolean {
  return a.length === b.length && a.every((id, index) => id === b[index])
}

export function useCatalogTransitionSync(
  catalog: MatchupCatalog,
  restored: boolean,
  setTrackState: Dispatch<SetStateAction<TrackState>>,
  setAddingOffense: () => void,
  setAddingDefense: () => void,
) {
  const attackerKeyRef = useRef(
    `${catalog.matchup.attackerId}:${catalog.moveCategory}`,
  )
  const attackerIdRef = useRef(catalog.matchup.attackerId)
  const defenderIdRef = useRef(catalog.matchup.defenderId)
  const defaultMovePoolIdsRef = useRef<number[]>([...catalog.defaultMovePoolIds])
  const defaultMoveIdsRef = useRef<number[]>([...catalog.defaultMoveIds])
  const defaultOffensePresetIdRef = useRef(catalog.defaultOffensePresetId)
  const defaultAttackerAbilityIdsRef = useRef<number[]>([
    ...catalog.defaultAttackerAbilityIds,
  ])
  const defaultDefenderAbilityIdsRef = useRef<number[]>([
    ...catalog.defaultDefenderAbilityIds,
  ])
  const defaultAttackerItemPoolIdsRef = useRef<HeldItemId[]>([
    ...catalog.defaultAttackerItemPoolIds,
  ])
  const defaultDefenderItemPoolIdsRef = useRef<HeldItemId[]>([
    ...catalog.defaultDefenderItemPoolIds,
  ])
  const defaultAttackerItemIdsRef = useRef<HeldItemId[]>([
    ...catalog.defaultAttackerItemIds,
  ])
  const defaultDefenderItemIdsRef = useRef<HeldItemId[]>([
    ...catalog.defaultDefenderItemIds,
  ])
  const movesTouchedRef = useRef(restored)
  const offenseTouchedRef = useRef(restored)
  const attackerAbilitiesTouchedRef = useRef(restored)
  const defenderAbilitiesTouchedRef = useRef(restored)
  const attackerItemsTouchedRef = useRef(restored)
  const defenderItemsTouchedRef = useRef(restored)
  const abilityProjectionPendingRef = useRef(!restored)
  const catalogTransitionPending =
    attackerKeyRef.current !==
      `${catalog.matchup.attackerId}:${catalog.moveCategory}` ||
    defenderIdRef.current !== catalog.matchup.defenderId

  useEffect(() => {
    const attackerKey = `${catalog.matchup.attackerId}:${catalog.moveCategory}`
    const attackerOwnerChanged = attackerKeyRef.current !== attackerKey
    const attackerChanged = attackerIdRef.current !== catalog.matchup.attackerId
    const defenderChanged = defenderIdRef.current !== catalog.matchup.defenderId
    if (!attackerOwnerChanged && !defenderChanged) return
    attackerKeyRef.current = attackerKey
    attackerIdRef.current = catalog.matchup.attackerId
    defenderIdRef.current = catalog.matchup.defenderId
    if (attackerOwnerChanged) {
      defaultMovePoolIdsRef.current = [...catalog.defaultMovePoolIds]
      defaultMoveIdsRef.current = [...catalog.defaultMoveIds]
      defaultOffensePresetIdRef.current = catalog.defaultOffensePresetId
    }
    defaultAttackerAbilityIdsRef.current = [...catalog.defaultAttackerAbilityIds]
    defaultDefenderAbilityIdsRef.current = [...catalog.defaultDefenderAbilityIds]
    defaultAttackerItemPoolIdsRef.current = [...catalog.defaultAttackerItemPoolIds]
    defaultDefenderItemPoolIdsRef.current = [...catalog.defaultDefenderItemPoolIds]
    defaultAttackerItemIdsRef.current = [...catalog.defaultAttackerItemIds]
    defaultDefenderItemIdsRef.current = [...catalog.defaultDefenderItemIds]
    if (attackerChanged) {
      attackerAbilitiesTouchedRef.current = false
      attackerItemsTouchedRef.current = false
    }
    if (defenderChanged) {
      defenderAbilitiesTouchedRef.current = false
      defenderItemsTouchedRef.current = false
    }
    if (attackerChanged || defenderChanged) {
      abilityProjectionPendingRef.current = true
    }
    if (attackerOwnerChanged) {
      movesTouchedRef.current = false
      offenseTouchedRef.current = false
    }
    setTrackState((state) =>
      trackStateAfterCatalogTransition(state, catalog, {
        attackerOwnerChanged,
        attackerChanged,
        defenderChanged,
      }),
    )
    setAddingOffense()
    setAddingDefense()
  }, [catalog, setTrackState, setAddingOffense, setAddingDefense])

  useEffect(() => {
    if (catalog.defaultStatPickStatus !== "ready") return
    const previousId = defaultOffensePresetIdRef.current
    if (previousId === catalog.defaultOffensePresetId) return
    defaultOffensePresetIdRef.current = catalog.defaultOffensePresetId
    setTrackState((state) => {
      if (offenseTouchedRef.current) return state
      const defaults = defaultTrackState(catalog)
      return {
        ...state,
        statMode: defaults.statMode,
        offensePresetIds: defaults.offensePresetIds,
        offenseTemporaryPresets: defaults.offenseTemporaryPresets,
        statRange: defaults.statRange,
        offenseAllocationIndices: defaults.offenseAllocationIndices,
      }
    })
  }, [catalog, catalog.defaultOffensePresetId, catalog.defaultStatPickStatus, setTrackState])

  useEffect(() => {
    if (catalog.defaultMovePickStatus !== "ready") return
    const previousDefaultMovePoolIds = defaultMovePoolIdsRef.current
    const previousDefaultMoveIds = defaultMoveIdsRef.current
    if (
      sameIds(previousDefaultMovePoolIds, catalog.defaultMovePoolIds) &&
      sameIds(previousDefaultMoveIds, catalog.defaultMoveIds)
    ) return
    defaultMovePoolIdsRef.current = [...catalog.defaultMovePoolIds]
    defaultMoveIdsRef.current = [...catalog.defaultMoveIds]
    setTrackState((s) => {
      if (movesTouchedRef.current) return s
      if (!sameIds(snapshotMoveIds(s.moveSnapshots), previousDefaultMovePoolIds)) return s
      if (!sameIds(
        selectedSnapshotMoveIds(s.moveSnapshots, s.selectedMoveSnapshotIds),
        previousDefaultMoveIds,
      )) return s
      const moveSnapshots = sameIds(previousDefaultMovePoolIds, catalog.defaultMovePoolIds)
        ? s.moveSnapshots
        : snapshotsForMoveIds(catalog, catalog.defaultMovePoolIds)
      const selectedMoveIds = new Set(catalog.defaultMoveIds)
      return {
        ...s,
        moveSnapshots,
        selectedMoveSnapshotIds: moveSnapshots
          .filter((snapshot) => selectedMoveIds.has(snapshot.moveId))
          .map((snapshot) => snapshot.id),
      }
    })
  }, [catalog, catalog.defaultMovePoolIds, catalog.defaultMoveIds, setTrackState])

  useEffect(() => {
    if (catalog.defaultAbilityPickStatus !== "ready") return
    const previousAttackerIds = defaultAttackerAbilityIdsRef.current
    const previousDefenderIds = defaultDefenderAbilityIdsRef.current
    const attackerDefaultsChanged = !sameIds(
      previousAttackerIds,
      catalog.defaultAttackerAbilityIds,
    )
    const defenderDefaultsChanged = !sameIds(
      previousDefenderIds,
      catalog.defaultDefenderAbilityIds,
    )
    if (
      !attackerDefaultsChanged &&
      !defenderDefaultsChanged &&
      !abilityProjectionPendingRef.current
    ) return
    defaultAttackerAbilityIdsRef.current = [...catalog.defaultAttackerAbilityIds]
    defaultDefenderAbilityIdsRef.current = [...catalog.defaultDefenderAbilityIds]
    const projectionPending = abilityProjectionPendingRef.current
    setTrackState((state) => {
      const applyAttackerDefaults =
        attackerDefaultsChanged &&
        !attackerAbilitiesTouchedRef.current &&
        sameIds(state.attackerAbilityIds, previousAttackerIds)
      const applyDefenderDefaults =
        defenderDefaultsChanged &&
        !defenderAbilitiesTouchedRef.current &&
        sameIds(state.defenderAbilityIds, previousDefenderIds)
      const next = {
        ...state,
        attackerAbilityIds: applyAttackerDefaults
          ? [...catalog.defaultAttackerAbilityIds]
          : state.attackerAbilityIds,
        defenderAbilityIds: applyDefenderDefaults
          ? [...catalog.defaultDefenderAbilityIds]
          : state.defenderAbilityIds,
      }
      return projectionPending ||
        applyAttackerDefaults ||
        applyDefenderDefaults
        ? projectAbilitySelections(next, catalog.moveCategory)
        : next
    })
    abilityProjectionPendingRef.current = false
  }, [
    catalog,
    catalog.defaultAttackerAbilityIds,
    catalog.defaultDefenderAbilityIds,
    setTrackState,
  ])

  useEffect(() => {
    // Apply when resolved (ready or unavailable): each side's arrays already hold fallbacks.
    if (catalog.defaultItemPickStatus === "loading") return
    const previousAttackerPool = defaultAttackerItemPoolIdsRef.current
    const previousDefenderPool = defaultDefenderItemPoolIdsRef.current
    const previousAttackerIds = defaultAttackerItemIdsRef.current
    const previousDefenderIds = defaultDefenderItemIdsRef.current
    const attackerDefaultsChanged =
      !sameIds(previousAttackerPool, catalog.defaultAttackerItemPoolIds) ||
      !sameIds(previousAttackerIds, catalog.defaultAttackerItemIds)
    const defenderDefaultsChanged =
      !sameIds(previousDefenderPool, catalog.defaultDefenderItemPoolIds) ||
      !sameIds(previousDefenderIds, catalog.defaultDefenderItemIds)
    if (!attackerDefaultsChanged && !defenderDefaultsChanged) return
    defaultAttackerItemPoolIdsRef.current = [...catalog.defaultAttackerItemPoolIds]
    defaultDefenderItemPoolIdsRef.current = [...catalog.defaultDefenderItemPoolIds]
    defaultAttackerItemIdsRef.current = [...catalog.defaultAttackerItemIds]
    defaultDefenderItemIdsRef.current = [...catalog.defaultDefenderItemIds]
    setTrackState((state) => {
      let next = state
      if (
        attackerDefaultsChanged &&
        !attackerItemsTouchedRef.current &&
        sameIds(state.attackerItemPoolIds, previousAttackerPool) &&
        sameIds(state.attackerItemIds, previousAttackerIds)
      ) {
        next = {
          ...next,
          attackerItemPoolIds: [...catalog.defaultAttackerItemPoolIds],
          attackerItemIds: [...catalog.defaultAttackerItemIds],
        }
      }
      if (
        defenderDefaultsChanged &&
        !defenderItemsTouchedRef.current &&
        sameIds(state.defenderItemPoolIds, previousDefenderPool) &&
        sameIds(state.defenderItemIds, previousDefenderIds)
      ) {
        next = {
          ...next,
          defenderItemPoolIds: [...catalog.defaultDefenderItemPoolIds],
          defenderItemIds: [...catalog.defaultDefenderItemIds],
        }
      }
      return next
    })
  }, [
    catalog,
    catalog.defaultAttackerItemPoolIds,
    catalog.defaultDefenderItemPoolIds,
    catalog.defaultAttackerItemIds,
    catalog.defaultDefenderItemIds,
    catalog.defaultItemPickStatus,
    setTrackState,
  ])

  return {
    catalogTransitionPending,
    movesTouchedRef,
    offenseTouchedRef,
    attackerAbilitiesTouchedRef,
    defenderAbilitiesTouchedRef,
    attackerItemsTouchedRef,
    defenderItemsTouchedRef,
  }
}
