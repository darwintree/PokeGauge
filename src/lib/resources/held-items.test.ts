import { readFileSync } from "node:fs"
import path from "node:path"
import { toID } from "@smogon/calc"
import { describe, expect, it } from "vitest"

import {
  FROZEN_HELD_ITEM_IDS,
  FROZEN_HELD_ITEMS,
} from "@/lib/held-item/inventory"

import { RESOURCE_DIAGNOSTICS } from "./generated/diagnostics"
import { GENERATED_HELD_ITEMS } from "./generated/held-items"
import { GENERATED_POKEMON } from "./generated/pokemon"

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

describe("generated Held-item resources", () => {
  it("covers exactly the frozen numeric inventory with localized names and sprites", () => {
    const resources = Object.values(GENERATED_HELD_ITEMS)

    expect(resources).toHaveLength(85)
    expect(new Set(resources.map((item) => item.id))).toEqual(
      new Set(FROZEN_HELD_ITEM_IDS),
    )
    expect(resources.every((item) =>
      Object.values(item.names).every((name) => name.length > 0)
    )).toBe(true)

    for (const item of resources) {
      const sprite = readFileSync(
        path.join(process.cwd(), "public/items", item.spriteFilename),
      )
      expect(sprite.length).toBeGreaterThan(PNG_SIGNATURE.length)
      expect([...sprite.subarray(0, PNG_SIGNATURE.length)]).toEqual(PNG_SIGNATURE)
    }
  })

  it("records PokeAPI slugs and reviewed generation-specific sprite paths", () => {
    expect(GENERATED_HELD_ITEMS[236]).toMatchObject({
      slug: "stick",
      names: { en: "Leek" },
      spriteFilename: "stick.png",
      spriteSourcePath: "sprites/items/stick.png",
    })
    expect(GENERATED_HELD_ITEMS[247].spriteSourcePath).toBe(
      "sprites/items/life-orb.png",
    )
    expect(GENERATED_HELD_ITEMS[1181].spriteSourcePath).toBe(
      "sprites/items/gen8/utility-umbrella.png",
    )
    for (const id of [2105, 2106, 2107, 2108] as const) {
      expect(GENERATED_HELD_ITEMS[id].spriteSourcePath).toMatch(
        /^sprites\/items\/gen9\//,
      )
    }
  })

  it("joins each PokeAPI identity to its reviewed Showdown identity", () => {
    for (const item of FROZEN_HELD_ITEMS) {
      expect(item.showdown).toBe(
        item.id === 236
          ? "leek"
          : toID((GENERATED_HELD_ITEMS as Record<number, { slug: string }>)[item.id].slug),
      )
    }
  })

  it("separates frozen Held-item diagnostics from Mega Stone diagnostics", () => {
    expect(RESOURCE_DIAGNOSTICS.heldItemIds).toEqual(FROZEN_HELD_ITEM_IDS)
    expect(RESOURCE_DIAGNOSTICS.megaStoneIds).toHaveLength(47)
    expect(new Set(RESOURCE_DIAGNOSTICS.heldItemIds)).not.toContain(
      RESOURCE_DIAGNOSTICS.megaStoneIds[0],
    )
    expect(new Set(RESOURCE_DIAGNOSTICS.itemIds)).toEqual(
      new Set([
        ...RESOURCE_DIAGNOSTICS.heldItemIds,
        ...RESOURCE_DIAGNOSTICS.megaStoneIds,
      ]),
    )

    const missingHeldItemLocales = RESOURCE_DIAGNOSTICS.missingLocaleNames
      .filter(({ resourceType }) => resourceType === "item")
    expect(missingHeldItemLocales).toHaveLength(8)
    expect(missingHeldItemLocales).toEqual(
      FROZEN_HELD_ITEMS
        .filter(({ id }) => [2105, 2106, 2107, 2108].includes(id))
        .flatMap(({ id }) => ["zh-hans", "zh-hant"].map((locale) => ({
          resourceType: "item",
          id,
          locale,
          fallbackLocale: "en",
        }))),
    )
  })
})

describe("generated Eviolite eligibility", () => {
  it.each([
    [112, true],
    [464, false],
    [550, false],
    [10016, false],
    [10247, true],
    [670, true],
    [10061, false],
    [10027, true],
    [10028, true],
    [10029, true],
    [10263, true],
  ] as const)("classifies Battle Pokemon identity %i", (id, eligible) => {
    expect(GENERATED_POKEMON[id].evioliteEligible).toBe(eligible)
  })
})
