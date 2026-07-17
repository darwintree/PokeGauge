import { afterEach, describe, expect, it } from "vitest"

import {
  resetChampionsMoveUsageFetcherForTest,
  setChampionsMoveUsageFetcherForTest,
} from "@/lib/champions"
import { getCatalogShell, resolveCatalogDefaultMovePick } from "@/lib/catalog"

afterEach(() => {
  resetChampionsMoveUsageFetcherForTest()
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

  it("puts same-side usage moves first without changing candidate eligibility or fallback order", async () => {
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
    ])

    const shell = await getCatalogShell(445, 727, "en", "physical")
    const catalog = await resolveCatalogDefaultMovePick(shell)
    const usageIds = [317, 89, 337, 157, 707, 398, 200]

    expect(catalog.moves.slice(0, usageIds.length).map((move) => move.id)).toEqual(usageIds)
    expect(catalog.defaultMoveIds).toEqual(usageIds.slice(0, 6))
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
    expect(catalog.defaultMoveIds).toEqual([])
  })
})
