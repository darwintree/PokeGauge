import { describe, expect, it } from "vitest"

import { convolveSparseDistributions } from "@/lib/convolution"

describe("sparse convolution", () => {
  it("aggregates duplicate sums and preserves probability mass", () => {
    const result = convolveSparseDistributions([
      new Map([
        [0, 0.25],
        [1, 0.75],
      ]),
      new Map([
        [0, 0.5],
        [1, 0.5],
      ]),
    ])

    expect([...result.entries()]).toEqual([
      [0, 0.125],
      [1, 0.5],
      [2, 0.375],
    ])
    expect([...result.values()].reduce((sum, value) => sum + value, 0)).toBeCloseTo(1)
  })
})
