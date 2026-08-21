import { afterEach, expect, it } from "vitest"

import {
  listChampionsAbilityUsageRecords,
  listChampionsItemUsageRecords,
  listChampionsMoveUsageRecords,
  listChampionsNatureUsageRecords,
  resetChampionsJsonFetcherForTest,
  setChampionsJsonFetcherForTest,
} from "@/lib/champions"

afterEach(resetChampionsJsonFetcherForTest)

function championsFixture(): {
  fetcher: (url: string) => Promise<unknown>
  calls: { index: number; battle: number }
} {
  const calls = { index: 0, battle: 0 }
  const fetcher = async (url: string): Promise<unknown> => {
    if (url === "https://championsbattledata.com/api") {
      calls.index += 1
      return {
        defaultSeason: "Current",
        dataVersion: "20260729090313995",
        pokemon: [{
          name: "Charizard",
          slug: "charizard",
          battleName: "Charizard",
          battleDataCsvs: [{ season: "M4", format: "Doubles", path: "M4" }],
        }],
      }
    }
    if (
      url ===
      "https://championsbattledata.com/api/battle/Doubles/Charizard?season=Current"
    ) {
      calls.battle += 1
      return {
        pokemon: "Charizard",
        format: "Doubles",
        season: "Current",
        source: "pokemon_champions_assets/battle_data/Doubles/Charizard.csv",
        rows: [
          { category: "move", rank: 1, name: "Flamethrower", percentage_value: 90 },
          { category: "move", rank: 2, name: "Dragon Claw", percentage_value: 80 },
          { category: "ability", rank: 1, name: "Blaze", percentage_value: 100 },
          { category: "stat_alignment", rank: 1, name: "Modest", percentage_value: 70 },
          { category: "held_item", rank: 1, name: "Charizardite Y", percentage_value: 95 },
          { category: "held_item", rank: 2, name: "Life Orb", percentage_value: 3 },
          { category: "held_item", rank: 3, name: "nothing", percentage_value: 1 },
          { category: "held_item", rank: 4, name: "Unknown Relic", percentage_value: 0.5 },
        ],
      }
    }
    throw new Error(`unexpected Champions URL: ${url}`)
  }
  return { fetcher, calls }
}

it("inherits base species usage rows for Mega identities via the index default season", async () => {
  const { fetcher, calls } = championsFixture()
  setChampionsJsonFetcherForTest(fetcher)

  const megaX = await listChampionsMoveUsageRecords(10034)
  const megaY = await listChampionsMoveUsageRecords(10035)
  const base = await listChampionsMoveUsageRecords(6)

  expect(megaX).toEqual([
    expect.objectContaining({
      battlePokemonId: 10034,
      moveId: 53,
      season: "Current",
      source: "pokemon_champions_assets/battle_data/Doubles/Charizard.csv",
      dataVersion: "20260729090313995",
      rank: 1,
      percentage: 90,
      championsMoveName: "Flamethrower",
    }),
    expect.objectContaining({
      battlePokemonId: 10034,
      moveId: 337,
      season: "Current",
      dataVersion: "20260729090313995",
      rank: 2,
      championsMoveName: "Dragon Claw",
    }),
  ])
  expect(megaY.map((record) => record.battlePokemonId)).toEqual([10035, 10035])
  expect(base.map((record) => record.battlePokemonId)).toEqual([6, 6])
  expect(calls.battle).toBe(1)
  expect(calls.index).toBe(1)
})

it("shares one battle rows fetch between move, ability, and nature consumers", async () => {
  const { fetcher, calls } = championsFixture()
  setChampionsJsonFetcherForTest(fetcher)

  const [moves, abilities, natures] = await Promise.all([
    listChampionsMoveUsageRecords(10034),
    listChampionsAbilityUsageRecords(10034),
    listChampionsNatureUsageRecords(10034),
  ])

  expect(moves.map((record) => record.moveId)).toEqual([53, 337])
  expect(abilities.map((record) => record.abilityId)).toEqual([66])
  expect(natures).toEqual([
    expect.objectContaining({
      battlePokemonId: 10034,
      nature: "Modest",
      rank: 1,
      percentage: 70,
      dataVersion: "20260729090313995",
    }),
  ])
  expect(calls.battle).toBe(1)
  expect(calls.index).toBe(1)
})

