import { beforeAll, describe, expect, it } from "vitest"

import { abilitySupport } from "@/lib/ability"
import { getCatalogShell } from "@/lib/catalog"
import { projectAbilitySelections } from "@/lib/scenario/ability-projection"
import { defaultTrackState } from "@/lib/scenario/state"
import type { CalculationRules } from "@/lib/calculation-rules"
import { listResources } from "@/lib/resources"
import { calculateHitMatrix } from "./calc-engine"
import { compileScenario, type CalculableScenario, type RawScenario } from "./scenario-compiler"

beforeAll(async () => {
  await Promise.all([listResources("pokemon", "en"), listResources("move", "en"), listResources("ability", "en")])
})

function input(overrides: Partial<RawScenario> = {}): RawScenario {
  return {
    rules: "champions",
    snapshot: { id: "rules", moveId: 33, power: 40, accuracy: 100, alwaysHits: false, criticalStage: 0, spread: false, spreadEligible: false },
    attackerId: 133, defenderId: 831,
    attackerItemId: "none", defenderItemId: "none",
    attackerAbilityId: -1, defenderAbilityId: -1,
    attackerStage: 0, defenderStage: 0,
    weather: "none", terrain: "none", screen: "none", probabilityMode: "classic",
    lowOutcome: { offense: 100, defense: { hp: 200, def: 100 } },
    ...overrides,
  }
}

function scenario(raw: RawScenario): CalculableScenario {
  const result = compileScenario(raw)
  if (result.kind !== "calculable") throw new Error(result.reason)
  return result
}

function rolls(result: CalculableScenario): readonly number[] {
  return calculateHitMatrix(result.calculation.low.calc, result.execution.powers.length, false, false, Boolean(result.berry)).rolls[0]
}

describe.each<CalculationRules>(["champions", "gen9"])("%s rules", (rules) => {
  it.each([
    [226, "electric", 85, 90],
    [227, "psychic", 94, 90],
    [228, "misty", 337, 80],
    [229, "grassy", 412, 90],
  ] as const)("supports terrain setter %i through explicit field inputs", async (abilityId, terrain, moveId, power) => {
    const defaults = defaultTrackState(await getCatalogShell(133, 831, "en", "physical"))
    for (const side of ["attacker", "defender"] as const) {
      const selected = {
        ...defaults,
        attackerAbilityIds: [side === "attacker" ? abilityId : -1],
        defenderAbilityIds: [side === "defender" ? abilityId : -1],
      }
      const projected = projectAbilitySelections(selected, "physical")
      expect(projected.terrains).toEqual([terrain])
      expect(abilitySupport(abilityId, rules)).toBe("supported")
      const raw = input({
        rules, terrain: projected.terrains[0],
        attackerAbilityId: selected.attackerAbilityIds[0],
        defenderAbilityId: selected.defenderAbilityIds[0],
      })
      raw.snapshot = { ...raw.snapshot, moveId, power }
      const result = scenario(raw)
      expect(result.sources).toContainEqual({ track: `${side}-ability`, optionId: String(abilityId), state: "neutral" })
      expect(result.sources).toContainEqual({ track: "terrain", optionId: terrain, state: "active" })
      const explicitField = { ...raw, attackerAbilityId: -1, defenderAbilityId: -1 }
      expect(rolls(result)).toEqual(rolls(scenario(explicitField)))
      expect(rolls(result)).not.toEqual(rolls(scenario({ ...explicitField, terrain: "none" })))
      expect(result.support).toBe(terrain === "grassy" ? "semi-supported" : "supported")

      const manual = projectAbilitySelections({ ...selected, terrains: ["none"] }, "physical", { terrain: true })
      expect(manual.terrains).toEqual(["none"])
      expect(manual.terrainPool).toContain(terrain)
    }
  })

  it("feeds exact stats through clones and returns known neutral rolls", () => {
    // L50, 40 BP, 100/100 offense/defense, STAB: 22*40/50 + 2 = 19 before random and STAB.
    const result = scenario(input({ rules }))
    expect(rolls(result)).toEqual([24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 27, 27, 27, 27, 27, 28])
    expect(result.calculation.low.defenderHp).toBe(200)
  })

  it("supports Dragonize, including type, power and damage", () => {
    const raw = input({ rules, attackerId: 147, attackerAbilityId: 309 })
    const result = scenario(raw)
    expect(result.move.type).toBe("dragon")
    expect(result.calculation.low.normal?.basePowerModifier).toBe(4915)
    expect(rolls(result).at(-1)).toBe(34)
    expect(result.sources).toContainEqual({ track: "attacker-ability", optionId: "309", state: "active" })
  })

  it("supports Eelevate immunity and Fire Mane damage", () => {
    const raw = input({ rules, defenderAbilityId: 312 })
    raw.snapshot = { ...raw.snapshot, moveId: 89, power: 100 }
    expect(rolls(scenario(raw))).toEqual(Array(16).fill(0))
    raw.defenderAbilityId = -1
    raw.attackerAbilityId = 313
    raw.snapshot = { ...raw.snapshot, moveId: 52, power: 40 }
    const result = scenario(raw)
    expect(result.calculation.low.normal?.attackModifier).toBe(6144)
    expect(rolls(result).at(-1)).toBe(28)
  })

  it("applies Mega Sol only to the move user", () => {
    const raw = input({ rules, weather: "rain", attackerAbilityId: 310 })
    raw.snapshot = { ...raw.snapshot, moveId: 52, power: 40 }
    const result = scenario(raw)
    expect(result.calculation.low.normal?.weatherModifier).toBe(6144)
    expect(rolls(result).at(-1)).toBe(28)
    const defenderOnly = scenario({ ...raw, attackerAbilityId: -1, defenderAbilityId: 310 })
    expect(rolls(defenderOnly).at(-1)).toBe(9)
  })

  it("applies Aura Guard to contact without Fluffy's fire weakness", () => {
    const raw = input({ rules, defenderAbilityId: 314 })
    raw.snapshot = { ...raw.snapshot, moveId: 7, power: 75 }
    const result = scenario(raw)
    expect(result.calculation.low.normal?.finalModifier).toBe(2048)
    expect(rolls(result).at(-1)).toBeLessThan(rolls(scenario({ ...raw, defenderAbilityId: -1 })).at(-1)!)
  })
})

