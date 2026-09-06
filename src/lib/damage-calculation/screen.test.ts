import * as hitExecution from "./hit-execution"
import { calculate, Field, Move, Pokemon } from "@smogon/calc"
import { beforeAll, describe, expect, it, vi } from "vitest"

import { getCatalogShell } from "@/lib/catalog"
import {
  createMoveSnapshot,
  type CriticalStage,
  type MoveSnapshot,
} from "@/lib/move"
import {
  getBattlePokemonById,
  getMoveById,
  listResources,
} from "@/lib/resources"
import {
  defaultTrackState,
  expectedRowCount,
  runScenarioPipeline,
} from "@/lib/scenario"

import { CALC_GEN, VGC_LEVEL } from "@/lib/damage-calculation"
import * as damageKernel from "@/lib/damage-calculation"
import {
  defenderStatValuesForPokemon,
  offenseStatValueForPokemon,
} from "@/lib/stat-calculation"
import { getAttackerStatSetups, getDefenderSetups } from "@/lib/stat-calculation"
import {
  SCREENS,
  resolveAppliedScreen,
  type Screen,
} from "@/lib/damage-calculation"
import {
  compileScenario,
  type CalculableScenario,
  type RawScenario,
} from "@/lib/damage-calculation"

const DEFENDER = { id: 143, name: "Snorlax" } as const

type ScreenCase = {
  attackerId: number
  attackerName: string
  moveId: number
  screen: Screen
}

function snapshot(moveId: number, criticalStage: CriticalStage = 0): MoveSnapshot {
  const move = getMoveById(moveId)
  if (!move || move.category === "status" || move.power === null) {
    throw new Error(`Move ${moveId} cannot make a screen test snapshot`)
  }
  return {
    id: `screen-${moveId}-${criticalStage}`,
    moveId,
    power: move.power,
    accuracy: move.accuracy ?? 0,
    alwaysHits: false,
    criticalStage,
    spreadEligible: move.isSpread,
    spread: false,
  }
}

function rawScenario(
  testCase: ScreenCase,
  overrides: Partial<RawScenario> = {},
): RawScenario {
  const move = getMoveById(testCase.moveId)
  if (!move || move.category === "status") {
    throw new Error(`Move ${testCase.moveId} cannot make a screen test scenario`)
  }
  const attacker = getBattlePokemonById(testCase.attackerId)
  const defender = getBattlePokemonById(DEFENDER.id)
  if (!attacker || !defender) throw new Error("Expected screen test Pokémon")
  const offense = getAttackerStatSetups(move.category)["neutral-max"]
  const defense = getDefenderSetups(move.category)["standard-bulk"]
  return {
    snapshot: snapshot(testCase.moveId),
    attackerId: testCase.attackerId,
    defenderId: DEFENDER.id,
    attackerItemId: "none",
    attackerAbilityId: 1,
    defenderAbilityId: 1,
    attackerStage: 0,
    defenderStage: 0,
    weather: "none",
    terrain: "none",
    screen: testCase.screen,
    probabilityMode: "classic",
    lowOutcome: {
      offense: offenseStatValueForPokemon(
        attacker,
        move.category,
        offense,
      ),
      defense: defenderStatValuesForPokemon(
        defender,
        move.category,
        defense,
      ),
    },
    ...overrides,
  }
}

function calculable(
  testCase: ScreenCase,
  overrides: Partial<RawScenario> = {},
): CalculableScenario {
  const outcome = compileScenario(rawScenario(testCase, overrides))
  if (outcome.kind !== "calculable") {
    throw new Error(`Expected calculable, got ${outcome.reason}`)
  }
  return outcome
}

function screenSource(outcome: CalculableScenario) {
  return outcome.sources.find((source) => source.track === "screen")
}

function oracleRolls(testCase: ScreenCase, critical: boolean) {
  const move = getMoveById(testCase.moveId)
  if (!move || move.category === "status") throw new Error("Expected damage move")
  const offense = getAttackerStatSetups(move.category)["neutral-max"]
  const defense = getDefenderSetups(move.category)["standard-bulk"]
  const applied = resolveAppliedScreen(testCase.screen, move.category)
  const attacker = new Pokemon(CALC_GEN, testCase.attackerName, {
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
    defenderSide: {
      isReflect: applied === "reflect",
      isLightScreen: applied === "light-screen",
    },
  })
  return calculate(
    CALC_GEN,
    attacker,
    defender,
    new Move(CALC_GEN, move.calcMoveName, { isCrit: critical }),
    field,
  ).damage
}

