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
  snapToAchievableDefenseValues,
  snapToAchievableOffenseStat,
  warmDefenderSpreadCache,
} from "@/lib/calc-adapter"
import type { MatchupCatalog } from "@/lib/catalog"
import { measureInteractionWork } from "@/lib/interaction-performance-monitor"
import { orderedPoolSelection } from "@/lib/ordered-pool-selection"
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
  expectedRowCount,
  offenseTemplatesForState,
  runScenarioPipeline,
  type DefenderStatRanges,
  type StatSelectMode,
  type TrackState,
} from "@/lib/scenario-pipeline"

function rangeEndpoints(min: number, max: number): number[] {
  return max === min ? [min] : [min, max]
}

function orderedMoveSelection(catalog: MatchupCatalog, ids: readonly number[]): number[] {
  return orderedPoolSelection(catalog.moves.map((move) => move.id), ids)
}

function sameIds(a: readonly number[], b: readonly number[]): boolean {
  return a.length === b.length && a.every((id, index) => id === b[index])
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

  const [trackState, setTrackState] = useState<TrackState>(() => defaultTrackState(catalog))
  const [userOffenseVersion, setUserOffenseVersion] = useState(0)
  const [userDefenseVersion, setUserDefenseVersion] = useState(0)
  const [addingOffense, setAddingOffense] = useState(false)
  const [addingDefense, setAddingDefense] = useState(false)
  const [statNameStrategy, setStatNameStrategyState] = useState<StatNameStrategy>(loadStatNameStrategy)
  const resetKeyRef = useRef<string>(
    `${catalog.matchup.attackerId}:${catalog.matchup.defenderId}:${catalog.moveCategory}`,
  )
  const defaultMoveIdsRef = useRef<number[]>([...catalog.defaultMoveIds])
  const movesTouchedRef = useRef(false)

  const setStatNameStrategy = useCallback((strategy: StatNameStrategy) => {
    saveStatNameStrategy(strategy)
    setStatNameStrategyState(strategy)
  }, [])

  useEffect(() => {
    const resetKey = `${catalog.matchup.attackerId}:${catalog.matchup.defenderId}:${catalog.moveCategory}`
    if (resetKeyRef.current === resetKey) return
    resetKeyRef.current = resetKey
    defaultMoveIdsRef.current = [...catalog.defaultMoveIds]
    movesTouchedRef.current = false
    setTrackState(defaultTrackState(catalog))
    setAddingOffense(false)
    setAddingDefense(false)
  }, [catalog])

  useEffect(() => {
    const previousDefaultMoveIds = defaultMoveIdsRef.current
    if (sameIds(previousDefaultMoveIds, catalog.defaultMoveIds)) return
    defaultMoveIdsRef.current = [...catalog.defaultMoveIds]
    setTrackState((s) => {
      if (movesTouchedRef.current) return s
      if (!sameIds(s.visibleMoveIds, previousDefaultMoveIds)) return s
      if (!sameIds(s.moveIds, previousDefaultMoveIds)) return s
      return {
        ...s,
        visibleMoveIds: [...catalog.defaultMoveIds],
        moveIds: [...catalog.defaultMoveIds],
      }
    })
  }, [catalog.defaultMoveIds])

  useEffect(() => {
    const id = window.setTimeout(() => {
      warmDefenderSpreadCache(defenderSpecies, catalog.moveCategory)
    }, 0)
    return () => window.clearTimeout(id)
  }, [defenderSpecies, catalog.moveCategory])

  const offenseTemplates = useMemo(() => {
    void userOffenseVersion
    return offenseTemplatesForState(catalog, trackState)
  }, [catalog, trackState, userOffenseVersion])

  const defenseTemplates = useMemo(() => {
    void userDefenseVersion
    return defenseTemplatesForState(catalog, trackState)
  }, [catalog, trackState, userDefenseVersion])

  const rows = useMemo(
    () =>
      measureInteractionWork("runScenarioPipeline", () =>
        runScenarioPipeline(catalog, trackState),
      ),
    [catalog, trackState],
  )

  const selectionSummary = {
    moves: trackState.moveIds.length,
    stats:
      trackState.statMode === "preset"
        ? `${trackState.offenseTemplateIds.length} 预设`
        : `数轴 ${trackState.statRange.min}–${trackState.statRange.max}`,
    items: trackState.attackerItemIds.length,
    defenders:
      trackState.defenderMode === "preset"
        ? `${trackState.defenseTemplateIds.length} 预设`
        : `数轴 HP ${trackState.defenderRanges.hp.min}–${trackState.defenderRanges.hp.max}`,
    rows: expectedRowCount(trackState),
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
    const snapped = snapToAchievableOffenseStat(
      catalog.matchup.attackerSpecies,
      catalog.moveCategory,
      stat,
    )
    const user = newUserOffenseTemplate(snapped)
    saveUserOffenseTemplate(String(catalog.matchup.attackerId), user)
    setTrackState((s) => ({
      ...s,
      offenseTemplateIds: [...s.offenseTemplateIds, user.id],
    }))
    setUserOffenseVersion((v) => v + 1)
    setAddingOffense(false)
  }

  function confirmAddDefense(hp: number, def: number) {
    const snapped = snapToAchievableDefenseValues(
      catalog.matchup.defenderSpecies,
      catalog.moveCategory,
      hp,
      def,
    )
    const user = newUserDefenseTemplate(snapped.hp, snapped.def)
    saveUserDefenseTemplate(String(catalog.matchup.defenderId), user)
    setTrackState((s) => ({
      ...s,
      defenseTemplateIds: [...s.defenseTemplateIds, user.id],
    }))
    setUserDefenseVersion((v) => v + 1)
    setAddingDefense(false)
  }

  function addMoveToTrack(id: number) {
    movesTouchedRef.current = true
    setTrackState((s) => ({
      ...s,
      visibleMoveIds: orderedMoveSelection(catalog, [...s.visibleMoveIds, id]),
    }))
  }

  function toggleMove(id: number) {
    movesTouchedRef.current = true
    setTrackState((s) => {
      const visibleMoveIds = s.visibleMoveIds.includes(id)
        ? s.visibleMoveIds
        : orderedMoveSelection(catalog, [...s.visibleMoveIds, id])
      const moveIds = s.moveIds.includes(id)
        ? s.moveIds.filter((moveId) => moveId !== id)
        : [...s.moveIds, id]

      return {
        ...s,
        visibleMoveIds,
        moveIds: orderedMoveSelection(catalog, moveIds).filter((moveId) =>
          visibleMoveIds.includes(moveId),
        ),
      }
    })
  }

  function removeMoveFromTrack(id: number) {
    movesTouchedRef.current = true
    setTrackState((s) => {
      const visibleMoveIds = orderedMoveSelection(
        catalog,
        s.visibleMoveIds.filter((moveId) => moveId !== id),
      )
      return {
        ...s,
        visibleMoveIds,
        moveIds: orderedMoveSelection(
          catalog,
          s.moveIds.filter((moveId) => visibleMoveIds.includes(moveId)),
        ),
      }
    })
  }

  return {
    trackState,
    rows,
    offenseTemplates,
    defenseTemplates,
    showMoveOnRow: trackState.moveIds.length > 1,
    selectionSummary,
    offenseBounds,
    defenderHpBounds,
    defenderDefBounds,
    addingOffense,
    addingDefense,
    addMoveToTrack,
    toggleMove,
    removeMoveFromTrack,
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
    setAttackerItemIds: (ids: string[]) =>
      setTrackState((s) => ({ ...s, attackerItemIds: ids })),
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
