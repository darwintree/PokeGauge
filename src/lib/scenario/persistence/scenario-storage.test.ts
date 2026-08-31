import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { getCatalogShell } from "@/lib/catalog"
import {
  loadScenarioSnapshot,
  restorePersistedTrackState,
  saveScenarioSnapshot,
  SCENARIO_STORAGE_KEY,
  scenarioSnapshotMatchesCatalog,
  type PersistedTrackState,
  type ScenarioSnapshotInput,
} from "@/lib/scenario"
import { defaultTrackState, offensePresetsForState } from "@/lib/scenario"
import { NO_ABILITY_ID } from "@/lib/ability"

function scenario(): ScenarioSnapshotInput {
  return {
    attackerId: 445,
    defenderId: 727,
    moveCategory: "physical",
    trackState: {
      moveSnapshots: [{
        id: "snapshot-earthquake",
        moveId: 89,
        power: 100,
        accuracy: 100,
        alwaysHits: false,
        criticalStage: 0,
        spreadEligible: true,
        spread: true,
      }],
      selectedMoveSnapshotIds: ["snapshot-earthquake"],
      statMode: "preset",
      offensePresetIds: [],
      offenseTemporaryPresets: [],
      statRange: { min: 130, max: 182 },
      offenseAllocationIndices: {},
      attackerStages: [0],
      attackerStagePool: [0],
      attackerItemPoolIds: ["none"],
      defenderItemPoolIds: ["none"],
      attackerItemIds: ["none"],
      defenderItemIds: ["none"],
      attackerAbilityIds: [8],
      weathers: ["none"],
      terrains: ["none"],
      defenderMode: "preset",
      defensePresetIds: [],
      defenseTemporaryPresets: [],
      defenderRanges: {
        hp: { min: 170, max: 202 },
        def: { min: 110, max: 156 },
      },
      defenseAllocationIndices: {},
      defenderStages: [0],
      defenderStagePool: [0],
      defenderAbilityIds: [22],
      screens: ["none"],
    },
  }
}

async function compatibleScenario() {
  const currentCatalog = await getCatalogShell(445, 727, "en", "physical")
  const trackState = defaultTrackState(currentCatalog)
  trackState.moveSnapshots = scenario().trackState.moveSnapshots
  trackState.selectedMoveSnapshotIds = ["snapshot-earthquake"]
  trackState.attackerAbilityIds = [8]
  trackState.defenderAbilityIds = [22]
  return {
    currentCatalog,
    snapshot: {
      version: 5,
      attackerId: 445,
      defenderId: 727,
      moveCategory: "physical",
      trackState,
    } as const,
  }
}

