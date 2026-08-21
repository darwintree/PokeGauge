import { expect, it } from "vitest"

import {
  heldItemMatchesPickerFilters,
  heldItemPickerTags,
  isHolderEligibleHeldItem,
  listHeldItemPickerOptions,
} from "./picker-filters"

const charizard = {
  battlePokemonId: 6,
  speciesId: 6,
  evioliteEligible: false,
  types: ["fire", "flying"] as const,
}

it("derives stackable picker tags from effect kind, gates, and form-triggers", () => {
  expect(heldItemPickerTags(247)).toEqual(["power"]) // Life Orb
  expect(heldItemPickerTags(197)).toEqual(["stat"]) // Choice Band
  expect(heldItemPickerTags(164)).toEqual(["berry"]) // Rindo
  expect(heldItemPickerTags(699)).toEqual(["exclusive"]) // Charizardite X
  expect(heldItemPickerTags(2106)).toEqual(["exclusive", "power"]) // Wellspring Mask
  expect(heldItemPickerTags(112)).toEqual(["exclusive", "power"]) // Adamant Orb
  expect(heldItemPickerTags(1181)).toEqual([]) // Utility Umbrella
})

it("matches a single selected tag and always applies holder eligibility", () => {
  const lifeOrb = {
    id: 247,
    label: "Life Orb",
  }
  const rindo = {
    id: 164,
    label: "Rindo Berry",
  }
  const adamant = {
    id: 112,
    label: "Adamant Orb",
  }

  expect(
    heldItemMatchesPickerFilters(lifeOrb, {
      query: "",
      tag: "power",
      holder: charizard,
    }),
  ).toBe(true)

  expect(
    heldItemMatchesPickerFilters(rindo, {
      query: "",
      tag: "power",
      holder: charizard,
    }),
  ).toBe(false)

  expect(
    heldItemMatchesPickerFilters(rindo, {
      query: "",
      tag: "berry",
      holder: charizard,
    }),
  ).toBe(false)

  expect(
    heldItemMatchesPickerFilters(adamant, {
      query: "adam",
      tag: "exclusive",
      holder: charizard,
    }),
  ).toBe(false)

  expect(
    isHolderEligibleHeldItem(112, {
      battlePokemonId: 483,
      speciesId: 483,
      evioliteEligible: false,
      types: ["steel", "dragon"],
    }),
  ).toBe(true)
})

it("limits the Berry tag to Chilan and the holder's weaknesses", () => {
  const berryMatches = (id: number, tag: "berry" | null = "berry") =>
    heldItemMatchesPickerFilters({ id, label: String(id) }, {
      query: "",
      tag,
      holder: charizard,
    })

  expect(berryMatches(177)).toBe(true) // Chilan / Normal
  expect(berryMatches(162)).toBe(true) // Passho / Water
  expect(berryMatches(163)).toBe(true) // Wacan / Electric
  expect(berryMatches(172)).toBe(true) // Charti / Rock
  expect(berryMatches(164)).toBe(false) // Rindo / Grass
  expect(berryMatches(177, null)).toBe(true)
  expect(berryMatches(164, null)).toBe(false)
})

it("lists frozen-side options plus legal form-triggers, excluding none", () => {
  const options = listHeldItemPickerOptions({
    side: "attacker",
    locale: "en",
    battlePokemonId: 6,
    selectableIds: new Set([6, 10034, 10035]),
  })

  expect(options.some((option) => option.id === "none")).toBe(false)
  expect(options.some((option) => option.id === 247)).toBe(true)
  expect(options.filter((option) => option.id === 699 || option.id === 717).map((o) => o.id)).toEqual([
    699, 717,
  ])
  // Frozen inventory order: Life Orb appears before appended form-triggers.
  expect(options.findIndex((option) => option.id === 247)).toBeLessThan(
    options.findIndex((option) => option.id === 699),
  )
})
