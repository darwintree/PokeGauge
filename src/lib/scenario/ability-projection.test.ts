import { describe, expect, it } from "vitest"

import {
  COMPETITIVE_ABILITY_ID,
  DEFIANT_ABILITY_ID,
  DRIZZLE_ABILITY_ID,
  DROUGHT_ABILITY_ID,
  ELECTRIC_SURGE_ABILITY_ID,
  INTIMIDATE_ABILITY_ID,
  SAND_SPIT_ABILITY_ID,
  SAND_STREAM_ABILITY_ID,
  SNOW_WARNING_ABILITY_ID,
} from "@/lib/ability"
import { getCatalogShell } from "@/lib/catalog"

import { projectAbilitySelections } from "./ability-projection"
import { defaultTrackState } from "./state"

describe("ability initialization projection", () => {
  it("appends and deduplicates global candidates in Track order from either side", async () => {
    const state = defaultTrackState(await getCatalogShell(133, 143, "en"))
    state.weathers = ["snow", "none"]
    state.terrains = ["psychic", "none"]

    const projected = projectAbilitySelections(
      state,
      "special",
      [SAND_SPIT_ABILITY_ID, DROUGHT_ABILITY_ID, ELECTRIC_SURGE_ABILITY_ID],
      [DRIZZLE_ABILITY_ID, SAND_STREAM_ABILITY_ID, SNOW_WARNING_ABILITY_ID],
    )

    expect(projected.weathers).toEqual(["none", "sun", "rain", "sand", "snow"])
    expect(projected.terrains).toEqual(["none", "electric", "psychic"])
    expect(projectAbilitySelections(projected, "special")).toEqual(projected)
  })

  it("projects only the applicable attacker Stage choices", async () => {
    const state = defaultTrackState(await getCatalogShell(133, 143, "en"))
    state.attackerStages = [2, -3, 0]

    const physical = projectAbilitySelections(
      state,
      "physical",
      [DEFIANT_ABILITY_ID, COMPETITIVE_ABILITY_ID, INTIMIDATE_ABILITY_ID],
      [INTIMIDATE_ABILITY_ID, DEFIANT_ABILITY_ID],
    )
    const special = projectAbilitySelections(
      state,
      "special",
      [COMPETITIVE_ABILITY_ID, DEFIANT_ABILITY_ID],
      [INTIMIDATE_ABILITY_ID],
    )

    expect(physical.attackerStages).toEqual([-3, -1, 0, 1, 2])
    expect(physical.defenderStages).toEqual([0])
    expect(special.attackerStages).toEqual([-3, 0, 2])
  })
})
