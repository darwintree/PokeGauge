import type { MatchupCatalog } from "@/lib/catalog"
import type { StatStage } from "@/lib/damage-calculation"
import type { editMoveSnapshot, MoveSnapshot } from "@/lib/move"
import type { StatPreset } from "@/lib/stat-preset"
import type { DefenderStatRanges, StatSelectMode, TrackState } from "../types"

export type SelectionContext = {
  catalog: MatchupCatalog
  /** System and saved presets supplied by the storage adapter; no temporary values. */
  offensePresets: StatPreset[]
  defensePresets: StatPreset[]
}

export const AUTOMATIC_TRACKS = [
  "moves", "offense",
  "attackerAbility", "defenderAbility",
  "attackerItem", "defenderItem",
  "weather", "terrain", "attackerStage",
] as const

export type AutomaticTrack = (typeof AUTOMATIC_TRACKS)[number]

/** Session-only bookkeeping never enters a Scenario Setup or persisted TrackState. */
export type SelectionState = {
  context: SelectionContext
  trackState: TrackState
  edited: ReadonlySet<AutomaticTrack>
  abilityProjectionPending: boolean
}

type Side = "attacker" | "defender"
type StatSide = "offense" | "defense"

export type SelectionAction =
  | { type: "context"; context: SelectionContext }
  | { type: "move-add"; snapshot: MoveSnapshot }
  | { type: "move-edit"; id: string; patch: Parameters<typeof editMoveSnapshot>[1] }
  | { type: "move-remove"; id: string }
  | { type: "move-select"; ids: string[] }
  | { type: "item-select"; side: Side; ids: TrackState["attackerItemIds"] }
  | { type: "item-add"; side: Side; id: TrackState["attackerItemIds"][number] }
  | { type: "ability-select"; side: Side; ids: number[] }
  | { type: "ability-reset"; side: Side }
  | { type: "weather-select"; values: TrackState["weathers"] }
  | { type: "weather-add"; value: TrackState["weathers"][number] }
  | { type: "terrain-select"; values: TrackState["terrains"] }
  | { type: "terrain-add"; value: TrackState["terrains"][number] }
  | { type: "screen-select"; values: TrackState["screens"] }
  | { type: "stage-select"; side: Side; values: StatStage[] }
  | { type: "stage-add"; side: Side; value: StatStage }
  | { type: "stage-reset"; side: Side }
  | { type: "stat-mode"; side: StatSide; mode: StatSelectMode }
  | { type: "stat-toggle"; side: StatSide; id: string }
  | { type: "offense-range"; range: TrackState["statRange"] }
  | { type: "defense-range"; ranges: DefenderStatRanges }
  | { type: "stat-allocation"; side: StatSide; id: string }
  | { type: "stat-add"; side: StatSide; preset: StatPreset }
  | { type: "stat-persist"; side: StatSide; id: string; preset: StatPreset }
  | { type: "stat-remove"; side: StatSide; id: string }