beforeAll(async () => {
  await Promise.all([
    listResources("pokemon", "en"),
    listResources("move", "en"),
  ])
})

describe("screen compiler", () => {
  it.each([
    [{ attackerId: 133, attackerName: "Eevee", moveId: 33, screen: "walls" }, 2732, "active", "reflect"],
    [{ attackerId: 6, attackerName: "Charizard", moveId: 53, screen: "walls" }, 2732, "active", "light-screen"],
    [{ attackerId: 133, attackerName: "Eevee", moveId: 33, screen: "none" }, 4096, "neutral", "none"],
  ] as const)(
    "compiles move %i under %s with exact normal and critical modifiers",
    (testCase, expectedNormalModifier, expectedState, expectedOptionId) => {
      const outcome = calculable(testCase)

      expect(outcome.calculation.low.normal?.finalModifier).toBe(expectedNormalModifier)
      expect(outcome.calculation.low.critical?.finalModifier).toBe(4096)
      expect(screenSource(outcome)).toEqual({
        track: "screen",
        optionId: expectedOptionId,
        state: expectedState,
      })
    },
  )

  it("makes every screen inactive for a critical-only snapshot", () => {
    const testCase = {
      attackerId: 133,
      attackerName: "Eevee",
      moveId: 33,
      screen: "walls",
    } as const
    const outcome = calculable(testCase, {
      snapshot: snapshot(testCase.moveId, 3),
    })

    expect(outcome.calculation.low.normal).toBeUndefined()
    expect(outcome.calculation.low.critical?.finalModifier).toBe(4096)
    expect(screenSource(outcome)).toEqual({
      track: "screen",
      optionId: "reflect",
      state: "inactive",
    })
    expect(damageKernel.calculateDamageRolls(outcome.calculation).low.critical).toEqual(
      oracleRolls(testCase, true),
    )
  })

  it.each([
    { attackerId: 133, attackerName: "Eevee", moveId: 280, screen: "walls" },
    { attackerId: 133, attackerName: "Eevee", moveId: 706, screen: "walls" },
    { attackerId: 10251, attackerName: "Tauros-Paldea-Blaze", moveId: 873, screen: "walls" },
  ] as const)(
    "makes screen-breaking move $moveId ignore its screen before damage",
    (testCase) => {
      const outcome = calculable(testCase)

      expect(outcome.move.breaksScreensBeforeDamage).toBe(true)
      expect(outcome.calculation.low.normal?.finalModifier).toBe(4096)
      expect(outcome.calculation.low.critical?.finalModifier).toBe(4096)
      expect(screenSource(outcome)?.state).toBe("inactive")
    },
  )

  it.each([
    { attackerId: 133, attackerName: "Eevee", moveId: 33, screen: "walls" },
    { attackerId: 6, attackerName: "Charizard", moveId: 53, screen: "walls" },
    { attackerId: 133, attackerName: "Eevee", moveId: 280, screen: "walls" },
    { attackerId: 133, attackerName: "Eevee", moveId: 706, screen: "walls" },
    { attackerId: 10251, attackerName: "Tauros-Paldea-Blaze", moveId: 873, screen: "walls" },
  ] as const)(
    "matches all @smogon/calc normal and critical rolls for move $moveId under $screen",
    (testCase) => {
      const outcome = calculable(testCase)
      const rolls = damageKernel.calculateDamageRolls(outcome.calculation).low

      expect(rolls.normal).toEqual(oracleRolls(testCase, false))
      expect(rolls.critical).toEqual(oracleRolls(testCase, true))
    },
  )
})

