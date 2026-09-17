import { afterEach, expect, it, vi } from "vitest"

import {
  listChampionsAbilityUsageRecords,
  listChampionsItemUsageRecords,
  listChampionsMoveUsageRecords,
  listChampionsNatureUsageRecords,
  listChampionsPokemonUsageIds,
  resetChampionsJsonFetcherForTest,
  setChampionsJsonFetcherForTest,
  setUsageSource,
} from "@/lib/champions"

afterEach(() => {
  vi.unstubAllGlobals()
  resetChampionsJsonFetcherForTest()
  setUsageSource("champions")
})

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

it("fetches battle rows for the selected Champions season", async () => {
  setChampionsJsonFetcherForTest(async (url) => {
    if (url === "https://championsbattledata.com/api") {
      return {
        defaultSeason: "Current",
        seasons: ["Current", "M6", "M5"],
        pokemon: [{
          name: "Charizard",
          slug: "charizard",
          battleName: "Charizard",
        }],
      }
    }
    if (url.includes("season=M6")) {
      return {
        pokemon: "Charizard",
        format: "Doubles",
        season: "M6",
        source: "M6.csv",
        rows: [{ category: "move", rank: 1, name: "Flamethrower", percentage_value: 10 }],
      }
    }
    throw new Error(`unexpected Champions URL: ${url}`)
  })
  setUsageSource("champions", "M6")
  await expect(listChampionsMoveUsageRecords(6)).resolves.toEqual([
    expect.objectContaining({ season: "M6", championsMoveName: "Flamethrower" }),
  ])
  setUsageSource("champions")
})

it.each([
  ["Rillaboom", 812],
  ["Charizard", 6],
  ["Pikachu", 25],
  ["Toxtricity-Low-Key", 10184],
])("resolves ranked %s usage to its selectable battle identity", async (name, id) => {
  setChampionsJsonFetcherForTest(async () => ({
    defaultSeason: "Current",
    pokemon: [{
      name,
      slug: name.toLowerCase(),
      battleName: name,
      showdownId: name.toLowerCase(),
      showdownName: name,
      summary: { battleSummary: { Current: { Doubles: {
        top: { move: { position: 2, column_position: 2 } },
      } } } },
    }],
  }))

  await expect(listChampionsPokemonUsageIds()).resolves.toEqual([id])
})

it("ranks a historical Champions season from battle row positions, not Current summaries", async () => {
  const storage = new Map<string, string>()
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, value)
    },
  })
  const battleCalls: string[] = []
  setChampionsJsonFetcherForTest(async (url) => {
    if (url === "https://championsbattledata.com/api") {
      return {
        defaultSeason: "Current",
        seasons: ["Current", "M4"],
        pokemon: [
          {
            name: "Pikachu",
            slug: "pikachu",
            battleName: "Pikachu",
            showdownName: "Pikachu",
            summary: { battleSummary: { Current: { Doubles: {
              top: { move: { position: 1, column_position: 1 } },
            } } } },
          },
          {
            name: "Charizard",
            slug: "charizard",
            battleName: "Charizard",
            showdownName: "Charizard",
            summary: { battleSummary: { Current: { Doubles: {
              top: { move: { position: 2, column_position: 2 } },
            } } } },
          },
        ],
      }
    }
    battleCalls.push(url)
    if (url.includes("season=M4") && url.includes("Pikachu")) {
      return {
        pokemon: "Pikachu",
        format: "Doubles",
        season: "M4",
        source: "M4.csv",
        rows: [{ category: "move", rank: 1, name: "Thunderbolt", column_position: 8 }],
      }
    }
    if (url.includes("season=M4") && url.includes("Charizard")) {
      return {
        pokemon: "Charizard",
        format: "Doubles",
        season: "M4",
        source: "M4.csv",
        rows: [{ category: "move", rank: 1, name: "Flamethrower", column_position: 1 }],
      }
    }
    throw new Error(`unexpected Champions URL: ${url}`)
  })
  setUsageSource("champions", "M4")

  await expect(listChampionsPokemonUsageIds()).resolves.toEqual([6, 25])
  expect(battleCalls).toHaveLength(2)
})

it("maps Pikalytics Rillaboom to the selectable species instead of Gigantamax", async () => {
  vi.stubGlobal("localStorage", {
    getItem: () => null,
    setItem: () => {},
  })
  setChampionsJsonFetcherForTest(async (url) => {
    if (url.includes("/api/pikalytics/")) {
      return {
        format: "gen9championsvgc2026regmc-1760",
        date: "2026-05",
        data: [
          { name: "Rillaboom", rank: "1", percent: "37.61" },
          { name: "Sneasler", rank: "2", percent: "36.64" },
        ],
      }
    }
    throw new Error(`unexpected URL: ${url}`)
  })
  setUsageSource("pikalytics", "gen9championsvgc2026regmc-1760", { pikalyticsDate: "2026-05" })

  await expect(listChampionsPokemonUsageIds()).resolves.toEqual([812, 903])
})

it("shares a Smogon download across detail categories and retries failed downloads", async () => {
  setUsageSource("smogon", "2026-08/gen9ou-0")
  const fetcher = vi.fn(async () => ({ data: { Garchomp: { Items: { "Life Orb": 80 }, Spreads: { "Adamant:0/252/0/0/4/252": 60 } } } }))
  fetcher.mockRejectedValueOnce(new Error("offline"))
  setChampionsJsonFetcherForTest(fetcher)
  await expect(listChampionsItemUsageRecords(445)).rejects.toThrow("offline")
  const [items, natures] = await Promise.all([
    listChampionsItemUsageRecords(445),
    listChampionsNatureUsageRecords(445),
  ])
  expect(items[0]?.championsItemName).toBe("Life Orb")
  expect(natures[0]?.nature).toBe("Adamant")
  expect(fetcher).toHaveBeenCalledTimes(2)
})

