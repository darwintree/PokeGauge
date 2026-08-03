import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  resetChampionsAbilityUsageFetcherForTest,
  resetChampionsMoveUsageFetcherForTest,
  setChampionsAbilityUsageFetcherForTest,
  setChampionsMoveUsageFetcherForTest,
} from "@/lib/champions"
import { getCatalogShell, resolveCatalogDefaultMovePick } from "@/lib/catalog"
import {
  ATTACKER_HELD_ITEM_IDS,
  DEFENDER_HELD_ITEM_IDS,
  UNKNOWN_MEGA_STONE_ID,
} from "@/lib/held-item"

afterEach(() => {
  vi.useRealTimers()
  resetChampionsAbilityUsageFetcherForTest()
  resetChampionsMoveUsageFetcherForTest()
})

beforeEach(() => {
  setChampionsAbilityUsageFetcherForTest(async () => [])
  setChampionsMoveUsageFetcherForTest(async () => [])
})

describe("catalog move candidate ordering", () => {
  it.each([
    [741, "special", 686, "fire"],
    [445, "special", 686, "dragon"],
    [10187, "physical", 783, "dark"],
    [10251, "physical", 873, "fire"],
    [10273, "physical", 904, "water"],
  ] as const)(
    "resolves identity-dependent move types for attacker %i",
    async (attackerId, category, moveId, type) => {
      const catalog = await getCatalogShell(attackerId, 727, "en", category)
      expect(catalog.moves.find((move) => move.id === moveId)?.type).toBe(type)
    },
  )

  it("filters unsupported mechanics while retaining static Tera moves", async () => {
    const [physical, special] = await Promise.all([
      getCatalogShell(445, 727, "en", "physical"),
      getCatalogShell(445, 727, "en", "special"),
    ])
    const ids = new Set([...physical.moves, ...special.moves].map((move) => move.id))

    for (const excluded of [237, 473, 492, 540, 548, 658, 695, 719, 722, 723, 724, 757, 776, 801, 877, 894]) {
      expect(ids.has(excluded), `move ${excluded}`).toBe(false)
    }
    expect(ids.has(851)).toBe(true)
    expect(ids.has(906)).toBe(true)
  })

  it("admits reviewed null-power templates as unconfigured candidates only", async () => {
    const [physical, special] = await Promise.all([
      getCatalogShell(445, 727, "en", "physical"),
      getCatalogShell(445, 727, "en", "special"),
    ])

    expect(physical.moves.find((move) => move.id === 360)?.power).toBe(0)
    expect(physical.moves.find((move) => move.id === 484)?.power).toBe(0)
    expect(special.moves.find((move) => move.id === 486)?.power).toBe(0)
    expect(physical.moves.some((move) => move.id === 68)).toBe(false)
  })

  it("seeds every same-side usage move and selects usage above 50% or super-effective moves", async () => {
    setChampionsMoveUsageFetcherForTest(async (battlePokemonId) => [
      { battlePokemonId, moveId: 182, format: "Doubles", season: "test", source: "test", rank: 1, percentage: 90, championsMoveName: "Protect" },
      { battlePokemonId, moveId: 317, format: "Doubles", season: "test", source: "test", rank: 2, percentage: 80, championsMoveName: "Rock Tomb" },
      { battlePokemonId, moveId: 53, format: "Doubles", season: "test", source: "test", rank: 3, percentage: 70, championsMoveName: "Flamethrower" },
      { battlePokemonId, moveId: 89, format: "Doubles", season: "test", source: "test", rank: 4, percentage: 60, championsMoveName: "Earthquake" },
      { battlePokemonId, moveId: 337, format: "Doubles", season: "test", source: "test", rank: 5, percentage: 50, championsMoveName: "Dragon Claw" },
      { battlePokemonId, moveId: 157, format: "Doubles", season: "test", source: "test", rank: 6, percentage: 40, championsMoveName: "Rock Slide" },
      { battlePokemonId, moveId: 707, format: "Doubles", season: "test", source: "test", rank: 7, percentage: 30, championsMoveName: "Stomping Tantrum" },
      { battlePokemonId, moveId: 398, format: "Doubles", season: "test", source: "test", rank: 8, percentage: 20, championsMoveName: "Poison Jab" },
      { battlePokemonId, moveId: 200, format: "Doubles", season: "test", source: "test", rank: 9, percentage: 10, championsMoveName: "Outrage" },
      { battlePokemonId, moveId: 242, format: "Doubles", season: "test", source: "test", rank: 10, percentage: 5, championsMoveName: "Crunch" },
      { battlePokemonId, moveId: 444, format: "Doubles", season: "test", source: "test", rank: 11, percentage: 4, championsMoveName: "Stone Edge" },
    ])

    const shell = await getCatalogShell(445, 727, "en", "physical")
    const catalog = await resolveCatalogDefaultMovePick(shell)
    const usageIds = [317, 89, 337, 157, 707, 398, 200, 242]

    expect(catalog.moves.slice(0, usageIds.length).map((move) => move.id)).toEqual(usageIds)
    expect(catalog.defaultMovePoolIds).toEqual(usageIds)
    expect(catalog.defaultMoveIds).toEqual([317, 89, 157, 707])
    expect(catalog.moves.slice(usageIds.length).map((move) => move.id)).toEqual(
      shell.moves.filter((move) => !usageIds.includes(move.id)).map((move) => move.id),
    )
    expect(catalog.moves.map((move) => move.id).toSorted((a, b) => a - b)).toEqual(
      shell.moves.map((move) => move.id).toSorted((a, b) => a - b),
    )
  })

  it("keeps the global order when the attacker has no usage data", async () => {
    setChampionsMoveUsageFetcherForTest(async () => [])

    const shell = await getCatalogShell(1, 727, "en", "physical")
    const catalog = await resolveCatalogDefaultMovePick(shell)

    expect(catalog.moves).toEqual(shell.moves)
    expect(catalog.defaultMovePoolIds).toEqual([])
    expect(catalog.defaultMoveIds).toEqual([])
  })
})

