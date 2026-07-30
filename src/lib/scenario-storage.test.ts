import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { getCatalogShell } from "@/lib/catalog"
import {
  loadScenarioSnapshot,
  saveScenarioSnapshot,
  SCENARIO_STORAGE_KEY,
  scenarioSnapshotMatchesCatalog,
  type ScenarioSnapshotInput,
} from "@/lib/scenario-storage"
import { defaultTrackState } from "@/lib/scenario-pipeline"

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
      offenseTemplateIds: [],
      offenseTemporaryTemplates: [],
      statRange: { min: 130, max: 182 },
      statRangeTouched: false,
      showOffenseActual: false,
      offenseAllocationIndices: {},
      attackerStages: [0],
      attackerItemIds: ["none"],
      attackerAbilityIds: [8],
      weathers: ["none"],
      defenderMode: "preset",
      defenseTemplateIds: [],
      defenseTemporaryTemplates: [],
      defenderRanges: {
        hp: { min: 170, max: 202 },
        def: { min: 110, max: 156 },
      },
      defenderRangeTouched: false,
      showDefenseActual: false,
      showResultActual: true,
      defenseAllocationIndices: {},
      defenderStages: [0],
      defenderAbilityIds: [22],
      screens: ["none"],
      probabilityMode: "actual",
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
      version: 1,
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

    expect(loadScenarioSnapshot()).toEqual({ version: 1, ...input })
  })

  it.each([
    ["broken JSON", "{"],
    ["unsupported version", JSON.stringify({ version: 2 })],
    ["incomplete state", JSON.stringify({ version: 1, attackerId: 445 })],
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
})
