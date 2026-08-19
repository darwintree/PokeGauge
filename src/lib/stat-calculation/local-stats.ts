import type { MoveCategory } from "@/lib/catalog"
import {
  getBattlePokemonByCalcName,
  type NormalizedBattlePokemon,
} from "@/lib/resources"

import { VGC_LEVEL } from "@/lib/damage-calculation"

import { defenseStatKey, offenseStatKey } from "./presets"
import type { DefenderSetup, StatSetup } from "./types"

type StatKey = "hp" | "atk" | "def" | "spa" | "spd" | "spe"

const NATURE_MODS: Record<string, Partial<Record<StatKey, number>>> = {
  Adamant: { atk: 1.1, spa: 0.9 },
  Bold: { def: 1.1, atk: 0.9 },
  Calm: { spd: 1.1, atk: 0.9 },
  Impish: { def: 1.1, spa: 0.9 },
  Jolly: { spe: 1.1, spa: 0.9 },
  Lonely: { atk: 1.1, def: 0.9 },
  Modest: { spa: 1.1, atk: 0.9 },
  Serious: {},
  Timid: { spe: 1.1, atk: 0.9 },
}

function statValueForPokemon(
  pokemon: NormalizedBattlePokemon,
  stat: StatKey,
  setup: StatSetup,
): number {
  const base = pokemon.baseStats[stat]
  const ev = setup.evs[stat] ?? 0
  const common = Math.floor(((2 * base + 31 + Math.floor(ev / 4)) * VGC_LEVEL) / 100)
  if (stat === "hp") return common + VGC_LEVEL + 10

  const nature = NATURE_MODS[setup.nature]?.[stat] ?? 1
  return Math.floor((common + 5) * nature)
}

export function statValue(calcName: string, stat: StatKey, setup: StatSetup): number {
  const pokemon = getBattlePokemonByCalcName(calcName)
  if (!pokemon) throw new Error(`Unknown generated Pokemon for stat calculation: ${calcName}`)
  return statValueForPokemon(pokemon, stat, setup)
}

export function offenseStatValueForPokemon(
  pokemon: NormalizedBattlePokemon,
  category: MoveCategory,
  setup: StatSetup,
): number {
  return statValueForPokemon(pokemon, offenseStatKey(category), setup)
}

export function defenderStatValuesForPokemon(
  pokemon: NormalizedBattlePokemon,
  category: MoveCategory,
  setup: DefenderSetup,
): { hp: number; def: number } {
  return {
    hp: statValueForPokemon(pokemon, "hp", setup),
    def: statValueForPokemon(pokemon, defenseStatKey(category), setup),
  }
}

export function offenseStatValue(
  calcName: string,
  category: MoveCategory,
  setup: StatSetup,
): number {
  return statValue(calcName, offenseStatKey(category), setup)
}

export function defenderStatValues(
  calcName: string,
  category: MoveCategory,
  setup: DefenderSetup,
): { hp: number; def: number } {
  return {
    hp: statValue(calcName, "hp", setup),
    def: statValue(calcName, defenseStatKey(category), setup),
  }
}

/** Neutral L50 stat values for every stat of a generated Pokemon. */
export function allStatValues(calcName: string): {
  hp: number
  atk: number
  def: number
  spa: number
  spd: number
  spe: number
} {
  const pokemon = getBattlePokemonByCalcName(calcName)
  if (!pokemon) throw new Error(`Unknown generated Pokemon for stat calculation: ${calcName}`)
  return {
    hp: statValueForPokemon(pokemon, "hp", { nature: "Serious", evs: {} }),
    atk: statValueForPokemon(pokemon, "atk", { nature: "Serious", evs: {} }),
    def: statValueForPokemon(pokemon, "def", { nature: "Serious", evs: {} }),
    spa: statValueForPokemon(pokemon, "spa", { nature: "Serious", evs: {} }),
    spd: statValueForPokemon(pokemon, "spd", { nature: "Serious", evs: {} }),
    spe: statValueForPokemon(pokemon, "spe", { nature: "Serious", evs: {} }),
  }
}
