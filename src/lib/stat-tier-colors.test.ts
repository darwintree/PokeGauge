import { describe, expect, it } from "vitest"

import { defenderBulkTier, offenseStatTier } from "./stat-tier-colors"

describe("stat tier mapping", () => {
  it("maps offense presets to shared tier tokens", () => {
    expect(offenseStatTier("neutral-zero")).toBe("stat-tier-0")
    expect(offenseStatTier("neutral-max")).toBe("stat-offense-max")
    expect(offenseStatTier("extreme")).toBe("stat-tier-ex")
  })

  it("maps defender bulks to shared tier tokens", () => {
    expect(defenderBulkTier("min-bulk")).toBe("stat-tier-0")
    expect(defenderBulkTier("hp-32")).toBe("stat-bulk-mid")
    expect(defenderBulkTier("standard-bulk")).toBe("stat-tier-ex")
  })

  it("shares ex token between offense and defense", () => {
    expect(offenseStatTier("extreme")).toBe(defenderBulkTier("standard-bulk"))
  })
})
