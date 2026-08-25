import { calculate, Field, Move, Pokemon } from "@smogon/calc"
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest"

import { getCatalogShell } from "@/lib/catalog"
import { createMoveSnapshot } from "@/lib/move"
import { listResources } from "@/lib/resources"
import {
  defaultTrackState,
  expectedRowCount,
  RANGE_DEFENDER_ID,
  RANGE_STAT_ID,
  runScenarioPipeline,
} from "@/lib/scenario"

import { ADAPTABILITY_ABILITY_ID, FIRE_MANE_ABILITY_ID } from "@/lib/ability"
import { CALC_GEN, VGC_LEVEL } from "@/lib/damage-calculation"
import * as damageKernel from "@/lib/damage-calculation"
import { getAttackerStatSetups, getDefenderSetups } from "@/lib/stat-calculation"

const ATTACKER_ID = 342
const DEFENDER_ID = 143
const F0_DEFENDER_ID = 727
const MOVE_ID = 152

beforeAll(async () => {
  await Promise.all([
    listResources("pokemon", "en"),
    listResources("move", "en"),
    listResources("ability", "en"),
  ])
})

afterEach(() => {
  vi.restoreAllMocks()
})

async function exactHeldItemFixture({
  attackerId,
  defenderId,
  category,
  moveId,
  snapshotId,
  power,
  accuracy,
  criticalStage,
  offense,
  hp,
  defense,
  attackerAbilityId,
  defenderAbilityId,
}: {
  attackerId: number
  defenderId: number
  category: "physical" | "special"
  moveId: number
  snapshotId: string
  power: number
  accuracy: number
  criticalStage: 0 | 1 | 2 | 3
  offense: number
  hp: number
  defense: number
  attackerAbilityId: number
  defenderAbilityId: number
}) {
  const catalog = await getCatalogShell(attackerId, defenderId, "en", category)
  const move = catalog.moves.find((candidate) => candidate.id === moveId)
  if (!move) throw new Error(`Expected move ${moveId} in the ${category} move catalog`)
  const state = defaultTrackState(catalog)
  state.statMode = "preset"
  state.defenderMode = "preset"
  state.moveSnapshots = [{
    ...createMoveSnapshot(move, snapshotId),
    power,
    accuracy,
    criticalStage,
    spread: false,
  }]
  state.selectedMoveSnapshotIds = [snapshotId]
  state.offensePresetIds = [`${snapshotId}-offense`]
  state.offenseTemporaryPresets = [{
    id: `${snapshotId}-offense`,
    kind: "temporary",
    values: { kind: "offense", stat: offense },
  }]
  state.defensePresetIds = [`${snapshotId}-defense`]
  state.defenseTemporaryPresets = [{
    id: `${snapshotId}-defense`,
    kind: "temporary",
    values: { kind: "defense", hp, def: defense },
  }]
  state.attackerStages = [0]
  state.defenderStages = [0]
  state.attackerAbilityIds = [attackerAbilityId]
  state.defenderAbilityIds = [defenderAbilityId]
  state.attackerItemIds = ["none"]
  state.defenderItemIds = ["none"]
  state.weathers = ["none"]
  state.terrains = ["none"]
  state.screens = ["none"]
  return { catalog, state }
}

async function f0HeldItemFixture() {
  return exactHeldItemFixture({
    attackerId: ATTACKER_ID,
    defenderId: F0_DEFENDER_ID,
    category: "physical",
    moveId: MOVE_ID,
    snapshotId: "f0-crabhammer",
    power: 100,
    accuracy: 90,
    criticalStage: 0,
    offense: 172,
    hp: 202,
    defense: 156,
    attackerAbilityId: 52,
    defenderAbilityId: 22,
  })
}

