import { defenseValuesOf, offenseValueOf } from "@/lib/stat-value-template"
import type { StatValueTemplate } from "@/lib/stat-value-template"

import { envelopeRange } from "./stat-range"
import type { StatRange } from "./types"

export function offenseRangeFromTemplates(
  templates: StatValueTemplate[],
  selectedIds: string[],
  defaultRange: () => StatRange,
): StatRange {
  if (selectedIds.length === 0) return defaultRange()
  const byId = new Map(templates.map((t) => [t.id, t]))
  const values = selectedIds
    .map((id) => byId.get(id))
    .filter((t): t is StatValueTemplate => t != null && t.values.kind === "offense")
    .map((t) => offenseValueOf(t))
  if (values.length === 0) return defaultRange()
  return envelopeRange(values)
}

export function defenderHpRangeFromTemplates(
  templates: StatValueTemplate[],
  selectedIds: string[],
  defaultRange: () => StatRange,
): StatRange {
  if (selectedIds.length === 0) return defaultRange()
  const byId = new Map(templates.map((t) => [t.id, t]))
  const values = selectedIds
    .map((id) => byId.get(id))
    .filter((t): t is StatValueTemplate => t != null && t.values.kind === "defense")
    .map((t) => defenseValuesOf(t).hp)
  if (values.length === 0) return defaultRange()
  return envelopeRange(values)
}

export function defenderDefRangeFromTemplates(
  templates: StatValueTemplate[],
  selectedIds: string[],
  defaultRange: () => StatRange,
): StatRange {
  if (selectedIds.length === 0) return defaultRange()
  const byId = new Map(templates.map((t) => [t.id, t]))
  const values = selectedIds
    .map((id) => byId.get(id))
    .filter((t): t is StatValueTemplate => t != null && t.values.kind === "defense")
    .map((t) => defenseValuesOf(t).def)
  if (values.length === 0) return defaultRange()
  return envelopeRange(values)
}

export { envelopeRange }
