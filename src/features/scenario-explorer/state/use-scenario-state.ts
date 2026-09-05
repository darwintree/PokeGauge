import { useCallback, useEffect, useMemo, useState } from "react"

import {
  getDefenderDefBounds,
  getDefenderHpBounds,
  getOffenseStatBounds,
  warmDefenderSpreadCache,
  type StatAxisBounds,
} from "@/lib/stat-calculation"
import { type ProbabilityMode, type StatStage } from "@/lib/damage-calculation"
import type { MatchupCatalog } from "@/lib/catalog"
import { measureInteractionWork } from "@/devtools/interaction-performance-monitor"
import {
  createMoveSnapshot,
  editMoveSnapshot,
} from "@/lib/move"
import {
  buildSystemDefensePresets,
  buildSystemOffensePresets,
  loadUserDefensePresets,
  loadUserOffensePresets,
  deleteUserDefensePreset,
  deleteUserOffensePreset,
  findPresetByDefenseValues,
  findPresetByOffenseValue,
  newUserDefensePreset,
  newUserOffensePreset,
  resolveDefenseChip,
  resolveOffenseChip,
  saveUserDefensePreset,
  saveUserOffensePreset,
  type StatNameStrategy,
} from "@/lib/stat-preset"
import {
  restorePersistedTrackState,
  runScenarioPipeline,
  trackStatePreviewingDefense,
  trackStatePreviewingOffense,
  type DefenderStatRanges,
  type PersistedTrackState,
  type StatSelectMode,
  type TrackState,
  scenarioSetupTokenFromTrackState,
} from "@/lib/scenario"

import { groupingTrack, resultGroupingOptions, type ResultGrouping } from "../results/result-groups"

import {
  createSelectionState, reduceSelection, selectionIsSettled, selectionPresets,
  type SelectionAction,
} from "@/lib/scenario/selection"
import { useScenarioSnapshotPersistence } from "./use-scenario-snapshot-persistence"

function defaultAxisPoint(bounds: StatAxisBounds): number {
  return bounds.snapPoints[1]?.value ?? Math.round((bounds.min + bounds.max) / 2)
}

function offenseDraftLabel(
  catalog: MatchupCatalog,
  strategy: StatNameStrategy,
  stat: number,
): string {
  return resolveOffenseChip({
    calcName: catalog.matchup.attackerCalcName,
    category: catalog.moveCategory,
    stat,
    strategy,
    temporary: true,
  }).label
}

function defenseDraftLabel(
  catalog: MatchupCatalog,
  strategy: StatNameStrategy,
  hp: number,
  def: number,
): string {
  return resolveDefenseChip({
    calcName: catalog.matchup.defenderCalcName,
    category: catalog.moveCategory,
    hp,
    def,
    strategy,
    temporary: true,
  }).label
}

