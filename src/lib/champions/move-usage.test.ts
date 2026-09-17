import { afterEach, expect, it, vi } from "vitest"
import {
  listChampionsAbilityUsageRecords, listChampionsItemUsageRecords, listChampionsMoveUsageRecords,
  listChampionsNatureUsageRecords, listChampionsPokemonUsageIds,
  resetChampionsJsonFetcherForTest, setChampionsJsonFetcherForTest, setUsageSource,
} from "@/lib/champions"
import { loadUsageCache } from "../usage-source-preference"
import { fetchUsageRanking, reloadUsageData } from "./move-usage"

const detail = {
  m: [["Flamethrower", 90], ["Unknown Move", 1], ["Dragon Claw", null]],
  a: [["Blaze", 100]], i: [["Life Orb", 3], ["nothing", 1], ["Unknown Relic", 0.5]], n: [["Modest", 70]],
}
const readers = [listChampionsMoveUsageRecords, listChampionsAbilityUsageRecords, listChampionsItemUsageRecords, listChampionsNatureUsageRecords]
afterEach(() => { vi.unstubAllGlobals(); resetChampionsJsonFetcherForTest(); setUsageSource("champions") })

it.each(["champions", "smogon", "pikalytics"] as const)("shares a single %s request across all four detail consumers", async source => {
  setUsageSource(source, "test", { pikalyticsDate: "2026-08" })
  const fetcher = vi.fn(async () => detail)
  setChampionsJsonFetcherForTest(fetcher)
  const [moves, abilities, items, natures] = await Promise.all(readers.map(read => read(10035)))
  expect(fetcher.mock.calls).toHaveLength(1)
  expect(moves).toMatchObject([
    { battlePokemonId: 10035, moveId: 53, rank: 1, percentage: 90 },
    { battlePokemonId: 10035, moveId: 337, rank: 3, percentage: null },
  ])
  expect(abilities).toMatchObject([{ abilityId: 66 }])
  expect(items).toMatchObject([{ itemId: 247 }, { itemId: null }, { itemId: null }])
  expect(natures).toMatchObject([{ nature: "Modest" }])
})

it("keeps successful empty detail cached and retries failed requests", async () => {
  const fetcher = vi.fn().mockRejectedValueOnce(new Error("upstream down")).mockResolvedValue({})
  setChampionsJsonFetcherForTest(fetcher)
  expect((await Promise.allSettled(readers.map(read => read(6)))).every(result => result.status === "rejected")).toBe(true)
  expect(await Promise.all(readers.map(read => read(6)))).toEqual([[], [], [], []])
  await listChampionsMoveUsageRecords(6)
  expect(fetcher).toHaveBeenCalledTimes(2)
})

it("captures rule/date before awaiting and isolates a changed selection", async () => {
  let resolveOld!: (value: unknown) => void
  const fetcher = vi.fn((url: string) => url.includes("date=2026-07")
    ? new Promise(resolve => { resolveOld = resolve }) : Promise.resolve(detail))
  setChampionsJsonFetcherForTest(fetcher)
  setUsageSource("pikalytics", "tournaments", { pikalyticsDate: "2026-07" })
  const old = listChampionsMoveUsageRecords(6)
  setUsageSource("pikalytics", "tournaments", { pikalyticsDate: "2026-08" })
  const current = await listChampionsMoveUsageRecords(6)
  resolveOld({ m: [["Protect", 100]] })
  expect(await old).toMatchObject([{ moveId: 182, dataVersion: "2026-07" }])
  expect(current[0]).toMatchObject({ moveId: 53, dataVersion: "2026-08" })
  expect(await listChampionsMoveUsageRecords(6)).toEqual(current)
  expect(fetcher.mock.calls.map(([url]) => url)).toEqual([
    "/api/usage/pokemon/pikalytics/6?rule=tournaments&date=2026-07",
    "/api/usage/pokemon/pikalytics/6?rule=tournaments&date=2026-08",
  ])
})

it("encodes Smogon rules and refreshes both ranking and details", async () => {
  const fetcher = vi.fn(async (url: string) => url.includes("/ranking/") ? { pokemonIds: [6, 25] } : detail)
  setChampionsJsonFetcherForTest(fetcher)
  setUsageSource("smogon", "2026-08/gen9championsvgc2026regmb-0")
  expect(await listChampionsPokemonUsageIds()).toEqual([6, 25])
  await listChampionsMoveUsageRecords(6)
  await listChampionsPokemonUsageIds()
  expect(fetcher).toHaveBeenCalledTimes(2)
  await fetchUsageRanking({ reload: true })
  await listChampionsMoveUsageRecords(6)
  expect(fetcher).toHaveBeenCalledTimes(4)
  expect(fetcher.mock.calls[0][0]).toContain("rule=2026-08%2Fgen9championsvgc2026regmb-0")
})

it("evicts a timed-out fetch so retry can make progress", async () => {
  const fetcher = vi.fn().mockImplementationOnce(async (_url, init) => {
    expect(init.signal).toBeInstanceOf(AbortSignal)
    throw new DOMException("Timed out", "TimeoutError")
  }).mockResolvedValue(Response.json(detail))
  vi.stubGlobal("fetch", fetcher)
  await expect(listChampionsMoveUsageRecords(6)).rejects.toThrow("Timed out")
  expect(await listChampionsMoveUsageRecords(6)).toHaveLength(2)
  reloadUsageData()
})

it("persists rankings independently for each Pikalytics month", async () => {
  const storage = new Map<string, string>()
  vi.stubGlobal("localStorage", { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) })
  setChampionsJsonFetcherForTest(async url => ({ pokemonIds: url.includes("2026-07") ? [6] : [445] }))
  setUsageSource("pikalytics", "tournaments", { pikalyticsDate: "2026-07" })
  expect(await listChampionsPokemonUsageIds()).toEqual([6])
  setUsageSource("pikalytics", "tournaments", { pikalyticsDate: "2026-08" })
  expect(await listChampionsPokemonUsageIds()).toEqual([445])
  expect(loadUsageCache("pikalytics", "tournaments", "2026-07")?.pokemonIds).toEqual([6])
  expect(loadUsageCache("pikalytics", "tournaments", "2026-08")?.pokemonIds).toEqual([445])
})