describe("scenario storage", () => {
  let data: Record<string, string>

  beforeEach(() => {
    data = {}
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => data[key] ?? null,
      setItem: (key: string, value: string) => {
        data[key] = value
      },
      removeItem: (key: string) => {
        delete data[key]
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("round trips the latest complete scenario", () => {
    const input = scenario()
    saveScenarioSnapshot(input)

    expect(loadScenarioSnapshot()).toEqual({ version: 5, ...input })
  })

  it("migrates version 3 terminology without dropping the saved scenario", () => {
    const input = scenario()
    const {
      offensePresetIds,
      offenseTemporaryPresets,
      defensePresetIds,
      defenseTemporaryPresets,
      ...trackState
    } = input.trackState
    data[SCENARIO_STORAGE_KEY] = JSON.stringify({
      ...input,
      version: 3,
      trackState: {
        ...trackState,
        offenseTemplateIds: offensePresetIds,
        offenseTemporaryTemplates: offenseTemporaryPresets,
        defenseTemplateIds: defensePresetIds,
        defenseTemporaryTemplates: defenseTemporaryPresets,
        showOffenseActual: true,
        showDefenseActual: true,
        showResultActual: true,
        probabilityMode: "actual",
      },
    })

    expect(loadScenarioSnapshot()).toEqual({ version: 5, ...input })
  })

  it("migrates version 4 while dropping its scenario probability mode", () => {
    const input = scenario()
    data[SCENARIO_STORAGE_KEY] = JSON.stringify({
      ...input,
      version: 4,
      trackState: { ...input.trackState, probabilityMode: "classic" },
    })

    expect(loadScenarioSnapshot()).toEqual({ version: 5, ...input })
  })

  it("fills missing stage pools from selected stages", () => {
    const input = scenario()
    const {
      attackerStagePool: _attackerStagePool,
      defenderStagePool: _defenderStagePool,
      ...trackState
    } = input.trackState
    data[SCENARIO_STORAGE_KEY] = JSON.stringify({
      version: 5,
      attackerId: input.attackerId,
      defenderId: input.defenderId,
      moveCategory: input.moveCategory,
      trackState: { ...trackState, attackerStages: [-1, 0] },
    })

    const loaded = loadScenarioSnapshot()
    expect(loaded?.trackState.attackerStagePool).toEqual([-1, 0])
    expect(loaded?.trackState.defenderStagePool).toEqual([0])
    expect(loaded?.trackState.attackerStages).toEqual([-1, 0])
  })

  it("round trips numeric upstream held-item identities", () => {
    const input = scenario()
    input.trackState.attackerItemIds = [699]
    input.trackState.defenderItemIds = [717]
    saveScenarioSnapshot(input)

    expect(loadScenarioSnapshot()?.trackState.attackerItemIds).toEqual([699])
    expect(loadScenarioSnapshot()?.trackState.defenderItemIds).toEqual([717])
  })

  it("rejects legacy synthetic held-item identities while parsing", () => {
    const input = scenario()
    data[SCENARIO_STORAGE_KEY] = JSON.stringify({
      version: 3,
      ...input,
      trackState: {
        ...input.trackState,
        attackerItemIds: ["life-orb"],
      },
    })

    expect(loadScenarioSnapshot()).toBeNull()
    expect(data[SCENARIO_STORAGE_KEY]).toBeUndefined()
  })

  it.each([
    ["broken JSON", "{"],
    ["unsupported version", JSON.stringify({ version: 1 })],
    ["incomplete state", JSON.stringify({ version: 2, attackerId: 445 })],
  ])("discards %s", (_label, raw) => {
    data[SCENARIO_STORAGE_KEY] = raw

    expect(loadScenarioSnapshot()).toBeNull()
    expect(data[SCENARIO_STORAGE_KEY]).toBeUndefined()
  })

  it("rejects snapshots whose resources no longer match the catalog", async () => {
    const { currentCatalog, snapshot } = await compatibleScenario()
    snapshot.trackState.moveSnapshots[0].moveId = 999_999

    expect(scenarioSnapshotMatchesCatalog(snapshot, currentCatalog)).toBe(false)
  })

  it("accepts a structurally valid snapshot for the current catalog", async () => {
    const { currentCatalog, snapshot } = await compatibleScenario()

    expect(scenarioSnapshotMatchesCatalog(snapshot, currentCatalog)).toBe(true)
  })

  it("round trips and validates no ability independently from Unknown ability", async () => {
    const { currentCatalog, snapshot } = await compatibleScenario()
    snapshot.trackState.attackerAbilityIds = [NO_ABILITY_ID, 8]
    snapshot.trackState.defenderAbilityIds = [NO_ABILITY_ID]
    saveScenarioSnapshot(snapshot)

    const restored = loadScenarioSnapshot()
    expect(restored?.trackState.attackerAbilityIds).toEqual([NO_ABILITY_ID, 8])
    expect(restored?.trackState.defenderAbilityIds).toEqual([NO_ABILITY_ID])
    expect(restored && scenarioSnapshotMatchesCatalog(restored, currentCatalog)).toBe(true)
  })

  it("accepts valid side-specific numeric Held item selections", async () => {
    const { currentCatalog, snapshot } = await compatibleScenario()
    snapshot.trackState.attackerItemIds = [247]
    snapshot.trackState.defenderItemIds = [581]

    expect(scenarioSnapshotMatchesCatalog(snapshot, currentCatalog)).toBe(true)
  })

  it.each([
    ["attacker item on defender side", ["none"], [247]],
    ["defender item on attacker side", [581], ["none"]],
    ["whitelist-external id", [1659], ["none"]],
  ] as const)("rejects %s", async (_label, attackerItemIds, defenderItemIds) => {
    const { currentCatalog, snapshot } = await compatibleScenario()
    snapshot.trackState.attackerItemIds = [...attackerItemIds]
    snapshot.trackState.defenderItemIds = [...defenderItemIds]

    expect(scenarioSnapshotMatchesCatalog(snapshot, currentCatalog)).toBe(false)
  })

  it("rejects the wrong Ogerpon Mask for an identity lock", async () => {
    const catalog = await getCatalogShell(10273, 727, "en", "physical")
    const trackState = defaultTrackState(catalog)
    trackState.attackerItemIds = [2107]

    expect(
      scenarioSnapshotMatchesCatalog(
        {
          version: 5,
          attackerId: 10273,
          defenderId: 727,
          moveCategory: "physical",
          trackState,
        },
        catalog,
      ),
    ).toBe(false)
  })

  it("accepts a valid restored Mega Stone lock", async () => {
    const catalog = await getCatalogShell(10034, 727, "en", "physical")
    const trackState = defaultTrackState(catalog)

    expect(trackState.attackerItemIds).toEqual([699])
    expect(
      scenarioSnapshotMatchesCatalog(
        {
          version: 5,
          attackerId: 10034,
          defenderId: 727,
          moveCategory: "physical",
          trackState,
        },
        catalog,
      ),
    ).toBe(true)
  })

  it("loads a dual-store snapshot that still has touched flags", () => {
    const input = scenario()
    data[SCENARIO_STORAGE_KEY] = JSON.stringify({
      version: 5,
      ...input,
      trackState: {
        ...input.trackState,
        statRangeTouched: true,
        defenderRangeTouched: false,
      },
    })

    const loaded = loadScenarioSnapshot()
    expect(loaded?.trackState.statMode).toBe("preset")
    expect((loaded?.trackState as PersistedTrackState).statRangeTouched).toBe(true)
  })

  it("rebuilds a dual-store Range selected set from the saved interval", async () => {
    const { currentCatalog, snapshot } = await compatibleScenario()
    const extremePreset = offensePresetsForState(currentCatalog, snapshot.trackState)
      .find((preset) => preset.id === "extreme")
    if (extremePreset?.values.kind !== "offense") throw new Error("Expected EX")
    const extreme = extremePreset.values.stat
    const raw: PersistedTrackState = {
      ...snapshot.trackState,
      statMode: "range",
      offensePresetIds: ["neutral-zero", "neutral-max", "extreme"],
      statRange: { min: extreme, max: extreme },
      statRangeTouched: true,
      defenderRangeTouched: false,
    }
    const restored = restorePersistedTrackState(raw, currentCatalog)

    expect(restored.statMode).toBe("range")
    expect(restored.offensePresetIds).toEqual(["extreme"])
  })

  it("accepts every allowed restored Mega ability selection", async () => {
    const catalog = await getCatalogShell(10034, 727, "en", "physical")
    const fixed = catalog.attackerLockedAbilityId
    if (fixed === null) throw new Error("Expected fixed Mega ability")
    for (const selection of [[NO_ABILITY_ID], [fixed], [NO_ABILITY_ID, fixed]]) {
      const trackState = defaultTrackState(catalog)
      trackState.attackerAbilityIds = selection

      expect(scenarioSnapshotMatchesCatalog({
        version: 5,
        attackerId: 10034,
        defenderId: 727,
        moveCategory: "physical",
        trackState,
      }, catalog)).toBe(true)
    }
  })
})
