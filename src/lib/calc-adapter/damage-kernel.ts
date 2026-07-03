import type { MoveCategory } from "@/lib/catalog/types"
import type { PokemonType } from "@/lib/pokemon/types"

import { VGC_LEVEL } from "./calc-constants"

export type DamageModifierInput = {
  attackMultiplier?: number
  powerMultiplier?: number
  finalMultiplier?: number
  spread?: boolean
}

export type DamageKernelInput = {
  attack: number
  defense: number
  defenderHp: number
  attackerTypes: PokemonType[]
  defenderTypes: PokemonType[]
  moveType: PokemonType
  movePower: number
  category: MoveCategory
  modifiers?: DamageModifierInput
}

export type DamageKernelResult = {
  defenderHp: number
  normalRolls: number[]
  critRolls: number[]
}

const TYPE_CHART: Record<PokemonType, Partial<Record<PokemonType, number>>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
}

function pokeRound(value: number): number {
  return Math.floor(value + 0.5)
}

function applyMod(value: number, multiplier: number): number {
  return pokeRound(value * multiplier)
}

function applyFinalMod(value: number, multiplier: number): number {
  return Math.floor(value * multiplier)
}

export function typeEffectiveness(moveType: PokemonType, defenderTypes: PokemonType[]): number {
  return defenderTypes.reduce((multiplier, defenderType) => {
    return multiplier * (TYPE_CHART[moveType][defenderType] ?? 1)
  }, 1)
}

export function calculateDamageRolls(input: DamageKernelInput): DamageKernelResult {
  const modifiers = input.modifiers ?? {}
  const attack = applyMod(input.attack, modifiers.attackMultiplier ?? 1)
  const defense = input.defense
  const power = applyMod(input.movePower, modifiers.powerMultiplier ?? 1)
  const base = Math.floor(
    Math.floor(Math.floor(((2 * VGC_LEVEL) / 5 + 2) * power * attack) / defense) / 50,
  ) + 2
  const stab = input.attackerTypes.includes(input.moveType) ? 1.5 : 1
  const effectiveness = typeEffectiveness(input.moveType, input.defenderTypes)
  const finalMultiplier = modifiers.finalMultiplier ?? 1

  function rolls(critical: boolean): number[] {
    return Array.from({ length: 16 }, (_, index) => {
      const random = 85 + index
      let damage = base
      if (modifiers.spread) damage = applyMod(damage, 0.75)
      if (critical) damage = applyMod(damage, 1.5)
      damage = Math.floor((damage * random) / 100)
      damage = applyFinalMod(damage, stab)
      damage = Math.floor(damage * effectiveness)
      damage = applyMod(damage, finalMultiplier)
      return Math.max(1, damage)
    })
  }

  return {
    defenderHp: input.defenderHp,
    normalRolls: rolls(false),
    critRolls: rolls(true),
  }
}

export { TYPE_CHART }
