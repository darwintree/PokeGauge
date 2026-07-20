import { Gauge } from "lucide-react"
import { FormattedMessage, useIntl } from "react-intl"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MatchupCatalog } from "@/lib/catalog"
import {
  defenseTemplatesForState,
  offenseTemplatesForState,
  type StatSelectMode,
} from "@/lib/scenario-pipeline"
import { templateCardLabel } from "@/lib/stat-value-template"

import { StatRangeAxis } from "./stat-range-axis"
import {
  AddDefenseTemplatePanel,
  AddOffenseTemplatePanel,
  ShowActualValuesSwitch,
  StatValueTemplatePreset,
} from "./stat-value-template-preset"
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
  const templates = offenseTemplatesForState(catalog, trackState)
  return trackState.offenseTemplateIds
    .map((id) => {
      const template = templates.find((candidate) => candidate.id === id)
      return template
        ? templateCardLabel(
            template,
            catalog.matchup.attackerSpecies,
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
  const templates = defenseTemplatesForState(catalog, trackState)
  return trackState.defenseTemplateIds
    .map((id) => {
      const template = templates.find((candidate) => candidate.id === id)
      return template
        ? templateCardLabel(
            template,
            catalog.matchup.defenderSpecies,
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
              <StatValueTemplatePreset
                templates={state.offenseTemplates}
                selectedIds={trackState.offenseTemplateIds}
                species={catalog.matchup.attackerSpecies}
                category={catalog.moveCategory}
                statNameStrategy={state.statNameStrategy}
                showActual={trackState.showOffenseActual}
                allocationIndices={trackState.offenseAllocationIndices}
                onToggle={state.toggleOffenseTemplate}
                onCycleAllocation={state.cycleOffenseAllocation}
                onDelete={state.deleteOffenseTemplate}
                onPersist={state.persistOffenseTemplate}
                adding={state.addingOffense}
                onAddClick={() => state.setAddingOffense((value) => !value)}
                addAriaLabel={intl.formatMessage({ id: "template.addAttacker" })}
              />
              <ShowActualValuesSwitch
                checked={trackState.showOffenseActual}
                onCheckedChange={state.setShowOffenseActual}
              />
              {state.addingOffense && (
                <AddOffenseTemplatePanel
                  statLabel={catalog.offenseStatLabel}
                  bounds={state.offenseBounds}
                  onConfirm={state.confirmAddOffense}
                  onCancel={() => state.setAddingOffense(false)}
                />
              )}
            </>
          ) : (
            <>
              <StatValueTemplatePreset
                templates={state.defenseTemplates}
                selectedIds={trackState.defenseTemplateIds}
                species={catalog.matchup.defenderSpecies}
                category={catalog.moveCategory}
                statNameStrategy={state.statNameStrategy}
                showActual={trackState.showDefenseActual}
                allocationIndices={trackState.defenseAllocationIndices}
                onToggle={state.toggleDefenseTemplate}
                onCycleAllocation={state.cycleDefenseAllocation}
                onDelete={state.deleteDefenseTemplate}
                onPersist={state.persistDefenseTemplate}
                adding={state.addingDefense}
                onAddClick={() => state.setAddingDefense((value) => !value)}
                addAriaLabel={intl.formatMessage({ id: "template.addDefender" })}
              />
              <ShowActualValuesSwitch
                checked={trackState.showDefenseActual}
                onCheckedChange={state.setShowDefenseActual}
              />
              {state.addingDefense && (
                <AddDefenseTemplatePanel
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
