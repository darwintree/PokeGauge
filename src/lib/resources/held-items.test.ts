import { describe, expect, it } from "vitest"

import {
  FROZEN_HELD_ITEM_IDS,
  FROZEN_HELD_ITEMS,
  HELD_ITEM_SPRITES_COMMIT,
  itemSpriteUrl,
} from "@/lib/held-item"

import { RESOURCE_DIAGNOSTICS } from "./generated/diagnostics"
import { GENERATED_HELD_ITEMS } from "./generated/held-items"
import { GENERATED_MEGA_STONES } from "./generated/mega-stones"
import { GENERATED_POKEMON } from "./generated/pokemon"

describe("generated Held-item resources", () => {
  it("covers exactly the frozen numeric inventory with localized names and sprite paths", () => {
    const resources = Object.values(GENERATED_HELD_ITEMS)

    expect(resources).toHaveLength(85)
    expect(new Set(resources.map((item) => item.id))).toEqual(
      new Set(FROZEN_HELD_ITEM_IDS),
    )
    expect(resources.every((item) =>
      Object.values(item.names).every((name) => name.length > 0)
    )).toBe(true)
    expect(resources.every((item) => item.spriteSourcePath.startsWith("sprites/items/"))).toBe(
      true,
    )
  })

  it("records PokeAPI slugs and reviewed generation-specific sprite paths", () => {
    expect(GENERATED_HELD_ITEMS[236]).toMatchObject({
      slug: "stick",
      names: { en: "Leek" },
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

  it("records Mega Stone sprite source paths", () => {
    const stones = Object.values(GENERATED_MEGA_STONES)
    expect(stones).toHaveLength(47)
    expect(stones.every((item) => item.spriteSourcePath.startsWith("sprites/items/"))).toBe(
      true,
    )
    expect(GENERATED_MEGA_STONES[699].spriteSourcePath).toBe(
      "sprites/items/charizardite-x.png",
    )
  })

  it("builds pinned hotlink URLs for frozen items and Mega Stones", () => {
    expect(itemSpriteUrl(247)).toBe(
      `https://raw.githubusercontent.com/PokeAPI/sprites/${HELD_ITEM_SPRITES_COMMIT}/sprites/items/life-orb.png`,
    )
    expect(itemSpriteUrl(699)).toBe(
      `https://raw.githubusercontent.com/PokeAPI/sprites/${HELD_ITEM_SPRITES_COMMIT}/sprites/items/charizardite-x.png`,
    )
    expect(itemSpriteUrl(1181)).toBe(
      `https://raw.githubusercontent.com/PokeAPI/sprites/${HELD_ITEM_SPRITES_COMMIT}/sprites/items/gen8/utility-umbrella.png`,
    )
    expect(itemSpriteUrl("unknown-mega-stone")).toBeNull()
    expect(itemSpriteUrl("none")).toBeNull()
  })

  it("propagates each frozen item's reviewed calc name into generated resources", () => {
    expect(GENERATED_HELD_ITEMS[236].calcItemName).toBe("leek")
    for (const item of FROZEN_HELD_ITEMS) {
      const generated = (GENERATED_HELD_ITEMS as Record<number, { calcItemName: string }>)[item.id]
      expect(generated.calcItemName).toBe(item.calcItemName)
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
