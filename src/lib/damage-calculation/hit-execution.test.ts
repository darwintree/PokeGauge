import { beforeAll, describe, expect, it } from "vitest"

import { getCatalogShell } from "@/lib/catalog"
import { defaultTrackState, runScenarioPipeline } from "@/lib/scenario"
import { createMoveSnapshot, editMoveSnapshot, moveHitProfile } from "@/lib/move"
import { getMoveById, listResources } from "@/lib/resources"
import { calculationIdentity, compileScenario, type RawScenario } from "./scenario-compiler"
import { compileHitComposition, evaluateExecutionPoint, projectHitComposition } from "./hit-execution"
import { projectMoveMechanics } from "./mechanics-projection"

function scenario(moveId: number, overrides: Partial<RawScenario> = {}) {
  const move = getMoveById(moveId)!
  const compiled = compileScenario({
    snapshot: createMoveSnapshot({ id: moveId, power: move.power!, accuracy: move.accuracy, isSpread: move.isSpread }, "test"),
    attackerId: 445,
    defenderId: 143,
    attackerItemId: "none",
    defenderItemId: "none",
    attackerAbilityId: -1,
    defenderAbilityId: -1,
    attackerStage: 0,
    defenderStage: 0,
    weather: "none",
    terrain: "none",
    screen: "none",
    probabilityMode: "battle-odds",
    lowOutcome: { offense: 150, defense: { hp: 200, def: 100 } },
    ...overrides,
  })
  if (compiled.kind !== "calculable") throw new Error(compiled.reason)
  return compiled
}

beforeAll(async () => {
  await Promise.all([listResources("pokemon", "en"), listResources("move", "en"), listResources("ability", "en")])
})

describe("initial full-HP conditions across Move Executions", () => {
  it.each([136, 231])("carries damage through two single uses just as two hits for Ability %i", (defenderAbilityId) => {
    const common: Partial<RawScenario> = {
      defenderId: 149,
      defenderAbilityId,
      probabilityMode: "classic",
      lowOutcome: { offense: 150, defense: { hp: 34, def: 100 } },
    }
    const double = scenario(458, common) // Double Hit: two Normal-type, 35-power hits.
    const single = scenario(1, {
      ...common,
      snapshot: createMoveSnapshot({ id: 1, power: 35, accuracy: 100, isSpread: false }, "pound"),
    })
    const doubleResult = evaluateExecutionPoint(double, double.calculation.low)
    const singleResult = evaluateExecutionPoint(single, single.calculation.low)

    expect(singleResult.normal).toEqual({ min: 10, max: 12 })
    expect(doubleResult.normal).toEqual({ min: 31, max: 37 })
    expect(doubleResult.ko.ohko).toBeGreaterThan(0)
    expect(doubleResult.ko.ohko).toBeLessThan(1)
    expect(singleResult.ko.ohko).toBe(0)
    expect(singleResult.ko.twoHit).toBeCloseTo(doubleResult.ko.ohko, 12)
  })

  it("keeps full-HP protection after a miss and does not reset it after damage", () => {
    const compiled = scenario(1, {
      defenderId: 149, defenderAbilityId: 136,
      snapshot: createMoveSnapshot({ id: 1, power: 35, accuracy: 50, isSpread: false }, "pound"),
      lowOutcome: { offense: 150, defense: { hp: 20, def: 100 } },
    })
    compiled.probability.criticalHitProbability = 0
    // A first-use miss leaves the second hit reduced to 10–12, below 20 HP.
    // Only the two-hit path KOs: 0.5 × 0.5.
    expect(evaluateExecutionPoint(compiled).ko).toEqual({ ohko: 0, twoHit: 0.25 })
  })

  it("carries damage, Berry consumption, and a chance-based defense drop together", () => {
    const compiled = scenario(242, {
      defenderId: 65, defenderAbilityId: 136, defenderItemId: 175,
      snapshot: createMoveSnapshot({ id: 242, power: 80, accuracy: 50, isSpread: false }, "crunch"),
      lowOutcome: { offense: 150, defense: { hp: 140, def: 100 } },
    })
    compiled.probability.criticalHitProbability = 0
    // First hit: 22–27 after Multiscale and Colbur Berry. Second hit without
    // either defense: 90–108, or 138–164 after Crunch's drop. Only the drop path KOs.
    expect(evaluateExecutionPoint(compiled).ko.ohko).toBe(0)
    expect(evaluateExecutionPoint(compiled).ko.twoHit).toBeCloseTo(0.5 * 0.2 * 0.5, 12)
  })

  it("retains Tera Shell for the first entire execution, but not the second", () => {
    const compiled = scenario(458, {
      defenderId: 149, defenderAbilityId: 305, probabilityMode: "classic",
      lowOutcome: { offense: 150, defense: { hp: 55, def: 100 } },
    })
    const result = evaluateExecutionPoint(compiled)
    expect(result.normal).toEqual({ min: 20, max: 24 })
    expect(result.ko).toEqual({ ohko: 0, twoHit: 1 })
  })

  it("does not merge initial-only protection with an otherwise equal persistent reduction", () => {
    const common: Partial<RawScenario> = {
      defenderId: 149, probabilityMode: "classic",
      lowOutcome: { offense: 150, defense: { hp: 40, def: 100 } },
    }
    const multiscale = scenario(33, { ...common, defenderAbilityId: 136 })
    const fluffy = scenario(33, { ...common, defenderAbilityId: 218 })
    expect(evaluateExecutionPoint(multiscale).normal).toEqual(evaluateExecutionPoint(fluffy).normal)
    expect(calculationIdentity(multiscale)).not.toBe(calculationIdentity(fluffy))
    expect(evaluateExecutionPoint(multiscale).ko.twoHit).toBeGreaterThan(evaluateExecutionPoint(fluffy).ko.twoHit)
  })

  it("projects full-HP damage reduction only on the first damaging hit", () => {
    const compiled = scenario(458, { defenderId: 149, defenderAbilityId: 136, probabilityMode: "classic" })
    const result = evaluateExecutionPoint(compiled)
    expect(result.normalPower).toEqual({ min: 52, max: 52 })
    expect(projectMoveMechanics(compiled, result).hits).toEqual([
      { basePower: 35, normal: 17, critical: 26 },
      { basePower: 35, normal: 35, critical: 52 },
    ])
  })
})

