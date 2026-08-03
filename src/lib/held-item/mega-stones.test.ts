import { describe, expect, it } from "vitest"

import { getCatalogShell, listAttackers } from "@/lib/catalog"
import {
  UNKNOWN_MEGA_STONE_ID,
  megaStoneFor,
  megaStoneLabel,
} from "@/lib/held-item"
import { defaultTrackState } from "@/lib/scenario"

import { UNKNOWN_ABILITY_ID } from "@/lib/ability"

describe("Mega identities", () => {
  it("keeps eligible Mega identities and excludes battle-only non-Mega identities", async () => {
    const ids = new Set((await listAttackers("en")).map(({ id }) => id))

    expect(ids.has(10033)).toBe(true)
    expect(ids.has(10013)).toBe(false)
  })

  it("maps Mega X and Y to their reviewed stones", () => {
    expect(megaStoneFor(10034)).toBe(699)
    expect(megaStoneFor(10035)).toBe(717)
  })

  it("uses localized PokeAPI names for stones and the shared placeholder", () => {
    expect(megaStoneLabel(699, "en")).toBe("Charizardite X")
    expect(megaStoneLabel(699, "zh-hans")).toBe("喷火龙进化石Ｘ")
    expect(megaStoneLabel(UNKNOWN_MEGA_STONE_ID, "ja")).toBe("不明なメガストーン")
  })

  it("locks missing upstream relations to shared neutral placeholders", async () => {
    const catalog = await getCatalogShell(10301, 445, "en")
    const state = defaultTrackState(catalog)

    expect(catalog.attackerLockedAbilityId).toBe(UNKNOWN_ABILITY_ID)
    expect(catalog.attackerLockedItemId).toBe(UNKNOWN_MEGA_STONE_ID)
    expect(state.attackerAbilityIds).toEqual([UNKNOWN_ABILITY_ID])
    expect(state.attackerItemIds).toEqual([UNKNOWN_MEGA_STONE_ID])
  })

  it("keeps Mega Rayquaza item selection editable", async () => {
    const catalog = await getCatalogShell(10079, 445, "en")

    expect(catalog.attackerLockedItemId).toBeNull()
    expect(catalog.attackerPreservesItem).toBe(true)
    expect(catalog.attackerLockedAbilityId).not.toBeNull()
  })
})
