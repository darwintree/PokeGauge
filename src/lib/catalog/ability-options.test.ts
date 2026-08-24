import { expect, it } from "vitest"

import { NO_ABILITY_ID } from "@/lib/ability"

import { resolveDefaultAbilityIds } from "./champions-defaults"
import { abilityOptions, noAbilityOption } from "./resource-options"

it("keeps none abilities available for disabled rendering", async () => {
  const options = await abilityOptions([1, 24, 91], "en")
  expect(options.map((option) => option.id)).toEqual([1, 24, 91])
})

it("falls back to No Ability when an identity has no selectable ability", async () => {
  const options = await abilityOptions([1], "en")
  expect(await resolveDefaultAbilityIds(445, [noAbilityOption("en"), ...options]))
    .toEqual([NO_ABILITY_ID])
})