describe("cross-mechanism acceptance", () => {
  it("matches F0 and merges effect-equivalent Held-item products with ordered provenance", async () => {
    const { catalog, state } = await f0HeldItemFixture()
    state.attackerItemIds = ["none", 226, 220, 276]
    state.defenderItemIds = ["none", 1181]

    const result = runScenarioPipeline(catalog, state)

    expect(expectedRowCount(state)).toBe(8)
    expect(result.unavailable).toEqual([])
    expect(result.rows).toHaveLength(2)
    expect(result.rows[0]).toMatchObject({
      minDamage: 126,
      maxDamage: 150,
      critMinDamage: 188,
      critMaxDamage: 224,
      provenance: {
        "held-item": {
          active: [],
          inactive: ["226"],
          unsupported: [],
          neutral: ["none"],
        },
        "defender-held-item": {
          active: [],
          inactive: ["1181"],
          unsupported: [],
          neutral: ["none"],
        },
      },
    })
    expect(result.rows[0].koProbabilities?.ohko).toBeCloseTo(0.0234375)
    expect(result.rows[0].koProbabilities?.twoHit).toBeCloseTo(0.8146875)
    expect(result.rows[1]).toMatchObject({
      minDamage: 152,
      maxDamage: 180,
      critMinDamage: 228,
      critMaxDamage: 270,
      moveMechanics: {
        normal: {
          phases: expect.arrayContaining([{ kind: "base-power", modifier: 4915 }]),
        },
      },
      provenance: {
        "held-item": {
          active: ["220", "276"],
          inactive: [],
          unsupported: [],
          neutral: [],
        },
      },
    })
    expect(result.rows[1].koProbabilities?.ohko).toBeCloseTo(0.0375)
    expect(result.rows[1].koProbabilities?.twoHit).toBeCloseTo(0.8175)
  })

  it("chains Life Orb and Passho Berry once and reuses the result for two hits", async () => {
    const { catalog, state } = await f0HeldItemFixture()
    state.attackerItemIds = [247]
    state.defenderItemIds = [162]
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    const result = runScenarioPipeline(catalog, state)

    expect(kernel.mock.calls[0][0].low.normal?.finalModifier).toBe(2662)
    expect(kernel.mock.results[0].value.low).toMatchObject({
      normal: [82, 83, 83, 86, 86, 87, 87, 90, 90, 91, 91, 94, 94, 95, 95, 97],
      critical: [122, 125, 126, 129, 129, 130, 133, 134, 134, 136, 138, 140, 140, 142, 144, 146],
    })
    expect(result.rows[0]).toMatchObject({
      provenance: {
        "held-item": { active: ["247"] },
        "defender-held-item": { active: ["162"] },
      },
    })
    expect(result.rows[0].koProbabilities?.ohko).toBe(0)
    expect(result.rows[0].koProbabilities?.twoHit).toBeCloseTo(0.06609375)
    expect(result.rows[0]).not.toHaveProperty("warning")
  })

  it("matches F1 when Leek guarantees a Critical and suppresses Reflect", async () => {
    const { catalog, state } = await exactHeldItemFixture({
      attackerId: 865,
      defenderId: DEFENDER_ID,
      category: "physical",
      moveId: 370,
      snapshotId: "f1-close-combat",
      power: 120,
      accuracy: 100,
      criticalStage: 1,
      offense: 187,
      hp: 267,
      defense: 128,
      attackerAbilityId: 80,
      defenderAbilityId: 17,
    })
    state.attackerItemIds = [236]
    state.screens = ["walls"]
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    const result = runScenarioPipeline(catalog, state, "classic")

    expect(result.unavailable).toEqual([])
    expect(result.rows).toHaveLength(1)
    expect(kernel.mock.results[0].value.low).not.toHaveProperty("normal")
    expect(kernel.mock.results[0].value.low.critical).toEqual([
      300, 302, 306, 308, 314, 318, 320, 324,
      326, 330, 336, 338, 342, 344, 348, 354,
    ])
    expect(result.rows[0]).toMatchObject({
      criticalOnly: true,
      minDamage: 300,
      maxDamage: 354,
      critMinDamage: 300,
      critMaxDamage: 354,
      moveMechanics: {
        normal: null,
        critical: {
          phases: expect.arrayContaining([
            { kind: "critical", modifier: 6144 },
            { kind: "final", modifier: 4096 },
          ]),
        },
      },
      provenance: {
        "held-item": { active: ["236"] },
        screen: { inactive: ["reflect"] },
      },
    })
    expect(result.rows[0].koProbabilities?.ohko).toBe(1)
    expect(result.rows[0].koProbabilities?.twoHit).toBe(1)
  })

  it("matches the F3 Deep Sea Scale and F4 Eviolite defense modifiers", async () => {
    const deepSeaScale = await exactHeldItemFixture({
      attackerId: 484,
      defenderId: 366,
      category: "special",
      moveId: 87,
      snapshotId: "f3-thunder",
      power: 100,
      accuracy: 90,
      criticalStage: 0,
      offense: 172,
      hp: 142,
      defense: 117,
      attackerAbilityId: 46,
      defenderAbilityId: 155,
    })
    deepSeaScale.state.defenderItemIds = [204]
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    const scaleResult = runScenarioPipeline(deepSeaScale.catalog, deepSeaScale.state)

    expect(kernel.mock.calls[0][0].low.normal?.defenseModifier).toBe(8192)
    expect(kernel.mock.results[0].value.low).toMatchObject({
      normal: [56, 58, 58, 58, 60, 60, 60, 62, 62, 62, 64, 64, 64, 66, 66, 68],
      critical: [86, 86, 88, 88, 90, 90, 92, 92, 94, 94, 96, 96, 98, 98, 100, 102],
    })
    expect(scaleResult.rows[0]).toMatchObject({
      minDamage: 56,
      maxDamage: 68,
      critMinDamage: 86,
      critMaxDamage: 102,
      provenance: { "defender-held-item": { active: ["204"] } },
    })
    expect(scaleResult.rows[0].koProbabilities?.ohko).toBe(0)
    expect(scaleResult.rows[0].koProbabilities?.twoHit).toBeCloseTo(0.06609375)

    const eviolite = await exactHeldItemFixture({
      attackerId: ATTACKER_ID,
      defenderId: 112,
      category: "physical",
      moveId: MOVE_ID,
      snapshotId: "f4-crabhammer",
      power: 100,
      accuracy: 90,
      criticalStage: 0,
      offense: 172,
      hp: 212,
      defense: 189,
      attackerAbilityId: 52,
      defenderAbilityId: 69,
    })
    eviolite.state.defenderItemIds = [581]
    kernel.mockClear()

    const evioliteResult = runScenarioPipeline(eviolite.catalog, eviolite.state)

    expect(kernel.mock.calls[0][0].low.normal?.defenseModifier).toBe(6144)
    expect(kernel.mock.results[0].value.low).toMatchObject({
      normal: [136, 144, 144, 144, 144, 148, 148, 148, 156, 156, 156, 156, 160, 160, 160, 168],
      critical: [208, 216, 216, 216, 220, 220, 228, 228, 232, 232, 232, 240, 240, 244, 244, 252],
    })
    expect(evioliteResult.rows[0]).toMatchObject({
      minDamage: 136,
      maxDamage: 168,
      critMinDamage: 208,
      critMaxDamage: 252,
      provenance: { "defender-held-item": { active: ["581"] } },
    })
    expect(evioliteResult.rows[0].koProbabilities?.ohko).toBeCloseTo(0.03515625)
    expect(evioliteResult.rows[0].koProbabilities?.twoHit).toBeCloseTo(0.81703125)
  })

  it("gates Expert Belt on resolved super effectiveness", async () => {
    const positive = await f0HeldItemFixture()
    positive.state.attackerItemIds = [245]
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    const positiveResult = runScenarioPipeline(positive.catalog, positive.state)

    expect(kernel.mock.calls[0][0].low.normal?.finalModifier).toBe(4915)
    expect(kernel.mock.results[0].value.low).toMatchObject({
      normal: [151, 154, 154, 158, 158, 161, 161, 166, 166, 168, 168, 173, 173, 175, 175, 180],
      critical: [226, 230, 233, 238, 238, 240, 245, 247, 247, 252, 254, 259, 259, 262, 266, 269],
    })
    expect(positiveResult.rows[0]).toMatchObject({
      minDamage: 151,
      maxDamage: 180,
      critMinDamage: 226,
      critMaxDamage: 269,
      moveMechanics: {
        normal: {
          phases: expect.arrayContaining([{ kind: "type-effectiveness", modifier: 8192 }]),
        },
      },
      provenance: { "held-item": { active: ["245"] } },
    })
    expect(positiveResult.rows[0].koProbabilities?.ohko).toBeCloseTo(0.0375)
    expect(positiveResult.rows[0].koProbabilities?.twoHit).toBeCloseTo(0.8175)

    const negative = await exactHeldItemFixture({
      attackerId: ATTACKER_ID,
      defenderId: 823,
      category: "physical",
      moveId: MOVE_ID,
      snapshotId: "expert-belt-neutral",
      power: 100,
      accuracy: 90,
      criticalStage: 0,
      offense: 172,
      hp: 202,
      defense: 156,
      attackerAbilityId: 52,
      defenderAbilityId: 46,
    })
    negative.state.attackerItemIds = [245]
    kernel.mockClear()

    const negativeResult = runScenarioPipeline(negative.catalog, negative.state)

    expect(kernel.mock.calls[0][0].low.normal?.finalModifier).toBe(4096)
    expect(kernel.mock.results[0].value.low).toMatchObject({
      normal: [63, 64, 64, 66, 66, 67, 67, 69, 69, 70, 70, 72, 72, 73, 73, 75],
      critical: [94, 96, 97, 99, 99, 100, 102, 103, 103, 105, 106, 108, 108, 109, 111, 112],
    })
    expect(negativeResult.rows[0]).toMatchObject({
      minDamage: 63,
      maxDamage: 75,
      critMinDamage: 94,
      critMaxDamage: 112,
      moveMechanics: {
        normal: {
          phases: expect.arrayContaining([{ kind: "type-effectiveness", modifier: 4096 }]),
        },
      },
      provenance: { "held-item": { inactive: ["245"] } },
    })
    expect(negativeResult.rows[0].koProbabilities?.ohko).toBe(0)
    expect(negativeResult.rows[0].koProbabilities?.twoHit).toBeCloseTo(0.0010546875)
  })

  it("classifies Scope Lens by probability mode and snapshot Critical stage", async () => {
    const { catalog, state } = await f0HeldItemFixture()
    state.attackerItemIds = [209]
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    const battleOddsResult = runScenarioPipeline(catalog, state)

    expect(kernel.mock.results[0].value.low).toMatchObject({
      normal: [126, 128, 128, 132, 132, 134, 134, 138, 138, 140, 140, 144, 144, 146, 146, 150],
      critical: [188, 192, 194, 198, 198, 200, 204, 206, 206, 210, 212, 216, 216, 218, 222, 224],
    })
    expect(battleOddsResult.rows[0].provenance).toMatchObject({
      "held-item": { active: ["209"] },
    })
    expect(battleOddsResult.rows[0].koProbabilities?.ohko).toBeCloseTo(0.0703125)
    expect(battleOddsResult.rows[0].koProbabilities?.twoHit).toBeCloseTo(0.8240625)

    kernel.mockClear()
    const classicResult = runScenarioPipeline(catalog, state, "classic")

    expect(classicResult.rows[0]).toMatchObject({
      criticalOnly: false,
      provenance: { "held-item": { inactive: ["209"] } },
    })
    expect(classicResult.rows[0].koProbabilities?.ohko).toBe(0)
    expect(classicResult.rows[0].koProbabilities?.twoHit).toBe(1)

    state.moveSnapshots = state.moveSnapshots.map((snapshot) => ({
      ...snapshot,
      criticalStage: 2,
    }))
    kernel.mockClear()
    const guaranteedClassic = runScenarioPipeline(catalog, state, "classic")

    expect(kernel.mock.results[0].value.low).not.toHaveProperty("normal")
    expect(kernel.mock.results[0].value.low.critical).toEqual([
      188, 192, 194, 198, 198, 200, 204, 206,
      206, 210, 212, 216, 216, 218, 222, 224,
    ])
    expect(guaranteedClassic.rows[0]).toMatchObject({
      criticalOnly: true,
      minDamage: 188,
      maxDamage: 224,
      provenance: { "held-item": { active: ["209"] } },
    })
    expect(guaranteedClassic.rows[0].koProbabilities?.ohko).toBeCloseTo(0.625)
    expect(guaranteedClassic.rows[0].koProbabilities?.twoHit).toBe(1)

    const guaranteedBattleOdds = runScenarioPipeline(catalog, state, "battle-odds")
    expect(guaranteedBattleOdds.rows[0]).toMatchObject({
      criticalOnly: true,
      provenance: { "held-item": { active: ["209"] } },
    })
  })

  it("lets defender Utility Umbrella suppress ordinary rain Water damage", async () => {
    const { catalog, state } = await f0HeldItemFixture()
    state.weathers = ["rain"]
    state.defenderItemIds = ["none", 1181]
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    const result = runScenarioPipeline(catalog, state)

    expect(result.unavailable).toEqual([])
    expect(result.rows).toHaveLength(2)
    expect(kernel.mock.calls[0][0].low.normal?.weatherModifier).toBe(6144)
    expect(kernel.mock.results[0].value.low).toMatchObject({
      normal: [188, 192, 194, 198, 198, 200, 204, 206, 206, 210, 212, 216, 216, 218, 222, 224],
      critical: [284, 288, 290, 294, 296, 300, 302, 308, 312, 314, 318, 320, 324, 326, 330, 336],
    })
    expect(kernel.mock.calls[1][0].low.normal?.weatherModifier).toBe(4096)
    expect(kernel.mock.results[1].value.low).toMatchObject({
      normal: [126, 128, 128, 132, 132, 134, 134, 138, 138, 140, 140, 144, 144, 146, 146, 150],
      critical: [188, 192, 194, 198, 198, 200, 204, 206, 206, 210, 212, 216, 216, 218, 222, 224],
    })
    expect(result.rows[0]).toMatchObject({
      minDamage: 188,
      maxDamage: 224,
      critMinDamage: 284,
      critMaxDamage: 336,
      moveMechanics: {
        normal: {
          phases: expect.arrayContaining([
            { kind: "weather-damage", modifier: 6144 },
            { kind: "type-effectiveness", modifier: 8192 },
          ]),
        },
      },
      provenance: { "defender-held-item": { neutral: ["none"] } },
    })
    expect(result.rows[1]).toMatchObject({
      minDamage: 126,
      maxDamage: 150,
      critMinDamage: 188,
      critMaxDamage: 224,
      moveMechanics: {
        normal: {
          phases: expect.arrayContaining([
            { kind: "weather-damage", modifier: 4096 },
            { kind: "type-effectiveness", modifier: 8192 },
          ]),
        },
      },
      provenance: { "defender-held-item": { active: ["1181"] } },
    })
    expect(result.rows[1].koProbabilities?.ohko).toBeCloseTo(0.0234375)
    expect(result.rows[1].koProbabilities?.twoHit).toBeCloseTo(0.8146875)
  })

  it("compiles every Track through the fixed phase order for preset and Range stats", async () => {
    const catalog = await getCatalogShell(ATTACKER_ID, DEFENDER_ID, "en", "physical")
    const crabhammer = catalog.moves.find((move) => move.id === MOVE_ID)
    if (!crabhammer) throw new Error("Expected Crabhammer in the physical move catalog")
    const state = defaultTrackState(catalog)
    state.statMode = "preset"
    state.defenderMode = "preset"
    state.moveSnapshots = [{
      ...createMoveSnapshot(crabhammer, "cross-mechanism-crabhammer"),
      criticalStage: 0,
      spread: false,
    }]
    state.selectedMoveSnapshotIds = state.moveSnapshots.map((snapshot) => snapshot.id)
    state.offensePresetIds = ["neutral-max"]
    state.attackerStages = [1]
    state.attackerItemIds = [197]
    state.attackerAbilityIds = [ADAPTABILITY_ABILITY_ID]
    state.weathers = ["rain"]
    state.defensePresetIds = ["standard-bulk"]
    state.defenderStages = [1]
    state.defenderAbilityIds = [FIRE_MANE_ABILITY_ID]
    state.screens = ["walls"]
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    const presetResult = runScenarioPipeline(catalog, state, "classic")

    expect(expectedRowCount(state)).toBe(1)
    expect(presetResult.unavailable).toEqual([])
    expect(presetResult.rows).toHaveLength(1)
    expect(kernel).toHaveBeenCalledTimes(1)
    const input = kernel.mock.calls[0][0]
    expect(input.high).toBeUndefined()
    expect(input.low.normal).toMatchObject({
      power: 100,
      basePowerModifier: 4096,
      attackStage: 1,
      attackModifier: 6144,
      defenseStage: 1,
      spreadModifier: 4096,
      weatherModifier: 6144,
      criticalModifier: 4096,
      stabModifier: 8192,
      typeEffectivenessModifier: 4096,
      finalModifier: 2732,
    })
    expect(input.low.critical).toMatchObject({
      attackStage: 1,
      attackModifier: 6144,
      defenseStage: 0,
      weatherModifier: 6144,
      criticalModifier: 6144,
      stabModifier: 8192,
      finalModifier: 4096,
    })
    expect(presetResult.rows[0].provenance).toMatchObject({
      "attacker-stage": { active: ["1"] },
      "held-item": { active: ["197"] },
      "attacker-ability": { active: ["91"] },
      weather: { active: ["rain"] },
      "defender-stage": { active: ["1"] },
      "defender-ability": { unsupported: [String(FIRE_MANE_ABILITY_ID)] },
      screen: { active: ["reflect"] },
    })

    const offense = getAttackerStatSetups("physical")["neutral-max"]
    const defense = getDefenderSetups("physical")["standard-bulk"]
    const attacker = new Pokemon(CALC_GEN, "Crawdaunt", {
      level: VGC_LEVEL,
      ability: "Adaptability",
      item: "Choice Band",
      nature: offense.nature,
      evs: offense.evs,
      boosts: { atk: 1 },
    })
    const defender = new Pokemon(CALC_GEN, "Snorlax", {
      level: VGC_LEVEL,
      nature: defense.nature,
      evs: defense.evs,
      boosts: { def: 1 },
    })
    const field = new Field({
      gameType: "Doubles",
      weather: "Rain",
      defenderSide: { isReflect: true },
    })
    const rolls = damageKernel.calculateDamageRolls(input).low
    expect(rolls.normal).toEqual(
      calculate(CALC_GEN, attacker, defender, new Move(CALC_GEN, "Crabhammer"), field).damage,
    )
    expect(rolls.critical).toEqual(
      calculate(
        CALC_GEN,
        attacker,
        defender,
        new Move(CALC_GEN, "Crabhammer", { isCrit: true }),
        field,
      ).damage,
    )

    kernel.mockClear()
    state.statMode = "range"
    state.defenderMode = "range"
    const rangeResult = runScenarioPipeline(catalog, state)

    expect(expectedRowCount(state)).toBe(1)
    expect(rangeResult.rows).toHaveLength(1)
    expect(rangeResult.rows[0]).toMatchObject({
      attackerStatId: RANGE_STAT_ID,
      defenderId: RANGE_DEFENDER_ID,
    })
    expect(kernel).toHaveBeenCalledTimes(1)
    const rangeInput = kernel.mock.calls[0][0]
    expect(rangeInput.high).toBeDefined()
    expect(rangeInput.low.normal?.attack).toBeLessThanOrEqual(
      rangeInput.high?.normal?.attack ?? 0,
    )
    expect(rangeInput.low.defenderHp).toBeGreaterThanOrEqual(
      rangeInput.high?.defenderHp ?? Number.POSITIVE_INFINITY,
    )
  })

  it("merges one critical-only product after suppressed stages and screens", async () => {
    const catalog = await getCatalogShell(ATTACKER_ID, DEFENDER_ID, "en", "physical")
    const crabhammer = catalog.moves.find((move) => move.id === MOVE_ID)
    if (!crabhammer) throw new Error("Expected Crabhammer in the physical move catalog")
    const state = defaultTrackState(catalog)
    state.statMode = "preset"
    state.defenderMode = "preset"
    state.moveSnapshots = [{
      ...createMoveSnapshot(crabhammer, "cross-mechanism-critical-only"),
      criticalStage: 3,
      spread: false,
    }]
    state.selectedMoveSnapshotIds = state.moveSnapshots.map((snapshot) => snapshot.id)
    state.offensePresetIds = ["neutral-max"]
    state.attackerStages = [-1, 0]
    state.attackerItemIds = ["none", 226]
    state.attackerAbilityIds = [FIRE_MANE_ABILITY_ID, 75]
    state.weathers = ["none", "sand"]
    state.defensePresetIds = ["standard-bulk"]
    state.defenderStages = [0, 1]
    state.defenderAbilityIds = [FIRE_MANE_ABILITY_ID, 47]
    state.screens = ["none", "walls"]
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    const result = runScenarioPipeline(catalog, state)

    expect(expectedRowCount(state)).toBe(128)
    expect(result.unavailable).toEqual([])
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].criticalOnly).toBe(true)
    expect(kernel).toHaveBeenCalledTimes(1)
    expect(result.rows[0].provenance).toMatchObject({
      "attacker-stage": { inactive: ["-1"], neutral: ["0"] },
      "held-item": { inactive: ["226"], neutral: ["none"] },
      "attacker-ability": {
        inactive: ["75"],
        unsupported: [String(FIRE_MANE_ABILITY_ID)],
      },
      weather: { inactive: ["sand"], neutral: ["none"] },
      "defender-stage": { inactive: ["1"], neutral: ["0"] },
      "defender-ability": {
        inactive: ["47"],
        unsupported: [String(FIRE_MANE_ABILITY_ID)],
      },
      screen: {
        inactive: ["reflect"],
        neutral: ["none"],
      },
    })
  })
})
