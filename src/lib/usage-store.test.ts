import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  resetChampionsJsonFetcherForTest,
  setChampionsJsonFetcherForTest,
  setUsageSource,
} from "@/lib/champions"
import { USAGE_STALE_MS, saveUsageCache } from "@/lib/usage-source-preference"
import {
  applyUsageStorePending,
  getUsageStoreSnapshot,
  refreshUsageStore,
  resetUsageStoreForTest,
  startUsageSession,
  setUsageStoreSource,
} from "./usage-store"

function memoryStorage() {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value)
    },
  }
}

function championsIndex(ids: Array<{ name: string; position: number }>) {
  return {
    defaultSeason: "Current",
    seasons: ["Current", "M6"],
    dataVersion: "v1",
    pokemon: ids.map((entry) => ({
      name: entry.name,
      slug: entry.name.toLowerCase(),
      battleName: entry.name,
      showdownName: entry.name,
      summary: {
        battleSummary: {
          Current: { Doubles: { top: { move: { position: entry.position } } } },
        },
      },
    })),
  }
}

describe("usage store refresh policy", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ defaultId: "Current", rules: [{ id: "Current", label: "Current", compiled: true }, { id: "M6", label: "M6", compiled: true }] })))
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    resetChampionsJsonFetcherForTest()
    setUsageSource("champions")
    resetUsageStoreForTest()
  })

  it("keeps cached ranking until the pending update is applied", async () => {
    const storage = memoryStorage()
    vi.stubGlobal("localStorage", storage)
    resetUsageStoreForTest()
    saveUsageCache("champions", "Current", {
      fetchedAt: Date.now() - USAGE_STALE_MS - 1,
      fingerprint: "old",
      pokemonIds: [25],
    })
    let calls = 0
    setChampionsJsonFetcherForTest(async (url) => {
      if (url === "https://championsbattledata.com/api") {
        calls += 1
        return championsIndex([{ name: "Charizard", position: 1 }])
      }
      throw new Error(url)
    })

    await startUsageSession()
    await vi.waitFor(() => {
      expect(getUsageStoreSnapshot().pendingUpdate).toBe(true)
    })
    expect(getUsageStoreSnapshot().ruleId).toBe("Current")
    expect(storage.getItem("pokegauge.usage-cache:champions:Current")).toContain("[25]")

    applyUsageStorePending()
    expect(getUsageStoreSnapshot().pendingUpdate).toBe(false)
    expect(storage.getItem("pokegauge.usage-cache:champions:Current")).toContain("6")
  })

  it("does not background-fetch a fresh cache, but manual fetch still runs", async () => {
    const storage = memoryStorage()
    vi.stubGlobal("localStorage", storage)
    resetUsageStoreForTest()
    saveUsageCache("champions", "Current", {
      fetchedAt: Date.now(),
      fingerprint: "fresh",
      pokemonIds: [25],
    })
    let indexCalls = 0
    setChampionsJsonFetcherForTest(async (url) => {
      if (url === "https://championsbattledata.com/api") {
        indexCalls += 1
        return championsIndex([{ name: "Pikachu", position: 1 }])
      }
      throw new Error(url)
    })

    await startUsageSession()
    await Promise.resolve()
    expect(getUsageStoreSnapshot().pendingUpdate).toBe(false)
    const callsAfterStart = indexCalls

    await refreshUsageStore()
    expect(indexCalls).toBeGreaterThan(callsAfterStart)
    expect(getUsageStoreSnapshot().pendingUpdate).toBe(false)
  })
  it("reloads detail consumers even when ranking is unchanged", async () => {
    vi.stubGlobal("localStorage", memoryStorage())
    resetUsageStoreForTest()
    setChampionsJsonFetcherForTest(async () => championsIndex([{ name: "Pikachu", position: 1 }]))
    await startUsageSession()
    await refreshUsageStore()
    const generation = getUsageStoreSnapshot().generation
    await refreshUsageStore()
    expect(getUsageStoreSnapshot().generation).toBe(generation + 1)
  })

  it("keeps the latest requested source when catalogs resolve out of order", async () => {
    vi.stubGlobal("localStorage", memoryStorage())
    resetUsageStoreForTest()
    await startUsageSession()
    let resolveSmogon!: (response: Response) => void
    vi.stubGlobal("fetch", vi.fn((url: string) => url.endsWith("smogon")
      ? new Promise<Response>(resolve => { resolveSmogon = resolve })
      : Promise.resolve(Response.json({ defaultId: "tournaments", date: "2026-05", rules: [{ id: "tournaments", label: "Tournaments", compiled: true }] }))))
    const first = setUsageStoreSource("smogon")
    expect(getUsageStoreSnapshot().loadingSource).toBe("smogon")
    await setUsageStoreSource("pikalytics")
    resolveSmogon(Response.json({ defaultId: "old", rules: [{ id: "old", label: "Old" }] }))
    await first
    expect(getUsageStoreSnapshot()).toMatchObject({ source: "pikalytics", ruleId: "tournaments", loadingSource: null, catalogError: null })
  })

  it("exposes catalog failure and retries the failed request", async () => {
    vi.stubGlobal("localStorage", memoryStorage())
    resetUsageStoreForTest()
    const fetcher = vi.fn().mockResolvedValueOnce(new Response("failure", { status: 502 }))
      .mockResolvedValueOnce(Response.json({ defaultId: "Current", rules: [{ id: "Current", label: "Current" }] }))
    vi.stubGlobal("fetch", fetcher)
    await startUsageSession()
    expect(getUsageStoreSnapshot().catalogError).toBe("champions")
    await setUsageStoreSource("champions")
    expect(getUsageStoreSnapshot()).toMatchObject({ catalogError: null, ruleId: "Current" })
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

})
