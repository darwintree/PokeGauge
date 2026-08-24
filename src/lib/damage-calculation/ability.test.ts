import { calculate, Field, Move, Pokemon } from "@smogon/calc"
import { beforeAll, describe, expect, it, vi } from "vitest"

import { getCatalogShell, type MoveCategory } from "@/lib/catalog"
import { createMoveSnapshot, type MoveSnapshot } from "@/lib/move"
import { listResources } from "@/lib/resources"
import {
  defaultTrackState,
  expectedRowCount,
  projectAbilitySelections,
  runScenarioPipeline,
} from "@/lib/scenario"

import {
  ADAPTABILITY_ABILITY_ID,
  DEFIANT_ABILITY_ID,
  DROUGHT_ABILITY_ID,
  FIRE_MANE_ABILITY_ID,
  INTIMIDATE_ABILITY_ID,
  NO_ABILITY_ID,
} from "@/lib/ability"
import { CALC_GEN, VGC_LEVEL } from "@/lib/damage-calculation"
import * as damageKernel from "@/lib/damage-calculation"
import { defenderStatValues, offenseStatValue } from "@/lib/stat-calculation"
import { getAttackerStatSetups, getDefenderSetups } from "@/lib/stat-calculation"
import {
  compileScenario,
  type CalculableScenario,
  type RawScenario,
} from "@/lib/damage-calculation"

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

