import { calculate, Field, Move, Pokemon } from "@smogon/calc"
import { beforeAll, describe, expect, it } from "vitest"

import {
  FLUFFY_ABILITY_ID,
  KLUTZ_ABILITY_ID,
  LONG_REACH_ABILITY_ID,
  NO_ABILITY_ID,
  TOUGH_CLAWS_ABILITY_ID,
} from "@/lib/ability"
import type { MoveSnapshot } from "@/lib/move"
import { listResources } from "@/lib/resources"

import {
  CALC_GEN,
  VGC_LEVEL,
  evaluateExecutionPoint,
  chainModifiers,
  compileAbilityEffect,
  compileScenario,
  NEUTRAL_MODIFIER,
  type CalculableScenario,
  type RawScenario,
} from "./index"

const N = NEUTRAL_MODIFIER

const TACKLE: MoveSnapshot = {
  id: "contact-tackle",
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
    defenderId: 831,
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

function sourceState(
  outcome: CalculableScenario,
  track: "attacker-ability" | "defender-ability" | "held-item" | "defender-held-item",
) {
  return outcome.sources.find((source) => source.track === track)?.state
}

beforeAll(async () => {
  await Promise.all([
    listResources("pokemon", "en"),
    listResources("move", "en"),
    listResources("ability", "en"),
  ])
})

describe("Fluffy and Long Reach", () => {
  const base = {
    attackerAbilityId: NO_ABILITY_ID,
    defenderAbilityId: NO_ABILITY_ID,
    category: "physical" as const,
    moveType: "normal" as const,
    power: 80,
    moveFlags: ["contact"] as string[],
    effectiveness: 1,
    weather: "none" as const,
    hasStab: false,
  }

  it("applies contact, fire, and dual Fluffy facets with Long Reach cancellation", () => {
    const contact = compileAbilityEffect({
      ...base,
      defenderAbilityId: FLUFFY_ABILITY_ID,
    })
    expect(contact.defenderState).toBe("active")
    expect(contact.finalModifier).toBe(2048)

    const fire = compileAbilityEffect({
      ...base,
      moveFlags: [],
      moveType: "fire",
      defenderAbilityId: FLUFFY_ABILITY_ID,
    })
    expect(fire.defenderState).toBe("active")
    expect(fire.finalModifier).toBe(8192)

    const both = compileAbilityEffect({
      ...base,
      moveType: "fire",
      defenderAbilityId: FLUFFY_ABILITY_ID,
    })
    expect(both.defenderState).toBe("active")
    expect(both.finalModifier).toBe(chainModifiers([2048, 8192]))

    const blocked = compileAbilityEffect({
      ...base,
      moveType: "fire",
      attackerAbilityId: LONG_REACH_ABILITY_ID,
      defenderAbilityId: FLUFFY_ABILITY_ID,
    })
    expect(blocked.attackerState).toBe("active")
    expect(blocked.defenderState).toBe("active")
    expect(blocked.finalModifier).toBe(8192)

    const blockedContactOnly = compileAbilityEffect({
      ...base,
      attackerAbilityId: LONG_REACH_ABILITY_ID,
      defenderAbilityId: FLUFFY_ABILITY_ID,
    })
    expect(blockedContactOnly.attackerState).toBe("active")
    expect(blockedContactOnly.defenderState).toBe("inactive")
    expect(blockedContactOnly.finalModifier).toBe(N)
  })

  it("keeps wrong-side and miss gates inactive without unsupported", () => {
    expect(compileAbilityEffect({
      ...base,
      moveFlags: [],
      moveType: "water",
      defenderAbilityId: FLUFFY_ABILITY_ID,
    }).defenderState).toBe("inactive")

    expect(compileAbilityEffect({
      ...base,
      attackerAbilityId: FLUFFY_ABILITY_ID,
    }).attackerState).toBe("inactive")

    expect(compileAbilityEffect({
      ...base,
      defenderAbilityId: LONG_REACH_ABILITY_ID,
    }).defenderState).toBe("inactive")

    expect(compileAbilityEffect({
      ...base,
      attackerAbilityId: LONG_REACH_ABILITY_ID,
    }).attackerState).toBe("inactive")

    const outcome = calculable({
      attackerAbilityId: FLUFFY_ABILITY_ID,
      defenderAbilityId: LONG_REACH_ABILITY_ID,
    })
    expect(sourceState(outcome, "attacker-ability")).toBe("inactive")
    expect(sourceState(outcome, "defender-ability")).toBe("inactive")
  })

  it("does not rewrite Tough Claws or Move Snapshot via Long Reach", () => {
    const outcome = calculable({
      snapshot: { ...TACKLE, id: "long-reach-claws", moveId: 33, power: 40 },
      attackerAbilityId: TOUGH_CLAWS_ABILITY_ID,
      defenderAbilityId: FLUFFY_ABILITY_ID,
    })
    expect(normal(outcome).basePowerModifier).toBe(5325)
    expect(normal(outcome).finalModifier).toBe(2048)

    const longReach = calculable({
      attackerAbilityId: LONG_REACH_ABILITY_ID,
      defenderAbilityId: FLUFFY_ABILITY_ID,
    })
    expect(normal(longReach).basePowerModifier).toBe(N)
    expect(normal(longReach).finalModifier).toBe(N)
  })

  it("matches @smogon/calc Fluffy contact, fire, dual, and Long Reach cases", () => {
    const fluffy = {
      level: VGC_LEVEL,
      ability: "Fluffy" as const,
      nature: "Impish" as const,
      evs: { hp: 252, def: 252 },
    }
    const machamp = new Pokemon(CALC_GEN, "Machamp", {
      level: VGC_LEVEL,
      nature: "Adamant",
      evs: { atk: 252 },
    })
    const decidueye = new Pokemon(CALC_GEN, "Decidueye", {
      level: VGC_LEVEL,
      ability: "Long Reach",
      nature: "Adamant",
      evs: { atk: 252 },
    })
    const charizard = new Pokemon(CALC_GEN, "Charizard", {
      level: VGC_LEVEL,
      nature: "Modest",
      evs: { spa: 252 },
    })
    const defender = new Pokemon(CALC_GEN, "Dubwool", fluffy)
    const field = new Field()

    const bodySlam = calculable({
      snapshot: { ...TACKLE, id: "body-slam", moveId: 34, power: 85 },
      attackerId: 68,
      defenderId: 831,
      defenderAbilityId: FLUFFY_ABILITY_ID,
      lowOutcome: {
        offense: machamp.rawStats.atk,
        defense: { hp: defender.maxHP(), def: defender.rawStats.def },
      },
    })
    const bodySlamDamage = evaluateExecutionPoint(bodySlam).normal!
    expect([bodySlamDamage.min, bodySlamDamage.max]).toEqual(
      calculate(CALC_GEN, machamp, defender, new Move(CALC_GEN, "Body Slam"), field).range(),
    )

    const flamethrower = calculable({
      snapshot: { ...TACKLE, id: "flamethrower", moveId: 53, power: 90 },
      attackerId: 6,
      defenderId: 831,
      defenderAbilityId: FLUFFY_ABILITY_ID,
      lowOutcome: {
        offense: charizard.rawStats.spa,
        defense: { hp: defender.maxHP(), def: defender.rawStats.spd },
      },
    })
    const flamethrowerDamage = evaluateExecutionPoint(flamethrower).normal!
    expect([flamethrowerDamage.min, flamethrowerDamage.max]).toEqual(
      calculate(CALC_GEN, charizard, defender, new Move(CALC_GEN, "Flamethrower"), field).range(),
    )

    const firePunch = calculable({
      snapshot: { ...TACKLE, id: "fire-punch", moveId: 7, power: 75 },
      attackerId: 68,
      defenderId: 831,
      defenderAbilityId: FLUFFY_ABILITY_ID,
      lowOutcome: {
        offense: machamp.rawStats.atk,
        defense: { hp: defender.maxHP(), def: defender.rawStats.def },
      },
    })
    const firePunchDamage = evaluateExecutionPoint(firePunch).normal!
    expect([firePunchDamage.min, firePunchDamage.max]).toEqual(
      calculate(CALC_GEN, machamp, defender, new Move(CALC_GEN, "Fire Punch"), field).range(),
    )

    const longReachBodySlam = calculable({
      snapshot: { ...TACKLE, id: "lr-body-slam", moveId: 34, power: 85 },
      attackerId: 724,
      defenderId: 831,
      attackerAbilityId: LONG_REACH_ABILITY_ID,
      defenderAbilityId: FLUFFY_ABILITY_ID,
      lowOutcome: {
        offense: decidueye.rawStats.atk,
        defense: { hp: defender.maxHP(), def: defender.rawStats.def },
      },
    })
    expect(sourceState(longReachBodySlam, "attacker-ability")).toBe("active")
    const longReachBodySlamDamage = evaluateExecutionPoint(longReachBodySlam).normal!
    expect([longReachBodySlamDamage.min, longReachBodySlamDamage.max]).toEqual(
      calculate(CALC_GEN, decidueye, defender, new Move(CALC_GEN, "Body Slam"), field).range(),
    )
  })
})

describe("Klutz", () => {
  it("suppresses attacker and defender ordinary-hit item hooks when they would be active", () => {
    const lifeOrb = calculable({
      attackerItemId: 247,
      attackerAbilityId: KLUTZ_ABILITY_ID,
    })
    expect(normal(lifeOrb).finalModifier).toBe(N)
    expect(sourceState(lifeOrb, "attacker-ability")).toBe("active")
    expect(sourceState(lifeOrb, "held-item")).toBe("inactive")

    const berry = calculable({
      defenderItemId: 177,
      defenderAbilityId: KLUTZ_ABILITY_ID,
    })
    expect(normal(berry).finalModifier).toBe(N)
    expect(sourceState(berry, "defender-ability")).toBe("active")
    expect(sourceState(berry, "defender-held-item")).toBe("inactive")
  })

  it("stays inactive for none, Mega, and miss gates", () => {
    expect(sourceState(
      calculable({ attackerAbilityId: KLUTZ_ABILITY_ID, attackerItemId: "none" }),
      "attacker-ability",
    )).toBe("inactive")

    expect(sourceState(
      calculable({ attackerAbilityId: KLUTZ_ABILITY_ID, attackerItemId: 699 }),
      "attacker-ability",
    )).toBe("inactive")

    expect(sourceState(
      calculable({
        snapshot: { ...TACKLE, id: "water-gun", moveId: 55, power: 40 },
        attackerItemId: 216,
        attackerAbilityId: KLUTZ_ABILITY_ID,
      }),
      "attacker-ability",
    )).toBe("inactive")
    expect(sourceState(
      calculable({
        snapshot: { ...TACKLE, id: "water-gun-item", moveId: 55, power: 40 },
        attackerItemId: 216,
      }),
      "held-item",
    )).toBe("inactive")
  })

  it("suppresses Utility Umbrella weather suppression and Wide Lens in battle-odds", () => {
    const umbrella = calculable({
      snapshot: { ...TACKLE, id: "ember-umbrella", moveId: 52, power: 40 },
      defenderItemId: 1181,
      defenderAbilityId: KLUTZ_ABILITY_ID,
      weather: "sun",
    })
    expect(normal(umbrella).weatherModifier).toBe(6144)
    expect(sourceState(umbrella, "defender-ability")).toBe("active")
    expect(sourceState(umbrella, "defender-held-item")).toBe("inactive")

    const withoutKlutz = calculable({
      snapshot: { ...TACKLE, id: "ember-umbrella-on", moveId: 52, power: 40 },
      defenderItemId: 1181,
      weather: "sun",
    })
    expect(normal(withoutKlutz).weatherModifier).toBe(N)
    expect(sourceState(withoutKlutz, "defender-held-item")).toBe("active")

    const wideLens = calculable({
      snapshot: { ...TACKLE, id: "wide-lens", accuracy: 90 },
      attackerItemId: 242,
      attackerAbilityId: KLUTZ_ABILITY_ID,
      probabilityMode: "battle-odds",
    })
    expect(sourceState(wideLens, "attacker-ability")).toBe("active")
    expect(sourceState(wideLens, "held-item")).toBe("inactive")
  })
})
