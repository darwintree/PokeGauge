import type { ReactNode } from "react"
import { Gauge } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import type { MatchupCatalog } from "@/lib/catalog"
import {
  defensePresetsForState,
  offensePresetsForState,
  type StatSelectMode,
} from "@/lib/scenario"
import {
  fallbackStatValueChip,
  resolveDefenseChip,
  resolveOffenseChip,
  resolvePresetChip,
  uniqueEndpointChips,
  type StatPreset,
  type StatValueChipModel,
} from "@/lib/stat-preset"
import { cn } from "@/lib/utils"

import { defenseAxisMarks, offenseAxisMarks } from "./stat-axis-marks"
import { StatRangeInput } from "./stat-range-input"
import { StatPresetChoices } from "./stat-preset-choices"
import { StatValueChip, StatValueChipPair } from "./stat-value-chip"
import { StatModeWell } from "./stat-mode-switch"
import { TrackPanel } from "../common/track-panel"
import type { ScenarioState } from "../../state/use-scenario-state"

export type StatTrackProps = {
  side: "offense" | "defense"
  catalog: MatchupCatalog
  state: ScenarioState
  expanded: boolean
  onToggle: () => void
}

function ChipSummary({
  chips,
  ranged,
}: {
  chips: StatValueChipModel[]
  ranged: boolean
}): ReactNode {
  if (ranged) {
    return <StatValueChipPair chips={chips} compact />
  }
  return (
    <span className="flex w-full min-w-0 flex-wrap items-center gap-1">
      {chips.map((chip, index) => (
        <StatValueChip
          key={`${chip.label}:${chip.actual}:${index}`}
          chip={chip}
          compact
        />
      ))}
    </span>
  )
}

function offenseSummary(catalog: MatchupCatalog, state: ScenarioState): ReactNode {
  const { trackState } = state
  const category = catalog.moveCategory
  if (trackState.statMode === "range") {
    return (
      <ChipSummary
        ranged
        chips={uniqueEndpointChips(
          resolveOffenseChip({
            calcName: catalog.matchup.attackerCalcName,
            category,
            stat: trackState.statRange.min,
            strategy: state.statNameStrategy,
          }),
          resolveOffenseChip({
            calcName: catalog.matchup.attackerCalcName,
            category,
            stat: trackState.statRange.max,
            strategy: state.statNameStrategy,
          }),
        )}
      />
    )
  }
  const presets = offensePresetsForState(catalog, trackState)
  const chips = trackState.offensePresetIds.map((id) => {
    const preset = presets.find((candidate) => candidate.id === id)
    return preset
      ? resolvePresetChip(
          preset,
          catalog.matchup.attackerCalcName,
          category,
          trackState.offenseAllocationIndices[id] ?? 0,
          state.statNameStrategy,
        )
      : fallbackStatValueChip(id)
  })
  return <ChipSummary chips={chips} ranged={false} />
}

function defenseSummary(catalog: MatchupCatalog, state: ScenarioState): ReactNode {
  const { trackState } = state
  const category = catalog.moveCategory
  if (trackState.defenderMode === "range") {
    return (
      <ChipSummary
        ranged
        chips={uniqueEndpointChips(
          resolveDefenseChip({
            calcName: catalog.matchup.defenderCalcName,
            category,
            hp: trackState.defenderRanges.hp.min,
            def: trackState.defenderRanges.def.min,
            strategy: state.statNameStrategy,
          }),
          resolveDefenseChip({
            calcName: catalog.matchup.defenderCalcName,
            category,
            hp: trackState.defenderRanges.hp.max,
            def: trackState.defenderRanges.def.max,
            strategy: state.statNameStrategy,
          }),
        )}
      />
    )
  }
  const presets = defensePresetsForState(catalog, trackState)
  const chips = trackState.defensePresetIds.map((id) => {
    const preset = presets.find((candidate) => candidate.id === id)
    return preset
      ? resolvePresetChip(
          preset,
          catalog.matchup.defenderCalcName,
          category,
          trackState.defenseAllocationIndices[id] ?? 0,
          state.statNameStrategy,
        )
      : fallbackStatValueChip(id)
  })
  return <ChipSummary chips={chips} ranged={false} />
}

