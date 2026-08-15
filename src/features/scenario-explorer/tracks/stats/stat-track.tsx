import type { ReactNode } from "react"
import { Gauge } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"

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
  type StatValueChipModel,
} from "@/lib/stat-preset"
import { cn } from "@/lib/utils"

import { StatRangeInput } from "./stat-range-input"
import {
  AddDefensePresetPanel,
  AddOffensePresetPanel,
  StatPresetChoices,
} from "./stat-preset-choices"
import { StatValueChip, StatValueChipPair } from "./stat-value-chip"
import { StatModeWell } from "./stat-mode-switch"
import { ShowStatValuesSwitch } from "../common/show-stat-values-switch"
import { TrackPanel } from "../common/track-panel"
import type { ScenarioState } from "../../state/use-scenario-state"

type StatTrackProps = {
  side: "offense" | "defense"
  catalog: MatchupCatalog
  state: ScenarioState
  expanded: boolean
  onToggle: () => void
}

function ChipSummary({
  chips,
  ranged,
  showActual,
}: {
  chips: StatValueChipModel[]
  ranged: boolean
  showActual: boolean
}): ReactNode {
  if (ranged) {
    return <StatValueChipPair chips={chips} showActual={showActual} compact />
  }
  return (
    <span className="flex w-full min-w-0 flex-wrap items-center gap-1">
      {chips.map((chip, index) => (
        <StatValueChip
          key={`${chip.label}:${chip.actual}:${index}`}
          chip={chip}
          showActual={showActual}
          compact
        />
      ))}
    </span>
  )
}

function offenseSummary(catalog: MatchupCatalog, state: ScenarioState): ReactNode {
  const { trackState } = state
  const category = catalog.moveCategory
  const showActual = trackState.showOffenseStatValue
  if (trackState.statMode === "range") {
    return (
      <ChipSummary
        ranged
        showActual={showActual}
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
  return <ChipSummary chips={chips} ranged={false} showActual={showActual} />
}

function defenseSummary(catalog: MatchupCatalog, state: ScenarioState): ReactNode {
  const { trackState } = state
  const category = catalog.moveCategory
  const showActual = trackState.showDefenseStatValue
  if (trackState.defenderMode === "range") {
    return (
      <ChipSummary
        ranged
        showActual={showActual}
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
  return <ChipSummary chips={chips} ranged={false} showActual={showActual} />
}

function StatEditorSection({
  labelId,
  className,
  children,
}: {
  labelId: "track.choice" | "track.range"
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-[10px] font-extrabold leading-none text-hud-muted">
        <FormattedMessage id={labelId} />
      </p>
      {children}
    </div>
  )
}

export function StatTrack({
  side,
  catalog,
  state,
  expanded,
  onToggle,
}: StatTrackProps) {
  const intl = useIntl()
  const { trackState } = state
  const offense = side === "offense"
  const mode = offense ? trackState.statMode : trackState.defenderMode
  const label = offense ? catalog.offenseStatLabel : `HP / ${catalog.defenseStatLabel}`
  const summary = offense ? offenseSummary(catalog, state) : defenseSummary(catalog, state)
  const onMode = (next: StatSelectMode) =>
    offense ? state.setStatMode(next) : state.setDefenderMode(next)
  const editor = (
    <div>
      <StatEditorSection labelId="track.choice">
        {offense ? (
          <>
            <StatPresetChoices
              presets={state.offensePresets}
              selectedIds={trackState.offensePresetIds}
              calcName={catalog.matchup.attackerCalcName}
              category={catalog.moveCategory}
              statNameStrategy={state.statNameStrategy}
              showStatValue={trackState.showOffenseStatValue}
              allocationIndices={trackState.offenseAllocationIndices}
              onToggle={state.toggleOffensePreset}
              onCycleAllocation={state.cycleOffenseAllocation}
              onDelete={state.deleteOffensePreset}
              onPersist={state.persistOffensePreset}
              adding={state.addingOffense}
              onAddClick={() => state.setAddingOffense((value) => !value)}
              addAriaLabel={intl.formatMessage({ id: "statPreset.addAttacker" })}
            />
            {state.addingOffense && (
              <AddOffensePresetPanel
                statLabel={catalog.offenseStatLabel}
                bounds={state.offenseBounds}
                onConfirm={state.confirmAddOffense}
                onCancel={() => state.setAddingOffense(false)}
              />
            )}
          </>
        ) : (
          <>
            <StatPresetChoices
              presets={state.defensePresets}
              selectedIds={trackState.defensePresetIds}
              calcName={catalog.matchup.defenderCalcName}
              category={catalog.moveCategory}
              statNameStrategy={state.statNameStrategy}
              showStatValue={trackState.showDefenseStatValue}
              allocationIndices={trackState.defenseAllocationIndices}
              onToggle={state.toggleDefensePreset}
              onCycleAllocation={state.cycleDefenseAllocation}
              onDelete={state.deleteDefensePreset}
              onPersist={state.persistDefensePreset}
              adding={state.addingDefense}
              onAddClick={() => state.setAddingDefense((value) => !value)}
              addAriaLabel={intl.formatMessage({ id: "statPreset.addDefender" })}
            />
            {state.addingDefense && (
              <AddDefensePresetPanel
                hpBounds={state.defenderHpBounds}
                defBounds={state.defenderDefBounds}
                defStatLabel={catalog.defenseStatLabel}
                onConfirm={state.confirmAddDefense}
                onCancel={() => state.setAddingDefense(false)}
              />
            )}
          </>
        )}
      </StatEditorSection>
      <StatEditorSection labelId="track.range" className="mt-3 border-t border-hairline pt-3">
        {offense ? (
          <StatRangeInput
            statLabel={catalog.offenseStatLabel}
            bounds={state.offenseBounds}
            value={trackState.statRange}
            onChange={state.setStatRange}
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
            />
            <StatRangeInput
              statLabel={catalog.defenseStatLabel}
              bounds={state.defenderDefBounds}
              value={trackState.defenderRanges.def}
              onChange={(def) =>
                state.setDefenderRanges({ hp: trackState.defenderRanges.hp, def })
              }
            />
          </>
        )}
      </StatEditorSection>
      <div className="mt-3">
        <ShowStatValuesSwitch
          checked={offense ? trackState.showOffenseStatValue : trackState.showDefenseStatValue}
          onCheckedChange={offense ? state.setShowOffenseStatValue : state.setShowDefenseStatValue}
        />
      </div>
    </div>
  )

  return (
    <TrackPanel
      icon={Gauge}
      label={label}
      summary={
        <StatModeWell mode={mode} onMode={onMode}>
          {summary}
        </StatModeWell>
      }
      summaryLayout="stack"
      expanded={expanded}
      onToggle={onToggle}
    >
      {editor}
    </TrackPanel>
  )
}
