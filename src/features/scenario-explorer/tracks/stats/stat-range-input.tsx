import { useEffect, useId, useRef, useState } from "react"
import { Minus, Plus } from "lucide-react"
import { useIntl } from "react-intl"

import { Button } from "@/components/ui/button"
import {
  DEFENSE_DEF_AXIS_LABELS,
  DEFENSE_HP_AXIS_LABELS,
  OFFENSE_AXIS_SNAP_LABELS,
} from "@/lib/catalog"
import type { StatAxisBounds, StatRange } from "@/lib/stat-calculation"
import { clampStat } from "@/lib/stat-calculation"
import type { InvestBand } from "@/lib/stat-preset"
import { STAT_AXIS_SNAP_CLASS } from "./stat-tier-colors"
import type { StatAxisMark } from "./stat-axis-marks"
import { cn } from "@/lib/utils"

import { useDualHandleDrag, type RangeHandle } from "../../state/use-dual-handle-drag"

const STAT_AXIS_MARK_BAND_CLASS: Record<InvestBand, string> = {
  none: "stat-axis-mark--none",
  some: "stat-axis-mark--some",
  heavy: "stat-axis-mark--heavy",
  ex: "stat-axis-mark--ex",
}

type StatRangeInputProps = {
  statLabel: string
  bounds: StatAxisBounds
  value: StatRange
  onChange: (value: StatRange) => void
  marks?: readonly StatAxisMark[]
  draftValue?: number
  onDraftChange?: (value: number) => void
}

function pctForValue(value: number, min: number, max: number): number {
  const span = max - min || 1
  return ((value - min) / span) * 100
}

const STAT_AXIS_SNAP_LABELS: Record<string, string> = {
  ...OFFENSE_AXIS_SNAP_LABELS,
  ...DEFENSE_HP_AXIS_LABELS,
  ...DEFENSE_DEF_AXIS_LABELS,
}

const HANDLE_FACE =
  "border-primary bg-background absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-sm"

