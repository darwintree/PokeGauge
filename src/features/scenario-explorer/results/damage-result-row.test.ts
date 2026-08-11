import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { IntlProvider } from "react-intl"
import { describe, expect, it } from "vitest"

import { TooltipProvider } from "@/components/ui/tooltip"
import { localeMessages } from "@/lib/i18n"
import type { ScenarioResult } from "@/lib/scenario"

import { DamageRangeLegend, DamageResultRow, pctToFraction } from "./damage-result-row"
import { formatKOProbability } from "./format-ko-probability"

describe("damage result row non-linear axis mapping", () => {
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

describe("formatKOProbability", () => {
  it("formats fixed values and explicit zero", () => {
    expect(formatKOProbability(0, "en")).toBe("0%")
    expect(formatKOProbability(0.95, "en")).toBe("95%")
  })

  it("keeps range endpoints instead of averaging them", () => {
    expect(formatKOProbability({ min: 0.0625, max: 0.875 }, "en")).toBe("6.3%-87.5%")
  })
})

describe("DamageResultRow range envelopes", () => {
  const row: ScenarioResult = {
    calculationIdentity: "range-envelope",
    snapshotId: "range-envelope",
    moveId: 33,
    moveType: "normal",
    attackerStatId: "__range__",
    defenderId: "standard-bulk",
    provenance: {
      "held-item": {
        active: [],
        inactive: [],
        unsupported: [],
        neutral: ["none"],
      },
    },
    criticalOnly: false,
    moveMechanics: {
      basePower: 40,
      normal: { effectivePower: 40, phases: [] },
      critical: { effectivePower: 60, phases: [] },
      hitFact: 100,
      hitProbability: 1,
    },
    minDamage: 20,
    maxDamage: 40,
    avgDamage: 30,
    minPercent: 10,
    maxPercent: 20,
    avgPercent: 15,
    critMinDamage: 30,
    critMaxDamage: 60,
    critMinPercent: 15,
    critMaxPercent: 30,
  }

  function render(isRangeEnvelope: boolean, showAccuracy = false): string {
    return renderToStaticMarkup(createElement(
      IntlProvider,
      { locale: "en", messages: localeMessages.en },
      createElement(
        TooltipProvider,
        null,
        createElement(DamageResultRow, {
          move: {
            id: 33,
            label: "Tackle",
            summary: "40 / 100",
            moveName: "Tackle",
            type: "normal",
            category: "physical",
            power: 40,
            accuracy: 100,
            isSpread: false,
          },
          attackerStat: { id: "__range__", label: "Attack range" },
          defender: { id: "standard-bulk", label: "Defense" },
          row,
          isRangeEnvelope,
          showAccuracy,
        }),
      ),
    ))
  }

  it("omits the synthetic average marker for a range envelope", () => {
    const markup = render(true)

    expect(markup).not.toContain("data-damage-average-marker")
    expect(markup).not.toContain("无道具")
    expect(render(false)).toContain("data-damage-average-marker")
  })

  it("omits the average legend when every displayed row is a range envelope", () => {
    const markup = renderToStaticMarkup(createElement(
      IntlProvider,
      { locale: "en", messages: localeMessages.en },
      createElement(DamageRangeLegend, { showAverage: false }),
    ))

    expect(markup).not.toContain("Average damage")
  })

  it("shows accuracy only in Battle Odds Mode", () => {
    row.moveMechanics.hitFact = 85
    row.moveMechanics.hitProbability = 0.85

    expect(render(false)).not.toContain("85%")
    expect(render(false, true)).toContain("85%")
  })
})
