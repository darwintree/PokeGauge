import { FormattedMessage, useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MatchupCatalog, MoveCategory, SpeciesOption } from "@/lib/catalog"
import type { BattlePokemonId } from "@/lib/resources"
import type { StatSelectMode } from "@/lib/scenario-pipeline"
import { cn } from "@/lib/utils"

import { AbilityTrack } from "../ability-track"
import { HeldItemTrack } from "../held-item-track/held-item-track"
import { SpeciesSelect } from "../matchup-selector"
import { MoveMultiSelect } from "../move-multi-select"
import { ScreenTrack } from "../screen-track"
import { StatRangeAxis } from "../stat-range-axis"
import { StatStageTrack } from "../stat-stage-track"
import {
  AddDefenseTemplatePanel,
  AddOffenseTemplatePanel,
  ShowActualValuesSwitch,
  StatValueTemplatePreset,
} from "../stat-value-template-preset"
import type { ScenarioState } from "../use-scenario-state"
import { WeatherTrack } from "../weather-track"
import type { BriefTrackId } from "./brief-model"

export type BriefEditorContext = {
  catalog: MatchupCatalog
  state: ScenarioState
  attackers: SpeciesOption[]
  defenders: SpeciesOption[]
  attackerId: BattlePokemonId
  defenderId: BattlePokemonId
  onAttackerChange: (id: BattlePokemonId) => void
  onDefenderChange: (id: BattlePokemonId) => void
  onMoveCategoryChange: (category: MoveCategory) => void
}

export function TrackEditor({
  focus,
  ctx,
}: {
  focus: BriefTrackId
  ctx: BriefEditorContext
}) {
  const { catalog, state } = ctx
  const intl = useIntl()
  const { trackState } = state

  switch (focus) {
    case "attacker":
      return (
        <SpeciesSelect
          label={intl.formatMessage({ id: "matchup.attacker" })}
          options={ctx.attackers}
          value={ctx.attackerId}
          onChange={ctx.onAttackerChange}
        />
      )
    case "defender":
      return (
        <SpeciesSelect
          label={intl.formatMessage({ id: "matchup.defender" })}
          options={ctx.defenders}
          value={ctx.defenderId}
          onChange={ctx.onDefenderChange}
        />
      )
    case "category":
      return (
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
                  onClick={() => ctx.onMoveCategoryChange(category)}
                >
                  <FormattedMessage id={`track.moveSide.${category}`} />
                </Button>
              )
            })}
          </div>
        </div>
      )
    case "moves":
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
                    onClick={() => ctx.onMoveCategoryChange(category)}
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
            snapshots={trackState.moveSnapshots}
            onAdd={state.addMoveSnapshot}
            onChange={state.updateMoveSnapshot}
            onRemove={state.removeMoveSnapshot}
          />
        </div>
      )
    case "offenseStats":
      return (
        <Tabs
          value={trackState.statMode}
          onValueChange={(value) => state.setStatMode(value as StatSelectMode)}
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
      )
    case "attackerStages":
      return (
        <StatStageTrack
          label={<FormattedMessage id="track.attackerStage" />}
          ariaLabel={intl.formatMessage({ id: "track.attackerStage" })}
          values={trackState.attackerStages}
          onChange={state.setAttackerStages}
        />
      )
    case "items":
      return (
        <HeldItemTrack
          catalog={catalog}
          selectedIds={trackState.attackerItemIds}
          onChange={state.setAttackerItemIds}
        />
      )
    case "attackerAbilities":
      return (
        <AbilityTrack
          labelId="track.attackerAbility"
          options={catalog.attackerAbilities}
          selectedIds={trackState.attackerAbilityIds}
          onChange={state.setAttackerAbilityIds}
          onReset={state.resetAttackerAbilities}
        />
      )
    case "weather":
      return (
        <WeatherTrack values={trackState.weathers} onChange={state.setWeathers} />
      )
    case "defenseStats":
      return (
        <Tabs
          value={trackState.defenderMode}
          onValueChange={(value) => state.setDefenderMode(value as StatSelectMode)}
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
                defStatLabel={catalog.defenseStatLabel}
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
              statLabel={catalog.defenseStatLabel}
              bounds={state.defenderDefBounds}
              value={trackState.defenderRanges.def}
              onChange={(def) =>
                state.setDefenderRanges({ hp: trackState.defenderRanges.hp, def })
              }
            />
          </TabsContent>
        </Tabs>
      )
    case "defenderStages":
      return (
        <StatStageTrack
          label={<FormattedMessage id="track.defenderStage" />}
          ariaLabel={intl.formatMessage({ id: "track.defenderStage" })}
          values={trackState.defenderStages}
          onChange={state.setDefenderStages}
        />
      )
    case "defenderAbilities":
      return (
        <AbilityTrack
          labelId="track.defenderAbility"
          options={catalog.defenderAbilities}
          selectedIds={trackState.defenderAbilityIds}
          onChange={state.setDefenderAbilityIds}
          onReset={state.resetDefenderAbilities}
        />
      )
    case "screens":
      return (
        <ScreenTrack values={trackState.screens} onChange={state.setScreens} />
      )
  }
}
