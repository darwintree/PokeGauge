import { calculate, Field, Move, Pokemon } from "@smogon/calc"
import { beforeAll, describe, expect, it } from "vitest"

import {
  INFILTRATOR_ABILITY_ID,
  NO_ABILITY_ID,
  UNAWARE_ABILITY_ID,
} from "@/lib/ability"
import { getCatalogShell } from "@/lib/catalog"
import { createMoveSnapshot, type MoveSnapshot } from "@/lib/move"
import { getMoveById, listResources } from "@/lib/resources"
import { defaultTrackState, runScenarioPipeline } from "@/lib/scenario"

import {
  CALC_GEN,
  NEUTRAL_MODIFIER,
  VGC_LEVEL,
  evaluateExecutionPoint,
  compileScenario,
  type CalculableScenario,
  type RawScenario,
  type ScenarioTrack,
} from "./index"

const TACKLE: MoveSnapshot = {
  id: "ability-stage-screen-bypass-tackle",
  moveId: 33,
  power: 40,
  accuracy: 100,
  alwaysHits: false,
  criticalStage: 0,
  spreadEligible: false,
  spread: false,
}

function scenario(overrides: Partial<RawScenario> = {}): RawScenario {
  return {
    snapshot: TACKLE,
    attackerId: 133,
    defenderId: 143,
    attackerItemId: "none",
    defenderItemId: "none",
    attackerAbilityId: NO_ABILITY_ID,
    defenderAbilityId: NO_ABILITY_ID,
    attackerStage: 0,
    defenderStage: 0,
    weather: "none",
    terrain: "none",
    screen: "none",
    probabilityMode: "classic",
    lowOutcome: { offense: 100, defense: { hp: 200, def: 100 } },
    ...overrides,
  }
}

function calculable(overrides: Partial<RawScenario> = {}): CalculableScenario {
  const outcome = compileScenario(scenario(overrides))
  if (outcome.kind !== "calculable") throw new Error(`Expected calculable, got ${outcome.reason}`)
  return outcome
}

function state(outcome: CalculableScenario, track: ScenarioTrack): string | undefined {
  return outcome.sources.find((source) => source.track === track)?.state
}

beforeAll(async () => {
  await Promise.all([
    listResources("pokemon", "en"),
    listResources("move", "en"),
    listResources("ability", "en"),
  ])
})

