import type { ValueRange } from "@/lib/damage-distribution/hit-composition"

import type { DamageFormulaBranch } from "./damage-input"
import { branchEffectivePower, branchPhases, type MechanicsPhase } from "./formula-projection"
import { compileHitComposition, projectHitComposition, type ExecutionProjection } from "./hit-execution"
import type { CalculableScenario, HitFact } from "./scenario-compiler"

export type { MechanicsPhase, MechanicsPhaseKind } from "./formula-projection"

export type MoveMechanicsBranch = {
  effectivePower: number | ValueRange
  phases: MechanicsPhase[]
}

export type MoveMechanics = {
  basePower: number
  normal: MoveMechanicsBranch | null
  critical: MoveMechanicsBranch | null
  hitFact: HitFact
  hitProbability: number
  accuracyScope?: "move" | "hit"
  hitCounts?: ValueRange
  hits?: Array<{ basePower: number; normal?: number; critical?: number }>
}

function branchMechanics(
  branch: DamageFormulaBranch | undefined,
  range?: ValueRange,
): MoveMechanicsBranch | null {
  if (!branch) return null
  let effectivePower: number | ValueRange
  if (range) effectivePower = range.min === range.max ? range.min : range
  else effectivePower = branchEffectivePower(branch)
  return { effectivePower, phases: branchPhases(branch) }
}

export function projectMoveMechanics(compiled: CalculableScenario, projection?: ExecutionProjection): MoveMechanics {
  const point = compiled.calculation.low
  const branch = point.normal ?? point.critical
  if (!branch) throw new Error("Compiled damage point has no damage branch")
  const multi = compiled.execution.powers.length > 1
  let resolved = projection
  if (multi && !resolved) {
    resolved = projectHitComposition(compileHitComposition(compiled, point))
  }
  const mechanics: MoveMechanics = {
    basePower: branch.power,
    normal: branchMechanics(point.normal, resolved?.normalPower),
    critical: branchMechanics(point.critical, resolved?.criticalPower),
    hitFact: compiled.hitFact,
    hitProbability: compiled.probability.hitProbability,
  }
  if (!multi || !resolved) return mechanics

  return {
    ...mechanics,
    accuracyScope: compiled.execution.accuracyScope,
    hitCounts: {
      min: compiled.execution.counts[0].count,
      max: compiled.execution.powers.length,
    },
    hits: resolved.hits.map((hit, index) => ({
      basePower: compiled.execution.powers[index],
      ...(hit.normal !== undefined ? { normal: hit.normal } : {}),
      ...(hit.critical !== undefined ? { critical: hit.critical } : {}),
    })),
  }
}