describe("calc Hit execution adapter", () => {
  it("reads every reviewed multi-hit move as per-Hit arrays", () => {
    for (let id = 1; id <= 920; id += 1) {
      if (!moveHitProfile(id)) continue
      const compiled = scenario(id)
      const composition = compileHitComposition(compiled, compiled.calculation.low)
      expect(composition.choices.map((choice) => choice.hits.length)).toEqual(compiled.execution.counts.map((choice) => choice.count))
      for (const choice of composition.choices) {
        for (const hit of choice.hits) {
          expect(hit.normal?.rolls ?? hit.critical?.rolls, `move ${id}`).toHaveLength(16)
        }
      }
    }
  })

  it("uses the same full-hit Triple Axel references in Battle Odds and Classic", () => {
    const compiled = scenario(813)
    const composition = compileHitComposition(compiled, compiled.calculation.low)
    const hits = composition.choices[0].hits
    expect(compiled.execution.powers).toEqual([20, 40, 60])
    expect(hits[1].normal!.rolls[0]).toBeGreaterThan(hits[0].normal!.rolls[15])
    expect(hits[2].normal!.rolls[0]).toBeGreaterThan(hits[1].normal!.rolls[15])
    const battle = evaluateExecutionPoint(compiled, compiled.calculation.low)
    const classicScenario = scenario(813, { probabilityMode: "classic" })
    const classic = evaluateExecutionPoint(classicScenario, classicScenario.calculation.low)
    expect(classic.normal!.min).toBe(hits.reduce((sum, hit) => sum + hit.normal!.rolls[0], 0))
    expect(battle.normal).toEqual(classic.normal)
    expect(battle.critical).toEqual(classic.critical)
    expect(battle.normalPower).toEqual({ min: 120, max: 120 })
    expect(battle.criticalPower).toEqual({ min: 130, max: 180 })
    expect(projectMoveMechanics(compiled).hitCounts).toEqual({ min: 3, max: 3 })
  })

  it("shows 90 normal and 105–135 mixed-critical damage for three 30-power hits", () => {
    const hit = {
      normal: { rolls: [30], effectivePower: 30, consumesBerry: false },
      critical: { rolls: [45], effectivePower: 45, consumesBerry: false },
    }
    const reference = projectHitComposition({ accuracyScope: "hit", choices: [{ probability: 1, hits: [hit, hit, hit] }] })
    expect(reference.normal).toEqual({ min: 90, max: 90 })
    expect(reference.critical).toEqual({ min: 105, max: 135 })
    expect(reference.normalPower).toEqual(reference.normal)
    expect(reference.criticalPower).toEqual(reference.critical)
  })

  it("keeps misses and partial executions in Battle Odds without changing output references", () => {
    const results = [50, 90].map((accuracy) => {
      const compiled = scenario(813, {
        snapshot: createMoveSnapshot({ id: 813, power: 20, accuracy, isSpread: false }, "axel"),
        lowOutcome: { offense: 150, defense: { hp: 10, def: 100 } },
      })
      return evaluateExecutionPoint(compiled, compiled.calculation.low)
    })
    expect(results[0].normal).toEqual(results[1].normal)
    expect(results[0].critical).toEqual(results[1].critical)
    expect(results[0].normalPower).toEqual(results[1].normalPower)
    expect(results[0].criticalPower).toEqual(results[1].criticalPower)
    // The first hit already KOs: later misses cannot turn it into a failed use.
    expect(results[0].ko.ohko).toBeCloseTo(0.5)
    expect(results[0].ko.twoHit).toBeCloseTo(0.75)
    expect(results[1].ko.ohko).toBeCloseTo(0.9)
    expect(results[1].ko.twoHit).toBeCloseTo(0.99)
  })

  it.each(["classic", "battle-odds"] as const)("retains random 2–5 hit ranges in %s", (probabilityMode) => {
    const compiled = scenario(331, { probabilityMode })
    const composition = compileHitComposition(compiled, compiled.calculation.low)
    const result = evaluateExecutionPoint(compiled, compiled.calculation.low)
    const firstChoice = composition.choices[0].hits
    const lastChoice = composition.choices[composition.choices.length - 1].hits
    expect(result.normal!.min).toBe(firstChoice.reduce((sum, hit) => sum + hit.normal!.rolls[0], 0))
    expect(result.normal!.max).toBe(lastChoice.reduce((sum, hit) => sum + hit.normal!.rolls[15], 0))
    expect(projectMoveMechanics(compiled).hitCounts).toEqual({ min: 2, max: 5 })
  })

  it("Skill Link fixes random count and shares the per-Hit accuracy check", () => {
    const random = scenario(331, { attackerAbilityId: 92 })
    expect(random.execution.counts).toEqual([{ count: 5, probability: 1 }])
    const stop = scenario(813, { attackerAbilityId: 92 })
    expect(stop.execution.accuracyScope).toBe("move")
    expect(stop.sources.find((source) => source.track === "attacker-ability")?.state).toBe("active")
    const ordinary = scenario(1, { attackerAbilityId: 92 })
    expect(ordinary.sources.find((source) => source.track === "attacker-ability")?.state).toBe("inactive")
  })

  it("applies a resistance Berry only to the first hit and removes it for the next use", () => {
    const withBerry = scenario(24, { defenderItemId: 166 })
    const neutral = scenario(24)
    const first = compileHitComposition(withBerry, withBerry.calculation.low).choices[0].hits
    const none = compileHitComposition(neutral, neutral.calculation.low).choices[0].hits
    const consumed = compileHitComposition(withBerry, withBerry.calculation.low, true).choices[0].hits
    expect(first[0].normal!.consumesBerry).toBe(true)
    expect(first[1].normal!.consumesBerry).toBe(false)
    expect(first[0].normal!.rolls[15]).toBeLessThan(none[0].normal!.rolls[0])
    expect(first[1].normal!.rolls).toEqual(none[1].normal!.rolls)
    expect(consumed.map((hit) => hit.normal!.rolls)).toEqual(none.map((hit) => hit.normal!.rolls))
  })

  it("does not consume a Berry when it is suppressed or when the move is immune", () => {
    for (const overrides of [
      { attackerAbilityId: 127 },
      { defenderAbilityId: 103 },
      { defenderId: 94 },
    ]) {
      const compiled = scenario(24, { defenderItemId: 166, ...overrides })
      const hits = compileHitComposition(compiled, compiled.calculation.low).choices[0].hits
      expect(hits.every((hit) => !hit.normal!.consumesBerry)).toBe(true)
    }
  })

  it("keeps Parental Bond's child and mixed-critical reference without duplicating hits", () => {
    const compiled = scenario(1, { attackerAbilityId: 185 })
    const composition = compileHitComposition(compiled, compiled.calculation.low)
    const hits = composition.choices[0].hits
    expect(hits).toHaveLength(2)
    expect(hits[1].normal!.rolls[15]).toBeLessThan(hits[0].normal!.rolls[0])
    const projection = projectHitComposition(composition)
    expect(projection.critical!.min).toBe(Math.min(
      hits[0].critical!.rolls[0] + hits[1].normal!.rolls[0],
      hits[0].normal!.rolls[0] + hits[1].critical!.rolls[0],
    ))
    expect(projection.critical!.max).toBe(hits[0].critical!.rolls[15] + hits[1].critical!.rolls[15])
  })

  it("consumes Chilan Berry before the Parental Bond child hit", () => {
    const compiled = scenario(1, { attackerAbilityId: 185, defenderItemId: 177 })
    const neutral = scenario(1, { attackerAbilityId: 185 })
    const hits = compileHitComposition(compiled, compiled.calculation.low).choices[0].hits
    const without = compileHitComposition(neutral, neutral.calculation.low).choices[0].hits
    expect(hits[0].normal!.consumesBerry).toBe(true)
    expect(hits[0].normal!.rolls[15]).toBeLessThan(without[0].normal!.rolls[0])
    expect(hits[1].normal!.rolls).toEqual(without[1].normal!.rolls)
    expect(hits[1].critical!.rolls).toEqual(without[1].critical!.rolls)
    expect(hits[1].normal!.consumesBerry).toBe(false)
  })

  it("retains actual per-check accuracy when Classic merges calculation work", async () => {
    const catalog = await getCatalogShell(445, 143, "en", "physical")
    const state = defaultTrackState(catalog)
    Object.assign(state, {
      statMode: "preset", defenderMode: "preset", attackerAbilityIds: [-1, 99],
      defenderAbilityIds: [-1], attackerItemIds: ["none"], defenderItemIds: ["none"],
    })
    state.offensePresetIds = state.offensePresetIds.slice(0, 1)
    state.defensePresetIds = state.defensePresetIds.slice(0, 1)
    state.moveSnapshots = [createMoveSnapshot({ id: 813, power: 20, accuracy: 90, isSpread: false }, "axel")]
    state.selectedMoveSnapshotIds = ["axel"]
    const result = runScenarioPipeline(catalog, state, "classic")
    expect(result.rows).toHaveLength(2)
    expect(result.rows.map((row) => row.moveMechanics.hitFact)).toEqual([90, "always-hits"])
    expect(result.rows[0].moveMechanics.normal!.effectivePower).toBe(120)
    expect(result.rows[0].moveMechanics.critical!.effectivePower).toEqual({ min: 130, max: 180 })
    expect(result.rows[0].koProbabilities).toEqual(result.rows[1].koProbabilities)
  })

  it("does not apply Parental Bond to native multi-hit, spread, charge or recharge moves", () => {
    for (const id of [24, 89, 76, 63]) {
      const compiled = scenario(id, { attackerAbilityId: 185 })
      expect(compiled.execution.parentalBond, `move ${id}`).toBe(false)
      expect(compiled.calculation.low.calc.attacker.abilityCalcName).toBeUndefined()
    }
  })

  it("projects total normal and mixed-critical equivalent powers with per-Hit details", () => {
    const compiled = scenario(24, { defenderItemId: 166 })
    const mechanics = projectMoveMechanics(compiled)
    expect(mechanics.hits).toEqual([
      { basePower: 30, normal: 30, critical: 45 },
      { basePower: 30, normal: 60, critical: 90 },
    ])
    expect(mechanics.normal!.effectivePower).toBe(90)
    expect(mechanics.critical!.effectivePower).toEqual({ min: 105, max: 135 })
  })

  it("keeps guaranteed-critical hits in Classic Mode", () => {
    const compiled = scenario(818, { probabilityMode: "classic" })
    const result = evaluateExecutionPoint(compiled, compiled.calculation.low)
    expect(compiled.probability.criticalHitProbability).toBe(1)
    expect(result.normal).toBeUndefined()
    expect(result.critical).toBeDefined()
  })

  it("locks native multi-hit power while retaining accuracy and crit editing", () => {
    const snapshot = scenario(813).snapshotId
    const original = createMoveSnapshot({ id: 813, power: 20, accuracy: 90, isSpread: false }, snapshot)
    expect(editMoveSnapshot(original, { power: 200, accuracy: 80, criticalStage: 2 }))
      .toMatchObject({ power: 20, accuracy: 80, criticalStage: 2 })
  })
})

