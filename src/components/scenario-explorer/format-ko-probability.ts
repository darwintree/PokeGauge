import type { KoProbabilityValue } from "@/lib/calc-adapter"

export function formatKoProbability(value: KoProbabilityValue, locale: string): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
  })
  if (typeof value === "number") return formatter.format(value)
  return `${formatter.format(value.min)}-${formatter.format(value.max)}`
}
