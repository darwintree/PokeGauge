/** PROTOTYPE — track control panel (same controls, different layout hosts) */

import { ConfigMultiSelect } from "./config-multi-select"
import {
  ATTACKER_ITEM_CONFIGS,
  ATTACKER_STAT_CONFIGS,
  DEFENDER_CONFIGS,
  MOVES,
  type StatSelectMode,
} from "./mock-data"
import { StatRangeAxis } from "./stat-range-axis"
import type { ScenarioState } from "./use-scenario-state"

function ModeToggle({
  mode,
  onChange,
}: {
  mode: StatSelectMode
  onChange: (mode: StatSelectMode) => void
}) {
  return (
    <div className="flex gap-1 rounded-md border bg-muted/40 p-0.5 text-xs">
      {(
        [
          ["preset", "预设"],
          ["range", "数轴选段"],
        ] as const
      ).map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`rounded px-2.5 py-1 transition-colors ${
            mode === id ? "bg-background shadow-sm" : "text-muted-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

type TrackControlsProps = {
  state: ScenarioState
  className?: string
}

export function TrackControls({ state, className }: TrackControlsProps) {
  return (
    <div className={className ?? "space-y-3"}>
      <ConfigMultiSelect
        label="招式"
        options={MOVES}
        selectedIds={state.moveIds}
        onChange={state.setMoveIds}
      />

      <div className="space-y-2 border-t pt-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-muted-foreground text-xs font-medium">攻击方</div>
          <ModeToggle mode={state.statMode} onChange={state.setStatMode} />
        </div>

        {state.statMode === "preset" ? (
          <ConfigMultiSelect
            label="实数值（性格 + 努力）"
            options={ATTACKER_STAT_CONFIGS}
            selectedIds={state.attackerStatIds}
            onChange={state.setAttackerStatIds}
          />
        ) : (
          <StatRangeAxis
            bounds={state.statBounds}
            value={state.statRange}
            onChange={state.setStatRange}
          />
        )}

        <ConfigMultiSelect
          label="道具"
          options={ATTACKER_ITEM_CONFIGS}
          selectedIds={state.attackerItemIds}
          onChange={state.setAttackerItemIds}
        />
      </div>

      <ConfigMultiSelect
        label="防守方配置（性格 + 努力）"
        options={DEFENDER_CONFIGS}
        selectedIds={state.defenderIds}
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
        {s.moves} 招式 · {s.stats} · {s.items} 道具 · {s.defenders} 防守
      </span>
      <span className="font-medium tabular-nums">{s.rows} 条结果</span>
    </div>
  )
}
