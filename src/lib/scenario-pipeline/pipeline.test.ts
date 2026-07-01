import { describe, expect, it } from "vitest"

import { getCatalog, listAttackers } from "@/lib/catalog"
import {
  defaultTrackState,
  expectedRowCount,
  RANGE_DEFENDER_ID,
  RANGE_STAT_ID,
  runScenarioPipeline,
} from "@/lib/scenario-pipeline"

describe("catalog registry", () => {
  it("lists at least 3 attackers with distinct move picks", () => {
    const attackers = listAttackers()
    expect(attackers.length).toBeGreaterThanOrEqual(3)

    const moveSets = attackers.map((a) => {
      const catalog = getCatalog(a.id, "incineroar")
      return catalog.moves.map((m) => m.id).join(",")
    })
    expect(new Set(moveSets).size).toBe(attackers.length)
  })

  it("pre-selects default move pick only; extra moves stay in + pool", () => {
    for (const attacker of listAttackers()) {
      const catalog = getCatalog(attacker.id, "incineroar")
      const state = defaultTrackState(catalog)
      expect(state.visibleMoveIds).toEqual(catalog.defaultMoveIds)
      expect(state.moveIds).toEqual(catalog.defaultMoveIds)
      expect(catalog.moves.length).toBeGreaterThan(catalog.defaultMoveIds.length)
    }
  })

  it("routes special attackers through template pipeline", () => {
    const catalog = getCatalog("flutter-mane", "incineroar")
    expect(catalog.moveCategory).toBe("special")

    const state = defaultTrackState(catalog)
    const rows = runScenarioPipeline(catalog, state)
    expect(rows.length).toBe(expectedRowCount(state))
    expect(rows.every((r) => r.minDamage > 0)).toBe(true)
  })

  it("includes all type-boost items in attackerItems after core options", () => {
    const catalog = getCatalog("garchomp", "incineroar")
    const ids = catalog.attackerItems.map((item) => item.id)
    expect(ids.slice(0, 3)).toEqual(["none", "life-orb", "choice-band"])
    expect(ids).toContain("type-boost-ground")
    expect(ids).toContain("type-boost-fairy")
    expect(catalog.attackerTypes).toEqual(["dragon", "ground"])
  })
})

describe("matchup scenario pipeline", () => {
  const catalog = getCatalog("garchomp", "incineroar")

  it("returns 6 rows for default template selections (32 + ex × 32HP × none)", () => {
    const state = defaultTrackState(catalog)
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(6)
    expect(expectedRowCount(state)).toBe(6)
    expect(state.offenseTemplateIds).toEqual(
      expect.arrayContaining(["neutral-max", "extreme"]),
    )
    expect(state.defenseTemplateIds).toEqual(["hp-32"])
  })

  it("reduces row count when a move is deselected", () => {
    const state = defaultTrackState(catalog)
    state.moveIds = ["earthquake"]
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(2)
    expect(rows.every((r) => r.moveId === "earthquake")).toBe(true)
  })

  it("does not compute rows for visible moves that are not selected", () => {
    const state = defaultTrackState(catalog)
    state.visibleMoveIds = ["earthquake", "stomping-tantrum"]
    state.moveIds = ["earthquake"]
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(2)
    expect(expectedRowCount(state)).toBe(2)
    expect(rows.every((r) => r.moveId === "earthquake")).toBe(true)
  })

  it("filters preset rows when offense template is deselected", () => {
    const state = defaultTrackState(catalog)
    state.offenseTemplateIds = ["extreme"]
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(3)
    expect(rows.every((r) => r.attackerStatId === "extreme")).toBe(true)
  })

  it("computes damage for alternate defender species", () => {
    const amoonguss = getCatalog("garchomp", "amoonguss")
    const state = defaultTrackState(amoonguss)
    const rows = runScenarioPipeline(amoonguss, state)
    expect(rows.length).toBe(expectedRowCount(state))
    expect(rows.every((r) => r.minDamage > 0)).toBe(true)
  })

  it("applies type-boost item modifier for matching move type", () => {
    const state = defaultTrackState(catalog)
    state.moveIds = ["earthquake"]
    state.offenseTemplateIds = ["extreme"]
    state.defenseTemplateIds = ["hp-32"]

    const noneRows = runScenarioPipeline(catalog, {
      ...state,
      attackerItemIds: ["none"],
    })
    const sandRows = runScenarioPipeline(catalog, {
      ...state,
      attackerItemIds: ["type-boost-ground"],
    })

    expect(noneRows).toHaveLength(1)
    expect(sandRows).toHaveLength(1)
    expect(sandRows[0].maxDamage).toBeGreaterThan(noneRows[0].maxDamage)
  })
})

describe("matchup scenario pipeline — range mode", () => {
  const catalog = getCatalog("garchomp", "incineroar")

  it("range mode: row count = moves × items × defenders (offense track = 1)", () => {
    const state = defaultTrackState(catalog)
    state.statMode = "range"
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(3)
    expect(expectedRowCount(state)).toBe(3)
    expect(rows.every((r) => r.attackerStatId === RANGE_STAT_ID)).toBe(true)
    expect(rows.every((r) => r.statRange != null)).toBe(true)
  })

  it("range mode excludes preset template selections from row product", () => {
    const state = defaultTrackState(catalog)
    state.statMode = "range"
    state.offenseTemplateIds = ["neutral-zero", "extreme"]
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(3)
    expect(rows.every((r) => r.attackerStatId === RANGE_STAT_ID)).toBe(true)
  })

  it("range mode envelope spans low-end min to high-end max damage", () => {
    const state = defaultTrackState(catalog)
    state.statMode = "range"
    state.moveIds = ["earthquake"]
    state.attackerItemIds = ["none"]
    state.defenseTemplateIds = ["standard-bulk"]
    state.statRange = { min: 100, max: 200 }

    const [row] = runScenarioPipeline(catalog, state)
    expect(row).toBeDefined()
    expect(row.minDamage).toBeLessThan(row.maxDamage)
    expect(row.maxPercent).toBeGreaterThan(row.minPercent)
  })

  it("defender range mode: row count = moves × stats × items (defender track = 1)", () => {
    const state = defaultTrackState(catalog)
    state.defenderMode = "range"
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(6)
    expect(expectedRowCount(state)).toBe(6)
    expect(rows.every((r) => r.defenderId === RANGE_DEFENDER_ID)).toBe(true)
  })

  it("both tracks in range mode produce one row per move × item", () => {
    const state = defaultTrackState(catalog)
    state.statMode = "range"
    state.defenderMode = "range"
    state.moveIds = ["earthquake"]
    state.attackerItemIds = ["none"]
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(1)
    expect(rows[0].attackerStatId).toBe(RANGE_STAT_ID)
    expect(rows[0].defenderId).toBe(RANGE_DEFENDER_ID)
  })
})
