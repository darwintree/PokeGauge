import { describe, expect, it } from "vitest"

import {
  CLEAR_BODY_ABILITY_ID,
  COMPETITIVE_ABILITY_ID,
  CONTRARY_ABILITY_ID,
  DEFIANT_ABILITY_ID,
  DRIZZLE_ABILITY_ID,
  DROUGHT_ABILITY_ID,
  ELECTRIC_SURGE_ABILITY_ID,
  FULL_METAL_BODY_ABILITY_ID,
  GRASSY_SURGE_ABILITY_ID,
  GUARD_DOG_ABILITY_ID,
  HYPER_CUTTER_ABILITY_ID,
  INNER_FOCUS_ABILITY_ID,
  INTIMIDATE_ABILITY_ID,
  MISTY_SURGE_ABILITY_ID,
  NO_ABILITY_ID,
  OBLIVIOUS_ABILITY_ID,
  OWN_TEMPO_ABILITY_ID,
  PSYCHIC_SURGE_ABILITY_ID,
  SAND_SPIT_ABILITY_ID,
  SAND_STREAM_ABILITY_ID,
  SCRAPPY_ABILITY_ID,
  SIMPLE_ABILITY_ID,
  SNOW_WARNING_ABILITY_ID,
  WHITE_SMOKE_ABILITY_ID,
} from "@/lib/ability"
import { getCatalogShell } from "@/lib/catalog"

import { projectAbilitySelections } from "./ability-projection"
import { defaultTrackState, expectedRowCount } from "./state"

async function stateWithAbilities(attackerAbilityIds: number[], defenderAbilityIds = [NO_ABILITY_ID]) {
  return {
    ...defaultTrackState(await getCatalogShell(133, 143, "en", "physical")),
    attackerAbilityIds,
    defenderAbilityIds,
  }
}

