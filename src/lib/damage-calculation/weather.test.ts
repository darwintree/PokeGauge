import { calculate, Field, Move, Pokemon } from "@smogon/calc"
import { beforeAll, describe, expect, it, vi } from "vitest"

import {
  CLOUD_NINE_ABILITY_ID,
  FLASH_FIRE_ABILITY_ID,
  NORMALIZE_ABILITY_ID,
  PIXILATE_ABILITY_ID,
  SAND_FORCE_ABILITY_ID,
} from "@/lib/ability"
import { getCatalogShell, type MoveCategory } from "@/lib/catalog"
import {
  CALC_GEN,
  VGC_LEVEL,
  compileScenario,
  NEUTRAL_MODIFIER,
  type CalculableScenario,
  type RawScenario,
} from "@/lib/damage-calculation"
import * as damageKernel from "@/lib/damage-calculation"
import { createMoveSnapshot, type MoveSnapshot } from "@/lib/move"
import { getMoveById, listResources } from "@/lib/resources"
import {
  defaultTrackState,
  expectedRowCount,
  runScenarioPipeline,
} from "@/lib/scenario"
import { defenderStatValues, offenseStatValue } from "@/lib/stat-calculation"
import { getAttackerStatSetups, getDefenderSetups } from "@/lib/stat-calculation"
import { WEATHERS, type Weather } from "."

const ATTACKER = {
  physical: { id: 445, name: "Garchomp" },
  special: { id: 6, name: "Charizard" },
} as const
const DEFENDER = { id: 143, name: "Snorlax" } as const

function moveSnapshot(
  moveId: number,
  overrides: Partial<MoveSnapshot> = {},
): MoveSnapshot {
  const move = getMoveById(moveId)
  if (!move || move.category === "status" || move.power === null) {
    throw new Error(`Move ${moveId} cannot make a weather test snapshot`)
  }
  return {
    id: `weather-${moveId}`,
    moveId,
    power: move.power,
    accuracy: move.accuracy ?? 0,
    alwaysHits: false,
    criticalStage: 0,
    spreadEligible: move.isSpread,
    spread: false,
    ...overrides,
  }
}

function rawScenario(
  moveId: number,
  weather: Weather,
  overrides: Partial<RawScenario> = {},
): RawScenario {
  const move = getMoveById(moveId)
  if (!move || move.category === "status") {
    throw new Error(`Move ${moveId} cannot make a weather test scenario`)
  }
  const category = move.category
  const offense = getAttackerStatSetups(category)["neutral-max"]
  const defense = getDefenderSetups(category)["standard-bulk"]
  return {
    snapshot: moveSnapshot(moveId),
    attackerId: ATTACKER[category].id,
    defenderId: DEFENDER.id,
    attackerItemId: "none",
    attackerAbilityId: 1,
    defenderAbilityId: 1,
    attackerStage: 0,
    defenderStage: 0,
    weather,
    terrain: "none",
    screen: "none",
    probabilityMode: "battle-odds",
    lowOutcome: {
      offense: offenseStatValue(ATTACKER[category].name, category, offense),
      defense: defenderStatValues(DEFENDER.name, category, defense),
    },
    ...overrides,
  }
}

function calculable(
  moveId: number,
  weather: Weather,
  overrides: Partial<RawScenario> = {},
): CalculableScenario {
  const outcome = compileScenario(rawScenario(moveId, weather, overrides))
  if (outcome.kind !== "calculable") {
    throw new Error(`Expected calculable, got ${outcome.reason}`)
  }
  return outcome
}

function normalBranch(outcome: CalculableScenario) {
  const branch = outcome.calculation.low.normal
  if (!branch) throw new Error("Expected a normal damage branch")
  return branch
}

function weatherSource(outcome: CalculableScenario) {
  return outcome.sources.find((source) => source.track === "weather")
}

beforeAll(async () => {
  await Promise.all([
    listResources("pokemon", "en"),
    listResources("move", "en"),
  ])
})

