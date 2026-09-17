import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { usageData } from "./usage"
import type { UsageArtifact } from "../src/lib/champions/usage-artifact"

const rule = "2026-08/gen9championsvgc2026regmb-0"
const ctx = { waitUntil: vi.fn() } as unknown as ExecutionContext
const noAssets = { ASSETS: { fetch: async () => new Response("missing", { status: 404 }) } } as unknown as Pick<Env, "ASSETS">
const request = (path: string) => new Request(`https://example.com/api/usage/${path}`)
function assets(snapshot: UsageArtifact, date?: string) {
  return { ASSETS: { fetch: async (req: Request) => Response.json(new URL(req.url).pathname.endsWith("manifest.json")
    ? { source: snapshot.source, defaultId: snapshot.rule, rules: [{ id: snapshot.rule, label: snapshot.rule }], compiledRules: [snapshot.rule], date }
    : snapshot) } } as unknown as Pick<Env, "ASSETS">
}
function snapshot(source = "smogon", selectedRule = rule): UsageArtifact {
  return { source, rule: selectedRule, format: "Doubles", dataVersion: "v1", generatedAt: "now", ranking: [6, 25], pokemon: { 6: { m: [["Flamethrower", 90]] } } }
}
function championsIndex() {
  return { defaultSeason: "Current", seasons: ["Current", "M6"], pokemon: [
    { name: "Basculegion Male", showdownName: "Basculegion", battleName: "Basculegion Male", summary: { battleSummary: { Current: { Doubles: { top: { move: { position: 1 } } } } } } },
    { name: "Charizard", showdownName: "Charizard", battleName: "Charizard", summary: { battleSummary: { Current: { Doubles: { top: { move: { column_position: 2 } } } } } } },
  ] }
}
const pikalyticsEntry = (name: string) => ({ name, moves: [{ move: "Earthquake", percent: "90.5" }], abilities: [], items: [], natures: [] })

beforeEach(() => { vi.stubGlobal("caches", undefined) })
afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks() })

it("reads compiled rankings, resolves the default rule, and prefers base Mega statistics", async () => {
  const env = assets(snapshot())
  expect(await (await usageData(request("ranking/smogon"), env, ctx)).json()).toEqual({ pokemonIds: [6, 25] })
  expect(await (await usageData(request(`pokemon/smogon/10035?rule=${rule}`), env, ctx)).json()).toEqual({ m: [["Flamethrower", 90]] })
})

it("uses the selected Mega only when the snapshot has no base record", async () => {
  const value = snapshot()
  value.pokemon = { 10034: { m: [["Dragon Claw", 70]] }, 10035: { m: [["Heat Wave", 80]] } }
  const read = () => usageData(request(`pokemon/smogon/10035?rule=${rule}`), assets(value), ctx).then(r => r.json())
  expect(await read()).toEqual({ m: [["Heat Wave", 80]] })
  value.pokemon[6] = {}
  expect(await read()).toEqual({})
})

it("serves a Current ranking snapshot and obtains the selected Mega detail dynamically", async () => {
  const value = snapshot("champions", "Current")
  delete value.pokemon
  const fetcher = vi.fn(async (url: string) => Response.json(url.endsWith("/api") ? championsIndex()
    : { data: [{ category: "move", name: "Flamethrower", rank: 1, percentage_value: 90 }] }))
  vi.stubGlobal("fetch", fetcher)
  const env = assets(value)
  expect(await (await usageData(request("ranking/champions?rule=Current"), env, ctx)).json()).toEqual({ pokemonIds: [6, 25] })
  expect(await (await usageData(request("pokemon/champions/10035?rule=Current"), env, ctx)).json()).toEqual({ m: [["Flamethrower", 90]] })
  expect(fetcher.mock.calls.map(([url]) => url)).toEqual([
    "https://championsbattledata.com/api/battle/Doubles/charizard?season=Current",
  ])
})

it("joins Showdown forms and ranks historical Champions by battle-row position", async () => {
  vi.stubGlobal("fetch", vi.fn(async (url: string) => Response.json(url.endsWith("/api") ? championsIndex()
    : { rows: [{ category: "move", name: "Protect", rank: 1, column_position: url.includes("Charizard") ? 1 : 2 }] })))
  expect(await (await usageData(request("ranking/champions?rule=Current"), noAssets, ctx)).json()).toEqual({ pokemonIds: [902, 6] })
  expect(await (await usageData(request("ranking/champions?rule=M6"), noAssets, ctx)).json()).toEqual({ pokemonIds: [6, 902] })
  expect(await (await usageData(request("pokemon/champions/902?rule=Current"), noAssets, ctx)).json()).toEqual({ m: [["Protect", null]] })
})

it("uses a Pikalytics roster to select base or distinct Mega entries and maps battle-only names", async () => {
  let roster = [{ name: "Garchomp", rank: "2" }, { name: "Rillaboom", rank: "1" }]
  const fetcher = vi.fn(async (url: string) => Response.json(url.includes("/api/l/") ? roster : pikalyticsEntry(url.split("/").at(-1)!)))
  vi.stubGlobal("fetch", fetcher)
  const read = (path: string) => usageData(request(`${path}?rule=tournaments&date=2026-08`), noAssets, ctx).then(r => r.json())
  expect(await read("ranking/pikalytics")).toEqual({ pokemonIds: [812, 445] })
  expect(await read("pokemon/pikalytics/10058")).toEqual({ m: [["Earthquake", 90.5]] })
  expect(fetcher.mock.calls.at(-1)?.[0]).toBe("https://www.pikalytics.com/api/p/2026-08/tournaments/Garchomp")
  roster = [{ name: "Charizard-Mega-X", rank: "1" }, { name: "Charizard-Mega-Y", rank: "2" }]
  await read("pokemon/pikalytics/10034")
  expect(fetcher.mock.calls.at(-1)?.[0]).toContain("/Charizard-Mega-X")
  await read("pokemon/pikalytics/10035")
  expect(fetcher.mock.calls.at(-1)?.[0]).toContain("/Charizard-Mega-Y")
})