it.each([
  ["smogon", true], ["smogon", false],
  ["pikalytics", true], ["pikalytics", false],
] as const)("reads Mega usage from the base identity for %s (compiled: %s)", async (source, compiled) => {
  const { setUsageArtifactFetcherForTest, resetUsageArtifactCache } = await import("./artifact-client")
  const { listResources } = await import("@/lib/resources")
  await Promise.all([listResources("move", "en"), listResources("ability", "en")])
  const rule = source === "smogon" ? "2026-08/gen9championsvgc2026regmb-0" : "battledataregmbs3-1760"
  setUsageSource(source, rule, { pikalyticsDate: "2026-05" })
  setUsageArtifactFetcherForTest(async () => compiled ? {
    source, rule, format: "Doubles", dataVersion: "test", generatedAt: "2026-09-17",
    ranking: [445, 10058], pokemon: {
      445: { m: [["Earthquake", 80]], a: [["Rough Skin", 100]], i: [["Life Orb", 50]], n: [["Jolly", 60]] },
      10058: { m: [["Dragon Claw", 100]] },
    },
  } : null)
  const fetcher = vi.fn(async (url: string) => {
    if (url.startsWith("/api/smogon/")) return { data: {
      Garchomp: { Moves: { Earthquake: 80 }, Abilities: { "Rough Skin": 100 }, Items: { "Life Orb": 50 }, Spreads: { "Jolly:0/252/0/0/4/252": 60 } },
      "Garchomp-Mega": { Moves: { "Dragon Claw": 100 } },
    } }
    if (url.includes("/api/pikalytics/l/")) return { data: [{ name: "Garchomp", rank: "1" }, { name: "Garchomp-Mega", rank: "2" }] }
    if (url.endsWith("/Garchomp")) return { data: {
      moves: [{ move: "Earthquake", percent: "80" }], abilities: [{ ability: "Rough Skin", percent: "100" }],
      items: [{ item: "Life Orb", percent: "50" }], natures: [{ nature: "Jolly", percent: "60" }],
    } }
    throw new Error(`Unexpected URL: ${url}`)
  })
  setChampionsJsonFetcherForTest(fetcher)
  try {
    const [moves, abilities, items, natures] = await Promise.all([
      listChampionsMoveUsageRecords(10058), listChampionsAbilityUsageRecords(10058),
      listChampionsItemUsageRecords(10058), listChampionsNatureUsageRecords(10058),
    ])
    expect(moves).toEqual([expect.objectContaining({ battlePokemonId: 10058, championsMoveName: "Earthquake" })])
    expect(abilities).toEqual([expect.objectContaining({ battlePokemonId: 10058, championsAbilityName: "Rough Skin" })])
    expect(items).toEqual([expect.objectContaining({ battlePokemonId: 10058, championsItemName: "Life Orb" })])
    expect(natures).toEqual([expect.objectContaining({ battlePokemonId: 10058, nature: "Jolly" })])
    if (compiled) expect(fetcher).not.toHaveBeenCalled()
    else expect(fetcher).toHaveBeenCalledTimes(source === "pikalytics" ? 2 : 1)
  } finally {
    resetUsageArtifactCache()
  }
})

it.each([
  ["smogon", true], ["smogon", false],
  ["pikalytics", true], ["pikalytics", false],
] as const)("uses the selected Mega's statistics when its base is absent for %s (compiled: %s)", async (source, compiled) => {
  const { setUsageArtifactFetcherForTest, resetUsageArtifactCache } = await import("./artifact-client")
  const { listResources } = await import("@/lib/resources")
  await listResources("move", "en")
  const rule = source === "smogon" ? "2026-08/gen9championsvgc2026regmbbo3-1760" : "championstournaments-1760"
  setUsageSource(source, rule, { pikalyticsDate: "2026-05" })
  setUsageArtifactFetcherForTest(async () => compiled ? {
    source, rule, format: "Doubles", dataVersion: "test", generatedAt: "2026-09-17",
    ranking: [10035], pokemon: { 10035: { m: [["heatwave", 95]], n: [["Modest", 80]] } },
  } : null)
  setChampionsJsonFetcherForTest(async url => {
    if (url.startsWith("/api/smogon/")) return { data: {
      "Charizard-Mega-Y": { Moves: { heatwave: 95 }, Spreads: { "Modest:0/0/0/252/4/252": 80 } },
    } }
    if (url.includes("/api/pikalytics/l/")) return { data: [{ name: "Charizard-Mega-Y", rank: "1" }] }
    if (url.endsWith("/Charizard-Mega-Y")) return { data: {
      moves: [{ move: "Heat Wave", percent: "95" }], natures: [{ nature: "Modest", percent: "80" }],
    } }
    throw new Error(`Unexpected URL: ${url}`)
  })
  try {
    const [moves, natures] = await Promise.all([
      listChampionsMoveUsageRecords(10035), listChampionsNatureUsageRecords(10035),
    ])
    expect(moves).toEqual([expect.objectContaining({ battlePokemonId: 10035, moveId: 257 })])
    expect(natures).toEqual([expect.objectContaining({ battlePokemonId: 10035, nature: "Modest" })])
  } finally {
    resetUsageArtifactCache()
  }
})
