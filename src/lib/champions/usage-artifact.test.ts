import { afterEach, expect, it, vi } from "vitest"

import {
  listChampionsItemUsageRecords,
  listChampionsMoveUsageRecords,
  listChampionsNatureUsageRecords,
  listChampionsPokemonUsageIds,
  fetchUsageRanking,
  setUsageSource,
} from "@/lib/champions"
import {
  loadUsageManifest,
  resetUsageArtifactCache,
  setUsageArtifactFetcherForTest,
} from "@/lib/champions/artifact-client"
import {
  isUsageArtifact,
  toBucket,
  usageArtifactUrl,
  usageManifestUrl,
  type UsageArtifact,
} from "@/lib/champions/usage-artifact"

afterEach(() => {
  vi.unstubAllGlobals()
  resetUsageArtifactCache()
  setUsageSource("champions")
})

const artifact: UsageArtifact = {
  source: "champions",
  rule: "Current",
  format: "Doubles",
  dataVersion: "20260916050400834",
  generatedAt: "2026-09-16T00:00:00.000Z",
  ranking: [6],
  pokemon: {
    6: {
      m: [["Flamethrower", 90], ["Dragon Claw", null]],
      a: [["Blaze", 100]],
      i: [["Charizardite Y", 95], ["nothing", null]],
      n: [["Modest", 70]],
    },
  },
}

const manifest = {
  source: "champions",
  defaultId: "Current",
  rules: [{ id: "Current", label: "Current" }, { id: "M6", label: "M6" }],
  compiledRules: ["Current"],
  generatedAt: "2026-09-16T00:00:00.000Z",
}

function stubArtifactFetcher(): { calls: string[] } {
  const calls: string[] = []
  setUsageArtifactFetcherForTest(async (url) => {
    calls.push(url)
    if (url === usageManifestUrl("champions")) return manifest
    if (url === usageArtifactUrl("champions", "Current")) return artifact
    return null
  })
  return { calls }
}

it("keys artifact URLs by source and rule", () => {
  expect(usageArtifactUrl("champions", "Current")).toBe("/usage/champions/Current.json")
  expect(usageManifestUrl("champions")).toBe("/usage/champions/manifest.json")
})

it("rejects an artifact missing required fields", () => {
  expect(isUsageArtifact(artifact)).toBe(true)
  expect(isUsageArtifact(null)).toBe(false)
  expect(isUsageArtifact({ source: "champions", rule: "Current" })).toBe(false)
  expect(isUsageArtifact({ ...artifact, ranking: ["6"] })).toBe(false)
  expect(isUsageArtifact({ ...artifact, pokemon: { 6: { m: [["x"]] } } })).toBe(false)
})

it("keeps null percentages and rank order in a bucket", () => {
  expect(toBucket([{ name: "a", percentage: 90 }, { name: "b", percentage: null }]))
    .toEqual([["a", 90], ["b", null]])
  // `percentage` omitted is the upstream "no value" case and must not be dropped.
  expect(toBucket([{ name: "b" }])).toEqual([["b", null]])
  expect(toBucket([])).toBeUndefined()
  expect(toBucket(undefined)).toBeUndefined()
})

it("serves the ranking and detail from the compiled artifact without upstream reads", async () => {
  const { calls } = stubArtifactFetcher()
  const upstream = vi.fn(() => {
    throw new Error("upstream must not be reached for a compiled rule")
  })
  vi.stubGlobal("fetch", upstream)
  setUsageSource("champions", "Current")

  expect(await listChampionsPokemonUsageIds()).toEqual([6])

  const moves = await listChampionsMoveUsageRecords(6)
  expect(moves.map((row) => [row.championsMoveName, row.percentage, row.rank])).toEqual([
    ["Flamethrower", 90, 1],
    ["Dragon Claw", null, 2],
  ])
  // The projected rows carry the artifact identity, not a live upstream one.
  expect(moves[0]).toMatchObject({
    battlePokemonId: 6,
    season: "Current",
    dataVersion: "20260916050400834",
  })
  expect(moves[0]!.moveId).toBeGreaterThan(0)

  const items = await listChampionsItemUsageRecords(6)
  // `nothing` has no local item id and must survive to keep the top-10 window honest.
  expect(items.map((row) => [row.championsItemName, row.itemId, row.percentage])).toEqual([
    ["Charizardite Y", expect.any(Number), 95],
    ["nothing", null, null],
  ])
  expect((await listChampionsNatureUsageRecords(6)).map((row) => row.nature)).toEqual(["Modest"])

  expect(upstream).not.toHaveBeenCalled()
  expect(calls).toContain(usageArtifactUrl("champions", "Current"))
})

