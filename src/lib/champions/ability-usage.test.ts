import { afterEach, expect, it } from "vitest"

import {
  listChampionsAbilityUsageRecords,
  resetChampionsAbilityUsageFetcherForTest,
  setChampionsAbilityUsageFetcherForTest,
} from "@/lib/champions"

afterEach(resetChampionsAbilityUsageFetcherForTest)

it("supports an injected, per-identity cached ability usage source", async () => {
  let calls = 0
  setChampionsAbilityUsageFetcherForTest(async (battlePokemonId) => {
    calls += 1
    return [{
      battlePokemonId,
      abilityId: 91,
      format: "Doubles",
      season: "test",
      source: "test",
      rank: 1,
      percentage: 100,
      championsAbilityName: "Adaptability",
    }]
  })

  const [first, second] = await Promise.all([
    listChampionsAbilityUsageRecords(133),
    listChampionsAbilityUsageRecords(133),
  ])

  expect(first).toEqual(second)
  expect(calls).toBe(1)
})
