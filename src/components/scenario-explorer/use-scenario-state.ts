import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import {
  defaultDefenderDefRange,
  defaultDefenderHpRange,
  defaultOffenseStatRange,
  defenderDefRangeFromTemplates,
  defenderHpRangeFromTemplates,
  getDefenderDefBounds,
  getDefenderHpBounds,
  getOffenseStatBounds,
  offenseRangeFromTemplates,
  type StatStage,
  warmDefenderSpreadCache,
} from "@/lib/calc-adapter"
import type { MatchupCatalog } from "@/lib/catalog"
import { measureInteractionWork } from "@/lib/interaction-performance-monitor"
import {
  createMoveSnapshot,
  editMoveSnapshot,
  type MoveSnapshot,
} from "@/lib/move-snapshot"
import {
  deleteUserDefenseTemplate,
  deleteUserOffenseTemplate,
  findTemplateByDefenseValues,
  findTemplateByOffenseValue,
  newTemporaryDefenseTemplate,
  newTemporaryOffenseTemplate,
  newUserDefenseTemplate,
  newUserOffenseTemplate,
  saveUserDefenseTemplate,
  saveUserOffenseTemplate,
  loadStatNameStrategy,
  saveStatNameStrategy,
  type StatNameStrategy,
  type StatValueTemplate,
} from "@/lib/stat-value-template"
import {
  defenseTemplatesForState,
  defaultTrackState,
  offenseTemplatesForState,
  runScenarioPipeline,
  type DefenderStatRanges,
  type StatSelectMode,
  type TrackState,
} from "@/lib/scenario-pipeline"
import {
  saveScenarioSnapshot,
  type ScenarioSnapshotInput,
} from "@/lib/scenario-storage"

const SCENARIO_SAVE_DELAY_MS = 150

function rangeEndpoints(min: number, max: number): number[] {
  return max === min ? [min] : [min, max]
}

function sameIds(a: readonly number[], b: readonly number[]): boolean {
  return a.length === b.length && a.every((id, index) => id === b[index])
}

export function normalizeScreens(screens: TrackState["screens"]): TrackState["screens"] {
  return screens.length > 0 ? screens : ["none"]
}

function itemSelectionFits(
  selectedIds: TrackState["attackerItemIds"],
  options: MatchupCatalog["attackerItems"],
): boolean {
  return selectedIds.every((id) => options.some((option) => option.id === id))
}

function snapshotsForMoveIds(
  catalog: MatchupCatalog,
  moveIds: readonly number[],
): MoveSnapshot[] {
  return moveIds.flatMap((moveId) => {
    const move = catalog.moves.find((candidate) => candidate.id === moveId)
    return move ? [createMoveSnapshot(move)] : []
  })
}

function snapshotMoveIds(snapshots: readonly MoveSnapshot[]): number[] {
  return snapshots.map((snapshot) => snapshot.moveId)
}

function selectedSnapshotMoveIds(
  snapshots: readonly MoveSnapshot[],
  selectedSnapshotIds: readonly string[],
): number[] {
  const selected = new Set(selectedSnapshotIds)
  return snapshots
    .filter((snapshot) => selected.has(snapshot.id))
    .map((snapshot) => snapshot.moveId)
}

function cycleAllocationIndex(
  indices: Record<string, number>,
  id: string,
): Record<string, number> {
  return { ...indices, [id]: (indices[id] ?? 0) + 1 }
}

function reconcileOffenseFromRange(
  allTemplates: StatValueTemplate[],
  statRange: TrackState["statRange"],
  existingTemp: StatValueTemplate[],
): { selectedIds: string[]; temporary: StatValueTemplate[] } {
  const temporary = [...existingTemp]
  const selectedIds: string[] = []

  for (const value of rangeEndpoints(statRange.min, statRange.max)) {
    let match =
      findTemplateByOffenseValue(allTemplates, value) ??
      findTemplateByOffenseValue(temporary, value)
    if (!match) {
      match = newTemporaryOffenseTemplate(value)
      temporary.push(match)
    }
    selectedIds.push(match.id)
  }

  return { selectedIds, temporary }
}

function reconcileDefenseFromRange(
  allTemplates: StatValueTemplate[],
  ranges: DefenderStatRanges,
  existingTemp: StatValueTemplate[],
): { selectedIds: string[]; temporary: StatValueTemplate[] } {
  const temporary = [...existingTemp]
  const selectedIds: string[] = []

  for (const hp of rangeEndpoints(ranges.hp.min, ranges.hp.max)) {
    for (const def of rangeEndpoints(ranges.def.min, ranges.def.max)) {
      let match =
        findTemplateByDefenseValues(allTemplates, hp, def) ??
        findTemplateByDefenseValues(temporary, hp, def)
      if (!match) {
        match = newTemporaryDefenseTemplate(hp, def)
        temporary.push(match)
      }
      if (!selectedIds.includes(match.id)) selectedIds.push(match.id)
    }
  }

  return { selectedIds, temporary }
}