it("resolves the default rule from the manifest before the store has chosen one", async () => {
  const { calls } = stubArtifactFetcher()
  vi.stubGlobal("fetch", vi.fn(() => {
    throw new Error("upstream must not be reached for a compiled default rule")
  }))
  // No explicit rule: a cold start, where the manifest supplies the default.
  setUsageSource("champions", null)

  expect(await listChampionsPokemonUsageIds()).toEqual([6])
  expect(calls).toContain(usageManifestUrl("champions"))
  expect(calls).toContain(usageArtifactUrl("champions", "Current"))
})

it("re-reads the artifact on an explicit reload", async () => {
  let version = 1
  const calls: string[] = []
  setUsageArtifactFetcherForTest(async (url) => {
    calls.push(url)
    if (url === usageManifestUrl("champions")) return manifest
    if (url === usageArtifactUrl("champions", "Current")) {
      return { ...artifact, dataVersion: `v${version}` }
    }
    return null
  })
  setUsageSource("champions", "Current")

  expect(await listChampionsMoveUsageRecords(6)).toBeDefined()
  const afterFirst = calls.length
  // A cached read must not refetch.
  await listChampionsMoveUsageRecords(6)
  expect(calls.length).toBe(afterFirst)

  version = 2
  // The real manual-refresh path: ranking and per-Pokemon reads must both move.
  await fetchUsageRanking({ reload: true })
  const refreshed = await listChampionsMoveUsageRecords(6)
  expect(calls.length).toBeGreaterThan(afterFirst)
  expect(refreshed[0]).toMatchObject({ dataVersion: "v2" })
})

it("reads the rule list from the manifest", async () => {
  stubArtifactFetcher()
  expect(await loadUsageManifest("champions")).toEqual(manifest)
})

it("falls back to proxy mode when the artifact is absent", async () => {
  setUsageArtifactFetcherForTest(async () => null)
  setUsageSource("champions", "Current")

  const upstream = vi.fn(async () => {
    throw new Error("proxy mode reached upstream")
  })
  vi.stubGlobal("fetch", upstream)

  // The fallback must attempt the upstream index rather than throw immediately,
  // proving the artifact lookup itself never becomes a hard failure.
  await expect(listChampionsMoveUsageRecords(6)).rejects.toThrow("proxy mode reached upstream")
  expect(upstream).toHaveBeenCalled()
})

it("uses proxy mode for a rule the manifest does not list as compiled", async () => {
  stubArtifactFetcher()
  setUsageSource("champions", "M6")
  const upstream = vi.fn(async () => {
    throw new Error("proxy mode reached upstream")
  })
  vi.stubGlobal("fetch", upstream)
  // `M6` is not in `compiledRules`, so the artifact must not satisfy this read.
  await expect(listChampionsMoveUsageRecords(6)).rejects.toThrow("proxy mode reached upstream")
  expect(upstream).toHaveBeenCalled()
})

it.each(["smogon", "pikalytics"] as const)("reads %s ranking and all details from its own artifact", async source => {
  const rule = source === "smogon" ? "2026-08/gen9championsvgc2026regmb-0" : "tournaments"
  setUsageArtifactFetcherForTest(async url => url === usageArtifactUrl(source, rule) ? { ...artifact, source, rule } : null)
  setUsageSource(source, rule)
  vi.stubGlobal("fetch", vi.fn(() => { throw new Error("Unexpected online request") }))
  expect(await listChampionsPokemonUsageIds()).toEqual([6])
  expect((await listChampionsMoveUsageRecords(6)).map(row => row.moveId)).toContain(53)
  expect((await listChampionsItemUsageRecords(6)).map(row => row.championsItemName)).toContain("Charizardite Y")
  expect((await listChampionsNatureUsageRecords(6)).map(row => row.nature)).toEqual(["Modest"])
})

it("caches manifests independently by source", async () => {
  const { loadUsageManifest } = await import("./artifact-client")
  setUsageArtifactFetcherForTest(async url => ({ ...manifest, source: url.includes("/smogon/") ? "smogon" : "champions" }))
  expect((await loadUsageManifest("champions"))?.source).toBe("champions")
  expect((await loadUsageManifest("smogon"))?.source).toBe("smogon")
})

it("keeps the strongest spread per nature without summing distinct spreads", async () => {
  const { smogonNatureRows } = await import("./upstream")
  const rows = smogonNatureRows({ Spreads: { "Modest:a": 25, "Modest:b": 25, "Timid:c": 40, "Bold:d": 10 } })
  expect(rows.map(([name, , percent]) => [name, percent])).toEqual([["Timid", 40], ["Modest", 25], ["Bold", 10]])
})

it("treats an explicitly empty compiled statistic as a completed read", async () => {
  setUsageArtifactFetcherForTest(async () => ({ ...artifact, source: "pikalytics", rule: "empty", pokemon: { 6: {} } }))
  setUsageSource("pikalytics", "empty")
  const online = vi.fn(() => { throw new Error("Unexpected retry") })
  vi.stubGlobal("fetch", online)
  expect(await listChampionsMoveUsageRecords(6)).toEqual([])
  expect(online).not.toHaveBeenCalled()
})
