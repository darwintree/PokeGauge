import { useCallback, useEffect, useMemo, useState } from "react"

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
import {
  buildSystemDefenseTemplates,
  buildSystemOffenseTemplates,
  deleteUserDefenseTemplate,
  deleteUserOffenseTemplate,
  findTemplateByDefenseValues,
  findTemplateByOffenseValue,
  loadUserDefenseTemplates,
  loadUserOffenseTemplates,
  mergeTemplates,
  newTemporaryDefenseTemplate,
  newTemporaryOffenseTemplate,
  newUserDefenseTemplate,
  newUserOffenseTemplate,
  placeholderTemplateName,
  saveUserDefenseTemplate,
  saveUserOffenseTemplate,
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

function mergedOffenseTemplates(
  catalog: MatchupCatalog,
  temporary: StatValueTemplate[],
): StatValueTemplate[] {
  return mergeTemplates(
    buildSystemOffenseTemplates(catalog.matchup.attackerSpecies, catalog.moveCategory),
    loadUserOffenseTemplates(catalog.matchup.attackerId),
    temporary,
  )
}

function mergedDefenseTemplates(
  catalog: MatchupCatalog,
  temporary: StatValueTemplate[],
): StatValueTemplate[] {
  return mergeTemplates(
    buildSystemDefenseTemplates(catalog.matchup.defenderSpecies, catalog.moveCategory),
    loadUserDefenseTemplates(catalog.matchup.defenderId),
    temporary,
  )
}

function rangeEndpoints(min: number, max: number): number[] {
  return max === min ? [min] : [min, max]
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

  useEffect(() => {
    setTrackState(defaultTrackState(catalog))
    setAddingOffense(false)
    setAddingDefense(false)
  }, [catalog])

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
    () => runScenarioPipeline(catalog, trackState),
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
        const templates = mergedOffenseTemplates(catalog, s.offenseTemporaryTemplates)
        return {
          ...s,
          statMode: mode,
          statRange: offenseRangeFromTemplates(templates, s.offenseTemplateIds, () =>
            defaultOffenseStatRange(attackerSpecies, catalog.moveCategory),
          ),
        }
      }

      const { selectedIds, temporary } = reconcileOffenseFromRange(
        mergedOffenseTemplates(catalog, s.offenseTemporaryTemplates),
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
        const templates = mergedDefenseTemplates(catalog, s.defenseTemporaryTemplates)
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
        mergedDefenseTemplates(catalog, s.defenseTemporaryTemplates),
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
      placeholderTemplateName(template),
    )
    saveUserOffenseTemplate(catalog.matchup.attackerId, user)
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
    const user = newUserDefenseTemplate(v.hp, v.def, placeholderTemplateName(template))
    saveUserDefenseTemplate(catalog.matchup.defenderId, user)
    setTrackState((s) => ({
      ...s,
      defenseTemporaryTemplates: s.defenseTemporaryTemplates.filter((t) => t.id !== id),
      defenseTemplateIds: s.defenseTemplateIds.map((tid) => (tid === id ? user.id : tid)),
    }))
    setUserDefenseVersion((v) => v + 1)
  }

  function deleteOffenseTemplate(id: string) {
    deleteUserOffenseTemplate(catalog.matchup.attackerId, id)
    setTrackState((s) => ({
      ...s,
      offenseTemplateIds: s.offenseTemplateIds.filter((tid) => tid !== id),
    }))
    setUserOffenseVersion((v) => v + 1)
  }

  function deleteDefenseTemplate(id: string) {
    deleteUserDefenseTemplate(catalog.matchup.defenderId, id)
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
    const user = newUserOffenseTemplate(
      snapped,
      placeholderTemplateName({ id: "", kind: "user", values: { kind: "offense", stat: snapped } }),
    )
    saveUserOffenseTemplate(catalog.matchup.attackerId, user)
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
    const user = newUserDefenseTemplate(
      snapped.hp,
      snapped.def,
      placeholderTemplateName({
        id: "",
        kind: "user",
        values: { kind: "defense", hp: snapped.hp, def: snapped.def },
      }),
    )
    saveUserDefenseTemplate(catalog.matchup.defenderId, user)
    setTrackState((s) => ({
      ...s,
      defenseTemplateIds: [...s.defenseTemplateIds, user.id],
    }))
    setUserDefenseVersion((v) => v + 1)
    setAddingDefense(false)
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
    setMoveIds: (ids: string[]) => setTrackState((s) => ({ ...s, moveIds: ids })),
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
    cycleDefenseAllocation,
    persistDefenseTemplate,
    deleteDefenseTemplate,
    confirmAddDefense,
    setAddingDefense,
  }
}

export type ScenarioState = ReturnType<typeof useScenarioState>
