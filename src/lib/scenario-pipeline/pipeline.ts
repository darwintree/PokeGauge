import {
  ATTACKER_ITEM_NAMES,
  computeDamage,
  computeDamageForCombinedRange,
  computeDamageForDefenderRange,
  computeDamageForStatRange,
  defaultDefenderDefRange,
  defaultDefenderHpRange,
  defaultOffenseStatRange,
} from "@/lib/calc-adapter"
import {
  defenseSetupForTemplate,
  offenseSetupForTemplate,
} from "@/lib/calc-adapter/template-range"
import type { MatchupCatalog } from "@/lib/catalog/types"
import {
  buildSystemDefenseTemplates,
  buildSystemOffenseTemplates,
  defaultDefenseSelection,
  defaultOffenseSelection,
  formatTemplateActual,
  loadUserDefenseTemplates,
  loadUserOffenseTemplates,
  mergeTemplates,
  templateCardLabel,
  type StatNameStrategy,
  type StatValueTemplate,
} from "@/lib/stat-value-template"

import type { DefenderStatRanges, ScenarioRow, TrackState } from "./types"
import { RANGE_DEFENDER_ID, RANGE_STAT_ID } from "./types"

function configOrder(options: { id: string | number }[]) {
  return Object.fromEntries(options.map((o, i) => [o.id, i]))
}

function templateSortKey(templateId: string, order: Record<string, number>) {
  return templateId === RANGE_STAT_ID || templateId === RANGE_DEFENDER_ID
    ? 1000
    : (order[templateId] ?? 999)
}

function resolveMoveName(catalog: MatchupCatalog, moveId: number): string | undefined {
  return catalog.moves.find((m) => m.id === moveId)?.moveName
}

export function offenseTemplatesForState(
  catalog: MatchupCatalog,
  trackState: TrackState,
): StatValueTemplate[] {
  const { attackerSpecies } = catalog.matchup
  const system = buildSystemOffenseTemplates(attackerSpecies, catalog.moveCategory)
  const user = loadUserOffenseTemplates(String(catalog.matchup.attackerId))
  return mergeTemplates(system, user, trackState.offenseTemporaryTemplates)
}

export function defenseTemplatesForState(
  catalog: MatchupCatalog,
  trackState: TrackState,
): StatValueTemplate[] {
  const { defenderSpecies } = catalog.matchup
  const system = buildSystemDefenseTemplates(defenderSpecies, catalog.moveCategory)
  const user = loadUserDefenseTemplates(String(catalog.matchup.defenderId))
  return mergeTemplates(system, user, trackState.defenseTemporaryTemplates)
}

function findTemplate(templates: StatValueTemplate[], id: string): StatValueTemplate | undefined {
  return templates.find((t) => t.id === id)
}

