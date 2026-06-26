import { useEffect, useMemo, useState } from "react"

import { getOffenseStatBounds } from "@/lib/calc-adapter"
import type { MatchupCatalog } from "@/lib/catalog"
import {
  defaultTrackState,
  expectedRowCount,
  runScenarioPipeline,
  type StatSelectMode,
  type TrackState,
} from "@/lib/scenario-pipeline"

export function useScenarioState(catalog: MatchupCatalog) {
  const statBounds = useMemo(
    () =>
      getOffenseStatBounds(
        catalog.matchup.attackerSpecies,
        catalog.moveCategory,
      ),
    [catalog.matchup.attackerSpecies, catalog.moveCategory],
  )

  const [trackState, setTrackState] = useState<TrackState>(() =>
    defaultTrackState(catalog),
  )

  useEffect(() => {
    setTrackState(defaultTrackState(catalog))
  }, [catalog])

  const rows = useMemo(
    () => runScenarioPipeline(catalog, trackState),
    [catalog, trackState],
  )

  const selectionSummary = {
    moves: trackState.moveIds.length,
    stats:
      trackState.statMode === "preset"
        ? `${trackState.attackerStatIds.length} 预设`
        : `数轴 ${trackState.statRange.min}–${trackState.statRange.max}`,
    items: trackState.attackerItemIds.length,
    defenders: trackState.defenderIds.length,
    rows: expectedRowCount(trackState),
  }

  return {
    trackState,
    rows,
    showMoveOnRow: trackState.moveIds.length > 1,
    selectionSummary,
    statBounds,
    setMoveIds: (ids: string[]) => setTrackState((s) => ({ ...s, moveIds: ids })),
    setStatMode: (mode: StatSelectMode) => setTrackState((s) => ({ ...s, statMode: mode })),
    setAttackerStatIds: (ids: string[]) =>
      setTrackState((s) => ({ ...s, attackerStatIds: ids })),
    setStatRange: (statRange: TrackState["statRange"]) =>
      setTrackState((s) => ({ ...s, statRange })),
    setAttackerItemIds: (ids: string[]) =>
      setTrackState((s) => ({ ...s, attackerItemIds: ids })),
    setDefenderIds: (ids: string[]) =>
      setTrackState((s) => ({ ...s, defenderIds: ids })),
  }
}

export type ScenarioState = ReturnType<typeof useScenarioState>
