import type { KOProbabilityValue } from "@/lib/damage-calculation"

export function formatKOProbability(value: KOProbabilityValue, locale: string): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
  })
  if (typeof value === "number") return formatter.format(value)
  const min = formatter.format(value.min)
  const max = formatter.format(value.max)
  return min === max ? min : `${min}-${max}`
}
