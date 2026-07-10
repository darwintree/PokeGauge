import { describe, expect, it } from "vitest"

import {
  convolveDamageDistributions,
  createAtomicDamageDistribution,
  koProbability,
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

    expect(koProbability(distribution, 1)).toBeCloseTo(0.75)
    expect(koProbability(distribution, 10)).toBeCloseTo(0.75)
    expect(koProbability(distribution, 20)).toBeCloseTo(0.15)
    expect(koProbability(distribution, 21)).toBe(0)
  })

  it("aggregates duplicate zero-damage rolls with misses", () => {
    const distribution = createAtomicDamageDistribution({
      hitProbability: 0.5,
      criticalHitProbability: 0,
      normalDamageRolls: [...rolls(0).slice(0, 8), ...rolls(10).slice(0, 8)],
      criticalDamageRolls: rolls(20),
    })

    expect(koProbability(distribution, 1)).toBeCloseTo(0.25)
    expect(koProbability(distribution, 10)).toBeCloseTo(0.25)
  })

  it("computes cumulative OHKO, 2HKO, and 3HKO probabilities", () => {
    const atomic = createAtomicDamageDistribution({
      hitProbability: 0.5,
      criticalHitProbability: 0,
      normalDamageRolls: rolls(60),
      criticalDamageRolls: rolls(90),
    })

    expect(koProbability(atomic, 100)).toBe(0)
    expect(koProbability(convolveDamageDistributions([atomic, atomic]), 100)).toBeCloseTo(
      0.25,
    )
    expect(
      koProbability(convolveDamageDistributions([atomic, atomic, atomic]), 100),
    ).toBeCloseTo(0.5)
  })
})
