import { describe, expect, it } from "vitest"

import { createMoveSnapshot } from "@/lib/move"

import { snapshotCapableMoveOptions } from "./resource-options"

describe("snapshot-capable Move options", () => {
  it("maps intrinsic critical rates onto new Move snapshots", async () => {
    const options = await snapshotCapableMoveOptions("en", "physical")
    const karateChop = options.find((move) => move.id === 2)!
    const flowerTrick = options.find((move) => move.id === 870)!

    expect(createMoveSnapshot(karateChop).criticalStage).toBe(1)
    expect(createMoveSnapshot(flowerTrick).criticalStage).toBe(3)
  })
})
