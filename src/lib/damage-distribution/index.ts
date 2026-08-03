import { convolveSparseDistributions } from "@/lib/convolution"

const probabilities = Symbol("damage-distribution-probabilities")
declare const atomic: unique symbol
declare const convolved: unique symbol

type DamageDistribution = {
  readonly [probabilities]: ReadonlyMap<number, number>
}

export type AtomicDamageDistribution = DamageDistribution & {
  readonly [atomic]: true
}

export type ConvolvedDamageDistribution = DamageDistribution & {
  readonly [convolved]: true
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
}: AtomicDamageDistributionInput): AtomicDamageDistribution {
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

  return { [probabilities]: distribution } as unknown as AtomicDamageDistribution
}

export function convolveAtomicDamageDistributions(
  distributions: readonly [AtomicDamageDistribution, ...AtomicDamageDistribution[]],
): ConvolvedDamageDistribution {
  return {
    [probabilities]: convolveSparseDistributions(
      distributions.map((distribution) => distribution[probabilities]),
    ),
  } as ConvolvedDamageDistribution
}

export function calculateKOProbability(
  distribution: ConvolvedDamageDistribution,
  hp: number,
): number {
  let probability = 0

  for (const [damage, damageProbability] of distribution[probabilities]) {
    if (damage >= hp) probability += damageProbability
  }

  return probability
}