describe("screen scenario product and provenance", () => {
  async function screenTrackState(criticalStage: CriticalStage = 0) {
    const catalog = await getCatalogShell(445, 143, "en", "physical")
    const earthquake = catalog.moves.find((move) => move.id === 89)
    if (!earthquake) throw new Error("Expected Earthquake catalog option")
    const state = defaultTrackState(catalog)
    state.statMode = "preset"
    state.defenderMode = "preset"
    state.moveSnapshots = [{
      ...createMoveSnapshot(earthquake, "pipeline-screen-earthquake"),
      criticalStage,
      spread: false,
    }]
    state.selectedMoveSnapshotIds = state.moveSnapshots.map((snapshot) => snapshot.id)
    state.offensePresetIds = ["neutral-max"]
    state.attackerStages = [0]
    state.attackerItemIds = ["none"]
    state.attackerAbilityIds = [8]
    state.weathers = ["none"]
    state.defensePresetIds = ["standard-bulk"]
    state.defenderStages = [0]
    state.defenderAbilityIds = [17]
    state.screens = [...SCREENS]
    return { catalog, state }
  }

  it("keeps none and walls as two physical rows", async () => {
    const { catalog, state } = await screenTrackState()
    const kernel = vi.spyOn(hitExecution, "evaluateExecutionPoint")

    const result = runScenarioPipeline(catalog, state)

    expect(expectedRowCount(state)).toBe(2)
    expect(result.rows).toHaveLength(2)
    expect(result.unavailable).toEqual([])
    expect(kernel).toHaveBeenCalledTimes(2)
    expect(result.rows.find((row) =>
      row.provenance.screen?.active.includes("reflect")
    )?.provenance.screen).toEqual({
      active: ["reflect"],
      inactive: [],
      unsupported: [],
      neutral: [],
    })
    expect(result.rows.find((row) =>
      row.provenance.screen?.neutral.includes("none")
    )?.provenance.screen).toEqual({
      active: [],
      inactive: [],
      unsupported: [],
      neutral: ["none"],
    })
    kernel.mockRestore()
  })

  it("merges none and walls for a critical-only snapshot", async () => {
    const { catalog, state } = await screenTrackState(3)
    const kernel = vi.spyOn(hitExecution, "evaluateExecutionPoint")

    const result = runScenarioPipeline(catalog, state)

    expect(expectedRowCount(state)).toBe(2)
    expect(result.rows).toHaveLength(1)
    expect(kernel).toHaveBeenCalledTimes(1)
    expect(result.rows[0].criticalOnly).toBe(true)
    expect(result.rows[0].provenance.screen).toEqual({
      active: [],
      inactive: ["reflect"],
      unsupported: [],
      neutral: ["none"],
    })
    kernel.mockRestore()
  })

  it.each([
    [445, 280],
    [445, 706],
    [10251, 873],
  ] as const)(
    "merges none and walls before breaker %i's pipeline damage",
    async (attackerId, moveId) => {
      const catalog = await getCatalogShell(attackerId, 143, "en", "physical")
      const move = catalog.moves.find((candidate) => candidate.id === moveId)
      if (!move) throw new Error(`Expected screen breaker ${moveId}`)
      const state = defaultTrackState(catalog)
      state.statMode = "preset"
      state.defenderMode = "preset"
      state.moveSnapshots = [createMoveSnapshot(move, `pipeline-breaker-${moveId}`)]
      state.selectedMoveSnapshotIds = state.moveSnapshots.map((snapshot) => snapshot.id)
      state.offensePresetIds = ["neutral-max"]
      state.attackerStages = [0]
      state.attackerItemIds = ["none"]
      state.attackerAbilityIds = [catalog.attackerAbilities[0].id]
      state.weathers = ["none"]
      state.defensePresetIds = ["standard-bulk"]
      state.defenderStages = [0]
      state.defenderAbilityIds = [catalog.defenderAbilities[0].id]
      state.screens = [...SCREENS]
      const kernel = vi.spyOn(hitExecution, "evaluateExecutionPoint")

      const result = runScenarioPipeline(catalog, state)

      expect(expectedRowCount(state)).toBe(2)
      expect(result.rows).toHaveLength(1)
      expect(kernel).toHaveBeenCalledTimes(1)
      expect(result.rows[0].provenance.screen).toEqual({
        active: [],
        inactive: ["reflect"],
        unsupported: [],
        neutral: ["none"],
      })
      kernel.mockRestore()
    },
  )
})
