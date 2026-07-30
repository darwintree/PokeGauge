import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { IntlProvider } from "react-intl"
import { expect, it } from "vitest"

import { TooltipProvider } from "@/components/ui/tooltip"
import { localeMessages } from "@/lib/i18n"
import type { ScenarioRow } from "@/lib/scenario-pipeline"

import { AbilityTrack } from "./ability-track"
import { DamageBoxPlot } from "./damage-box-plot"

it("marks only unsupported ability effects in the Track", () => {
  const markup = renderToStaticMarkup(createElement(
    IntlProvider,
    { locale: "en", messages: localeMessages.en },
    createElement(AbilityTrack, {
      labelId: "track.attackerAbility",
      options: [
        { id: 91, label: "Adaptability", summary: "" },
        { id: 50, label: "Run Away", summary: "" },
      ],
      selectedIds: [91, 50],
      onChange: () => {},
      onReset: () => {},
    }),
  ))

  expect(markup).toContain("Adaptability")
  expect(markup).toContain("Run Away")
  expect(markup.match(/Effect not supported yet/g)).toHaveLength(1)
})

it("renders effective abilities inline and folds inactive and unsupported states", () => {
  const row: ScenarioRow = {
    calculationIdentity: "ability-display",
    snapshotId: "ability-display",
    moveId: 33,
    attackerStatId: "neutral-max",
    defenderId: "standard-bulk",
    provenance: {
      "attacker-ability": {
        effective: ["91"],
        inactive: [],
        unsupported: [],
        neutral: [],
      },
      "defender-ability": {
        effective: [],
        inactive: ["91"],
        unsupported: ["50"],
        neutral: [],
      },
    },
    criticalOnly: false,
    moveMechanics: {
      basePower: 40,
      effectivePower: 40,
      accuracy: 100,
      modifiers: { item: 4096, weather: 4096, terrain: 4096, spread: 4096, stab: 4096, typeEffectiveness: 4096, screen: 4096 },
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
  const abilities = [
    { id: 91, label: "Adaptability", summary: "" },
    { id: 50, label: "Run Away", summary: "" },
  ]
  const markup = renderToStaticMarkup(createElement(
    IntlProvider,
    { locale: "en", messages: localeMessages.en },
    createElement(
      TooltipProvider,
      null,
      createElement(DamageBoxPlot, {
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
        attackerAbilities: abilities,
        defenderAbilities: abilities,
        attackerStat: { id: "neutral-max", label: "Attack" },
        defender: { id: "standard-bulk", label: "Defense" },
        row,
      }),
    ),
  ))

  expect(markup).toContain("Adaptability")
  expect(markup).toContain("Other conditions (2)")
  expect(markup).toContain("Inactive")
  expect(markup).toContain("Unsupported")
  expect(markup).toContain("Run Away")
})