describe("ability default projection", () => {
  it("selects conflicting recommendations without neutral and keeps all old candidates", async () => {
    const state = await stateWithAbilities(
      [SAND_SPIT_ABILITY_ID, DROUGHT_ABILITY_ID, ELECTRIC_SURGE_ABILITY_ID],
      [DRIZZLE_ABILITY_ID, SAND_STREAM_ABILITY_ID, SNOW_WARNING_ABILITY_ID],
    )
    state.terrains = ["psychic", "none"]
    const projected = projectAbilitySelections(state, "special")

    expect(projected.weathers).toEqual(["sun", "rain", "sand", "snow"])
    expect(projected.weatherPool).toEqual(["none", "sun", "rain", "sand", "snow"])
    expect(projected.terrains).toEqual(["electric"])
    expect(projected.terrainPool).toEqual(["none", "electric", "psychic"])
    expect(projectAbilitySelections(projected, "special")).toEqual(projected)
  })

  it.each([
    ["physical", DEFIANT_ABILITY_ID, [0, 1, 2]],
    ["special", COMPETITIVE_ABILITY_ID, [0, 2]],
  ] as const)("keeps an untriggered %s boost in the pool only", async (category, ability, pool) => {
    const projected = projectAbilitySelections(await stateWithAbilities([ability]), category)
    expect(projected.attackerStages).toEqual([0])
    expect(projected.attackerStagePool).toEqual(pool)
    expect(projected.defenderStages).toEqual([0])
  })

  it("selects all conflicting terrains from either side and withdraws only removed recommendations", async () => {
    const state = await stateWithAbilities(
      [ELECTRIC_SURGE_ABILITY_ID, GRASSY_SURGE_ABILITY_ID],
      [PSYCHIC_SURGE_ABILITY_ID, MISTY_SURGE_ABILITY_ID],
    )
    const projected = projectAbilitySelections(state, "physical")
    expect(projected.terrains).toEqual(["electric", "grassy", "psychic", "misty"])
    expect(projected.terrainPool).toEqual(["none", "electric", "grassy", "psychic", "misty"])
    const remaining = projectAbilitySelections({
      ...projected,
      attackerAbilityIds: [GRASSY_SURGE_ABILITY_ID],
      defenderAbilityIds: [NO_ABILITY_ID],
    }, "physical")
    expect(remaining.terrains).toEqual(["grassy"])
    expect(remaining.terrainPool).toEqual(projected.terrainPool)
  })

  it.each([
    ["physical", [NO_ABILITY_ID], [INTIMIDATE_ABILITY_ID], [-1]],
    ["physical", [DEFIANT_ABILITY_ID], [INTIMIDATE_ABILITY_ID], [1]],
    ["physical", [DEFIANT_ABILITY_ID, NO_ABILITY_ID], [INTIMIDATE_ABILITY_ID], [-1, 1]],
    ["physical", [DEFIANT_ABILITY_ID, CLEAR_BODY_ABILITY_ID], [INTIMIDATE_ABILITY_ID], [0, 1]],
    ["physical", [DEFIANT_ABILITY_ID], [INTIMIDATE_ABILITY_ID, NO_ABILITY_ID], [0, 1]],
    ["physical", [CONTRARY_ABILITY_ID], [INTIMIDATE_ABILITY_ID], [1]],
    ["physical", [GUARD_DOG_ABILITY_ID], [INTIMIDATE_ABILITY_ID], [1]],
    ["physical", [SIMPLE_ABILITY_ID], [INTIMIDATE_ABILITY_ID], [-2]],
    ["special", [COMPETITIVE_ABILITY_ID], [INTIMIDATE_ABILITY_ID], [2]],
    ["special", [COMPETITIVE_ABILITY_ID, NO_ABILITY_ID], [INTIMIDATE_ABILITY_ID], [0, 2]],
    ["special", [DEFIANT_ABILITY_ID], [INTIMIDATE_ABILITY_ID], [0]],
    ["physical", [COMPETITIVE_ABILITY_ID], [INTIMIDATE_ABILITY_ID], [-1]],
  ] as const)("unions %s stages for attacker %j and defender %j", async (category, attacker, defender, stages) => {
    const state = await stateWithAbilities([...attacker], [...defender])
    const projected = projectAbilitySelections(state, category)
    expect(projected.attackerStages).toEqual(stages)
    expect(projected.attackerStagePool).toEqual(expect.arrayContaining([...stages, 0]))
  })

  it.each([
    CLEAR_BODY_ABILITY_ID, WHITE_SMOKE_ABILITY_ID, HYPER_CUTTER_ABILITY_ID,
    FULL_METAL_BODY_ABILITY_ID, INNER_FOCUS_ABILITY_ID, OWN_TEMPO_ABILITY_ID,
    OBLIVIOUS_ABILITY_ID, SCRAPPY_ABILITY_ID,
  ])("respects Intimidate immunity for ability %i", async (ability) => {
    const state = await stateWithAbilities([ability], [INTIMIDATE_ABILITY_ID])
    expect(projectAbilitySelections(state, "physical").attackerStages).toEqual([0])
  })

  it("withdraws removed recommendations without deleting pool entries", async () => {
    const before = projectAbilitySelections(await stateWithAbilities(
      [DEFIANT_ABILITY_ID, ELECTRIC_SURGE_ABILITY_ID],
      [DRIZZLE_ABILITY_ID, INTIMIDATE_ABILITY_ID],
    ), "physical")
    const after = projectAbilitySelections({
      ...before, attackerAbilityIds: [NO_ABILITY_ID], defenderAbilityIds: [NO_ABILITY_ID],
    }, "physical")
    expect(after.weathers).toEqual(["none"])
    expect(after.terrains).toEqual(["none"])
    expect(after.attackerStages).toEqual([0])
    expect(after.weatherPool).toEqual(before.weatherPool)
    expect(after.terrainPool).toEqual(before.terrainPool)
    expect(after.attackerStagePool).toEqual(before.attackerStagePool)
  })

  it("only adds candidates to manually edited tracks", async () => {
    const state = await stateWithAbilities([DRIZZLE_ABILITY_ID, ELECTRIC_SURGE_ABILITY_ID], [INTIMIDATE_ABILITY_ID])
    state.weathers = ["snow"]
    state.terrains = ["psychic"]
    state.attackerStages = [3]
    const projected = projectAbilitySelections(state, "physical", {
      weather: true, terrain: true, attackerStages: true,
    })
    expect(projected.weathers).toEqual(["snow"])
    expect(projected.terrains).toEqual(["psychic"])
    expect(projected.attackerStages).toEqual([3])
    expect(projected.weatherPool).toEqual(["none", "rain", "snow"])
    expect(projected.terrainPool).toEqual(["none", "electric", "psychic"])
    expect(projected.attackerStagePool).toEqual([-1, 0, 3])
  })

  it("does not multiply the existing move and stat branches for a single weather and stage", async () => {
    const state = await stateWithAbilities([DRIZZLE_ABILITY_ID], [INTIMIDATE_ABILITY_ID])
    state.selectedMoveSnapshotIds = ["move-a", "move-b", "move-c"]
    const projected = projectAbilitySelections(state, "physical")
    expect(expectedRowCount(projected)).toBe(6)
    expect(projected.selectedMoveSnapshotIds).toEqual(state.selectedMoveSnapshotIds)
    expect(projected.offensePresetIds).toEqual(state.offensePresetIds)
    expect(projected.defensePresetIds).toEqual(state.defensePresetIds)
  })
})
