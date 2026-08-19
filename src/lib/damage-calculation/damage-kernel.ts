import type { CalcContext } from "./calc-engine"
import { calculateCriticalRolls, calculateNormalRolls } from "./calc-engine"

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

export type DamageRollPoint = {
  defenderHp: number
  normal?: number[]
  critical?: number[]
}

export type DamageKernelResult = {
  low: DamageRollPoint
  high?: DamageRollPoint
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

function calculatePoint(point: CompiledDamagePoint): DamageRollPoint {
  const result: DamageRollPoint = { defenderHp: point.defenderHp }
  if (point.normal) result.normal = calculateNormalRolls(point.calc)
  if (point.critical) result.critical = calculateCriticalRolls(point.calc)
  return result
}

export function calculateDamageRolls(input: CompiledDamageInput): DamageKernelResult {
  return {
    low: calculatePoint(input.low),
    ...(input.high ? { high: calculatePoint(input.high) } : {}),
  }
}
