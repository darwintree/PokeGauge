import { calculate, Field, Move, Pokemon } from "@smogon/calc"
import { beforeAll, describe, expect, it } from "vitest"

import type { MoveCategory } from "@/lib/catalog"
import { createMoveSnapshot } from "@/lib/move"
import { EELEVATE_ABILITY_ID, LEVITATE_ABILITY_ID } from "@/lib/ability"
import { getMoveById, listResources } from "@/lib/resources"

import { CALC_GEN, VGC_LEVEL } from "@/lib/damage-calculation"
import { calculateDamageRolls, chainModifiers } from "@/lib/damage-calculation"
import { defenderStatValues, offenseStatValue } from "@/lib/stat-calculation"
import { getAttackerStatSetups, getDefenderSetups } from "@/lib/stat-calculation"
import {
  compileScenario,
  type CalculableScenario,
  type RawScenario,
} from "@/lib/damage-calculation"
import {
  compileTerrainEffect,
  isGrounded,
  TERRAINS,
  type Terrain,
} from "@/lib/damage-calculation"

const ATTACKER = { id: 196, name: "Espeon" } as const
const DEFENDER = { id: 143, name: "Snorlax" } as const

function rawScenario(
  moveId: number,
  terrain: Terrain,
  overrides: Partial<RawScenario> = {},
): RawScenario {
  const move = getMoveById(moveId)
  if (!move || move.category === "status" || move.power === null) {
    throw new Error(`Move ${moveId} cannot make a terrain test scenario`)
  }
  const category: MoveCategory = move.category
  const offense = getAttackerStatSetups(category)["neutral-max"]
  const defense = getDefenderSetups(category)["standard-bulk"]
  return {
    snapshot: createMoveSnapshot(
      { ...move, power: move.power },
      `terrain-${moveId}`,
    ),
    attackerId: ATTACKER.id,
    defenderId: DEFENDER.id,
    attackerItemId: "none",
    attackerAbilityId: 28,
    defenderAbilityId: 17,
    attackerStage: 0,
    defenderStage: 0,
    weather: "none",
    terrain,
    screen: "none",
    probabilityMode: "classic",
    lowOutcome: {
      offense: offenseStatValue(ATTACKER.name, category, offense),
      defense: defenderStatValues(DEFENDER.name, category, defense),
    },
    ...overrides,
  }
}

function calculable(
  moveId: number,
  terrain: Terrain,
  overrides: Partial<RawScenario> = {},
): CalculableScenario {
  const outcome = compileScenario(rawScenario(moveId, terrain, overrides))
  if (outcome.kind !== "calculable") {
    throw new Error(`Expected calculable, got ${outcome.reason}`)
  }
  return outcome
}

beforeAll(async () => {
  await Promise.all([
    listResources("pokemon", "en"),
    listResources("move", "en"),
  ])
})

describe("terrain compiler", () => {
  it("publishes the five product values and derives grounding from current inputs", () => {
    expect(TERRAINS).toEqual([
      "none",
      "electric",
      "grassy",
      "psychic",
      "misty",
    ])
    expect(isGrounded(["psychic"], 28)).toBe(true)
    expect(isGrounded(["flying", "electric"], 46)).toBe(false)
    expect(isGrounded(["electric"], LEVITATE_ABILITY_ID)).toBe(false)
    expect(isGrounded(["electric"], EELEVATE_ABILITY_ID)).toBe(false)
  })

  it.each([
    [85, "electric", "electric", true, true, 5325],
    [412, "grassy", "grass", true, true, 5325],
    [94, "psychic", "psychic", true, true, 5325],
    [337, "misty", "dragon", true, true, 2048],
    [89, "grassy", "ground", true, true, 2048],
    [804, "electric", "electric", true, true, chainModifiers([8192, 5325])],
    [875, "electric", "psychic", true, true, 6144],
    [797, "psychic", "psychic", true, true, chainModifiers([6144, 5325])],
    [802, "misty", "fairy", true, true, 6144],
  ] as const)(
    "compiles move %i in %s terrain",
    (moveId, terrain, moveType, attackerGrounded, defenderGrounded, modifier) => {
      expect(
        compileTerrainEffect(
          moveId,
          moveType,
          terrain,
          attackerGrounded,
          defenderGrounded,
        ).basePowerModifier,
      ).toBe(modifier)
    },
  )

  it("keeps terrain effects off airborne participants", () => {
    expect(
      compileTerrainEffect(85, "electric", "electric", false, true),
    ).toMatchObject({ basePowerModifier: 4096, state: "inactive" })
    expect(
      compileTerrainEffect(337, "dragon", "misty", true, false),
    ).toMatchObject({ basePowerModifier: 4096, state: "inactive" })
  })

  it("handles terrain-gated and terrain-type-changing moves explicitly", () => {
    expect(compileScenario(rawScenario(798, "none"))).toMatchObject({
      kind: "unavailable",
      reason: "terrain-required",
    })
    expect(compileScenario(rawScenario(805, "electric"))).toMatchObject({
      kind: "unavailable",
      reason: "terrain-type-change",
    })
    expect(compileScenario(rawScenario(805, "none"))).toMatchObject({
      kind: "calculable",
    })
  })

  it.each([
    [94, "Psychic", "Psychic", false],
    [797, "Expanding Force", "Psychic", true],
  ] as const)(
    "matches @smogon/calc rolls for %s in %s Terrain",
    (moveId, moveName, calcTerrain, spread) => {
      const outcome = calculable(moveId, "psychic")
      const offense = getAttackerStatSetups("special")["neutral-max"]
      const defense = getDefenderSetups("special")["standard-bulk"]
      const attacker = new Pokemon(CALC_GEN, ATTACKER.name, {
        level: VGC_LEVEL,
        nature: offense.nature,
        evs: offense.evs,
      })
      const defender = new Pokemon(CALC_GEN, DEFENDER.name, {
        level: VGC_LEVEL,
        nature: defense.nature,
        evs: defense.evs,
      })
      const field = new Field({
        gameType: "Doubles",
        terrain: calcTerrain,
      })
      const move = new Move(CALC_GEN, moveName)

      expect(outcome.calculation.low.normal?.spreadModifier).toBe(
        spread ? 3072 : 4096,
      )
      expect(calculateDamageRolls(outcome.calculation).low.normal).toEqual(
        calculate(CALC_GEN, attacker, defender, move, field).damage,
      )
    },
  )
})
