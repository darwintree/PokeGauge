import { afterEach, describe, expect, it, vi } from "vitest"

import {
  loadProbabilityMode,
  PROBABILITY_MODE_STORAGE_KEY,
  saveProbabilityMode,
} from "./probability-mode-preference"

describe("probability mode preference", () => {
  afterEach(() => vi.unstubAllGlobals())

  it("persists supported modes and defaults invalid storage to Battle Odds", () => {
    const values = new Map<string, string>()
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    })

    expect(loadProbabilityMode()).toBe("battle-odds")
    saveProbabilityMode("classic")
    expect(loadProbabilityMode()).toBe("classic")

    values.set(PROBABILITY_MODE_STORAGE_KEY, "unsupported")
    expect(loadProbabilityMode()).toBe("battle-odds")
  })
})
