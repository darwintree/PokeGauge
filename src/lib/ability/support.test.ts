import { describe, expect, it } from "vitest"

import {
  abilityEffectIsSupported,
  abilityIsSelectable,
  abilitySupport,
  assumedSatisfiedAbilityFamily,
} from "./index"

describe("Ability support policy", () => {
  it("matches every reviewed Generation III-IX classification", () => {
    const counts = { supported: 0, "assumed-satisfied": 0, unsupported: 0, none: 0 }
    for (let id = 1; id <= 313; id += 1) counts[abilitySupport(id)] += 1

    expect(counts).toEqual({
      supported: 94,
      "assumed-satisfied": 15,
      unsupported: 111,
      none: 93,
    })
  })

  it.each([
    [3, 1, 76, [21, 8, 16, 31]],
    [4, 77, 123, [23, 0, 13, 11]],
    [5, 124, 164, [6, 4, 16, 15]],
    [6, 165, 191, [14, 0, 6, 7]],
    [7, 192, 233, [9, 2, 17, 14]],
    [8, 234, 267, [9, 0, 14, 11]],
    [9, 268, 313, [12, 1, 29, 4]],
  ] as const)("matches the Generation %i reviewed counts", (_generation, first, last, expected) => {
    const statuses = Array.from({ length: last - first + 1 }, (_, index) =>
      abilitySupport(first + index))
    expect([
      statuses.filter((status) => status === "supported").length,
      statuses.filter((status) => status === "assumed-satisfied").length,
      statuses.filter((status) => status === "unsupported").length,
      statuses.filter((status) => status === "none").length,
    ]).toEqual(expected)
  })

  it("uses the reviewed four-way behavior", () => {
    expect(abilitySupport(91)).toBe("supported") // Adaptability
    expect(abilitySupport(65)).toBe("assumed-satisfied") // Overgrow
    expect(abilitySupport(24)).toBe("unsupported") // Rough Skin
    expect(abilitySupport(293)).toBe("unsupported") // Supreme Overlord
    expect(abilitySupport(1)).toBe("none") // Stench
    expect(abilityEffectIsSupported(65)).toBe(true)
    expect(abilityEffectIsSupported(24)).toBe(false)
    expect(abilityIsSelectable(1)).toBe(false)
  })

  it("keeps all fifteen assumed conditions in the centralized policy", () => {
    expect(Array.from({ length: 313 }, (_, index) => index + 1)
      .filter((id) => assumedSatisfiedAbilityFamily(id))).toEqual([
        57, 58, 62, 63, 65, 66, 67, 68, 136, 137, 138, 148, 196, 231, 305,
      ])
  })
})
