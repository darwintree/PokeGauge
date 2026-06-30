import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MatchupCatalog } from "@/lib/catalog"
import type { StatSelectMode } from "@/lib/scenario-pipeline"

import { MoveMultiSelect } from "./move-multi-select"
import { HeldItemTrack } from "./held-item-track/held-item-track"
import { StatRangeAxis } from "./stat-range-axis"
import {
  AddDefenseTemplatePanel,
  AddOffenseTemplatePanel,
  ShowActualValuesSwitch,
  StatValueTemplatePreset,
} from "./stat-value-template-preset"
import type { ScenarioState } from "./use-scenario-state"

type TrackControlsProps = {
  catalog: MatchupCatalog
  state: ScenarioState
}

export function TrackControls({ catalog, state }: TrackControlsProps) {
  const { trackState } = state
  const defStatLabel = catalog.moveCategory === "physical" ? "物防" : "特防"

  return (
    <div className="space-y-3">
      <MoveMultiSelect
        label="招式"
        options={catalog.moves}
        selectedIds={trackState.moveIds}
        onChange={state.setMoveIds}
      />

      <Separator />

      <Tabs
        value={trackState.statMode}
        onValueChange={(value) => state.setStatMode(value as StatSelectMode)}
        className="gap-3"
      >
        <div className="flex items-center justify-between gap-2">
          <Label className="text-muted-foreground text-xs">攻击方</Label>
          <TabsList className="h-7">
            <TabsTrigger value="preset" className="px-2.5 text-xs">
              预设
            </TabsTrigger>
            <TabsTrigger value="range" className="px-2.5 text-xs">
              数轴选段
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="preset" className="mt-0 space-y-2">
          <StatValueTemplatePreset
            templates={state.offenseTemplates}
            selectedIds={trackState.offenseTemplateIds}
            species={catalog.matchup.attackerSpecies}
            category={catalog.moveCategory}
            showActual={trackState.showOffenseActual}
            allocationIndices={trackState.offenseAllocationIndices}
            onToggle={state.toggleOffenseTemplate}
            onCycleAllocation={state.cycleOffenseAllocation}
            onDelete={state.deleteOffenseTemplate}
            onPersist={state.persistOffenseTemplate}
            adding={state.addingOffense}
            onAddClick={() => state.setAddingOffense((v) => !v)}
            addAriaLabel="添加攻击方模版"
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
          <Label className="text-muted-foreground text-xs">防守方</Label>
          <TabsList className="h-7">
            <TabsTrigger value="preset" className="px-2.5 text-xs">
              预设
            </TabsTrigger>
            <TabsTrigger value="range" className="px-2.5 text-xs">
              数轴选段
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="preset" className="mt-0 space-y-2">
          <StatValueTemplatePreset
            templates={state.defenseTemplates}
            selectedIds={trackState.defenseTemplateIds}
            species={catalog.matchup.defenderSpecies}
            category={catalog.moveCategory}
            showActual={trackState.showDefenseActual}
            allocationIndices={trackState.defenseAllocationIndices}
            onToggle={state.toggleDefenseTemplate}
            onCycleAllocation={state.cycleDefenseAllocation}
            onDelete={state.deleteDefenseTemplate}
            onPersist={state.persistDefenseTemplate}
            adding={state.addingDefense}
            onAddClick={() => state.setAddingDefense((v) => !v)}
            addAriaLabel="添加防守方模版"
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
    </div>
  )
}

export function SelectionSummary({ state }: { state: ScenarioState }) {
  const s = state.selectionSummary
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary">{s.moves} 招式</Badge>
        <Badge variant="secondary">{s.stats}</Badge>
        <Badge variant="secondary">{s.items} 道具</Badge>
        <Badge variant="secondary">{s.defenders} 防守</Badge>
      </div>
      <Badge variant="outline" className="tabular-nums">
        {s.rows} 条结果
      </Badge>
    </div>
  )
}
