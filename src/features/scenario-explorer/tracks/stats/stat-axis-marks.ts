import {
  defenseValuesOf,
  offenseValueOf,
  type InvestBand,
  type StatPreset,
} from "@/lib/stat-preset"

export type StatAxisMark = {
  value: number
  band: InvestBand
}

export function uniqueAxisMarks(marks: readonly StatAxisMark[]): StatAxisMark[] {
  const seen = new Set<number>()
  const out: StatAxisMark[] = []
  for (const mark of marks) {
    if (seen.has(mark.value)) continue
    seen.add(mark.value)
    out.push(mark)
  }
  return out
}

export function offenseAxisMarks(
  presets: readonly StatPreset[],
  selectedIds: readonly string[],
  bandOf: (preset: StatPreset) => InvestBand,
): StatAxisMark[] {
  const selected = new Set(selectedIds)
  return uniqueAxisMarks(
    presets
      .filter((preset) => selected.has(preset.id) && preset.values.kind === "offense")
      .map((preset) => ({
        value: offenseValueOf(preset),
        band: bandOf(preset),
      })),
  )
}

export function defenseAxisMarks(
  presets: readonly StatPreset[],
  selectedIds: readonly string[],
  axis: "hp" | "def",
  bandOf: (preset: StatPreset) => InvestBand,
): StatAxisMark[] {
  const selected = new Set(selectedIds)
  return uniqueAxisMarks(
    presets
      .filter((preset) => selected.has(preset.id) && preset.values.kind === "defense")
      .map((preset) => ({
        value: defenseValuesOf(preset)[axis],
        band: bandOf(preset),
      })),
  )
}
