import { calculate, Field, Move, Pokemon } from "@smogon/calc"
import { beforeAll, describe, expect, it } from "vitest"

import {
  AERILATE_ABILITY_ID,
  DRAGONIZE_ABILITY_ID,
  FAIRY_AURA_ABILITY_ID,
  GALVANIZE_ABILITY_ID,
  LIBERO_ABILITY_ID,
  LIQUID_VOICE_ABILITY_ID,
  NO_ABILITY_ID,
  NORMALIZE_ABILITY_ID,
  PIXILATE_ABILITY_ID,
  PROTEAN_ABILITY_ID,
  REFRIGERATE_ABILITY_ID,
} from "@/lib/ability"
import { getCatalogShell } from "@/lib/catalog"
import { createMoveSnapshot, type MoveSnapshot } from "@/lib/move"
import { listResources } from "@/lib/resources"
import { defaultTrackState, runScenarioPipeline } from "@/lib/scenario"

import {
  CALC_GEN,
  VGC_LEVEL,
  evaluateExecutionPoint,
  calculationIdentity,
  chainModifiers,
  compileAbilityEffect,
  compileScenario,
  NEUTRAL_MODIFIER,
  type CalculableScenario,
  type RawScenario,
} from "./index"
import { resolveAbilityScenarioMoveType } from "./scenario-move-type"

const N = NEUTRAL_MODIFIER

