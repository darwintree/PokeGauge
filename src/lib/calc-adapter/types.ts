import type { OffenseSnapPresetId } from "@/lib/catalog/preset-labels"

export type StatSetup = {
  nature: string
  evs: Partial<Record<"hp" | "atk" | "def" | "spa" | "spd" | "spe", number>>
}

export type DefenderSetup = StatSetup

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
}

export type StatRange = {
  min: number
  max: number
}

export type AttackStatBounds = {
  min: number
  max: number
  snapPoints: Array<{ id: OffenseSnapPresetId; value: number; label: string }>
}
