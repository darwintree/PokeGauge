export type ProbabilityMode = "classic" | "battle-odds"

export const STAT_STAGES = [
  -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6,
] as const

export type StatStage = (typeof STAT_STAGES)[number]

export type KOProbabilityRange = {
  min: number
  max: number
}

export type KOProbabilityValue = number | KOProbabilityRange

export type KOProbabilities = {
  ohko: KOProbabilityValue
  twoHit: KOProbabilityValue
}