function computePresetRow(
  catalog: MatchupCatalog,
  moveId: number,
  offenseTemplateId: string,
  attackerItemId: string,
  defenseTemplateId: string,
  offenseTemplates: StatValueTemplate[],
  defenseTemplates: StatValueTemplate[],
): ScenarioRow | null {
  const offenseTemplate = findTemplate(offenseTemplates, offenseTemplateId)
  const defenseTemplate = findTemplate(defenseTemplates, defenseTemplateId)
  const itemName = ATTACKER_ITEM_NAMES[attackerItemId]
  const moveName = resolveMoveName(catalog, moveId)
  if (!offenseTemplate || !defenseTemplate || !moveName) return null
  if (itemName === undefined && attackerItemId !== "none") return null

  const { attackerSpecies, defenderSpecies } = catalog.matchup
  const statSetup = offenseSetupForTemplate(
    attackerSpecies,
    catalog.moveCategory,
    offenseTemplate,
  )
  const defSetup = defenseSetupForTemplate(
    defenderSpecies,
    catalog.moveCategory,
    defenseTemplate,
  )

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
    attackerStatId: offenseTemplateId,
    attackerItemId,
    defenderId: defenseTemplateId,
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
  moveId: number,
  statRange: TrackState["statRange"],
  attackerItemId: string,
  defenseTemplateId: string,
  defenseTemplates: StatValueTemplate[],
): ScenarioRow | null {
  const defenseTemplate = findTemplate(defenseTemplates, defenseTemplateId)
  const itemName = ATTACKER_ITEM_NAMES[attackerItemId]
  const moveName = resolveMoveName(catalog, moveId)
  if (!defenseTemplate || !moveName) return null
  if (itemName === undefined && attackerItemId !== "none") return null

  const { attackerSpecies, defenderSpecies } = catalog.matchup
  const defSetup = defenseSetupForTemplate(
    defenderSpecies,
    catalog.moveCategory,
    defenseTemplate,
  )
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
    defenderId: defenseTemplateId,
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
  moveId: number,
  offenseTemplateId: string,
  attackerItemId: string,
  defenderRanges: DefenderStatRanges,
  offenseTemplates: StatValueTemplate[],
): ScenarioRow | null {
  const offenseTemplate = findTemplate(offenseTemplates, offenseTemplateId)
  const itemName = ATTACKER_ITEM_NAMES[attackerItemId]
  const moveName = resolveMoveName(catalog, moveId)
  if (!offenseTemplate || !moveName) return null
  if (itemName === undefined && attackerItemId !== "none") return null

  const { attackerSpecies, defenderSpecies } = catalog.matchup
  const statSetup = offenseSetupForTemplate(
    attackerSpecies,
    catalog.moveCategory,
    offenseTemplate,
  )
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
    attackerStatId: offenseTemplateId,
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
  moveId: number,
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
  offenseTemplates: StatValueTemplate[],
  defenseTemplates: StatValueTemplate[],
  catalog: MatchupCatalog,
): ScenarioRow[] {
  const moveOrder = configOrder(catalog.moves)
  const offenseOrder = configOrder(offenseTemplates)
  const itemOrder = configOrder(catalog.attackerItems)
  const defenseOrder = configOrder(defenseTemplates)

  return rows.sort((a, b) => {
    const byMove = moveOrder[a.moveId] - moveOrder[b.moveId]
    if (byMove !== 0) return byMove
    const byStat =
      templateSortKey(a.attackerStatId, offenseOrder) -
      templateSortKey(b.attackerStatId, offenseOrder)
    if (byStat !== 0) return byStat
    const byItem = itemOrder[a.attackerItemId] - itemOrder[b.attackerItemId]
    if (byItem !== 0) return byItem
    return (
      templateSortKey(a.defenderId, defenseOrder) -
      templateSortKey(b.defenderId, defenseOrder)
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
  const offenseTemplates = offenseTemplatesForState(catalog, trackState)
  const defenseTemplates = defenseTemplatesForState(catalog, trackState)

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
        for (const defenseTemplateId of trackState.defenseTemplateIds) {
          const row = computeOffenseRangeRow(
            catalog,
            moveId,
            trackState.statRange,
            attackerItemId,
            defenseTemplateId,
            defenseTemplates,
          )
          if (row) rows.push(row)
        }
        continue
      }

      if (defenseIsRange) {
        for (const offenseTemplateId of trackState.offenseTemplateIds) {
          const row = computeDefenderRangeRow(
            catalog,
            moveId,
            offenseTemplateId,
            attackerItemId,
            trackState.defenderRanges,
            offenseTemplates,
          )
          if (row) rows.push(row)
        }
        continue
      }

      for (const offenseTemplateId of trackState.offenseTemplateIds) {
        for (const defenseTemplateId of trackState.defenseTemplateIds) {
          const row = computePresetRow(
            catalog,
            moveId,
            offenseTemplateId,
            attackerItemId,
            defenseTemplateId,
            offenseTemplates,
            defenseTemplates,
          )
          if (row) rows.push(row)
        }
      }
    }
  }

  return sortRows(rows, offenseTemplates, defenseTemplates, catalog)
}

