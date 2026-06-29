import { describe, expect, it } from "vitest"

import { getAttackerStatSetups, getDefenderSetups } from "@/lib/calc-adapter"
import { getCatalog } from "@/lib/catalog"
import {
  buildSystemDefenseTemplates,
  buildSystemOffenseTemplates,
  enumerateOffenseAllocations,
  evToAbilityPoints,
  defenseSpreadLabel,
  offenseSpreadLabel,
  templateCardLabel,
} from "@/lib/stat-value-template"

describe("ability points label engine", () => {
  const catalog = getCatalog("garchomp", "incineroar")
  const { attackerSpecies, defenderSpecies } = catalog.matchup
  const category = catalog.moveCategory

  it("maps system offense presets to 0 / 32 / ex", () => {
    const templates = buildSystemOffenseTemplates(attackerSpecies, category)
    const zero = templates.find((t) => t.id === "neutral-zero")!
    const max = templates.find((t) => t.id === "neutral-max")!
    const ex = templates.find((t) => t.id === "extreme")!

    expect(templateCardLabel(zero, attackerSpecies, category)).toBe("0")
    expect(templateCardLabel(max, attackerSpecies, category)).toBe("32")
    expect(templateCardLabel(ex, attackerSpecies, category)).toBe("ex")
  })

  it("maps system defense presets to 0 / 32HP / ex", () => {
    const templates = buildSystemDefenseTemplates(defenderSpecies, category)
    const zero = templates.find((t) => t.id === "min-bulk")!
    const hp32 = templates.find((t) => t.id === "hp-32")!
    const ex = templates.find((t) => t.id === "standard-bulk")!

    expect(templateCardLabel(zero, defenderSpecies, category)).toBe("0")
    expect(templateCardLabel(hp32, defenderSpecies, category)).toBe("32HP")
    expect(templateCardLabel(ex, defenderSpecies, category)).toBe("ex")
  })

  it("labels extreme spread as ex via spread label helper", () => {
    const setup = getAttackerStatSetups(category).extreme
    expect(offenseSpreadLabel(setup, category)).toBe("ex")
  })

  it("uses integer ability points only", () => {
    expect(evToAbilityPoints(0)).toBe(0)
    expect(evToAbilityPoints(4)).toBe(1)
    expect(evToAbilityPoints(252)).toBe(32)
    expect(Number.isInteger(evToAbilityPoints(100))).toBe(true)
  })

  it("excludes minus-nature allocations from display", () => {
    const zero = buildSystemOffenseTemplates(
      catalog.matchup.attackerSpecies,
      category,
    ).find((t) => t.id === "neutral-zero")!
    const stat = zero.values.kind === "offense" ? zero.values.stat : 0
    const allocs = enumerateOffenseAllocations(catalog.matchup.attackerSpecies, category, stat)
    expect(allocs.every((a) => !a.cardLabel.endsWith("-"))).toBe(true)
  })

  it("enumerates multiple offense allocations for ex stat", () => {
    const exTemplate = buildSystemOffenseTemplates(attackerSpecies, category).find(
      (t) => t.id === "extreme",
    )!
    const allocs = enumerateOffenseAllocations(
      attackerSpecies,
      category,
      exTemplate.values.kind === "offense" ? exTemplate.values.stat : 0,
    )
    expect(allocs.length).toBeGreaterThanOrEqual(1)
    expect(allocs.some((a) => a.cardLabel === "ex")).toBe(true)
  })

  it("labels user templates with ability points even when stat is off-grid", () => {
    const max = buildSystemOffenseTemplates(attackerSpecies, category).find(
      (t) => t.id === "neutral-max",
    )!
    const stat = max.values.kind === "offense" ? max.values.stat : 0
    const offGrid = { id: "user-x", kind: "user" as const, values: { kind: "offense" as const, stat: stat + 1 } }
    const label = templateCardLabel(offGrid, attackerSpecies, category)
    expect(label).not.toBe(String(stat + 1))
    expect(label).toMatch(/^(ex|\d+\+?|\d+)$/)
  })
})

describe("defense spread label", () => {
  it("maps standard bulk to ex", () => {
    const setup = getDefenderSetups("physical")["standard-bulk"]
    expect(defenseSpreadLabel(setup, "physical")).toBe("ex")
  })
})
