import { beforeAll, describe, expect, it } from "vitest"

import { getAttackerStatSetups, getDefenderSetups } from "@/lib/calc-adapter"
import { getCatalogShell } from "@/lib/catalog"
import {
  buildSystemDefenseTemplates,
  buildSystemOffenseTemplates,
  defenseSpLabel,
  enumerateOffenseAllocations,
  evToAbilityPoints,
  EX_LABEL,
  offenseSpLabel,
  offenseSpreadLabel,
  defenseSpreadLabel,
  resolveTemplateDisplay,
  templateCardLabel,
} from "@/lib/stat-value-template"

describe("SP label engine", () => {
  let attackerSpecies: string
  let defenderSpecies: string
  let category: "physical" | "special"
  const strategy = "habcds" as const

  beforeAll(async () => {
    const catalog = await getCatalogShell(445, 727, "zh-hans")
    attackerSpecies = catalog.matchup.attackerSpecies
    defenderSpecies = catalog.matchup.defenderSpecies
    category = catalog.moveCategory
  })

  it("maps system offense presets to 0A / 32A / EX", () => {
    const templates = buildSystemOffenseTemplates(attackerSpecies, category)
    const zero = templates.find((t) => t.id === "neutral-zero")!
    const max = templates.find((t) => t.id === "neutral-max")!
    const ex = templates.find((t) => t.id === "extreme")!

    expect(templateCardLabel(zero, attackerSpecies, category, 0, strategy)).toBe("0A")
    expect(templateCardLabel(max, attackerSpecies, category, 0, strategy)).toBe("32A")
    expect(templateCardLabel(ex, attackerSpecies, category, 0, strategy)).toBe(EX_LABEL)
  })

  it("maps system defense presets to 0H0B / 32H0B / EX", () => {
    const templates = buildSystemDefenseTemplates(defenderSpecies, category)
    const zero = templates.find((t) => t.id === "min-bulk")!
    const hp32 = templates.find((t) => t.id === "hp-32")!
    const ex = templates.find((t) => t.id === "standard-bulk")!

    expect(templateCardLabel(zero, defenderSpecies, category, 0, strategy)).toBe("0H0B")
    expect(templateCardLabel(hp32, defenderSpecies, category, 0, strategy)).toBe("32H0B")
    expect(templateCardLabel(ex, defenderSpecies, category, 0, strategy)).toBe(EX_LABEL)
  })

  it("formats offense and defense SP segments", () => {
    expect(offenseSpLabel(32, "+", "physical", strategy)).toBe(EX_LABEL)
    expect(offenseSpLabel(0, "-", "physical", strategy)).toBe("0A-")
    expect(defenseSpLabel(32, 20, "+", "physical", strategy)).toBe("32H20B+")
    expect(defenseSpLabel(32, 32, "+", "physical", strategy)).toBe(EX_LABEL)
  })

  it("never emits 32HP shorthand", () => {
    const hp32 = buildSystemDefenseTemplates(defenderSpecies, category).find(
      (t) => t.id === "hp-32",
    )!
    expect(templateCardLabel(hp32, defenderSpecies, category, 0, strategy)).not.toContain("32HP")
  })

  it("labels extreme spread as EX via spread label helper", () => {
    const setup = getAttackerStatSetups(category).extreme
    expect(offenseSpreadLabel(setup, category, strategy)).toBe(EX_LABEL)
  })

  it("labels standard bulk as EX via defense spread label", () => {
    const setup = getDefenderSetups("physical")["standard-bulk"]
    expect(defenseSpreadLabel(setup, "physical", strategy)).toBe(EX_LABEL)
  })

  it("uses integer SP only", () => {
    expect(evToAbilityPoints(252)).toBe(32)
    expect(Number.isInteger(evToAbilityPoints(100))).toBe(true)
  })

  it("excludes minus-nature allocations from display", () => {
    const zero = buildSystemOffenseTemplates(attackerSpecies, category).find(
      (t) => t.id === "neutral-zero",
    )!
    const stat = zero.values.kind === "offense" ? zero.values.stat : 0
    const allocs = enumerateOffenseAllocations(attackerSpecies, category, stat, strategy)
    expect(allocs.every((a) => !a.cardLabel.endsWith("-"))).toBe(true)
  })

  it("defaults multi-allocation to neutral-first entry", () => {
    const exTemplate = buildSystemOffenseTemplates(attackerSpecies, category).find(
      (t) => t.id === "extreme",
    )!
    const stat = exTemplate.values.kind === "offense" ? exTemplate.values.stat : 0
    const allocs = enumerateOffenseAllocations(attackerSpecies, category, stat, strategy)
    expect(allocs.length).toBeGreaterThanOrEqual(1)
    expect(allocs[0].cardLabel).toBe(EX_LABEL)
  })

  it("supports english stat name strategy", () => {
    const max = buildSystemOffenseTemplates(attackerSpecies, category).find(
      (t) => t.id === "neutral-max",
    )!
    expect(templateCardLabel(max, attackerSpecies, category, 0, "english")).toBe("32Atk")
  })

  it("tooltip lists actual value and allocation labels", () => {
    const max = buildSystemOffenseTemplates(attackerSpecies, category).find(
      (t) => t.id === "neutral-max",
    )!
    const display = resolveTemplateDisplay(max, attackerSpecies, category, 0, strategy)
    expect(display.tooltip).toContain(display.primary)
    expect(display.allocations.length).toBeGreaterThan(0)
    for (const alloc of display.allocations) {
      expect(display.tooltip).toContain(alloc.cardLabel)
    }
  })

  it("labels off-grid user templates with SP not raw stat", () => {
    const max = buildSystemOffenseTemplates(attackerSpecies, category).find(
      (t) => t.id === "neutral-max",
    )!
    const stat = max.values.kind === "offense" ? max.values.stat : 0
    const offGrid = {
      id: "user-x",
      kind: "user" as const,
      values: { kind: "offense" as const, stat: stat + 1 },
    }
    const label = templateCardLabel(offGrid, attackerSpecies, category, 0, strategy)
    expect(label).not.toBe(String(stat + 1))
  })
})
