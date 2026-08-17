import { describe, expect, it } from "vitest"

import { visibleFormulaPhases } from "./formula-details"

const phases = [
  { kind: "base-power" as const, modifier: 4096 },
  { kind: "critical" as const, modifier: 6144 },
  { kind: "final" as const, modifier: 5325 },
]

describe("visibleFormulaPhases", () => {
  it("hides neutral modifiers and non-guaranteed critical damage", () => {
    expect(visibleFormulaPhases(phases, false)).toEqual([{ kind: "final", modifier: 5325 }])
    expect(visibleFormulaPhases(phases, true)).toEqual(phases.slice(1))
  })
})