describe("catalog Held-item candidates", () => {
  it("uses category-independent attacker and defender pools", async () => {
    const [physical, special] = await Promise.all([
      getCatalogShell(445, 727, "en", "physical"),
      getCatalogShell(445, 727, "en", "special"),
    ])
    const attackerIds = ["none", ...ATTACKER_HELD_ITEM_IDS]
    const defenderIds = ["none", ...DEFENDER_HELD_ITEM_IDS]

    expect(physical.attackerItems.map((item) => item.id)).toEqual(attackerIds)
    expect(special.attackerItems.map((item) => item.id)).toEqual(attackerIds)
    expect(physical.defenderItems.map((item) => item.id)).toEqual(defenderIds)
    expect(special.defenderItems.map((item) => item.id)).toEqual(defenderIds)
    expect(physical.defaultAttackerItemIds).toEqual(["none"])
    expect(physical.defaultDefenderItemIds).toEqual(["none"])
    expect(physical.attackerLockedItemId).toBeNull()
    expect(physical.defenderLockedItemId).toBeNull()
  })

  it("exposes exactly the required Mega or Ogerpon lock", async () => {
    const [knownMega, unknownMega, ogerpon] = await Promise.all([
      getCatalogShell(10034, 727, "en"),
      getCatalogShell(10301, 727, "en"),
      getCatalogShell(10273, 10274, "en"),
    ])

    expect(knownMega.attackerItems.map((item) => item.id)).toEqual([699])
    expect(knownMega.defaultAttackerItemIds).toEqual([699])
    expect(knownMega.attackerLockedItemId).toBe(699)
    expect(unknownMega.attackerItems.map((item) => item.id)).toEqual([
      UNKNOWN_MEGA_STONE_ID,
    ])
    expect(ogerpon.attackerItems.map((item) => item.id)).toEqual([2106])
    expect(ogerpon.defenderItems.map((item) => item.id)).toEqual([2107])
    expect(ogerpon.defaultAttackerItemIds).toEqual([2106])
    expect(ogerpon.defaultDefenderItemIds).toEqual([2107])
    expect(ogerpon.attackerLockedItemId).toBe(2106)
    expect(ogerpon.defenderLockedItemId).toBe(2107)
  })

  it("keeps Mega Rayquaza unlocked with the ordinary default", async () => {
    const catalog = await getCatalogShell(10079, 727, "en")

    expect(catalog.attackerItems.map((item) => item.id)).toEqual([
      "none",
      ...ATTACKER_HELD_ITEM_IDS,
    ])
    expect(catalog.defaultAttackerItemIds).toEqual(["none"])
    expect(catalog.attackerLockedItemId).toBeNull()
    expect(catalog.attackerPreservesItem).toBe(true)
  })
})

