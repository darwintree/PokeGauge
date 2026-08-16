import { useRef, useState, type PointerEvent, type RefObject } from "react"

import type { StatRange } from "@/lib/stat-calculation"
import { clampStat, sameStatRange, snapToAnchors } from "@/lib/stat-calculation"

const TAP_THRESHOLD_PX = 4

export type RangeHandle = "min" | "max"

type RangePointerEvent = PointerEvent<HTMLButtonElement>

export function dragRangeFromAnchor(
  pointer: number,
  anchor: number,
  coincidentHandle: RangeHandle,
): { range: StatRange; handle: RangeHandle } {
  if (pointer < anchor) return { range: { min: pointer, max: anchor }, handle: "min" }
  if (pointer > anchor) return { range: { min: anchor, max: pointer }, handle: "max" }
  return { range: { min: pointer, max: pointer }, handle: coincidentHandle }
}

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
  onHandleTap: (handle: RangeHandle) => void
  onRolesSwapped?: () => void
  singlePoint?: boolean
}

type DualHandleDrag = {
  railRef: RefObject<HTMLDivElement | null>
  activeHandle: RangeHandle | null
  onPointerDown: (handle: RangeHandle) => (event: RangePointerEvent) => void
  onPointerMove: (event: RangePointerEvent) => void
  onPointerUp: (handle: RangeHandle) => () => void
}

export function useDualHandleDrag({
  boundsMin,
  boundsMax,
  value,
  snapValues,
  onChange,
  onHandleTap,
  onRolesSwapped,
  singlePoint = false,
}: DualHandleDragOptions): DualHandleDrag {
  const railRef = useRef<HTMLDivElement>(null)
  const [activeHandle, setActiveHandle] = useState<RangeHandle | null>(null)
  const pointerStartX = useRef(0)
  const dragged = useRef(false)
  const anchorRef = useRef(0)
  const handleRef = useRef<RangeHandle | null>(null)

  function commitRange(next: StatRange) {
    if (!sameStatRange(next, value)) onChange(next)
  }

  function applyDrag(raw: number) {
    const snapped = snapToAnchors(raw, snapValues)
    const pointer = clampStat(snapped, boundsMin, boundsMax)
    if (singlePoint) {
      commitRange({ min: pointer, max: pointer })
      return
    }
    const currentHandle = handleRef.current
    if (!currentHandle) return
    const next = dragRangeFromAnchor(pointer, anchorRef.current, currentHandle)
    if (next.handle !== currentHandle) {
      handleRef.current = next.handle
      setActiveHandle(next.handle)
      onRolesSwapped?.()
    }
    commitRange(next.range)
  }

  function onPointerDown(handle: RangeHandle) {
    return (event: RangePointerEvent) => {
      event.preventDefault()
      pointerStartX.current = event.clientX
      dragged.current = false
      anchorRef.current = handle === "min" ? value.max : value.min
      handleRef.current = handle
      setActiveHandle(handle)
      event.currentTarget.setPointerCapture(event.pointerId)
    }
  }

  function onPointerMove(event: RangePointerEvent) {
    if (!handleRef.current || !railRef.current) return
    const moved = Math.abs(event.clientX - pointerStartX.current)
    if (moved <= TAP_THRESHOLD_PX) return
    dragged.current = true
    const rail = railRef.current.getBoundingClientRect()
    applyDrag(valueFromPointer(event.clientX, rail, boundsMin, boundsMax))
  }

  function onPointerUp(handle: RangeHandle) {
    return () => {
      if (!dragged.current) onHandleTap(handle)
      dragged.current = false
      handleRef.current = null
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
