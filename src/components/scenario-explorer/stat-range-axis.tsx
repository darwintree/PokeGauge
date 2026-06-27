import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { AttackStatBounds, StatRange } from "@/lib/calc-adapter"

type StatRangeAxisProps = {
  bounds: AttackStatBounds
  value: StatRange
  offenseStatLabel: "物攻" | "特攻"
  onChange: (value: StatRange) => void
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function snapToAnchors(value: number, snapValues: number[]) {
  for (const snap of snapValues) {
    if (Math.abs(value - snap) <= 2) return snap
  }
  return value
}

export function StatRangeAxis({
  bounds,
  value,
  offenseStatLabel,
  onChange,
}: StatRangeAxisProps) {
  const span = bounds.max - bounds.min || 1
  const snapValues = bounds.snapPoints.map((s) => s.value)
  const leftPct = ((value.min - bounds.min) / span) * 100
  const widthPct = ((value.max - value.min) / span) * 100

  const updateRange = (next: StatRange) => {
    onChange({
      min: snapToAnchors(clamp(next.min, bounds.min, next.max), snapValues),
      max: snapToAnchors(clamp(next.max, next.min, bounds.max), snapValues),
    })
  }

  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3">
      <div className="flex items-baseline justify-between text-xs">
        <Label className="text-xs">数轴选段</Label>
        <span className="tabular-nums">
          {offenseStatLabel}{" "}
          <span className="text-foreground font-semibold">
            {value.min} – {value.max}
          </span>
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

      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs">拖动选段</Label>
        <Slider
          min={bounds.min}
          max={bounds.max}
          step={1}
          minStepsBetweenValues={1}
          value={[value.min, value.max]}
          onValueChange={(next) => {
            const [min, max] = next as number[]
            updateRange({ min, max })
          }}
        />
      </div>

      <p className="text-muted-foreground text-[11px] leading-snug">
        选段作为单一输入；结果行合并区间端点实数值 × 16 roll 的外包围范围。
      </p>
    </div>
  )
}