function exactPoint(category: MoveCategory): RawScenario["lowOutcome"] {
  return {
    offense: offenseStatValue(
      "Eevee",
      category,
      getAttackerStatSetups(category)["neutral-max"],
    ),
    defense: defenderStatValues(
      "Snorlax",
      category,
      getDefenderSetups(category)["standard-bulk"],
    ),
  }
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
    terrain: "none",
    screen: "none",
    probabilityMode: "classic",
    lowOutcome: exactPoint("physical"),
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
      state: "active",
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
      lowOutcome: exactPoint("special"),
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
      lowOutcome: exactPoint("special"),
    })

    expect(outcome.move.type).toBe("normal")
    expect(normalBranch(outcome).stabModifier).toBe(8192)
  })

  it("keeps unsupported abilities calculable with neutral ability input", () => {
    const outcome = calculable({
      attackerAbilityId: FIRE_MANE_ABILITY_ID,
      defenderAbilityId: FIRE_MANE_ABILITY_ID,
    })

    expect(normalBranch(outcome).stabModifier).toBe(6144)
    expect(outcome.sources).toEqual(expect.arrayContaining([
      { track: "attacker-ability", optionId: String(FIRE_MANE_ABILITY_ID), state: "unsupported" },
      { track: "defender-ability", optionId: String(FIRE_MANE_ABILITY_ID), state: "unsupported" },
    ]))
  })

  it("compiles no ability as a neutral source without changing damage inputs", () => {
    const ordinary = calculable()
    const none = calculable({
      attackerAbilityId: NO_ABILITY_ID,
      defenderAbilityId: NO_ABILITY_ID,
    })

    expect(damageKernel.calculateDamageRolls(none.calculation)).toEqual(
      damageKernel.calculateDamageRolls(ordinary.calculation),
    )
    expect(none.sources).toEqual(expect.arrayContaining([
      { track: "attacker-ability", optionId: String(NO_ABILITY_ID), state: "neutral" },
      { track: "defender-ability", optionId: String(NO_ABILITY_ID), state: "neutral" },
    ]))
  })

  it("compiles projection abilities as neutral on either side", () => {
    for (const abilityId of [DROUGHT_ABILITY_ID, INTIMIDATE_ABILITY_ID, DEFIANT_ABILITY_ID]) {
      const outcome = calculable({
        attackerAbilityId: abilityId,
        defenderAbilityId: abilityId,
      })
      expect(outcome.sources).toEqual(expect.arrayContaining([
        { track: "attacker-ability", optionId: String(abilityId), state: "neutral" },
        { track: "defender-ability", optionId: String(abilityId), state: "neutral" },
      ]))
    }
  })

  it("matches @smogon/calc Adaptability normal and critical rolls", () => {
    const offense = getAttackerStatSetups("physical")["neutral-max"]
    const defense = getDefenderSetups("physical")["standard-bulk"]
    const outcome = calculable({
      attackerAbilityId: ADAPTABILITY_ABILITY_ID,
      lowOutcome: exactPoint("physical"),
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
  it("keeps Defiant Stage choices independent in the row product", async () => {
    const catalog = await getCatalogShell(133, 143, "en", "physical")
    const tackle = catalog.moves.find((move) => move.id === TACKLE.moveId)
    if (!tackle) throw new Error("Expected Tackle catalog option")
    const state = defaultTrackState(catalog)
    state.statMode = "preset"
    state.defenderMode = "preset"
    state.moveSnapshots = [createMoveSnapshot(tackle, TACKLE.id)]
    state.selectedMoveSnapshotIds = [TACKLE.id]
    state.offensePresetIds = ["neutral-max"]
    state.defensePresetIds = ["standard-bulk"]
    state.attackerItemIds = ["none"]
    state.defenderItemIds = ["none"]
    state.attackerAbilityIds = [DEFIANT_ABILITY_ID]
    state.defenderAbilityIds = [NO_ABILITY_ID]
    const projected = projectAbilitySelections(state, "physical")

    const result = runScenarioPipeline(catalog, projected)

    expect(projected.attackerStages).toEqual([0, 1])
    expect(expectedRowCount(projected)).toBe(2)
    expect(result.rows).toHaveLength(2)
    expect(result.rows.map((row) => row.provenance["attacker-stage"]?.active).flat())
      .toEqual(["1"])
    expect(result.rows.every((row) =>
      row.provenance["attacker-ability"]?.neutral.includes(String(DEFIANT_ABILITY_ID)),
    )).toBe(true)
  })

  it("splits dynamic-type Adaptability from ordinary STAB through the pipeline and oracle", async () => {
    const catalog = await getCatalogShell(133, 143, "en", "special")
    const revelationDance = catalog.moves.find((move) => move.id === 686)
    if (!revelationDance) throw new Error("Expected Revelation Dance catalog option")
    const state = defaultTrackState(catalog)
    state.statMode = "preset"
    state.defenderMode = "preset"
    state.moveSnapshots = [createMoveSnapshot(
      revelationDance,
      "pipeline-revelation-dance",
    )]
    state.selectedMoveSnapshotIds = state.moveSnapshots.map((snapshot) => snapshot.id)
    state.offensePresetIds = ["neutral-max"]
    state.attackerStages = [0]
    state.attackerItemIds = ["none"]
    state.attackerAbilityIds = [50, ADAPTABILITY_ABILITY_ID]
    state.weathers = ["none"]
    state.defensePresetIds = ["standard-bulk"]
    state.defenderStages = [0]
    state.defenderAbilityIds = [17]
    const calculateRolls = damageKernel.calculateDamageRolls
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    const result = runScenarioPipeline(catalog, state)

    expect(expectedRowCount(state)).toBe(2)
    expect(result.rows).toHaveLength(2)
    expect(kernel).toHaveBeenCalledTimes(2)
    expect(result.rows.some((row) =>
      row.provenance["attacker-ability"]?.active.includes("91"),
    )).toBe(true)
    expect(result.rows.some((row) =>
      row.provenance["attacker-ability"]?.neutral.includes("50"),
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
    state.statMode = "preset"
    state.defenderMode = "preset"
    state.moveSnapshots = [createMoveSnapshot(waterGun, "pipeline-water-gun")]
    state.selectedMoveSnapshotIds = state.moveSnapshots.map((snapshot) => snapshot.id)
    state.offensePresetIds = ["neutral-max"]
    state.attackerStages = [0]
    state.attackerItemIds = ["none"]
    state.attackerAbilityIds = [50, ADAPTABILITY_ABILITY_ID]
    state.weathers = ["none"]
    state.defensePresetIds = ["standard-bulk"]
    state.defenderStages = [0]
    state.defenderAbilityIds = [50, ADAPTABILITY_ABILITY_ID]
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    const result = runScenarioPipeline(catalog, state)

    expect(expectedRowCount(state)).toBe(4)
    expect(result.rows).toHaveLength(1)
    expect(result.unavailable).toEqual([])
    expect(kernel).toHaveBeenCalledTimes(1)
    expect(result.rows[0].provenance["attacker-ability"]).toEqual({
      active: [],
      inactive: [String(ADAPTABILITY_ABILITY_ID)],
      unsupported: [],
      neutral: ["50"],
    })
    expect(result.rows[0].provenance["defender-ability"]).toEqual({
      active: [],
      inactive: [String(ADAPTABILITY_ABILITY_ID)],
      unsupported: [],
      neutral: ["50"],
    })
    kernel.mockRestore()
  })

  it("merges no ability with effect-equivalent inert ability branches", async () => {
    const catalog = await getCatalogShell(133, 143, "en", "physical")
    const state = defaultTrackState(catalog)
    state.statMode = "preset"
    state.defenderMode = "preset"
    const tackle = catalog.moves.find((move) => move.id === TACKLE.moveId)
    if (!tackle) throw new Error("Expected Tackle catalog option")
    state.moveSnapshots = [createMoveSnapshot(tackle, TACKLE.id)]
    state.selectedMoveSnapshotIds = [TACKLE.id]
    state.offensePresetIds = ["neutral-max"]
    state.defensePresetIds = ["standard-bulk"]
    state.attackerAbilityIds = [NO_ABILITY_ID, 50]
    state.defenderAbilityIds = [NO_ABILITY_ID, 17]

    const result = runScenarioPipeline(catalog, state)

    expect(expectedRowCount(state)).toBe(4)
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].provenance["attacker-ability"]).toEqual({
      active: [],
      inactive: [],
      unsupported: [],
      neutral: [String(NO_ABILITY_ID), "50"],
    })
    expect(result.rows[0].provenance["defender-ability"]).toEqual({
      active: [],
      inactive: [],
      unsupported: [],
      neutral: [String(NO_ABILITY_ID), "17"],
    })
  })
})
