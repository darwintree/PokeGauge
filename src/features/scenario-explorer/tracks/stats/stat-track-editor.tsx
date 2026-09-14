import type { ReactNode } from "react"
import { resolvePresetChip, type StatPreset } from "@/lib/stat-preset"
import { defenseAxisMarks, offenseAxisMarks } from "./stat-axis-marks"
import { StatRangeInput } from "./stat-range-input"
import type { StatTrackProps } from "./stat-track"

export function StatTrackEditor({
  side,
  catalog,
  state,
}: StatTrackProps): ReactNode {
  const { trackState } = state
  const offense = side === "offense"
  const offenseDraft = state.offenseDraft
  const defenseDraft = state.defenseDraft
  const hasDraft = offense ? offenseDraft != null : defenseDraft != null
  function bandOf(preset: StatPreset) {
    return resolvePresetChip(
      preset,
      offense ? catalog.matchup.attackerCalcName : catalog.matchup.defenderCalcName,
      catalog.moveCategory,
      (offense
        ? trackState.offenseAllocationIndices
        : trackState.defenseAllocationIndices)[preset.id] ?? 0,
      state.statNameStrategy,
    ).band
  }

  if (offense) {
    return (
      <StatRangeInput
        statLabel={catalog.offenseStatLabel}
        bounds={state.offenseBounds}
        value={trackState.statRange}
        onChange={state.setStatRange}
        marks={offenseAxisMarks(
          state.offensePresets,
          trackState.offensePresetIds,
          bandOf,
        )}
        draftValue={offenseDraft ?? undefined}
        onDraftChange={hasDraft ? (stat) => state.setOffenseDraft(stat) : undefined}
      />
    )
  }

  return (
    <>
      <StatRangeInput
        statLabel="HP"
        bounds={state.defenderHpBounds}
        value={trackState.defenderRanges.hp}
        onChange={(hp) =>
          state.setDefenderRanges({ hp, def: trackState.defenderRanges.def })
        }
        marks={defenseAxisMarks(
          state.defensePresets,
          trackState.defensePresetIds,
          "hp",
          bandOf,
        )}
        draftValue={defenseDraft?.hp}
        onDraftChange={
          hasDraft
            ? (hp) =>
                state.setDefenseDraft((current) =>
                  current ? { ...current, hp } : current,
                )
            : undefined
        }
      />
      <StatRangeInput
        statLabel={catalog.defenseStatLabel}
        bounds={state.defenderDefBounds}
        value={trackState.defenderRanges.def}
        onChange={(def) =>
          state.setDefenderRanges({ hp: trackState.defenderRanges.hp, def })
        }
        marks={defenseAxisMarks(
          state.defensePresets,
          trackState.defensePresetIds,
          "def",
          bandOf,
        )}
        draftValue={defenseDraft?.def}
        onDraftChange={
          hasDraft
            ? (def) =>
                state.setDefenseDraft((current) =>
                  current ? { ...current, def } : current,
                )
            : undefined
        }
      />
    </>
  )
}
