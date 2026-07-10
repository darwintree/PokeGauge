import { describe, expect, it } from "vitest"

import { pctToFraction } from "./damage-box-plot"
import { formatKoProbability } from "./format-ko-probability"

describe("damage-box-plot non-linear axis mapping", () => {
  it("maps 0–100 linearly over the first 72%", () => {
    expect(pctToFraction(0)).toBe(0)
    expect(pctToFraction(50)).toBeCloseTo(0.36, 10)
    expect(pctToFraction(100)).toBeCloseTo(0.72, 10)
  })

  it("sqrt-compresses 100–200 into the remaining 28%", () => {
    // 150 → 0.72 + sqrt(0.5) * 0.28
    expect(pctToFraction(150)).toBeCloseTo(0.72 + Math.sqrt(0.5) * 0.28, 10)
    expect(pctToFraction(200)).toBeCloseTo(1, 10)
  })

  it("clamps beyond the 200 hard cap to the right edge", () => {
    expect(pctToFraction(250)).toBe(1)
    expect(pctToFraction(-10)).toBe(0)
  })

  it("stays monotonic across the scale break", () => {
    expect(pctToFraction(99)).toBeLessThan(pctToFraction(100))
    expect(pctToFraction(100)).toBeLessThan(pctToFraction(101))
  })
})

describe("formatKoProbability", () => {
  it("formats fixed values and explicit zero", () => {
    expect(formatKoProbability(0, "en")).toBe("0%")
    expect(formatKoProbability(0.95, "en")).toBe("95%")
  })

  it("keeps range endpoints instead of averaging them", () => {
    expect(formatKoProbability({ min: 0.0625, max: 0.875 }, "en")).toBe("6.3%–87.5%")
  })
})
