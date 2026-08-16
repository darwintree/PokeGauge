import { afterEach, describe, expect, it, vi } from "vitest"

import {
  resetChampionsPokemonUsageFetcherForTest,
  setChampionsPokemonUsageFetcherForTest,
} from "@/lib/champions"
import {
  listAttackers,
  rankPokemonOptionsByChampionsUsage,
} from "@/lib/catalog"

afterEach(() => {
  resetChampionsPokemonUsageFetcherForTest()
})

describe("Pokemon option ranking", () => {
  it("loads local options before requesting Champions usage", async () => {
    const fetchUsage = vi.fn(() => new Promise<number[]>(() => {}))
    setChampionsPokemonUsageFetcherForTest(fetchUsage)

    const options = await listAttackers("ja")

    expect(options.length).toBeGreaterThan(0)
    expect(fetchUsage).not.toHaveBeenCalled()
  })

  it("applies Champions usage order when ranking is requested", async () => {
    setChampionsPokemonUsageFetcherForTest(async () => [727, 445])
    const options = await listAttackers("en")

    const ranked = await rankPokemonOptionsByChampionsUsage(options)

    expect(ranked.slice(0, 2).map((option) => option.id)).toEqual([727, 445])
  })

  it("ranks Mega forms directly after their base form", async () => {
    setChampionsPokemonUsageFetcherForTest(async () => [6])
    const options = await listAttackers("en")

    const ranked = await rankPokemonOptionsByChampionsUsage(options)

    expect(ranked.slice(0, 3).map((option) => option.id)).toEqual([6, 10034, 10035])
    expect(ranked.filter((option) => option.id === 10034)).toHaveLength(1)
  })

  it("keeps default order when usage is empty", async () => {
    setChampionsPokemonUsageFetcherForTest(async () => [])
    const options = await listAttackers("en")
    const ranked = await rankPokemonOptionsByChampionsUsage(options)
    expect(ranked.map((option) => option.id)).toEqual(options.map((option) => option.id))
  })

  it("rejects when Champions usage fails", async () => {
    setChampionsPokemonUsageFetcherForTest(async () => {
      throw new Error("offline")
    })
    const options = await listAttackers("en")
    await expect(rankPokemonOptionsByChampionsUsage(options)).rejects.toThrow("offline")
  })
})
