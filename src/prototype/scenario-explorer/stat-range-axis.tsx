/** PROTOTYPE — dual-handle stat range axis */

import type { AttackStatBounds, StatRange } from "./damage-calc"

type StatRangeAxisProps = {
  bounds: AttackStatBounds
  value: StatRange
  onChange: (value: StatRange) => void
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function StatRangeAxis({ bounds, value, onChange }: StatRangeAxisProps) {
  const span = bounds.max - bounds.min || 1
  const leftPct = ((value.min - bounds.min) / span) * 100
  const widthPct = ((value.max - value.min) / span) * 100

  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3">
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium">数轴选段</span>
        <span className="tabular-nums">
          物攻 <span className="text-foreground font-semibold">{value.min} – {value.max}</span>
        </span>
      </div>

      <div className="relative mx-1 h-8">
        <div className="bg-muted absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full" />
        {bounds.snapPoints.map((snap) => {
          const pct = ((snap.value - bounds.min) / span) * 100
          return (
            <div
              key={snap.id}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pct}%` }}
            >
              <div className="bg-border mx-auto h-2.5 w-px" />
            </div>
          )
        })}
        <div
          className="bg-primary/30 border-primary absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full border"
          style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 0.5)}%` }}
        />
      </div>

      <div className="text-muted-foreground flex justify-between px-1 text-[10px]">
        {bounds.snapPoints.map((snap) => (
          <span key={snap.id} className="max-w-[4.5rem] text-center leading-tight">
            {snap.label}
            <br />
            <span className="tabular-nums">{snap.value}</span>
          </span>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="space-y-1 text-xs">
          <span className="text-muted-foreground">下限</span>
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            value={value.min}
            onChange={(e) => {
              const min = clamp(Number(e.target.value), bounds.min, value.max)
              onChange({ min, max: value.max })
            }}
            className="w-full accent-primary"
          />
        </label>
        <label className="space-y-1 text-xs">
          <span className="text-muted-foreground">上限</span>
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            value={value.max}
            onChange={(e) => {
              const max = clamp(Number(e.target.value), value.min, bounds.max)
              onChange({ min: value.min, max })
            }}
            className="w-full accent-primary"
          />
        </label>
      </div>

      <p className="text-muted-foreground text-[11px] leading-snug">
        选段作为单一输入；结果行合并区间端点实数值 × 16 roll 的外包围范围。
      </p>
    </div>
  )
}

export const RANGE_STAT_ID = "__range__"
