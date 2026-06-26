import type { DefenderSetup, StatSetup } from "./types"

/** Preset stat spreads — VGC Level 50 physical offense */
export const ATTACKER_STAT_SETUPS: Record<string, StatSetup> = {
  "neutral-zero": { nature: "Serious", evs: {} },
  "neutral-max": { nature: "Serious", evs: { atk: 252 } },
  standard: { nature: "Jolly", evs: { atk: 252 } },
  extreme: { nature: "Adamant", evs: { atk: 252 } },
}

export const ATTACKER_ITEM_NAMES: Record<string, string | undefined> = {
  none: undefined,
  "life-orb": "Life Orb",
  "choice-band": "Choice Band",
}

export const DEFENDER_SETUPS: Record<string, DefenderSetup> = {
  "standard-bulk": { nature: "Impish", evs: { hp: 252, def: 252 } },
  "min-bulk": { nature: "Serious", evs: {} },
}

export const MOVE_NAMES: Record<string, string> = {
  earthquake: "Earthquake",
  "dragon-claw": "Dragon Claw",
  "stone-edge": "Stone Edge",
}
