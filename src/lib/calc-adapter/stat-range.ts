import type { MoveCategory } from "@/lib/catalog/types"

import { getAttackerStatSetups, getDefenderSetups } from "./presets"
import {
  getDefenderDefBounds,
  getDefenderDefStat,
  getDefenderHp,
  getDefenderHpBounds,
  getOffenseStat,
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

export function defaultOffenseStatRange(species: string, category: MoveCategory): StatRange {
  return snapRange(getOffenseStatBounds(species, category), "neutral-zero", "extreme")
}

export function defaultDefenderHpRange(species: string): StatRange {
  return snapRange(getDefenderHpBounds(species), "min-bulk", "hp-32")
}

export function defaultDefenderDefRange(species: string, category: MoveCategory): StatRange {
  return snapRange(getDefenderDefBounds(species, category), "min-bulk", "standard-bulk")
}

/** @deprecated use defaultOffenseStatRange */
export function defaultStatRange(species: string, category: MoveCategory): StatRange {
  return defaultOffenseStatRange(species, category)
}

function rangeFromPresetStats(
  presetIds: string[],
  defaultRange: () => StatRange,
  statValues: (presetIds: string[]) => number[],
): StatRange {
  if (presetIds.length === 0) return defaultRange()
  return envelopeRange(statValues(presetIds))
}

export function offenseRangeFromPresets(
  species: string,
  category: MoveCategory,
  presetIds: string[],
): StatRange {
  const setups = getAttackerStatSetups(category)
  return rangeFromPresetStats(
    presetIds,
    () => defaultOffenseStatRange(species, category),
    (ids) =>
      ids.map((id) => {
        const setup = setups[id]
        if (!setup) throw new Error(`Unknown offense preset: ${id}`)
        return getOffenseStat(species, category, setup)
      }),
  )
}

export function defenderHpRangeFromPresets(
  species: string,
  category: MoveCategory,
  presetIds: string[],
): StatRange {
  const setups = getDefenderSetups(category)
  return rangeFromPresetStats(
    presetIds,
    () => defaultDefenderHpRange(species),
    (ids) =>
      ids.map((id) => {
        const setup = setups[id]
        if (!setup) throw new Error(`Unknown defender preset: ${id}`)
        return getDefenderHp(species, setup)
      }),
  )
}

export function defenderDefRangeFromPresets(
  species: string,
  category: MoveCategory,
  presetIds: string[],
): StatRange {
  const setups = getDefenderSetups(category)
  return rangeFromPresetStats(
    presetIds,
    () => defaultDefenderDefRange(species, category),
    (ids) =>
      ids.map((id) => {
        const setup = setups[id]
        if (!setup) throw new Error(`Unknown defender preset: ${id}`)
        return getDefenderDefStat(species, category, setup)
      }),
  )
}
