import type { DamageFormulaBranch } from "./damage-kernel"
import { NEUTRAL_MODIFIER, applyModifier } from "./damage-kernel"
import type { CalculableScenario, HitFact } from "./scenario-compiler"

export type MechanicsPhaseKind =
  | "base-power"
  | "spread"
  | "weather-damage"
  | "critical"
  | "stab"
  | "type-effectiveness"
  | "final"

export type MechanicsPhase = {
  kind: MechanicsPhaseKind
  modifier: number
}

export type MoveMechanicsBranch = {
  effectivePower: number
  phases: MechanicsPhase[]
}

export type MoveMechanics = {
  basePower: number
  normal: MoveMechanicsBranch | null
  critical: MoveMechanicsBranch | null
  hitFact: HitFact
  hitProbability: number
}

function branchPhases(branch: DamageFormulaBranch): MechanicsPhase[] {
  return [
    { kind: "base-power", modifier: branch.basePowerModifier },
    { kind: "spread", modifier: branch.spreadModifier },
    { kind: "weather-damage", modifier: branch.weatherModifier },
    ...(branch.criticalModifier === NEUTRAL_MODIFIER
      ? []
      : [{ kind: "critical" as const, modifier: branch.criticalModifier }]),
    { kind: "stab", modifier: branch.stabModifier },
    { kind: "type-effectiveness", modifier: branch.typeEffectivenessModifier },
    { kind: "final", modifier: branch.finalModifier },
  ]
}

function branchEffectivePower(branch: DamageFormulaBranch): number {
  if (branch.typeEffectivenessModifier === 0) return 0
  let power = Math.max(1, applyModifier(branch.power, branch.basePowerModifier))
  power = applyModifier(power, branch.spreadModifier)
  power = applyModifier(power, branch.weatherModifier)
  power = applyModifier(power, branch.criticalModifier)
  power = applyModifier(power, branch.stabModifier)
  power = Math.floor((power * branch.typeEffectivenessModifier) / NEUTRAL_MODIFIER)
  power = applyModifier(power, branch.finalModifier)
  return Math.max(1, power)
}

function branchMechanics(branch: DamageFormulaBranch): MoveMechanicsBranch {
  return { effectivePower: branchEffectivePower(branch), phases: branchPhases(branch) }
}

export function projectMoveMechanics(compiled: CalculableScenario): MoveMechanics {
  const point = compiled.calculation.low
  const branch = point.normal ?? point.critical
  if (!branch) throw new Error("Compiled damage point has no damage branch")
  return {
    basePower: branch.power,
    normal: point.normal ? branchMechanics(point.normal) : null,
    critical: point.critical ? branchMechanics(point.critical) : null,
    hitFact: compiled.hitFact,
    hitProbability: compiled.probability.hitProbability,
  }
}
