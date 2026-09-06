import { describe, expect, it } from "vitest"

import type { ScenarioResult } from "./types"
import { RANGE_DEFENDER_ID, RANGE_STAT_ID } from "./types"
import { childBelongsToExpandedParent } from "./expand-range-rows"

function row(partial: Partial<ScenarioResult> & Pick<ScenarioResult, "calculationIdentity" | "snapshotId">): ScenarioResult {
  return {
    support: "supported",
    moveId: 89,
    moveType: "ground",
    attackerStatId: RANGE_STAT_ID,
    defenderId: RANGE_DEFENDER_ID,
    provenance: {},
    criticalOnly: false,
    moveMechanics: {
      basePower: 100,
      normal: { effectivePower: 100, phases: [] },
      critical: { effectivePower: 150, phases: [] },
      hitFact: 100,
      hitProbability: 1,
    },
    minDamage: 1,
    maxDamage: 2,
    minPercent: 10,
    maxPercent: 20,
    critMinDamage: 2,
    critMaxDamage: 3,
    critMinPercent: 20,
    critMaxPercent: 30,
    ...partial,
  }
}

function itemProvenance(id: string): ScenarioResult["provenance"] {
  return {
    "held-item": { active: [id], inactive: [], unsupported: [], neutral: [] },
  }
}

describe("childBelongsToExpandedParent", () => {
  const parent = row({
    calculationIdentity: "parent",
    snapshotId: "eq",
    provenance: itemProvenance("none"),
  })

  it("keeps Choice children of the expanded axis on the same snapshot and other tracks", () => {
    const child = row({
      calculationIdentity: "child",
      snapshotId: "eq",
      attackerStatId: "extreme",
      provenance: itemProvenance("none"),
    })
    expect(childBelongsToExpandedParent(parent, child, { offense: true, defense: false })).toBe(true)
  })

  it("rejects a child from another snapshot", () => {
    const child = row({
      calculationIdentity: "other-move",
      snapshotId: "outrage",
      attackerStatId: "extreme",
      provenance: itemProvenance("none"),
    })
    expect(childBelongsToExpandedParent(parent, child, { offense: true, defense: false })).toBe(false)
  })

  it("rejects a child from another non-stat track combination", () => {
    const child = row({
      calculationIdentity: "other-item",
      snapshotId: "eq",
      attackerStatId: "extreme",
      provenance: itemProvenance("choice-band"),
    })
    expect(childBelongsToExpandedParent(parent, child, { offense: true, defense: false })).toBe(false)
  })

  it("keeps the unexpanded axis id", () => {
    const defenseParent = row({
      calculationIdentity: "parent-def",
      snapshotId: "eq",
      defenderId: "min-bulk",
      provenance: itemProvenance("none"),
    })
    const matching = row({
      calculationIdentity: "child-def",
      snapshotId: "eq",
      attackerStatId: "extreme",
      defenderId: "min-bulk",
      provenance: itemProvenance("none"),
    })
    const otherDefense = row({
      calculationIdentity: "child-other-def",
      snapshotId: "eq",
      attackerStatId: "extreme",
      defenderId: "standard-bulk",
      provenance: itemProvenance("none"),
    })
    expect(childBelongsToExpandedParent(defenseParent, matching, { offense: true, defense: false })).toBe(true)
    expect(childBelongsToExpandedParent(defenseParent, otherDefense, { offense: true, defense: false })).toBe(false)
  })

  it("rejects Range envelopes on an expanded axis", () => {
    expect(childBelongsToExpandedParent(parent, parent, { offense: true, defense: false })).toBe(false)
  })
})
