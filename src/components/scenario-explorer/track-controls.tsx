import type { MatchupCatalog } from "@/lib/catalog"

import { ConfigMultiSelect } from "./config-multi-select"
import type { ScenarioState } from "./use-scenario-state"

type TrackControlsProps = {
  catalog: MatchupCatalog
  state: ScenarioState
}

export function TrackControls({ catalog, state }: TrackControlsProps) {
  const { trackState } = state

  return (
    <div className="space-y-3">
      <ConfigMultiSelect
        label="招式"
        options={catalog.moves}
        selectedIds={trackState.moveIds}
        onChange={state.setMoveIds}
      />

      <div className="space-y-3 border-t pt-3">
        <div className="text-muted-foreground text-xs font-medium">攻击方</div>
        <ConfigMultiSelect
          label="实数值（性格 + 努力）"
          options={catalog.attackerStats}
          selectedIds={trackState.attackerStatIds}
          onChange={state.setAttackerStatIds}
        />
        <ConfigMultiSelect
          label="道具"
          options={catalog.attackerItems}
          selectedIds={trackState.attackerItemIds}
          onChange={state.setAttackerItemIds}
        />
      </div>

      <ConfigMultiSelect
        label="防守方配置（性格 + 努力）"
        options={catalog.defenderBulks}
        selectedIds={trackState.defenderIds}
        onChange={state.setDefenderIds}
      />
    </div>
  )
}

export function SelectionSummary({ state }: { state: ScenarioState }) {
  const s = state.selectionSummary
  return (
    <div className="text-muted-foreground flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs">
      <span>
        {s.moves} 招式 · {s.stats} 预设 · {s.items} 道具 · {s.defenders} 防守
      </span>
      <span className="font-medium tabular-nums">{s.rows} 条结果</span>
    </div>
  )
}
