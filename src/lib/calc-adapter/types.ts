import type { StatTierTokenSet } from "@/lib/stat-tier-colors"

export type StatSetup = {
  nature: string
  evs: Partial<Record<"hp" | "atk" | "def" | "spa" | "spd" | "spe", number>>
}

export type DefenderSetup = StatSetup

export type ProbabilityMode = "rolls" | "actual"

export type KoProbabilityRange = {
  min: number
  max: number
}

export type KoProbabilityValue = number | KoProbabilityRange

export type KoProbabilities = {
  ohko: KoProbabilityValue
  twoHit: KoProbabilityValue
}

export type ComputedDamage = {
  defenderHp: number
  minDamage: number
  maxDamage: number
  avgDamage: number
  minPercent: number
  maxPercent: number
  avgPercent: number
  critMinDamage: number
  critMaxDamage: number
  critMinPercent: number
  critMaxPercent: number
  ohkoChance?: number
  koProbabilities?: KoProbabilities
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
