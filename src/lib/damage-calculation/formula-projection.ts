import { NEUTRAL_MODIFIER, applyModifier, type DamageFormulaBranch } from "./damage-kernel"

export type MechanicsPhaseKind =
  | "base-power" | "spread" | "weather-damage" | "critical" | "stab" | "type-effectiveness" | "final"

export type MechanicsPhase = { kind: MechanicsPhaseKind; modifier: number }

export function branchPhases(branch: DamageFormulaBranch): MechanicsPhase[] {
  return [
    { kind: "base-power", modifier: branch.basePowerModifier },
    { kind: "spread", modifier: branch.spreadModifier },
    { kind: "weather-damage", modifier: branch.weatherModifier },
    ...(branch.criticalModifier === NEUTRAL_MODIFIER
      ? [] : [{ kind: "critical" as const, modifier: branch.criticalModifier }]),
    { kind: "stab", modifier: branch.stabModifier },
    { kind: "type-effectiveness", modifier: branch.typeEffectivenessModifier },
    { kind: "final", modifier: branch.finalModifier },
  ]
}

export function branchEffectivePower(branch: DamageFormulaBranch): number {
  if (branch.damageNegated || branch.typeEffectivenessModifier === 0) return 0
  let power = Math.max(1, applyModifier(branch.power, branch.basePowerModifier))
  power = applyModifier(power, branch.spreadModifier)
  power = applyModifier(power, branch.weatherModifier)
  power = applyModifier(power, branch.criticalModifier)
  power = applyModifier(power, branch.stabModifier)
  power = Math.floor(power * branch.typeEffectivenessModifier / NEUTRAL_MODIFIER)
  power = applyModifier(power, branch.finalModifier)
  return Math.max(1, power)
}