describe("reviewed weather compiler", () => {
  it("publishes the five product weather values", () => {
    expect(WEATHERS).toEqual(["none", "sun", "rain", "sand", "snow"])
  })

  it.each([
    [53, "sun", 6144],
    [53, "rain", 2048],
    [56, "sun", 2048],
    [56, "rain", 6144],
    [53, "sand", 4096],
    [56, "snow", 4096],
  ] as const)(
    "applies generic weather damage for move %i in %s",
    (moveId, weather, expectedModifier) => {
      const outcome = calculable(moveId, weather)

      expect(normalBranch(outcome).weatherModifier).toBe(expectedModifier)
      expect(weatherSource(outcome)?.state).toBe(
        expectedModifier === 4096 ? "inactive" : "active",
      )
    },
  )

  it.each([
    [76, "rain", 2048],
    [76, "sand", 2048],
    [76, "snow", 2048],
    [669, "rain", 2048],
    [669, "sand", 2048],
    [669, "snow", 2048],
    [76, "sun", 4096],
    [669, "sun", 4096],
  ] as const)(
    "applies the reviewed charge-move rule for move %i in %s",
    (moveId, weather, expectedModifier) => {
      const outcome = calculable(moveId, weather)

      expect(normalBranch(outcome).basePowerModifier).toBe(expectedModifier)
      expect(weatherSource(outcome)?.state).toBe(
        expectedModifier === 4096 ? "inactive" : "active",
      )
    },
  )

  it("applies power rules to the edited snapshot power", () => {
    const outcome = calculable(669, "snow", {
      snapshot: moveSnapshot(669, { power: 201 }),
    })

    expect(normalBranch(outcome)).toMatchObject({
      power: 201,
      basePowerModifier: 2048,
    })
  })

  it.each([
    [59, "snow", 1],
    [59, "rain", 0.7],
    [87, "sun", 0.5],
    [87, "rain", 1],
    [542, "sun", 0.5],
    [542, "rain", 1],
    [846, "rain", 1],
    [847, "rain", 1],
    [848, "rain", 1],
    [831, "rain", 0.8],
  ] as const)(
    "applies the reviewed accuracy rule for move %i in %s",
    (moveId, weather, expectedProbability) => {
      const outcome = calculable(moveId, weather)

      expect(outcome.probability.hitProbability).toBe(expectedProbability)
      expect(weatherSource(outcome)?.state).toBe(
        expectedProbability === (moveSnapshot(moveId).accuracy / 100)
          ? "inactive"
          : "active",
      )
    },
  )

  it("applies weather accuracy after snapshot accuracy and always-hit edits", () => {
    const edited = moveSnapshot(87, { accuracy: 91, alwaysHits: true })

    expect(calculable(87, "none", { snapshot: edited }).probability.hitProbability).toBe(1)
    expect(calculable(87, "sun", { snapshot: edited }).probability.hitProbability).toBe(0.5)
    expect(calculable(87, "rain", { snapshot: edited }).probability.hitProbability).toBe(1)
  })

  it.each([
    ["sun", 6144],
    ["rain", 6144],
    ["sand", 4096],
    ["snow", 4096],
  ] as const)("uses Hydro Steam's reviewed damage rule in %s", (weather, expectedModifier) => {
    const outcome = calculable(876, weather)

    expect(normalBranch(outcome).weatherModifier).toBe(expectedModifier)
    expect(weatherSource(outcome)?.state).toBe(
      expectedModifier === 4096 ? "inactive" : "active",
    )
  })

  it("retains neutral no-weather provenance for display filtering", () => {
    expect(weatherSource(calculable(53, "none"))).toEqual({
      track: "weather",
      optionId: "none",
      state: "neutral",
    })
  })

  it.each([
    ["none", "normal", 4096, 4096, 4096] as const,
    ["sun", "fire", 8192, 6144, 6144] as const,
    ["rain", "water", 8192, 6144, 4096] as const,
    ["sand", "rock", 8192, 4096, 4096] as const,
    ["snow", "ice", 8192, 4096, 4096] as const,
  ])(
    "compiles Weather Ball in %s as %s with weather power and damage modifiers",
    (weather, expectedType, basePower, weatherDamage, stab) => {
      const outcome = calculable(311, weather)

      expect(outcome.move.type).toBe(expectedType)
      expect(normalBranch(outcome)).toMatchObject({
        power: 50,
        basePowerModifier: basePower,
        weatherModifier: weatherDamage,
        stabModifier: stab,
        typeEffectivenessModifier: NEUTRAL_MODIFIER,
      })
      expect(weatherSource(outcome)?.state).toBe(
        weather === "none" ? "neutral" : "active",
      )
    },
  )

  it("applies Weather Ball's doubled power to the edited snapshot power", () => {
    const outcome = calculable(311, "sun", {
      snapshot: moveSnapshot(311, { power: 80, accuracy: 90, criticalStage: 2 }),
    })

    expect(outcome.move.type).toBe("fire")
    expect(normalBranch(outcome)).toMatchObject({
      power: 80,
      basePowerModifier: 8192,
      weatherModifier: 6144,
    })
    expect(outcome.probability.hitProbability).toBe(0.9)
  })

  it("keeps Classic and Battle Odds on the same Weather Ball damage compilation", () => {
    const classic = calculable(311, "rain", { probabilityMode: "classic" })
    const battleOdds = calculable(311, "rain", { probabilityMode: "battle-odds" })

    expect(classic.move).toEqual(battleOdds.move)
    expect(classic.calculation).toEqual(battleOdds.calculation)
    expect(classic.probability.hitProbability).toBe(1)
    expect(battleOdds.probability.hitProbability).toBe(1)
  })

  it("does not let Normalize or Pixilate rewrite Weather Ball's weather type", () => {
    const normalized = calculable(311, "sun", { attackerAbilityId: NORMALIZE_ABILITY_ID })
    const pixilate = calculable(311, "rain", { attackerAbilityId: PIXILATE_ABILITY_ID })

    expect(normalized.move.type).toBe("fire")
    expect(normalBranch(normalized).basePowerModifier).toBe(8192)
    expect(pixilate.move.type).toBe("water")
    expect(normalBranch(pixilate).basePowerModifier).toBe(8192)
  })

  it("feeds Weather Ball's weather type into STAB, effectiveness, and type-gated abilities", () => {
    const superEffective = calculable(311, "sun", { defenderId: 3 })
    expect(superEffective.move.type).toBe("fire")
    expect(normalBranch(superEffective).typeEffectivenessModifier).toBe(8192)

    const flashFire = calculable(311, "sun", { defenderAbilityId: FLASH_FIRE_ABILITY_ID })
    expect(flashFire.calculation.low.normal?.damageNegated).toBe(true)

    const sandForce = calculable(311, "sand", { attackerAbilityId: SAND_FORCE_ABILITY_ID })
    expect(sandForce.move.type).toBe("rock")
    expect(normalBranch(sandForce).basePowerModifier).toBe(
      damageKernel.chainModifiers([5325, 8192]),
    )
    expect(weatherSource(sandForce)?.state).toBe("active")
  })

  it("treats Cloud Nine Weather Ball as the no-weather move", () => {
    const outcome = calculable(311, "rain", { attackerAbilityId: CLOUD_NINE_ABILITY_ID })

    expect(outcome.move.type).toBe("normal")
    expect(normalBranch(outcome)).toMatchObject({
      power: 50,
      basePowerModifier: NEUTRAL_MODIFIER,
      weatherModifier: NEUTRAL_MODIFIER,
      stabModifier: NEUTRAL_MODIFIER,
    })
    expect(weatherSource(outcome)?.state).toBe("inactive")
  })

  it.each([
    [53, "Flamethrower", "sun", "Sun"],
    [56, "Hydro Pump", "rain", "Rain"],
    [76, "Solar Beam", "rain", "Rain"],
    [669, "Solar Blade", "rain", "Rain"],
    [876, "Hydro Steam", "sun", "Sun"],
    [311, "Weather Ball", "sun", "Sun"],
    [311, "Weather Ball", "rain", "Rain"],
    [311, "Weather Ball", "sand", "Sand"],
    [311, "Weather Ball", "snow", "Snow"],
  ] as const)(
    "matches all @smogon/calc normal and critical rolls for %s in %s",
    (moveId, moveName, weather, calcWeather) => {
      const move = getMoveById(moveId)
      if (!move || move.category === "status") throw new Error("Expected damage move")
      const category: MoveCategory = move.category
      const offense = getAttackerStatSetups(category)["neutral-max"]
      const defense = getDefenderSetups(category)["standard-bulk"]
      const outcome = calculable(moveId, weather)
      const rolls = damageKernel.calculateDamageRolls(outcome.calculation).low
      const attacker = new Pokemon(CALC_GEN, ATTACKER[category].name, {
        level: VGC_LEVEL,
        nature: offense.nature,
        evs: offense.evs,
      })
      const defender = new Pokemon(CALC_GEN, DEFENDER.name, {
        level: VGC_LEVEL,
        nature: defense.nature,
        evs: defense.evs,
      })
      const field = new Field({ weather: calcWeather })

      expect(rolls.normal).toEqual(
        calculate(CALC_GEN, attacker, defender, new Move(CALC_GEN, moveName), field).damage,
      )
      expect(rolls.critical).toEqual(
        calculate(
          CALC_GEN,
          attacker,
          defender,
          new Move(CALC_GEN, moveName, { isCrit: true }),
          field,
        ).damage,
      )
    },
  )
})

