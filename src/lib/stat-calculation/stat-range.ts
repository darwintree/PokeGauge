import type { MoveCategory } from "@/lib/catalog"

import {
  getDefenderDefBounds,
  getDefenderHpBounds,
  getOffenseStatBounds,
} from "./stat-bounds"
import type { StatRange } from "./types"

export function clampStat(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

export function snapToAnchors(value: number, snapValues: number[], threshold = 2): number {
  for (const snap of snapValues) {
    if (Math.abs(value - snap) <= threshold) return snap
  }
  return value
}

export function sameStatRange(a: StatRange, b: StatRange): boolean {
  return a.min === b.min && a.max === b.max
}

export function envelopeRange(values: number[]): StatRange {
  if (values.length === 0) {
    throw new Error("envelopeRange requires at least one value")
  }
  return { min: Math.min(...values), max: Math.max(...values) }
}

function snapRange(
  bounds: { snapPoints: { id: string; value: number }[] },
  startId: string,
  endId: string,
): StatRange {
  const start = bounds.snapPoints.find((s) => s.id === startId)?.value ?? bounds.snapPoints[0]?.value
  const end =
    bounds.snapPoints.find((s) => s.id === endId)?.value ??
    bounds.snapPoints[bounds.snapPoints.length - 1]?.value
  return { min: start!, max: end! }
}

export function defaultOffenseStatRange(calcName: string, category: MoveCategory): StatRange {
  return snapRange(getOffenseStatBounds(calcName, category), "neutral-zero", "extreme")
}

export function defaultDefenderHpRange(calcName: string): StatRange {
  return snapRange(getDefenderHpBounds(calcName), "min-bulk", "hp-32")
}

export function defaultDefenderDefRange(calcName: string, category: MoveCategory): StatRange {
  return snapRange(getDefenderDefBounds(calcName, category), "min-bulk", "standard-bulk")
}

/** @deprecated use defaultOffenseStatRange */
export function defaultStatRange(calcName: string, category: MoveCategory): StatRange {
  return defaultOffenseStatRange(calcName, category)
}
