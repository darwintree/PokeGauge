import { VGC_LEVEL } from "./calc-constants"

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

function applyStage(stat: number, stage: number): number {
  return stage >= 0
    ? Math.floor((stat * (2 + stage)) / 2)
    : Math.floor((stat * 2) / (2 - stage))
}

function calculateBranchRolls(branch: DamageFormulaBranch): number[] {
  if (branch.damageNegated || branch.typeEffectivenessModifier === 0) return Array(16).fill(0)

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

export function calculateDamageRolls(input: CompiledDamageInput): DamageKernelResult {
  return {
    low: calculatePoint(input.low),
    ...(input.high ? { high: calculatePoint(input.high) } : {}),
  }
}
