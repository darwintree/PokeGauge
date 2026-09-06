import { TERRAINS, WEATHERS } from "@/lib/damage-calculation"
import { editMoveSnapshot } from "@/lib/move"
import type { StatPreset } from "@/lib/stat-preset"
import { mergeStagePool, mergeStageSelection } from "../state"
import {
  trackStateAfterAddDefense, trackStateAfterAddOffense,
  trackStateAfterDefenseMode, trackStateAfterDefenseRanges,
  trackStateAfterOffenseMode, trackStateAfterOffenseRange,
  trackStateAfterPersistDefense, trackStateAfterPersistOffense,
  trackStateAfterRemoveDefense, trackStateAfterRemoveOffense,
  trackStateAfterToggleDefense, trackStateAfterToggleOffense,
} from "../stat-selection"
import { normalizeScreens } from "../transitions"
import { projectSelections, syncSelectionContext } from "./lifecycle"
import type { SelectionAction, SelectionState } from "./types"

export function selectionPresets(state: SelectionState): { offense: StatPreset[]; defense: StatPreset[] } {
  return {
    offense: [...state.context.offensePresets, ...state.trackState.offenseTemporaryPresets],
    defense: [...state.context.defensePresets, ...state.trackState.defenseTemporaryPresets],
  }
}

function union<T>(values: readonly T[], additions: readonly T[]): T[] {
  return [...new Set([...values, ...additions])]
}

