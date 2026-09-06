import { beforeAll, describe, expect, it } from "vitest"

import { getCatalogShell } from "@/lib/catalog"
import { defaultTrackState, runScenarioPipeline } from "@/lib/scenario"
import { createMoveSnapshot, editMoveSnapshot, moveHitProfile } from "@/lib/move"
import { getMoveById, listResources } from "@/lib/resources"
import { compileScenario, type RawScenario } from "./scenario-compiler"
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