describe("stat changes between move uses", () => {
  it.each([242, 232, 451])("Classic excludes chance-based changes for move %i", (moveId) => {
    const classic = scenario(moveId, { probabilityMode: "classic" })
    expect(classic.statChange).toBeUndefined()
    const battle = scenario(moveId)
    expect(battle.statChange!.probability).toBeLessThan(1)
    const actual = evaluateExecutionPoint(battle, battle.calculation.low)
    const unchanged = evaluateExecutionPoint({ ...battle, statChange: undefined }, battle.calculation.low)
    expect(actual.normal).toEqual(unchanged.normal)
    expect(actual.critical).toEqual(unchanged.critical)
    expect(actual.normalPower).toEqual(unchanged.normalPower)
    expect(actual.ko.ohko).toBe(unchanged.ko.ohko)
  })

  it.each([491, 871, 612])("Classic retains guaranteed changes for move %i", (moveId) => {
    expect(scenario(moveId, { probabilityMode: "classic" }).statChange?.probability).toBe(1)
  })

  it("weights Crunch's drop with misses and a consumed resistance Berry", async () => {
    const { calculateHitMatrix } = await import("./calc-engine")
    const compiled = scenario(242, {
      defenderId: 65, defenderItemId: 175, // Colbur Berry, super-effective Dark
      snapshot: createMoveSnapshot({ id: 242, power: 80, accuracy: 50, isSpread: false }, "crunch"),
    })
    compiled.probability.criticalHitProbability = 0
    const point = compiled.calculation.low
    const first = calculateHitMatrix(point.calc, 1, false, false, true)
    expect(first.consumesBerry).toBe(true)
    const unchanged = calculateHitMatrix(point.calc, 1, false, true, true).rolls[0]
    const loweredContext = { ...point.calc, defender: {
      ...point.calc.defender, boosts: { ...point.calc.defender.boosts, def: -1 },
    } }
    const lowered = calculateHitMatrix(loweredContext, 1, false, true, true).rolls[0]
    let sawBenefit = false
    for (let hp = 20; hp <= 240; hp += 10) {
      let expected = 0
      // Both misses, first miss then hit, first hit then miss, and both hits.
      for (const b of first.rolls[0]) if (b >= hp) expected += 0.25 / 16
      for (const a of first.rolls[0]) {
        if (a >= hp) expected += 0.25 / 16
        for (const b of unchanged) if (a + b >= hp) expected += 0.25 * 0.8 / 256
        for (const b of lowered) if (a + b >= hp) expected += 0.25 * 0.2 / 256
      }
      const actual = evaluateExecutionPoint(compiled, { ...point, defenderHp: hp })
      const without = evaluateExecutionPoint({ ...compiled, statChange: undefined }, { ...point, defenderHp: hp })
      expect(actual.ko.twoHit).toBeCloseTo(expected, 10)
      sawBenefit ||= actual.ko.twoHit > without.ko.twoHit + 0.001
    }
    expect(sawBenefit).toBe(true)
  })

  it("carries both Parental Bond Power-Up Punch boosts without applying either twice", async () => {
    const { calculateHitMatrix } = await import("./calc-engine")
    const compiled = scenario(612, { attackerId: 10039, attackerAbilityId: 185, probabilityMode: "classic" })
    expect(compiled.statChange?.stages).toBe(1)
    const point = compiled.calculation.low
    const first = calculateHitMatrix(point.calc, 2, false, false, false).rolls
    const nextContext = { ...point.calc, attacker: {
      ...point.calc.attacker, boosts: { ...point.calc.attacker.boosts, atk: 2 },
    } }
    const second = calculateHitMatrix(nextContext, 2, false, false, false).rolls
    const hp = first[0][15] + first[1][15] + second[0][0] + second[1][0]
    let successes = 0
    for (const a of first[0]) for (const b of first[1]) {
      for (const c of second[0]) for (const d of second[1]) {
        if (a + b + c + d >= hp) successes++
      }
    }
    const actual = evaluateExecutionPoint(compiled, { ...point, defenderHp: hp })
    expect(actual.ko.twoHit).toBeCloseTo(successes / 16 ** 4, 10)
    expect(actual.ko.twoHit).toBeGreaterThan(0)
    expect(actual.ko.twoHit).toBeGreaterThan(evaluateExecutionPoint(
      { ...compiled, statChange: undefined }, { ...point, defenderHp: hp },
    ).ko.twoHit)
  })

  it.each([
    [491, { defenderStage: -6 }], [612, { attackerStage: 6 }],
  ] as const)("clamps move %i at the stage limit", (moveId, overrides) => {
    const compiled = scenario(moveId, { ...overrides, probabilityMode: "classic" })
    const actual = evaluateExecutionPoint(compiled, compiled.calculation.low)
    const unchanged = evaluateExecutionPoint({ ...compiled, statChange: undefined }, compiled.calculation.low)
    expect(actual.ko).toEqual(unchanged.ko)
  })

  it("preserves immunity and supports other Parental Bond stat changes", () => {
    const immune = scenario(612, { defenderId: 94, probabilityMode: "classic" })
    expect(evaluateExecutionPoint(immune, immune.calculation.low).ko).toEqual({ ohko: 0, twoHit: 0 })
    const parental = scenario(242, { attackerId: 10039, attackerAbilityId: 185 })
    expect(parental.statChange?.probability).toBe(0.2)
    expect(parental.support).toBe("supported")
    const sheerForce = scenario(491, { attackerAbilityId: 125 })
    expect(sheerForce.statChange).toBeUndefined()
  })
})

