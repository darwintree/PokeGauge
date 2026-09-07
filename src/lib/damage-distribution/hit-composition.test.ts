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
  it("combines misses, criticals, and duplicate zero rolls through the execution seam", () => {
    const mixed = resolveHitComposition(sequence([hit(10, 20)]), 0.75, 0.2)
    expect(sequenceKOProbabilities(mixed, () => mixed, 10).ohko).toBeCloseTo(0.75)
    expect(sequenceKOProbabilities(mixed, () => mixed, 20).ohko).toBeCloseTo(0.15)
    expect(sequenceKOProbabilities(mixed, () => mixed, 21).ohko).toBe(0)

    const zeros = resolveHitComposition(sequence([{
      normal: { rolls: [0, 0, 10, 10], effectivePower: 10, consumesBerry: false },
    }]), 0.5, 0)
    expect(sequenceKOProbabilities(zeros, () => zeros, 10).ohko).toBeCloseTo(0.25)
    expect(zeros.reduce((sum, outcome) => sum + outcome.probability, 0)).toBeCloseTo(1)
  })

  it("accepts a guaranteed-critical execution without an ordinary branch", () => {
    const outcomes = resolveHitComposition(sequence([{
      critical: { rolls: [20], effectivePower: 20, consumesBerry: false },
    }]), 0.5, 1)
    expect(sequenceKOProbabilities(outcomes, () => outcomes, 20).ohko).toBe(0.5)
    expect(resolutionRange(outcomes, false)).toBeUndefined()
  })

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
    expect(sequenceKOProbabilities(first, (outcome) => outcome.berryConsumed ? consumed : first, 70)).toEqual({ ohko: 0, twoHit: 0.25 })
    expect(sequenceKOProbabilities(first, (outcome) => outcome.berryConsumed ? consumed : first, 25)).toEqual({ ohko: 0.5, twoHit: 0.75 })
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
    expect(sequenceKOProbabilities(outcomes, () => outcomes, 1)).toEqual({ ohko: 0, twoHit: 0 })
  })

  it("aggregates equivalent power along the same mixed-critical paths", () => {
    const outcomes = resolveHitComposition(sequence([hit(30, 45, true), hit(60, 90)]), 1, 0.5, false, "power")
    expect(resolutionRange(outcomes, false)).toEqual({ min: 90, max: 90 })
    expect(resolutionRange(outcomes, true)).toEqual({ min: 105, max: 135 })
  })
})

describe("shared hit state transitions", () => {
  it("retains damage/stat correlation alongside Berry consumption", () => {
    const composition: HitComposition = {
      accuracyScope: "move", statChangeProbability: 0.5,
      choices: [{ probability: 1, hits: [
        hit(10, undefined, true),
        { ...hit(20), afterStatChanges: [hit(40)] },
      ] }],
    }
    const outcomes = resolveHitComposition(composition, 0.5, 0)
    expect(outcomes.filter((outcome) => outcome.landed).map((outcome) =>
      [outcome.damage, outcome.statChanges, outcome.berryConsumed, outcome.probability],
    ).sort()).toEqual([
      [30, 0, true, 0.125], [30, 1, true, 0.125],
      [50, 1, true, 0.125], [50, 2, true, 0.125],
    ])
    expect(outcomes.find((outcome) => !outcome.landed)).toMatchObject({
      damage: 0, statChanges: 0, berryConsumed: false, probability: 0.5,
    })
    const result = sequenceKOProbabilities(outcomes, (outcome) => [
      { ...outcome, damage: 10 + 10 * outcome.statChanges, probability: 1 },
    ], 70)
    expect(result.twoHit).toBe(0.25)
  })

  it("uses incoming state for each hit with independent critical outcomes", () => {
    const composition: HitComposition = {
      accuracyScope: "move", statChangeProbability: 1,
      choices: [{ probability: 1, hits: [
        hit(10, 15), { ...hit(20, 30), afterStatChanges: [hit(40, 60)] },
      ] }],
    }
    const outcomes = resolveHitComposition(composition, 1, 0.5)
    expect(outcomes.map((outcome) => [outcome.damage, outcome.statChanges]).sort()).toEqual([
      [50, 2], [55, 2], [70, 2], [75, 2],
    ])
    expect(resolutionRange(outcomes, true)).toEqual({ min: 55, max: 75 })
    const immune = resolveHitComposition({ ...composition,
      choices: [{ probability: 1, hits: [hit(0), hit(0)] }],
    }, 1, 0)
    expect(immune[0].statChanges).toBe(0)
  })
})

it("requires explicit rows for reachable stat changes, including unchanged damage", () => {
  const unchanged = hit(10)
  const composition: HitComposition = {
    accuracyScope: "move", statChangeProbability: 1,
    choices: [{ probability: 1, hits: [unchanged, unchanged] }],
  }
  expect(() => resolveHitComposition(composition, 1, 0)).toThrow("Missing Hit variant for 1 prior stat changes at hit 2")
  const explicit = { ...composition, choices: [{ probability: 1, hits: [
    unchanged, { ...unchanged, afterStatChanges: [unchanged] },
  ] }] }
  expect(resolveHitComposition(explicit, 1, 0)).toMatchObject([
    { damage: 20, statChanges: 2, probability: 1 },
  ])
})

it("uses the same state transitions for a three-hit composition", () => {
  const outcomes = resolveHitComposition({
    accuracyScope: "move", statChangeProbability: 0.5,
    choices: [{ probability: 1, hits: [
      hit(10),
      { ...hit(10), afterStatChanges: [hit(20)] },
      { ...hit(10), afterStatChanges: [hit(20), hit(30)] },
    ] }],
  }, 1, 0)
  expect(outcomes.map((outcome) => [outcome.damage, outcome.statChanges, outcome.probability]).sort())
    .toEqual([
      [30, 0, 0.125], [30, 1, 0.125], [40, 1, 0.125], [40, 2, 0.125],
      [50, 1, 0.125], [50, 2, 0.125], [60, 2, 0.125], [60, 3, 0.125],
    ])
})
