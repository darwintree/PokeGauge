import {
  defaultDefenderDefRange,
  defaultDefenderHpRange,
  defaultOffenseStatRange,
} from "@/lib/stat-calculation"
import type { MatchupCatalog } from "@/lib/catalog"
import { createMoveSnapshot } from "@/lib/move"
import {
  buildSystemDefensePresets,
  buildSystemOffensePresets,
  defaultDefensePresetSelection,
  defaultOffensePresetSelection,
  loadUserDefensePresets,
  loadUserOffensePresets,
  mergeStatPresets,
  type StatPreset,
} from "@/lib/stat-preset"

import type { TrackState } from "./types"

export function offensePresetsForState(
  catalog: MatchupCatalog,
  trackState: TrackState,
): StatPreset[] {
  const { attackerCalcName } = catalog.matchup
  const system = buildSystemOffensePresets(attackerCalcName, catalog.moveCategory)
  const user = loadUserOffensePresets(String(catalog.matchup.attackerId))
  return mergeStatPresets(system, user, trackState.offenseTemporaryPresets)
}

export function defensePresetsForState(
  catalog: MatchupCatalog,
  trackState: TrackState,
): StatPreset[] {
  const { defenderCalcName } = catalog.matchup
  const system = buildSystemDefensePresets(defenderCalcName, catalog.moveCategory)
  const user = loadUserDefensePresets(String(catalog.matchup.defenderId))
  return mergeStatPresets(system, user, trackState.defenseTemporaryPresets)
}

export function defaultTrackState(catalog: MatchupCatalog): TrackState {
  const { attackerCalcName, defenderCalcName } = catalog.matchup
  const offenseSystem = buildSystemOffensePresets(attackerCalcName, catalog.moveCategory)
  const defenseSystem = buildSystemDefensePresets(defenderCalcName, catalog.moveCategory)
  const offenseUser = loadUserOffensePresets(String(catalog.matchup.attackerId))
  const defenseUser = loadUserDefensePresets(String(catalog.matchup.defenderId))
  const moveSnapshots = catalog.defaultMovePoolIds.flatMap((moveId) => {
    const move = catalog.moves.find((candidate) => candidate.id === moveId)
    return move ? [createMoveSnapshot(move)] : []
  })

  return {
    moveSnapshots,
    selectedMoveSnapshotIds: moveSnapshots
      .filter((snapshot) => catalog.defaultMoveIds.includes(snapshot.moveId))
      .map((snapshot) => snapshot.id),
    statMode: "preset",
    offensePresetIds: defaultOffensePresetSelection(offenseSystem, offenseUser),
    offenseTemporaryPresets: [],
    statRange: defaultOffenseStatRange(attackerCalcName, catalog.moveCategory),
    statRangeTouched: false,
    showOffenseStatValue: false,
    offenseAllocationIndices: {},
    attackerStages: [0],
    attackerItemPoolIds: [...catalog.defaultAttackerItemPoolIds],
    defenderItemPoolIds: [...catalog.defaultDefenderItemPoolIds],
    attackerItemIds: [...catalog.defaultAttackerItemIds],
    defenderItemIds: [...catalog.defaultDefenderItemIds],
    attackerAbilityIds: [...catalog.defaultAttackerAbilityIds],
    weathers: ["none"],
    terrains: ["none"],
    defenderMode: "preset",
    defensePresetIds: defaultDefensePresetSelection(defenseSystem, defenseUser),
    defenseTemporaryPresets: [],
    defenderRanges: {
      hp: defaultDefenderHpRange(defenderCalcName),
      def: defaultDefenderDefRange(defenderCalcName, catalog.moveCategory),
    },
    defenderRangeTouched: false,
    showDefenseStatValue: false,
    showResultStatValue: false,
    defenseAllocationIndices: {},
    defenderStages: [0],
    defenderAbilityIds: [...catalog.defaultDefenderAbilityIds],
    screens: ["none"],
    probabilityMode: "classic",
  }
}

export function expectedRowCount(trackState: TrackState): number {
  const offenseCount = trackState.statMode === "range" ? 1 : trackState.offensePresetIds.length
  const defenderCount = trackState.defenderMode === "range" ? 1 : trackState.defensePresetIds.length
  return (
    trackState.selectedMoveSnapshotIds.length *
    offenseCount *
    trackState.attackerStages.length *
    trackState.attackerItemIds.length *
    trackState.defenderItemIds.length *
    trackState.attackerAbilityIds.length *
    trackState.weathers.length *
    trackState.terrains.length *
    defenderCount *
    trackState.defenderStages.length *
    trackState.defenderAbilityIds.length *
    trackState.screens.length
  )
}
