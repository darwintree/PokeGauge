import { describe, expect, it } from "vitest"

import {
  ATTACKER_HELD_ITEM_IDS,
  DEFENDER_HELD_ITEM_IDS,
} from "@/lib/held-item"
import { normalizeAddedBoostIds } from "@/lib/held-item"

describe("held-item pools", () => {
  it("keeps attacker-only items out of the defender pool", () => {
    expect(ATTACKER_HELD_ITEM_IDS).toContain(247)
    expect(DEFENDER_HELD_ITEM_IDS).not.toContain(247)
    expect(DEFENDER_HELD_ITEM_IDS).toContain(581)
  })

  it("filters obsolete added-type-boost visibility entries", () => {
    expect(
      normalizeAddedBoostIds(["type-boost-fire", 226, 1659, null]),
    ).toEqual([226])
  })
})