describe("Unaware", () => {
  it("attacker Unaware zeros defender stage on ordinary and critical branches", () => {
    const outcome = calculable({
      attackerAbilityId: UNAWARE_ABILITY_ID,
      defenderStage: 2,
    })
    expect(outcome.calculation.low.normal).toMatchObject({ defenseStage: 0 })
    expect(outcome.calculation.low.critical).toMatchObject({ defenseStage: 0 })
    expect(state(outcome, "attacker-ability")).toBe("active")
    expect(state(outcome, "defender-stage")).toBe("inactive")
  })

  it("defender Unaware zeros attacker stage on ordinary and critical branches", () => {
    const outcome = calculable({
      defenderAbilityId: UNAWARE_ABILITY_ID,
      attackerStage: 2,
    })
    expect(outcome.calculation.low.normal).toMatchObject({ attackStage: 0 })
    expect(outcome.calculation.low.critical).toMatchObject({ attackStage: 0 })
    expect(state(outcome, "defender-ability")).toBe("active")
    expect(state(outcome, "attacker-stage")).toBe("inactive")
  })

  it("stacks both Unaware selections into zero stages on both sides", () => {
    const outcome = calculable({
      attackerAbilityId: UNAWARE_ABILITY_ID,
      defenderAbilityId: UNAWARE_ABILITY_ID,
      attackerStage: -2,
      defenderStage: 2,
    })
    expect(outcome.calculation.low.normal).toMatchObject({
      attackStage: 0,
      defenseStage: 0,
    })
    expect(outcome.calculation.low.critical).toMatchObject({
      attackStage: 0,
      defenseStage: 0,
    })
    expect(state(outcome, "attacker-ability")).toBe("active")
    expect(state(outcome, "defender-ability")).toBe("active")
    expect(state(outcome, "attacker-stage")).toBe("inactive")
    expect(state(outcome, "defender-stage")).toBe("inactive")
  })

  it("is inactive when the ignored stage is already 0", () => {
    const attacker = calculable({ attackerAbilityId: UNAWARE_ABILITY_ID, defenderStage: 0 })
    const defender = calculable({ defenderAbilityId: UNAWARE_ABILITY_ID, attackerStage: 0 })
    expect(state(attacker, "attacker-ability")).toBe("inactive")
    expect(state(defender, "defender-ability")).toBe("inactive")
    expect(state(attacker, "defender-stage")).toBe("neutral")
    expect(state(defender, "attacker-stage")).toBe("neutral")
  })

  it("leaves the unignored side subject to critical stage clamp", () => {
    const outcome = calculable({
      attackerAbilityId: UNAWARE_ABILITY_ID,
      attackerStage: -2,
      defenderStage: 2,
    })
    expect(outcome.calculation.low.normal).toMatchObject({
      attackStage: -2,
      defenseStage: 0,
    })
    expect(outcome.calculation.low.critical).toMatchObject({
      attackStage: 0,
      defenseStage: 0,
    })
    expect(state(outcome, "attacker-stage")).toBe("active")
  })

  it("is inactive when +3 already swallows the ignored stage", () => {
    const attacker = calculable({
      attackerAbilityId: UNAWARE_ABILITY_ID,
      defenderStage: 2,
      snapshot: { ...TACKLE, criticalStage: 3 },
    })
    const defender = calculable({
      defenderAbilityId: UNAWARE_ABILITY_ID,
      attackerStage: -2,
      snapshot: { ...TACKLE, criticalStage: 3 },
    })
    expect(attacker.calculation.low.normal).toBeUndefined()
    expect(attacker.calculation.low.critical).toMatchObject({ defenseStage: 0 })
    expect(state(attacker, "attacker-ability")).toBe("inactive")
    expect(state(attacker, "defender-stage")).toBe("inactive")

    expect(defender.calculation.low.critical).toMatchObject({ attackStage: 0 })
    expect(state(defender, "defender-ability")).toBe("inactive")
    expect(state(defender, "attacker-stage")).toBe("inactive")
  })

  it("stays active under +3 when the ignored stage still affects crit without Unaware", () => {
    const attacker = calculable({
      attackerAbilityId: UNAWARE_ABILITY_ID,
      defenderStage: -2,
      snapshot: { ...TACKLE, criticalStage: 3 },
    })
    const defender = calculable({
      defenderAbilityId: UNAWARE_ABILITY_ID,
      attackerStage: 2,
      snapshot: { ...TACKLE, criticalStage: 3 },
    })
    expect(attacker.calculation.low.critical).toMatchObject({ defenseStage: 0 })
    expect(state(attacker, "attacker-ability")).toBe("active")
    expect(defender.calculation.low.critical).toMatchObject({ attackStage: 0 })
    expect(state(defender, "defender-ability")).toBe("active")
  })

  it("merges bypassed defender stages with stage 0 and keeps inactive provenance", async () => {
    const catalog = await getCatalogShell(133, 143, "en", "physical")
    const move = catalog.moves.find((candidate) => candidate.id === 33)
    if (!move) throw new Error("Expected Tackle")
    const trackState = defaultTrackState(catalog)
    trackState.statMode = "preset"
    trackState.defenderMode = "preset"
    trackState.moveSnapshots = [createMoveSnapshot(move, "unaware-merge")]
    trackState.selectedMoveSnapshotIds = trackState.moveSnapshots.map((snapshot) => snapshot.id)
    trackState.offensePresetIds = ["neutral-max"]
    trackState.attackerStages = [0]
    trackState.attackerItemIds = ["none"]
    trackState.attackerAbilityIds = [UNAWARE_ABILITY_ID]
    trackState.weathers = ["none"]
    trackState.terrains = ["none"]
    trackState.defensePresetIds = ["standard-bulk"]
    trackState.defenderStages = [0, 1, 2]
    trackState.defenderAbilityIds = [NO_ABILITY_ID]
    trackState.screens = ["none"]

    const result = runScenarioPipeline(catalog, trackState)
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].provenance["defender-stage"]).toEqual({
      active: [],
      inactive: ["1", "2"],
      unsupported: [],
      neutral: ["0"],
    })
    expect(result.rows[0].provenance["attacker-ability"]).toEqual({
      active: [String(UNAWARE_ABILITY_ID)],
      inactive: [String(UNAWARE_ABILITY_ID)],
      unsupported: [],
      neutral: [],
    })
  })
})

