import { describe, expect, it } from "vitest"
import {
  resolveHitComposition,
  resolutionRange,
  sequenceKOProbabilities,
  type Hit,
  type HitComposition,
} from "./hit-composition"

function hit(normal: number, critical?: number, consumesBerry = false): Hit {
  return {
    normal: { rolls: [normal], effectivePower: normal, consumesBerry },
    ...(critical === undefined ? {} : {
      critical: { rolls: [critical], effectivePower: critical, consumesBerry },
    }),
  }
}

function sequence(hits: Hit[], accuracyScope: "move" | "hit" = "move"): HitComposition {
  return { accuracyScope, choices: [{ probability: 1, hits }] }
}

function damageProbabilities(composition: HitComposition, accuracy = 1, critical = 0) {
  const result = new Map<number, number>()
  for (const outcome of resolveHitComposition(composition, accuracy, critical)) {
    result.set(outcome.damage, (result.get(outcome.damage) ?? 0) + outcome.probability)
  }
  return result
}

describe("Hit Composition", () => {
  it("checks shared accuracy once for the whole move", () => {
    expect(damageProbabilities(sequence([hit(30), hit(30), hit(30)]), 0.5))
      .toEqual(new Map([[0, 0.5], [90, 0.5]]))
  })

  it("stops on the first per-Hit miss without undoing earlier damage", () => {
    const composition = sequence([hit(30), hit(30), hit(30)], "hit")
    expect(damageProbabilities(composition, 0.5)).toEqual(new Map([
      [0, 0.5], [30, 0.25], [60, 0.125], [90, 0.125],
    ]))
    expect(resolutionRange(resolveHitComposition(composition, 0.5, 0), false))
      .toEqual({ min: 30, max: 90 })
    expect(resolutionRange(resolveHitComposition(composition, 1, 0), false))
      .toEqual({ min: 90, max: 90 })
  })

  it("weights random Hit counts independently of damage rolls", () => {
    const composition: HitComposition = {
      accuracyScope: "move",
      choices: [
        { probability: 0.8, hits: [hit(30), hit(30)] },
        { probability: 0.2, hits: Array.from({ length: 5 }, () => hit(30)) },
      ],
    }
    expect(damageProbabilities(composition)).toEqual(new Map([[60, 0.8], [150, 0.2]]))
  })

  it("combines independent rolls instead of adding equal roll indices", () => {
    const rolled: Hit = { normal: { rolls: [10, 20], effectivePower: 10, consumesBerry: false } }
    expect(damageProbabilities(sequence([rolled, rolled])))
      .toEqual(new Map([[20, 0.25], [30, 0.5], [40, 0.25]]))
  })

  it("includes mixed critical paths in at-least-one-critical references", () => {
    const composition = sequence([hit(30, 45), hit(30, 45)])
    expect(damageProbabilities(composition, 1, 0.5))
      .toEqual(new Map([[60, 0.25], [75, 0.5], [90, 0.25]]))
    const outcomes = resolveHitComposition(composition, 1, 0.5)
    expect(resolutionRange(outcomes, false)).toEqual({ min: 60, max: 60 })
    expect(resolutionRange(outcomes, true)).toEqual({ min: 75, max: 90 })
  })

  it("allows critical and normal ranges to overlap after early termination", () => {
    const outcomes = resolveHitComposition(sequence(Array.from({ length: 3 }, () => hit(30, 45)), "hit"), 0.9, 0.5)
    expect(resolutionRange(outcomes, false)).toEqual({ min: 30, max: 90 })
    expect(resolutionRange(outcomes, true)).toEqual({ min: 45, max: 135 })
    expect(outcomes.reduce((sum, outcome) => sum + outcome.probability, 0)).toBeCloseTo(1, 12)
  })

  it("carries Berry consumption across uses, including a miss on either use", () => {
    const first = resolveHitComposition(sequence([hit(30, undefined, true)]), 0.5, 0)
    const consumed = resolveHitComposition(sequence([hit(60)]), 0.5, 0, true)
    expect(first.find((outcome) => !outcome.landed)?.berryConsumed).toBe(false)
    expect(first.find((outcome) => outcome.landed)?.berryConsumed).toBe(true)
    expect(sequenceKOProbabilities(first, consumed, 70)).toEqual({ ohko: 0, twoHit: 0.25 })
    expect(sequenceKOProbabilities(first, consumed, 25)).toEqual({ ohko: 0.5, twoHit: 0.75 })
  })

  it("does not merge equal damage with different Berry states", () => {
    const composition: HitComposition = {
      accuracyScope: "move",
      choices: [
        { probability: 0.5, hits: [hit(30, undefined, true)] },
        { probability: 0.5, hits: [hit(30)] },
      ],
    }
    const outcomes = resolveHitComposition(composition, 1, 0)
    expect(outcomes).toHaveLength(2)
    expect(new Set(outcomes.map((outcome) => outcome.berryConsumed))).toEqual(new Set([true, false]))
  })

  it("distinguishes an immune landed Hit from a completely missed move", () => {
    const outcomes = resolveHitComposition(sequence([hit(0)]), 0.5, 0)
    expect(outcomes).toHaveLength(2)
    expect(resolutionRange(outcomes, false)).toEqual({ min: 0, max: 0 })
    expect(sequenceKOProbabilities(outcomes, outcomes, 1)).toEqual({ ohko: 0, twoHit: 0 })
  })

  it("aggregates equivalent power along the same mixed-critical paths", () => {
    const outcomes = resolveHitComposition(sequence([hit(30, 45, true), hit(60, 90)]), 1, 0.5, false, "power")
    expect(resolutionRange(outcomes, false)).toEqual({ min: 90, max: 90 })
    expect(resolutionRange(outcomes, true)).toEqual({ min: 105, max: 135 })
  })
})
