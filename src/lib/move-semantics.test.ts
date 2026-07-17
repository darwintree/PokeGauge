import { describe, expect, it } from "vitest"

import {
  isMoveExplicitlyUnsupported,
  moveBreaksScreensBeforeDamage,
  resolveReviewedMoveType,
  reviewedVariablePowerDefault,
} from "./move-semantics"

describe("reviewed move semantics", () => {
  it.each([
    [783, 877, "electric"],
    [783, 10187, "dark"],
    [873, 128, "normal"],
    [873, 10250, "fighting"],
    [873, 10251, "fire"],
    [873, 10252, "water"],
    [904, 1017, "grass"],
    [904, 10273, "water"],
    [904, 10274, "fire"],
    [904, 10275, "rock"],
  ] as const)("resolves move %i for attacker %i to %s", (moveId, attackerId, type) => {
    expect(resolveReviewedMoveType(moveId, attackerId, "normal")).toBe(type)
  })

  it("falls back to the static type outside a reviewed identity", () => {
    expect(resolveReviewedMoveType(686, 445, "normal", ["dragon", "ground"])).toBe("dragon")
    expect(resolveReviewedMoveType(89, 10251, "ground")).toBe("ground")
  })

  it("recognizes explicit unsupported mechanics, Z-Moves, and Max Moves by numeric ID", () => {
    expect([237, 473, 492, 540, 548, 722, 723, 743, 776, 801, 877, 894].every(
      isMoveExplicitlyUnsupported,
    )).toBe(true)
    expect([622, 658, 695, 703, 719, 724, 728, 757, 774].every(
      isMoveExplicitlyUnsupported,
    )).toBe(true)
    expect(isMoveExplicitlyUnsupported(851)).toBe(false)
    expect(isMoveExplicitlyUnsupported(906)).toBe(false)
  })

  it("allows only reviewed null-power templates and exposes Raging Bull's screen flag", () => {
    expect([284, 323, 360, 484, 486, 500].map(reviewedVariablePowerDefault)).toEqual([
      150,
      150,
      0,
      0,
      0,
      20,
    ])
    expect(reviewedVariablePowerDefault(68)).toBeUndefined()
    expect(moveBreaksScreensBeforeDamage(873)).toBe(true)
    expect(moveBreaksScreensBeforeDamage(280)).toBe(true)
    expect(moveBreaksScreensBeforeDamage(706)).toBe(true)
  })
})
