import type { ScenarioTrack } from "@/lib/damage-calculation"
import type { ScenarioResult, TrackState } from "@/lib/scenario"

export type ResultGrouping = "move" | "offense" | "item" | "defense"
  | Exclude<ScenarioTrack, "attacker-stat" | "defender-stat" | "held-item">

/** Only Tracks with multiple selected branches offer a useful grouping. */
export function resultGroupingOptions(state: TrackState): { id: ResultGrouping; count: number }[] {
  const counts: Record<ResultGrouping, number> = {
    move: state.selectedMoveSnapshotIds.length,
    offense: state.statMode === "range" ? 1 : state.offensePresetIds.length,
    "attacker-stage": state.attackerStages.length,
    "attacker-ability": state.attackerAbilityIds.length,
    item: state.attackerItemIds.length,
    defense: state.defenderMode === "range" ? 1 : state.defensePresetIds.length,
    "defender-stage": state.defenderStages.length,
    "defender-ability": state.defenderAbilityIds.length,
    "defender-held-item": state.defenderItemIds.length,
    screen: state.screens.length,
    terrain: state.terrains.length,
    weather: state.weathers.length,
  }
  return (Object.entries(counts) as [ResultGrouping, number][])
    .filter(([, count]) => count > 1)
    .map(([id, count]) => ({ id, count }))
}

export type ResultGroup = {
  id: string
  rows: ScenarioResult[]
}

/** Group parents before Range expansion so their children stay attached. */
export function groupResults(rows: ScenarioResult[], grouping: ResultGrouping): ResultGroup[] {
  const groups = new Map<string, ScenarioResult[]>()
  for (const row of rows) {
    let ids: string[]
    switch (grouping) {
      case "move":
        ids = [row.snapshotId]
        break
      case "offense":
        ids = [row.attackerStatId]
        break
      case "defense":
        ids = [row.defenderId]
        break
      default:
        // Merged results belong to every contributing selection, including inactive ones.
        ids = [...new Set(Object.values(row.provenance[grouping === "item" ? "held-item" : grouping] ?? {}).flat())]
        break
    }
    if (grouping === "screen") {
      // Provenance names the applied wall; both are the same selected Screen branch.
      ids = [...new Set(ids.map(id => id === "reflect" || id === "light-screen" ? "walls" : id))]
    }
    for (const id of ids) {
      const group = groups.get(id)
      if (group) group.push(row)
      else groups.set(id, [row])
    }
  }
  return Array.from(groups, ([id, groupRows]) => ({ id, rows: groupRows }))
}

/** Move snapshots already form a calculation-identity boundary. */
export function groupingTrack(grouping: ResultGrouping | null): ScenarioTrack | null {
  switch (grouping) {
    case null:
    case "move": return null
    case "offense": return "attacker-stat"
    case "defense": return "defender-stat"
    case "item": return "held-item"
    default: return grouping
  }
}
