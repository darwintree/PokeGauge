import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

import {
  setChampionsAbilityUsageFetcherForTest,
  setChampionsMoveUsageFetcherForTest,
} from "@/lib/champions"
import * as damageKernel from "@/lib/calc-adapter/damage-kernel"
import {
  getCatalog,
  getCatalogShell,
  listDefenders,
  listAttackers,
  resolveCatalogDefaultMovePick,
  type MatchupCatalog,
} from "@/lib/catalog"
import { createMoveSnapshot } from "@/lib/move-snapshot"
import {
  defenseTemplatesForState,
  defaultTrackState,
  expectedRowCount,
  offenseTemplatesForState,
  RANGE_DEFENDER_ID,
  RANGE_STAT_ID,
  runScenarioPipeline,
} from "@/lib/scenario-pipeline"

const LOCALE = "zh-hans"

function selectMoves(
  catalog: MatchupCatalog,
  state: ReturnType<typeof defaultTrackState>,
  moveIds: number[],
) {
  state.moveSnapshots = moveIds.flatMap((moveId, index) => {
    const move = catalog.moves.find((candidate) => candidate.id === moveId)
    return move ? [createMoveSnapshot(move, `test-${index}-${moveId}`)] : []
  })
  state.selectedMoveSnapshotIds = state.moveSnapshots.map((snapshot) => snapshot.id)
}

function scenarioRows(
  catalog: MatchupCatalog,
  state: ReturnType<typeof defaultTrackState>,
) {
  return runScenarioPipeline(catalog, state).rows
}

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

function installChampionsAbilityUsageFixture() {
  const abilityByPokemon: Record<number, number> = {
    1: 65,
    445: 8,
    591: 27,
    727: 66,
    987: 281,
  }
  setChampionsAbilityUsageFetcherForTest(async (battlePokemonId) => {
    const abilityId = abilityByPokemon[battlePokemonId]
    return abilityId === undefined ? [] : [{
      battlePokemonId,
      abilityId,
      format: "Doubles",
      season: "test",
      source: "test",
      rank: 1,
      percentage: 100,
      championsAbilityName: "fixture",
    }]
  })
}

beforeAll(() => {
  installChampionsMoveUsageFixture()
  installChampionsAbilityUsageFixture()
})