describe("Infiltrator", () => {
  it("attacker Infiltrator bypasses an otherwise-active Reflect", () => {
    const outcome = calculable({
      attackerAbilityId: INFILTRATOR_ABILITY_ID,
      screen: "walls",
    })
    expect(outcome.calculation.low.normal?.finalModifier).toBe(NEUTRAL_MODIFIER)
    expect(state(outcome, "attacker-ability")).toBe("active")
    expect(state(outcome, "screen")).toBe("inactive")
  })

  it("attacker Infiltrator bypasses an otherwise-active Light Screen", () => {
    const outcome = calculable({
      snapshot: { ...TACKLE, id: "flamethrower", moveId: 53, power: 90 },
      attackerId: 6,
      attackerAbilityId: INFILTRATOR_ABILITY_ID,
      screen: "walls",
    })
    expect(outcome.calculation.low.normal?.finalModifier).toBe(NEUTRAL_MODIFIER)
    expect(state(outcome, "attacker-ability")).toBe("active")
    expect(state(outcome, "screen")).toBe("inactive")
  })

  it("defender Infiltrator is always inactive and does not bypass screens", () => {
    const outcome = calculable({
      defenderAbilityId: INFILTRATOR_ABILITY_ID,
      screen: "walls",
    })
    expect(outcome.calculation.low.normal?.finalModifier).not.toBe(NEUTRAL_MODIFIER)
    expect(state(outcome, "defender-ability")).toBe("inactive")
    expect(state(outcome, "screen")).toBe("active")
  })

  it("is inactive when the wall is already inactive", () => {
    const criticalOnly = calculable({
      attackerAbilityId: INFILTRATOR_ABILITY_ID,
      screen: "walls",
      snapshot: { ...TACKLE, criticalStage: 3 },
    })
    const breaker = calculable({
      attackerId: 445,
      attackerAbilityId: INFILTRATOR_ABILITY_ID,
      screen: "walls",
      snapshot: {
        ...TACKLE,
        id: "brick-break",
        moveId: 280,
        power: 75,
      },
    })

    expect(state(criticalOnly, "attacker-ability")).toBe("inactive")
    expect(state(breaker, "attacker-ability")).toBe("inactive")
    expect(state(breaker, "screen")).toBe("inactive")
  })

  it("is inactive when screen is none", () => {
    const outcome = calculable({ attackerAbilityId: INFILTRATOR_ABILITY_ID, screen: "none" })
    expect(state(outcome, "attacker-ability")).toBe("inactive")
    expect(state(outcome, "screen")).toBe("neutral")
  })

  it("merges bypassed screens with none and keeps inactive provenance", async () => {
    const catalog = await getCatalogShell(133, 143, "en", "physical")
    const move = catalog.moves.find((candidate) => candidate.id === 33)
    if (!move) throw new Error("Expected Tackle")
    const trackState = defaultTrackState(catalog)
    trackState.statMode = "preset"
    trackState.defenderMode = "preset"
    trackState.moveSnapshots = [createMoveSnapshot(move, "infiltrator-merge")]
    trackState.selectedMoveSnapshotIds = trackState.moveSnapshots.map((snapshot) => snapshot.id)
    trackState.offensePresetIds = ["neutral-max"]
    trackState.attackerStages = [0]
    trackState.attackerItemIds = ["none"]
    trackState.attackerAbilityIds = [INFILTRATOR_ABILITY_ID]
    trackState.weathers = ["none"]
    trackState.terrains = ["none"]
    trackState.defensePresetIds = ["standard-bulk"]
    trackState.defenderStages = [0]
    trackState.defenderAbilityIds = [NO_ABILITY_ID]
    trackState.screens = ["none", "walls"]

    const result = runScenarioPipeline(catalog, trackState)
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].provenance.screen).toEqual({
      active: [],
      inactive: ["reflect"],
      unsupported: [],
      neutral: ["none"],
    })
    expect(result.rows[0].provenance["attacker-ability"]).toEqual({
      active: [String(INFILTRATOR_ABILITY_ID)],
      inactive: [String(INFILTRATOR_ABILITY_ID)],
      unsupported: [],
      neutral: [],
    })
  })
})

