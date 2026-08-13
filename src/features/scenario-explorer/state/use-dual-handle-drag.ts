import { useRef, useState } from "react"

import type { StatRange } from "@/lib/stat-calculation"
import { clampStat, sameStatRange, snapToAnchors } from "@/lib/stat-calculation"

const TAP_THRESHOLD_PX = 4

function valueFromPointer(
  clientX: number,
  rail: DOMRect,
  min: number,
  max: number,
): number {
  const pct = clampStat((clientX - rail.left) / rail.width, 0, 1)
  return Math.round(min + pct * (max - min))
}

type DualHandleDragOptions = {
  boundsMin: number
  boundsMax: number
  value: StatRange
  snapValues: number[]
  onChange: (value: StatRange) => void
  onHandleTap: (handle: "min" | "max") => void
  singlePoint?: boolean
}

export function useDualHandleDrag({
  boundsMin,
  boundsMax,
  value,
  snapValues,
  onChange,
  onHandleTap,
  singlePoint = false,
}: DualHandleDragOptions) {
  const railRef = useRef<HTMLDivElement>(null)
  const [activeHandle, setActiveHandle] = useState<"min" | "max" | null>(null)
  const pointerStartX = useRef(0)
  const dragged = useRef(false)

  function applyDrag(handle: "min" | "max", raw: number) {
    const snapped = snapToAnchors(raw, snapValues)
    if (singlePoint) {
      const point = clampStat(snapped, boundsMin, boundsMax)
      const next = { min: point, max: point }
      if (!sameStatRange(next, value)) onChange(next)
      return
    }
    const next =
      handle === "min"
        ? {
            min: clampStat(snapped, boundsMin, boundsMax),
            max: value.max,
          }
        : {
            min: value.min,
            max: clampStat(snapped, boundsMin, boundsMax),
          }
    if (!sameStatRange(next, value)) onChange(next)
  }

  function onPointerDown(handle: "min" | "max") {
    return (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault()
      pointerStartX.current = event.clientX
      dragged.current = false
      setActiveHandle(handle)
      event.currentTarget.setPointerCapture(event.pointerId)
    }
  }

  function onPointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (!activeHandle || !railRef.current) return
    const moved = Math.abs(event.clientX - pointerStartX.current)
    if (moved <= TAP_THRESHOLD_PX) return
    dragged.current = true
    const rail = railRef.current.getBoundingClientRect()
    applyDrag(
      activeHandle,
      valueFromPointer(event.clientX, rail, boundsMin, boundsMax),
    )
  }

  function onPointerUp(handle: "min" | "max") {
    return () => {
      if (!dragged.current) onHandleTap(handle)
      dragged.current = false
      setActiveHandle(null)
    }
  }

  return {
    railRef,
    activeHandle,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  }
}
