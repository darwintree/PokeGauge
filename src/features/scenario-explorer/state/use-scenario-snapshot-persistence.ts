import { useEffect, useRef, type RefObject } from "react"

import type { MatchupCatalog } from "@/lib/catalog"
import { saveScenarioSnapshot, type ScenarioSnapshotInput } from "@/lib/scenario"
import type { TrackState } from "@/lib/scenario"

const SCENARIO_SAVE_DELAY_MS = 150

export function useScenarioSnapshotPersistence({
  enabled = true,
  catalog,
  trackState,
  catalogTransitionPending,
  movesTouchedRef,
  attackerAbilitiesTouchedRef,
  defenderAbilitiesTouchedRef,
  attackerItemsTouchedRef,
  defenderItemsTouchedRef,
}: {
  enabled?: boolean
  catalog: MatchupCatalog
  trackState: TrackState
  catalogTransitionPending: boolean
  movesTouchedRef: RefObject<boolean>
  attackerAbilitiesTouchedRef: RefObject<boolean>
  defenderAbilitiesTouchedRef: RefObject<boolean>
  attackerItemsTouchedRef: RefObject<boolean>
  defenderItemsTouchedRef: RefObject<boolean>
}) {
  const pendingScenarioSnapshotRef = useRef<ScenarioSnapshotInput | null>(null)

  useEffect(() => {
    if (!enabled || catalogTransitionPending) return
    const untouchedDefaultsPending =
      (catalog.defaultMovePickStatus === "loading" && !movesTouchedRef.current) ||
      (catalog.defaultAbilityPickStatus === "loading" &&
        (!attackerAbilitiesTouchedRef.current ||
          !defenderAbilitiesTouchedRef.current)) ||
      (catalog.defaultItemPickStatus === "loading" &&
        (!attackerItemsTouchedRef.current || !defenderItemsTouchedRef.current))
    if (untouchedDefaultsPending) return
    const snapshot: ScenarioSnapshotInput = {
      attackerId: catalog.matchup.attackerId,
      defenderId: catalog.matchup.defenderId,
      moveCategory: catalog.moveCategory,
      trackState,
    }
    pendingScenarioSnapshotRef.current = snapshot
    const id = window.setTimeout(() => {
      saveScenarioSnapshot(snapshot)
      if (pendingScenarioSnapshotRef.current === snapshot) {
        pendingScenarioSnapshotRef.current = null
      }
    }, SCENARIO_SAVE_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [
    catalog.matchup.attackerId,
    catalog.matchup.defenderId,
    catalog.moveCategory,
    catalog.defaultAbilityPickStatus,
    catalog.defaultMovePickStatus,
    catalog.defaultItemPickStatus,
    catalogTransitionPending,
    trackState,
    movesTouchedRef,
    attackerAbilitiesTouchedRef,
    defenderAbilitiesTouchedRef,
    attackerItemsTouchedRef,
    defenderItemsTouchedRef,
    enabled,
  ])

  useEffect(() => {
    function flushPendingScenario() {
      const snapshot = pendingScenarioSnapshotRef.current
      if (!snapshot) return
      saveScenarioSnapshot(snapshot)
      pendingScenarioSnapshotRef.current = null
    }
    window.addEventListener("pagehide", flushPendingScenario)
    return () => window.removeEventListener("pagehide", flushPendingScenario)
  }, [])
}
