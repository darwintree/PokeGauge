import { describe, expect, it } from "vitest"

import { dragRangeFromAnchor } from "./use-dual-handle-drag"

describe("dragRangeFromAnchor", () => {
  it("keeps the other endpoint when max crosses min, and the following handle becomes min", () => {
    expect(dragRangeFromAnchor(40, 50, "max")).toEqual({
      range: { min: 40, max: 50 },
      handle: "min",
    })
  })

  it("keeps the other endpoint when min crosses max, and the following handle becomes max", () => {
    expect(dragRangeFromAnchor(90, 80, "min")).toEqual({
      range: { min: 80, max: 90 },
      handle: "max",
    })
  })

  it("does not move the captured anchor across subsequent pointer samples", () => {
    const anchor = 50
    expect(dragRangeFromAnchor(40, anchor, "max")).toEqual({
      range: { min: 40, max: 50 },
      handle: "min",
    })
    expect(dragRangeFromAnchor(30, anchor, "min")).toEqual({
      range: { min: 30, max: 50 },
      handle: "min",
    })
    expect(dragRangeFromAnchor(70, anchor, "min")).toEqual({
      range: { min: 50, max: 70 },
      handle: "max",
    })
  })

  it("keeps the coincident handle identity when the pointer sits on the anchor", () => {
    expect(dragRangeFromAnchor(50, 50, "max")).toEqual({
      range: { min: 50, max: 50 },
      handle: "max",
    })
  })
})