beforeEach(() => {
  installChampionsMoveUsageFixture()
  installChampionsAbilityUsageFixture()
  vi.restoreAllMocks()
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
      zhAttackers
        .toSorted((a, b) => a.label.localeCompare(b.label))
        .map((pokemon) => pokemon.id),
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
        expect(catalog.defaultMovePoolIds.every((id) => catalog.moves.some((m) => m.id === id))).toBe(
          true,
        )
        expect(catalog.moves.length).toBeGreaterThan(0)
        return catalog.defaultMoveIds.join(",")
      }),
    )
    expect(new Set(defaultMoveSets).size).toBeGreaterThan(1)
  })

  it("loads every Champions damaging move into the track and selects the default subset", async () => {
    for (const attacker of (await listAttackers(LOCALE)).slice(0, 24)) {
      const catalog = await getCatalog(attacker.id, 727, LOCALE)
      const state = defaultTrackState(catalog)
      expect(state.moveSnapshots.map((snapshot) => snapshot.moveId)).toEqual(
        catalog.defaultMovePoolIds,
      )
      expect(state.moveSnapshots
        .filter((snapshot) => state.selectedMoveSnapshotIds.includes(snapshot.id))
        .map((snapshot) => snapshot.moveId)).toEqual(catalog.defaultMoveIds)
      expect(catalog.moves.length).toBeGreaterThanOrEqual(catalog.defaultMovePoolIds.length)
    }
  })

  it("uses Champions rank order for the pool and selects high-usage or super-effective moves", async () => {
    const catalog = await getCatalog(445, 727, "en")
    expect(catalog.defaultMovePickStatus).toBe("ready")
    expect(catalog.defaultMovePoolIds).toEqual([337, 157, 89, 707, 398, 317])
    expect(catalog.defaultMoveIds).toEqual([337, 157, 89, 707, 317])
  })

  it("builds the shell catalog without waiting for Champion move usage", async () => {
    setChampionsMoveUsageFetcherForTest(() => new Promise(() => {}))

    const verdict = await Promise.race([
      getCatalogShell(445, 727, "en").then((catalog) => ({
        status: catalog.defaultMovePickStatus,
        defaultMovePoolIds: catalog.defaultMovePoolIds,
        defaultMoveIds: catalog.defaultMoveIds,
        moves: catalog.moves.length,
      })),
      new Promise<"timeout">((resolve) => setTimeout(() => resolve("timeout"), 50)),
    ])

    expect(verdict).not.toBe("timeout")
    expect(verdict).toMatchObject({
      status: "loading",
      defaultMovePoolIds: [],
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
    expect(catalog.defaultMovePoolIds).toEqual([])
    expect(catalog.defaultMoveIds).toEqual([])
    expect(catalog.moves.length).toBeGreaterThan(0)
  })

  it("does not preselect moves when Champions rows are unavailable", async () => {
    const catalog = await getCatalog(1, 727, "en")
    expect(catalog.defaultMovePoolIds).toEqual([])
    expect(catalog.defaultMoveIds).toEqual([])
    expect(catalog.moves.length).toBeGreaterThan(0)
  })

  it("routes special attackers through template pipeline", async () => {
    const catalog = await getCatalog(987, 727, LOCALE)
    expect(catalog.moveCategory).toBe("special")

    const state = defaultTrackState(catalog)
    const rows = scenarioRows(catalog, state)
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

  it("returns 10 rows for the default selected moves", () => {
    const state = defaultTrackState(catalog)
    const rows = scenarioRows(catalog, state)
    expect(rows).toHaveLength(10)
    expect(expectedRowCount(state)).toBe(10)
    expect(state.offenseTemplateIds).toEqual(
      expect.arrayContaining(["neutral-max", "extreme"]),
    )
    expect(state.defenseTemplateIds).toEqual(["hp-32"])
  })

  it("reduces row count when a move is deselected", () => {
    const state = defaultTrackState(catalog)
    selectMoves(catalog, state, [89, 337])
    state.selectedMoveSnapshotIds = [state.moveSnapshots[0].id]
    const rows = scenarioRows(catalog, state)
    expect(state.moveSnapshots).toHaveLength(2)
    expect(rows).toHaveLength(2)
    expect(rows.every((r) => r.moveId === 89)).toBe(true)
  })

  it("keeps duplicate snapshots of one template as separate result groups", () => {
    const state = defaultTrackState(catalog)
    selectMoves(catalog, state, [89, 89])
    const rows = scenarioRows(catalog, state)
    expect(rows).toHaveLength(4)
    expect(expectedRowCount(state)).toBe(4)
    expect(rows.every((r) => r.moveId === 89)).toBe(true)
    expect(new Set(rows.map((row) => row.snapshotId))).toEqual(
      new Set(["test-0-89", "test-1-89"]),
    )
    expect(rows.map((row) => row.snapshotId)).toEqual([
      "test-0-89",
      "test-0-89",
      "test-1-89",
      "test-1-89",
    ])
    expect(new Set(rows.map((row) => row.calculationIdentity)).size).toBe(4)
  })

  it("groups an unconfigured snapshot once before kernel execution", () => {
    const state = defaultTrackState(catalog)
    selectMoves(catalog, state, [89])
    state.moveSnapshots[0] = { ...state.moveSnapshots[0], power: 0, accuracy: 0 }
    state.attackerItemIds = ["none", "type-boost-fire", "type-boost-ground"]
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    expect(state.moveSnapshots).toHaveLength(1)
    expect(runScenarioPipeline(catalog, state)).toEqual({
      rows: [],
      unavailable: [{
        snapshotId: "test-0-89",
        moveId: 89,
        reasons: ["unconfigured-move"],
        missingFields: ["power", "accuracy"],
        provenance: {
          "attacker-ability": {
            effective: [],
            inactive: [],
            unsupported: ["8"],
            neutral: [],
          },
          "attacker-stage": {
            effective: [],
            inactive: [],
            unsupported: [],
            neutral: ["0"],
          },
          "attacker-stat": {
            effective: ["neutral-max", "extreme"],
            inactive: [],
            unsupported: [],
            neutral: [],
          },
          "held-item": {
            effective: ["type-boost-ground"],
            inactive: ["type-boost-fire"],
            unsupported: [],
            neutral: ["none"],
          },
          weather: {
            effective: [],
            inactive: [],
            unsupported: [],
            neutral: ["none"],
          },
          "defender-stat": {
            effective: ["hp-32"],
            inactive: [],
            unsupported: [],
            neutral: [],
          },
          "defender-ability": {
            effective: [],
            inactive: [],
            unsupported: ["66"],
            neutral: [],
          },
          "defender-stage": {
            effective: [],
            inactive: [],
            unsupported: [],
            neutral: ["0"],
          },
          screen: {
            effective: [],
            inactive: [],
            unsupported: [],
            neutral: ["none"],
          },
        },
      }],
    })
    expect(kernel).not.toHaveBeenCalled()
  })

  it("merges 12 raw held-item scenarios into 6 identities with provenance", () => {
    const state = defaultTrackState(catalog)
    selectMoves(catalog, state, [424, 127, 89])
    state.offenseTemplateIds = ["extreme"]
    state.defenseTemplateIds = ["hp-32"]
    state.attackerItemIds = [
      "none",
      "type-boost-fire",
      "type-boost-water",
      "type-boost-ground",
    ]
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    const { rows, unavailable } = runScenarioPipeline(catalog, state)

    expect(expectedRowCount(state)).toBe(12)
    expect(rows).toHaveLength(6)
    expect(unavailable).toEqual([])
    expect(kernel).toHaveBeenCalledTimes(6)
    expect(rows.map((row) => row.snapshotId)).toEqual([
      "test-0-424",
      "test-0-424",
      "test-1-127",
      "test-1-127",
      "test-2-89",
      "test-2-89",
    ])

    for (const [snapshotId, matchingItem] of [
      ["test-0-424", "type-boost-fire"],
      ["test-1-127", "type-boost-water"],
      ["test-2-89", "type-boost-ground"],
    ] as const) {
      const snapshotRows = rows.filter((row) => row.snapshotId === snapshotId)
      const effective = snapshotRows.find((row) =>
        row.provenance["held-item"]?.effective.includes(matchingItem))
      const neutral = snapshotRows.find((row) =>
        row.provenance["held-item"]?.neutral.includes("none"))

      expect(effective?.provenance["held-item"]).toEqual({
        effective: [matchingItem],
        inactive: [],
        unsupported: [],
        neutral: [],
      })
      expect(neutral?.provenance["held-item"]).toEqual({
        effective: [],
        inactive: state.attackerItemIds.filter(
          (itemId) => itemId !== "none" && itemId !== matchingItem,
        ),
        unsupported: [],
        neutral: ["none"],
      })
    }
  })

  it("defaults both stage tracks to zero and includes them in the row product", () => {
    const state = defaultTrackState(catalog)
    expect(state.attackerStages).toEqual([0])
    expect(state.defenderStages).toEqual([0])

    selectMoves(catalog, state, [89])
    state.offenseTemplateIds = ["extreme"]
    state.attackerItemIds = ["none"]
    state.defenseTemplateIds = ["hp-32"]
    state.attackerStages = [-6, 0, 6]
    state.defenderStages = [-6, 0, 6]

    expect(expectedRowCount(state)).toBe(9)
    expect(scenarioRows(catalog, state)).toHaveLength(9)
  })

  it("merges critical-only ignored stages and retains inactive provenance", () => {
    const state = defaultTrackState(catalog)
    selectMoves(catalog, state, [89])
    state.moveSnapshots[0] = { ...state.moveSnapshots[0], criticalStage: 3 }
    state.offenseTemplateIds = ["extreme"]
    state.attackerItemIds = ["none"]
    state.defenseTemplateIds = ["hp-32"]
    state.attackerStages = [-6, -1, 0]
    state.defenderStages = [0, 1, 6]
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    const { rows } = runScenarioPipeline(catalog, state)

    expect(expectedRowCount(state)).toBe(9)
    expect(rows).toHaveLength(1)
    expect(kernel).toHaveBeenCalledTimes(1)
    expect(rows[0].criticalOnly).toBe(true)
    expect(rows[0].provenance["attacker-stage"]).toEqual({
      effective: [],
      inactive: ["-6", "-1"],
      unsupported: [],
      neutral: ["0"],
    })
    expect(rows[0].provenance["defender-stage"]).toEqual({
      effective: [],
      inactive: ["1", "6"],
      unsupported: [],
      neutral: ["0"],
    })
  })

  it("keeps lower-critical stage choices distinct and effective", () => {
    const state = defaultTrackState(catalog)
    selectMoves(catalog, state, [89])
    state.moveSnapshots[0] = { ...state.moveSnapshots[0], criticalStage: 2 }
    state.offenseTemplateIds = ["extreme"]
    state.attackerItemIds = ["none"]
    state.defenseTemplateIds = ["hp-32"]
    state.attackerStages = [-1, 0]
    state.defenderStages = [0, 1]

    const rows = scenarioRows(catalog, state)

    expect(rows).toHaveLength(4)
    expect(rows.every((row) => !row.criticalOnly)).toBe(true)
    expect(rows.some((row) =>
      row.provenance["attacker-stage"]?.effective.includes("-1") &&
      row.provenance["defender-stage"]?.effective.includes("1")
    )).toBe(true)
    expect(rows.some((row) =>
      row.provenance["attacker-stage"]?.neutral.includes("0") &&
      row.provenance["defender-stage"]?.neutral.includes("0")
    )).toBe(true)
  })

  it("filters preset rows when offense template is deselected", () => {
    const state = defaultTrackState(catalog)
    state.offenseTemplateIds = ["extreme"]
    const rows = scenarioRows(catalog, state)
    expect(rows).toHaveLength(5)
    expect(rows.every((r) => r.attackerStatId === "extreme")).toBe(true)
  })

  it("uses stored preset values unchanged and ignores allocation label indices", () => {
    const state = defaultTrackState(catalog)
    selectMoves(catalog, state, [89])
    state.attackerItemIds = ["none"]
    state.offenseTemplateIds = ["off-grid-offense"]
    state.offenseTemporaryTemplates = [{
      id: "off-grid-offense",
      kind: "temporary",
      values: { kind: "offense", stat: 186 },
    }]
    state.defenseTemplateIds = ["off-grid-defense"]
    state.defenseTemporaryTemplates = [{
      id: "off-grid-defense",
      kind: "temporary",
      values: { kind: "defense", hp: 170, def: 153 },
    }]
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    const first = runScenarioPipeline(catalog, state)

    expect(kernel.mock.calls[0][0]).toMatchObject({
      low: {
        defenderHp: 170,
        normal: { attack: 186, defense: 153 },
        critical: { attack: 186, defense: 153 },
      },
    })
    expect(kernel.mock.calls[0][0].high).toBeUndefined()

    state.offenseAllocationIndices["off-grid-offense"] = 7
    state.defenseAllocationIndices["off-grid-defense"] = 9

    expect(runScenarioPipeline(catalog, state)).toEqual(first)
  })

  it("keeps reachable system preset values unchanged", () => {
    const state = defaultTrackState(catalog)
    selectMoves(catalog, state, [89])
    state.attackerItemIds = ["none"]
    state.offenseTemplateIds = ["neutral-max"]
    state.defenseTemplateIds = ["hp-32"]
    const offense = offenseTemplatesForState(catalog, state)
      .find((template) => template.id === "neutral-max")
    const defense = defenseTemplatesForState(catalog, state)
      .find((template) => template.id === "hp-32")
    if (offense?.values.kind !== "offense" || defense?.values.kind !== "defense") {
      throw new Error("Expected reachable system stat value templates")
    }
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    runScenarioPipeline(catalog, state)

    expect(kernel.mock.calls[0][0].low).toMatchObject({
      defenderHp: defense.values.hp,
      normal: {
        attack: offense.values.stat,
        defense: defense.values.def,
      },
    })
  })

  it("computes damage for alternate defender species", async () => {
    const amoonguss = await getCatalog(445, 591, LOCALE)
    const state = defaultTrackState(amoonguss)
    const rows = scenarioRows(amoonguss, state)
    expect(rows.length).toBe(expectedRowCount(state))
    expect(rows.every((r) => r.minDamage > 0)).toBe(true)
  })

  it("applies type-boost item modifier for matching move type", () => {
    const state = defaultTrackState(catalog)
    selectMoves(catalog, state, [89])
    state.offenseTemplateIds = ["extreme"]
    state.defenseTemplateIds = ["hp-32"]

    const noneRows = scenarioRows(catalog, {
      ...state,
      attackerItemIds: ["none"],
    })
    const sandRows = scenarioRows(catalog, {
      ...state,
      attackerItemIds: ["type-boost-ground"],
    })

    expect(noneRows).toHaveLength(1)
    expect(sandRows).toHaveLength(1)
    expect(sandRows[0].maxDamage).toBeGreaterThan(noneRows[0].maxDamage)
  })

  it("compiles 16-roll and actual fixed-build KO probabilities", () => {
    const state = defaultTrackState(catalog)
    selectMoves(catalog, state, [667])
    state.offenseTemplateIds = ["extreme"]
    state.attackerItemIds = ["choice-band"]
    state.defenseTemplateIds = ["min-bulk"]

    const [rollRow] = scenarioRows(catalog, state)
    expect(rollRow.koProbabilities).toEqual({ ohko: 1, twoHit: 1 })

    state.probabilityMode = "actual"
    const [actualRow] = scenarioRows(catalog, state)
    expect(actualRow.koProbabilities?.ohko).toBeCloseTo(0.95)
    expect(actualRow.koProbabilities?.twoHit).toBeCloseTo(0.9975)
  })

  it("compiles actual KO probabilities for fixed-power high-critical moves", () => {
    const state = defaultTrackState(catalog)
    selectMoves(catalog, state, [2])
    state.offenseTemplateIds = ["extreme"]
    state.attackerItemIds = ["none"]
    state.defenseTemplateIds = ["min-bulk"]
    state.probabilityMode = "actual"

    const [row] = scenarioRows(catalog, state)
    expect(row).toBeDefined()
    expect(row.koProbabilities).toBeDefined()
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
    const rows = scenarioRows(catalog, state)
    expect(rows).toHaveLength(5)
    expect(expectedRowCount(state)).toBe(5)
    expect(rows.every((r) => r.attackerStatId === RANGE_STAT_ID)).toBe(true)
    expect(rows.every((r) => r.statRange != null)).toBe(true)
  })

  it("range mode excludes preset template selections from row product", () => {
    const state = defaultTrackState(catalog)
    state.statMode = "range"
    state.offenseTemplateIds = ["neutral-zero", "extreme"]
    const rows = scenarioRows(catalog, state)
    expect(rows).toHaveLength(5)
    expect(rows.every((r) => r.attackerStatId === RANGE_STAT_ID)).toBe(true)
  })

  it("range mode envelope spans low-end min to high-end max damage", () => {
    const state = defaultTrackState(catalog)
    state.statMode = "range"
    selectMoves(catalog, state, [89])
    state.attackerItemIds = ["none"]
    state.defenseTemplateIds = ["standard-bulk"]
    state.statRange = { min: 100, max: 200 }

    const [row] = scenarioRows(catalog, state)
    expect(row).toBeDefined()
    expect(row.minDamage).toBeLessThan(row.maxDamage)
    expect(row.maxPercent).toBeGreaterThan(row.minPercent)
  })

  it("passes the exact selected offense and defense endpoints to the compiler", () => {
    const state = defaultTrackState(catalog)
    selectMoves(catalog, state, [89])
    state.attackerItemIds = ["none"]
    state.statMode = "range"
    state.statRange = { min: 186, max: 188 }
    state.defenderMode = "range"
    state.defenderRanges = {
      hp: { min: 170, max: 171 },
      def: { min: 153, max: 155 },
    }
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    runScenarioPipeline(catalog, state)

    expect(kernel.mock.calls[0][0]).toMatchObject({
      low: {
        defenderHp: 171,
        normal: { attack: 186, defense: 155 },
      },
      high: {
        defenderHp: 170,
        normal: { attack: 188, defense: 153 },
      },
    })
  })

  it("defender range mode: row count = moves × stats × items (defender track = 1)", () => {
    const state = defaultTrackState(catalog)
    state.defenderMode = "range"
    const rows = scenarioRows(catalog, state)
    expect(rows).toHaveLength(10)
    expect(expectedRowCount(state)).toBe(10)
    expect(rows.every((r) => r.defenderId === RANGE_DEFENDER_ID)).toBe(true)
  })

  it("both tracks in range mode produce one row per move × item", () => {
    const state = defaultTrackState(catalog)
    state.statMode = "range"
    state.defenderMode = "range"
    selectMoves(catalog, state, [89])
    state.attackerItemIds = ["none"]
    const rows = scenarioRows(catalog, state)
    expect(rows).toHaveLength(1)
    expect(rows[0].attackerStatId).toBe(RANGE_STAT_ID)
    expect(rows[0].defenderId).toBe(RANGE_DEFENDER_ID)
  })

  it("exposes ordered endpoint KO probability ranges instead of averaging", () => {
    const state = defaultTrackState(catalog)
    selectMoves(catalog, state, [89])
    state.attackerItemIds = ["none"]
    state.defenseTemplateIds = ["min-bulk"]
    state.probabilityMode = "actual"

    const endpointRows = ["neutral-zero", "extreme"].map((offenseTemplateId) => {
      const [row] = scenarioRows(catalog, {
        ...state,
        offenseTemplateIds: [offenseTemplateId],
      })
      return row.koProbabilities
    })

    state.statMode = "range"
    const [rangeRow] = scenarioRows(catalog, state)
    const ohkoEndpoints = endpointRows.map((value) => value?.ohko as number)
    const twoHitEndpoints = endpointRows.map((value) => value?.twoHit as number)

    expect(rangeRow.koProbabilities).toEqual({
      ohko: { min: Math.min(...ohkoEndpoints), max: Math.max(...ohkoEndpoints) },
      twoHit: { min: Math.min(...twoHitEndpoints), max: Math.max(...twoHitEndpoints) },
    })
  })

  it("uses only minimum-offense × maximum-defense and maximum-offense × minimum-defense endpoints", () => {
    const state = defaultTrackState(catalog)
    selectMoves(catalog, state, [89])
    state.attackerItemIds = ["none"]
    state.probabilityMode = "actual"

    const oppositeEndpoints = [
      { offenseTemplateIds: ["neutral-zero"], defenseTemplateIds: ["standard-bulk"] },
      { offenseTemplateIds: ["extreme"], defenseTemplateIds: ["min-bulk"] },
    ].map((selection) => {
      const [row] = scenarioRows(catalog, { ...state, ...selection })
      return row
    })

    const [rangeRow] = scenarioRows(catalog, {
      ...state,
      statMode: "range",
      defenderMode: "range",
    })
    const ohkoEndpoints = oppositeEndpoints.map((row) => row.koProbabilities?.ohko as number)
    const twoHitEndpoints = oppositeEndpoints.map((row) => row.koProbabilities?.twoHit as number)

    expect(rangeRow).toMatchObject({
      minDamage: oppositeEndpoints[0].minDamage,
      minPercent: oppositeEndpoints[0].minPercent,
      critMinDamage: oppositeEndpoints[0].critMinDamage,
      critMinPercent: oppositeEndpoints[0].critMinPercent,
      maxDamage: oppositeEndpoints[1].maxDamage,
      maxPercent: oppositeEndpoints[1].maxPercent,
      critMaxDamage: oppositeEndpoints[1].critMaxDamage,
      critMaxPercent: oppositeEndpoints[1].critMaxPercent,
    })
    expect(rangeRow.koProbabilities).toEqual({
      ohko: { min: Math.min(...ohkoEndpoints), max: Math.max(...ohkoEndpoints) },
      twoHit: { min: Math.min(...twoHitEndpoints), max: Math.max(...twoHitEndpoints) },
    })
  })
})
