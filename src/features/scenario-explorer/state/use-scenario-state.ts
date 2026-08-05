import { useCallback, useEffect, useMemo, useState } from "react"

import {
  defaultDefenderDefRange,
  defaultDefenderHpRange,
  defaultOffenseStatRange,
  defenderDefRangeFromPresets,
  defenderHpRangeFromPresets,
  getDefenderDefBounds,
  getDefenderHpBounds,
  getOffenseStatBounds,
  offenseRangeFromPresets,
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
  reconcileDefenseFromRange,
  reconcileOffenseFromRange,
  runScenarioPipeline,
  type DefenderStatRanges,
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
    () => restoredTrackState ?? defaultTrackState(catalog),
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
    setTrackState((s) => {
      if (mode === "range") {
        if (s.statRangeTouched) return { ...s, statMode: mode }
        const presets = offensePresetsForState(catalog, s)
        return {
          ...s,
          statMode: mode,
          statRange: offenseRangeFromPresets(presets, s.offensePresetIds, () =>
            defaultOffenseStatRange(attackerCalcName, catalog.moveCategory),
          ),
        }
      }

      const { selectedIds, temporary } = reconcileOffenseFromRange(
        offensePresetsForState(catalog, s),
        s.statRange,
        s.offenseTemporaryPresets,
      )
      return {
        ...s,
        statMode: mode,
        offensePresetIds: selectedIds,
        offenseTemporaryPresets: temporary,
      }
    })
  }

  function setDefenderMode(mode: StatSelectMode) {
    setTrackState((s) => {
      if (mode === "range") {
        if (s.defenderRangeTouched) return { ...s, defenderMode: mode }
        const presets = defensePresetsForState(catalog, s)
        return {
          ...s,
          defenderMode: mode,
          defenderRanges: {
            hp: defenderHpRangeFromPresets(presets, s.defensePresetIds, () =>
              defaultDefenderHpRange(defenderCalcName),
            ),
            def: defenderDefRangeFromPresets(presets, s.defensePresetIds, () =>
              defaultDefenderDefRange(defenderCalcName, catalog.moveCategory),
            ),
          },
        }
      }

      const { selectedIds, temporary } = reconcileDefenseFromRange(
        defensePresetsForState(catalog, s),
        s.defenderRanges,
        s.defenseTemporaryPresets,
      )
      return {
        ...s,
        defenderMode: mode,
        defensePresetIds: selectedIds,
        defenseTemporaryPresets: temporary,
      }
    })
  }

  const toggleOffensePreset = useCallback((id: string) => {
    setTrackState((s) => {
      const selected = new Set(s.offensePresetIds)
      if (selected.has(id)) selected.delete(id)
      else selected.add(id)
      const offensePresetIds = offensePresets
        .filter((t) => selected.has(t.id))
        .map((t) => t.id)
      return { ...s, offensePresetIds }
    })
  }, [offensePresets])

  const toggleDefensePreset = useCallback((id: string) => {
    setTrackState((s) => {
      const selected = new Set(s.defensePresetIds)
      if (selected.has(id)) selected.delete(id)
      else selected.add(id)
      const defensePresetIds = defensePresets
        .filter((t) => selected.has(t.id))
        .map((t) => t.id)
      return { ...s, defensePresetIds }
    })
  }, [defensePresets])

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
    setTrackState((s) => ({
      ...s,
      offenseTemporaryPresets: s.offenseTemporaryPresets.filter((t) => t.id !== id),
      offensePresetIds: s.offensePresetIds.map((tid) => (tid === id ? user.id : tid)),
    }))
    setUserOffenseVersion((v) => v + 1)
  }

  function persistDefensePreset(id: string) {
    const preset = defensePresets.find((t) => t.id === id)
    if (!preset || preset.kind !== "temporary") return
    const v = preset.values.kind === "defense" ? preset.values : { hp: 0, def: 0 }
    const user = newUserDefensePreset(v.hp, v.def)
    saveUserDefensePreset(String(catalog.matchup.defenderId), user)
    setTrackState((s) => ({
      ...s,
      defenseTemporaryPresets: s.defenseTemporaryPresets.filter((t) => t.id !== id),
      defensePresetIds: s.defensePresetIds.map((tid) => (tid === id ? user.id : tid)),
    }))
    setUserDefenseVersion((v) => v + 1)
  }

  function deleteOffensePreset(id: string) {
    deleteUserOffensePreset(String(catalog.matchup.attackerId), id)
    setTrackState((s) => ({
      ...s,
      offensePresetIds: s.offensePresetIds.filter((tid) => tid !== id),
    }))
    setUserOffenseVersion((v) => v + 1)
  }

  function deleteDefensePreset(id: string) {
    deleteUserDefensePreset(String(catalog.matchup.defenderId), id)
    setTrackState((s) => ({
      ...s,
      defensePresetIds: s.defensePresetIds.filter((tid) => tid !== id),
    }))
    setUserDefenseVersion((v) => v + 1)
  }

  function confirmAddOffense(stat: number) {
    const user = newUserOffensePreset(stat)
    saveUserOffensePreset(String(catalog.matchup.attackerId), user)
    setTrackState((s) => ({
      ...s,
      offensePresetIds: [...s.offensePresetIds, user.id],
    }))
    setUserOffenseVersion((v) => v + 1)
    setAddingOffense(false)
  }

  function confirmAddDefense(hp: number, def: number) {
    const user = newUserDefensePreset(hp, def)
    saveUserDefensePreset(String(catalog.matchup.defenderId), user)
    setTrackState((s) => ({
      ...s,
      defensePresetIds: [...s.defensePresetIds, user.id],
    }))
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
      setTrackState((s) => ({ ...s, statRange, statRangeTouched: true })),
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
      setTrackState((s) => ({ ...s, attackerAbilityIds: ids }))
    },
    resetAttackerAbilities: () => {
      attackerAbilitiesTouchedRef.current = false
      setTrackState((s) => ({
        ...s,
        attackerAbilityIds: [...catalog.defaultAttackerAbilityIds],
      }))
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
      setTrackState((s) => ({
        ...s,
        defenderRanges,
        defenderRangeTouched: true,
      })),
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
      setTrackState((s) => ({ ...s, defenderAbilityIds: ids }))
    },
    resetDefenderAbilities: () => {
      defenderAbilitiesTouchedRef.current = false
      setTrackState((s) => ({
        ...s,
        defenderAbilityIds: [...catalog.defaultDefenderAbilityIds],
      }))
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
