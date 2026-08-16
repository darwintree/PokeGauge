import { afterEach, describe, expect, it } from "vitest"

import {
  resetChampionsMoveUsageFetcherForTest,
  setChampionsMoveUsageFetcherForTest,
  type ChampionsMoveUsageRecord,
} from "@/lib/champions"
import { rankMoveOptionsByChampionsUsage, type CatalogMoveOption } from "@/lib/catalog"

afterEach(() => {
  resetChampionsMoveUsageFetcherForTest()
})

function move(id: number, power = id): CatalogMoveOption {
  return {
    id,
    label: String(id),
    summary: "",
    moveName: String(id),
    type: "normal",
    category: "physical",
    power,
    accuracy: 100,
    isSpread: false,
  }
}

function record(moveId: number, rank: number): ChampionsMoveUsageRecord {
  return {
    battlePokemonId: 445,
    moveId,
    format: "Doubles",
    season: "test",
    source: "test",
    dataVersion: "test",
    rank,
    percentage: 50,
    championsMoveName: String(moveId),
  }
}

describe("Move option ranking", () => {
  it("keeps the given order when usage is empty", async () => {
    setChampionsMoveUsageFetcherForTest(async () => [])
    const options = [move(3, 40), move(1, 120), move(2, 80)]
    const ranked = await rankMoveOptionsByChampionsUsage(445, options)
    expect(ranked.map((option) => option.id)).toEqual([3, 1, 2])
  })

  it("prefixes every matching usage move, not a top-10 slice", async () => {
    setChampionsMoveUsageFetcherForTest(async () =>
      Array.from({ length: 12 }, (_, index) => record(index + 1, index + 1)),
    )
    const options = Array.from({ length: 12 }, (_, index) => move(index + 1))
    const ranked = await rankMoveOptionsByChampionsUsage(445, options)
    expect(ranked.map((option) => option.id)).toEqual(
      Array.from({ length: 12 }, (_, index) => index + 1),
    )
  })

  it("drops usage ids that are not in the pool and keeps the rest in input order", async () => {
    setChampionsMoveUsageFetcherForTest(async () => [record(89, 1), record(999, 2), record(33, 3)])
    const options = [move(33, 40), move(89, 100), move(200, 120)]
    const ranked = await rankMoveOptionsByChampionsUsage(445, options)
    expect(ranked.map((option) => option.id)).toEqual([89, 33, 200])
  })

  it("rejects when Champions usage fails", async () => {
    setChampionsMoveUsageFetcherForTest(async () => {
      throw new Error("offline")
    })
    await expect(rankMoveOptionsByChampionsUsage(445, [move(33)])).rejects.toThrow("offline")
  })
})
