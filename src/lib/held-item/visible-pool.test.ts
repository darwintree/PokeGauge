import { describe, expect, it } from "vitest"

import { buildVisibleItemIds, defaultStabBoostIds } from "@/lib/held-item"
import { normalizeAddedBoostIds } from "@/lib/held-item/storage"
import { orderedPoolSelection } from "@/components/scenario-explorer/config-multi-select"

describe("held-item visible pool", () => {
  const core = ["none", "life-orb", "choice-band"]

  it("orders core → stab boosts → added boosts without duplicates", () => {
    const visible = buildVisibleItemIds(
      core,
      ["dragon", "ground"],
      ["type-boost-fire", "type-boost-ground"],
    )
    expect(visible).toEqual([
      "none",
      "life-orb",
      "choice-band",
      "type-boost-dragon",
      "type-boost-ground",
      "type-boost-fire",
    ])
  })

  it("limits default stab boosts to attacker types.slice(0, 2)", () => {
    expect(defaultStabBoostIds(["ghost", "fairy"])).toEqual([
      "type-boost-ghost",
      "type-boost-fairy",
    ])
    expect(defaultStabBoostIds(["grass"])).toEqual(["type-boost-grass"])
  })

  it("orders selected ids by visible pool", () => {
    const visible = ["none", "life-orb", "type-boost-ground"]
    expect(orderedPoolSelection(visible, ["type-boost-ground", "none"])).toEqual([
      "none",
      "type-boost-ground",
    ])
  })

  it("normalizeAddedBoostIds ignores non-array stored values", () => {
    expect(normalizeAddedBoostIds("type-boost-fire")).toEqual([])
    expect(normalizeAddedBoostIds(["type-boost-fire", 1, null])).toEqual(["type-boost-fire"])
  })
})