function ConfirmCancelActions({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void
  onConfirm: () => void
}) {
  const intl = useIntl()
  return (
    <div className="flex shrink-0 justify-end gap-1">
      <Button type="button" variant="ghost" size="xs" className="h-7 text-xs" onClick={onCancel}>
        {intl.formatMessage({ id: "action.cancel" })}
      </Button>
      <Button type="button" size="xs" className="h-7 text-xs" onClick={onConfirm}>
        {intl.formatMessage({ id: "action.confirm" })}
      </Button>
    </div>
  )
}

function CurrentBadge() {
  return (
    <span className="rounded-[5px] border border-ink bg-signal-yellow px-1 text-[9px] font-extrabold">
      <FormattedMessage id="track.mode.current" />
    </span>
  )
}

function ModePane({
  current,
  labelId,
  trailing,
  onActivate,
  activateOnBody,
  children,
}: {
  current: boolean
  labelId: "track.range" | "track.choice" | "stat.range.dragToPlace"
  trailing: ReactNode
  onActivate?: () => void
  activateOnBody: boolean
  children: ReactNode
}) {
  const labelClass = cn(
    "text-[10px] font-extrabold leading-none transition-colors",
    current ? "text-ink" : "text-hud-muted group-hover:text-ink",
  )
  return (
    <div
      onPointerDown={activateOnBody && onActivate ? onActivate : undefined}
      className={cn(
        "group rounded-[8px] p-2 transition-colors",
        current ? "bg-token-bg" : "cursor-pointer hover:bg-token-bg/70 active:bg-token-bg",
      )}
    >
      {/* Fixed h-7 header: Current / Confirm swap in-place so + draft does not shift the axis. */}
      <div className="mb-2 flex h-7 flex-nowrap items-center justify-between gap-2">
        {onActivate ? (
          <button type="button" onClick={onActivate} className={labelClass}>
            <FormattedMessage id={labelId} />
          </button>
        ) : (
          <span className={labelClass}>
            <FormattedMessage id={labelId} />
          </span>
        )}
        <div
          className="flex h-7 min-w-0 items-center justify-end"
          onPointerDown={(event) => event.stopPropagation()}
        >
          {trailing}
        </div>
      </div>
      {children}
    </div>
  )
}

function statTrackMode(
  side: StatTrackProps["side"],
  state: ScenarioState,
): StatSelectMode {
  return side === "offense" ? state.trackState.statMode : state.trackState.defenderMode
}

function StatTrackSummary({
  side,
  catalog,
  state,
}: Pick<StatTrackProps, "side" | "catalog" | "state">) {
  const offense = side === "offense"
  const onMode = (next: StatSelectMode) =>
    offense ? state.setStatMode(next) : state.setDefenderMode(next)
  const summary = offense ? offenseSummary(catalog, state) : defenseSummary(catalog, state)
  return (
    <StatModeWell mode={statTrackMode(side, state)} onMode={onMode}>
      {summary}
    </StatModeWell>
  )
}