export function StatRangeInput({
  statLabel,
  bounds,
  value,
  onChange,
  marks = [],
  draftValue,
  onDraftChange,
}: StatRangeInputProps) {
  const intl = useIntl()
  const rootRef = useRef<HTMLDivElement>(null)
  const fineTuneId = useId()
  const [fineTune, setFineTune] = useState<RangeHandle | null>(null)
  const snapValues = bounds.snapPoints.map((snap) => snap.value)
  const drafting = draftValue != null && onDraftChange != null
  const collapsed = value.min === value.max
  const leftPct = pctForValue(value.min, bounds.min, bounds.max)
  const widthPct = collapsed ? 0.8 : pctForValue(value.max, bounds.min, bounds.max) - leftPct

  function toggleFineTune(handle: RangeHandle) {
    setFineTune((current) => (current === handle ? null : handle))
  }

  function swapFineTuneRoles() {
    setFineTune((current) => {
      if (current === "min") return "max"
      if (current === "max") return "min"
      return current
    })
  }

  const drag = useDualHandleDrag({
    boundsMin: bounds.min,
    boundsMax: bounds.max,
    value: drafting ? { min: draftValue, max: draftValue } : value,
    snapValues,
    onChange: drafting ? (next) => onDraftChange(next.min) : onChange,
    onHandleTap: toggleFineTune,
    onRolesSwapped: swapFineTuneRoles,
    singlePoint: drafting,
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

  useEffect(() => {
    if (!drafting) setFineTune(null)
  }, [drafting])

  function nudge(handle: RangeHandle, delta: number) {
    if (drafting) {
      onDraftChange(clampStat(draftValue + delta, bounds.min, bounds.max))
      return
    }
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

  function handleStyle(point: number) {
    return { left: `${pctForValue(point, bounds.min, bounds.max)}%` }
  }

  function isEndpoint(markValue: number): boolean {
    return markValue === value.min || markValue === value.max
  }

  const interiorMarks = marks.filter(
    (mark) => !isEndpoint(mark.value) && !(drafting && mark.value === draftValue),
  )
  const unlabeledInterior = interiorMarks.filter((mark) => !snapValues.includes(mark.value))
  let fineTuneValue = value.min
  if (drafting) fineTuneValue = draftValue
  else if (fineTune === "max") fineTuneValue = value.max

  return (
    <div ref={rootRef} className="space-y-1.5">
      <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-x-2">
        <span className="text-muted-foreground pt-0.5 text-[11px] leading-none">{statLabel}</span>

        <div className="relative space-y-1 px-1">
          <div className="relative h-4">
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
                    {STAT_AXIS_SNAP_LABELS[snap.id] ?? snap.id}
                  </span>
                </div>
              )
            })}
          </div>

          <div ref={drag.railRef} className="relative h-8 touch-none">
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

            <div className={cn(drafting && "pointer-events-none opacity-40")}>
              {!collapsed && (
                <div
                  className="bg-primary/25 border-primary/60 absolute top-1/2 h-1 -translate-y-1/2 rounded-full border"
                  style={{
                    left: `${leftPct}%`,
                    width: `${Math.max(widthPct, 0.5)}%`,
                  }}
                />
              )}

              {interiorMarks.map((mark) => {
                const pct = pctForValue(mark.value, bounds.min, bounds.max)
                return (
                  <div
                    key={mark.value}
                    aria-hidden
                    className={cn("stat-axis-mark", STAT_AXIS_MARK_BAND_CLASS[mark.band])}
                    style={{ left: `${pct}%` }}
                  />
                )
              })}

              {(["min", "max"] as const).map((handle) => {
                if (collapsed && handle === "max") return null
                const point = handle === "min" ? value.min : value.max
                if (drafting) {
                  return (
                    <div
                      key={handle}
                      aria-hidden
                      className={cn(HANDLE_FACE, "z-10")}
                      style={handleStyle(point)}
                    />
                  )
                }
                return (
                  <button
                    key={handle}
                    type="button"
                    aria-label={intl.formatMessage(
                      { id: handle === "min" ? "stat.range.min" : "stat.range.max" },
                      { stat: statLabel },
                    )}
                    aria-expanded={fineTune === handle}
                    aria-controls={fineTune === handle ? fineTuneId : undefined}
                    className={cn(
                      HANDLE_FACE,
                      "z-10",
                      "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                      fineTune === handle && "ring-primary/40 ring-2",
                      drag.activeHandle === handle && "scale-110",
                    )}
                    style={handleStyle(point)}
                    onPointerDown={drag.onPointerDown(handle)}
                    onPointerMove={drag.onPointerMove}
                    onPointerUp={drag.onPointerUp(handle)}
                    onPointerCancel={drag.onPointerUp(handle)}
                  />
                )
              })}
            </div>

            {drafting ? (
              <button
                type="button"
                aria-label={intl.formatMessage({ id: "stat.range.draft" }, { stat: statLabel })}
                aria-expanded={fineTune === "min"}
                aria-controls={fineTune === "min" ? fineTuneId : undefined}
                className={cn(
                  HANDLE_FACE,
                  "z-20",
                  "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                  fineTune === "min" && "ring-primary/40 ring-2",
                  drag.activeHandle === "min" && "scale-110",
                )}
                style={handleStyle(draftValue)}
                onPointerDown={drag.onPointerDown("min")}
                onPointerMove={drag.onPointerMove}
                onPointerUp={drag.onPointerUp("min")}
                onPointerCancel={drag.onPointerUp("min")}
              />
            ) : null}
          </div>

          <div className="relative h-4">
            {(["min", "max"] as const).map((handle) => {
              if (collapsed && handle === "max") return null
              const endpoint = handle === "min" ? value.min : value.max
              if (drafting && endpoint === draftValue) return null
              const pct = pctForValue(endpoint, bounds.min, bounds.max)
              return (
                <span
                  key={handle}
                  className={cn(
                    "text-muted-foreground absolute -translate-x-1/2 text-[10px] tabular-nums",
                    drafting && "opacity-40",
                  )}
                  style={{ left: `${pct}%` }}
                >
                  {endpoint}
                </span>
              )
            })}
            {unlabeledInterior.map((mark) => {
              const pct = pctForValue(mark.value, bounds.min, bounds.max)
              return (
                <span
                  key={`mark-${mark.value}`}
                  className={cn(
                    "text-muted-foreground absolute -translate-x-1/2 text-[10px] tabular-nums",
                    drafting && "opacity-40",
                  )}
                  style={{ left: `${pct}%` }}
                >
                  {mark.value}
                </span>
              )
            })}
            {drafting ? (
              <span
                className="text-foreground absolute -translate-x-1/2 text-[10px] tabular-nums"
                style={handleStyle(draftValue)}
              >
                {draftValue}
              </span>
            ) : null}
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
            aria-label={intl.formatMessage({ id: "stat.range.decrement" })}
            onClick={() => nudge(fineTune, -1)}
          >
            <Minus />
          </Button>
          <span className="min-w-[3rem] text-center text-xs tabular-nums">
            {fineTuneValue}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            aria-label={intl.formatMessage({ id: "stat.range.increment" })}
            onClick={() => nudge(fineTune, 1)}
          >
            <Plus />
          </Button>
        </div>
      )}
    </div>
  )
}