export function useScenarioState(
  catalog: MatchupCatalog,
  statNameStrategy: StatNameStrategy,
  probabilityMode: ProbabilityMode,
  restoredTrackState?: TrackState,
  sharedImport?: {
    token: string
    onEdited: () => void
  },
  resultGrouping: ResultGrouping | null = null,
) {
  const { attackerCalcName, defenderCalcName } = catalog.matchup

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

  const [userOffenseVersion, setUserOffenseVersion] = useState(0)
  const [userDefenseVersion, setUserDefenseVersion] = useState(0)
  const [offenseDraft, setOffenseDraft] = useState<number | null>(null)
  const [defenseDraft, setDefenseDraft] = useState<{ hp: number; def: number } | null>(null)
  const [sharedImportUntouched, setSharedImportUntouched] = useState(sharedImport !== undefined)
  const selectionContext = useMemo(() => {
    void userOffenseVersion
    void userDefenseVersion
    return {
      catalog,
      offensePresets: [
        ...buildSystemOffensePresets(attackerCalcName, catalog.moveCategory),
        ...loadUserOffensePresets(String(catalog.matchup.attackerId)),
      ],
      defensePresets: [
        ...buildSystemDefensePresets(defenderCalcName, catalog.moveCategory),
        ...loadUserDefensePresets(String(catalog.matchup.defenderId)),
      ],
    }
  }, [catalog, attackerCalcName, defenderCalcName, userOffenseVersion, userDefenseVersion])
  const [selection, setSelection] = useState(() => createSelectionState(
    selectionContext,
    restoredTrackState
      ? restorePersistedTrackState(restoredTrackState as PersistedTrackState, catalog)
      : undefined,
  ))
  const catalogTransitionPending = selection.context !== selectionContext
  if (catalogTransitionPending) {
    setSelection(reduceSelection(selection, { type: "context", context: selectionContext }))
  }
  const dispatch = useCallback((action: SelectionAction) => {
    setSelection((current) => reduceSelection(current, action))
  }, [])
  const { trackState } = selection

  useEffect(() => {
    setOffenseDraft(null)
    setDefenseDraft(null)
  }, [catalog.matchup.attackerId, catalog.matchup.defenderId, catalog.moveCategory])

  useScenarioSnapshotPersistence({
    enabled: !sharedImportUntouched,
    catalog,
    trackState,
    selectionSettled: !catalogTransitionPending && selectionIsSettled(selection),
  })

  useEffect(() => {
    if (!sharedImportUntouched || !sharedImport) return
    const current = scenarioSetupTokenFromTrackState(catalog, trackState)
    if (!current.ok || current.value === sharedImport.token) return
    setSharedImportUntouched(false)
    sharedImport.onEdited()
  }, [catalog, sharedImport, sharedImportUntouched, trackState])

  useEffect(() => {
    const id = window.setTimeout(() => {
      warmDefenderSpreadCache(defenderCalcName, catalog.moveCategory)
    }, 0)
    return () => window.clearTimeout(id)
  }, [defenderCalcName, catalog.moveCategory])

  const { offense: offensePresets, defense: defensePresets } = useMemo(
    () => selectionPresets(selection), [selection],
  )

  const pipelineTrackState = useMemo(() => {
    let preview = trackState
    if (offenseDraft != null) {
      preview = trackStatePreviewingOffense(
        preview,
        offensePresets,
        offenseDraft,
        offenseDraftLabel(catalog, statNameStrategy, offenseDraft),
      )
    }
    if (defenseDraft != null) {
      preview = trackStatePreviewingDefense(
        preview,
        defensePresets,
        defenseDraft.hp,
        defenseDraft.def,
        defenseDraftLabel(catalog, statNameStrategy, defenseDraft.hp, defenseDraft.def),
      )
    }
    return preview
  }, [
    catalog,
    defenseDraft,
    defensePresets,
    offenseDraft,
    offensePresets,
    statNameStrategy,
    trackState,
  ])

  const visibleGrouping = resultGroupingOptions(trackState).some(option => option.id === resultGrouping)
    ? resultGrouping
    : null
  const preserveTrack = groupingTrack(visibleGrouping)
  const pipelineResult = useMemo(() => {
    if (catalogTransitionPending) return { rows: [], unavailable: [] }
    return measureInteractionWork("runScenarioPipeline", () =>
      runScenarioPipeline(catalog, pipelineTrackState, probabilityMode, preserveTrack),
    )
  }, [catalog, catalogTransitionPending, pipelineTrackState, probabilityMode, preserveTrack])
  const { rows, unavailable } = pipelineResult

  const toggleOffensePreset = useCallback((id: string) => {
    dispatch({ type: "stat-toggle", side: "offense", id })
  }, [dispatch])

  const toggleDefensePreset = useCallback((id: string) => {
    dispatch({ type: "stat-toggle", side: "defense", id })
  }, [dispatch])

  function persistOffensePreset(id: string) {
    const preset = offensePresets.find((t) => t.id === id)
    if (!preset || preset.kind !== "temporary") return
    const user = newUserOffensePreset(
      preset.values.kind === "offense" ? preset.values.stat : 0,
    )
    saveUserOffensePreset(String(catalog.matchup.attackerId), user)
    dispatch({ type: "stat-persist", side: "offense", id, preset: user })
    setUserOffenseVersion((v) => v + 1)
  }

  function persistDefensePreset(id: string) {
    const preset = defensePresets.find((t) => t.id === id)
    if (!preset || preset.kind !== "temporary") return
    const v = preset.values.kind === "defense" ? preset.values : { hp: 0, def: 0 }
    const user = newUserDefensePreset(v.hp, v.def)
    saveUserDefensePreset(String(catalog.matchup.defenderId), user)
    dispatch({ type: "stat-persist", side: "defense", id, preset: user })
    setUserDefenseVersion((v) => v + 1)
  }

  function deleteOffensePreset(id: string) {
    const next = reduceSelection(selection, { type: "stat-remove", side: "offense", id })
    if (next === selection) return
    deleteUserOffensePreset(String(catalog.matchup.attackerId), id)
    setSelection(next)
    setUserOffenseVersion((v) => v + 1)
  }

  function deleteDefensePreset(id: string) {
    const next = reduceSelection(selection, { type: "stat-remove", side: "defense", id })
    if (next === selection) return
    deleteUserDefensePreset(String(catalog.matchup.defenderId), id)
    setSelection(next)
    setUserDefenseVersion((v) => v + 1)
  }

  function confirmAddOffense(stat: number) {
    const existing = findPresetByOffenseValue(offensePresets, stat)
    if (existing) {
      dispatch({ type: "stat-add", side: "offense", preset: existing })
      setOffenseDraft(null)
      return
    }
    const user = newUserOffensePreset(stat)
    saveUserOffensePreset(String(catalog.matchup.attackerId), user)
    dispatch({ type: "stat-add", side: "offense", preset: user })
    setUserOffenseVersion((v) => v + 1)
    setOffenseDraft(null)
  }

  function confirmAddDefense(hp: number, def: number) {
    const existing = findPresetByDefenseValues(defensePresets, hp, def)
    if (existing) {
      dispatch({ type: "stat-add", side: "defense", preset: existing })
      setDefenseDraft(null)
      return
    }
    const user = newUserDefensePreset(hp, def)
    saveUserDefensePreset(String(catalog.matchup.defenderId), user)
    dispatch({ type: "stat-add", side: "defense", preset: user })
    setUserDefenseVersion((v) => v + 1)
    setDefenseDraft(null)
  }

  function toggleAddingOffense() {
    setOffenseDraft((current) =>
      current == null ? defaultAxisPoint(offenseBounds) : null,
    )
  }

  function toggleAddingDefense() {
    setDefenseDraft((current) =>
      current == null
        ? {
            hp: defaultAxisPoint(defenderHpBounds),
            def: defaultAxisPoint(defenderDefBounds),
          }
        : null,
    )
  }

  function addMoveSnapshot(moveId: number) {
    const move = catalog.moves.find((candidate) => candidate.id === moveId)
    if (!move) return
    const snapshot = createMoveSnapshot(move)
    dispatch({ type: "move-add", snapshot })
    return snapshot.id
  }

  return {
    trackState,
    pipelineTrackState,
    rows,
    visibleGrouping,
    unavailable,
    offensePresets,
    defensePresets,
    offenseBounds,
    defenderHpBounds,
    defenderDefBounds,
    addingOffense: offenseDraft != null,
    addingDefense: defenseDraft != null,
    offenseDraft,
    defenseDraft,
    setOffenseDraft,
    setDefenseDraft,
    toggleAddingOffense,
    toggleAddingDefense,
    addMoveSnapshot,
    updateMoveSnapshot: (id: string, patch: Parameters<typeof editMoveSnapshot>[1]) =>
      dispatch({ type: "move-edit", id, patch }),
    removeMoveSnapshot: (id: string) => dispatch({ type: "move-remove", id }),
    setSelectedMoveSnapshotIds: (ids: string[]) => dispatch({ type: "move-select", ids }),
    setStatMode: (mode: StatSelectMode) => dispatch({ type: "stat-mode", side: "offense", mode }),
    toggleOffensePreset,
    setStatRange: (range: TrackState["statRange"]) => dispatch({ type: "offense-range", range }),
    cycleOffenseAllocation: (id: string) => dispatch({ type: "stat-allocation", side: "offense", id }),
    persistOffensePreset,
    deleteOffensePreset,
    confirmAddOffense,
    setAttackerItemIds: (ids: TrackState["attackerItemIds"]) =>
      dispatch({ type: "item-select", side: "attacker", ids }),
    setDefenderItemIds: (ids: TrackState["defenderItemIds"]) =>
      dispatch({ type: "item-select", side: "defender", ids }),
    addAttackerItem: (id: TrackState["attackerItemIds"][number]) =>
      dispatch({ type: "item-add", side: "attacker", id }),
    addDefenderItem: (id: TrackState["defenderItemIds"][number]) =>
      dispatch({ type: "item-add", side: "defender", id }),
    setAttackerAbilityIds: (ids: number[]) => dispatch({ type: "ability-select", side: "attacker", ids }),
    resetAttackerAbilities: () => dispatch({ type: "ability-reset", side: "attacker" }),
    setDefenderAbilityIds: (ids: number[]) => dispatch({ type: "ability-select", side: "defender", ids }),
    resetDefenderAbilities: () => dispatch({ type: "ability-reset", side: "defender" }),
    addWeather: (value: TrackState["weathers"][number]) => dispatch({ type: "weather-add", value }),
    setWeathers: (values: TrackState["weathers"]) => dispatch({ type: "weather-select", values }),
    addTerrain: (value: TrackState["terrains"][number]) => dispatch({ type: "terrain-add", value }),
    setTerrains: (values: TrackState["terrains"]) => dispatch({ type: "terrain-select", values }),
    setScreens: (values: TrackState["screens"]) => dispatch({ type: "screen-select", values }),
    setAttackerStages: (values: StatStage[]) => dispatch({ type: "stage-select", side: "attacker", values }),
    addAttackerStage: (value: StatStage) => dispatch({ type: "stage-add", side: "attacker", value }),
    resetAttackerStages: () => dispatch({ type: "stage-reset", side: "attacker" }),
    setDefenderStages: (values: StatStage[]) => dispatch({ type: "stage-select", side: "defender", values }),
    addDefenderStage: (value: StatStage) => dispatch({ type: "stage-add", side: "defender", value }),
    resetDefenderStages: () => dispatch({ type: "stage-reset", side: "defender" }),
    setDefenderMode: (mode: StatSelectMode) => dispatch({ type: "stat-mode", side: "defense", mode }),
    toggleDefensePreset,
    setDefenderRanges: (ranges: DefenderStatRanges) => dispatch({ type: "defense-range", ranges }),
    cycleDefenseAllocation: (id: string) => dispatch({ type: "stat-allocation", side: "defense", id }),
    persistDefensePreset,
    deleteDefensePreset,
    confirmAddDefense,
    statNameStrategy,
  }
}

export type ScenarioState = ReturnType<typeof useScenarioState>