describe("weather scenario product and provenance", () => {
  function singleAbilityState(catalog: Awaited<ReturnType<typeof getCatalogShell>>) {
    const state = defaultTrackState(catalog)
    state.statMode = "preset"
    state.defenderMode = "preset"
    state.attackerAbilityIds = [catalog.attackerAbilities[0].id]
    state.defenderAbilityIds = [catalog.defenderAbilities[0].id]
    return state
  }

  it("defaults to one explicit neutral weather and includes weather in the product", async () => {
    const catalog = await getCatalogShell(6, 143, "en", "special")
    const state = singleAbilityState(catalog)
    state.moveSnapshots = [createMoveSnapshot(
      catalog.moves.find((move) => move.id === 53)!,
      "pipeline-fire",
    )]
    state.selectedMoveSnapshotIds = state.moveSnapshots.map((snapshot) => snapshot.id)
    state.offensePresetIds = ["neutral-max"]
    state.attackerItemIds = ["none"]
    state.defensePresetIds = ["standard-bulk"]

    expect(state.weathers).toEqual(["none"])
    expect(expectedRowCount(state)).toBe(1)

    state.weathers = [...WEATHERS]
    expect(expectedRowCount(state)).toBe(5)
  })

  it("calculates Weather Ball in every supported weather without merging types", async () => {
    const catalog = await getCatalogShell(6, 143, "en", "special")
    const state = singleAbilityState(catalog)
    state.moveSnapshots = [createMoveSnapshot(
      catalog.moves.find((move) => move.id === 311)!,
      "pipeline-weather-ball",
    )]
    state.selectedMoveSnapshotIds = state.moveSnapshots.map((snapshot) => snapshot.id)
    state.offensePresetIds = ["neutral-max"]
    state.attackerItemIds = ["none"]
    state.defensePresetIds = ["standard-bulk"]
    state.weathers = [...WEATHERS]
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    const result = runScenarioPipeline(catalog, state)

    expect(result.unavailable).toEqual([])
    expect(result.rows).toHaveLength(5)
    expect(new Set(result.rows.map((row) => row.moveType))).toEqual(
      new Set(["normal", "fire", "water", "rock", "ice"]),
    )
    expect(kernel).toHaveBeenCalledTimes(5)
  })

  it("merges accuracy-only weather in rolls mode and retains none only as neutral", async () => {
    const catalog = await getCatalogShell(6, 143, "en", "special")
    const state = singleAbilityState(catalog)
    state.moveSnapshots = [createMoveSnapshot(
      catalog.moves.find((move) => move.id === 87)!,
      "pipeline-thunder",
    )]
    state.selectedMoveSnapshotIds = state.moveSnapshots.map((snapshot) => snapshot.id)
    state.offensePresetIds = ["neutral-max"]
    state.attackerItemIds = ["none"]
    state.defensePresetIds = ["standard-bulk"]
    state.weathers = ["none", "rain"]
    state.probabilityMode = "classic"

    const result = runScenarioPipeline(catalog, state)

    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].provenance.weather).toEqual({
      active: [],
      inactive: ["rain"],
      unsupported: [],
      neutral: ["none"],
    })
  })

  it("keeps accuracy weather active in Battle Odds Mode even when edited accuracy merges", async () => {
    const catalog = await getCatalogShell(6, 143, "en", "special")
    const state = singleAbilityState(catalog)
    const thunder = createMoveSnapshot(
      catalog.moves.find((move) => move.id === 87)!,
      "pipeline-thunder-edited",
    )
    state.moveSnapshots = [{ ...thunder, accuracy: 100 }]
    state.selectedMoveSnapshotIds = state.moveSnapshots.map((snapshot) => snapshot.id)
    state.offensePresetIds = ["neutral-max"]
    state.attackerItemIds = ["none"]
    state.defensePresetIds = ["standard-bulk"]
    state.weathers = ["none", "rain"]
    state.probabilityMode = "battle-odds"

    const result = runScenarioPipeline(catalog, state)

    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].provenance.weather).toEqual({
      active: ["rain"],
      inactive: [],
      unsupported: [],
      neutral: ["none"],
    })

  })
})
