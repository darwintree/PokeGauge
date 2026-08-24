import { expect, it } from "vitest"

import { NO_ABILITY_ID } from "@/lib/ability"

import { resolveDefaultAbilityIds } from "./champions-defaults"
import { abilityOptions, noAbilityOption } from "./resource-options"

it("hides none abilities while keeping supported and unsupported choices", async () => {
  const options = await abilityOptions([1, 24, 91], "en")
  expect(options.map((option) => option.id)).toEqual([24, 91])
})

it("falls back to No Ability when every identity ability is hidden", async () => {
  expect(await abilityOptions([1], "en")).toEqual([])
  expect(await resolveDefaultAbilityIds(445, [noAbilityOption("en")])).toEqual([NO_ABILITY_ID])
})
