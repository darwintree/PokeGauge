/** PROTOTYPE — shared state for layout variants (#5) */

import { useMemo, useState } from "react"
import {
  ATTACKER_STAT_BOUNDS,
  DEFAULT_ATTACKER_ITEM_IDS,
  DEFAULT_ATTACKER_STAT_IDS,
  DEFAULT_DEFENDER_IDS,
  DEFAULT_MOVE_IDS,
  DEFAULT_STAT_SELECT_MODE,
  defaultStatRange,
  filterResults,
  type StatSelectMode,
} from "./mock-data"

export function useScenarioState() {
  const [moveIds, setMoveIds] = useState(DEFAULT_MOVE_IDS)
  const [statMode, setStatMode] = useState<StatSelectMode>(DEFAULT_STAT_SELECT_MODE)
  const [attackerStatIds, setAttackerStatIds] = useState(DEFAULT_ATTACKER_STAT_IDS)
  const [statRange, setStatRange] = useState(defaultStatRange)
  const [attackerItemIds, setAttackerItemIds] = useState(DEFAULT_ATTACKER_ITEM_IDS)
  const [defenderIds, setDefenderIds] = useState(DEFAULT_DEFENDER_IDS)

  const results = useMemo(
    () =>
      filterResults(
        moveIds,
        statMode,
        attackerStatIds,
        attackerItemIds,
        defenderIds,
        statRange,
      ),
    [moveIds, statMode, attackerStatIds, attackerItemIds, defenderIds, statRange],
  )

  const selectionSummary = {
    moves: moveIds.length,
    stats:
      statMode === "preset"
        ? `${attackerStatIds.length} 预设`
        : `数轴 ${statRange.min}–${statRange.max}`,
    items: attackerItemIds.length,
    defenders: defenderIds.length,
    rows: results.length,
  }

  return {
    moveIds,
    setMoveIds,
    statMode,
    setStatMode,
    attackerStatIds,
    setAttackerStatIds,
    statRange,
    setStatRange,
    attackerItemIds,
    setAttackerItemIds,
    defenderIds,
    setDefenderIds,
    results,
    showMoveOnRow: moveIds.length > 1,
    selectionSummary,
    statBounds: ATTACKER_STAT_BOUNDS,
  }
}

export type ScenarioState = ReturnType<typeof useScenarioState>
