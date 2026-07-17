import { calculate, Field, Move, Pokemon } from "@smogon/calc"
import { beforeAll, describe, expect, it, vi } from "vitest"

import { getCatalogShell } from "@/lib/catalog"
import { createMoveSnapshot, type MoveSnapshot } from "@/lib/move-snapshot"
import { listResources } from "@/lib/resources"
import {
  defaultTrackState,
  expectedRowCount,
  runScenarioPipeline,
} from "@/lib/scenario-pipeline"

import { ADAPTABILITY_ABILITY_ID } from "./ability"
import { CALC_GEN, VGC_LEVEL } from "./calc-constants"
import * as damageKernel from "./damage-kernel"
import { getAttackerStatSetups, getDefenderSetups } from "./presets"
import {
  compileScenario,
  type CalculableScenario,
  type RawScenario,
} from "./scenario-compiler"

const TACKLE: MoveSnapshot = {
  id: "ability-tackle",
  moveId: 33,
  power: 40,
  accuracy: 100,
  alwaysHits: false,
  criticalStage: 0,
  spreadEligible: false,
  spread: false,
}

function rawScenario(overrides: Partial<RawScenario> = {}): RawScenario {
  return {
    snapshot: TACKLE,
    attackerId: 133,
    defenderId: 143,
    attackerItemId: "none",
    attackerAbilityId: 50,
    defenderAbilityId: 17,
    attackerStage: 0,
    defenderStage: 0,
    weather: "none",
    probabilityMode: "rolls",
    lowOutcome: {
      offense: getAttackerStatSetups("physical")["neutral-max"],
      defense: getDefenderSetups("physical")["standard-bulk"],
    },
    ...overrides,
  }
}

function calculable(overrides: Partial<RawScenario> = {}): CalculableScenario {
  const outcome = compileScenario(rawScenario(overrides))
  if (outcome.kind !== "calculable") {
    throw new Error(`Expected calculable, got ${outcome.reason}`)
  }
  return outcome
}

function normalBranch(outcome: CalculableScenario) {
  const branch = outcome.calculation.low.normal
  if (!branch) throw new Error("Expected normal branch")
  return branch
}

beforeAll(async () => {
  await Promise.all([
    listResources("pokemon", "en"),
    listResources("move", "en"),
    listResources("ability", "en"),
  ])
})

describe("ability compiler", () => {
  it("replaces ordinary STAB with Adaptability's exact modifier", () => {
    const ordinary = calculable()
    const adaptability = calculable({
      attackerAbilityId: ADAPTABILITY_ABILITY_ID,
    })

    expect(normalBranch(ordinary).stabModifier).toBe(6144)
    expect(normalBranch(adaptability).stabModifier).toBe(8192)
    expect(adaptability.sources).toContainEqual({
      track: "attacker-ability",
      optionId: String(ADAPTABILITY_ABILITY_ID),
      state: "effective",
    })
  })

  it("keeps off-type attacker and all defender Adaptability inactive", () => {
    const offType = calculable({
      attackerAbilityId: ADAPTABILITY_ABILITY_ID,
      defenderAbilityId: ADAPTABILITY_ABILITY_ID,
      snapshot: {
        ...TACKLE,
        id: "ability-water-gun",
        moveId: 55,
        power: 40,
      },
      lowOutcome: {
        offense: getAttackerStatSetups("special")["neutral-max"],
        defense: getDefenderSetups("special")["standard-bulk"],
      },
    })

    expect(normalBranch(offType).stabModifier).toBe(4096)
    expect(offType.sources).toEqual(expect.arrayContaining([
      {
        track: "attacker-ability",
        optionId: String(ADAPTABILITY_ABILITY_ID),
        state: "inactive",
      },
      {
        track: "defender-ability",
        optionId: String(ADAPTABILITY_ABILITY_ID),
        state: "inactive",
      },
    ]))
  })

  it("uses the resolved dynamic move type against the original attacker types", () => {
    const outcome = calculable({
      attackerAbilityId: ADAPTABILITY_ABILITY_ID,
      snapshot: {
        ...TACKLE,
        id: "ability-revelation-dance",
        moveId: 686,
        power: 90,
      },
      lowOutcome: {
        offense: getAttackerStatSetups("special")["neutral-max"],
        defense: getDefenderSetups("special")["standard-bulk"],
      },
    })

    expect(outcome.move.type).toBe("normal")
    expect(normalBranch(outcome).stabModifier).toBe(8192)
  })

  it("keeps unsupported abilities calculable with neutral ability input", () => {
    const outcome = calculable({ attackerAbilityId: 50, defenderAbilityId: 17 })

    expect(normalBranch(outcome).stabModifier).toBe(6144)
    expect(outcome.sources).toEqual(expect.arrayContaining([
      { track: "attacker-ability", optionId: "50", state: "unsupported" },
      { track: "defender-ability", optionId: "17", state: "unsupported" },
    ]))
  })

  it("matches @smogon/calc Adaptability normal and critical rolls", () => {
    const offense = getAttackerStatSetups("physical")["neutral-max"]
    const defense = getDefenderSetups("physical")["standard-bulk"]
    const outcome = calculable({
      attackerAbilityId: ADAPTABILITY_ABILITY_ID,
      lowOutcome: { offense, defense },
    })
    const rolls = damageKernel.calculateDamageRolls(outcome.calculation).low
    const attacker = new Pokemon(CALC_GEN, "Eevee", {
      level: VGC_LEVEL,
      ability: "Adaptability",
      nature: offense.nature,
      evs: offense.evs,
    })
    const defender = new Pokemon(CALC_GEN, "Snorlax", {
      level: VGC_LEVEL,
      nature: defense.nature,
      evs: defense.evs,
    })
    const field = new Field()

    expect(rolls.normal).toEqual(
      calculate(CALC_GEN, attacker, defender, new Move(CALC_GEN, "Tackle"), field).damage,
    )
    expect(rolls.critical).toEqual(
      calculate(
        CALC_GEN,
        attacker,
        defender,
        new Move(CALC_GEN, "Tackle", { isCrit: true }),
        field,
      ).damage,
    )
  })
})

