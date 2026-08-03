import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  loadAddedBoostIds,
  normalizeAddedBoostIds,
  removeAddedBoostId,
  saveAddedBoostId,
} from "@/lib/held-item"

describe("held-item storage", () => {
  beforeEach(() => {
    const data: Record<string, string> = {}
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => data[key] ?? null,
      setItem: (key: string, value: string) => {
        data[key] = value
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("removeAddedBoostId drops id from attacker list", () => {
    saveAddedBoostId("garchomp", 226)
    saveAddedBoostId("garchomp", 220)
    removeAddedBoostId("garchomp", 226)
    expect(loadAddedBoostIds("garchomp")).toEqual([220])
  })

  it("removeAddedBoostId clears empty attacker key", () => {
    saveAddedBoostId("garchomp", 226)
    removeAddedBoostId("garchomp", 226)
    expect(loadAddedBoostIds("garchomp")).toEqual([])
  })

  it("filters legacy, external, and malformed visibility ids", () => {
    expect(
      normalizeAddedBoostIds(["type-boost-fire", 226, 1659, null, 226]),
    ).toEqual([226, 226])
  })
})