it("returns no usage rows when the base species has no Champions entry", async () => {
  const { fetcher } = championsFixture()
  setChampionsJsonFetcherForTest(fetcher)

  await expect(listChampionsMoveUsageRecords(10043)).resolves.toEqual([])
})

it("matches form usage by Showdown name", async () => {
  setChampionsJsonFetcherForTest(async (url) => {
    if (url === "https://championsbattledata.com/api") {
      return {
        defaultSeason: "Current",
        pokemon: [{
          name: "Basculegion Male",
          slug: "basculegion-male",
          battleName: "Basculegion Male",
          showdownId: "basculegion",
          showdownName: "Basculegion",
        }],
      }
    }
    if (
      url ===
      "https://championsbattledata.com/api/battle/Doubles/Basculegion%20Male?season=Current"
    ) {
      return {
        pokemon: "Basculegion Male",
        format: "Doubles",
        season: "Current",
        source: "Basculegion Male.csv",
        rows: [{ category: "move", rank: 1, name: "Last Respects", percentage_value: 99.9 }],
      }
    }
    throw new Error(`unexpected Champions URL: ${url}`)
  })

  await expect(listChampionsMoveUsageRecords(902)).resolves.toEqual([
    expect.objectContaining({
      battlePokemonId: 902,
      championsMoveName: "Last Respects",
      percentage: 99.9,
    }),
  ])
})

it("inherits base species held-item usage rows for Mega identities", async () => {
  const { fetcher, calls } = championsFixture()
  setChampionsJsonFetcherForTest(fetcher)

  const megaX = await listChampionsItemUsageRecords(10034)
  const megaY = await listChampionsItemUsageRecords(10035)
  const base = await listChampionsItemUsageRecords(6)

  expect(megaX).toEqual([
    expect.objectContaining({
      battlePokemonId: 10034,
      itemId: 717,
      season: "Current",
      source: "pokemon_champions_assets/battle_data/Doubles/Charizard.csv",
      dataVersion: "20260729090313995",
      rank: 1,
      percentage: 95,
      championsItemName: "Charizardite Y",
    }),
    expect.objectContaining({
      battlePokemonId: 10034,
      itemId: 247,
      rank: 2,
      championsItemName: "Life Orb",
    }),
    expect.objectContaining({
      battlePokemonId: 10034,
      itemId: null,
      rank: 3,
      championsItemName: "nothing",
    }),
    expect.objectContaining({
      battlePokemonId: 10034,
      itemId: null,
      rank: 4,
      championsItemName: "Unknown Relic",
    }),
  ])
  expect(megaY.map((record) => record.battlePokemonId)).toEqual([
    10035, 10035, 10035, 10035,
  ])
  expect(base.map((record) => record.itemId)).toEqual([717, 247, null, null])
  expect(calls.battle).toBe(1)
})

it("shares one battle rows fetch between move and item consumers", async () => {
  const { fetcher, calls } = championsFixture()
  setChampionsJsonFetcherForTest(fetcher)

  const [moves, items] = await Promise.all([
    listChampionsMoveUsageRecords(6),
    listChampionsItemUsageRecords(6),
  ])

  expect(moves.map((record) => record.moveId)).toEqual([53, 337])
  expect(items.map((record) => record.itemId)).toEqual([717, 247, null, null])
  expect(calls.battle).toBe(1)
})

it("returns no held-item usage rows when the base species has no Champions entry", async () => {
  const { fetcher } = championsFixture()
  setChampionsJsonFetcherForTest(fetcher)

  await expect(listChampionsItemUsageRecords(10043)).resolves.toEqual([])
})
