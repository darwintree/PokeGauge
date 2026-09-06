import {
  resolveHitComposition,
  resolutionRange,
  sequenceKOProbabilities,
  type Hit,
  type HitComposition,
  type ValueRange,
} from "@/lib/damage-distribution/hit-composition"

import { calculateHitMatrix } from "./calc-engine"
import type { CompiledDamagePoint, DamageFormulaBranch } from "./damage-kernel"
import { branchEffectivePower } from "./formula-projection"
import type { CalculableScenario } from "./scenario-compiler"

function hitFormula(
  branch: DamageFormulaBranch,
  scenario: CalculableScenario,
  index: number,
  critical: boolean,
  consumesBerry: boolean,
): DamageFormulaBranch {
  return {
    ...branch,
    power: scenario.execution.powers[index],
    ...(scenario.execution.parentalBond && index === 1 ? { spreadModifier: 1024 } : {}),
    ...(scenario.berry && !consumesBerry
      ? { finalModifier: critical ? scenario.berry.criticalFinalModifier : scenario.berry.normalFinalModifier }
      : {}),
  }
}

export function compileHitComposition(
  scenario: CalculableScenario,
  point: CompiledDamagePoint,
  berryConsumed = false,
): HitComposition {
  const choices = scenario.execution.counts.map(({ count, probability }) => {
    const normal = point.normal
      ? calculateHitMatrix(point.calc, count, false, berryConsumed, Boolean(scenario.berry)) : undefined
    const critical = point.critical
      ? calculateHitMatrix(point.calc, count, true, berryConsumed, Boolean(scenario.berry)) : undefined
    const hits: Hit[] = Array.from({ length: count }, (_, index) => {
      function branch(criticalBranch: boolean) {
        const matrix = criticalBranch ? critical : normal
        const formula = criticalBranch ? point.critical : point.normal
        if (!matrix || !formula) return undefined
        const consumesBerry = index === 0 && matrix.consumesBerry
        return {
          rolls: matrix.rolls[index],
          consumesBerry,
          effectivePower: matrix.rolls[index].every((roll) => roll === 0) ? 0 : branchEffectivePower(
            hitFormula(formula, scenario, index, criticalBranch, consumesBerry),
          ),
        }
      }
      return { normal: branch(false), critical: branch(true) }
    })
    return { probability, hits }
  })
  return { accuracyScope: scenario.execution.accuracyScope, choices }
}

export type ExecutionProjection = {
  normal?: ValueRange
  critical?: ValueRange
  normalPower?: ValueRange
  criticalPower?: ValueRange
  hits: readonly Hit[]
}

export function projectHitComposition(
  composition: HitComposition,
): ExecutionProjection {
  // Output comparisons assume every accuracy check succeeds in both modes.
  // Random hit counts and mixed-critical reference paths remain intact.
  const damage = resolveHitComposition(composition, 1, 0.5)
  const power = resolveHitComposition(composition, 1, 0.5, false, "power")
  return {
    normal: resolutionRange(damage, false),
    critical: resolutionRange(damage, true),
    normalPower: resolutionRange(power, false),
    criticalPower: resolutionRange(power, true),
    hits: composition.choices[composition.choices.length - 1].hits,
  }
}

export function evaluateExecutionPoint(scenario: CalculableScenario, point: CompiledDamagePoint) {
  const composition = compileHitComposition(scenario, point)
  const { hitProbability, criticalHitProbability } = scenario.probability
  const first = resolveHitComposition(composition, hitProbability, criticalHitProbability)
  const consumed = first.some((outcome) => outcome.berryConsumed)
    ? resolveHitComposition(compileHitComposition(scenario, point, true), hitProbability, criticalHitProbability, true)
    : first
  return {
    ...projectHitComposition(composition),
    ko: sequenceKOProbabilities(first, consumed, point.defenderHp),
  }
}
