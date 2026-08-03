export type StatKey = "hp" | "atk" | "def" | "spa" | "spd" | "spe"

export type StatSetup = {
  nature: string
  evs: Partial<Record<StatKey, number>>
}

export type DefenderSetup = StatSetup

export type StatRange = {
  min: number
  max: number
}

/** Semantic anchor ids; presentation maps these ids to domain CSS classes. */
export type StatSnapTier =
  | "neutral-zero"
  | "neutral-max"
  | "extreme"
  | "min-bulk"
  | "hp-32"
  | "def-max"
  | "standard-bulk"

export type StatAxisSnapPoint = {
  id: string
  value: number
  tier: StatSnapTier
}

export type StatAxisBounds = {
  min: number
  max: number
  snapPoints: StatAxisSnapPoint[]
}

/** @deprecated use StatAxisBounds */
export type AttackStatBounds = StatAxisBounds
