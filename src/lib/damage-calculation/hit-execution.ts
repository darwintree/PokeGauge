import {
  resolveHitComposition,
  resolutionRange,
  sequenceKOProbabilities,
  INITIAL_RESOLUTION_STATE,
  type HitBranches,
  type HitComposition,
  type ResolutionState,
  type ValueRange,
} from "@/lib/damage-distribution/hit-composition"

import { applyCalcStatChanges, calculateHitMatrix, hasFullHpProtection } from "./calc-engine"
import type { CompiledDamagePoint, DamageFormulaBranch } from "./damage-input"
import { branchEffectivePower } from "./formula-projection"
import type { CalculableScenario } from "./scenario-compiler"

function hitFormula(
  branch: DamageFormulaBranch,
  scenario: CalculableScenario,
  index: number,
  critical: boolean,
  consumesBerry: boolean,
  damaged: boolean,
): DamageFormulaBranch {
  return {
    ...branch,
    power: scenario.execution.powers[index],
    ...(scenario.execution.parentalBond && index === 1 ? { spreadModifier: 1024 } : {}),
    ...(scenario.berry && !consumesBerry
      ? { finalModifier: critical ? scenario.berry.criticalFinalModifier : scenario.berry.normalFinalModifier }
      : {}),
    ...(damaged && branch.afterDamageFinalModifier !== undefined
      ? { finalModifier: branch.afterDamageFinalModifier } : {}),
  }
}

export function compileHitComposition(
  scenario: CalculableScenario,
  point: CompiledDamagePoint,
): HitComposition {
  const initialHp = point.calc.defender.currentHp ?? point.calc.defender.exactStats.hp
  const fullHpProtection = hasFullHpProtection(point.calc)
  const wholeMoveProtection = point.calc.defender.abilityCalcName === "Tera Shell"
  // Reviewed native multi-hit moves have fixed powers and no HP-dependent
  // damage beyond full-HP defenses. They can share rolls after any damage.
  const nativeMulti = !scenario.execution.parentalBond && scenario.execution.powers.length > 1
  function calculationState(state: Readonly<ResolutionState>, damageTaken = state.damageTaken) {
    const currentHp = fullHpProtection ? Math.max(1, initialHp - damageTaken) : initialHp
    const hpKey = nativeMulti ? Number(currentHp === point.calc.defender.exactStats.hp) : currentHp
    return { currentHp, key: `${hpKey}:${state.statChanges}:${Number(state.berryConsumed)}` }
  }
  const choices = scenario.execution.counts.map(({ count, probability }) => ({
    probability,
    hits: Array.from({ length: count }, (_, index) => {
      const cache = new Map<string, HitBranches>()
      return (state: Readonly<ResolutionState>, executionStart: Readonly<ResolutionState>): HitBranches => {
        const damageTaken = wholeMoveProtection ? executionStart.damageTaken : state.damageTaken
        const { currentHp, key } = calculationState(state, damageTaken)
        const cached = cache.get(key)
        if (cached) return cached
        // calc's child row already adds Power-Up Punch's first boost. Feed
        // the preceding count so the same event is not applied twice.
        const intrinsicBoost = scenario.statChange && scenario.execution.parentalBond && index === 1 &&
          point.calc.move.calcMoveName === "Power-Up Punch" ? 1 : 0
        const context = scenario.statChange
          ? applyCalcStatChanges(point.calc, scenario.statChange, Math.max(0, state.statChanges - intrinsicBoost))
          : point.calc
        const calc = { ...context, defender: { ...context.defender, currentHp } }
        function branch(critical: boolean) {
          const formula = critical ? point.critical : point.normal
          if (!formula) return undefined
          const matrix = calculateHitMatrix(calc, count, critical, state.berryConsumed, Boolean(scenario.berry))
          const consumesBerry = index === 0 && matrix.consumesBerry
          return {
            rolls: matrix.rolls[index],
            consumesBerry,
            effectivePower: matrix.rolls[index].every((roll) => roll === 0) ? 0 : branchEffectivePower(
              hitFormula(formula, scenario, index, critical, consumesBerry, state.damageTaken > 0),
            ),
          }
        }
        const result = { normal: branch(false), critical: branch(true) }
        cache.set(key, result)
        return result
      }
    }),
  }))
  return {
    accuracyScope: scenario.execution.accuracyScope,
    damageStateKey: (state) => calculationState(state).key,
    ...(scenario.statChange ? { statChangeProbability: scenario.statChange.probability } : {}),
    choices,
  }
}

export type ExecutionProjection = {
  normal?: ValueRange
  critical?: ValueRange
  normalPower?: ValueRange
  criticalPower?: ValueRange
  hits: readonly { normal?: number; critical?: number }[]
}

export function projectHitComposition(
  composition: HitComposition,
): ExecutionProjection {
  // Output comparisons assume every accuracy check succeeds in both modes.
  // Random hit counts and mixed-critical reference paths remain intact.
  const damage = resolveHitComposition(composition, 1, 0.5)
  // Per-hit display follows a complete ordinary path (forced critical when required).
  // Advance it with the same resolver instead of reproducing state transitions.
  let state: ResolutionState = INITIAL_RESOLUTION_STATE
  const hits = composition.choices[composition.choices.length - 1].hits.map((hit) => {
    const branches = hit(state, INITIAL_RESOLUTION_STATE)
    const outcomes = resolveHitComposition({ ...composition,
      choices: [{ probability: 1, hits: [(incoming) => hit(incoming, INITIAL_RESOLUTION_STATE)] }],
    }, 1, 0, state)
    state = outcomes[0]
    return { normal: branches.normal?.effectivePower, critical: branches.critical?.effectivePower }
  })
  return {
    normal: resolutionRange(damage, false),
    critical: resolutionRange(damage, true),
    normalPower: resolutionRange(damage, false, "power"),
    criticalPower: resolutionRange(damage, true, "power"),
    hits,
  }
}

export function evaluateExecutionPoint(
  scenario: CalculableScenario,
  point: CompiledDamagePoint = scenario.calculation.low,
) {
  const composition = compileHitComposition(scenario, point)
  const { hitProbability, criticalHitProbability } = scenario.probability
  return {
    ...projectHitComposition(composition),
    ko: sequenceKOProbabilities(composition, hitProbability, criticalHitProbability, point.defenderHp),
  }
}