export function defaultTrackState(catalog: MatchupCatalog): TrackState {
  const { attackerSpecies, defenderSpecies } = catalog.matchup
  const offenseSystem = buildSystemOffenseTemplates(attackerSpecies, catalog.moveCategory)
  const defenseSystem = buildSystemDefenseTemplates(defenderSpecies, catalog.moveCategory)
  const offenseUser = loadUserOffenseTemplates(String(catalog.matchup.attackerId))
  const defenseUser = loadUserDefenseTemplates(String(catalog.matchup.defenderId))

  return {
    visibleMoveIds: [...catalog.defaultMoveIds],
    moveIds: [...catalog.defaultMoveIds],
    statMode: "preset",
    offenseTemplateIds: defaultOffenseSelection(offenseSystem, offenseUser),
    offenseTemporaryTemplates: [],
    statRange: defaultOffenseStatRange(attackerSpecies, catalog.moveCategory),
    statRangeTouched: false,
    showOffenseActual: false,
    offenseAllocationIndices: {},
    attackerItemIds: [...catalog.defaultAttackerItemIds],
    defenderMode: "preset",
    defenseTemplateIds: defaultDefenseSelection(defenseSystem, defenseUser),
    defenseTemporaryTemplates: [],
    defenderRanges: {
      hp: defaultDefenderHpRange(defenderSpecies),
      def: defaultDefenderDefRange(defenderSpecies, catalog.moveCategory),
    },
    defenderRangeTouched: false,
    showDefenseActual: false,
    showResultActual: false,
    defenseAllocationIndices: {},
  }
}

export type RowLabelTemplates = {
  offense: StatValueTemplate[]
  defense: StatValueTemplate[]
}

export function rowLabels(
  catalog: MatchupCatalog,
  row: ScenarioRow,
  trackState: TrackState,
  statNameStrategy: StatNameStrategy,
  templates?: RowLabelTemplates,
): {
  move: string
  stat: string
  statActual: string | null
  item: string
  defender: string
  defenderActual: string | null
} {
  const findItem = (options: { id: string | number; label: string }[], id: string | number) =>
    options.find((o) => o.id === id)?.label ?? id

  const defStatLabel = catalog.defenseStatLabel
  const offenseTemplates = templates?.offense ?? offenseTemplatesForState(catalog, trackState)
  const defenseTemplates = templates?.defense ?? defenseTemplatesForState(catalog, trackState)

  let statLabel: string
  let statActual: string | null = null
  if (row.attackerStatId === RANGE_STAT_ID && row.statRange) {
    statLabel = `${catalog.offenseStatLabel} ${row.statRange.min}–${row.statRange.max}`
  } else {
    const template = offenseTemplates.find((t) => t.id === row.attackerStatId)
    if (template) {
      statLabel = templateCardLabel(
        template,
        catalog.matchup.attackerSpecies,
        catalog.moveCategory,
        trackState.offenseAllocationIndices[template.id] ?? 0,
        statNameStrategy,
      )
      if (trackState.showResultActual) {
        statActual = formatTemplateActual(template)
      }
    } else {
      statLabel = row.attackerStatId
    }
  }

  let defenderLabel: string
  let defenderActual: string | null = null
  if (row.defenderId === RANGE_DEFENDER_ID && row.defenderRanges) {
    defenderLabel = `HP ${row.defenderRanges.hp.min}–${row.defenderRanges.hp.max} · ${defStatLabel} ${row.defenderRanges.def.min}–${row.defenderRanges.def.max}`
  } else {
    const template = defenseTemplates.find((t) => t.id === row.defenderId)
    if (template) {
      defenderLabel = templateCardLabel(
        template,
        catalog.matchup.defenderSpecies,
        catalog.moveCategory,
        trackState.defenseAllocationIndices[template.id] ?? 0,
        statNameStrategy,
      )
      if (trackState.showResultActual) {
        defenderActual = formatTemplateActual(template)
      }
    } else {
      defenderLabel = row.defenderId
    }
  }

  return {
    move: String(findItem(catalog.moves, row.moveId)),
    stat: statLabel,
    statActual,
    item: String(findItem(catalog.attackerItems, row.attackerItemId)),
    defender: defenderLabel,
    defenderActual,
  }
}

export function expectedRowCount(trackState: TrackState): number {
  const offenseCount =
    trackState.statMode === "range" ? 1 : trackState.offenseTemplateIds.length
  const defenderCount =
    trackState.defenderMode === "range" ? 1 : trackState.defenseTemplateIds.length
  return (
    trackState.moveIds.length *
    offenseCount *
    trackState.attackerItemIds.length *
    defenderCount
  )
}
