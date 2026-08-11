import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { IntlProvider } from "react-intl"
import { expect, it } from "vitest"

import { TooltipProvider } from "@/components/ui/tooltip"
import { localeMessages } from "@/lib/i18n"
import type { ScenarioResult } from "@/lib/scenario"

import { AbilityTrack } from "./ability-track"
import { DamageResultRow } from "../../results/damage-result-row"
import {
  BLAZE_ABILITY_ID,
  DROUGHT_ABILITY_ID,
  BATTLE_ARMOR_ABILITY_ID,
  COMPOUND_EYES_ABILITY_ID,
  FIRE_MANE_ABILITY_ID,
  GUTS_ABILITY_ID,
  HUSTLE_ABILITY_ID,
  MERCILESS_ABILITY_ID,
  MULTISCALE_ABILITY_ID,
  NO_GUARD_ABILITY_ID,
  NO_ABILITY_ID,
  SHARPNESS_ABILITY_ID,
  RECKLESS_ABILITY_ID,
  SHEER_FORCE_ABILITY_ID,
  SHELL_ARMOR_ABILITY_ID,
  SNIPER_ABILITY_ID,
  SUPER_LUCK_ABILITY_ID,
} from "@/lib/ability"

it("marks only unsupported ability effects in the Track", () => {
  const markup = renderToStaticMarkup(createElement(
    IntlProvider,
    { locale: "en", messages: localeMessages.en },
    createElement(AbilityTrack, {
      labelId: "track.attackerAbility",
      options: [
        { id: 91, label: "Adaptability", summary: "" },
        { id: FIRE_MANE_ABILITY_ID, label: "Fire Mane", summary: "" },
        { id: BATTLE_ARMOR_ABILITY_ID, label: "Battle Armor", summary: "" },
        { id: COMPOUND_EYES_ABILITY_ID, label: "Compound Eyes", summary: "" },
        { id: HUSTLE_ABILITY_ID, label: "Hustle", summary: "" },
        { id: NO_GUARD_ABILITY_ID, label: "No Guard", summary: "" },
        { id: SHELL_ARMOR_ABILITY_ID, label: "Shell Armor", summary: "" },
        { id: SNIPER_ABILITY_ID, label: "Sniper", summary: "" },
        { id: SUPER_LUCK_ABILITY_ID, label: "Super Luck", summary: "" },
        { id: 35, label: "Illuminate", summary: "" },
        { id: 51, label: "Keen Eye", summary: "" },
        { id: NO_ABILITY_ID, label: "—", accessibleLabel: "No ability", summary: "" },
        { id: 50, label: "Run Away", summary: "" },
        { id: SHARPNESS_ABILITY_ID, label: "Sharpness", summary: "" },
        { id: RECKLESS_ABILITY_ID, label: "Reckless", summary: "" },
        { id: SHEER_FORCE_ABILITY_ID, label: "Sheer Force", summary: "" },
        { id: DROUGHT_ABILITY_ID, label: "Drought", summary: "" },
      ],
      selectedIds: [91, 50],
      onChange: () => {},
      onReset: () => {},
    }),
  ))

  expect(markup).toContain("Adaptability")
  expect(markup).toContain("Run Away")
  expect(markup).toContain("Fire Mane")
  expect(markup).toContain("Sharpness")
  expect(markup).toContain("Reckless")
  expect(markup).toContain("Sheer Force")
  expect(markup).toContain("Drought")
  expect(markup.match(/Effect not supported yet/g)).toHaveLength(6)
  expect(markup.indexOf('aria-label="No ability"')).toBeLessThan(
    markup.indexOf('aria-label="Adaptability"'),
  )
  expect(markup.match(/aria-label="No ability"/g)).toHaveLength(1)
})

it("marks assumed-satisfied abilities with green disclosure and no red unsupported cue", () => {
  const markup = renderToStaticMarkup(createElement(
    IntlProvider,
    { locale: "en", messages: localeMessages.en },
    createElement(AbilityTrack, {
      labelId: "track.attackerAbility",
      options: [
        { id: BLAZE_ABILITY_ID, label: "Blaze", summary: "" },
        { id: GUTS_ABILITY_ID, label: "Guts", summary: "" },
        { id: MULTISCALE_ABILITY_ID, label: "Multiscale", summary: "" },
        { id: MERCILESS_ABILITY_ID, label: "Merciless", summary: "" },
        { id: SHARPNESS_ABILITY_ID, label: "Sharpness", summary: "" },
        { id: NO_ABILITY_ID, label: "—", accessibleLabel: "No ability", summary: "" },
      ],
      selectedIds: [BLAZE_ABILITY_ID],
      onChange: () => {},
      onReset: () => {},
    }),
  ))

  expect(markup).toContain("Resolved at HP ≤ ⅓")
  expect(markup).toContain("Resolved as statused")
  expect(markup).toContain("Resolved at full HP")
  expect(markup).toContain("Resolved as target poisoned")
  expect(markup).toContain("bg-signal-green")
  expect(markup).toContain("Effect not supported yet")
  expect(markup.match(/Effect not supported yet/g)).toHaveLength(1)
  expect(markup).not.toMatch(/Blaze[^"]*Effect not supported yet/)
  expect(markup).not.toMatch(/bg-destructive[^"]*bg-signal-green|bg-signal-green[^"]*bg-destructive/)
})

it("renders active abilities inline and folds inactive and unsupported states", () => {
  const row: ScenarioResult = {
    calculationIdentity: "ability-display",
    snapshotId: "ability-display",
    moveId: 33,
    moveType: "normal",
    attackerStatId: "neutral-max",
    defenderId: "standard-bulk",
    provenance: {
      "attacker-stage": {
        active: ["-1"],
        inactive: [],
        unsupported: [],
        neutral: [],
      },
      "attacker-ability": {
        active: ["91"],
        inactive: [],
        unsupported: [],
        neutral: [String(NO_ABILITY_ID), String(DROUGHT_ABILITY_ID)],
      },
      "defender-ability": {
        active: [],
        inactive: ["91"],
        unsupported: ["50"],
        neutral: [],
      },
    },
    criticalOnly: false,
    moveMechanics: {
      basePower: 40,
      normal: { effectivePower: 40, phases: [] },
      critical: { effectivePower: 60, phases: [] },
      hitFact: "always-hits",
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
  const abilities = [
    { id: NO_ABILITY_ID, label: "—", accessibleLabel: "No ability", summary: "" },
    { id: 91, label: "Adaptability", summary: "" },
    { id: 50, label: "Run Away", summary: "" },
    { id: DROUGHT_ABILITY_ID, label: "Drought", summary: "" },
  ]
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
        attackerAbilities: abilities,
        defenderAbilities: abilities,
        attackerStat: { id: "neutral-max", label: "Attack" },
        defender: { id: "standard-bulk", label: "Defense" },
        row,
        showAccuracy: true,
      }),
    ),
  ))

  expect(markup).toContain("Adaptability")
  expect(markup).toContain("Other conditions (2)")
  expect(markup).toContain("Inactive")
  expect(markup).toContain("Unsupported")
  expect(markup).toContain("Run Away")
  expect(markup).not.toContain("No ability")
  expect(markup).not.toContain("Drought")
  expect(markup).toContain(">-1<")
  expect(markup).toContain("Always hits")
})
