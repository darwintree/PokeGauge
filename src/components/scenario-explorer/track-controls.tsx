import { FormattedMessage, useIntl } from "react-intl"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MatchupCatalog, MoveCategory } from "@/lib/catalog"
import type { StatSelectMode } from "@/lib/scenario-pipeline"
import { cn } from "@/lib/utils"

import { MoveMultiSelect } from "./move-multi-select"
import { HeldItemTrack } from "./held-item-track/held-item-track"
import { StatRangeAxis } from "./stat-range-axis"
import {
  AddDefenseTemplatePanel,
  AddOffenseTemplatePanel,
  ShowActualValuesSwitch,
  StatNameStrategySelect,
  StatValueTemplatePreset,
} from "./stat-value-template-preset"
import type { ScenarioState } from "./use-scenario-state"

type TrackControlsProps = {
  catalog: MatchupCatalog
  state: ScenarioState
  onMoveCategoryChange: (category: MoveCategory) => void
}

export function TrackControls({ catalog, state, onMoveCategoryChange }: TrackControlsProps) {
  const intl = useIntl()
  const { trackState } = state
  const defStatLabel = catalog.defenseStatLabel

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-muted-foreground text-xs">
          <FormattedMessage id="track.moveSide" />
        </Label>
        <div className="grid grid-cols-2 rounded-lg border bg-background p-0.5">
          {(["physical", "special"] as const).map((category) => {
            const active = catalog.moveCategory === category
            return (
              <Button
                key={category}
                type="button"
                variant="ghost"
                size="sm"
                aria-pressed={active}
                className={cn("h-6 rounded-md px-2 text-xs", active && "bg-muted")}
                onClick={() => onMoveCategoryChange(category)}
              >
                <FormattedMessage id={`track.moveSide.${category}`} />
              </Button>
            )
          })}
        </div>
      </div>

      <MoveMultiSelect
        label={intl.formatMessage({ id: "track.moves" })}
        options={catalog.moves}
        visibleIds={trackState.visibleMoveIds}
        selectedIds={trackState.moveIds}
        onAdd={state.addMoveToTrack}
        onToggle={state.toggleMove}
        onRemove={state.removeMoveFromTrack}
      />

      <Separator />

      <Tabs
        value={trackState.statMode}
        onValueChange={(value) => state.setStatMode(value as StatSelectMode)}
        className="gap-3"
      >
        <div className="flex items-center justify-between gap-2">
          <Label className="text-muted-foreground text-xs">
            <FormattedMessage id="track.attacker" />
          </Label>
          <TabsList className="h-7">
            <TabsTrigger value="preset" className="px-2.5 text-xs">
              <FormattedMessage id="track.preset" />
            </TabsTrigger>
            <TabsTrigger value="range" className="px-2.5 text-xs">
              <FormattedMessage id="track.range" />
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="preset" className="mt-0 space-y-2">
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
            onAddClick={() => state.setAddingOffense((v) => !v)}
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
        </TabsContent>

        <TabsContent value="range" className="mt-0">
          <StatRangeAxis
            statLabel={catalog.offenseStatLabel}
            bounds={state.offenseBounds}
            value={trackState.statRange}
            onChange={state.setStatRange}
          />
        </TabsContent>
      </Tabs>

      <HeldItemTrack
        catalog={catalog}
        selectedIds={trackState.attackerItemIds}
        onChange={state.setAttackerItemIds}
      />

      <Separator />

      <Tabs
        value={trackState.defenderMode}
        onValueChange={(value) => state.setDefenderMode(value as StatSelectMode)}
        className="gap-3"
      >
        <div className="flex items-center justify-between gap-2">
          <Label className="text-muted-foreground text-xs">
            <FormattedMessage id="track.defender" />
          </Label>
          <TabsList className="h-7">
            <TabsTrigger value="preset" className="px-2.5 text-xs">
              <FormattedMessage id="track.preset" />
            </TabsTrigger>
            <TabsTrigger value="range" className="px-2.5 text-xs">
              <FormattedMessage id="track.range" />
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="preset" className="mt-0 space-y-2">
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
            onAddClick={() => state.setAddingDefense((v) => !v)}
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
              defStatLabel={defStatLabel}
              onConfirm={state.confirmAddDefense}
              onCancel={() => state.setAddingDefense(false)}
            />
          )}
        </TabsContent>

        <TabsContent value="range" className="mt-0 space-y-2">
          <StatRangeAxis
            statLabel="HP"
            bounds={state.defenderHpBounds}
            value={trackState.defenderRanges.hp}
            onChange={(hp) =>
              state.setDefenderRanges({ hp, def: trackState.defenderRanges.def })
            }
          />
          <StatRangeAxis
            statLabel={defStatLabel}
            bounds={state.defenderDefBounds}
            value={trackState.defenderRanges.def}
            onChange={(def) =>
              state.setDefenderRanges({ hp: trackState.defenderRanges.hp, def })
            }
          />
        </TabsContent>
      </Tabs>

      <StatNameStrategySelect
        value={state.statNameStrategy}
        onChange={state.setStatNameStrategy}
      />
    </div>
  )
}

export function SelectionSummary({ state }: { state: ScenarioState }) {
  const intl = useIntl()
  const s = state.selectionSummary
  const stats =
    state.trackState.statMode === "preset"
      ? intl.formatMessage(
          { id: "summary.statsPreset" },
          { count: state.trackState.offenseTemplateIds.length },
        )
      : intl.formatMessage(
          { id: "summary.statsRange" },
          { min: state.trackState.statRange.min, max: state.trackState.statRange.max },
        )
  const defenders =
    state.trackState.defenderMode === "preset"
      ? intl.formatMessage(
          { id: "summary.defendersPreset" },
          { count: state.trackState.defenseTemplateIds.length },
        )
      : intl.formatMessage(
          { id: "summary.defendersRange" },
          {
            min: state.trackState.defenderRanges.hp.min,
            max: state.trackState.defenderRanges.hp.max,
          },
        )
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary">
          {intl.formatMessage({ id: "summary.moves" }, { count: s.moves })}
        </Badge>
        <Badge variant="secondary">{stats}</Badge>
        <Badge variant="secondary">
          {intl.formatMessage({ id: "summary.items" }, { count: s.items })}
        </Badge>
        <Badge variant="secondary">
          {intl.formatMessage({ id: "summary.defenders" }, { value: defenders })}
        </Badge>
      </div>
      <Badge variant="outline" className="tabular-nums">
        {intl.formatMessage({ id: "summary.rows" }, { count: s.rows })}
      </Badge>
    </div>
  )
}
