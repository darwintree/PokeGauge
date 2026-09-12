import { calculate, Field, Move, Pokemon } from "@smogon/calc"
import { beforeAll, describe, expect, it } from "vitest"

import {
  ADAPTABILITY_ABILITY_ID,
  BLAZE_ABILITY_ID,
  DRAGONIZE_ABILITY_ID,
  EELEVATE_ABILITY_ID,
  FAIRY_AURA_ABILITY_ID,
  FILTER_ABILITY_ID,
  FIRE_MANE_ABILITY_ID,
  FUR_COAT_ABILITY_ID,
  GUTS_ABILITY_ID,
  HEATPROOF_ABILITY_ID,
  HUGE_POWER_ABILITY_ID,
  HUSTLE_ABILITY_ID,
  IRON_FIST_ABILITY_ID,
  MARVEL_SCALE_ABILITY_ID,
  MEGA_LAUNCHER_ABILITY_ID,
  MEGA_SOL_ABILITY_ID,
  MULTISCALE_ABILITY_ID,
  NO_ABILITY_ID,
  OVERGROW_ABILITY_ID,
  PURE_POWER_ABILITY_ID,
  PURIFYING_SALT_ABILITY_ID,
  SAND_FORCE_ABILITY_ID,
  SOLAR_POWER_ABILITY_ID,
  SOLID_ROCK_ABILITY_ID,
  SNIPER_ABILITY_ID,
  STRONG_JAW_ABILITY_ID,
  SWARM_ABILITY_ID,
  TECHNICIAN_ABILITY_ID,
  THICK_FAT_ABILITY_ID,
  TORRENT_ABILITY_ID,
  TOUGH_CLAWS_ABILITY_ID,
  WATER_BUBBLE_ABILITY_ID,
} from "@/lib/ability"
import { getCatalogShell } from "@/lib/catalog"
import { createMoveSnapshot, type MoveSnapshot } from "@/lib/move"
import { getMoveById, listResources } from "@/lib/resources"
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

const N = NEUTRAL_MODIFIER

