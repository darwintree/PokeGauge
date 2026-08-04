import { useEffect, useRef, type Dispatch, type SetStateAction } from "react"

import type { MatchupCatalog } from "@/lib/catalog"
import {
  selectedSnapshotMoveIds,
  snapshotMoveIds,
  snapshotsForMoveIds,
  trackStateAfterCatalogTransition,
  type TrackState,
} from "@/lib/scenario"

function sameIds(a: readonly number[], b: readonly number[]): boolean {
  return a.length === b.length && a.every((id, index) => id === b[index])
}

export function useCatalogTransitionSync(
  catalog: MatchupCatalog,
  restored: boolean,
  setTrackState: Dispatch<SetStateAction<TrackState>>,
  setAddingOffense: Dispatch<SetStateAction<boolean>>,
  setAddingDefense: Dispatch<SetStateAction<boolean>>,
) {
  const attackerKeyRef = useRef(
    `${catalog.matchup.attackerId}:${catalog.moveCategory}`,
  )
  const attackerIdRef = useRef(catalog.matchup.attackerId)
  const defenderIdRef = useRef(catalog.matchup.defenderId)
  const defaultMovePoolIdsRef = useRef<number[]>([...catalog.defaultMovePoolIds])
  const defaultMoveIdsRef = useRef<number[]>([...catalog.defaultMoveIds])
  const defaultAttackerAbilityIdsRef = useRef<number[]>([
    ...catalog.defaultAttackerAbilityIds,
  ])
  const defaultDefenderAbilityIdsRef = useRef<number[]>([
    ...catalog.defaultDefenderAbilityIds,
  ])
  const movesTouchedRef = useRef(restored)
  const attackerAbilitiesTouchedRef = useRef(restored)
  const defenderAbilitiesTouchedRef = useRef(restored)
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
    }
    defaultAttackerAbilityIdsRef.current = [...catalog.defaultAttackerAbilityIds]
    defaultDefenderAbilityIdsRef.current = [...catalog.defaultDefenderAbilityIds]
    if (attackerChanged) attackerAbilitiesTouchedRef.current = false
    if (defenderChanged) defenderAbilitiesTouchedRef.current = false
    if (attackerOwnerChanged) {
      movesTouchedRef.current = false
    }
    setTrackState((state) =>
      trackStateAfterCatalogTransition(state, catalog, {
        attackerOwnerChanged,
        attackerChanged,
        defenderChanged,
      }),
    )
    setAddingOffense(false)
    setAddingDefense(false)
  }, [catalog, setTrackState, setAddingOffense, setAddingDefense])

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
    if (!attackerDefaultsChanged && !defenderDefaultsChanged) return
    defaultAttackerAbilityIdsRef.current = [...catalog.defaultAttackerAbilityIds]
    defaultDefenderAbilityIdsRef.current = [...catalog.defaultDefenderAbilityIds]
    setTrackState((state) => ({
      ...state,
      attackerAbilityIds:
        attackerDefaultsChanged &&
        !attackerAbilitiesTouchedRef.current &&
        sameIds(state.attackerAbilityIds, previousAttackerIds)
          ? [...catalog.defaultAttackerAbilityIds]
          : state.attackerAbilityIds,
      defenderAbilityIds:
        defenderDefaultsChanged &&
        !defenderAbilitiesTouchedRef.current &&
        sameIds(state.defenderAbilityIds, previousDefenderIds)
          ? [...catalog.defaultDefenderAbilityIds]
          : state.defenderAbilityIds,
    }))
  }, [
    catalog,
    catalog.defaultAttackerAbilityIds,
    catalog.defaultDefenderAbilityIds,
    setTrackState,
  ])

  return {
    catalogTransitionPending,
    movesTouchedRef,
    attackerAbilitiesTouchedRef,
    defenderAbilitiesTouchedRef,
  }
}
