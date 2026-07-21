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

  it("applies Champions usage order in the background", async () => {
    setChampionsPokemonUsageFetcherForTest(async () => [727, 445])
    const options = await listAttackers("en")

    const ranked = await rankPokemonOptionsByChampionsUsage(options)

    expect(ranked.slice(0, 2).map((option) => option.id)).toEqual([727, 445])
  })
})
