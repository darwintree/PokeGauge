import { convolveSparseDistributions } from "@/lib/convolution"

const probabilities = Symbol("damage-distribution-probabilities")

export type DamageDistribution = {
  readonly [probabilities]: ReadonlyMap<number, number>
}

export type AtomicDamageDistributionInput = {
  hitProbability: number
  criticalHitProbability: number
  normalDamageRolls: readonly number[]
  criticalDamageRolls: readonly number[]
}

function addProbability(
  distribution: Map<number, number>,
  damage: number,
  probability: number,
) {
  distribution.set(damage, (distribution.get(damage) ?? 0) + probability)
}

export function createAtomicDamageDistribution({
  hitProbability,
  criticalHitProbability,
  normalDamageRolls,
  criticalDamageRolls,
}: AtomicDamageDistributionInput): DamageDistribution {
  const distribution = new Map<number, number>()
  const normalRollProbability =
    (hitProbability * (1 - criticalHitProbability)) / normalDamageRolls.length
  const criticalRollProbability =
    (hitProbability * criticalHitProbability) / criticalDamageRolls.length

  addProbability(distribution, 0, 1 - hitProbability)
  for (const damage of normalDamageRolls) {
    addProbability(distribution, damage, normalRollProbability)
  }
  for (const damage of criticalDamageRolls) {
    addProbability(distribution, damage, criticalRollProbability)
  }

  return { [probabilities]: distribution }
}

export function convolveDamageDistributions(
  distributions: readonly DamageDistribution[],
): DamageDistribution {
  return {
    [probabilities]: convolveSparseDistributions(
      distributions.map((distribution) => distribution[probabilities]),
    ),
  }
}

export function koProbability(
  distribution: DamageDistribution,
  hp: number,
): number {
  let probability = 0

  for (const [damage, damageProbability] of distribution[probabilities]) {
    if (damage >= hp) probability += damageProbability
  }

  return probability
}
