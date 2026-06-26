import {
  ATTACKER_ITEM_NAMES,
  computeDamage,
  computeDamageForStatRange,
  defaultStatRange,
  getAttackerStatSetups,
  getDefenderSetups,
} from "@/lib/calc-adapter"
import type { MatchupCatalog } from "@/lib/catalog/types"

import type { ScenarioRow, TrackState } from "./types"
import { RANGE_STAT_ID } from "./types"

function configOrder(options: { id: string }[]) {
  return Object.fromEntries(options.map((o, i) => [o.id, i]))
}

function statSortKey(attackerStatId: string, statOrder: Record<string, number>) {
  return attackerStatId === RANGE_STAT_ID ? 1000 : (statOrder[attackerStatId] ?? 0)
}

function resolveMoveName(catalog: MatchupCatalog, moveId: string): string | undefined {
  return catalog.moves.find((m) => m.id === moveId)?.moveName
}

function computePresetRow(
  catalog: MatchupCatalog,
  moveId: string,
  attackerStatId: string,
  attackerItemId: string,
  defenderId: string,
): ScenarioRow | null {
  const statSetups = getAttackerStatSetups(catalog.moveCategory)
  const defenderSetups = getDefenderSetups(catalog.moveCategory)
  const statSetup = statSetups[attackerStatId]
  const defSetup = defenderSetups[defenderId]
  const itemName = ATTACKER_ITEM_NAMES[attackerItemId]
  const moveName = resolveMoveName(catalog, moveId)
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

function computeRangeRow(
  catalog: MatchupCatalog,
  moveId: string,
  statRange: TrackState["statRange"],
  attackerItemId: string,
  defenderId: string,
): ScenarioRow | null {
  const defenderSetups = getDefenderSetups(catalog.moveCategory)
  const defSetup = defenderSetups[defenderId]
  const itemName = ATTACKER_ITEM_NAMES[attackerItemId]
  const moveName = resolveMoveName(catalog, moveId)
  if (!defSetup || !moveName) return null
  if (itemName === undefined && attackerItemId !== "none") return null

  const { attackerSpecies, defenderSpecies } = catalog.matchup
  const computed = computeDamageForStatRange(
    attackerSpecies,
    defenderSpecies,
    moveName,
    statRange,
    catalog.moveCategory,
    itemName,
    defSetup,
  )

  return {
    moveId,
    attackerStatId: RANGE_STAT_ID,
    attackerItemId,
    defenderId,
    statRange: { ...statRange },
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

function sortRows(
  rows: ScenarioRow[],
  catalog: MatchupCatalog,
): ScenarioRow[] {
  const moveOrder = configOrder(catalog.moves)
  const statOrder = configOrder(catalog.attackerStats)
  const itemOrder = configOrder(catalog.attackerItems)
  const defenderOrder = configOrder(catalog.defenderBulks)

  return rows.sort((a, b) => {
    const byMove = moveOrder[a.moveId] - moveOrder[b.moveId]
    if (byMove !== 0) return byMove
    const byStat =
      statSortKey(a.attackerStatId, statOrder) -
      statSortKey(b.attackerStatId, statOrder)
    if (byStat !== 0) return byStat
    const byItem = itemOrder[a.attackerItemId] - itemOrder[b.attackerItemId]
    if (byItem !== 0) return byItem
    return defenderOrder[a.defenderId] - defenderOrder[b.defenderId]
  })
}

export function runScenarioPipeline(
  catalog: MatchupCatalog,
  trackState: TrackState,
): ScenarioRow[] {
  if (trackState.statMode === "range") {
    const rows: ScenarioRow[] = []
    for (const moveId of trackState.moveIds) {
      for (const attackerItemId of trackState.attackerItemIds) {
        for (const defenderId of trackState.defenderIds) {
          const row = computeRangeRow(
            catalog,
            moveId,
            trackState.statRange,
            attackerItemId,
            defenderId,
          )
          if (row) rows.push(row)
        }
      }
    }
    return sortRows(rows, catalog)
  }

  const rows: ScenarioRow[] = []
  for (const moveId of trackState.moveIds) {
    for (const attackerStatId of trackState.attackerStatIds) {
      for (const attackerItemId of trackState.attackerItemIds) {
        for (const defenderId of trackState.defenderIds) {
          const row = computePresetRow(
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

  return sortRows(rows, catalog)
}

export function defaultTrackState(catalog: MatchupCatalog): TrackState {
  return {
    moveIds: [...catalog.defaultMoveIds],
    statMode: "preset",
    attackerStatIds: [...catalog.defaultAttackerStatIds],
    statRange: defaultStatRange(
      catalog.matchup.attackerSpecies,
      catalog.moveCategory,
    ),
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
    stat:
      row.attackerStatId === RANGE_STAT_ID && row.statRange
        ? `${catalog.offenseStatLabel} ${row.statRange.min}–${row.statRange.max}`
        : find(catalog.attackerStats, row.attackerStatId),
    item: find(catalog.attackerItems, row.attackerItemId),
    defender: find(catalog.defenderBulks, row.defenderId),
  }
}

export function expectedRowCount(trackState: TrackState): number {
  const offenseCount =
    trackState.statMode === "range" ? 1 : trackState.attackerStatIds.length
  return (
    trackState.moveIds.length *
    offenseCount *
    trackState.attackerItemIds.length *
    trackState.defenderIds.length
  )
}
