import { beforeAll, describe, expect, it } from "vitest"

import {
  ANALYTIC_ABILITY_ID,
  BLAZE_ABILITY_ID,
  FLARE_BOOST_ABILITY_ID,
  GUTS_ABILITY_ID,
  MARVEL_SCALE_ABILITY_ID,
  MERCILESS_ABILITY_ID,
  MINUS_ABILITY_ID,
  MULTISCALE_ABILITY_ID,
  NO_ABILITY_ID,
  OVERGROW_ABILITY_ID,
  PLUS_ABILITY_ID,
  SHADOW_SHIELD_ABILITY_ID,
  SWARM_ABILITY_ID,
  TERA_SHELL_ABILITY_ID,
  TORRENT_ABILITY_ID,
  TOXIC_BOOST_ABILITY_ID,
} from "@/lib/ability"
import { type MoveSnapshot } from "@/lib/move"
import { listResources } from "@/lib/resources"

import {
  evaluateExecutionPoint,
  compileScenario,
  type CalculableScenario,
  type RawScenario,
} from "./index"

const TACKLE: MoveSnapshot = {
  id: "assumed-tackle",
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
  if (outcome.kind !== "calculable") throw new Error(`Expected calculable: ${outcome.reason}`)
  return outcome
}

function maxNormal(overrides: Partial<RawScenario> = {}): number {
  const execution = evaluateExecutionPoint(calculable(overrides)).normal
  if (!execution) throw new Error("Expected normal damage")
  return execution.max
}

beforeAll(async () => {
  await Promise.all([
    listResources("pokemon", "en"),
    listResources("move", "en"),
    listResources("ability", "en"),
  ])
})

describe("assumed-satisfied calc inputs", () => {
  it("translates all fifteen reviewed assumptions into native calc state", () => {
    for (const id of [PLUS_ABILITY_ID, MINUS_ABILITY_ID]) {
      expect(calculable({ attackerAbilityId: id }).calculation.low.calc.attacker.abilityOn).toBe(true)
    }
    for (const id of [OVERGROW_ABILITY_ID, BLAZE_ABILITY_ID, TORRENT_ABILITY_ID, SWARM_ABILITY_ID]) {
      const attacker = calculable({ attackerAbilityId: id }).calculation.low.calc.attacker
      expect(attacker.currentHp).toBe(Math.floor(attacker.exactStats.hp / 3))
    }
    expect(calculable({ attackerAbilityId: GUTS_ABILITY_ID })
      .calculation.low.calc.attacker.status).toBe("brn")
    expect(calculable({ defenderAbilityId: MARVEL_SCALE_ABILITY_ID })
      .calculation.low.calc.defender.status).toBe("brn")
    expect(calculable({ attackerAbilityId: TOXIC_BOOST_ABILITY_ID })
      .calculation.low.calc.attacker.status).toBe("psn")
    expect(calculable({ attackerAbilityId: FLARE_BOOST_ABILITY_ID })
      .calculation.low.calc.attacker.status).toBe("brn")
    expect(calculable({ attackerAbilityId: MERCILESS_ABILITY_ID })
      .calculation.low.calc.defender.status).toBe("psn")
    expect(calculable({ attackerAbilityId: ANALYTIC_ABILITY_ID })
      .calculation.low.calc.field.defenderIsSwitchingOut).toBe(true)
    for (const id of [MULTISCALE_ABILITY_ID, SHADOW_SHIELD_ABILITY_ID, TERA_SHELL_ABILITY_ID]) {
      expect(calculable({ defenderAbilityId: id })
        .calculation.low.calc.defender.currentHp).toBeUndefined()
    }
  })

  it.each([
    [OVERGROW_ABILITY_ID, 22, 45],
    [BLAZE_ABILITY_ID, 52, 40],
    [TORRENT_ABILITY_ID, 55, 40],
    [SWARM_ABILITY_ID, 450, 60],
  ])("activates low-HP Ability %i in calc damage", (abilityId, moveId, power) => {
    const snapshot = { ...TACKLE, id: `low-hp-${abilityId}`, moveId, power }
    expect(maxNormal({ snapshot, attackerAbilityId: abilityId }))
      .toBeGreaterThan(maxNormal({ snapshot }))
  })

  it.each([
    [GUTS_ABILITY_ID, TACKLE, "attacker"],
    [PLUS_ABILITY_ID, { ...TACKLE, id: "plus-water-gun", moveId: 55 }, "attacker"],
    [MINUS_ABILITY_ID, { ...TACKLE, id: "minus-water-gun", moveId: 55 }, "attacker"],
    [TOXIC_BOOST_ABILITY_ID, TACKLE, "attacker"],
    [FLARE_BOOST_ABILITY_ID, { ...TACKLE, id: "flare-water-gun", moveId: 55 }, "attacker"],
    [ANALYTIC_ABILITY_ID, { ...TACKLE, id: "analytic-water-gun", moveId: 55 }, "attacker"],
    [MARVEL_SCALE_ABILITY_ID, TACKLE, "defender"],
    [MULTISCALE_ABILITY_ID, TACKLE, "defender"],
    [SHADOW_SHIELD_ABILITY_ID, TACKLE, "defender"],
    [TERA_SHELL_ABILITY_ID, TACKLE, "defender"],
  ] as const)("changes calc damage for assumed Ability %i", (abilityId, snapshot, side) => {
    const ability = side === "attacker"
      ? { attackerAbilityId: abilityId }
      : { defenderAbilityId: abilityId }
    const assumed = maxNormal({ snapshot, ...ability })
    const ordinary = maxNormal({ snapshot })
    expect(side === "attacker" ? assumed > ordinary : assumed < ordinary).toBe(true)
  })

  it("makes Merciless critical without a separate poison input", () => {
    const outcome = calculable({ attackerAbilityId: MERCILESS_ABILITY_ID })
    const execution = evaluateExecutionPoint(outcome)
    expect(execution.normal).toBeUndefined()
    expect(execution.critical!.max).toBeGreaterThan(maxNormal())
  })

  it("activates Analytic on Pursuit without applying Pursuit's switching boost", () => {
    const snapshot = { ...TACKLE, id: "analytic-pursuit", moveId: 228 }
    const outcome = calculable({ snapshot, attackerAbilityId: ANALYTIC_ABILITY_ID })
    const { attacker, defender } = outcome.calculation.low.calc
    expect(outcome.calculation.low.calc.field.defenderIsSwitchingOut).toBeUndefined()
    expect(attacker.exactStats.spe).toBe(defender.exactStats.spe)
    expect(maxNormal({ snapshot, attackerAbilityId: ANALYTIC_ABILITY_ID }))
      .toBeGreaterThan(maxNormal({ snapshot }))
  })
})
