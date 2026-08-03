import type { MatchupCatalog } from "@/lib/catalog"
import { RANGE_DEFENDER_ID, RANGE_STAT_ID, type ScenarioResult, type TrackState } from "@/lib/scenario"
import {
  defensePresetsForState,
  offensePresetsForState,
} from "@/lib/scenario"
import {
  formatStatPresetValue,
  statPresetLabel,
  type StatNameStrategy,
  type StatPreset,
} from "@/lib/stat-preset"

export type RowLabelPresets = {
  offense: StatPreset[]
  defense: StatPreset[]
}

export function rowLabels(
  catalog: MatchupCatalog,
  row: ScenarioResult,
  trackState: TrackState,
  statNameStrategy: StatNameStrategy,
  presets?: RowLabelPresets,
): {
  move: string
  stat: string
  offenseStatValueLabel: string | null
  defender: string
  defenseStatValueLabel: string | null
} {
  const findItem = (options: { id: string | number; label: string }[], id: string | number) =>
    options.find((option) => option.id === id)?.label ?? id
  const offensePresets = presets?.offense ?? offensePresetsForState(catalog, trackState)
  const defensePresets = presets?.defense ?? defensePresetsForState(catalog, trackState)

  let statLabel: string
  let offenseStatValueLabel: string | null = null
  if (row.attackerStatId === RANGE_STAT_ID && row.statRange) {
    statLabel = `${catalog.offenseStatLabel} ${row.statRange.min}-${row.statRange.max}`
  } else {
    const preset = offensePresets.find((candidate) => candidate.id === row.attackerStatId)
    if (preset) {
      statLabel = statPresetLabel(
        preset,
        catalog.matchup.attackerCalcName,
        catalog.moveCategory,
        trackState.offenseAllocationIndices[preset.id] ?? 0,
        statNameStrategy,
      )
      if (trackState.showResultStatValue) {
        const statValueText = formatStatPresetValue(preset)
        offenseStatValueLabel = statValueText === statLabel ? null : statValueText
      }
    } else {
      statLabel = row.attackerStatId
    }
  }

  let defenderLabel: string
  let defenseStatValueLabel: string | null = null
  if (row.defenderId === RANGE_DEFENDER_ID && row.defenderRanges) {
    defenderLabel = `HP ${row.defenderRanges.hp.min}-${row.defenderRanges.hp.max} · ${catalog.defenseStatLabel} ${row.defenderRanges.def.min}-${row.defenderRanges.def.max}`
  } else {
    const preset = defensePresets.find((candidate) => candidate.id === row.defenderId)
    if (preset) {
      defenderLabel = statPresetLabel(
        preset,
        catalog.matchup.defenderCalcName,
        catalog.moveCategory,
        trackState.defenseAllocationIndices[preset.id] ?? 0,
        statNameStrategy,
      )
      if (trackState.showResultStatValue) {
        const statValueText = formatStatPresetValue(preset)
        defenseStatValueLabel = statValueText === defenderLabel ? null : statValueText
      }
    } else {
      defenderLabel = row.defenderId
    }
  }

  return {
    move: String(findItem(catalog.moves, row.moveId)),
    stat: statLabel,
    offenseStatValueLabel,
    defender: defenderLabel,
    defenseStatValueLabel,
  }
}