export function reduceSelection(state: SelectionState, action: SelectionAction): SelectionState {
  if (action.type === "context") return syncSelectionContext(state, action.context)
  const { catalog } = state.context
  const edited = new Set(state.edited)
  let tracks = state.trackState
  let abilityProjectionPending = state.abilityProjectionPending
  const project = () => projectSelections({ ...state, edited }, tracks)

  switch (action.type) {
    case "move-add":
      edited.add("moves")
      tracks = {
        ...tracks,
        moveSnapshots: [...tracks.moveSnapshots, action.snapshot],
        selectedMoveSnapshotIds: [...tracks.selectedMoveSnapshotIds, action.snapshot.id],
      }
      break
    case "move-edit":
      edited.add("moves")
      tracks = {
        ...tracks,
        moveSnapshots: tracks.moveSnapshots.map((snapshot) =>
          snapshot.id === action.id ? editMoveSnapshot(snapshot, action.patch) : snapshot,
        ),
      }
      break
    case "move-remove":
      edited.add("moves")
      tracks = {
        ...tracks,
        moveSnapshots: tracks.moveSnapshots.filter((snapshot) => snapshot.id !== action.id),
        selectedMoveSnapshotIds: tracks.selectedMoveSnapshotIds.filter((id) => id !== action.id),
      }
      break
    case "move-select": {
      edited.add("moves")
      const ids = new Set(action.ids)
      tracks = {
        ...tracks,
        selectedMoveSnapshotIds: tracks.moveSnapshots
          .filter((snapshot) => ids.has(snapshot.id))
          .map((snapshot) => snapshot.id),
      }
      break
    }
    case "item-add":
    case "item-select": {
      const { side } = action
      const locked = side === "attacker" ? catalog.attackerLockedItemId : catalog.defenderLockedItemId
      if (locked !== null || (action.type === "item-add" && action.id === "none")) return state
      edited.add(`${side}Item`)
      const poolKey = `${side}ItemPoolIds` as const
      const selectionKey = `${side}ItemIds` as const
      const selected = action.type === "item-add"
        ? union(tracks[selectionKey], [action.id]) : action.ids
      const pool = union(tracks[poolKey], selected)
      const selectedSet = new Set(selected)
      tracks = {
        ...tracks,
        [poolKey]: pool,
        [selectionKey]: selected.length > 0 ? pool.filter((id) => selectedSet.has(id)) : ["none"],
      }
      break
    }
    case "ability-select":
      if (action.ids.length === 0) return state
      edited.add(`${action.side}Ability`)
      tracks = { ...tracks, [`${action.side}AbilityIds`]: action.ids }
      tracks = project()
      break
    case "ability-reset": {
      edited.delete(`${action.side}Ability`)
      const defaults = action.side === "attacker"
        ? catalog.defaultAttackerAbilityIds : catalog.defaultDefenderAbilityIds
      tracks = { ...tracks, [`${action.side}AbilityIds`]: [...defaults] }
      if (catalog.defaultAbilityPickStatus === "ready") tracks = project()
      else abilityProjectionPending = true
      break
    }
    case "weather-add":
    case "weather-select": {
      edited.add("weather")
      const values = action.type === "weather-add"
        ? WEATHERS.filter((value) => value === action.value || tracks.weathers.includes(value))
        : action.values
      tracks = {
        ...tracks,
        weathers: values.length > 0 ? values : ["none"],
        weatherPool: WEATHERS.filter((value) => value === "none" ||
          tracks.weatherPool.includes(value) || values.includes(value)),
      }
      break
    }
    case "terrain-add":
    case "terrain-select": {
      edited.add("terrain")
      const values = action.type === "terrain-add"
        ? TERRAINS.filter((value) => value === action.value || tracks.terrains.includes(value))
        : action.values
      tracks = {
        ...tracks,
        terrains: values.length > 0 ? values : ["none"],
        terrainPool: TERRAINS.filter((value) => value === "none" ||
          tracks.terrainPool.includes(value) || values.includes(value)),
      }
      break
    }
    case "screen-select":
      tracks = { ...tracks, screens: normalizeScreens(action.values) }
      break
    case "stage-select":
    case "stage-add":
    case "stage-reset": {
      const { side } = action
      const poolKey = `${side}StagePool` as const
      const selectionKey = `${side}Stages` as const
      if (side === "attacker") {
        if (action.type === "stage-reset") edited.delete("attackerStage")
        else edited.add("attackerStage")
      }
      if (action.type === "stage-reset") {
        tracks = { ...tracks, [poolKey]: [0], [selectionKey]: [0] }
        if (side === "attacker") {
          const projected = project()
          tracks = { ...tracks,
            attackerStages: projected.attackerStages,
            attackerStagePool: projected.attackerStagePool,
          }
        }
      } else {
        const selected = action.type === "stage-add"
          ? mergeStageSelection(tracks[selectionKey], [action.value])
          : mergeStageSelection(action.values)
        tracks = { ...tracks,
          [selectionKey]: selected,
          [poolKey]: mergeStagePool(tracks[poolKey], selected),
        }
      }
      break
    }
    case "stat-mode":
    case "stat-toggle":
    case "stat-add":
    case "stat-persist":
    case "stat-remove":
    case "stat-allocation":
    case "offense-range":
    case "defense-range": {
      const offense = action.type === "offense-range" ||
        (action.type !== "defense-range" && action.side === "offense")
      const presets = selectionPresets(state)
      if (offense) edited.add("offense")
      switch (action.type) {
        case "stat-mode":
          tracks = offense
            ? trackStateAfterOffenseMode(tracks, action.mode, presets.offense)
            : trackStateAfterDefenseMode(tracks, action.mode, presets.defense)
          break
        case "stat-toggle":
          tracks = offense
            ? trackStateAfterToggleOffense(tracks, action.id, presets.offense)
            : trackStateAfterToggleDefense(tracks, action.id, presets.defense)
          break
        case "offense-range":
          tracks = trackStateAfterOffenseRange(tracks, action.range, presets.offense)
          break
        case "defense-range":
          tracks = trackStateAfterDefenseRanges(tracks, action.ranges, presets.defense)
          break
        case "stat-add":
          tracks = offense
            ? trackStateAfterAddOffense(tracks, action.preset, presets.offense)
            : trackStateAfterAddDefense(tracks, action.preset, presets.defense)
          break
        case "stat-persist":
          tracks = offense
            ? trackStateAfterPersistOffense(tracks, action.id, action.preset)
            : trackStateAfterPersistDefense(tracks, action.id, action.preset)
          break
        case "stat-remove": {
          const next = offense
            ? trackStateAfterRemoveOffense(tracks, action.id, presets.offense)
            : trackStateAfterRemoveDefense(tracks, action.id, presets.defense)
          if (!next) return state
          tracks = next
          break
        }
        case "stat-allocation": {
          const key = offense ? "offenseAllocationIndices" : "defenseAllocationIndices"
          tracks = { ...tracks, [key]: { ...tracks[key], [action.id]: (tracks[key][action.id] ?? 0) + 1 } }
          break
        }
      }
      break
    }
  }
  return { ...state, trackState: tracks, edited, abilityProjectionPending }
}