function StatTrackEditor({
  side,
  catalog,
  state,
  sections,
}: Pick<StatTrackProps, "side" | "catalog" | "state"> & {
  sections: "range" | "choice"
}) {
  const intl = useIntl()
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

  if (sections === "range") {
    return (
      <>
        {offense ? (
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
            draftValue={hasDraft ? (offenseDraft ?? undefined) : undefined}
            onDraftChange={hasDraft ? (stat) => state.setOffenseDraft(stat) : undefined}
          />
        ) : (
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
              draftValue={hasDraft ? defenseDraft?.hp : undefined}
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
              draftValue={hasDraft ? defenseDraft?.def : undefined}
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
        )}
      </>
    )
  }

  return offense ? (
    <StatPresetChoices
      presets={state.offensePresets}
      selectedIds={trackState.offensePresetIds}
      calcName={catalog.matchup.attackerCalcName}
      category={catalog.moveCategory}
      statNameStrategy={state.statNameStrategy}
      allocationIndices={trackState.offenseAllocationIndices}
      onToggle={state.toggleOffensePreset}
      onCycleAllocation={state.cycleOffenseAllocation}
      onDelete={state.deleteOffensePreset}
      onPersist={state.persistOffensePreset}
      adding={state.addingOffense}
      onAddClick={() => {
        if (offenseDraft == null) state.setStatMode("preset")
        state.toggleAddingOffense()
      }}
      addAriaLabel={intl.formatMessage({ id: "statPreset.addAttacker" })}
    />
  ) : (
    <StatPresetChoices
      presets={state.defensePresets}
      selectedIds={trackState.defensePresetIds}
      calcName={catalog.matchup.defenderCalcName}
      category={catalog.moveCategory}
      statNameStrategy={state.statNameStrategy}
      allocationIndices={trackState.defenseAllocationIndices}
      onToggle={state.toggleDefensePreset}
      onCycleAllocation={state.cycleDefenseAllocation}
      onDelete={state.deleteDefensePreset}
      onPersist={state.persistDefensePreset}
      adding={state.addingDefense}
      onAddClick={() => {
        if (defenseDraft == null) state.setDefenderMode("preset")
        state.toggleAddingDefense()
      }}
      addAriaLabel={intl.formatMessage({ id: "statPreset.addDefender" })}
    />
  )
}

export function StatTrack({
  side,
  catalog,
  state,
  expanded,
  onToggle,
}: StatTrackProps) {
  const offense = side === "offense"
  const label = offense ? catalog.offenseStatLabel : `HP / ${catalog.defenseStatLabel}`
  const mode = statTrackMode(side, state)
  const adding = offense ? state.addingOffense : state.addingDefense
  const setMode = (next: StatSelectMode) =>
    offense ? state.setStatMode(next) : state.setDefenderMode(next)
  function cancelDraft() {
    if (offense) state.setOffenseDraft(null)
    else state.setDefenseDraft(null)
  }

  return (
    <TrackPanel
      icon={Gauge}
      label={label}
      summary={<StatTrackSummary side={side} catalog={catalog} state={state} />}
      summaryLayout="stack"
      expanded={expanded}
      onToggle={onToggle}
    >
      <div className="space-y-2">
        <ModePane
          current={adding || mode === "range"}
          labelId={adding ? "stat.range.dragToPlace" : "track.range"}
          activateOnBody={!adding}
          onActivate={
            adding
              ? undefined
              : () => {
                  cancelDraft()
                  setMode("range")
                }
          }
          trailing={
            adding ? (
              <ConfirmCancelActions
                onCancel={cancelDraft}
                onConfirm={() => {
                  if (offense) {
                    if (state.offenseDraft != null) state.confirmAddOffense(state.offenseDraft)
                    return
                  }
                  if (state.defenseDraft != null) {
                    state.confirmAddDefense(state.defenseDraft.hp, state.defenseDraft.def)
                  }
                }}
              />
            ) : mode === "range" ? (
              <CurrentBadge />
            ) : null
          }
        >
          <StatTrackEditor side={side} catalog={catalog} state={state} sections="range" />
        </ModePane>
        <ModePane
          current={!adding && mode === "preset"}
          labelId="track.choice"
          activateOnBody
          onActivate={() => setMode("preset")}
          trailing={!adding && mode === "preset" ? <CurrentBadge /> : null}
        >
          <StatTrackEditor side={side} catalog={catalog} state={state} sections="choice" />
        </ModePane>
      </div>
    </TrackPanel>
  )
}
