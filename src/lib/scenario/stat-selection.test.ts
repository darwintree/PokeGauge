import { describe, expect, it } from "vitest"

import type { StatPreset } from "@/lib/stat-preset"

import {
  trackStatePreviewingDefense,
  trackStatePreviewingOffense,
} from "./stat-selection"
import type { TrackState } from "./types"

const offensePresets: StatPreset[] = [
  { id: "zero", kind: "system", values: { kind: "offense", stat: 100 } },
  { id: "ex", kind: "system", values: { kind: "offense", stat: 200 } },
]

const defensePresets: StatPreset[] = [
  { id: "min", kind: "system", values: { kind: "defense", hp: 200, def: 100 } },
]

function state(overrides: Partial<TrackState> = {}): TrackState {
  // ponytail: helpers only read selection fields; a full TrackState fixture adds nothing
  return {
    statMode: "range",
    offensePresetIds: ["zero", "ex"],
    offenseTemporaryPresets: [],
    defenderMode: "range",
    defensePresetIds: ["min"],
    defenseTemporaryPresets: [],
    ...overrides,
  } as TrackState
}

describe("trackStatePreviewingOffense", () => {
  it("isolates choice to a matching preset without changing the source selection", () => {
    const source = state()
    const preview = trackStatePreviewingOffense(source, offensePresets, 200, "unused")
    expect(preview.statMode).toBe("preset")
    expect(preview.offensePresetIds).toEqual(["ex"])
    expect(source.offensePresetIds).toEqual(["zero", "ex"])
    expect(source.statMode).toBe("range")
  })

  it("injects a temporary draft for a novel value", () => {
    const preview = trackStatePreviewingOffense(state(), offensePresets, 150, "18A")
    expect(preview.offensePresetIds).toEqual(["18A"])
    expect(preview.offenseTemporaryPresets).toEqual([
      { id: "18A", kind: "temporary", values: { kind: "offense", stat: 150 } },
    ])
  })
})

describe("trackStatePreviewingDefense", () => {
  it("isolates choice to a matching HP/Def pair", () => {
    const preview = trackStatePreviewingDefense(state(), defensePresets, 200, 100, "unused")
    expect(preview.defenderMode).toBe("preset")
    expect(preview.defensePresetIds).toEqual(["min"])
  })

  it("injects a temporary draft for a novel pair", () => {
    const preview = trackStatePreviewingDefense(state(), defensePresets, 220, 140, "4H8B")
    expect(preview.defensePresetIds).toEqual(["4H8B"])
    expect(preview.defenseTemporaryPresets[0]).toEqual({
      id: "4H8B",
      kind: "temporary",
      values: { kind: "defense", hp: 220, def: 140 },
    })
  })
})