const TACKLE: MoveSnapshot = {
  id: "type-rewrite-tackle",
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

function normal(outcome: CalculableScenario) {
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

describe("resolveAbilityScenarioMoveType", () => {
  const base = {
    moveId: 33,
    moveType: "normal" as const,
    moveFlags: [] as string[],
    category: "physical" as const,
    hasOriginalTypeStab: false,
  }

  it.each([
    [AERILATE_ABILITY_ID, "flying"],
    [PIXILATE_ABILITY_ID, "fairy"],
    [REFRIGERATE_ABILITY_ID, "ice"],
    [GALVANIZE_ABILITY_ID, "electric"],
  ] as const)("rewrites Normal moves for ability %i to %s", (abilityId, type) => {
    expect(resolveAbilityScenarioMoveType({ ...base, abilityId })).toEqual({
      scenarioMoveType: type,
      basePowerModifier: 4915,
      grantsScenarioStab: false,
      active: true,
    })
  })

  it("keeps Normalize active on already-Normal damaging moves", () => {
    expect(resolveAbilityScenarioMoveType({
      ...base,
      abilityId: NORMALIZE_ABILITY_ID,
      hasOriginalTypeStab: true,
    })).toEqual({
      scenarioMoveType: "normal",
      basePowerModifier: 4915,
      grantsScenarioStab: false,
      active: true,
    })
  })

  it("rewrites non-Normal damaging moves for Normalize", () => {
    expect(resolveAbilityScenarioMoveType({
      ...base,
      abilityId: NORMALIZE_ABILITY_ID,
      moveType: "fire",
      moveId: 53,
    })).toMatchObject({ scenarioMoveType: "normal", basePowerModifier: 4915, active: true })
  })

  it.each([311, 449, 546, 686, 718, 805, 363])(
    "does not rewrite excluded move %i for -ate abilities",
    (moveId) => {
      expect(resolveAbilityScenarioMoveType({
        ...base,
        abilityId: PIXILATE_ABILITY_ID,
        moveId,
      }).active).toBe(false)
    },
  )

  it.each([237, 165])("does not rewrite Normalize-only exclusion %i", (moveId) => {
    expect(resolveAbilityScenarioMoveType({
      ...base,
      abilityId: NORMALIZE_ABILITY_ID,
      moveId,
      moveType: "fire",
    }).active).toBe(false)
  })

  it("activates Liquid Voice only when sound rewrites non-Water", () => {
    expect(resolveAbilityScenarioMoveType({
      ...base,
      abilityId: LIQUID_VOICE_ABILITY_ID,
      moveId: 304,
      moveFlags: ["sound"],
    })).toEqual({
      scenarioMoveType: "water",
      basePowerModifier: N,
      grantsScenarioStab: false,
      active: true,
    })
    expect(resolveAbilityScenarioMoveType({
      ...base,
      abilityId: LIQUID_VOICE_ABILITY_ID,
      moveType: "water",
      moveFlags: ["sound"],
    }).active).toBe(false)
    expect(resolveAbilityScenarioMoveType({
      ...base,
      abilityId: LIQUID_VOICE_ABILITY_ID,
      moveType: "fire",
      moveFlags: [],
    }).active).toBe(false)
  })

  it.each([PROTEAN_ABILITY_ID, LIBERO_ABILITY_ID])(
    "grants ordinary STAB for off-type ability %i without rewriting type",
    (abilityId) => {
      expect(resolveAbilityScenarioMoveType({
        ...base,
        abilityId,
        moveType: "fire",
        hasOriginalTypeStab: false,
      })).toEqual({
        scenarioMoveType: "fire",
        basePowerModifier: N,
        grantsScenarioStab: true,
        active: true,
      })
      expect(resolveAbilityScenarioMoveType({
        ...base,
        abilityId,
        moveType: "normal",
        hasOriginalTypeStab: true,
      }).active).toBe(false)
    },
  )
})

describe("scenario move type compiler coverage", () => {
  it("applies Pixilate type, BP, and STAB from original Fairy typing", () => {
    const outcome = calculable({
      attackerId: 700,
      attackerAbilityId: PIXILATE_ABILITY_ID,
    })
    expect(outcome.move.type).toBe("fairy")
    expect(normal(outcome).basePowerModifier).toBe(4915)
    expect(normal(outcome).stabModifier).toBe(6144)
    expect(outcome.sources).toContainEqual({
      track: "attacker-ability",
      optionId: String(PIXILATE_ABILITY_ID),
      state: "active",
    })
  })

  it("keeps Normalize active on native Normal without changing type", () => {
    const outcome = calculable({ attackerAbilityId: NORMALIZE_ABILITY_ID })
    expect(outcome.move.type).toBe("normal")
    expect(normal(outcome).basePowerModifier).toBe(4915)
    expect(outcome.sources).toContainEqual({
      track: "attacker-ability",
      optionId: String(NORMALIZE_ABILITY_ID),
      state: "active",
    })
  })

  it("marks Liquid Voice inactive when PokeAPI sound flag is missing", () => {
    const outcome = calculable({
      snapshot: { ...TACKLE, id: "torch-song", moveId: 871, power: 80 },
      attackerAbilityId: LIQUID_VOICE_ABILITY_ID,
    })
    expect(outcome.move.type).toBe("fire")
    expect(normal(outcome).basePowerModifier).toBe(N)
    expect(outcome.sources).toContainEqual({
      track: "attacker-ability",
      optionId: String(LIQUID_VOICE_ABILITY_ID),
      state: "inactive",
    })
  })

  it("marks Liquid Voice inactive for native Water sound moves", () => {
    const outcome = calculable({
      snapshot: {
        ...TACKLE,
        id: "sparkling-aria",
        moveId: 664,
        power: 90,
        spreadEligible: true,
        spread: true,
      },
      attackerAbilityId: LIQUID_VOICE_ABILITY_ID,
    })
    expect(outcome.move.type).toBe("water")
    expect(outcome.sources).toContainEqual({
      track: "attacker-ability",
      optionId: String(LIQUID_VOICE_ABILITY_ID),
      state: "inactive",
    })
  })

  it.each([
    [AERILATE_ABILITY_ID, "flying"],
    [REFRIGERATE_ABILITY_ID, "ice"],
    [GALVANIZE_ABILITY_ID, "electric"],
  ] as const)("compiles active rewrite for ability %i to %s", (abilityId, type) => {
    const outcome = calculable({ attackerAbilityId: abilityId })
    expect(outcome.move.type).toBe(type)
    expect(normal(outcome).basePowerModifier).toBe(4915)
    expect(outcome.sources).toContainEqual({
      track: "attacker-ability",
      optionId: String(abilityId),
      state: "active",
    })
  })

  it("keeps calc-missing Dragonize unsupported without rewriting the move type", () => {
    const outcome = calculable({ attackerAbilityId: DRAGONIZE_ABILITY_ID })
    expect(outcome.move.type).toBe("normal")
    expect(normal(outcome).basePowerModifier).toBe(N)
    expect(outcome.sources).toContainEqual({
      track: "attacker-ability",
      optionId: String(DRAGONIZE_ABILITY_ID),
      state: "unsupported",
    })
  })

  it("keeps excluded Judgment inactive under Pixilate", () => {
    const outcome = calculable({
      snapshot: { ...TACKLE, id: "judgment", moveId: 449, power: 100 },
      attackerAbilityId: PIXILATE_ABILITY_ID,
    })
    expect(outcome.move.type).toBe("normal")
    expect(normal(outcome).basePowerModifier).toBe(N)
    expect(outcome.sources).toContainEqual({
      track: "attacker-ability",
      optionId: String(PIXILATE_ABILITY_ID),
      state: "inactive",
    })
  })

  it("rewrites Hyper Voice to Water for Liquid Voice", () => {
    const outcome = calculable({
      snapshot: { ...TACKLE, id: "hyper-voice", moveId: 304, power: 90, spreadEligible: true, spread: true },
      attackerAbilityId: LIQUID_VOICE_ABILITY_ID,
    })
    expect(outcome.move.type).toBe("water")
    expect(normal(outcome).basePowerModifier).toBe(N)
    expect(outcome.sources).toContainEqual({
      track: "attacker-ability",
      optionId: String(LIQUID_VOICE_ABILITY_ID),
      state: "active",
    })
  })

  it("grants Protean ordinary STAB on off-type moves and stays inactive on STAB", () => {
    const offType = calculable({
      snapshot: { ...TACKLE, id: "ember", moveId: 52, power: 40 },
      attackerAbilityId: PROTEAN_ABILITY_ID,
    })
    expect(offType.move.type).toBe("fire")
    expect(normal(offType).stabModifier).toBe(6144)
    expect(normal(offType).stabModifier).not.toBe(8192)
    expect(offType.sources).toContainEqual({
      track: "attacker-ability",
      optionId: String(PROTEAN_ABILITY_ID),
      state: "active",
    })

    const onType = calculable({ attackerAbilityId: PROTEAN_ABILITY_ID })
    expect(normal(onType).stabModifier).toBe(6144)
    expect(onType.sources).toContainEqual({
      track: "attacker-ability",
      optionId: String(PROTEAN_ABILITY_ID),
      state: "inactive",
    })
  })

  it("grants Libero ordinary STAB on off-type moves and stays inactive on STAB", () => {
    const outcome = calculable({
      snapshot: { ...TACKLE, id: "water-gun", moveId: 55, power: 40 },
      attackerAbilityId: LIBERO_ABILITY_ID,
    })
    expect(outcome.move.type).toBe("water")
    expect(normal(outcome).stabModifier).toBe(6144)
    expect(outcome.sources).toContainEqual({
      track: "attacker-ability",
      optionId: String(LIBERO_ABILITY_ID),
      state: "active",
    })

    const onType = calculable({ attackerAbilityId: LIBERO_ABILITY_ID })
    expect(onType.sources).toContainEqual({
      track: "attacker-ability",
      optionId: String(LIBERO_ABILITY_ID),
      state: "inactive",
    })
  })

  it("drives type-gated attacker items from Scenario Move Type", () => {
    const withScarf = calculable({
      attackerId: 700,
      attackerAbilityId: PIXILATE_ABILITY_ID,
      attackerItemId: 228,
    })
    expect(withScarf.move.type).toBe("fairy")
    expect(normal(withScarf).basePowerModifier).toBe(4915)
    expect(withScarf.sources).toContainEqual({
      track: "held-item",
      optionId: "228",
      state: "inactive",
    })
  })

  it("merges same Scenario Move Type identities in the pipeline", async () => {
    const catalog = await getCatalogShell(700, 143, "en", "physical")
    const tackle = catalog.moves.find((move) => move.id === 33)
    if (!tackle) throw new Error("Expected Tackle")
    const state = defaultTrackState(catalog)
    state.statMode = "preset"
    state.defenderMode = "preset"
    state.moveSnapshots = [createMoveSnapshot(tackle, "merge-pixilate")]
    state.selectedMoveSnapshotIds = ["merge-pixilate"]
    state.offensePresetIds = ["neutral-max"]
    state.defensePresetIds = ["standard-bulk"]
    state.attackerAbilityIds = [PIXILATE_ABILITY_ID]
    state.screens = ["none"]
    const result = runScenarioPipeline(catalog, state)
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].moveType).toBe("fairy")
  })

  it("chains Pixilate and defender Fairy Aura Base Power", () => {
    const effect = compileAbilityEffect({
      attackerAbilityId: PIXILATE_ABILITY_ID,
      defenderAbilityId: FAIRY_AURA_ABILITY_ID,
      category: "physical",
      moveType: "fairy",
      power: 40,
      moveFlags: [],
      effectiveness: 1,
      weather: "none",
      hasStab: true,
      typeRewriteBasePower: 4915,
      typeRewriteActive: true,
    })
    expect(effect.basePowerModifier).toBe(chainModifiers([4915, 5448]))
    expect(effect.attackerState).toBe("active")
    expect(effect.defenderState).toBe("active")

    const outcome = calculable({
      attackerId: 700,
      attackerAbilityId: PIXILATE_ABILITY_ID,
      defenderAbilityId: FAIRY_AURA_ABILITY_ID,
    })
    expect(outcome.move.type).toBe("fairy")
    expect(normal(outcome).basePowerModifier).toBe(chainModifiers([4915, 5448]))
    expect(outcome.sources).toEqual(expect.arrayContaining([
      { track: "attacker-ability", optionId: String(PIXILATE_ABILITY_ID), state: "active" },
      { track: "defender-ability", optionId: String(FAIRY_AURA_ABILITY_ID), state: "active" },
    ]))
  })

  it("does not merge equal damage when Scenario Move Type differs", () => {
    const baseline = calculable({ attackerAbilityId: NO_ABILITY_ID })
    const sameCalcDifferentType: CalculableScenario = {
      ...baseline,
      move: { ...baseline.move, type: "flying" },
    }
    expect(calculationIdentity(sameCalcDifferentType)).not.toBe(calculationIdentity(baseline))
  })

  it("matches @smogon/calc Pixilate normal and critical rolls", () => {
    const attacker = new Pokemon(CALC_GEN, "Sylveon", {
      level: VGC_LEVEL,
      ability: "Pixilate",
      nature: "Adamant",
      evs: { atk: 252 },
    })
    const defender = new Pokemon(CALC_GEN, "Snorlax", {
      level: VGC_LEVEL,
      nature: "Impish",
      evs: { hp: 252, def: 252 },
    })
    const outcome = calculable({
      snapshot: { ...TACKLE, id: "pixilate-oracle" },
      attackerId: 700,
      defenderId: 143,
      attackerAbilityId: PIXILATE_ABILITY_ID,
      lowOutcome: {
        offense: attacker.rawStats.atk,
        defense: { hp: defender.maxHP(), def: defender.rawStats.def },
      },
    })
    const execution = evaluateExecutionPoint(outcome)
    const field = new Field()
    expect([execution.normal!.min, execution.normal!.max]).toEqual(
      calculate(CALC_GEN, attacker, defender, new Move(CALC_GEN, "Tackle"), field).range(),
    )
    expect([execution.critical!.min, execution.critical!.max]).toEqual(
      calculate(
        CALC_GEN,
        attacker,
        defender,
        new Move(CALC_GEN, "Tackle", { isCrit: true }),
        field,
      ).range(),
    )
  })

  it("surfaces Scenario Move Type on pipeline rows and drops unsupported red-dot for Pixilate", async () => {
    const catalog = await getCatalogShell(700, 143, "en", "physical")
    const tackle = catalog.moves.find((move) => move.id === 33)
    if (!tackle) throw new Error("Expected Tackle")
    const state = defaultTrackState(catalog)
    state.statMode = "preset"
    state.defenderMode = "preset"
    state.moveSnapshots = [createMoveSnapshot(tackle, "pixilate-row")]
    state.selectedMoveSnapshotIds = ["pixilate-row"]
    state.offensePresetIds = ["neutral-max"]
    state.defensePresetIds = ["standard-bulk"]
    state.attackerAbilityIds = [PIXILATE_ABILITY_ID]
    const result = runScenarioPipeline(catalog, state)
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].moveType).toBe("fairy")
    expect(result.rows[0].moveId).toBe(33)
    expect(result.rows[0].provenance["attacker-ability"]?.active).toEqual([
      String(PIXILATE_ABILITY_ID),
    ])
  })
})
