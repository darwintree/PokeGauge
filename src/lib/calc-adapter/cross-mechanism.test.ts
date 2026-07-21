import { calculate, Field, Move, Pokemon } from "@smogon/calc"
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest"

import { getCatalogShell } from "@/lib/catalog"
import { createMoveSnapshot } from "@/lib/move-snapshot"
import { listResources } from "@/lib/resources"
import {
  defaultTrackState,
  expectedRowCount,
  RANGE_DEFENDER_ID,
  RANGE_STAT_ID,
  runScenarioPipeline,
} from "@/lib/scenario-pipeline"

import { ADAPTABILITY_ABILITY_ID } from "./ability"
import { CALC_GEN, VGC_LEVEL } from "./calc-constants"
import * as damageKernel from "./damage-kernel"
import { getAttackerStatSetups, getDefenderSetups } from "./presets"

const ATTACKER_ID = 342
const DEFENDER_ID = 143
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

describe("cross-mechanism acceptance", () => {
  it("compiles every Track through the fixed phase order for preset and Range stats", async () => {
    const catalog = await getCatalogShell(ATTACKER_ID, DEFENDER_ID, "en", "physical")
    const crabhammer = catalog.moves.find((move) => move.id === MOVE_ID)
    if (!crabhammer) throw new Error("Expected Crabhammer in the physical move catalog")
    const state = defaultTrackState(catalog)
    state.moveSnapshots = [{
      ...createMoveSnapshot(crabhammer, "cross-mechanism-crabhammer"),
      criticalStage: 0,
      spread: false,
    }]
    state.selectedMoveSnapshotIds = state.moveSnapshots.map((snapshot) => snapshot.id)
    state.offenseTemplateIds = ["neutral-max"]
    state.attackerStages = [1]
    state.attackerItemIds = ["choice-band"]
    state.attackerAbilityIds = [ADAPTABILITY_ABILITY_ID]
    state.weathers = ["rain"]
    state.defenseTemplateIds = ["standard-bulk"]
    state.defenderStages = [1]
    state.defenderAbilityIds = [17]
    state.screens = ["reflect"]
    state.probabilityMode = "rolls"
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    const presetResult = runScenarioPipeline(catalog, state)

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
      "attacker-stage": { effective: ["1"] },
      "held-item": { effective: ["choice-band"] },
      "attacker-ability": { effective: ["91"] },
      weather: { effective: ["rain"] },
      "defender-stage": { effective: ["1"] },
      "defender-ability": { unsupported: ["17"] },
      screen: { effective: ["reflect"] },
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
    state.moveSnapshots = [{
      ...createMoveSnapshot(crabhammer, "cross-mechanism-critical-only"),
      criticalStage: 3,
      spread: false,
    }]
    state.selectedMoveSnapshotIds = state.moveSnapshots.map((snapshot) => snapshot.id)
    state.offenseTemplateIds = ["neutral-max"]
    state.attackerStages = [-1, 0]
    state.attackerItemIds = ["none", "type-boost-fire"]
    state.attackerAbilityIds = [52, 75]
    state.weathers = ["none", "sand"]
    state.defenseTemplateIds = ["standard-bulk"]
    state.defenderStages = [0, 1]
    state.defenderAbilityIds = [17, 47]
    state.screens = ["none", "reflect", "light-screen"]
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    const result = runScenarioPipeline(catalog, state)

    expect(expectedRowCount(state)).toBe(192)
    expect(result.unavailable).toEqual([])
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].criticalOnly).toBe(true)
    expect(kernel).toHaveBeenCalledTimes(1)
    expect(result.rows[0].provenance).toMatchObject({
      "attacker-stage": { inactive: ["-1"], neutral: ["0"] },
      "held-item": { inactive: ["type-boost-fire"], neutral: ["none"] },
      "attacker-ability": { unsupported: ["52", "75"] },
      weather: { inactive: ["sand"], neutral: ["none"] },
      "defender-stage": { inactive: ["1"], neutral: ["0"] },
      "defender-ability": { unsupported: ["17", "47"] },
      screen: {
        inactive: ["reflect", "light-screen"],
        neutral: ["none"],
      },
    })
  })
})