it("changes item support without changing the selected configuration", () => {
  const raw = input({ attackerItemId: 274 })
  raw.snapshot = { ...raw.snapshot, moveId: 52, power: 40 }
  const saved = structuredClone(raw)
  const champions = scenario(raw)
  const gen9 = scenario({ ...raw, rules: "gen9" })
  expect(champions.sources).toContainEqual({ track: "held-item", optionId: "274", state: "unsupported" })
  expect(gen9.sources).toContainEqual({ track: "held-item", optionId: "274", state: "active" })
  expect(rolls(champions)).toEqual(rolls(scenario({ ...raw, attackerItemId: "none" })))
  expect(rolls(gen9).at(-1)).toBeGreaterThan(rolls(champions).at(-1)!)
  expect(raw).toEqual(saved)
})

it("supports verified out-of-roster plates, probability items and Air Lock", () => {
  const raw = input({ attackerItemId: 275, attackerAbilityId: 76, weather: "rain" })
  raw.snapshot = { ...raw.snapshot, moveId: 52, power: 40 }
  const result = scenario(raw)
  expect(result.calculation.low.normal?.basePowerModifier).toBe(4915)
  expect(result.sources).toContainEqual({ track: "held-item", optionId: "275", state: "active" })
  expect(rolls(result).at(-1)).toBe(23)
  expect(abilitySupport(76, "champions")).toBe("supported")
  const critical = scenario({ ...input(), attackerItemId: 303, probabilityMode: "battle-odds" })
  expect(critical.probability.criticalHitProbability).toBe(1 / 8)
})

it.each([114, 231, 305])("omits unsupported ability %i from every Champions calculation path", (id) => {
  const raw = input({ defenderAbilityId: id, terrain: "electric" })
  const result = scenario(raw)
  expect(result.sources).toContainEqual({ track: "defender-ability", optionId: String(id), state: "unsupported" })
  expect(rolls(result)).toEqual(rolls(scenario({ ...raw, defenderAbilityId: -1 })))
  expect(result.calculation.low.normal).toEqual(scenario({ ...raw, defenderAbilityId: -1 }).calculation.low.normal)
})

it("keeps a selected move unavailable where its mechanic is missing", () => {
  const raw = input()
  raw.snapshot = { ...raw.snapshot, moveId: 876, power: 80 }
  expect(compileScenario(raw)).toMatchObject({ kind: "unavailable", reason: "unsupported-move" })
  expect(compileScenario({ ...raw, rules: "gen9" }).kind).toBe("calculable")
})

it("uses Champions native hit powers while retaining the saved snapshot", () => {
  const raw = input()
  raw.snapshot = { ...raw.snapshot, moveId: 544, power: 50 }
  const champions = scenario(raw)
  const gen9 = scenario({ ...raw, rules: "gen9" })
  expect(champions.execution.powers).toEqual([60, 60])
  expect(gen9.execution.powers).toEqual([50, 50])
  expect(rolls(champions).at(-1)).toBeGreaterThan(rolls(gen9).at(-1)!)
  expect(raw.snapshot.power).toBe(50)
})


it("uses Mega Sol sunshine for move accuracy", () => {
  const raw = input({ attackerAbilityId: 310, weather: "rain", probabilityMode: "battle-odds" })
  raw.snapshot = { ...raw.snapshot, moveId: 87, power: 110, accuracy: 70 }
  const result = scenario(raw)
  expect(result.probability.hitProbability).toBe(0.5)
})

it("uses the selected rules for Snap Trap's type", () => {
  const raw = input()
  raw.snapshot = { ...raw.snapshot, moveId: 779, power: 35 }
  expect(scenario(raw).move.type).toBe("steel")
  expect(scenario({ ...raw, rules: "gen9" }).move.type).toBe("grass")
})