it("honors the requested Pikalytics month when a different snapshot is deployed", async () => {
  const value = snapshot("pikalytics", "tournaments")
  delete value.pokemon
  vi.stubGlobal("fetch", vi.fn(async () => Response.json([{ name: "Garchomp", rank: "1" }])))
  const response = await usageData(request("ranking/pikalytics?rule=tournaments&date=2026-07"), assets(value, "2026-08"), ctx)
  expect(await response.json()).toEqual({ pokemonIds: [445] })
  expect(fetch).toHaveBeenCalledWith("https://www.pikalytics.com/api/l/2026-07/tournaments", expect.anything())
})

it("normalizes uncached Smogon data and falls back to a selected Mega", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => Response.json({ data: {
    "Charizard-Mega-Y": { usage: 0.3, Moves: { "Heat Wave": 90, Protect: 10 }, Spreads: { "Modest:1": 70, "Modest:2": 20, "Timid:1": 10 } },
  } })))
  const read = (path: string) => usageData(request(`${path}?rule=${rule}`), noAssets, ctx).then(r => r.json())
  expect(await read("ranking/smogon")).toEqual({ pokemonIds: [10035] })
  expect(await read("pokemon/smogon/10035")).toEqual({ m: [["Heat Wave", 90], ["Protect", 10]], n: [["Modest", 70], ["Timid", 10]] })
})

it("distinguishes empty statistics from upstream failures and validates requests", async () => {
  const fetcher = vi.fn(async () => Response.json([]))
  vi.stubGlobal("fetch", fetcher)
  const req = request("pokemon/pikalytics/10058?rule=tournaments&date=2026-08")
  expect(await (await usageData(req, noAssets, ctx)).json()).toEqual({})
  fetcher.mockImplementation(async () => new Response("down", { status: 503 }))
  expect((await usageData(req, noAssets, ctx)).status).toBe(502)
  fetcher.mockImplementation(async () => Response.json({ error: "upstream" }))
  expect((await usageData(req, noAssets, ctx)).status).toBe(502)
  for (const path of ["pokemon/champions/99999", "pokemon/champions/6?rule=../x", "ranking/pikalytics?rule=x&date=2026-99", "ranking/unknown"]) {
    expect((await usageData(request(path), noAssets, ctx)).status).toBe(400)
  }
})

it("keys the edge cache by rule and month, shares upstream rosters, and retries errors", async () => {
  const cache = new Map<string, Response>()
  vi.stubGlobal("caches", { open: async () => ({
    match: async (req: Request) => cache.get(req.url)?.clone(),
    put: async (req: Request, res: Response) => { cache.set(req.url, res.clone()) },
  }) })
  let fail = true
  const fetcher = vi.fn(async (url: string) => {
    if (url.includes("/api/l/")) return Response.json([{ name: "Garchomp", rank: "1" }, { name: "Charizard", rank: "2" }])
    return fail ? new Response("down", { status: 503 }) : Response.json(pikalyticsEntry("Garchomp"))
  })
  vi.stubGlobal("fetch", fetcher)
  const read = (id = 445, selectedRule = "tournaments", date = "2026-08") => usageData(request(`pokemon/pikalytics/${id}?rule=${selectedRule}&date=${date}`), noAssets, ctx)
  expect((await read()).status).toBe(502)
  fail = false
  expect((await read()).status).toBe(200)
  await read()
  await read(6)
  await read(445, "battledataregmbs3-1760")
  await read(445, "tournaments", "2026-07")
  expect(fetcher.mock.calls.map(([url]) => url)).toEqual([
    "https://www.pikalytics.com/api/l/2026-08/tournaments",
    "https://www.pikalytics.com/api/p/2026-08/tournaments/Garchomp",
    "https://www.pikalytics.com/api/p/2026-08/tournaments/Garchomp",
    "https://www.pikalytics.com/api/p/2026-08/tournaments/Charizard",
    "https://www.pikalytics.com/api/l/2026-08/battledataregmbs3-1760",
    "https://www.pikalytics.com/api/p/2026-08/battledataregmbs3-1760/Garchomp",
    "https://www.pikalytics.com/api/l/2026-07/tournaments",
    "https://www.pikalytics.com/api/p/2026-07/tournaments/Garchomp",
  ])
})

it("retries malformed successful upstream responses instead of caching them", async () => {
  const cache = new Map<string, Response>()
  vi.stubGlobal("caches", { open: async () => ({
    match: async (req: Request) => cache.get(req.url)?.clone(),
    put: async (req: Request, res: Response) => { cache.set(req.url, res.clone()) },
  }) })
  vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(Response.json({ error: "temporarily unavailable" }))
    .mockResolvedValueOnce(Response.json({ rows: [{ category: "move", name: "Flamethrower", rank: 1, percentage_value: 90 }] })))
  const req = request("pokemon/champions/10035?rule=Current")
  expect((await usageData(req, noAssets, ctx)).status).toBe(502)
  expect(await (await usageData(req, noAssets, ctx)).json()).toEqual({ m: [["Flamethrower", 90]] })
  expect(fetch).toHaveBeenCalledTimes(2)
})
