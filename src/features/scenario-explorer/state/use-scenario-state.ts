import { useCallback, useEffect, useMemo, useState } from "react"

import {
  getDefenderDefBounds,
  getDefenderHpBounds,
  getOffenseStatBounds,
  warmDefenderSpreadCache,
} from "@/lib/stat-calculation"
import type { StatStage } from "@/lib/damage-calculation"
import type { MatchupCatalog } from "@/lib/catalog"
import { measureInteractionWork } from "@/devtools/interaction-performance-monitor"
import {
  createMoveSnapshot,
  editMoveSnapshot,
} from "@/lib/move"
import {
  deleteUserDefensePreset,
  deleteUserOffensePreset,
  findPresetByDefenseValues,
  findPresetByOffenseValue,
  newUserDefensePreset,
  newUserOffensePreset,
  saveUserDefensePreset,
  saveUserOffensePreset,
  loadStatNameStrategy,
  saveStatNameStrategy,
  type StatNameStrategy,
} from "@/lib/stat-preset"
import {
  defensePresetsForState,
  defaultTrackState,
  normalizeScreens,
  offensePresetsForState,
  projectAbilitySelections,
  restorePersistedTrackState,
  runScenarioPipeline,
  trackStateAfterAddDefense,
  trackStateAfterAddOffense,
  trackStateAfterDefenseMode,
  trackStateAfterDefenseRanges,
  trackStateAfterOffenseMode,
  trackStateAfterOffenseRange,
  trackStateAfterPersistDefense,
  trackStateAfterPersistOffense,
  trackStateAfterRemoveDefense,
  trackStateAfterRemoveOffense,
  trackStateAfterToggleDefense,
  trackStateAfterToggleOffense,
  type DefenderStatRanges,
  type PersistedTrackState,
  type StatSelectMode,
  type TrackState,
} from "@/lib/scenario"

import { useCatalogTransitionSync } from "./use-catalog-transition-sync"
import { useScenarioSnapshotPersistence } from "./use-scenario-snapshot-persistence"

function cycleAllocationIndex(
  indices: Record<string, number>,
  id: string,
): Record<string, number> {
  return { ...indices, [id]: (indices[id] ?? 0) + 1 }
}

function appendHeldItemId(
  poolIds: TrackState["attackerItemPoolIds"],
  selectedIds: TrackState["attackerItemIds"],
  id: TrackState["attackerItemIds"][number],
): {
  poolIds: TrackState["attackerItemPoolIds"]
  selectedIds: TrackState["attackerItemIds"]
} {
  const nextPool = poolIds.includes(id) ? poolIds : [...poolIds, id]
  const nextSelected = selectedIds.includes(id) ? selectedIds : [...selectedIds, id]
  return {
    poolIds: nextPool,
    selectedIds: nextSelected.length > 0 ? nextSelected : ["none"],
  }
}

