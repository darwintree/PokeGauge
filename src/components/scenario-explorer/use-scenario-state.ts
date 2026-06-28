import { useEffect, useMemo, useState } from "react"

import type { StatRange } from "@/lib/calc-adapter"
import type { MatchupCatalog } from "@/lib/catalog"
import {
  defenderDefRangeFromPresets,
  defenderHpRangeFromPresets,
  getDefenderDefBounds,
  getDefenderHpBounds,
  getOffenseStatBounds,
  offenseRangeFromPresets,
  warmDefenderSpreadCache,
} from "@/lib/calc-adapter"
import {
  defaultTrackState,
  expectedRowCount,
  runScenarioPipeline,
  type DefenderStatRanges,
  type StatSelectMode,
  type TrackState,
} from "@/lib/scenario-pipeline"

export function useScenarioState(catalog: MatchupCatalog) {
  const { attackerSpecies, defenderSpecies } = catalog.matchup

  const offenseBounds = useMemo(
    () => getOffenseStatBounds(attackerSpecies, catalog.moveCategory),
    [attackerSpecies, catalog.moveCategory],
  )

  const defenderHpBounds = useMemo(
    () => getDefenderHpBounds(defenderSpecies),
    [defenderSpecies],
  )

  const defenderDefBounds = useMemo(
    () => getDefenderDefBounds(defenderSpecies, catalog.moveCategory),
    [defenderSpecies, catalog.moveCategory],
  )

  const [trackState, setTrackState] = useState<TrackState>(() =>
    defaultTrackState(catalog),
  )

  useEffect(() => {
    setTrackState(defaultTrackState(catalog))
  }, [catalog])

  useEffect(() => {
    const id = window.setTimeout(() => {
      warmDefenderSpreadCache(defenderSpecies, catalog.moveCategory)
    }, 0)
    return () => window.clearTimeout(id)
  }, [defenderSpecies, catalog.moveCategory])

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
    defenders:
      trackState.defenderMode === "preset"
        ? `${trackState.defenderIds.length} 预设`
        : `数轴 HP ${trackState.defenderRanges.hp.min}–${trackState.defenderRanges.hp.max}`,
    rows: expectedRowCount(trackState),
  }

  function setStatMode(mode: StatSelectMode) {
    setTrackState((s) => {
      if (mode !== "range" || s.statRangeTouched) {
        return { ...s, statMode: mode }
      }
      return {
        ...s,
        statMode: mode,
        statRange: offenseRangeFromPresets(
          attackerSpecies,
          catalog.moveCategory,
          s.attackerStatIds,
        ),
      }
    })
  }

  function setDefenderMode(mode: StatSelectMode) {
    setTrackState((s) => {
      if (mode !== "range" || s.defenderRangeTouched) {
        return { ...s, defenderMode: mode }
      }
      return {
        ...s,
        defenderMode: mode,
        defenderRanges: {
          hp: defenderHpRangeFromPresets(
            defenderSpecies,
            catalog.moveCategory,
            s.defenderIds,
          ),
          def: defenderDefRangeFromPresets(
            defenderSpecies,
            catalog.moveCategory,
            s.defenderIds,
          ),
        },
      }
    })
  }

  return {
    trackState,
    rows,
    showMoveOnRow: trackState.moveIds.length > 1,
    selectionSummary,
    offenseBounds,
    defenderHpBounds,
    defenderDefBounds,
    setMoveIds: (ids: string[]) => setTrackState((s) => ({ ...s, moveIds: ids })),
    setStatMode,
    setAttackerStatIds: (ids: string[]) =>
      setTrackState((s) => ({ ...s, attackerStatIds: ids })),
    setStatRange: (statRange: StatRange) =>
      setTrackState((s) => ({ ...s, statRange, statRangeTouched: true })),
    setAttackerItemIds: (ids: string[]) =>
      setTrackState((s) => ({ ...s, attackerItemIds: ids })),
    setDefenderMode,
    setDefenderIds: (ids: string[]) =>
      setTrackState((s) => ({ ...s, defenderIds: ids })),
    setDefenderRanges: (defenderRanges: DefenderStatRanges) =>
      setTrackState((s) => ({
        ...s,
        defenderRanges,
        defenderRangeTouched: true,
      })),
  }
}

export type ScenarioState = ReturnType<typeof useScenarioState>
