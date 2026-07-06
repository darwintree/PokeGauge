import { beforeAll, beforeEach, describe, expect, it } from "vitest"

import { setChampionsMoveUsageFetcherForTest } from "@/lib/champions"
import {
  getCatalog,
  getCatalogShell,
  listDefenders,
  listAttackers,
  resolveCatalogDefaultMovePick,
  type MatchupCatalog,
} from "@/lib/catalog"
import {
  defaultTrackState,
  expectedRowCount,
  RANGE_DEFENDER_ID,
  RANGE_STAT_ID,
  runScenarioPipeline,
} from "@/lib/scenario-pipeline"

const LOCALE = "zh-hans"

function installChampionsMoveUsageFixture() {
  setChampionsMoveUsageFetcherForTest(async (battlePokemonId) => {
    if (battlePokemonId !== 445) return []
    return [
      { battlePokemonId, moveId: 337, format: "Doubles", season: "test", source: "test", rank: 1, percentage: 89.1, championsMoveName: "Dragon Claw" },
      { battlePokemonId, moveId: 157, format: "Doubles", season: "test", source: "test", rank: 2, percentage: 84.3, championsMoveName: "Rock Slide" },
      { battlePokemonId, moveId: 89, format: "Doubles", season: "test", source: "test", rank: 3, percentage: 78.8, championsMoveName: "Earthquake" },
      { battlePokemonId, moveId: 182, format: "Doubles", season: "test", source: "test", rank: 4, percentage: 73, championsMoveName: "Protect" },
      { battlePokemonId, moveId: 707, format: "Doubles", season: "test", source: "test", rank: 5, percentage: 32.1, championsMoveName: "Stomping Tantrum" },
      { battlePokemonId, moveId: 398, format: "Doubles", season: "test", source: "test", rank: 6, percentage: 16.2, championsMoveName: "Poison Jab" },
      { battlePokemonId, moveId: 317, format: "Doubles", season: "test", source: "test", rank: 7, percentage: 8.6, championsMoveName: "Rock Tomb" },
    ]
  })
}

beforeAll(() => {
  installChampionsMoveUsageFixture()
})

beforeEach(() => {
  installChampionsMoveUsageFixture()
})

describe("catalog registry", () => {
  it("shares localized Pokemon options per locale for attacker and defender lists", async () => {
    const [zhAttackers, zhDefenders] = await Promise.all([
      listAttackers("zh-hans"),
      listDefenders("zh-hans"),
    ])
    const enAttackers = await listAttackers("en")

    expect(zhAttackers).toBe(zhDefenders)
    expect(zhAttackers.map((pokemon) => pokemon.id)).toEqual(
      zhAttackers.toSorted((a, b) => a.label.localeCompare(b.label)).map((pokemon) => pokemon.id),
    )
    expect(zhAttackers.map((pokemon) => pokemon.id).toSorted((a, b) => a - b)).toEqual(
      enAttackers.map((pokemon) => pokemon.id).toSorted((a, b) => a - b),
    )
    expect(zhAttackers.find((pokemon) => pokemon.id === 445)?.label).toBe("烈咬陆鲨")
    expect(enAttackers.find((pokemon) => pokemon.id === 445)?.label).toBe("Garchomp")
  })

  it("lists generated battle Pokemon and seeds move picks for each", async () => {
    const attackers = await listAttackers(LOCALE)
    expect(attackers.length).toBeGreaterThanOrEqual(3)
    expect(attackers.every((a) => typeof a.id === "number")).toBe(true)

    const sampledAttackers = [
      ...attackers.slice(0, 24),
      attackers.find((attacker) => attacker.id === 445),
    ].filter((attacker) => attacker !== undefined)
    const defaultMoveSets = await Promise.all(
      sampledAttackers.map(async (a) => {
        const catalog = await getCatalog(a.id, 727, LOCALE)
        if (a.id === 445) {
          expect(catalog.defaultMoveIds.length).toBeGreaterThan(0)
        } else {
          expect(catalog.defaultMoveIds).toEqual([])
        }
        expect(catalog.defaultMoveIds.every((id) => catalog.moves.some((m) => m.id === id))).toBe(
          true,
        )
        expect(catalog.moves.length).toBeGreaterThan(0)
        return catalog.defaultMoveIds.join(",")
      }),
    )
    expect(new Set(defaultMoveSets).size).toBeGreaterThan(1)
  })

  it("pre-selects default move pick only; extra moves stay in + pool", async () => {
    for (const attacker of (await listAttackers(LOCALE)).slice(0, 24)) {
      const catalog = await getCatalog(attacker.id, 727, LOCALE)
      const state = defaultTrackState(catalog)
      expect(state.visibleMoveIds).toEqual(catalog.defaultMoveIds)
      expect(state.moveIds).toEqual(catalog.defaultMoveIds)
      expect(catalog.moves.length).toBeGreaterThanOrEqual(catalog.defaultMoveIds.length)
    }
  })

  it("uses Champions rank order for default move picks before fallback", async () => {
    const catalog = await getCatalog(445, 727, "en")
    expect(catalog.defaultMovePickStatus).toBe("ready")
    expect(catalog.defaultMoveIds).toEqual([337, 157, 89, 707, 398, 317])
  })

  it("builds the shell catalog without waiting for Champion move usage", async () => {
    setChampionsMoveUsageFetcherForTest(() => new Promise(() => {}))

    const verdict = await Promise.race([
      getCatalogShell(445, 727, "en").then((catalog) => ({
        status: catalog.defaultMovePickStatus,
        defaultMoveIds: catalog.defaultMoveIds,
        moves: catalog.moves.length,
      })),
      new Promise<"timeout">((resolve) => setTimeout(() => resolve("timeout"), 50)),
    ])

    expect(verdict).not.toBe("timeout")
    expect(verdict).toMatchObject({
      status: "loading",
      defaultMoveIds: [],
    })
    expect(typeof verdict === "object" ? verdict.moves : 0).toBeGreaterThan(0)
  })

  it("marks default Move pick unavailable when Champion usage fails", async () => {
    setChampionsMoveUsageFetcherForTest(async () => {
      throw new Error("Champion API unavailable")
    })

    const catalog = await resolveCatalogDefaultMovePick(await getCatalogShell(445, 727, "en"))

    expect(catalog.defaultMovePickStatus).toBe("unavailable")
    expect(catalog.defaultMoveIds).toEqual([])
    expect(catalog.moves.length).toBeGreaterThan(0)
  })

  it("does not preselect moves when Champions rows are unavailable", async () => {
    const catalog = await getCatalog(1, 727, "en")
    expect(catalog.defaultMoveIds).toEqual([])
    expect(catalog.moves.length).toBeGreaterThan(0)
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

  it("returns 12 rows for default template selections (top-6 moves × 32 + ex × 32HP × none)", () => {
    const state = defaultTrackState(catalog)
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(12)
    expect(expectedRowCount(state)).toBe(12)
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
    expect(rows).toHaveLength(6)
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
    expect(rows).toHaveLength(6)
    expect(expectedRowCount(state)).toBe(6)
    expect(rows.every((r) => r.attackerStatId === RANGE_STAT_ID)).toBe(true)
    expect(rows.every((r) => r.statRange != null)).toBe(true)
  })

  it("range mode excludes preset template selections from row product", () => {
    const state = defaultTrackState(catalog)
    state.statMode = "range"
    state.offenseTemplateIds = ["neutral-zero", "extreme"]
    const rows = runScenarioPipeline(catalog, state)
    expect(rows).toHaveLength(6)
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
    expect(rows).toHaveLength(12)
    expect(expectedRowCount(state)).toBe(12)
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
