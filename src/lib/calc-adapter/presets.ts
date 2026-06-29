import { POKEMON_TYPES, type PokemonType } from "@/lib/pokemon/types"
import { TYPE_BOOST_CALC_NAME, typeBoostCatalogId } from "@/lib/held-item"
import type { MoveCategory } from "@/lib/catalog/types"

import type { DefenderSetup, StatSetup } from "./types"

const PHYSICAL_ATTACKER: Record<string, StatSetup> = {
  "neutral-zero": { nature: "Serious", evs: {} },
  "neutral-max": { nature: "Serious", evs: { atk: 252 } },
  extreme: { nature: "Adamant", evs: { atk: 252 } },
}

const SPECIAL_ATTACKER: Record<string, StatSetup> = {
  "neutral-zero": { nature: "Serious", evs: {} },
  "neutral-max": { nature: "Serious", evs: { spa: 252 } },
  extreme: { nature: "Modest", evs: { spa: 252 } },
}

const PHYSICAL_DEFENDER: Record<string, DefenderSetup> = {
  "min-bulk": { nature: "Serious", evs: {} },
  "hp-32": { nature: "Serious", evs: { hp: 252 } },
  "def-max": { nature: "Serious", evs: { def: 252 } },
  "standard-bulk": { nature: "Impish", evs: { hp: 252, def: 252 } },
}

const SPECIAL_DEFENDER: Record<string, DefenderSetup> = {
  "min-bulk": { nature: "Serious", evs: {} },
  "hp-32": { nature: "Serious", evs: { hp: 252 } },
  "def-max": { nature: "Serious", evs: { spd: 252 } },
  "standard-bulk": { nature: "Calm", evs: { hp: 252, spd: 252 } },
}

/** @deprecated use getAttackerStatSetups(category) */
export const ATTACKER_STAT_SETUPS = PHYSICAL_ATTACKER

/** @deprecated use getDefenderSetups(category) */
export const DEFENDER_SETUPS = PHYSICAL_DEFENDER

export function getAttackerStatSetups(category: MoveCategory): Record<string, StatSetup> {
  return category === "physical" ? PHYSICAL_ATTACKER : SPECIAL_ATTACKER
}

export function getDefenderSetups(category: MoveCategory): Record<string, DefenderSetup> {
  return category === "physical" ? PHYSICAL_DEFENDER : SPECIAL_DEFENDER
}

const TYPE_BOOST_ITEM_NAMES = Object.fromEntries(
  POKEMON_TYPES.map((type: PokemonType) => [
    typeBoostCatalogId(type),
    TYPE_BOOST_CALC_NAME[type],
  ]),
) as Record<string, string>

export const ATTACKER_ITEM_NAMES: Record<string, string | undefined> = {
  none: undefined,
  "life-orb": "Life Orb",
  "choice-band": "Choice Band",
  "choice-specs": "Choice Specs",
  ...TYPE_BOOST_ITEM_NAMES,
}

export function offenseStatKey(category: MoveCategory): "atk" | "spa" {
  return category === "physical" ? "atk" : "spa"
}

export function defenseStatKey(category: MoveCategory): "def" | "spd" {
  return category === "physical" ? "def" : "spd"
}