describe("@smogon/calc oracle", () => {
  it("matches Unaware and Infiltrator rolls for representative cases", () => {
    const unawareAttacker = new Pokemon(CALC_GEN, "Clefable", {
      level: VGC_LEVEL,
      ability: "Unaware",
      nature: "Modest",
      evs: { spa: 252 },
    })
    const boostedSnorlax = new Pokemon(CALC_GEN, "Snorlax", {
      level: VGC_LEVEL,
      nature: "Careful",
      evs: { hp: 252, spd: 252 },
      boosts: { spd: 2 },
    })
    const moonblast = getMoveById(585)
    if (!moonblast || moonblast.power === null) throw new Error("Expected Moonblast")
    const unawareLocal = calculable({
      snapshot: {
        ...TACKLE,
        id: "oracle-unaware",
        moveId: 585,
        power: moonblast.power,
        accuracy: moonblast.accuracy ?? 100,
      },
      attackerId: 36,
      defenderId: 143,
      attackerAbilityId: UNAWARE_ABILITY_ID,
      defenderStage: 2,
      lowOutcome: {
        offense: unawareAttacker.rawStats.spa,
        defense: { hp: boostedSnorlax.maxHP(), def: boostedSnorlax.rawStats.spd },
      },
    })
    const unawareField = new Field()
    const unawareRolls = evaluateExecutionPoint(unawareLocal)
    expect([unawareRolls.normal!.min, unawareRolls.normal!.max]).toEqual(
      calculate(
        CALC_GEN,
        unawareAttacker,
        boostedSnorlax,
        new Move(CALC_GEN, "Moonblast"),
        unawareField,
      ).range(),
    )
    expect([unawareRolls.critical!.min, unawareRolls.critical!.max]).toEqual(
      calculate(
        CALC_GEN,
        unawareAttacker,
        boostedSnorlax,
        new Move(CALC_GEN, "Moonblast", { isCrit: true }),
        unawareField,
      ).range(),
    )

    const infiltratorAttacker = new Pokemon(CALC_GEN, "Crobat", {
      level: VGC_LEVEL,
      ability: "Infiltrator",
      nature: "Jolly",
      evs: { atk: 252 },
    })
    const snorlax = new Pokemon(CALC_GEN, "Snorlax", {
      level: VGC_LEVEL,
      nature: "Impish",
      evs: { hp: 252, def: 252 },
    })
    const braveBird = getMoveById(413)
    if (!braveBird || braveBird.power === null) throw new Error("Expected Brave Bird")
    const infiltratorLocal = calculable({
      snapshot: {
        ...TACKLE,
        id: "oracle-infiltrator",
        moveId: 413,
        power: braveBird.power,
        accuracy: braveBird.accuracy ?? 100,
      },
      attackerId: 169,
      defenderId: 143,
      attackerAbilityId: INFILTRATOR_ABILITY_ID,
      screen: "walls",
      lowOutcome: {
        offense: infiltratorAttacker.rawStats.atk,
        defense: { hp: snorlax.maxHP(), def: snorlax.rawStats.def },
      },
    })
    const infiltratorField = new Field({ defenderSide: { isReflect: true } })
    const infiltratorRolls = evaluateExecutionPoint(infiltratorLocal)
    expect([infiltratorRolls.normal!.min, infiltratorRolls.normal!.max]).toEqual(
      calculate(
        CALC_GEN,
        infiltratorAttacker,
        snorlax,
        new Move(CALC_GEN, "Brave Bird"),
        infiltratorField,
      ).range(),
    )
    expect([infiltratorRolls.critical!.min, infiltratorRolls.critical!.max]).toEqual(
      calculate(
        CALC_GEN,
        infiltratorAttacker,
        snorlax,
        new Move(CALC_GEN, "Brave Bird", { isCrit: true }),
        infiltratorField,
      ).range(),
    )
  })
})
