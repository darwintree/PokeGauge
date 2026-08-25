import type { MatchupCatalog } from "@/lib/catalog"
import type { ProbabilityMode, ScenarioTrack } from "@/lib/damage-calculation"

import { runScenarioPipeline } from "./evaluate"
import {
  RANGE_DEFENDER_ID,
  RANGE_STAT_ID,
  type ProvenanceOptionSets,
  type ScenarioProvenance,
  type ScenarioResult,
  type TrackState,
} from "./types"

export type RangeAxisExpansion = {
  offense: boolean
  defense: boolean
}

export type RangeParentBlock = {
  parent: ScenarioResult
  children: ScenarioResult[]
}

const NON_STAT_TRACKS: ScenarioTrack[] = [
  "attacker-stage",
  "held-item",
  "defender-held-item",
  "attacker-ability",
  "weather",
  "terrain",
  "defender-stage",
  "defender-ability",
  "screen",
]

function optionSetsKey(sets: ProvenanceOptionSets | undefined): string {
  if (!sets) return ""
  return JSON.stringify({
    active: [...sets.active].sort(),
    inactive: [...sets.inactive].sort(),
    unsupported: [...sets.unsupported].sort(),
    neutral: [...sets.neutral].sort(),
  })
}

function sameNonStatProvenance(left: ScenarioProvenance, right: ScenarioProvenance): boolean {
  return NON_STAT_TRACKS.every(
    (track) => optionSetsKey(left[track]) === optionSetsKey(right[track]),
  )
}

export function childBelongsToExpandedParent(
  parent: ScenarioResult,
  child: ScenarioResult,
  expansion: RangeAxisExpansion,
): boolean {
  if (!expansion.offense && !expansion.defense) return false
  if (parent.snapshotId !== child.snapshotId) return false
  if (expansion.offense) {
    if (child.attackerStatId === RANGE_STAT_ID) return false
  } else if (parent.attackerStatId !== child.attackerStatId) {
    return false
  }
  if (expansion.defense) {
    if (child.defenderId === RANGE_DEFENDER_ID) return false
  } else if (parent.defenderId !== child.defenderId) {
    return false
  }
  return sameNonStatProvenance(parent.provenance, child.provenance)
}

function expansionOf(
  parent: ScenarioResult,
  expanded: Record<string, RangeAxisExpansion>,
): RangeAxisExpansion {
  const stored = expanded[parent.calculationIdentity]
  return {
    offense: parent.attackerStatId === RANGE_STAT_ID && !!stored?.offense,
    defense: parent.defenderId === RANGE_DEFENDER_ID && !!stored?.defense,
  }
}

function signatureOf(expansion: RangeAxisExpansion): string {
  return `${expansion.offense ? "choice" : "range"}:${expansion.defense ? "choice" : "range"}`
}

function trackStateForExpansion(
  trackState: TrackState,
  expansion: RangeAxisExpansion,
): TrackState {
  return {
    ...trackState,
    statMode: expansion.offense ? "preset" : trackState.statMode,
    defenderMode: expansion.defense ? "preset" : trackState.defenderMode,
  }
}

export function expandRangeParentBlocks(
  catalog: MatchupCatalog,
  trackState: TrackState,
  parents: ScenarioResult[],
  expanded: Record<string, RangeAxisExpansion>,
  probabilityMode: ProbabilityMode = "battle-odds",
): RangeParentBlock[] {
  const cache = new Map<string, ScenarioResult[]>()

  return parents.map((parent) => {
    const expansion = expansionOf(parent, expanded)
    if (!expansion.offense && !expansion.defense) {
      return { parent, children: [] }
    }

    const signature = signatureOf(expansion)
    let extras = cache.get(signature)
    if (!extras) {
      extras = runScenarioPipeline(
        catalog,
        trackStateForExpansion(trackState, expansion),
        probabilityMode,
      ).rows
      cache.set(signature, extras)
    }

    return {
      parent,
      children: extras.filter((child) =>
        childBelongsToExpandedParent(parent, child, expansion),
      ),
    }
  })
}
