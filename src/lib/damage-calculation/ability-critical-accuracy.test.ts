import { beforeAll, describe, expect, it } from "vitest"

import {
  BATTLE_ARMOR_ABILITY_ID,
  COMPOUND_EYES_ABILITY_ID,
  HUSTLE_ABILITY_ID,
  MERCILESS_ABILITY_ID,
  NO_ABILITY_ID,
  NO_GUARD_ABILITY_ID,
  FILTER_ABILITY_ID,
  SAND_VEIL_ABILITY_ID,
  SHELL_ARMOR_ABILITY_ID,
  SNIPER_ABILITY_ID,
  SNOW_CLOAK_ABILITY_ID,
  SUPER_LUCK_ABILITY_ID,
} from "@/lib/ability"
import { getCatalogShell } from "@/lib/catalog"
import type { MoveSnapshot } from "@/lib/move"
import { listResources } from "@/lib/resources"
import { defaultTrackState, runScenarioPipeline } from "@/lib/scenario"

import {
  chainModifiers,
  compileScenario,
  NEUTRAL_MODIFIER,
  type CalculableScenario,
  type RawScenario,
  type ScenarioTrack,
} from "./index"

const TACKLE: MoveSnapshot = {
  id: "ability-critical-accuracy-tackle",
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
    probabilityMode: "battle-odds",
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

describe("critical-hit abilities", () => {
  it.each([BATTLE_ARMOR_ABILITY_ID, SHELL_ARMOR_ABILITY_ID])(
    "makes Ability %i ordinary-only in both modes and restores ordinary Stage and Screen rules",
    (defenderAbilityId) => {
      for (const probabilityMode of ["classic", "battle-odds"] as const) {
        for (const criticalStage of [0, 3] as const) {
          const outcome = calculable({
            defenderAbilityId,
            probabilityMode,
            attackerStage: -1,
            defenderStage: 1,
            screen: "reflect",
            snapshot: { ...TACKLE, criticalStage },
          })

          expect(outcome.calculation.low.normal).toMatchObject({
            attackStage: -1,
            defenseStage: 1,
          })
          expect(outcome.calculation.low.normal?.finalModifier).not.toBe(NEUTRAL_MODIFIER)
          expect(outcome.calculation.low.critical).toBeUndefined()
          expect(outcome.probability.criticalHitProbability).toBe(0)
          expect(state(outcome, "defender-ability")).toBe("active")
          expect(state(outcome, "attacker-stage")).toBe("active")
          expect(state(outcome, "defender-stage")).toBe("active")
          expect(state(outcome, "screen")).toBe("active")
        }
      }
    },
  )

  it("stacks Super Luck with Snapshot and item stages, caps at +3, and honors mode activation", () => {
    for (const probabilityMode of ["classic", "battle-odds"] as const) {
      const guaranteed = calculable({
        attackerAbilityId: SUPER_LUCK_ABILITY_ID,
        attackerItemId: 209,
        probabilityMode,
        snapshot: { ...TACKLE, criticalStage: 1 },
      })
      expect(guaranteed.calculation.low.normal).toBeUndefined()
      expect(guaranteed.probability.criticalHitProbability).toBe(1)
      expect(state(guaranteed, "attacker-ability")).toBe("active")
      expect(state(guaranteed, "held-item")).toBe("active")
    }

    const capped = calculable({
      attackerAbilityId: SUPER_LUCK_ABILITY_ID,
      attackerItemId: 209,
      snapshot: { ...TACKLE, criticalStage: 3 },
    })
    expect(state(capped, "attacker-ability")).toBe("inactive")
    expect(state(capped, "held-item")).toBe("inactive")

    const randomClassic = calculable({
      attackerAbilityId: SUPER_LUCK_ABILITY_ID,
      probabilityMode: "classic",
    })
    expect(state(randomClassic, "attacker-ability")).toBe("inactive")
  })

  it("applies Sniper only to the critical Final phase and disables all crit sources when blocked", () => {
    for (const probabilityMode of ["classic", "battle-odds"] as const) {
      const sniper = calculable({ attackerAbilityId: SNIPER_ABILITY_ID, probabilityMode })
      expect(sniper.calculation.low.normal?.finalModifier).toBe(NEUTRAL_MODIFIER)
      expect(sniper.calculation.low.critical?.finalModifier).toBe(6144)
      expect(state(sniper, "attacker-ability")).toBe("active")
    }

    const blockedSniper = calculable({
      attackerAbilityId: SNIPER_ABILITY_ID,
      defenderAbilityId: SHELL_ARMOR_ABILITY_ID,
    })
    expect(blockedSniper.calculation.low.critical).toBeUndefined()
    expect(state(blockedSniper, "attacker-ability")).toBe("inactive")

    const blockedLuck = calculable({
      attackerAbilityId: SUPER_LUCK_ABILITY_ID,
      attackerItemId: 209,
      defenderAbilityId: BATTLE_ARMOR_ABILITY_ID,
      snapshot: { ...TACKLE, criticalStage: 1 },
    })
    expect(state(blockedLuck, "attacker-ability")).toBe("inactive")
    expect(state(blockedLuck, "held-item")).toBe("inactive")
  })

  it("writes Merciless as criticalStage 3 and marks inactive when preventsCritical", () => {
    for (const probabilityMode of ["classic", "battle-odds"] as const) {
      const merciless = calculable({
        attackerAbilityId: MERCILESS_ABILITY_ID,
        probabilityMode,
      })
      expect(merciless.calculation.low.normal).toBeUndefined()
      expect(merciless.probability.criticalHitProbability).toBe(1)
      expect(state(merciless, "attacker-ability")).toBe("active")
    }

    const blocked = calculable({
      attackerAbilityId: MERCILESS_ABILITY_ID,
      defenderAbilityId: SHELL_ARMOR_ABILITY_ID,
    })
    expect(blocked.calculation.low.critical).toBeUndefined()
    expect(state(blocked, "attacker-ability")).toBe("inactive")

    const wrongSide = calculable({ defenderAbilityId: MERCILESS_ABILITY_ID })
    expect(state(wrongSide, "defender-ability")).toBe("inactive")
  })

  it("chains critical Final as attacker Ability, defender Ability, attacker item, defender item", () => {
    const outcome = calculable({
      attackerAbilityId: SNIPER_ABILITY_ID,
      defenderAbilityId: FILTER_ABILITY_ID,
      attackerItemId: 247,
      screen: "reflect",
      snapshot: { ...TACKLE, id: "sniper-final-order", moveId: 2, power: 50 },
    })

    expect(outcome.calculation.low.normal?.finalModifier).toBe(
      chainModifiers([2732, NEUTRAL_MODIFIER, 3072, 5324, NEUTRAL_MODIFIER]),
    )
    expect(outcome.calculation.low.critical?.finalModifier).toBe(
      chainModifiers([NEUTRAL_MODIFIER, 6144, 3072, 5324, NEUTRAL_MODIFIER]),
    )
  })
})

describe("accuracy abilities", () => {
  it("uses the fixed Ability then item chain for the acceptance vector", () => {
    const outcome = calculable({
      attackerAbilityId: COMPOUND_EYES_ABILITY_ID,
      defenderAbilityId: SAND_VEIL_ABILITY_ID,
      attackerItemId: 242,
      defenderItemId: 190,
      weather: "sand",
      snapshot: { ...TACKLE, accuracy: 85 },
    })

    expect(chainModifiers([5325, 3277, 4505, 3686])).toBe(4216)
    expect(outcome.hitFact).toBe(87)
    expect(outcome.probability.hitProbability).toBe(0.87)
    expect(state(outcome, "attacker-ability")).toBe("active")
    expect(state(outcome, "defender-ability")).toBe("active")
    expect(state(outcome, "held-item")).toBe("active")
    expect(state(outcome, "defender-held-item")).toBe("active")
  })

  it.each([
    [COMPOUND_EYES_ABILITY_ID, "attacker-ability", "none"],
    [SAND_VEIL_ABILITY_ID, "defender-ability", "sand"],
    [SNOW_CLOAK_ABILITY_ID, "defender-ability", "snow"],
  ] as const)("marks numeric Ability %i by mode, gate, and final probability", (abilityId, track, weather) => {
    const side = track === "attacker-ability"
      ? { attackerAbilityId: abilityId }
      : { defenderAbilityId: abilityId }
    const active = calculable({ ...side, weather, snapshot: { ...TACKLE, accuracy: 80 } })
    const classic = calculable({
      ...side,
      weather,
      probabilityMode: "classic",
      snapshot: { ...TACKLE, accuracy: 80 },
    })
    const alreadyAlways = calculable({
      ...side,
      weather,
      snapshot: { ...TACKLE, alwaysHits: true },
    })

    expect(state(active, track)).toBe("active")
    expect(state(classic, track)).toBe("inactive")
    expect(state(alreadyAlways, track)).toBe("inactive")
    if (track === "defender-ability") {
      expect(state(calculable({ ...side, snapshot: { ...TACKLE, accuracy: 80 } }), track)).toBe("inactive")
    }
  })

  it("resolves No Guard after weather and keeps independent always-hit sources active", () => {
    const numeric100 = calculable({ attackerAbilityId: NO_GUARD_ABILITY_ID })
    expect(numeric100.hitFact).toBe("always-hits")
    expect(state(numeric100, "attacker-ability")).toBe("active")

    const both = calculable({
      attackerAbilityId: NO_GUARD_ABILITY_ID,
      defenderAbilityId: NO_GUARD_ABILITY_ID,
    })
    expect(state(both, "attacker-ability")).toBe("active")
    expect(state(both, "defender-ability")).toBe("active")

    const rainThunder = calculable({
      attackerAbilityId: NO_GUARD_ABILITY_ID,
      weather: "rain",
      snapshot: {
        ...TACKLE,
        id: "no-guard-rain-thunder",
        moveId: 87,
        power: 110,
        accuracy: 70,
      },
    })
    expect(rainThunder.hitFact).toBe("always-hits")
    expect(state(rainThunder, "attacker-ability")).toBe("active")
    expect(state(rainThunder, "weather")).toBe("active")

    const alreadyAlways = calculable({
      attackerAbilityId: NO_GUARD_ABILITY_ID,
      defenderAbilityId: NO_GUARD_ABILITY_ID,
      snapshot: { ...TACKLE, alwaysHits: true },
    })
    expect(state(alreadyAlways, "attacker-ability")).toBe("inactive")
    expect(state(alreadyAlways, "defender-ability")).toBe("inactive")

    const classic = calculable({
      attackerAbilityId: NO_GUARD_ABILITY_ID,
      probabilityMode: "classic",
      snapshot: { ...TACKLE, accuracy: 80 },
    })
    expect(state(classic, "attacker-ability")).toBe("inactive")
  })

  it("aggregates Hustle's Physical Attack and accuracy facets", () => {
    for (const probabilityMode of ["classic", "battle-odds"] as const) {
      const physical = calculable({
        attackerAbilityId: HUSTLE_ABILITY_ID,
        probabilityMode,
        snapshot: { ...TACKLE, accuracy: 80 },
      })
      expect(physical.calculation.low.normal?.attackModifier).toBe(6144)
      expect(state(physical, "attacker-ability")).toBe("active")
      expect(physical.hitFact).toBe(64)
    }

    const special = calculable({
      attackerAbilityId: HUSTLE_ABILITY_ID,
      snapshot: { ...TACKLE, id: "hustle-special", moveId: 94, power: 90, accuracy: 80 },
    })
    expect(special.calculation.low.normal?.attackModifier).toBe(NEUTRAL_MODIFIER)
    expect(state(special, "attacker-ability")).toBe("inactive")
    expect(special.hitFact).toBe(80)
  })

  it("merges Hit Facts deterministically without splitting calculation-equivalent rows", async () => {
    const catalog = await getCatalogShell(133, 143, "en", "physical")
    const state = defaultTrackState(catalog)
    state.moveSnapshots = [TACKLE]
    state.selectedMoveSnapshotIds = [TACKLE.id]
    state.attackerItemIds = ["none"]
    state.defenderItemIds = ["none"]
    state.attackerAbilityIds = [NO_ABILITY_ID, NO_GUARD_ABILITY_ID]
    state.defenderAbilityIds = [NO_ABILITY_ID]
    state.offensePresetIds = state.offensePresetIds.slice(0, 1)
    state.defensePresetIds = state.defensePresetIds.slice(0, 1)
    state.probabilityMode = "battle-odds"

    const forward = runScenarioPipeline(catalog, state)
    state.attackerAbilityIds.reverse()
    const reverse = runScenarioPipeline(catalog, state)

    expect(forward.rows).toHaveLength(1)
    expect(reverse.rows).toHaveLength(1)
    expect(forward.rows[0].moveMechanics.hitFact).toBe(100)
    expect(reverse.rows[0].moveMechanics.hitFact).toBe(100)
    expect(forward.rows[0].provenance["attacker-ability"]).toMatchObject({
      active: [String(NO_GUARD_ABILITY_ID)],
      neutral: [String(NO_ABILITY_ID)],
    })

    state.moveSnapshots = [{ ...TACKLE, alwaysHits: true }]
    const allAlways = runScenarioPipeline(catalog, state)
    expect(allAlways.rows).toHaveLength(1)
    expect(allAlways.rows[0].moveMechanics.hitFact).toBe("always-hits")
  })
})

describe("support boundary", () => {
  it.each([35, 51])("keeps Ability %i unsupported", (abilityId) => {
    const outcome = calculable({ attackerAbilityId: abilityId, defenderAbilityId: abilityId })
    expect(state(outcome, "attacker-ability")).toBe("unsupported")
    expect(state(outcome, "defender-ability")).toBe("unsupported")
  })
})
