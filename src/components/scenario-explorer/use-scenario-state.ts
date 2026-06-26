import { useMemo, useState } from "react"

import type { MatchupCatalog } from "@/lib/catalog"
import {
  defaultTrackState,
  expectedRowCount,
  runScenarioPipeline,
  type TrackState,
} from "@/lib/scenario-pipeline"

export function useScenarioState(catalog: MatchupCatalog) {
  const [trackState, setTrackState] = useState<TrackState>(() =>
    defaultTrackState(catalog),
  )

  const rows = useMemo(
    () => runScenarioPipeline(catalog, trackState),
    [catalog, trackState],
  )

  const selectionSummary = {
    moves: trackState.moveIds.length,
    stats: trackState.attackerStatIds.length,
    items: trackState.attackerItemIds.length,
    defenders: trackState.defenderIds.length,
    rows: expectedRowCount(trackState),
  }

  return {
    trackState,
    rows,
    showMoveOnRow: trackState.moveIds.length > 1,
    selectionSummary,
    setMoveIds: (ids: string[]) => setTrackState((s) => ({ ...s, moveIds: ids })),
    setAttackerStatIds: (ids: string[]) =>
      setTrackState((s) => ({ ...s, attackerStatIds: ids })),
    setAttackerItemIds: (ids: string[]) =>
      setTrackState((s) => ({ ...s, attackerItemIds: ids })),
    setDefenderIds: (ids: string[]) =>
      setTrackState((s) => ({ ...s, defenderIds: ids })),
  }
}

export type ScenarioState = ReturnType<typeof useScenarioState>
