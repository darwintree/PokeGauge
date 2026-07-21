import type { PokemonType } from "@/lib/pokemon/types"

import { VGC_LEVEL } from "./calc-constants"

export const NEUTRAL_MODIFIER = 4096

export type DamageFormulaBranch = {
  power: number
  basePowerModifier: number
  attack: number
  attackStage: number
  attackModifier: number
  defense: number
  defenseStage: number
  defenseModifier: number
  spreadModifier: number
  weatherModifier: number
  criticalModifier: number
  stabModifier: number
  typeEffectivenessModifier: number
  finalModifier: number
}

export type CompiledDamagePoint = {
  defenderHp: number
  normal?: DamageFormulaBranch
  critical?: DamageFormulaBranch
}

export type CompiledDamageInput = {
  low: CompiledDamagePoint
  high?: CompiledDamagePoint
}

export type DamageRollPoint = {
  defenderHp: number
  normal?: number[]
  critical?: number[]
}

export type DamageKernelResult = {
  low: DamageRollPoint
  high?: DamageRollPoint
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

export function chainModifiers(modifiers: readonly number[]): number {
  return modifiers.reduce(
    (chained, modifier) => Math.floor((chained * modifier + 2048) / NEUTRAL_MODIFIER),
    NEUTRAL_MODIFIER,
  )
}

export function applyModifier(value: number, modifier: number): number {
  return Math.floor((value * modifier + 2047) / NEUTRAL_MODIFIER)
}

function applyStage(stat: number, stage: number): number {
  return stage >= 0
    ? Math.floor((stat * (2 + stage)) / 2)
    : Math.floor((stat * 2) / (2 - stage))
}

function calculateBranchRolls(branch: DamageFormulaBranch): number[] {
  if (branch.typeEffectivenessModifier === 0) return Array(16).fill(0)

  const power = Math.max(1, applyModifier(branch.power, branch.basePowerModifier))
  const attack = Math.max(
    1,
    applyModifier(applyStage(branch.attack, branch.attackStage), branch.attackModifier),
  )
  const defense = Math.max(
    1,
    applyModifier(applyStage(branch.defense, branch.defenseStage), branch.defenseModifier),
  )
  const levelFactor = Math.floor((2 * VGC_LEVEL) / 5) + 2
  let damage = Math.floor(Math.floor((levelFactor * power * attack) / defense) / 50) + 2
  damage = applyModifier(damage, branch.spreadModifier)
  damage = applyModifier(damage, branch.weatherModifier)
  damage = applyModifier(damage, branch.criticalModifier)

  return Array.from({ length: 16 }, (_, index) => {
    let roll = Math.floor((damage * (85 + index)) / 100)
    roll = applyModifier(roll, branch.stabModifier)
    roll = Math.floor((roll * branch.typeEffectivenessModifier) / NEUTRAL_MODIFIER)
    return Math.max(1, applyModifier(roll, branch.finalModifier))
  })
}

function calculatePoint(point: CompiledDamagePoint): DamageRollPoint {
  const result: DamageRollPoint = { defenderHp: point.defenderHp }
  if (point.normal) result.normal = calculateBranchRolls(point.normal)
  if (point.critical) result.critical = calculateBranchRolls(point.critical)
  return result
}

export function typeEffectiveness(moveType: PokemonType, defenderTypes: PokemonType[]): number {
  return defenderTypes.reduce((multiplier, defenderType) => {
    return multiplier * (TYPE_CHART[moveType][defenderType] ?? 1)
  }, 1)
}

export function calculateDamageRolls(input: CompiledDamageInput): DamageKernelResult {
  return {
    low: calculatePoint(input.low),
    ...(input.high ? { high: calculatePoint(input.high) } : {}),
  }
}

export { TYPE_CHART }
