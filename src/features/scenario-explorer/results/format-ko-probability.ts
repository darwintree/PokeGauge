import type { KOProbabilityValue } from "@/lib/damage-calculation"

export function formatKOProbability(value: KOProbabilityValue, locale: string): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
  })
  if (typeof value === "number") return formatter.format(value)
  return `${formatter.format(value.min)}-${formatter.format(value.max)}`
}
