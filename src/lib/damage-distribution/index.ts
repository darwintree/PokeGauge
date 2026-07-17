import { convolveSparseDistributions } from "@/lib/convolution"

const probabilities = Symbol("damage-distribution-probabilities")

export type DamageDistribution = {
  readonly [probabilities]: ReadonlyMap<number, number>
}

export type AtomicDamageDistributionInput = {
  hitProbability: number
  criticalHitProbability: number
  normalDamageRolls?: readonly number[]
  criticalDamageRolls?: readonly number[]
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

  addProbability(distribution, 0, 1 - hitProbability)

  const branches = [
    ["normal", normalDamageRolls, hitProbability * (1 - criticalHitProbability)],
    ["critical", criticalDamageRolls, hitProbability * criticalHitProbability],
  ] as const

  for (const [name, rolls, probability] of branches) {
    if (probability === 0) continue
    if (!rolls?.length) {
      throw new Error(`${name} damage rolls are required when the branch has probability`)
    }
    for (const damage of rolls) {
      addProbability(distribution, damage, probability / rolls.length)
    }
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
