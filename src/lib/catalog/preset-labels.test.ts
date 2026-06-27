import { describe, expect, it } from "vitest"

import {
  DEFENSE_PRESET_LABELS,
  OFFENSE_PRESET_LABELS,
  OFFENSE_SNAP_PRESET_IDS,
} from "./preset-labels"

describe("preset labels", () => {
  it("uses tier pill labels from grill", () => {
    expect(OFFENSE_PRESET_LABELS).toEqual({
      "neutral-zero": "0",
      "neutral-max": "max",
      extreme: "ex",
    })
    expect(DEFENSE_PRESET_LABELS).toEqual({
      "min-bulk": "0",
      "hp-32": "32HP",
      "standard-bulk": "ex",
    })
  })

  it("maps snap anchors to offense tier labels", () => {
    expect(OFFENSE_SNAP_PRESET_IDS.map((id) => OFFENSE_PRESET_LABELS[id])).toEqual([
      "0",
      "max",
      "ex",
    ])
  })
})