export function useScenarioState(
  catalog: MatchupCatalog,
  restoredTrackState?: TrackState,
) {
  const { attackerCalcName, defenderCalcName } = catalog.matchup
  const restored = restoredTrackState !== undefined

  const offenseBounds = useMemo(
    () => getOffenseStatBounds(attackerCalcName, catalog.moveCategory),
    [attackerCalcName, catalog.moveCategory],
  )

  const defenderHpBounds = useMemo(
    () => getDefenderHpBounds(defenderCalcName),
    [defenderCalcName],
  )

  const defenderDefBounds = useMemo(
    () => getDefenderDefBounds(defenderCalcName, catalog.moveCategory),
    [defenderCalcName, catalog.moveCategory],
  )

  const [trackState, setTrackState] = useState<TrackState>(
    () =>
      restoredTrackState
        ? restorePersistedTrackState(restoredTrackState as PersistedTrackState, catalog)
        : defaultTrackState(catalog),
  )
  const [userOffenseVersion, setUserOffenseVersion] = useState(0)
  const [userDefenseVersion, setUserDefenseVersion] = useState(0)
  const [addingOffense, setAddingOffense] = useState(false)
  const [addingDefense, setAddingDefense] = useState(false)
  const [statNameStrategy, setStatNameStrategyState] = useState<StatNameStrategy>(loadStatNameStrategy)

  const {
    catalogTransitionPending,
    movesTouchedRef,
    attackerAbilitiesTouchedRef,
    defenderAbilitiesTouchedRef,
    attackerItemsTouchedRef,
    defenderItemsTouchedRef,
  } = useCatalogTransitionSync(
    catalog,
    restored,
    setTrackState,
    setAddingOffense,
    setAddingDefense,
  )

  useScenarioSnapshotPersistence({
    catalog,
    trackState,
    catalogTransitionPending,
    movesTouchedRef,
    attackerAbilitiesTouchedRef,
    defenderAbilitiesTouchedRef,
    attackerItemsTouchedRef,
    defenderItemsTouchedRef,
  })

  const setStatNameStrategy = useCallback((strategy: StatNameStrategy) => {
    saveStatNameStrategy(strategy)
    setStatNameStrategyState(strategy)
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => {
      warmDefenderSpreadCache(defenderCalcName, catalog.moveCategory)
    }, 0)
    return () => window.clearTimeout(id)
  }, [defenderCalcName, catalog.moveCategory])

  const offensePresets = useMemo(() => {
    void userOffenseVersion
    return offensePresetsForState(catalog, trackState)
  }, [catalog, trackState, userOffenseVersion])

  const defensePresets = useMemo(() => {
    void userDefenseVersion
    return defensePresetsForState(catalog, trackState)
  }, [catalog, trackState, userDefenseVersion])

  const pipelineResult = useMemo(
    () =>
      catalogTransitionPending
        ? { rows: [], unavailable: [] }
        : measureInteractionWork("runScenarioPipeline", () =>
            runScenarioPipeline(catalog, trackState),
          ),
    [catalog, catalogTransitionPending, trackState],
  )
  const { rows, unavailable } = pipelineResult

  function setStatMode(mode: StatSelectMode) {
    setTrackState((s) =>
      trackStateAfterOffenseMode(s, mode, offensePresetsForState(catalog, s)),
    )
  }

  function setDefenderMode(mode: StatSelectMode) {
    setTrackState((s) =>
      trackStateAfterDefenseMode(s, mode, defensePresetsForState(catalog, s)),
    )
  }

  const toggleOffensePreset = useCallback((id: string) => {
    setTrackState((s) =>
      trackStateAfterToggleOffense(s, id, offensePresetsForState(catalog, s)),
    )
  }, [catalog])

  const toggleDefensePreset = useCallback((id: string) => {
    setTrackState((s) =>
      trackStateAfterToggleDefense(s, id, defensePresetsForState(catalog, s)),
    )
  }, [catalog])

  function cycleOffenseAllocation(id: string) {
    setTrackState((s) => ({
      ...s,
      offenseAllocationIndices: cycleAllocationIndex(s.offenseAllocationIndices, id),
    }))
  }

  function cycleDefenseAllocation(id: string) {
    setTrackState((s) => ({
      ...s,
      defenseAllocationIndices: cycleAllocationIndex(s.defenseAllocationIndices, id),
    }))
  }

  function persistOffensePreset(id: string) {
    const preset = offensePresets.find((t) => t.id === id)
    if (!preset || preset.kind !== "temporary") return
    const user = newUserOffensePreset(
      preset.values.kind === "offense" ? preset.values.stat : 0,
    )
    saveUserOffensePreset(String(catalog.matchup.attackerId), user)
    setTrackState((s) => trackStateAfterPersistOffense(s, id, user))
    setUserOffenseVersion((v) => v + 1)
  }

  function persistDefensePreset(id: string) {
    const preset = defensePresets.find((t) => t.id === id)
    if (!preset || preset.kind !== "temporary") return
    const v = preset.values.kind === "defense" ? preset.values : { hp: 0, def: 0 }
    const user = newUserDefensePreset(v.hp, v.def)
    saveUserDefensePreset(String(catalog.matchup.defenderId), user)
    setTrackState((s) => trackStateAfterPersistDefense(s, id, user))
    setUserDefenseVersion((v) => v + 1)
  }

  function deleteOffensePreset(id: string) {
    const next = trackStateAfterRemoveOffense(
      trackState,
      id,
      offensePresetsForState(catalog, trackState),
    )
    if (!next) return
    deleteUserOffensePreset(String(catalog.matchup.attackerId), id)
    setTrackState(next)
    setUserOffenseVersion((v) => v + 1)
  }

  function deleteDefensePreset(id: string) {
    const next = trackStateAfterRemoveDefense(
      trackState,
      id,
      defensePresetsForState(catalog, trackState),
    )
    if (!next) return
    deleteUserDefensePreset(String(catalog.matchup.defenderId), id)
    setTrackState(next)
    setUserDefenseVersion((v) => v + 1)
  }

  function confirmAddOffense(stat: number) {
    const existing = findPresetByOffenseValue(offensePresets, stat)
    if (existing) {
      setTrackState((s) =>
        trackStateAfterAddOffense(s, existing, offensePresetsForState(catalog, s)),
      )
      setAddingOffense(false)
      return
    }
    const user = newUserOffensePreset(stat)
    saveUserOffensePreset(String(catalog.matchup.attackerId), user)
    setTrackState((s) =>
      trackStateAfterAddOffense(s, user, offensePresetsForState(catalog, s)),
    )
    setUserOffenseVersion((v) => v + 1)
    setAddingOffense(false)
  }

  function confirmAddDefense(hp: number, def: number) {
    const existing = findPresetByDefenseValues(defensePresets, hp, def)
    if (existing) {
      setTrackState((s) =>
        trackStateAfterAddDefense(s, existing, defensePresetsForState(catalog, s)),
      )
      setAddingDefense(false)
      return
    }
    const user = newUserDefensePreset(hp, def)
    saveUserDefensePreset(String(catalog.matchup.defenderId), user)
    setTrackState((s) =>
      trackStateAfterAddDefense(s, user, defensePresetsForState(catalog, s)),
    )
    setUserDefenseVersion((v) => v + 1)
    setAddingDefense(false)
  }

  function addMoveSnapshot(moveId: number) {
    const move = catalog.moves.find((candidate) => candidate.id === moveId)
    if (!move) return
    movesTouchedRef.current = true
    const snapshot = createMoveSnapshot(move)
    setTrackState((s) => ({
      ...s,
      moveSnapshots: [...s.moveSnapshots, snapshot],
      selectedMoveSnapshotIds: [...s.selectedMoveSnapshotIds, snapshot.id],
    }))
    return snapshot.id
  }

  function updateMoveSnapshot(
    snapshotId: string,
    patch: Parameters<typeof editMoveSnapshot>[1],
  ) {
    movesTouchedRef.current = true
    setTrackState((s) => ({
      ...s,
      moveSnapshots: s.moveSnapshots.map((snapshot) =>
        snapshot.id === snapshotId ? editMoveSnapshot(snapshot, patch) : snapshot,
      ),
    }))
  }

  function removeMoveSnapshot(snapshotId: string) {
    movesTouchedRef.current = true
    setTrackState((s) => ({
      ...s,
      moveSnapshots: s.moveSnapshots.filter((snapshot) => snapshot.id !== snapshotId),
      selectedMoveSnapshotIds: s.selectedMoveSnapshotIds.filter((id) => id !== snapshotId),
    }))
  }

  function setSelectedMoveSnapshotIds(ids: string[]) {
    movesTouchedRef.current = true
    const selected = new Set(ids)
    setTrackState((s) => ({
      ...s,
      selectedMoveSnapshotIds: s.moveSnapshots
        .map((snapshot) => snapshot.id)
        .filter((id) => selected.has(id)),
    }))
  }

  return {
    trackState,
    rows,
    unavailable,
    offensePresets,
    defensePresets,
    offenseBounds,
    defenderHpBounds,
    defenderDefBounds,
    addingOffense,
    addingDefense,
    addMoveSnapshot,
    updateMoveSnapshot,
    removeMoveSnapshot,
    setSelectedMoveSnapshotIds,
    setStatMode,
    toggleOffensePreset,
    setStatRange: (statRange: TrackState["statRange"]) =>
      setTrackState((s) =>
        trackStateAfterOffenseRange(s, statRange, offensePresetsForState(catalog, s)),
      ),
    setShowOffenseStatValue: (showOffenseStatValue: boolean) =>
      setTrackState((s) => ({ ...s, showOffenseStatValue })),
    cycleOffenseAllocation,
    persistOffensePreset,
    deleteOffensePreset,
    confirmAddOffense,
    setAddingOffense,
    setAttackerItemIds: (ids: TrackState["attackerItemIds"]) => {
      if (catalog.attackerLockedItemId !== null) return
      attackerItemsTouchedRef.current = true
      setTrackState((s) => ({
        ...s,
        attackerItemIds: ids.length > 0 ? ids : ["none"],
      }))
    },
    setDefenderItemIds: (ids: TrackState["defenderItemIds"]) => {
      if (catalog.defenderLockedItemId !== null) return
      defenderItemsTouchedRef.current = true
      setTrackState((s) => ({
        ...s,
        defenderItemIds: ids.length > 0 ? ids : ["none"],
      }))
    },
    addAttackerItem: (id: TrackState["attackerItemIds"][number]) => {
      if (catalog.attackerLockedItemId !== null || id === "none") return
      attackerItemsTouchedRef.current = true
      setTrackState((s) => {
        const next = appendHeldItemId(s.attackerItemPoolIds, s.attackerItemIds, id)
        return {
          ...s,
          attackerItemPoolIds: next.poolIds,
          attackerItemIds: next.selectedIds,
        }
      })
    },
    addDefenderItem: (id: TrackState["defenderItemIds"][number]) => {
      if (catalog.defenderLockedItemId !== null || id === "none") return
      defenderItemsTouchedRef.current = true
      setTrackState((s) => {
        const next = appendHeldItemId(s.defenderItemPoolIds, s.defenderItemIds, id)
        return {
          ...s,
          defenderItemPoolIds: next.poolIds,
          defenderItemIds: next.selectedIds,
        }
      })
    },
    setAttackerAbilityIds: (ids: number[]) => {
      if (ids.length === 0) return
      attackerAbilitiesTouchedRef.current = true
      setTrackState((s) => projectAbilitySelections(
        { ...s, attackerAbilityIds: ids },
        catalog.moveCategory,
        ids.filter((id) => !s.attackerAbilityIds.includes(id)),
        [],
      ))
    },
    resetAttackerAbilities: () => {
      attackerAbilitiesTouchedRef.current = false
      setTrackState((s) => {
        const next = {
          ...s,
          attackerAbilityIds: [...catalog.defaultAttackerAbilityIds],
        }
        return catalog.defaultAbilityPickStatus === "ready"
          ? projectAbilitySelections(next, catalog.moveCategory)
          : next
      })
    },
    setWeathers: (weathers: TrackState["weathers"]) =>
      setTrackState((s) => ({
        ...s,
        weathers: weathers.length > 0 ? weathers : ["none"],
      })),
    setTerrains: (terrains: TrackState["terrains"]) =>
      setTrackState((s) => ({
        ...s,
        terrains: terrains.length > 0 ? terrains : ["none"],
      })),
    setScreens: (screens: TrackState["screens"]) =>
      setTrackState((s) => ({
        ...s,
        screens: normalizeScreens(screens),
      })),
    setAttackerStages: (attackerStages: StatStage[]) =>
      setTrackState((s) => ({
        ...s,
        attackerStages: attackerStages.length > 0 ? attackerStages : [0],
      })),
    setDefenderMode,
    toggleDefensePreset,
    setDefenderRanges: (defenderRanges: DefenderStatRanges) =>
      setTrackState((s) =>
        trackStateAfterDefenseRanges(s, defenderRanges, defensePresetsForState(catalog, s)),
      ),
    setShowDefenseStatValue: (showDefenseStatValue: boolean) =>
      setTrackState((s) => ({ ...s, showDefenseStatValue })),
    setShowResultStatValue: (showResultStatValue: boolean) =>
      setTrackState((s) => ({ ...s, showResultStatValue })),
    setDefenderStages: (defenderStages: StatStage[]) =>
      setTrackState((s) => ({
        ...s,
        defenderStages: defenderStages.length > 0 ? defenderStages : [0],
      })),
    setDefenderAbilityIds: (ids: number[]) => {
      if (ids.length === 0) return
      defenderAbilitiesTouchedRef.current = true
      setTrackState((s) => projectAbilitySelections(
        { ...s, defenderAbilityIds: ids },
        catalog.moveCategory,
        [],
        ids.filter((id) => !s.defenderAbilityIds.includes(id)),
      ))
    },
    resetDefenderAbilities: () => {
      defenderAbilitiesTouchedRef.current = false
      setTrackState((s) => {
        const next = {
          ...s,
          defenderAbilityIds: [...catalog.defaultDefenderAbilityIds],
        }
        return catalog.defaultAbilityPickStatus === "ready"
          ? projectAbilitySelections(next, catalog.moveCategory)
          : next
      })
    },
    setProbabilityMode: (probabilityMode: TrackState["probabilityMode"]) =>
      setTrackState((s) => ({ ...s, probabilityMode })),
    cycleDefenseAllocation,
    persistDefensePreset,
    deleteDefensePreset,
    confirmAddDefense,
    setAddingDefense,
    statNameStrategy,
    setStatNameStrategy,
  }
}

export type ScenarioState = ReturnType<typeof useScenarioState>
