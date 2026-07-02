import { beforeAll, describe, expect, it } from "vitest"

import { getCatalog, listAttackers, type MatchupCatalog } from "@/lib/catalog"
import {
  defaultTrackState,
  expectedRowCount,
  RANGE_DEFENDER_ID,
  RANGE_STAT_ID,
  runScenarioPipeline,
} from "@/lib/scenario-pipeline"

const LOCALE = "zh-hans"

describe("catalog registry", () => {
  it("lists at least 3 attackers with distinct move picks", async () => {
    const attackers = await listAttackers(LOCALE)
    expect(attackers.length).toBeGreaterThanOrEqual(3)
    expect(attackers.every((a) => typeof a.id === "number")).toBe(true)

    const moveSets = await Promise.all(
      attackers.map(async (a) => {
        const catalog = await getCatalog(a.id, 727, LOCALE)
        return catalog.moves.map((m) => m.id).join(",")
      }),
    )
    expect(new Set(moveSets).size).toBe(attackers.length)
  })

  it("pre-selects default move pick only; extra moves stay in + pool", async () => {
    for (const attacker of await listAttackers(LOCALE)) {
      const catalog = await getCatalog(attacker.id, 727, LOCALE)
      const state = defaultTrackState(catalog)
      expect(state.visibleMoveIds).toEqual(catalog.defaultMoveIds)
      expect(state.moveIds).toEqual(catalog.defaultMoveIds)
      expect(catalog.moves.length).toBeGreaterThan(catalog.defaultMoveIds.length)
    }
  })

  it("routes special attackers through template pipeline", async () => {
    const catalog = await getCatalog(987, 727, LOCALE)
    expect(catalog.moveCategory).toBe("special")

    const state = defaultTrackState(catalog)
    const rows = runScenarioPipeline(catalog, state)
    expect(rows.length).toBe(expectedRowCount(state))
    expect(rows.every((r) => r.minDamage > 0)).toBe(true)
  })

  it("includes all type-boost items in attackerItems after core options", async () => {
    const catalog = await getCatalog(445, 727, LOCALE)
    const ids = catalog.attackerItems.map((item) => item.id)
    expect(ids.slice(0, 3)).toEqual(["none", "life-orb", "choice-band"])
    expect(ids).toContain("type-boost-ground")
    expect(ids).toContain("type-boost-fairy")
    expect(catalog.attackerTypes).toEqual(["dragon", "ground"])
  })

  it("keeps scenario identities stable while localized display strings change", async () => {
    const zh = await getCatalog(445, 727, "zh-hans")
    const en = await getCatalog(445, 727, "en")

    expect(zh.matchup.attackerId).toBe(en.matchup.attackerId)
    expect(zh.matchup.defenderId).toBe(en.matchup.defenderId)
    expect(zh.moves.map((m) => m.id)).toEqual(en.moves.map((m) => m.id))
    expect(zh.matchup.attackerLabel).toBe("烈咬陆鲨")
    expect(en.matchup.attackerLabel).toBe("Garchomp")
    expect(zh.moves.find((m) => m.id === 89)?.label).toBe("地震")
    expect(en.moves.find((m) => m.id === 89)?.label).toBe("Earthquake")
  })
})

describe("matchup scenario pipeline", () => {
  let catalog: MatchupCatalog

  beforeAll(async () => {
    catalog = await getCatalog(445, 727, LOCALE)
  })

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
    state.moveIds = [89]
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(2)
    expect(rows.every((r) => r.moveId === 89)).toBe(true)
  })

  it("does not compute rows for visible moves that are not selected", () => {
    const state = defaultTrackState(catalog)
    state.visibleMoveIds = [89, 707]
    state.moveIds = [89]
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(2)
    expect(expectedRowCount(state)).toBe(2)
    expect(rows.every((r) => r.moveId === 89)).toBe(true)
  })

  it("filters preset rows when offense template is deselected", () => {
    const state = defaultTrackState(catalog)
    state.offenseTemplateIds = ["extreme"]
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(3)
    expect(rows.every((r) => r.attackerStatId === "extreme")).toBe(true)
  })

  it("computes damage for alternate defender species", async () => {
    const amoonguss = await getCatalog(445, 591, LOCALE)
    const state = defaultTrackState(amoonguss)
    const rows = runScenarioPipeline(amoonguss, state)
    expect(rows.length).toBe(expectedRowCount(state))
    expect(rows.every((r) => r.minDamage > 0)).toBe(true)
  })

  it("applies type-boost item modifier for matching move type", () => {
    const state = defaultTrackState(catalog)
    state.moveIds = [89]
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

describe("matchup scenario pipeline - range mode", () => {
  let catalog: MatchupCatalog

  beforeAll(async () => {
    catalog = await getCatalog(445, 727, LOCALE)
  })

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
    state.moveIds = [89]
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
    state.moveIds = [89]
    state.attackerItemIds = ["none"]
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(1)
    expect(rows[0].attackerStatId).toBe(RANGE_STAT_ID)
    expect(rows[0].defenderId).toBe(RANGE_DEFENDER_ID)
  })
})
