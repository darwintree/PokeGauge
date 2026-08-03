import { describe, expect, it } from "vitest"

import {
  convolveAtomicDamageDistributions,
  createAtomicDamageDistribution,
  calculateKOProbability,
} from "@/lib/damage-distribution"

const rolls = (damage: number) => Array<number>(16).fill(damage)

describe("damage distribution", () => {
  it("combines misses, conditional critical hits, and damage rolls", () => {
    const distribution = createAtomicDamageDistribution({
      hitProbability: 0.75,
      criticalHitProbability: 0.2,
      normalDamageRolls: rolls(10),
      criticalDamageRolls: rolls(20),
    })

    const convolved = convolveAtomicDamageDistributions([distribution])
    expect(calculateKOProbability(convolved, 1)).toBeCloseTo(0.75)
    expect(calculateKOProbability(convolved, 10)).toBeCloseTo(0.75)
    expect(calculateKOProbability(convolved, 20)).toBeCloseTo(0.15)
    expect(calculateKOProbability(convolved, 21)).toBe(0)
  })

  it("aggregates duplicate zero-damage rolls with misses", () => {
    const distribution = createAtomicDamageDistribution({
      hitProbability: 0.5,
      criticalHitProbability: 0,
      normalDamageRolls: [...rolls(0).slice(0, 8), ...rolls(10).slice(0, 8)],
      criticalDamageRolls: rolls(20),
    })

    const convolved = convolveAtomicDamageDistributions([distribution])
    expect(calculateKOProbability(convolved, 1)).toBeCloseTo(0.25)
    expect(calculateKOProbability(convolved, 10)).toBeCloseTo(0.25)
  })

  it("accepts normal-only and critical-only calculations", () => {
    const normal = createAtomicDamageDistribution({
      hitProbability: 0.5,
      criticalHitProbability: 0,
      normalDamageRolls: rolls(10),
    })
    const critical = createAtomicDamageDistribution({
      hitProbability: 0.5,
      criticalHitProbability: 1,
      criticalDamageRolls: rolls(20),
    })

    expect(calculateKOProbability(convolveAtomicDamageDistributions([normal]), 10)).toBeCloseTo(0.5)
    expect(calculateKOProbability(convolveAtomicDamageDistributions([critical]), 20)).toBeCloseTo(0.5)
  })

  it("rejects a missing branch with positive probability", () => {
    expect(() =>
      createAtomicDamageDistribution({
        hitProbability: 1,
        criticalHitProbability: 0.5,
        normalDamageRolls: rolls(10),
      }),
    ).toThrow("critical damage rolls are required")
  })

  it("computes cumulative OHKO, 2HKO, and 3HKO probabilities", () => {
    const atomic = createAtomicDamageDistribution({
      hitProbability: 0.5,
      criticalHitProbability: 0,
      normalDamageRolls: rolls(60),
      criticalDamageRolls: rolls(90),
    })

    expect(calculateKOProbability(convolveAtomicDamageDistributions([atomic]), 100)).toBe(0)
    expect(calculateKOProbability(convolveAtomicDamageDistributions([atomic, atomic]), 100)).toBeCloseTo(
      0.25,
    )
    expect(
      calculateKOProbability(convolveAtomicDamageDistributions([atomic, atomic, atomic]), 100),
    ).toBeCloseTo(0.5)
  })
})
