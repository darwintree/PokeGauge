import type { MatchupCatalog } from "@/lib/catalog"
import { RANGE_DEFENDER_ID, RANGE_STAT_ID, type ScenarioResult, type TrackState } from "@/lib/scenario"
import {
  defensePresetsForState,
  offensePresetsForState,
} from "@/lib/scenario"
import {
  fallbackStatValueChip,
  resolveDefenseChip,
  resolveOffenseChip,
  resolvePresetChip,
  uniqueEndpointChips,
  type StatNameStrategy,
  type StatPreset,
  type StatValueChipModel,
} from "@/lib/stat-preset"

export type RowLabelPresets = {
  offense: StatPreset[]
  defense: StatPreset[]
}

export function rowIdentity(
  catalog: MatchupCatalog,
  row: ScenarioResult,
  trackState: TrackState,
  statNameStrategy: StatNameStrategy,
  presets?: RowLabelPresets,
): {
  move: string
  offenseChips: StatValueChipModel[]
  defenseChips: StatValueChipModel[]
} {
  const findItem = (options: { id: string | number; label: string }[], id: string | number) =>
    options.find((option) => option.id === id)?.label ?? String(id)
  const offensePresets = presets?.offense ?? offensePresetsForState(catalog, trackState)
  const defensePresets = presets?.defense ?? defensePresetsForState(catalog, trackState)
  const category = catalog.moveCategory

  let offenseChips: StatValueChipModel[]
  if (row.attackerStatId === RANGE_STAT_ID && row.statRange) {
    offenseChips = uniqueEndpointChips(
      resolveOffenseChip({
        calcName: catalog.matchup.attackerCalcName,
        category,
        stat: row.statRange.min,
        strategy: statNameStrategy,
      }),
      resolveOffenseChip({
        calcName: catalog.matchup.attackerCalcName,
        category,
        stat: row.statRange.max,
        strategy: statNameStrategy,
      }),
    )
  } else {
    const preset = offensePresets.find((candidate) => candidate.id === row.attackerStatId)
    offenseChips = [
      preset
        ? resolvePresetChip(
            preset,
            catalog.matchup.attackerCalcName,
            category,
            trackState.offenseAllocationIndices[preset.id] ?? 0,
            statNameStrategy,
          )
        : fallbackStatValueChip(row.attackerStatId),
    ]
  }

  let defenseChips: StatValueChipModel[]
  if (row.defenderId === RANGE_DEFENDER_ID && row.defenderRanges) {
    defenseChips = uniqueEndpointChips(
      resolveDefenseChip({
        calcName: catalog.matchup.defenderCalcName,
        category,
        hp: row.defenderRanges.hp.min,
        def: row.defenderRanges.def.min,
        strategy: statNameStrategy,
      }),
      resolveDefenseChip({
        calcName: catalog.matchup.defenderCalcName,
        category,
        hp: row.defenderRanges.hp.max,
        def: row.defenderRanges.def.max,
        strategy: statNameStrategy,
      }),
    )
  } else {
    const preset = defensePresets.find((candidate) => candidate.id === row.defenderId)
    defenseChips = [
      preset
        ? resolvePresetChip(
            preset,
            catalog.matchup.defenderCalcName,
            category,
            trackState.defenseAllocationIndices[preset.id] ?? 0,
            statNameStrategy,
          )
        : fallbackStatValueChip(row.defenderId),
    ]
  }

  return {
    move: findItem(catalog.moves, row.moveId),
    offenseChips,
    defenseChips,
  }
}
