import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

import {
  setChampionsAbilityUsageFetcherForTest,
  setChampionsItemUsageFetcherForTest,
  setChampionsMoveUsageFetcherForTest,
  setChampionsNatureUsageFetcherForTest,
} from "@/lib/champions"
import * as damageKernel from "@/lib/damage-calculation"
import {
  getCatalog,
  getCatalogShell,
  listDefenders,
  listAttackers,
  resolveCatalogDefaultMovePick,
  type MatchupCatalog,
} from "@/lib/catalog"
import { createMoveSnapshot } from "@/lib/move"
import {
  defenseEnvelopeOf,
  defensePresetsForState,
  defaultTrackState,
  expectedRowCount,
  expandRangeParentBlocks,
  offenseEnvelopeOf,
  offensePresetsForState,
  RANGE_DEFENDER_ID,
  RANGE_STAT_ID,
  runScenarioPipeline,
} from "@/lib/scenario"

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

function scenarioResults(
  catalog: MatchupCatalog,
  state: ReturnType<typeof defaultTrackState>,
) {
  return runScenarioPipeline(catalog, state).rows
}

function withChoiceStats(state: ReturnType<typeof defaultTrackState>) {
  state.statMode = "preset"
  state.defenderMode = "preset"
  return state
}

function installChampionsMoveUsageFixture() {
  setChampionsMoveUsageFetcherForTest(async (battlePokemonId) => {
    if (battlePokemonId !== 445) return []
    return [
      { battlePokemonId, moveId: 337, format: "Doubles", season: "test", source: "test", dataVersion: "test", rank: 1, percentage: 89.1, championsMoveName: "Dragon Claw" },
      { battlePokemonId, moveId: 157, format: "Doubles", season: "test", source: "test", dataVersion: "test", rank: 2, percentage: 84.3, championsMoveName: "Rock Slide" },
      { battlePokemonId, moveId: 89, format: "Doubles", season: "test", source: "test", dataVersion: "test", rank: 3, percentage: 78.8, championsMoveName: "Earthquake" },
      { battlePokemonId, moveId: 182, format: "Doubles", season: "test", source: "test", dataVersion: "test", rank: 4, percentage: 73, championsMoveName: "Protect" },
      { battlePokemonId, moveId: 707, format: "Doubles", season: "test", source: "test", dataVersion: "test", rank: 5, percentage: 32.1, championsMoveName: "Stomping Tantrum" },
      { battlePokemonId, moveId: 398, format: "Doubles", season: "test", source: "test", dataVersion: "test", rank: 6, percentage: 16.2, championsMoveName: "Poison Jab" },
      { battlePokemonId, moveId: 317, format: "Doubles", season: "test", source: "test", dataVersion: "test", rank: 7, percentage: 8.6, championsMoveName: "Rock Tomb" },
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

function installChampionsItemUsageFixture() {
  setChampionsItemUsageFetcherForTest(async () => [])
  setChampionsNatureUsageFetcherForTest(async () => [])
}

beforeAll(() => {
  installChampionsMoveUsageFixture()
  installChampionsAbilityUsageFixture()
  installChampionsItemUsageFixture()
})

beforeEach(() => {
  installChampionsMoveUsageFixture()
  installChampionsAbilityUsageFixture()
  installChampionsItemUsageFixture()
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

  it("routes special attackers through Stat Preset pipeline", async () => {
    const catalog = await getCatalog(987, 727, LOCALE, "special")
    expect(catalog.moveCategory).toBe("special")

    const state = defaultTrackState(catalog)
    const rows = scenarioResults(catalog, state)
    expect(rows.length).toBe(expectedRowCount(state))
    expect(rows.every((r) => r.minDamage > 0)).toBe(true)
  })

  it("uses numeric frozen Held-item identities in the side-specific pools", async () => {
    const catalog = await getCatalog(445, 727, LOCALE)
    const attackerIds = catalog.attackerItems.map((item) => item.id)
    const defenderIds = catalog.defenderItems.map((item) => item.id)

    expect(attackerIds).toHaveLength(59)
    expect(defenderIds).toHaveLength(25)
    expect(attackerIds.slice(0, 4)).toEqual(["none", 247, 245, 213])
    expect(attackerIds).toContain(214)
    expect(attackerIds).toContain(2105)
    expect(defenderIds).toContain(190)
    expect(defenderIds).not.toContain(247)
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

  it("returns two discrete bulk rows per default selected move", () => {
    const state = defaultTrackState(catalog)
    const rows = scenarioResults(catalog, state)
    expect(state.statMode).toBe("preset")
    expect(state.defenderMode).toBe("preset")
    expect(rows).toHaveLength(10)
    expect(expectedRowCount(state)).toBe(10)
    expect(state.offensePresetIds).toEqual(["neutral-max"])
    expect(state.defensePresetIds).toEqual(
      expect.arrayContaining(["min-bulk", "hp-32"]),
    )
  })

  it("reduces row count when a move is deselected", () => {
    const state = defaultTrackState(catalog)
    selectMoves(catalog, state, [89, 337])
    state.selectedMoveSnapshotIds = [state.moveSnapshots[0].id]
    const rows = scenarioResults(catalog, state)
    expect(state.moveSnapshots).toHaveLength(2)
    expect(rows).toHaveLength(2)
    expect(rows.every((r) => r.moveId === 89)).toBe(true)
  })

  it("keeps duplicate snapshots of one template as separate result groups", () => {
    const state = defaultTrackState(catalog)
    selectMoves(catalog, state, [89, 89])
    const rows = scenarioResults(catalog, state)
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
    const state = withChoiceStats(defaultTrackState(catalog))
    state.offensePresetIds = ["neutral-max", "extreme"]
    state.defensePresetIds = ["hp-32"]
    selectMoves(catalog, state, [89])
    state.moveSnapshots[0] = { ...state.moveSnapshots[0], power: 0, accuracy: 0 }
    state.attackerItemIds = ["none", 226, 214]
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
            active: [],
            inactive: ["8"],
            unsupported: [],
            neutral: [],
          },
          "attacker-stage": {
            active: [],
            inactive: [],
            unsupported: [],
            neutral: ["0"],
          },
          "attacker-stat": {
            active: ["neutral-max", "extreme"],
            inactive: [],
            unsupported: [],
            neutral: [],
          },
          "held-item": {
            active: ["214"],
            inactive: ["226"],
            unsupported: [],
            neutral: ["none"],
          },
          "defender-held-item": {
            active: [],
            inactive: [],
            unsupported: [],
            neutral: ["none"],
          },
          weather: {
            active: [],
            inactive: [],
            unsupported: [],
            neutral: ["none"],
          },
          terrain: {
            active: [],
            inactive: [],
            unsupported: [],
            neutral: ["none"],
          },
          "defender-stat": {
            active: ["hp-32"],
            inactive: [],
            unsupported: [],
            neutral: [],
          },
          "defender-ability": {
            active: [],
            inactive: ["66"],
            unsupported: [],
            neutral: [],
          },
          "defender-stage": {
            active: [],
            inactive: [],
            unsupported: [],
            neutral: ["0"],
          },
          screen: {
            active: [],
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
    const state = withChoiceStats(defaultTrackState(catalog))
    selectMoves(catalog, state, [424, 127, 89])
    state.offensePresetIds = ["extreme"]
    state.defensePresetIds = ["hp-32"]
    state.attackerItemIds = [
      "none",
      226,
      220,
      214,
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
      ["test-0-424", "226"],
      ["test-1-127", "220"],
      ["test-2-89", "214"],
    ] as const) {
      const snapshotRows = rows.filter((row) => row.snapshotId === snapshotId)
      const active = snapshotRows.find((row) =>
        row.provenance["held-item"]?.active.includes(matchingItem))
      const neutral = snapshotRows.find((row) =>
        row.provenance["held-item"]?.neutral.includes("none"))

      expect(active?.provenance["held-item"]).toEqual({
        active: [matchingItem],
        inactive: [],
        unsupported: [],
        neutral: [],
      })
      expect(neutral?.provenance["held-item"]).toEqual({
        active: [],
        inactive: state.attackerItemIds
          .map(String)
          .filter((itemId) => itemId !== "none" && itemId !== matchingItem),
        unsupported: [],
        neutral: ["none"],
      })
    }
  })

  it("expands defender items and merges their neutral damage inputs", () => {
    const state = withChoiceStats(defaultTrackState(catalog))
    selectMoves(catalog, state, [89])
    state.offensePresetIds = ["extreme"]
    state.defensePresetIds = ["hp-32"]
    state.attackerItemIds = ["none"]
    state.defenderItemIds = ["none", 1181]

    const rows = scenarioResults(catalog, state)

    expect(expectedRowCount(state)).toBe(2)
    expect(rows).toHaveLength(1)
    expect(rows[0].provenance["defender-held-item"]).toEqual({
      active: [],
      inactive: ["1181"],
      unsupported: [],
      neutral: ["none"],
    })
  })

  it("defaults both stage tracks to zero and includes them in the row product", () => {
    const state = withChoiceStats(defaultTrackState(catalog))
    expect(state.attackerStages).toEqual([0])
    expect(state.defenderStages).toEqual([0])

    selectMoves(catalog, state, [89])
    state.offensePresetIds = ["extreme"]
    state.attackerItemIds = ["none"]
    state.defensePresetIds = ["hp-32"]
    state.attackerStages = [-6, 0, 6]
    state.defenderStages = [-6, 0, 6]

    expect(expectedRowCount(state)).toBe(9)
    expect(scenarioResults(catalog, state)).toHaveLength(9)
  })

  it("merges critical-only ignored stages and retains inactive provenance", () => {
    const state = withChoiceStats(defaultTrackState(catalog))
    selectMoves(catalog, state, [89])
    state.moveSnapshots[0] = { ...state.moveSnapshots[0], criticalStage: 3 }
    state.offensePresetIds = ["extreme"]
    state.attackerItemIds = ["none"]
    state.defensePresetIds = ["hp-32"]
    state.attackerStages = [-6, -1, 0]
    state.defenderStages = [0, 1, 6]
    const kernel = vi.spyOn(damageKernel, "calculateDamageRolls")

    const { rows } = runScenarioPipeline(catalog, state)

    expect(expectedRowCount(state)).toBe(9)
    expect(rows).toHaveLength(1)
    expect(kernel).toHaveBeenCalledTimes(1)
    expect(rows[0].criticalOnly).toBe(true)
    expect(rows[0].provenance["attacker-stage"]).toEqual({
      active: [],
      inactive: ["-6", "-1"],
      unsupported: [],
      neutral: ["0"],
    })
    expect(rows[0].provenance["defender-stage"]).toEqual({
      active: [],
      inactive: ["1", "6"],
      unsupported: [],
      neutral: ["0"],
    })
  })

  it("keeps lower-critical stage choices distinct and active", () => {
    const state = withChoiceStats(defaultTrackState(catalog))
    selectMoves(catalog, state, [89])
    state.moveSnapshots[0] = { ...state.moveSnapshots[0], criticalStage: 2 }
    state.offensePresetIds = ["extreme"]
    state.attackerItemIds = ["none"]
    state.defensePresetIds = ["hp-32"]
    state.attackerStages = [-1, 0]
    state.defenderStages = [0, 1]

    const rows = scenarioResults(catalog, state)

    expect(rows).toHaveLength(4)
    expect(rows.every((row) => !row.criticalOnly)).toBe(true)
    expect(rows.some((row) =>
      row.provenance["attacker-stage"]?.active.includes("-1") &&
      row.provenance["defender-stage"]?.active.includes("1")
    )).toBe(true)
    expect(rows.some((row) =>
      row.provenance["attacker-stage"]?.neutral.includes("0") &&
      row.provenance["defender-stage"]?.neutral.includes("0")
    )).toBe(true)
  })

  it("filters preset results when an Offense Stat Preset is deselected", () => {
    const state = withChoiceStats(defaultTrackState(catalog))
    state.offensePresetIds = ["extreme"]
    state.defensePresetIds = ["hp-32"]
    const rows = scenarioResults(catalog, state)
    expect(rows).toHaveLength(5)
    expect(rows.every((r) => r.attackerStatId === "extreme")).toBe(true)
  })

  it("uses stored preset values unchanged and ignores allocation label indices", () => {
    const state = withChoiceStats(defaultTrackState(catalog))
    selectMoves(catalog, state, [89])
    state.attackerItemIds = ["none"]
    state.offensePresetIds = ["off-grid-offense"]
    state.offenseTemporaryPresets = [{
      id: "off-grid-offense",
      kind: "temporary",
      values: { kind: "offense", stat: 186 },
    }]
    state.defensePresetIds = ["off-grid-defense"]
    state.defenseTemporaryPresets = [{
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
    const state = withChoiceStats(defaultTrackState(catalog))
    selectMoves(catalog, state, [89])
    state.attackerItemIds = ["none"]
    state.offensePresetIds = ["neutral-max"]
    state.defensePresetIds = ["hp-32"]
    const offense = offensePresetsForState(catalog, state)
      .find((preset) => preset.id === "neutral-max")
    const defense = defensePresetsForState(catalog, state)
      .find((preset) => preset.id === "hp-32")
    if (offense?.values.kind !== "offense" || defense?.values.kind !== "defense") {
      throw new Error("Expected reachable system Stat Presets")
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
    const rows = scenarioResults(amoonguss, state)
    expect(rows.length).toBe(expectedRowCount(state))
    expect(rows.every((r) => r.minDamage > 0)).toBe(true)
  })

  it("applies type-boost item modifier for matching move type", () => {
    const state = withChoiceStats(defaultTrackState(catalog))
    selectMoves(catalog, state, [89])
    state.offensePresetIds = ["extreme"]
    state.defensePresetIds = ["hp-32"]

    const noneRows = scenarioResults(catalog, {
      ...state,
      attackerItemIds: ["none"],
    })
    const sandRows = scenarioResults(catalog, {
      ...state,
      attackerItemIds: [214],
    })

    expect(noneRows).toHaveLength(1)
    expect(sandRows).toHaveLength(1)
    expect(sandRows[0].maxDamage).toBeGreaterThan(noneRows[0].maxDamage)
  })

  it("defaults new Track State to Battle Odds Mode", () => {
    expect(defaultTrackState(catalog).probabilityMode).toBe("battle-odds")
  })

  it("compiles Classic and Battle Odds fixed-build KO Probabilities", () => {
    const state = withChoiceStats(defaultTrackState(catalog))
    selectMoves(catalog, state, [667])
    state.offensePresetIds = ["extreme"]
    state.attackerItemIds = [197]
    state.defensePresetIds = ["min-bulk"]
    state.probabilityMode = "classic"

    const [classicResult] = scenarioResults(catalog, state)
    expect(classicResult.koProbabilities).toEqual({ ohko: 1, twoHit: 1 })

    state.probabilityMode = "battle-odds"
    const [battleOddsResult] = scenarioResults(catalog, state)
    expect(battleOddsResult.koProbabilities?.ohko).toBeCloseTo(0.95)
    expect(battleOddsResult.koProbabilities?.twoHit).toBeCloseTo(0.9975)
  })

  it("compiles Battle Odds KO Probabilities for fixed-power high-critical moves", () => {
    const state = withChoiceStats(defaultTrackState(catalog))
    selectMoves(catalog, state, [2])
    state.offensePresetIds = ["extreme"]
    state.attackerItemIds = ["none"]
    state.defensePresetIds = ["min-bulk"]
    state.probabilityMode = "battle-odds"

    const [row] = scenarioResults(catalog, state)
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
    const rows = scenarioResults(catalog, state)
    expect(rows).toHaveLength(10)
    expect(expectedRowCount(state)).toBe(10)
    expect(rows.every((r) => r.attackerStatId === RANGE_STAT_ID)).toBe(true)
    expect(rows.every((r) => r.statRange != null)).toBe(true)
  })

  it("Range Track excludes Stat Preset selections from the Scenario set", () => {
    const state = defaultTrackState(catalog)
    state.statMode = "range"
    state.offensePresetIds = ["neutral-zero", "extreme"]
    const rows = scenarioResults(catalog, state)
    expect(rows).toHaveLength(10)
    expect(rows.every((r) => r.attackerStatId === RANGE_STAT_ID)).toBe(true)
  })

  it("range mode envelope spans low-end min to high-end max damage", () => {
    const state = defaultTrackState(catalog)
    state.statMode = "range"
    selectMoves(catalog, state, [89])
    state.attackerItemIds = ["none"]
    state.defensePresetIds = ["standard-bulk"]
    state.statRange = { min: 100, max: 200 }

    const [row] = scenarioResults(catalog, state)
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
    const state = withChoiceStats(defaultTrackState(catalog))
    state.defenderMode = "range"
    const rows = scenarioResults(catalog, state)
    expect(rows).toHaveLength(5)
    expect(expectedRowCount(state)).toBe(5)
    expect(rows.every((r) => r.defenderId === RANGE_DEFENDER_ID)).toBe(true)
  })

  it("both tracks in range mode produce one row per move × item", () => {
    const state = defaultTrackState(catalog)
    state.statMode = "range"
    state.defenderMode = "range"
    selectMoves(catalog, state, [89])
    state.attackerItemIds = ["none"]
    const rows = scenarioResults(catalog, state)
    expect(rows).toHaveLength(1)
    expect(rows[0].attackerStatId).toBe(RANGE_STAT_ID)
    expect(rows[0].defenderId).toBe(RANGE_DEFENDER_ID)
  })

  it("exposes ordered endpoint KO probability ranges instead of averaging", () => {
    const state = withChoiceStats(defaultTrackState(catalog))
    selectMoves(catalog, state, [89])
    state.attackerItemIds = ["none"]
    state.defensePresetIds = ["min-bulk"]
    state.probabilityMode = "battle-odds"
    const offenseRange = offenseEnvelopeOf(
      offensePresetsForState(catalog, state),
      ["neutral-zero", "extreme"],
    )
    if (!offenseRange) throw new Error("Expected offense range")

    const endpointRows = ["neutral-zero", "extreme"].map((offensePresetId) => {
      const [row] = scenarioResults(catalog, {
        ...state,
        statMode: "preset",
        offensePresetIds: [offensePresetId],
      })
      return row.koProbabilities
    })

    state.statMode = "range"
    state.statRange = offenseRange
    const [rangeRow] = scenarioResults(catalog, state)
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
    state.probabilityMode = "battle-odds"

    const oppositeEndpoints = [
      { offensePresetIds: ["neutral-zero"], defensePresetIds: ["standard-bulk"] },
      { offensePresetIds: ["extreme"], defensePresetIds: ["min-bulk"] },
    ].map((selection) => {
      const [row] = scenarioResults(catalog, {
        ...state,
        statMode: "preset",
        defenderMode: "preset",
        ...selection,
      })
      return row
    })

    const [rangeRow] = scenarioResults(catalog, {
      ...state,
      statMode: "range",
      defenderMode: "range",
      offensePresetIds: ["neutral-zero", "extreme"],
      defensePresetIds: ["min-bulk", "standard-bulk"],
      statRange: offenseEnvelopeOf(
        offensePresetsForState(catalog, state),
        ["neutral-zero", "extreme"],
      ) ?? state.statRange,
      defenderRanges: defenseEnvelopeOf(
        defensePresetsForState(catalog, state),
        ["min-bulk", "standard-bulk"],
      ) ?? state.defenderRanges,
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
      rangeEndpoints: {
        low: {
          minPercent: oppositeEndpoints[0].minPercent,
          maxPercent: oppositeEndpoints[0].maxPercent,
        },
        high: {
          minPercent: oppositeEndpoints[1].minPercent,
          maxPercent: oppositeEndpoints[1].maxPercent,
        },
      },
    })
    expect(rangeRow.koProbabilities).toEqual({
      ohko: { min: Math.min(...ohkoEndpoints), max: Math.max(...ohkoEndpoints) },
      twoHit: { min: Math.min(...twoHitEndpoints), max: Math.max(...twoHitEndpoints) },
    })
  })
})

describe("range parent expand", () => {
  let catalog: MatchupCatalog

  beforeAll(async () => {
    catalog = await getCatalog(445, 727, LOCALE)
  })

  it("expands one Range parent into that axis's selected Choice values", () => {
    const state = defaultTrackState(catalog)
    state.statMode = "range"
    state.defenderMode = "range"
    selectMoves(catalog, state, [89])
    state.attackerItemIds = ["none"]
    const parents = scenarioResults(catalog, state)
    expect(parents).toHaveLength(1)

    const [block] = expandRangeParentBlocks(catalog, state, parents, {
      [parents[0].calculationIdentity]: { offense: true, defense: false },
    })
    expect(block.children).toHaveLength(state.offensePresetIds.length)
    expect(block.children.every((child) => child.attackerStatId !== RANGE_STAT_ID)).toBe(true)
    expect(block.children.every((child) => child.defenderId === RANGE_DEFENDER_ID)).toBe(true)
  })

  it("does not attach those children to another parent", () => {
    const state = defaultTrackState(catalog)
    state.statMode = "range"
    selectMoves(catalog, state, [89, 157])
    state.attackerItemIds = ["none"]
    state.defensePresetIds = ["min-bulk"]
    const parents = scenarioResults(catalog, state)
    expect(parents.length).toBeGreaterThan(1)

    const blocks = expandRangeParentBlocks(catalog, state, parents, {
      [parents[0].calculationIdentity]: { offense: true, defense: false },
    })
    expect(blocks[0].children.length).toBe(state.offensePresetIds.length)
    expect(blocks.slice(1).every((block) => block.children.length === 0)).toBe(true)
  })
})
