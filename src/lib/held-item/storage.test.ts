import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  loadAddedBoostIds,
  removeAddedBoostId,
  saveAddedBoostId,
} from "@/lib/held-item/storage"

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
    saveAddedBoostId("garchomp", "type-boost-fire")
    saveAddedBoostId("garchomp", "type-boost-water")
    removeAddedBoostId("garchomp", "type-boost-fire")
    expect(loadAddedBoostIds("garchomp")).toEqual(["type-boost-water"])
  })

  it("removeAddedBoostId clears empty attacker key", () => {
    saveAddedBoostId("garchomp", "type-boost-fire")
    removeAddedBoostId("garchomp", "type-boost-fire")
    expect(loadAddedBoostIds("garchomp")).toEqual([])
  })
})
