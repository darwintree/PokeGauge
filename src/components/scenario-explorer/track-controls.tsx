import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MatchupCatalog } from "@/lib/catalog"
import type { StatSelectMode } from "@/lib/scenario-pipeline"

import { defenderBulkTier, offenseStatTier } from "@/lib/stat-tier-colors"

import { ConfigMultiSelect, MoveMultiSelect } from "./config-multi-select"
import { StatRangeAxis } from "./stat-range-axis"
import type { ScenarioState } from "./use-scenario-state"

type TrackControlsProps = {
  catalog: MatchupCatalog
  state: ScenarioState
}

export function TrackControls({ catalog, state }: TrackControlsProps) {
  const { trackState } = state

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

        <TabsContent value="preset" className="mt-0">
          <ConfigMultiSelect
            label={`${catalog.offenseStatLabel}（性格 + 努力）`}
            options={catalog.attackerStats}
            selectedIds={trackState.attackerStatIds}
            onChange={state.setAttackerStatIds}
            tierForOption={(option) => offenseStatTier(option.id)}
          />
        </TabsContent>

        <TabsContent value="range" className="mt-0">
          <StatRangeAxis
            bounds={state.statBounds}
            value={trackState.statRange}
            offenseStatLabel={catalog.offenseStatLabel}
            onChange={state.setStatRange}
          />
        </TabsContent>
      </Tabs>

      <ConfigMultiSelect
        label="道具"
        options={catalog.attackerItems}
        selectedIds={trackState.attackerItemIds}
        onChange={state.setAttackerItemIds}
      />

      <ConfigMultiSelect
        label="防守方配置（性格 + 努力）"
        options={catalog.defenderBulks}
        selectedIds={trackState.defenderIds}
        onChange={state.setDefenderIds}
        tierForOption={(option) => defenderBulkTier(option.id)}
      />
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
