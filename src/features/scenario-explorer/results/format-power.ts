import type { ValueRange } from "@/lib/damage-distribution/hit-composition"

export function formatPower(value: number | ValueRange | undefined): string {
  if (value === undefined) return ""
  if (typeof value === "number") return String(value)
  return value.min === value.max ? String(value.min) : `${value.min}–${value.max}`
}

