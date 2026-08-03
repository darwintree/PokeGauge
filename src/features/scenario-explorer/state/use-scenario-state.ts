import { useCallback, useEffect, useMemo, useRef, useState } from "react"

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
  selectedSnapshotMoveIds,
  snapshotMoveIds,
  snapshotsForMoveIds,
  trackStateAfterCatalogTransition,
  type DefenderStatRanges,
  type StatSelectMode,
  type TrackState,
} from "@/lib/scenario"
import {
  saveScenarioSnapshot,
  type ScenarioSnapshotInput,
} from "@/lib/scenario"

const SCENARIO_SAVE_DELAY_MS = 150

function sameIds(a: readonly number[], b: readonly number[]): boolean {
  return a.length === b.length && a.every((id, index) => id === b[index])
}

function cycleAllocationIndex(
  indices: Record<string, number>,
  id: string,
): Record<string, number> {
  return { ...indices, [id]: (indices[id] ?? 0) + 1 }
}


export function useScenarioState(
  catalog: MatchupCatalog,
  restoredTrackState?: TrackState,
) {
  const { attackerCalcName, defenderCalcName } = catalog.matchup
  const restoredTrackStateRef = useRef(restoredTrackState)

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
    () => restoredTrackStateRef.current ?? defaultTrackState(catalog),
  )
  const [userOffenseVersion, setUserOffenseVersion] = useState(0)
  const [userDefenseVersion, setUserDefenseVersion] = useState(0)
  const [addingOffense, setAddingOffense] = useState(false)
  const [addingDefense, setAddingDefense] = useState(false)
  const [statNameStrategy, setStatNameStrategyState] = useState<StatNameStrategy>(loadStatNameStrategy)
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
  const movesTouchedRef = useRef(restoredTrackStateRef.current !== undefined)
  const attackerAbilitiesTouchedRef = useRef(restoredTrackStateRef.current !== undefined)
  const defenderAbilitiesTouchedRef = useRef(restoredTrackStateRef.current !== undefined)
  const pendingScenarioSnapshotRef = useRef<ScenarioSnapshotInput | null>(null)
  const catalogTransitionPending =
    attackerKeyRef.current !==
      `${catalog.matchup.attackerId}:${catalog.moveCategory}` ||
    defenderIdRef.current !== catalog.matchup.defenderId

  const setStatNameStrategy = useCallback((strategy: StatNameStrategy) => {
    saveStatNameStrategy(strategy)
    setStatNameStrategyState(strategy)
  }, [])

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
  }, [catalog])

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
  }, [catalog, catalog.defaultMovePoolIds, catalog.defaultMoveIds])

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
  }, [catalog, catalog.defaultAttackerAbilityIds, catalog.defaultDefenderAbilityIds])

  useEffect(() => {
    const id = window.setTimeout(() => {
      warmDefenderSpreadCache(defenderCalcName, catalog.moveCategory)
    }, 0)
    return () => window.clearTimeout(id)
  }, [defenderCalcName, catalog.moveCategory])

  useEffect(() => {
    if (catalogTransitionPending) return
    const untouchedDefaultsPending =
      (catalog.defaultMovePickStatus === "loading" && !movesTouchedRef.current) ||
      (catalog.defaultAbilityPickStatus === "loading" &&
        (!attackerAbilitiesTouchedRef.current ||
          !defenderAbilitiesTouchedRef.current))
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
    catalogTransitionPending,
    trackState,
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

  const selectionSummary = {
    moves: trackState.selectedMoveSnapshotIds.length,
    stats:
      trackState.statMode === "preset"
        ? `${trackState.offensePresetIds.length} 预设`
        : `数轴 ${trackState.statRange.min}-${trackState.statRange.max}`,
    items: trackState.attackerItemIds.length,
    defenders:
      trackState.defenderMode === "preset"
        ? `${trackState.defensePresetIds.length} 预设`
        : `数轴 HP ${trackState.defenderRanges.hp.min}-${trackState.defenderRanges.hp.max}`,
    rows: rows.length,
  }

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
    selectionSummary,
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
    setAttackerItemIds: (ids: TrackState["attackerItemIds"]) =>
      catalog.attackerLockedItemId === null &&
      setTrackState((s) => ({ ...s, attackerItemIds: ids.length > 0 ? ids : ["none"] })),
    setDefenderItemIds: (ids: TrackState["defenderItemIds"]) =>
      catalog.defenderLockedItemId === null &&
      setTrackState((s) => ({ ...s, defenderItemIds: ids.length > 0 ? ids : ["none"] })),
    setAttackerAbilityIds: (ids: number[]) => {
      if (ids.length === 0 || catalog.attackerLockedAbilityId !== null) return
      attackerAbilitiesTouchedRef.current = true
      setTrackState((s) => ({ ...s, attackerAbilityIds: ids }))
    },
    resetAttackerAbilities: () => {
      if (catalog.attackerLockedAbilityId !== null) return
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
      if (ids.length === 0 || catalog.defenderLockedAbilityId !== null) return
      defenderAbilitiesTouchedRef.current = true
      setTrackState((s) => ({ ...s, defenderAbilityIds: ids }))
    },
    resetDefenderAbilities: () => {
      if (catalog.defenderLockedAbilityId !== null) return
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
