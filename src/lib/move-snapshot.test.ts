import { describe, expect, it } from "vitest"

import { createMoveSnapshot, editMoveSnapshot } from "./move-snapshot"

const EARTHQUAKE = {
  id: 89,
  power: 100,
  accuracy: 100,
  isSpread: true,
} as const

describe("move snapshots", () => {
  it("creates independent stable snapshots from one immutable template", () => {
    const first = createMoveSnapshot(EARTHQUAKE, "first")
    const second = createMoveSnapshot(EARTHQUAKE, "second")
    const edited = editMoveSnapshot(first, { power: 75, spread: false })

    expect(edited).toMatchObject({ id: "first", moveId: 89, power: 75, spread: false })
    expect(second).toMatchObject({ id: "second", moveId: 89, power: 100, spread: true })
    expect(EARTHQUAKE).toEqual({ id: 89, power: 100, accuracy: 100, isSpread: true })
  })

  it("normalizes edits and removes template always-hit semantics on accuracy edit", () => {
    const swift = createMoveSnapshot(
      { id: 129, power: 60, accuracy: null, isSpread: false },
      "swift",
    )

    expect(swift).toMatchObject({ accuracy: 100, alwaysHits: true, criticalStage: 0 })
    expect(editMoveSnapshot(swift, { power: 1001.8, accuracy: 95.9, spread: true })).toMatchObject({
      id: "swift",
      power: 1000,
      accuracy: 95,
      alwaysHits: false,
      spread: false,
    })
  })

  it("initializes reviewed guaranteed-critical semantics without inferring raw null accuracy", () => {
    expect(
      createMoveSnapshot({ id: 870, power: 70, accuracy: null, isSpread: false }, "flower"),
    ).toMatchObject({ accuracy: 100, alwaysHits: true, criticalStage: 3 })
    expect(
      createMoveSnapshot({ id: 165, power: 50, accuracy: null, isSpread: false }, "struggle"),
    ).toMatchObject({ accuracy: 0, alwaysHits: false, criticalStage: 0 })
  })

  it("rejects templates for explicitly unsupported move mechanics", () => {
    expect(() =>
      createMoveSnapshot({ id: 473, power: 80, accuracy: 100, isSpread: false }),
    ).toThrow("Unsupported Move snapshot template: 473")
    expect(() =>
      createMoveSnapshot({ id: 68, power: 0, accuracy: 100, isSpread: false }),
    ).toThrow("Unreviewed zero-power Move snapshot template: 68")
  })
})
