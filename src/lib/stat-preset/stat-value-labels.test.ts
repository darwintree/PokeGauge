import { beforeAll, describe, expect, it } from "vitest"

import { getAttackerStatSetups, getDefenderSetups } from "@/lib/calc-adapter"
import { getCatalogShell } from "@/lib/catalog"
import {
  buildSystemDefensePresets,
  buildSystemOffensePresets,
  defenseStatValueLabel,
  enumerateOffenseAllocations,
  evToStatPoints,
  EX_LABEL,
  offenseStatValueLabel,
  offenseStatAllocationLabel,
  defenseStatAllocationLabel,
  resolveStatPresetDisplay,
  statPresetLabel,
} from "@/lib/stat-preset"

describe("SP label engine", () => {
  let attackerCalcName: string
  let defenderCalcName: string
  let category: "physical" | "special"
  const strategy = "habcds" as const

  beforeAll(async () => {
    const catalog = await getCatalogShell(445, 727, "zh-hans")
    attackerCalcName = catalog.matchup.attackerCalcName
    defenderCalcName = catalog.matchup.defenderCalcName
    category = catalog.moveCategory
  })

  it("maps system offense presets to 0A / 32A / EX", () => {
    const presets = buildSystemOffensePresets(attackerCalcName, category)
    const zero = presets.find((t) => t.id === "neutral-zero")!
    const max = presets.find((t) => t.id === "neutral-max")!
    const ex = presets.find((t) => t.id === "extreme")!

    expect(statPresetLabel(zero, attackerCalcName, category, 0, strategy)).toBe("0A")
    expect(statPresetLabel(max, attackerCalcName, category, 0, strategy)).toBe("32A")
    expect(statPresetLabel(ex, attackerCalcName, category, 0, strategy)).toBe(EX_LABEL)
  })

  it("maps system defense presets to 0H0B / 32H0B / EX", () => {
    const presets = buildSystemDefensePresets(defenderCalcName, category)
    const zero = presets.find((t) => t.id === "min-bulk")!
    const hp32 = presets.find((t) => t.id === "hp-32")!
    const ex = presets.find((t) => t.id === "standard-bulk")!

    expect(statPresetLabel(zero, defenderCalcName, category, 0, strategy)).toBe("0H0B")
    expect(statPresetLabel(hp32, defenderCalcName, category, 0, strategy)).toBe("32H0B")
    expect(statPresetLabel(ex, defenderCalcName, category, 0, strategy)).toBe(EX_LABEL)
  })

  it("formats offense and defense SP segments", () => {
    expect(offenseStatValueLabel(32, "+", "physical", strategy)).toBe(EX_LABEL)
    expect(offenseStatValueLabel(0, "-", "physical", strategy)).toBe("0A-")
    expect(defenseStatValueLabel(32, 20, "+", "physical", strategy)).toBe("32H20B+")
    expect(defenseStatValueLabel(32, 32, "+", "physical", strategy)).toBe(EX_LABEL)
  })

  it("never emits 32HP shorthand", () => {
    const hp32 = buildSystemDefensePresets(defenderCalcName, category).find(
      (t) => t.id === "hp-32",
    )!
    expect(statPresetLabel(hp32, defenderCalcName, category, 0, strategy)).not.toContain("32HP")
  })

  it("labels extreme spread as EX via spread label helper", () => {
    const setup = getAttackerStatSetups(category).extreme
    expect(offenseStatAllocationLabel(setup, category, strategy)).toBe(EX_LABEL)
  })

  it("labels standard bulk as EX via defense spread label", () => {
    const setup = getDefenderSetups("physical")["standard-bulk"]
    expect(defenseStatAllocationLabel(setup, "physical", strategy)).toBe(EX_LABEL)
  })

  it("uses integer SP only", () => {
    expect(evToStatPoints(252)).toBe(32)
    expect(Number.isInteger(evToStatPoints(100))).toBe(true)
  })

  it("excludes minus-nature allocations from display", () => {
    const zero = buildSystemOffensePresets(attackerCalcName, category).find(
      (t) => t.id === "neutral-zero",
    )!
    const stat = zero.values.kind === "offense" ? zero.values.stat : 0
    const allocs = enumerateOffenseAllocations(attackerCalcName, category, stat, strategy)
    expect(allocs.every((a) => !a.label.endsWith("-"))).toBe(true)
  })

  it("defaults multi-allocation to neutral-first entry", () => {
    const exPreset = buildSystemOffensePresets(attackerCalcName, category).find(
      (t) => t.id === "extreme",
    )!
    const stat = exPreset.values.kind === "offense" ? exPreset.values.stat : 0
    const allocs = enumerateOffenseAllocations(attackerCalcName, category, stat, strategy)
    expect(allocs.length).toBeGreaterThanOrEqual(1)
    expect(allocs[0].label).toBe(EX_LABEL)
  })

  it("supports english stat name strategy", () => {
    const max = buildSystemOffensePresets(attackerCalcName, category).find(
      (t) => t.id === "neutral-max",
    )!
    expect(statPresetLabel(max, attackerCalcName, category, 0, "english")).toBe("32Atk")
  })

  it("tooltip lists the Stat Value and Stat Allocation labels", () => {
    const max = buildSystemOffensePresets(attackerCalcName, category).find(
      (t) => t.id === "neutral-max",
    )!
    const display = resolveStatPresetDisplay(max, attackerCalcName, category, 0, strategy)
    expect(display.tooltip).toContain(display.primary)
    expect(display.allocations.length).toBeGreaterThan(0)
    for (const alloc of display.allocations) {
      expect(display.tooltip).toContain(alloc.label)
    }
  })

  it("uses Stat Values when offense and defense have no Stat Allocation", () => {
    const offGrid = {
      id: "user-x",
      kind: "user" as const,
      values: { kind: "offense" as const, stat: 186 },
    }
    const offenseDisplay = resolveStatPresetDisplay(
      offGrid,
      attackerCalcName,
      category,
      0,
      strategy,
    )
    expect(offenseDisplay.primary).toBe("186")
    expect(offenseDisplay.allocations).toHaveLength(0)

    const defenseOffGrid = {
      id: "user-y",
      kind: "user" as const,
      values: { kind: "defense" as const, hp: 170, def: 153 },
    }
    const defenseDisplay = resolveStatPresetDisplay(
      defenseOffGrid,
      defenderCalcName,
      category,
      0,
      strategy,
    )
    expect(defenseDisplay.primary).toBe("170 / 153")
    expect(defenseDisplay.allocations).toHaveLength(0)
  })
})