describe("Parental Bond in the shared stat-change resolver", () => {
  it.each([242, 232, 491, 871])("matches independent per-hit event enumeration for move %i", async (moveId) => {
    const { calculateHitMatrix } = await import("./calc-engine")
    const { resolveHitComposition } = await import("@/lib/damage-distribution/hit-composition")
    const compiled = scenario(moveId, {
      attackerId: 10039, attackerAbilityId: 185, defenderId: 65,
      defenderItemId: moveId === 242 ? 175 : "none",
    })
    const point = compiled.calculation.low
    const change = compiled.statChange!
    const berry = Boolean(compiled.berry)
    const actual = resolveHitComposition(compileHitComposition(compiled, point), 0.8, 0.25)
    const key = (damage: number, count: number, consumed: boolean, critical: boolean) =>
      JSON.stringify([damage, count, consumed, critical])
    const expected = new Map<string, number>([[key(0, 0, false, false), 0.2]])
    const events = [[0, 1 - change.probability], [1, change.probability]] as const
    const criticals = [[false, 0.75], [true, 0.25]] as const
    for (const [crit1, critWeight1] of criticals) {
      const first = calculateHitMatrix(point.calc, 2, crit1, false, berry)
      for (const [event1, eventWeight1] of events) {
        if (!eventWeight1) continue
        const pokemon = point.calc[change.side]
        const context = { ...point.calc, [change.side]: {
          ...pokemon, boosts: { ...pokemon.boosts, [change.stat]: event1 * change.stages },
        } }
        for (const [crit2, critWeight2] of criticals) {
          const second = calculateHitMatrix(context, 2, crit2, first.consumesBerry, berry)
          for (const [event2, eventWeight2] of events) {
            const mass = 0.8 * critWeight1 * critWeight2 * eventWeight1 * eventWeight2 / 256
            if (!mass) continue
            for (const a of first.rolls[0]) for (const b of second.rolls[1]) {
              const id = key(a + b, event1 + event2, first.consumesBerry, crit1 || crit2)
              expected.set(id, (expected.get(id) ?? 0) + mass)
            }
          }
        }
      }
    }
    expect(actual).toHaveLength(expected.size)
    for (const outcome of actual) {
      expect(outcome.probability).toBeCloseTo(expected.get(key(
        outcome.damage, outcome.statChanges, outcome.berryConsumed, outcome.critical,
      ))!, 11)
    }
    expect(actual.reduce((sum, outcome) => sum + outcome.probability, 0)).toBeCloseTo(1, 12)
  })

  it("carries correlated first-use damage and cumulative drops into the second use", async () => {
    const { calculateHitMatrix } = await import("./calc-engine")
    const compiled = scenario(242, {
      attackerId: 10039, attackerAbilityId: 185, defenderId: 65, defenderItemId: 175,
    })
    compiled.probability = { hitProbability: 1, criticalHitProbability: 0 }
    const point = compiled.calculation.low
    const matrices = Array.from({ length: 4 }, (_, count) => calculateHitMatrix({
      ...point.calc, defender: { ...point.calc.defender, boosts: { ...point.calc.defender.boosts, def: -count } },
    }, 2, false, count > 0, true))
    // After the initial hit the Berry is gone, even if no drop triggered.
    const consumedZero = calculateHitMatrix(point.calc, 2, false, true, true)
    const rows = (count: number) => count === 0 ? consumedZero.rolls : matrices[count].rolls
    const hp = 210
    let expected = 0
    for (const e1 of [0, 1]) for (const e2 of [0, 1]) for (const e3 of [0, 1]) {
      const weight = [e1, e2, e3].reduce((mass, event) => mass * (event ? 0.2 : 0.8), 1) / 16 ** 4
      for (const a of matrices[0].rolls[0]) for (const b of rows(e1)[1]) {
        for (const c of rows(e1 + e2)[0]) for (const d of rows(e1 + e2 + e3)[1]) {
          if (a + b + c + d >= hp) expected += weight
        }
      }
    }
    expect(expected).toBeGreaterThan(0)
    expect(expected).toBeLessThan(1)
    expect(evaluateExecutionPoint(compiled, { ...point, defenderHp: hp }).ko.twoHit).toBeCloseTo(expected, 9)
  })

  it("Classic excludes chance-based intra-hit changes but retains guaranteed changes", () => {
    const classic = scenario(242, { attackerId: 10039, attackerAbilityId: 185, probabilityMode: "classic" })
    expect(classic.statChange).toBeUndefined()
    const battle = scenario(242, { attackerId: 10039, attackerAbilityId: 185 })
    expect(evaluateExecutionPoint(battle, battle.calculation.low).normal!.max)
      .toBeGreaterThan(evaluateExecutionPoint(classic, classic.calculation.low).normal!.max)
    const guaranteed = scenario(491, { attackerId: 10039, attackerAbilityId: 185, probabilityMode: "classic" })
    const composition = compileHitComposition(guaranteed, guaranteed.calculation.low)
    expect(composition.statChangeProbability).toBe(1)
    expect(composition.choices[0].hits[1].afterStatChanges).toHaveLength(1)
  })
})
