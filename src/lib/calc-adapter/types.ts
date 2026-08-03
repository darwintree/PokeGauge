import type { StatTierTokenSet } from "@/lib/stat-tier-colors"

export type StatSetup = {
  nature: string
  evs: Partial<Record<"hp" | "atk" | "def" | "spa" | "spd" | "spe", number>>
}

export type DefenderSetup = StatSetup

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

export type StatRange = {
  min: number
  max: number
}

export type StatAxisSnapPoint = {
  id: string
  value: number
  label: string
  tier: StatTierTokenSet
}

export type StatAxisBounds = {
  min: number
  max: number
  snapPoints: StatAxisSnapPoint[]
}

/** @deprecated use StatAxisBounds */
export type AttackStatBounds = StatAxisBounds
