import { Gauge } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MatchupCatalog } from "@/lib/catalog"
import {
  defensePresetsForState,
  offensePresetsForState,
  type StatSelectMode,
} from "@/lib/scenario-pipeline"
import { statPresetLabel } from "@/lib/stat-preset"

import { StatRangeAxis } from "./stat-range-axis"
import {
  AddDefensePresetPanel,
  AddOffensePresetPanel,
  ShowStatValuesSwitch,
  StatPresetOptions,
} from "./stat-preset-options"
import { TrackCard } from "./track-card"
import type { ScenarioState } from "./use-scenario-state"

type StatTrackCardProps = {
  side: "offense" | "defense"
  catalog: MatchupCatalog
  state: ScenarioState
  expanded: boolean
  onToggle: () => void
}

function offenseSummary(catalog: MatchupCatalog, state: ScenarioState): string {
  const { trackState } = state
  if (trackState.statMode === "range") {
    return `${trackState.statRange.min}-${trackState.statRange.max}`
  }
  const presets = offensePresetsForState(catalog, trackState)
  return trackState.offensePresetIds
    .map((id) => {
      const preset = presets.find((candidate) => candidate.id === id)
      return preset
        ? statPresetLabel(
            preset,
            catalog.matchup.attackerCalcName,
            catalog.moveCategory,
            trackState.offenseAllocationIndices[id] ?? 0,
            state.statNameStrategy,
          )
        : id
    })
    .join(", ")
}

function defenseSummary(catalog: MatchupCatalog, state: ScenarioState): string {
  const { trackState } = state
  if (trackState.defenderMode === "range") {
    return `HP ${trackState.defenderRanges.hp.min}-${trackState.defenderRanges.hp.max}, ${catalog.defenseStatLabel} ${trackState.defenderRanges.def.min}-${trackState.defenderRanges.def.max}`
  }
  const presets = defensePresetsForState(catalog, trackState)
  return trackState.defensePresetIds
    .map((id) => {
      const preset = presets.find((candidate) => candidate.id === id)
      return preset
        ? statPresetLabel(
            preset,
            catalog.matchup.defenderCalcName,
            catalog.moveCategory,
            trackState.defenseAllocationIndices[id] ?? 0,
            state.statNameStrategy,
          )
        : id
    })
    .join(", ")
}

export function StatTrackCard({
  side,
  catalog,
  state,
  expanded,
  onToggle,
}: StatTrackCardProps) {
  const intl = useIntl()
  const { trackState } = state
  const offense = side === "offense"
  const mode = offense ? trackState.statMode : trackState.defenderMode

  return (
    <TrackCard
      icon={Gauge}
      label={offense ? catalog.offenseStatLabel : `HP / ${catalog.defenseStatLabel}`}
      summary={offense ? offenseSummary(catalog, state) : defenseSummary(catalog, state)}
      expanded={expanded}
      onToggle={onToggle}
    >
      <Tabs
        value={mode}
        onValueChange={(value) =>
          offense
            ? state.setStatMode(value as StatSelectMode)
            : state.setDefenderMode(value as StatSelectMode)
        }
        className="gap-3"
      >
        <TabsList className="h-7">
          <TabsTrigger value="preset" className="px-2.5 text-xs">
            <FormattedMessage id="track.preset" />
          </TabsTrigger>
          <TabsTrigger value="range" className="px-2.5 text-xs">
            <FormattedMessage id="track.range" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preset" className="mt-0 space-y-2">
          {offense ? (
            <>
              <StatPresetOptions
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
              <ShowStatValuesSwitch
                checked={trackState.showOffenseStatValue}
                onCheckedChange={state.setShowOffenseStatValue}
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
              <StatPresetOptions
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
              <ShowStatValuesSwitch
                checked={trackState.showDefenseStatValue}
                onCheckedChange={state.setShowDefenseStatValue}
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
        </TabsContent>
        <TabsContent value="range" className="mt-0 space-y-2">
          {offense ? (
            <StatRangeAxis
              statLabel={catalog.offenseStatLabel}
              bounds={state.offenseBounds}
              value={trackState.statRange}
              onChange={state.setStatRange}
            />
          ) : (
            <>
              <StatRangeAxis
                statLabel="HP"
                bounds={state.defenderHpBounds}
                value={trackState.defenderRanges.hp}
                onChange={(hp) =>
                  state.setDefenderRanges({ hp, def: trackState.defenderRanges.def })
                }
              />
              <StatRangeAxis
                statLabel={catalog.defenseStatLabel}
                bounds={state.defenderDefBounds}
                value={trackState.defenderRanges.def}
                onChange={(def) =>
                  state.setDefenderRanges({ hp: trackState.defenderRanges.hp, def })
                }
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </TrackCard>
  )
}
