import type { MoveCategory } from "@/lib/catalog/types"
import { getBattlePokemonByCalcName } from "@/lib/resources"

import { VGC_LEVEL } from "./calc-constants"
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

export function statValue(species: string, stat: StatKey, setup: StatSetup): number {
  const pokemon = getBattlePokemonByCalcName(species)
  if (!pokemon) throw new Error(`Unknown generated Pokemon for stat calculation: ${species}`)

  const base = pokemon.baseStats[stat]
  const ev = setup.evs[stat] ?? 0
  const common = Math.floor(((2 * base + 31 + Math.floor(ev / 4)) * VGC_LEVEL) / 100)
  if (stat === "hp") return common + VGC_LEVEL + 10

  const nature = NATURE_MODS[setup.nature]?.[stat] ?? 1
  return Math.floor((common + 5) * nature)
}

export function offenseStatValue(
  species: string,
  category: MoveCategory,
  setup: StatSetup,
): number {
  return statValue(species, offenseStatKey(category), setup)
}

export function defenderStatValues(
  species: string,
  category: MoveCategory,
  setup: DefenderSetup,
): { hp: number; def: number } {
  return {
    hp: statValue(species, "hp", setup),
    def: statValue(species, defenseStatKey(category), setup),
  }
}