describe("ability scenario product and provenance", () => {
  it("splits dynamic-type Adaptability from ordinary STAB through the pipeline and oracle", async () => {
    const catalog = await getCatalogShell(133, 143, "en", "special")
    const revelationDance = catalog.moves.find((move) => move.id === 686)
    if (!revelationDance) throw new Error("Expected Revelation Dance catalog option")
    const state = defaultTrackState(catalog)
    state.moveSnapshots = [createMoveSnapshot(
      revelationDance,
      "pipeline-revelation-dance",
    )]
    state.offenseTemplateIds = ["neutral-max"]
    state.attackerStages = [0]
    state.attackerItemIds = ["none"]
    state.attackerAbilityIds = [50, ADAPTABILITY_ABILITY_ID]
    state.weathers = ["none"]
    state.defenseTemplateIds = ["standard-bulk"]
    state.defenderStages = [0]
    state.defenderAbilityIds = [17]
    const calculateRolls = damageKernel.calculateDamageRolls
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    const result = runScenarioPipeline(catalog, state)

    expect(expectedRowCount(state)).toBe(2)
    expect(result.rows).toHaveLength(2)
    expect(kernel).toHaveBeenCalledTimes(2)
    expect(result.rows.some((row) =>
      row.provenance["attacker-ability"]?.effective.includes("91"),
    )).toBe(true)
    expect(result.rows.some((row) =>
      row.provenance["attacker-ability"]?.unsupported.includes("50"),
    )).toBe(true)

    const adaptabilityInput = kernel.mock.calls.find(
      ([input]) => input.low.normal?.stabModifier === 8192,
    )?.[0]
    if (!adaptabilityInput) throw new Error("Expected Adaptability kernel input")
    const rolls = calculateRolls(adaptabilityInput).low
    const offense = getAttackerStatSetups("special")["neutral-max"]
    const defense = getDefenderSetups("special")["standard-bulk"]
    const attacker = new Pokemon(CALC_GEN, "Eevee", {
      level: VGC_LEVEL,
      ability: "Adaptability",
      nature: offense.nature,
      evs: offense.evs,
    })
    const defender = new Pokemon(CALC_GEN, "Snorlax", {
      level: VGC_LEVEL,
      nature: defense.nature,
      evs: defense.evs,
    })
    const field = new Field()

    expect(rolls.normal).toEqual(
      calculate(
        CALC_GEN,
        attacker,
        defender,
        new Move(CALC_GEN, "Revelation Dance"),
        field,
      ).damage,
    )
    expect(rolls.critical).toEqual(
      calculate(
        CALC_GEN,
        attacker,
        defender,
        new Move(CALC_GEN, "Revelation Dance", { isCrit: true }),
        field,
      ).damage,
    )
    kernel.mockRestore()
  })

  it("merges neutral ability inputs while preserving both tracks and states", async () => {
    const catalog = await getCatalogShell(133, 133, "en", "special")
    const waterGun = catalog.moves.find((move) => move.id === 55)
    if (!waterGun) throw new Error("Expected Water Gun catalog option")
    const state = defaultTrackState(catalog)
    state.moveSnapshots = [createMoveSnapshot(waterGun, "pipeline-water-gun")]
    state.offenseTemplateIds = ["neutral-max"]
    state.attackerStages = [0]
    state.attackerItemIds = ["none"]
    state.attackerAbilityIds = [50, ADAPTABILITY_ABILITY_ID]
    state.weathers = ["none"]
    state.defenseTemplateIds = ["standard-bulk"]
    state.defenderStages = [0]
    state.defenderAbilityIds = [50, ADAPTABILITY_ABILITY_ID]
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    const result = runScenarioPipeline(catalog, state)

    expect(expectedRowCount(state)).toBe(4)
    expect(result.rows).toHaveLength(1)
    expect(result.unavailable).toEqual([])
    expect(kernel).toHaveBeenCalledTimes(1)
    expect(result.rows[0].provenance["attacker-ability"]).toEqual({
      effective: [],
      inactive: [String(ADAPTABILITY_ABILITY_ID)],
      unsupported: ["50"],
      neutral: [],
    })
    expect(result.rows[0].provenance["defender-ability"]).toEqual({
      effective: [],
      inactive: [String(ADAPTABILITY_ABILITY_ID)],
      unsupported: ["50"],
      neutral: [],
    })
    kernel.mockRestore()
  })
})
