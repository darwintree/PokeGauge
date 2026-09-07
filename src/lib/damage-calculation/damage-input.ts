import type { CalcContext } from "./calc-engine"

export const NEUTRAL_MODIFIER = 4096

export type DamageFormulaBranch = {
  damageNegated: boolean
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
  /** Display modifier after a damaging hit removes full-HP protection and any resistance Berry. */
  afterDamageFinalModifier?: number
}

export type CompiledDamagePoint = {
  defenderHp: number
  normal?: DamageFormulaBranch
  critical?: DamageFormulaBranch
  /** @smogon/calc inputs; the damage source since ADR 0007. */
  calc: CalcContext
}

export type CompiledDamageInput = {
  low: CompiledDamagePoint
  high?: CompiledDamagePoint
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
