import { afterEach, describe, expect, it, vi } from "vitest"

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
})
