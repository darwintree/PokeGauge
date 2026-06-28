import { useEffect, useId, useRef, useState } from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { StatAxisBounds, StatRange } from "@/lib/calc-adapter"
import { clampStat } from "@/lib/calc-adapter"
import { STAT_AXIS_SNAP_CLASS } from "@/lib/stat-tier-colors"
import { cn } from "@/lib/utils"

import { useDualHandleDrag } from "./use-dual-handle-drag"

type StatRangeAxisProps = {
  statLabel: string
  bounds: StatAxisBounds
  value: StatRange
  onChange: (value: StatRange) => void
}

type FineTuneHandle = "min" | "max" | null

function pctForValue(value: number, min: number, max: number): number {
  const span = max - min || 1
  return ((value - min) / span) * 100
}

export function StatRangeAxis({
  statLabel,
  bounds,
  value,
  onChange,
}: StatRangeAxisProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const fineTuneId = useId()
  const [fineTune, setFineTune] = useState<FineTuneHandle>(null)
  const snapValues = bounds.snapPoints.map((snap) => snap.value)
  const collapsed = value.min === value.max
  const leftPct = pctForValue(value.min, bounds.min, bounds.max)
  const widthPct = collapsed ? 0.8 : pctForValue(value.max, bounds.min, bounds.max) - leftPct

  function toggleFineTune(handle: "min" | "max") {
    setFineTune((current) => (current === handle ? null : handle))
  }

  const drag = useDualHandleDrag({
    boundsMin: bounds.min,
    boundsMax: bounds.max,
    value,
    snapValues,
    onChange,
    onHandleTap: toggleFineTune,
  })

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setFineTune(null)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [])

  function nudge(handle: "min" | "max", delta: number) {
    if (handle === "min") {
      onChange({
        min: clampStat(value.min + delta, bounds.min, value.max),
        max: value.max,
      })
      return
    }
    onChange({
      min: value.min,
      max: clampStat(value.max + delta, value.min, bounds.max),
    })
  }

  function handleStyle(handle: "min" | "max") {
    const pct = pctForValue(handle === "min" ? value.min : value.max, bounds.min, bounds.max)
    return { left: `${pct}%` }
  }

  return (
    <div ref={rootRef} className="space-y-1.5">
      <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-x-2">
        <span className="text-muted-foreground pt-0.5 text-[11px] leading-none">{statLabel}</span>

        <div className="space-y-1">
          <div className="relative mx-1 h-4">
            {bounds.snapPoints.map((snap) => {
              const pct = pctForValue(snap.value, bounds.min, bounds.max)
              const tierClass = STAT_AXIS_SNAP_CLASS[snap.tier]
              return (
                <div
                  key={snap.id}
                  className="absolute top-0 -translate-x-1/2 text-center"
                  style={{ left: `${pct}%` }}
                >
                  <span className={cn("text-[10px] font-medium tabular-nums", tierClass)}>
                    {snap.label}
                  </span>
                </div>
              )
            })}
          </div>

          <div ref={drag.railRef} className="relative mx-1 h-8 touch-none">
            <div className="bg-muted absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full" />

            {bounds.snapPoints.map((snap) => {
              const pct = pctForValue(snap.value, bounds.min, bounds.max)
              const tierClass = STAT_AXIS_SNAP_CLASS[snap.tier]
              return (
                <div
                  key={`tick-${snap.id}`}
                  className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pct}%` }}
                >
                  <div className={cn("stat-axis-tick h-2.5 w-0.5 rounded-full opacity-80", tierClass)} />
                </div>
              )
            })}

            {!collapsed && (
              <div
                className="bg-primary/25 border-primary/60 absolute top-1/2 h-1 -translate-y-1/2 rounded-full border"
                style={{
                  left: `${leftPct}%`,
                  width: `${Math.max(widthPct, 0.5)}%`,
                }}
              />
            )}

            {(["min", "max"] as const).map((handle) => (
              <button
                key={handle}
                type="button"
                aria-label={`${statLabel} ${handle === "min" ? "下限" : "上限"}`}
                aria-expanded={fineTune === handle}
                aria-controls={fineTune === handle ? fineTuneId : undefined}
                className={cn(
                  "border-primary bg-background absolute top-1/2 z-10 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-sm",
                  "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                  collapsed && handle === "max" && "hidden",
                  fineTune === handle && "ring-primary/40 ring-2",
                  drag.activeHandle === handle && "scale-110",
                )}
                style={handleStyle(handle)}
                onPointerDown={drag.onPointerDown(handle)}
                onPointerMove={drag.onPointerMove}
                onPointerUp={drag.onPointerUp(handle)}
                onPointerCancel={drag.onPointerUp(handle)}
              />
            ))}
          </div>

          <div className="relative mx-1 h-4">
            {(["min", "max"] as const).map((handle) => {
              if (collapsed && handle === "max") return null
              const endpoint = handle === "min" ? value.min : value.max
              const pct = pctForValue(endpoint, bounds.min, bounds.max)
              return (
                <span
                  key={handle}
                  className="text-muted-foreground absolute -translate-x-1/2 text-[10px] tabular-nums"
                  style={{ left: `${pct}%` }}
                >
                  {endpoint}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {fineTune && (
        <div
          id={fineTuneId}
          className="flex items-center justify-center gap-2 pl-[2.75rem]"
        >
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            aria-label="减 1"
            onClick={() => nudge(fineTune, -1)}
          >
            <Minus />
          </Button>
          <span className="min-w-[3rem] text-center text-xs tabular-nums">
            {fineTune === "min" ? value.min : value.max}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            aria-label="加 1"
            onClick={() => nudge(fineTune, 1)}
          >
            <Plus />
          </Button>
        </div>
      )}
    </div>
  )
}