describe("catalog ability candidates and defaults", () => {
  it("lists localized current abilities in PokeAPI slot order, including hidden abilities", async () => {
    const catalog = await getCatalogShell(445, 94, "en")

    expect(catalog.attackerAbilities).toEqual([
      { id: 8, label: "Sand Veil", summary: "" },
      { id: 24, label: "Rough Skin", summary: "" },
    ])
    expect(catalog.defenderAbilities.map((ability) => ability.id)).not.toContain(26)
    expect(catalog.defaultAttackerAbilityIds).toEqual([8, 24])
    expect(catalog.defaultAbilityPickStatus).toBe("loading")
  })

  it("selects the first ranked legal Champions ability for each side", async () => {
    setChampionsAbilityUsageFetcherForTest(async (battlePokemonId) =>
      battlePokemonId === 445
        ? [
            { battlePokemonId, abilityId: 91, format: "Doubles", season: "test", source: "test", rank: 1, percentage: 80, championsAbilityName: "Adaptability" },
            { battlePokemonId, abilityId: 24, format: "Doubles", season: "test", source: "test", rank: 2, percentage: 20, championsAbilityName: "Rough Skin" },
          ]
        : [
            { battlePokemonId, abilityId: 22, format: "Doubles", season: "test", source: "test", rank: 1, percentage: 90, championsAbilityName: "Intimidate" },
          ],
    )

    const catalog = await resolveCatalogDefaultMovePick(
      await getCatalogShell(445, 727, "en"),
    )

    expect(catalog.defaultAbilityPickStatus).toBe("ready")
    expect(catalog.defaultAttackerAbilityIds).toEqual([24])
    expect(catalog.defaultDefenderAbilityIds).toEqual([22])
  })

  it("selects every legal ability when usage is unavailable or has no legal match", async () => {
    setChampionsAbilityUsageFetcherForTest(async (battlePokemonId) => {
      if (battlePokemonId === 445) throw new Error("unavailable")
      return [{ battlePokemonId, abilityId: 91, format: "Doubles", season: "test", source: "test", rank: 1, percentage: 100, championsAbilityName: "Adaptability" }]
    })

    const catalog = await resolveCatalogDefaultMovePick(
      await getCatalogShell(445, 727, "en"),
    )

    expect(catalog.defaultAttackerAbilityIds).toEqual(
      catalog.attackerAbilities.map((ability) => ability.id),
    )
    expect(catalog.defaultDefenderAbilityIds).toEqual(
      catalog.defenderAbilities.map((ability) => ability.id),
    )
  })

  it("falls back to every legal ability when usage never responds", async () => {
    vi.useFakeTimers()
    setChampionsAbilityUsageFetcherForTest(() => new Promise(() => {}))

    const result = resolveCatalogDefaultMovePick(await getCatalogShell(445, 727, "en"))
    await vi.advanceTimersByTimeAsync(5_000)
    const catalog = await result

    expect(catalog.defaultAttackerAbilityIds).toEqual(
      catalog.attackerAbilities.map((ability) => ability.id),
    )
    expect(catalog.defaultDefenderAbilityIds).toEqual(
      catalog.defenderAbilities.map((ability) => ability.id),
    )
  })
})