const TACKLE: MoveSnapshot = {
  id: "ability-modifier-tackle",
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

describe("ability modifier gates", () => {
  const base = {
    attackerAbilityId: NO_ABILITY_ID,
    defenderAbilityId: NO_ABILITY_ID,
    category: "physical" as const,
    moveType: "normal" as const,
    power: 80,
    moveFlags: [] as string[],
    effectiveness: 1,
    weather: "none" as const,
    hasStab: false,
  }

  it.each([
    [ADAPTABILITY_ABILITY_ID, { hasStab: true }, { hasStab: false }, "stabModifier", 8192],
    [HUGE_POWER_ABILITY_ID, { category: "physical" }, { category: "special" }, "attackerAttackModifier", 8192],
    [PURE_POWER_ABILITY_ID, { category: "physical" }, { category: "special" }, "attackerAttackModifier", 8192],
    [WATER_BUBBLE_ABILITY_ID, { moveType: "water" }, { moveType: "fire" }, "attackerAttackModifier", 8192],
    [SOLAR_POWER_ABILITY_ID, { category: "special", weather: "sun" }, { category: "special", weather: "none" }, "attackerAttackModifier", 6144],
    [TECHNICIAN_ABILITY_ID, { power: 60 }, { power: 61 }, "basePowerModifier", 6144],
    [TOUGH_CLAWS_ABILITY_ID, { moveFlags: ["contact"] }, { moveFlags: [] }, "basePowerModifier", 5325],
    [IRON_FIST_ABILITY_ID, { moveFlags: ["punch"] }, { moveFlags: [] }, "basePowerModifier", 4915],
    [STRONG_JAW_ABILITY_ID, { moveFlags: ["bite"] }, { moveFlags: [] }, "basePowerModifier", 6144],
    [MEGA_LAUNCHER_ABILITY_ID, { moveFlags: ["pulse"] }, { moveFlags: [] }, "basePowerModifier", 6144],
    [SAND_FORCE_ABILITY_ID, { moveType: "ground", weather: "sand" }, { moveType: "ground", weather: "none" }, "basePowerModifier", 5325],
    [FAIRY_AURA_ABILITY_ID, { moveType: "fairy" }, { moveType: "normal" }, "basePowerModifier", 5448],
    [OVERGROW_ABILITY_ID, { moveType: "grass" }, { moveType: "fire" }, "basePowerModifier", 6144],
    [BLAZE_ABILITY_ID, { moveType: "fire" }, { moveType: "water" }, "basePowerModifier", 6144],
    [TORRENT_ABILITY_ID, { moveType: "water" }, { moveType: "grass" }, "basePowerModifier", 6144],
    [SWARM_ABILITY_ID, { moveType: "bug" }, { moveType: "normal" }, "basePowerModifier", 6144],
    [GUTS_ABILITY_ID, { category: "physical" }, { category: "special" }, "attackerAttackModifier", 6144],
  ] as const)("marks attacker Ability %i active and inactive", (id, active, inactive, field, modifier) => {
    const yes = compileAbilityEffect({ ...base, ...active, attackerAbilityId: id })
    const no = compileAbilityEffect({ ...base, ...inactive, attackerAbilityId: id })
    expect(yes.attackerState).toBe("active")
    expect(yes[field]).toBe(modifier)
    expect(no.attackerState).toBe("inactive")
    expect(no[field]).toBe(N)
  })

  it.each([
    [WATER_BUBBLE_ABILITY_ID, { moveType: "fire" }, { moveType: "water" }, "defenderAttackModifier", 2048],
    [THICK_FAT_ABILITY_ID, { moveType: "ice" }, { moveType: "water" }, "defenderAttackModifier", 2048],
    [PURIFYING_SALT_ABILITY_ID, { moveType: "ghost" }, { moveType: "normal" }, "defenderAttackModifier", 2048],
    [HEATPROOF_ABILITY_ID, { moveType: "fire" }, { moveType: "water" }, "defenderAttackModifier", 2048],
    [FUR_COAT_ABILITY_ID, { category: "physical" }, { category: "special" }, "defenseModifier", 8192],
    [FILTER_ABILITY_ID, { effectiveness: 2 }, { effectiveness: 1 }, "finalModifier", 3072],
    [SOLID_ROCK_ABILITY_ID, { effectiveness: 2 }, { effectiveness: 1 }, "finalModifier", 3072],
    [FAIRY_AURA_ABILITY_ID, { moveType: "fairy" }, { moveType: "normal" }, "basePowerModifier", 5448],
    [MARVEL_SCALE_ABILITY_ID, { category: "physical" }, { category: "special" }, "defenseModifier", 6144],
  ] as const)("marks defender Ability %i active and inactive", (id, active, inactive, field, modifier) => {
    const yes = compileAbilityEffect({ ...base, ...active, defenderAbilityId: id })
    const no = compileAbilityEffect({ ...base, ...inactive, defenderAbilityId: id })
    expect(yes.defenderState).toBe("active")
    expect(yes[field]).toBe(modifier)
    expect(no.defenderState).toBe("inactive")
    expect(no[field]).toBe(N)
  })

  it("marks Multiscale active on defender with final 2048 and inactive on attacker", () => {
    const yes = compileAbilityEffect({ ...base, defenderAbilityId: MULTISCALE_ABILITY_ID })
    expect(yes.defenderState).toBe("active")
    expect(yes.finalModifier).toBe(2048)

    const wrongSide = compileAbilityEffect({ ...base, attackerAbilityId: MULTISCALE_ABILITY_ID })
    expect(wrongSide.attackerState).toBe("inactive")
    expect(wrongSide.finalModifier).toBe(N)
  })

  it("keeps assumed-satisfied abilities inactive on the wrong side", () => {
    expect(compileAbilityEffect({
      ...base,
      moveType: "fire",
      defenderAbilityId: BLAZE_ABILITY_ID,
    }).defenderState).toBe("inactive")
    expect(compileAbilityEffect({
      ...base,
      category: "physical",
      defenderAbilityId: GUTS_ABILITY_ID,
    }).defenderState).toBe("inactive")
    expect(compileAbilityEffect({
      ...base,
      category: "physical",
      attackerAbilityId: MARVEL_SCALE_ABILITY_ID,
    }).attackerState).toBe("inactive")
  })
})

describe("PokeAPI move flags", () => {
  it("keeps all generated flags and covers positive, negative, and known-missing gates", () => {
    expect(getMoveById(33)?.flags).toEqual(expect.arrayContaining(["contact"]))
    expect(getMoveById(183)?.flags).toEqual(expect.arrayContaining(["contact", "punch"]))
    expect(getMoveById(44)?.flags).toEqual(expect.arrayContaining(["contact", "bite"]))
    expect(getMoveById(396)?.flags).toEqual(expect.arrayContaining(["pulse"]))
    for (const flag of ["contact", "punch", "bite", "pulse"]) {
      expect(getMoveById(129)?.flags).not.toContain(flag)
    }
    expect(getMoveById(857)?.flags).toEqual([])
  })

  it("treats PokeAPI's known missing Jet Punch mapping as inactive without fallback", () => {
    const outcome = calculable({
      snapshot: { ...TACKLE, id: "jet-punch", moveId: 857, power: 60 },
      attackerAbilityId: IRON_FIST_ABILITY_ID,
    })
    expect(normal(outcome).basePowerModifier).toBe(N)
    expect(outcome.sources).toContainEqual({
      track: "attacker-ability",
      optionId: String(IRON_FIST_ABILITY_ID),
      state: "inactive",
    })
  })

  it.each([
    DRAGONIZE_ABILITY_ID,
    MEGA_SOL_ABILITY_ID,
    EELEVATE_ABILITY_ID,
    FIRE_MANE_ABILITY_ID,
  ])("keeps calc-missing Ability %i fully unsupported", (abilityId) => {
    const outcome = calculable({ attackerAbilityId: abilityId, defenderAbilityId: abilityId })
    expect(outcome.sources).toEqual(expect.arrayContaining([
      { track: "attacker-ability", optionId: String(abilityId), state: "unsupported" },
      { track: "defender-ability", optionId: String(abilityId), state: "unsupported" },
    ]))
  })
})

describe("phase order, critical, and provenance", () => {
  it("chains Base Power as ability, item, terrain, then move/weather callback", () => {
    const outcome = calculable({
      snapshot: { ...TACKLE, id: "solar-blade", moveId: 669, power: 125 },
      attackerItemId: 216,
      attackerAbilityId: TOUGH_CLAWS_ABILITY_ID,
      weather: "rain",
      terrain: "grassy",
    })
    expect(normal(outcome).basePowerModifier).toBe(chainModifiers([5325, 4915, 5325, 2048]))
  })

  it("chains Attack as attacker Ability, defender Ability, then attacker item", () => {
    const outcome = calculable({
      snapshot: { ...TACKLE, id: "fire-punch", moveId: 7, power: 75 },
      attackerItemId: 197,
      attackerAbilityId: HUGE_POWER_ABILITY_ID,
      defenderAbilityId: THICK_FAT_ABILITY_ID,
    })
    expect(normal(outcome).attackModifier).toBe(chainModifiers([8192, 2048, 6144]))
  })

  it("preserves raw operands and the kernel interface", () => {
    const outcome = calculable({
      snapshot: { ...TACKLE, power: 55 },
      attackerAbilityId: HUGE_POWER_ABILITY_ID,
      lowOutcome: { offense: 123, defense: { hp: 234, def: 111 } },
    })
    expect(normal(outcome)).toMatchObject({ power: 55, attack: 123, defense: 111 })
    expect(outcome.calculation.low.defenderHp).toBe(234)
    expect(outcome).not.toHaveProperty("modifierDetails")
    expect(outcome).not.toHaveProperty("contributions")
  })

  it("chains Defense as defender Ability then defender item", () => {
    const outcome = calculable({
      defenderId: 112,
      defenderItemId: 581,
      defenderAbilityId: FUR_COAT_ABILITY_ID,
    })
    expect(normal(outcome).defenseModifier).toBe(chainModifiers([8192, 6144]))
  })

  it("removes only screen from the critical Final chain", () => {
    const outcome = calculable({
      snapshot: { ...TACKLE, id: "earthquake", moveId: 89, power: 100 },
      attackerId: 445,
      defenderId: 727,
      attackerItemId: 247,
      defenderItemId: 168,
      defenderAbilityId: FILTER_ABILITY_ID,
      screen: "walls",
    })
    expect(normal(outcome).finalModifier).toBe(chainModifiers([2732, 3072, 5324, 2048]))
    expect(outcome.calculation.low.critical?.finalModifier).toBe(
      chainModifiers([N, 3072, 5324, 2048]),
    )
  })

  it("applies Fairy Aura once for all four sides and merges to two identities", async () => {
    const combinations = [
      [NO_ABILITY_ID, NO_ABILITY_ID],
      [FAIRY_AURA_ABILITY_ID, NO_ABILITY_ID],
      [NO_ABILITY_ID, FAIRY_AURA_ABILITY_ID],
      [FAIRY_AURA_ABILITY_ID, FAIRY_AURA_ABILITY_ID],
    ] as const
    const outcomes = combinations.map(([attackerAbilityId, defenderAbilityId]) => calculable({
      snapshot: { ...TACKLE, id: "moonblast", moveId: 585, power: 95 },
      attackerAbilityId,
      defenderAbilityId,
    }))
    expect(outcomes.map((outcome) => normal(outcome).basePowerModifier)).toEqual([N, 5448, 5448, 5448])
    expect(new Set(outcomes.map(calculationIdentity))).toHaveLength(2)
    expect(outcomes[3].sources).toEqual(expect.arrayContaining([
      { track: "attacker-ability", optionId: String(FAIRY_AURA_ABILITY_ID), state: "active" },
      { track: "defender-ability", optionId: String(FAIRY_AURA_ABILITY_ID), state: "active" },
    ]))

    const catalog = await getCatalogShell(133, 143, "en", "special")
    const moonblast = catalog.moves.find((move) => move.id === 585)
    if (!moonblast) throw new Error("Expected Moonblast")
    const state = defaultTrackState(catalog)
    state.statMode = "preset"
    state.defenderMode = "preset"
    state.moveSnapshots = [createMoveSnapshot(moonblast, "fairy-aura-product")]
    state.selectedMoveSnapshotIds = ["fairy-aura-product"]
    state.offensePresetIds = ["neutral-max"]
    state.defensePresetIds = ["standard-bulk"]
    state.attackerAbilityIds = [NO_ABILITY_ID, FAIRY_AURA_ABILITY_ID]
    state.defenderAbilityIds = [NO_ABILITY_ID, FAIRY_AURA_ABILITY_ID]
    const result = runScenarioPipeline(catalog, state)
    expect(result.rows).toHaveLength(2)
    const aura = result.rows.find((row) => row.provenance["attacker-ability"]?.active.length)
    expect(aura?.provenance["attacker-ability"]?.active).toEqual([String(FAIRY_AURA_ABILITY_ID)])
    expect(aura?.provenance["defender-ability"]?.active).toEqual([String(FAIRY_AURA_ABILITY_ID)])

    // Fixing the attacker source must also remove unrelated defender sources:
    // no attacker aura + boosted damage can only come from defender aura.
    const partitioned = runScenarioPipeline(catalog, state, "battle-odds", "attacker-ability")
    expect(partitioned.rows).toHaveLength(3)
    const defenderOnly = partitioned.rows.find(row =>
      row.provenance["attacker-ability"]?.neutral.includes(String(NO_ABILITY_ID)) &&
      row.provenance["defender-ability"]?.active.includes(String(FAIRY_AURA_ABILITY_ID)))
    expect(defenderOnly?.provenance["defender-ability"]?.neutral).toEqual([])
    const attackerAura = partitioned.rows.find(row =>
      row.provenance["attacker-ability"]?.active.includes(String(FAIRY_AURA_ABILITY_ID)))
    expect(attackerAura?.provenance["defender-ability"]?.neutral).toEqual([String(NO_ABILITY_ID)])
    expect(attackerAura?.provenance["defender-ability"]?.active).toEqual([String(FAIRY_AURA_ABILITY_ID)])
  })

  it.each([
    [SAND_FORCE_ABILITY_ID, "sand", 89, 100],
    [SOLAR_POWER_ABILITY_ID, "sun", 53, 90],
  ] as const)("marks Weather active when Ability %i consumes its gate", (abilityId, weather, moveId, power) => {
    const outcome = calculable({
      snapshot: { ...TACKLE, id: `weather-${abilityId}`, moveId, power },
      attackerAbilityId: abilityId,
      weather,
    })
    expect(outcome.sources).toContainEqual({ track: "weather", optionId: weather, state: "active" })
  })
})

function oracleRolls(options: {
  attacker: Pokemon
  defender: Pokemon
  moveName: string
  moveId: number
  attackerId: number
  defenderId: number
  attackerAbilityId?: number
  defenderAbilityId?: number
}) {
  const move = getMoveById(options.moveId)
  if (!move || (move.category !== "physical" && move.category !== "special") || move.power === null) {
    throw new Error("Expected fixed-power damaging move")
  }
  const offense = move.category === "physical" ? options.attacker.rawStats.atk : options.attacker.rawStats.spa
  const defense = move.category === "physical" ? options.defender.rawStats.def : options.defender.rawStats.spd
  const outcome = calculable({
    snapshot: {
      ...TACKLE,
      id: `oracle-${options.moveId}`,
      moveId: options.moveId,
      power: move.power,
      accuracy: move.accuracy ?? 100,
      spreadEligible: move.isSpread,
      spread: false,
    },
    attackerId: options.attackerId,
    defenderId: options.defenderId,
    attackerAbilityId: options.attackerAbilityId ?? NO_ABILITY_ID,
    defenderAbilityId: options.defenderAbilityId ?? NO_ABILITY_ID,
    lowOutcome: { offense, defense: { hp: options.defender.maxHP(), def: defense } },
  })
  const actual = evaluateExecutionPoint(outcome)
  const field = new Field()
  expect([actual.normal!.min, actual.normal!.max]).toEqual(
    calculate(CALC_GEN, options.attacker, options.defender, new Move(CALC_GEN, options.moveName), field).range(),
  )
  expect([actual.critical!.min, actual.critical!.max]).toEqual(
    calculate(CALC_GEN, options.attacker, options.defender, new Move(CALC_GEN, options.moveName, { isCrit: true }), field).range(),
  )
}

describe("execution references and deliberate differences", () => {
  it("matches representative Ability normal/critical references", () => {
    oracleRolls({
      attacker: new Pokemon(CALC_GEN, "Azumarill", { level: VGC_LEVEL, ability: "Huge Power", nature: "Adamant", evs: { atk: 252 } }),
      defender: new Pokemon(CALC_GEN, "Snorlax", { level: VGC_LEVEL, nature: "Impish", evs: { hp: 252, def: 252 } }),
      moveName: "Aqua Jet",
      moveId: 453,
      attackerId: 184,
      defenderId: 143,
      attackerAbilityId: HUGE_POWER_ABILITY_ID,
    })
    oracleRolls({
      attacker: new Pokemon(CALC_GEN, "Blastoise", { level: VGC_LEVEL, ability: "Mega Launcher", nature: "Modest", evs: { spa: 252 } }),
      defender: new Pokemon(CALC_GEN, "Snorlax", { level: VGC_LEVEL, nature: "Careful", evs: { hp: 252, spd: 252 } }),
      moveName: "Aura Sphere",
      moveId: 396,
      attackerId: 9,
      defenderId: 143,
      attackerAbilityId: MEGA_LAUNCHER_ABILITY_ID,
    })
    oracleRolls({
      attacker: new Pokemon(CALC_GEN, "Blastoise", { level: VGC_LEVEL, nature: "Modest", evs: { spa: 252 } }),
      defender: new Pokemon(CALC_GEN, "Rhyperior", { level: VGC_LEVEL, ability: "Solid Rock", nature: "Careful", evs: { hp: 252, spd: 252 } }),
      moveName: "Water Pulse",
      moveId: 352,
      attackerId: 9,
      defenderId: 464,
      defenderAbilityId: SOLID_ROCK_ABILITY_ID,
    })
    oracleRolls({
      attacker: new Pokemon(CALC_GEN, "Durant", { level: VGC_LEVEL, ability: "Hustle", nature: "Adamant", evs: { atk: 252 } }),
      defender: new Pokemon(CALC_GEN, "Snorlax", { level: VGC_LEVEL, nature: "Impish", evs: { hp: 252, def: 252 } }),
      moveName: "X-Scissor",
      moveId: 404,
      attackerId: 632,
      defenderId: 143,
      attackerAbilityId: HUSTLE_ABILITY_ID,
    })
    oracleRolls({
      attacker: new Pokemon(CALC_GEN, "Kingdra", { level: VGC_LEVEL, ability: "Sniper", nature: "Modest", evs: { spa: 252 } }),
      defender: new Pokemon(CALC_GEN, "Snorlax", { level: VGC_LEVEL, nature: "Careful", evs: { hp: 252, spd: 252 } }),
      moveName: "Dragon Pulse",
      moveId: 406,
      attackerId: 230,
      defenderId: 143,
      attackerAbilityId: SNIPER_ABILITY_ID,
    })
  })

  it("keeps calc-missing Fire Mane inert and unsupported", () => {
    const outcome = calculable({
      snapshot: { ...TACKLE, id: "fire-mane", moveId: 53, power: 90 },
      attackerAbilityId: FIRE_MANE_ABILITY_ID,
      lowOutcome: { offense: 120, defense: { hp: 200, def: 100 } },
    })
    expect(FIRE_MANE_ABILITY_ID).toBe(313)
    expect(normal(outcome).attackModifier).toBe(N)
    expect(outcome.sources).toContainEqual({
      track: "attacker-ability",
      optionId: String(FIRE_MANE_ABILITY_ID),
      state: "unsupported",
    })
    const neutral = calculable({
      snapshot: { ...TACKLE, id: "fire-mane-neutral", moveId: 53, power: 90 },
      attackerAbilityId: NO_ABILITY_ID,
      lowOutcome: { offense: 120, defense: { hp: 200, def: 100 } },
    })
    expect(evaluateExecutionPoint(outcome)).toEqual(
      evaluateExecutionPoint(neutral),
    )
  })
})
