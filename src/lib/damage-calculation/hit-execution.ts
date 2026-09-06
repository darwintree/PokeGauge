import {
  resolveHitComposition,
  resolutionRange,
  sequenceKOProbabilities,
  type Hit,
  type HitComposition,
  type ResolutionState,
  type ValueRange,
} from "@/lib/damage-distribution/hit-composition"

import type { MoveStatChange } from "@/lib/move/stat-change"

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

function compileUnchangedHits(
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

function applyStatChanges(point: CompiledDamagePoint, change: MoveStatChange, count: number): CompiledDamagePoint {
  const pokemon = point.calc[change.side]
  return { ...point, calc: { ...point.calc, [change.side]: {
    ...pokemon,
    boosts: { ...pokemon.boosts,
      [change.stat]: Math.max(-6, Math.min(6, pokemon.boosts[change.stat] + count * change.stages)),
    },
  } } }
}

export function compileHitComposition(
  scenario: CalculableScenario,
  point: CompiledDamagePoint,
  berryConsumed = false,
): HitComposition {
  const base = compileUnchangedHits(scenario, point, berryConsumed)
  const change = scenario.statChange
  if (!change) return base
  // Compile each reachable incoming stage once. The resolver selects it from
  // the same state that carries Berry consumption and accumulated damage.
  const byChanges = new Map<number, HitComposition>([[0, base]])
  const afterChanges = (count: number) => {
    let composition = byChanges.get(count)
    if (!composition) {
      composition = compileUnchangedHits(scenario, applyStatChanges(point, change, count), berryConsumed)
      byChanges.set(count, composition)
    }
    return composition
  }
  // calc's public matrix already includes this guaranteed intra-use boost.
  const boostAlreadyInMatrix = point.calc.move.calcMoveName === "Power-Up Punch"
  return {
    ...base,
    statChangeProbability: change.probability,
    choices: base.choices.map((choice, choiceIndex) => ({
      ...choice,
      hits: choice.hits.map((hit, index) => ({
        ...hit,
        ...(index > 0 && !boostAlreadyInMatrix ? {
          afterStatChanges: Array.from({ length: index }, (_, previous) =>
            afterChanges(previous + 1).choices[choiceIndex].hits[index]),
        } : {}),
      })),
    })),
  }
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
  const nextUses = new Map<number, typeof first>()
  function afterOutcome(outcome: ResolutionState) {
    const key = Number(outcome.berryConsumed) + 2 * outcome.statChanges
    const cached = nextUses.get(key)
    if (cached) return cached
    const nextPoint = scenario.statChange && outcome.statChanges > 0
      ? applyStatChanges(point, scenario.statChange, outcome.statChanges) : point
    const next = key === 0 ? first : resolveHitComposition(
      compileHitComposition(scenario, nextPoint, outcome.berryConsumed),
      hitProbability, criticalHitProbability, outcome.berryConsumed,
    )
    nextUses.set(key, next)
    return next
  }

  return {
    ...projectHitComposition(composition),
    ko: sequenceKOProbabilities(first, afterOutcome, point.defenderHp),
  }
}
