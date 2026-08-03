import { defenseValuesOf, offenseValueOf } from "@/lib/stat-preset"
import type { StatPreset } from "@/lib/stat-preset"

import { envelopeRange } from "./stat-range"
import type { StatRange } from "./types"

export function offenseRangeFromPresets(
  presets: StatPreset[],
  selectedIds: string[],
  defaultRange: () => StatRange,
): StatRange {
  if (selectedIds.length === 0) return defaultRange()
  const byId = new Map(presets.map((t) => [t.id, t]))
  const values = selectedIds
    .map((id) => byId.get(id))
    .filter((t): t is StatPreset => t != null && t.values.kind === "offense")
    .map((t) => offenseValueOf(t))
  if (values.length === 0) return defaultRange()
  return envelopeRange(values)
}

export function defenderHpRangeFromPresets(
  presets: StatPreset[],
  selectedIds: string[],
  defaultRange: () => StatRange,
): StatRange {
  if (selectedIds.length === 0) return defaultRange()
  const byId = new Map(presets.map((t) => [t.id, t]))
  const values = selectedIds
    .map((id) => byId.get(id))
    .filter((t): t is StatPreset => t != null && t.values.kind === "defense")
    .map((t) => defenseValuesOf(t).hp)
  if (values.length === 0) return defaultRange()
  return envelopeRange(values)
}

export function defenderDefRangeFromPresets(
  presets: StatPreset[],
  selectedIds: string[],
  defaultRange: () => StatRange,
): StatRange {
  if (selectedIds.length === 0) return defaultRange()
  const byId = new Map(presets.map((t) => [t.id, t]))
  const values = selectedIds
    .map((id) => byId.get(id))
    .filter((t): t is StatPreset => t != null && t.values.kind === "defense")
    .map((t) => defenseValuesOf(t).def)
  if (values.length === 0) return defaultRange()
  return envelopeRange(values)
}

export { envelopeRange }
