import { describe, expect, it } from "vitest"

import { getAttackerStatSetups, getDefenderSetups } from "@/lib/calc-adapter"
import {
  GARCHOMP_INCINEROAR_CATALOG,
  getCatalog,
  listAttackers,
} from "@/lib/catalog"
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

  it("pre-selects all top-N moves on default track state", () => {
    for (const attacker of listAttackers()) {
      const catalog = getCatalog(attacker.id, "incineroar")
      const state = defaultTrackState(catalog)
      expect(state.moveIds).toEqual(catalog.defaultMoveIds)
      expect(state.moveIds).toHaveLength(catalog.moves.length)
    }
  })

  it("routes special attackers to spa/spd presets", () => {
    const catalog = getCatalog("flutter-mane", "incineroar")
    expect(catalog.moveCategory).toBe("special")
    expect(catalog.offenseStatLabel).toBe("特攻")

    const atkSetup = getAttackerStatSetups("special").extreme
    const defSetup = getDefenderSetups("special")["standard-bulk"]
    expect(atkSetup.evs.spa).toBe(252)
    expect(defSetup.evs.spd).toBe(252)

    const state = defaultTrackState(catalog)
    const rows = runScenarioPipeline(catalog, state)
    expect(rows.length).toBe(expectedRowCount(state))
    expect(rows.every((r) => r.minDamage > 0)).toBe(true)
  })

  it("resets row product when attacker changes move pick size", () => {
    const garchomp = defaultTrackState(GARCHOMP_INCINEROAR_CATALOG)
    const landorus = defaultTrackState(getCatalog("landorus-therian", "incineroar"))
    expect(garchomp.moveIds).toHaveLength(3)
    expect(landorus.moveIds).toHaveLength(3)
    expect(garchomp.moveIds).not.toEqual(landorus.moveIds)
  })
})

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
    expect(catalog.attackerStats).toHaveLength(3)
    expect(catalog.attackerItems).toHaveLength(3)
    expect(catalog.defenderBulks).toHaveLength(3)
  })

  it("filters preset rows when stat preset is deselected", () => {
    const state = defaultTrackState(catalog)
    state.attackerStatIds = ["extreme"]
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(6)
    expect(rows.every((r) => r.attackerStatId === "extreme")).toBe(true)
  })

  it("computes damage for alternate defender species", () => {
    const amoonguss = getCatalog("garchomp", "amoonguss")
    const state = defaultTrackState(amoonguss)
    const rows = runScenarioPipeline(amoonguss, state)
    expect(rows).toHaveLength(6)
    expect(rows.every((r) => r.minDamage > 0)).toBe(true)
  })
})

describe("matchup scenario pipeline — range mode", () => {
  const catalog = GARCHOMP_INCINEROAR_CATALOG

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
    expect(rows.every((r) => r.attackerStatId === "neutral-max")).toBe(true)
    expect(rows.every((r) => r.statRange == null)).toBe(true)
  })

  it("recomputes stat bounds when attacker species changes", () => {
    const garchomp = getCatalog("garchomp", "incineroar")
    const flutter = getCatalog("flutter-mane", "incineroar")
    const gState = defaultTrackState(garchomp)
    const fState = defaultTrackState(flutter)
    expect(gState.statRange).not.toEqual(fState.statRange)
  })

  it("defender range mode: row count = moves × stats × items (defender track = 1)", () => {
    const state = defaultTrackState(catalog)
    state.defenderMode = "range"
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(6)
    expect(expectedRowCount(state)).toBe(6)
    expect(rows.every((r) => r.defenderId === RANGE_DEFENDER_ID)).toBe(true)
    expect(rows.every((r) => r.defenderRanges != null)).toBe(true)
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
