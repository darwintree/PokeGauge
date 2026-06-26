import { describe, expect, it } from "vitest"

import { GARCHOMP_INCINEROAR_CATALOG } from "@/lib/catalog"
import {
  defaultTrackState,
  expectedRowCount,
  RANGE_STAT_ID,
  runScenarioPipeline,
} from "@/lib/scenario-pipeline"

describe("matchup scenario pipeline", () => {
  const catalog = GARCHOMP_INCINEROAR_CATALOG

  it("returns 6 rows for default track selections", () => {
    const state = defaultTrackState(catalog)
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(6)
    expect(expectedRowCount(state)).toBe(6)
  })

  it("reduces row count when a move is deselected", () => {
    const state = defaultTrackState(catalog)
    state.moveIds = ["earthquake"]
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(2)
    expect(rows.every((r) => r.moveId === "earthquake")).toBe(true)
  })

  it("sorts rows by catalog order: move → stat → item → defender", () => {
    const state = defaultTrackState(catalog)
    const rows = runScenarioPipeline(catalog, state)

    const moveIds = [...new Set(rows.map((r) => r.moveId))]
    expect(moveIds).toEqual(["earthquake", "dragon-claw", "stone-edge"])

    for (let i = 1; i < rows.length; i++) {
      const prev = rows[i - 1]
      const curr = rows[i]
      const moveOrder =
        catalog.moves.findIndex((m) => m.id === prev.moveId) -
        catalog.moves.findIndex((m) => m.id === curr.moveId)
      if (moveOrder !== 0) {
        expect(moveOrder).toBeLessThanOrEqual(0)
        continue
      }
      const itemOrder =
        catalog.attackerItems.findIndex((m) => m.id === prev.attackerItemId) -
        catalog.attackerItems.findIndex((m) => m.id === curr.attackerItemId)
      if (itemOrder !== 0) {
        expect(itemOrder).toBeLessThanOrEqual(0)
      }
    }
  })

  it("exposes full catalog options beyond defaults", () => {
    expect(catalog.moves).toHaveLength(3)
    expect(catalog.attackerStats).toHaveLength(4)
    expect(catalog.attackerItems).toHaveLength(3)
    expect(catalog.defenderBulks).toHaveLength(2)
  })

  it("filters preset rows when stat preset is deselected", () => {
    const state = defaultTrackState(catalog)
    state.attackerStatIds = ["extreme"]
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(6)
    expect(rows.every((r) => r.attackerStatId === "extreme")).toBe(true)
  })

  it("range mode: row count = moves × items × defenders (offense track = 1)", () => {
    const state = defaultTrackState(catalog)
    state.statMode = "range"
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(6)
    expect(expectedRowCount(state)).toBe(6)
    expect(rows.every((r) => r.attackerStatId === RANGE_STAT_ID)).toBe(true)
    expect(rows.every((r) => r.statRange != null)).toBe(true)
  })

  it("range mode excludes preset stat selections from row product", () => {
    const state = defaultTrackState(catalog)
    state.statMode = "range"
    state.attackerStatIds = ["neutral-zero", "extreme"]
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(6)
    expect(rows.every((r) => r.attackerStatId === RANGE_STAT_ID)).toBe(true)
  })

  it("range mode envelope spans low-end min to high-end max damage", () => {
    const state = defaultTrackState(catalog)
    state.statMode = "range"
    state.moveIds = ["earthquake"]
    state.attackerItemIds = ["none"]
    state.defenderIds = ["standard-bulk"]
    state.statRange = { min: 100, max: 200 }

    const [row] = runScenarioPipeline(catalog, state)
    expect(row).toBeDefined()
    expect(row.minDamage).toBeLessThan(row.maxDamage)
    expect(row.maxPercent).toBeGreaterThan(row.minPercent)
    expect(row.critMaxPercent).toBeGreaterThanOrEqual(row.critMinPercent)
  })

  it("switching back to preset mode restores preset rows", () => {
    const state = defaultTrackState(catalog)
    state.statMode = "range"
    runScenarioPipeline(catalog, state)

    state.statMode = "preset"
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(6)
    expect(rows.every((r) => r.attackerStatId === "standard")).toBe(true)
    expect(rows.every((r) => r.statRange == null)).toBe(true)
  })
})
