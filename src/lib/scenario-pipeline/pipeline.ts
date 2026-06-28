import {
  ATTACKER_ITEM_NAMES,
  computeDamage,
  computeDamageForCombinedRange,
  computeDamageForDefenderRange,
  computeDamageForStatRange,
  defaultDefenderDefRange,
  defaultDefenderHpRange,
  defaultOffenseStatRange,
  getAttackerStatSetups,
  getDefenderSetups,
} from "@/lib/calc-adapter"
import type { MatchupCatalog } from "@/lib/catalog/types"

import type { DefenderStatRanges, ScenarioRow, TrackState } from "./types"
import { RANGE_DEFENDER_ID, RANGE_STAT_ID } from "./types"

function configOrder(options: { id: string }[]) {
  return Object.fromEntries(options.map((o, i) => [o.id, i]))
}

function statSortKey(attackerStatId: string, statOrder: Record<string, number>) {
  return attackerStatId === RANGE_STAT_ID ? 1000 : (statOrder[attackerStatId] ?? 0)
}

function defenderSortKey(defenderId: string, defenderOrder: Record<string, number>) {
  return defenderId === RANGE_DEFENDER_ID ? 1000 : (defenderOrder[defenderId] ?? 0)
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

function computeOffenseRangeRow(
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

function computeDefenderRangeRow(
  catalog: MatchupCatalog,
  moveId: string,
  attackerStatId: string,
  attackerItemId: string,
  defenderRanges: DefenderStatRanges,
): ScenarioRow | null {
  const statSetups = getAttackerStatSetups(catalog.moveCategory)
  const statSetup = statSetups[attackerStatId]
  const itemName = ATTACKER_ITEM_NAMES[attackerItemId]
  const moveName = resolveMoveName(catalog, moveId)
  if (!statSetup || !moveName) return null
  if (itemName === undefined && attackerItemId !== "none") return null

  const { attackerSpecies, defenderSpecies } = catalog.matchup
  const computed = computeDamageForDefenderRange(
    attackerSpecies,
    defenderSpecies,
    moveName,
    statSetup,
    catalog.moveCategory,
    itemName,
    defenderRanges.hp,
    defenderRanges.def,
  )

  return {
    moveId,
    attackerStatId,
    attackerItemId,
    defenderId: RANGE_DEFENDER_ID,
    defenderRanges: {
      hp: { ...defenderRanges.hp },
      def: { ...defenderRanges.def },
    },
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

function computeCombinedRangeRow(
  catalog: MatchupCatalog,
  moveId: string,
  statRange: TrackState["statRange"],
  attackerItemId: string,
  defenderRanges: DefenderStatRanges,
): ScenarioRow | null {
  const itemName = ATTACKER_ITEM_NAMES[attackerItemId]
  const moveName = resolveMoveName(catalog, moveId)
  if (!moveName) return null
  if (itemName === undefined && attackerItemId !== "none") return null

  const { attackerSpecies, defenderSpecies } = catalog.matchup
  const computed = computeDamageForCombinedRange(
    attackerSpecies,
    defenderSpecies,
    moveName,
    statRange,
    catalog.moveCategory,
    itemName,
    defenderRanges.hp,
    defenderRanges.def,
  )

  return {
    moveId,
    attackerStatId: RANGE_STAT_ID,
    attackerItemId,
    defenderId: RANGE_DEFENDER_ID,
    statRange: { ...statRange },
    defenderRanges: {
      hp: { ...defenderRanges.hp },
      def: { ...defenderRanges.def },
    },
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
    return (
      defenderSortKey(a.defenderId, defenderOrder) -
      defenderSortKey(b.defenderId, defenderOrder)
    )
  })
}

export function runScenarioPipeline(
  catalog: MatchupCatalog,
  trackState: TrackState,
): ScenarioRow[] {
  const rows: ScenarioRow[] = []
  const offenseIsRange = trackState.statMode === "range"
  const defenseIsRange = trackState.defenderMode === "range"

  for (const moveId of trackState.moveIds) {
    for (const attackerItemId of trackState.attackerItemIds) {
      if (offenseIsRange && defenseIsRange) {
        const row = computeCombinedRangeRow(
          catalog,
          moveId,
          trackState.statRange,
          attackerItemId,
          trackState.defenderRanges,
        )
        if (row) rows.push(row)
        continue
      }

      if (offenseIsRange) {
        for (const defenderId of trackState.defenderIds) {
          const row = computeOffenseRangeRow(
            catalog,
            moveId,
            trackState.statRange,
            attackerItemId,
            defenderId,
          )
          if (row) rows.push(row)
        }
        continue
      }

      if (defenseIsRange) {
        for (const attackerStatId of trackState.attackerStatIds) {
          const row = computeDefenderRangeRow(
            catalog,
            moveId,
            attackerStatId,
            attackerItemId,
            trackState.defenderRanges,
          )
          if (row) rows.push(row)
        }
        continue
      }

      for (const attackerStatId of trackState.attackerStatIds) {
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
  const { attackerSpecies, defenderSpecies } = catalog.matchup
  return {
    moveIds: [...catalog.defaultMoveIds],
    statMode: "preset",
    attackerStatIds: [...catalog.defaultAttackerStatIds],
    statRange: defaultOffenseStatRange(attackerSpecies, catalog.moveCategory),
    statRangeTouched: false,
    attackerItemIds: [...catalog.defaultAttackerItemIds],
    defenderMode: "preset",
    defenderIds: [...catalog.defaultDefenderIds],
    defenderRanges: {
      hp: defaultDefenderHpRange(defenderSpecies),
      def: defaultDefenderDefRange(defenderSpecies, catalog.moveCategory),
    },
    defenderRangeTouched: false,
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

  const defLabel = catalog.moveCategory === "physical" ? "物防" : "特防"

  return {
    move: find(catalog.moves, row.moveId),
    stat:
      row.attackerStatId === RANGE_STAT_ID && row.statRange
        ? `${catalog.offenseStatLabel} ${row.statRange.min}–${row.statRange.max}`
        : find(catalog.attackerStats, row.attackerStatId),
    item: find(catalog.attackerItems, row.attackerItemId),
    defender:
      row.defenderId === RANGE_DEFENDER_ID && row.defenderRanges
        ? `HP ${row.defenderRanges.hp.min}–${row.defenderRanges.hp.max} · ${defLabel} ${row.defenderRanges.def.min}–${row.defenderRanges.def.max}`
        : find(catalog.defenderBulks, row.defenderId),
  }
}

export function expectedRowCount(trackState: TrackState): number {
  const offenseCount =
    trackState.statMode === "range" ? 1 : trackState.attackerStatIds.length
  const defenderCount =
    trackState.defenderMode === "range" ? 1 : trackState.defenderIds.length
  return (
    trackState.moveIds.length *
    offenseCount *
    trackState.attackerItemIds.length *
    defenderCount
  )
}
