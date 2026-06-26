/** PROTOTYPE — sidebar tracks with move TypeBadges (verdict) */

import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MatchupCatalog } from "@/lib/catalog"
import type { StatSelectMode } from "@/lib/scenario-pipeline"

import { ConfigMultiSelect } from "@/components/scenario-explorer/config-multi-select"
import { StatRangeAxis } from "@/components/scenario-explorer/stat-range-axis"
import type { ScenarioState } from "@/components/scenario-explorer/use-scenario-state"

import { MoveTrackWithBadges } from "./move-track-badges"

export function SidebarTracks({
  catalog,
  state,
}: {
  catalog: MatchupCatalog
  state: ScenarioState
}) {
  const { trackState } = state

  return (
    <div className="space-y-3">
      <MoveTrackWithBadges catalog={catalog} state={state} />

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
      />
    </div>
  )
}
