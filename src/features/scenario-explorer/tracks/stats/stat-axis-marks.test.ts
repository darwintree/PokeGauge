import { describe, expect, it } from "vitest"

import type { InvestBand, StatPreset } from "@/lib/stat-preset"

import { defenseAxisMarks, offenseAxisMarks, uniqueAxisMarks } from "./stat-axis-marks"

const offense: StatPreset[] = [
  { id: "zero", kind: "system", values: { kind: "offense", stat: 100 } },
  { id: "mid", kind: "user", values: { kind: "offense", stat: 140 } },
  { id: "temp", kind: "temporary", values: { kind: "offense", stat: 180 } },
  { id: "temp-mid", kind: "temporary", values: { kind: "offense", stat: 140 } },
]

const defense: StatPreset[] = [
  { id: "min", kind: "system", values: { kind: "defense", hp: 200, def: 100 } },
  { id: "temp", kind: "temporary", values: { kind: "defense", hp: 220, def: 100 } },
  { id: "user", kind: "user", values: { kind: "defense", hp: 200, def: 140 } },
]

const BANDS: Record<string, InvestBand> = {
  zero: "none",
  mid: "some",
  temp: "ex",
  "temp-mid": "heavy",
  min: "none",
  user: "some",
}

function bandOf(preset: StatPreset): InvestBand {
  return BANDS[preset.id] ?? "none"
}

describe("uniqueAxisMarks", () => {
  it("keeps the first band when values collide", () => {
    expect(
      uniqueAxisMarks([
        { value: 140, band: "some" },
        { value: 140, band: "ex" },
        { value: 100, band: "none" },
      ]),
    ).toEqual([
      { value: 140, band: "some" },
      { value: 100, band: "none" },
    ])
  })
})

describe("offenseAxisMarks", () => {
  it("projects selected offense values and invest bands", () => {
    expect(offenseAxisMarks(offense, ["zero", "mid", "temp", "temp-mid"], bandOf)).toEqual([
      { value: 100, band: "none" },
      { value: 140, band: "some" },
      { value: 180, band: "ex" },
    ])
  })
})

describe("defenseAxisMarks", () => {
  it("projects selected defense values onto one axis", () => {
    expect(defenseAxisMarks(defense, ["min", "temp"], "hp", bandOf)).toEqual([
      { value: 200, band: "none" },
      { value: 220, band: "ex" },
    ])
    expect(defenseAxisMarks(defense, ["min", "temp"], "def", bandOf)).toEqual([
      { value: 100, band: "none" },
    ])
  })
})
