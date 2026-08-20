import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { IntlProvider } from "react-intl"
import { describe, expect, it } from "vitest"

import { TooltipProvider } from "@/components/ui/tooltip"
import { localeMessages } from "@/lib/i18n"
import type { ScenarioResult } from "@/lib/scenario"

import { DamagePercentAxis, DamageResultRow, pctToFraction } from "./damage-result-row"
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

describe("DamagePercentAxis desktop alignment", () => {
  it("uses the same three-column grid as result rows", () => {
    const markup = renderToStaticMarkup(createElement(
      IntlProvider,
      { locale: "en", messages: localeMessages.en },
      createElement(DamagePercentAxis),
    ))

    expect(markup).toContain("md:grid-cols-[14.75rem_minmax(0,1fr)_9rem]")
    expect(markup).toContain("md:gap-3")
    expect(markup).toContain("md:px-3")
    expect(markup).toContain("lg:px-4")
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

  it("collapses identical formatted endpoints to a single value", () => {
    expect(formatKOProbability({ min: 1, max: 1 }, "en")).toBe("100%")
    expect(formatKOProbability({ min: 0.1614, max: 0.1614 }, "en")).toBe("16.1%")
  })
})

describe("DamageResultRow range envelopes", () => {
      const row: ScenarioResult = {
        support: "supported",
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

  function render(showAccuracy = false): string {
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
          attackerStat: { id: "__range__", chips: [{ label: "0A", actual: "152", sp: "0", nature: "none", band: "none", temporary: false }] },
          defender: { id: "standard-bulk", chips: [{ label: "EX", actual: "341 / 251", sp: "32H / 32B", nature: "plus", band: "ex", temporary: false }] },
          row,
          showAccuracy,
        }),
      ),
    ))
  }

  it("does not render average damage", () => {
    const markup = render()

    expect(markup).not.toContain("data-damage-average-marker")
    expect(markup).not.toContain("Average")
  })

  it("does not put a range envelope into other conditions", () => {
    const markup = render()

    expect(markup).not.toContain("Other conditions")
    expect(markup).not.toContain("Stat Value range")
  })

  it("shows only the changed Stat axis on an expanded child row", () => {
    const markup = renderToStaticMarkup(createElement(
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
          attackerStat: { id: "extreme", chips: [{ label: "EX", actual: "204", sp: "32", nature: "plus", band: "ex", temporary: false }] },
          defender: { id: "__def_range__", chips: [{ label: "0H0B", actual: "176 / 121", sp: "0 / 0", nature: "none", band: "none", temporary: false }] },
          row,
          diff: { offense: true, defense: false },
        }),
      ),
    ))

    expect(markup).not.toContain("Tackle")
    expect(markup).toContain("EX")
    expect(markup).not.toContain("0H0B")
    expect(markup).toContain("10.0% ~ 20.0%")
  })

  it("renders KO ranges without a highlight chip and collapses identical endpoints", () => {
    row.koProbabilities = { ohko: { min: 0.042, max: 0.161 }, twoHit: { min: 1, max: 1 } }
    const markup = render()

    expect(markup).toContain("4.2%-16.1%")
    expect(markup).not.toContain("100%-100%")
    expect(markup).not.toContain("bg-signal-yellow")
  })

  it("paints a discrete box with the safe tone when max is under 43%", () => {
    const markup = render()
    expect(markup).toContain("damage-tone--safe")
    expect(markup).not.toContain("damage-tone-envelope")
  })

  it("paints a range envelope as one lit two-stop pill from endpoint box tones", () => {
    const ranged: ScenarioResult = {
      ...row,
      minPercent: 24,
      maxPercent: 118,
      rangeEndpoints: {
        low: { minPercent: 24, maxPercent: 36 },
        high: { minPercent: 101, maxPercent: 118 },
      },
    }
    const markup = renderToStaticMarkup(createElement(
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
          attackerStat: { id: "__range__", chips: [{ label: "0A", actual: "152", sp: "0", nature: "none", band: "none", temporary: false }] },
          defender: { id: "standard-bulk", chips: [{ label: "EX", actual: "341 / 251", sp: "32H / 32B", nature: "plus", band: "ex", temporary: false }] },
          row: ranged,
        }),
      ),
    ))
    expect(markup).toContain("damage-tone-envelope")
    expect(markup).toContain("--damage-tone-left:var(--damage-safe-start)")
    expect(markup).toContain("--damage-tone-right:var(--damage-guaranteed-end)")
    expect(markup).not.toContain("damage-tone--safe")
  })

  it("uses one gradient formula when both range endpoints share a tone", () => {
    const sameTone: ScenarioResult = {
      ...row,
      minPercent: 24,
      maxPercent: 39,
      rangeEndpoints: {
        low: { minPercent: 24, maxPercent: 36 },
        high: { minPercent: 30, maxPercent: 39 },
      },
    }
    const markup = renderToStaticMarkup(createElement(
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
          attackerStat: { id: "__range__", chips: [{ label: "0A", actual: "152", sp: "0", nature: "none", band: "none", temporary: false }] },
          defender: { id: "standard-bulk", chips: [{ label: "EX", actual: "341 / 251", sp: "32H / 32B", nature: "plus", band: "ex", temporary: false }] },
          row: sameTone,
        }),
      ),
    ))

    expect(markup).toContain("damage-tone-envelope")
    expect(markup).toContain("--damage-tone-left:var(--damage-safe-start)")
    expect(markup).toContain("--damage-tone-right:var(--damage-safe-end)")
    expect(markup).not.toContain("damage-tone-envelope--same")
  })

  it("places the range percent under the damage box", () => {
    const markup = render()
    const left = `${pctToFraction(10) * 100}%`
    const width = `${(pctToFraction(20) - pctToFraction(10)) * 100}%`
    expect(markup).toContain("data-damage-range-label")
    expect(markup).toContain(`left:${left}`)
    expect(markup).toContain(`width:${width}`)
  })

  it("shows accuracy only in Battle Odds Mode", () => {
    row.moveMechanics.hitFact = 85
    row.moveMechanics.hitProbability = 0.85

    expect(render()).not.toContain("85%")
    expect(render(true)).toContain("85%")
  })

  it("shows active stat stages in a left rail", () => {
    const staged: ScenarioResult = {
      ...row,
      provenance: {
        ...row.provenance,
        "attacker-stage": { active: ["2"], inactive: [], unsupported: [], neutral: [] },
        "defender-stage": { active: ["-1"], inactive: [], unsupported: [], neutral: [] },
      },
    }
    const markup = renderToStaticMarkup(createElement(
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
          attackerStat: { id: "__range__", chips: [{ label: "0A", actual: "152", sp: "0", nature: "none", band: "none", temporary: false }] },
          defender: { id: "standard-bulk", chips: [{ label: "EX", actual: "341 / 251", sp: "32H / 32B", nature: "plus", band: "ex", temporary: false }] },
          row: staged,
        }),
      ),
    ))

    expect(markup).toContain("+2")
    expect(markup).toContain("-1")
  })
})
