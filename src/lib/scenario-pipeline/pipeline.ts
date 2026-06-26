import {
  ATTACKER_ITEM_NAMES,
  ATTACKER_STAT_SETUPS,
  computeDamage,
  DEFENDER_SETUPS,
  MOVE_NAMES,
} from "@/lib/calc-adapter"
import type { MatchupCatalog } from "@/lib/catalog/types"

import type { ScenarioRow, TrackState } from "./types"

function configOrder(options: { id: string }[]) {
  return Object.fromEntries(options.map((o, i) => [o.id, i]))
}

function computeRow(
  catalog: MatchupCatalog,
  moveId: string,
  attackerStatId: string,
  attackerItemId: string,
  defenderId: string,
): ScenarioRow | null {
  const statSetup = ATTACKER_STAT_SETUPS[attackerStatId]
  const defSetup = DEFENDER_SETUPS[defenderId]
  const itemName = ATTACKER_ITEM_NAMES[attackerItemId]
  const moveName = MOVE_NAMES[moveId]
  if (!statSetup || !defSetup || !moveName) return null
  if (itemName === undefined && attackerItemId !== "none") return null

  const { attackerSpecies, defenderSpecies } = catalog.matchup
  const computed = computeDamage(
    attackerSpecies,
    defenderSpecies,
    moveName,
    statSetup,
    itemName,
    defSetup,
  )

  return {
    moveId,
    attackerStatId,
    attackerItemId,
    defenderId,
    minDamage: computed.minDamage,
    maxDamage: computed.maxDamage,
    avgDamage: computed.avgDamage,
    minPercent: computed.minPercent,
    maxPercent: computed.maxPercent,
    avgPercent: computed.avgPercent,
    critMinDamage: computed.critMinDamage,
    critMaxDamage: computed.critMaxDamage,
    critMinPercent: computed.critMinPercent,
    critMaxPercent: computed.critMaxPercent,
    ohkoChance: computed.ohkoChance,
  }
}

export function runScenarioPipeline(
  catalog: MatchupCatalog,
  trackState: TrackState,
): ScenarioRow[] {
  if (trackState.statMode !== "preset") {
    throw new Error("Range mode not supported until slice #4")
  }

  const moveOrder = configOrder(catalog.moves)
  const statOrder = configOrder(catalog.attackerStats)
  const itemOrder = configOrder(catalog.attackerItems)
  const defenderOrder = configOrder(catalog.defenderBulks)

  const rows: ScenarioRow[] = []

  for (const moveId of trackState.moveIds) {
    for (const attackerStatId of trackState.attackerStatIds) {
      for (const attackerItemId of trackState.attackerItemIds) {
        for (const defenderId of trackState.defenderIds) {
          const row = computeRow(
            catalog,
            moveId,
            attackerStatId,
            attackerItemId,
            defenderId,
          )
          if (row) rows.push(row)
        }
      }
    }
  }

  return rows.sort((a, b) => {
    const byMove = moveOrder[a.moveId] - moveOrder[b.moveId]
    if (byMove !== 0) return byMove
    const byStat = statOrder[a.attackerStatId] - statOrder[b.attackerStatId]
    if (byStat !== 0) return byStat
    const byItem = itemOrder[a.attackerItemId] - itemOrder[b.attackerItemId]
    if (byItem !== 0) return byItem
    return defenderOrder[a.defenderId] - defenderOrder[b.defenderId]
  })
}

export function defaultTrackState(catalog: MatchupCatalog): TrackState {
  return {
    moveIds: [...catalog.defaultMoveIds],
    statMode: "preset",
    attackerStatIds: [...catalog.defaultAttackerStatIds],
    attackerItemIds: [...catalog.defaultAttackerItemIds],
    defenderIds: [...catalog.defaultDefenderIds],
  }
}

export function rowLabels(
  catalog: MatchupCatalog,
  row: ScenarioRow,
): {
  move: string
  stat: string
  item: string
  defender: string
} {
  const find = (options: { id: string; label: string }[], id: string) =>
    options.find((o) => o.id === id)?.label ?? id

  return {
    move: find(catalog.moves, row.moveId),
    stat: find(catalog.attackerStats, row.attackerStatId),
    item: find(catalog.attackerItems, row.attackerItemId),
    defender: find(catalog.defenderBulks, row.defenderId),
  }
}

export function expectedRowCount(trackState: TrackState): number {
  if (trackState.statMode === "range") return 0
  return (
    trackState.moveIds.length *
    trackState.attackerStatIds.length *
    trackState.attackerItemIds.length *
    trackState.defenderIds.length
  )
}
