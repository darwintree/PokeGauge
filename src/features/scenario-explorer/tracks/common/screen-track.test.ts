import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { IntlProvider } from "react-intl"
import { describe, expect, it } from "vitest"

import { TooltipProvider } from "@/components/ui/tooltip"
import { localeMessages } from "@/lib/i18n"
import type { ScenarioResult } from "@/lib/scenario"

import { DamageResultRow } from "../../results/damage-result-row"
import { ScreenTrack } from "./screen-track"
import { normalizeScreens } from "@/lib/scenario"

describe("Screen Track", () => {
  it("renders the fixed order and keeps one selection", () => {
    const markup = renderToStaticMarkup(createElement(
      IntlProvider,
      { locale: "en", messages: localeMessages.en },
      createElement(ScreenTrack, {
        values: ["none"],
        onChange: () => {},
      }),
    ))

    expect(markup.indexOf("No screen")).toBeLessThan(markup.indexOf("Reflect"))
    expect(markup.indexOf("Reflect")).toBeLessThan(markup.indexOf("Light Screen"))
    expect(normalizeScreens([])).toEqual(["none"])
  })

  it("shows active screens inline, folds inactive screens, and omits no screen", () => {
    const row: ScenarioResult = {
      calculationIdentity: "screen-display",
      snapshotId: "screen-display",
      moveId: 33,
      attackerStatId: "neutral-max",
      defenderId: "standard-bulk",
      provenance: {
        screen: {
          active: ["reflect"],
          inactive: ["light-screen"],
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
      maxDamage: 24,
      avgDamage: 22,
      minPercent: 10,
      maxPercent: 12,
      avgPercent: 11,
      critMinDamage: 30,
      critMaxDamage: 36,
      critMinPercent: 15,
      critMaxPercent: 18,
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
          attackerStat: { id: "neutral-max", label: "Attack" },
          defender: { id: "standard-bulk", label: "Defense" },
          row,
        }),
      ),
    ))

    expect(markup).toContain("Reflect")
    expect(markup).toContain("Other conditions (1)")
    expect(markup).toContain("Inactive")
    expect(markup).toContain("Light Screen")
    expect(markup).not.toContain("No screen")
  })
})