export function trackStateAfterCatalogTransition(
  state: TrackState,
  catalog: MatchupCatalog,
  changes: {
    attackerOwnerChanged: boolean
    attackerChanged: boolean
    defenderChanged: boolean
  },
): TrackState {
  const { attackerOwnerChanged, attackerChanged, defenderChanged } = changes
  return {
    ...defaultTrackState(catalog),
    screens: state.screens,
    ...(attackerChanged && catalog.attackerPreservesItem &&
      itemSelectionFits(state.attackerItemIds, catalog.attackerItems) && {
      attackerItemIds: state.attackerItemIds,
    }),
    ...(defenderChanged && catalog.defenderPreservesItem &&
      itemSelectionFits(state.defenderItemIds, catalog.defenderItems) && {
      defenderItemIds: state.defenderItemIds,
    }),
    ...(!attackerChanged && {
      attackerAbilityIds: state.attackerAbilityIds,
    }),
    ...(!defenderChanged && {
      defenderAbilityIds: state.defenderAbilityIds,
    }),
    ...(!attackerOwnerChanged && {
      moveSnapshots: state.moveSnapshots,
      selectedMoveSnapshotIds: state.selectedMoveSnapshotIds,
    }),
  }
}

export function useScenarioState(
  catalog: MatchupCatalog,
  restoredTrackState?: TrackState,
) {
  const { attackerSpecies, defenderSpecies } = catalog.matchup
  const restoredTrackStateRef = useRef(restoredTrackState)

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
      warmDefenderSpreadCache(defenderSpecies, catalog.moveCategory)
    }, 0)
    return () => window.clearTimeout(id)
  }, [defenderSpecies, catalog.moveCategory])

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

  const offenseTemplates = useMemo(() => {
    void userOffenseVersion
    return offenseTemplatesForState(catalog, trackState)
  }, [catalog, trackState, userOffenseVersion])

  const defenseTemplates = useMemo(() => {
    void userDefenseVersion
    return defenseTemplatesForState(catalog, trackState)
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
        ? `${trackState.offenseTemplateIds.length} 预设`
        : `数轴 ${trackState.statRange.min}-${trackState.statRange.max}`,
    items: trackState.attackerItemIds.length,
    defenders:
      trackState.defenderMode === "preset"
        ? `${trackState.defenseTemplateIds.length} 预设`
        : `数轴 HP ${trackState.defenderRanges.hp.min}-${trackState.defenderRanges.hp.max}`,
    rows: rows.length,
  }

  function setStatMode(mode: StatSelectMode) {
    setTrackState((s) => {
      if (mode === "range") {
        if (s.statRangeTouched) return { ...s, statMode: mode }
        const templates = offenseTemplatesForState(catalog, s)
        return {
          ...s,
          statMode: mode,
          statRange: offenseRangeFromTemplates(templates, s.offenseTemplateIds, () =>
            defaultOffenseStatRange(attackerSpecies, catalog.moveCategory),
          ),
        }
      }

      const { selectedIds, temporary } = reconcileOffenseFromRange(
        offenseTemplatesForState(catalog, s),
        s.statRange,
        s.offenseTemporaryTemplates,
      )
      return {
        ...s,
        statMode: mode,
        offenseTemplateIds: selectedIds,
        offenseTemporaryTemplates: temporary,
      }
    })
  }

  function setDefenderMode(mode: StatSelectMode) {
    setTrackState((s) => {
      if (mode === "range") {
        if (s.defenderRangeTouched) return { ...s, defenderMode: mode }
        const templates = defenseTemplatesForState(catalog, s)
        return {
          ...s,
          defenderMode: mode,
          defenderRanges: {
            hp: defenderHpRangeFromTemplates(templates, s.defenseTemplateIds, () =>
              defaultDefenderHpRange(defenderSpecies),
            ),
            def: defenderDefRangeFromTemplates(templates, s.defenseTemplateIds, () =>
              defaultDefenderDefRange(defenderSpecies, catalog.moveCategory),
            ),
          },
        }
      }

      const { selectedIds, temporary } = reconcileDefenseFromRange(
        defenseTemplatesForState(catalog, s),
        s.defenderRanges,
        s.defenseTemporaryTemplates,
      )
      return {
        ...s,
        defenderMode: mode,
        defenseTemplateIds: selectedIds,
        defenseTemporaryTemplates: temporary,
      }
    })
  }

  const toggleOffenseTemplate = useCallback((id: string) => {
    setTrackState((s) => {
      const selected = new Set(s.offenseTemplateIds)
      if (selected.has(id)) selected.delete(id)
      else selected.add(id)
      const offenseTemplateIds = offenseTemplates
        .filter((t) => selected.has(t.id))
        .map((t) => t.id)
      return { ...s, offenseTemplateIds }
    })
  }, [offenseTemplates])

  const toggleDefenseTemplate = useCallback((id: string) => {
    setTrackState((s) => {
      const selected = new Set(s.defenseTemplateIds)
      if (selected.has(id)) selected.delete(id)
      else selected.add(id)
      const defenseTemplateIds = defenseTemplates
        .filter((t) => selected.has(t.id))
        .map((t) => t.id)
      return { ...s, defenseTemplateIds }
    })
  }, [defenseTemplates])

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

  function persistOffenseTemplate(id: string) {
    const template = offenseTemplates.find((t) => t.id === id)
    if (!template || template.kind !== "temporary") return
    const user = newUserOffenseTemplate(
      template.values.kind === "offense" ? template.values.stat : 0,
    )
    saveUserOffenseTemplate(String(catalog.matchup.attackerId), user)
    setTrackState((s) => ({
      ...s,
      offenseTemporaryTemplates: s.offenseTemporaryTemplates.filter((t) => t.id !== id),
      offenseTemplateIds: s.offenseTemplateIds.map((tid) => (tid === id ? user.id : tid)),
    }))
    setUserOffenseVersion((v) => v + 1)
  }

  function persistDefenseTemplate(id: string) {
    const template = defenseTemplates.find((t) => t.id === id)
    if (!template || template.kind !== "temporary") return
    const v = template.values.kind === "defense" ? template.values : { hp: 0, def: 0 }
    const user = newUserDefenseTemplate(v.hp, v.def)
    saveUserDefenseTemplate(String(catalog.matchup.defenderId), user)
    setTrackState((s) => ({
      ...s,
      defenseTemporaryTemplates: s.defenseTemporaryTemplates.filter((t) => t.id !== id),
      defenseTemplateIds: s.defenseTemplateIds.map((tid) => (tid === id ? user.id : tid)),
    }))
    setUserDefenseVersion((v) => v + 1)
  }

  function deleteOffenseTemplate(id: string) {
    deleteUserOffenseTemplate(String(catalog.matchup.attackerId), id)
    setTrackState((s) => ({
      ...s,
      offenseTemplateIds: s.offenseTemplateIds.filter((tid) => tid !== id),
    }))
    setUserOffenseVersion((v) => v + 1)
  }

  function deleteDefenseTemplate(id: string) {
    deleteUserDefenseTemplate(String(catalog.matchup.defenderId), id)
    setTrackState((s) => ({
      ...s,
      defenseTemplateIds: s.defenseTemplateIds.filter((tid) => tid !== id),
    }))
    setUserDefenseVersion((v) => v + 1)
  }

  function confirmAddOffense(stat: number) {
    const user = newUserOffenseTemplate(stat)
    saveUserOffenseTemplate(String(catalog.matchup.attackerId), user)
    setTrackState((s) => ({
      ...s,
      offenseTemplateIds: [...s.offenseTemplateIds, user.id],
    }))
    setUserOffenseVersion((v) => v + 1)
    setAddingOffense(false)
  }

  function confirmAddDefense(hp: number, def: number) {
    const user = newUserDefenseTemplate(hp, def)
    saveUserDefenseTemplate(String(catalog.matchup.defenderId), user)
    setTrackState((s) => ({
      ...s,
      defenseTemplateIds: [...s.defenseTemplateIds, user.id],
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
    offenseTemplates,
    defenseTemplates,
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
    toggleOffenseTemplate,
    setStatRange: (statRange: TrackState["statRange"]) =>
      setTrackState((s) => ({ ...s, statRange, statRangeTouched: true })),
    setShowOffenseActual: (showOffenseActual: boolean) =>
      setTrackState((s) => ({ ...s, showOffenseActual })),
    cycleOffenseAllocation,
    persistOffenseTemplate,
    deleteOffenseTemplate,
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
    toggleDefenseTemplate,
    setDefenderRanges: (defenderRanges: DefenderStatRanges) =>
      setTrackState((s) => ({
        ...s,
        defenderRanges,
        defenderRangeTouched: true,
      })),
    setShowDefenseActual: (showDefenseActual: boolean) =>
      setTrackState((s) => ({ ...s, showDefenseActual })),
    setShowResultActual: (showResultActual: boolean) =>
      setTrackState((s) => ({ ...s, showResultActual })),
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
    persistDefenseTemplate,
    deleteDefenseTemplate,
    confirmAddDefense,
    setAddingDefense,
    statNameStrategy,
    setStatNameStrategy,
  }
}

export type ScenarioState = ReturnType<typeof useScenarioState>
