import { describe, expect, it } from "vitest"

import { getCatalogShell } from "@/lib/catalog"
import {
  defaultTrackState,
  normalizeScreens,
  reconcileDefenseFromRange,
  reconcileOffenseFromRange,
  selectedSnapshotMoveIds,
  snapshotMoveIds,
  snapshotsForMoveIds,
  trackStateAfterCatalogTransition,
} from "@/lib/scenario"
import type { StatPreset } from "@/lib/stat-preset"


describe("scenario identity transitions", () => {
  it("applies both sides' locked Mega values through the ordinary identity reset", async () => {
    const baseCatalog = await getCatalogShell(6, 9, "en")
    const state = defaultTrackState(baseCatalog)
    state.attackerItemIds = [247]
    state.defenderItemIds = [581]

    const megaCatalog = await getCatalogShell(10034, 10035, "en")
    const next = trackStateAfterCatalogTransition(state, megaCatalog, {
      attackerOwnerChanged: true,
      attackerChanged: true,
      defenderChanged: true,
    })

    expect(next.attackerItemIds).toEqual([699])
    expect(next.defenderItemIds).toEqual([717])
    expect(next.attackerAbilityIds).toEqual([megaCatalog.attackerLockedAbilityId])
    expect(next.defenderAbilityIds).toEqual([megaCatalog.defenderLockedAbilityId])
  })

  it("preserves Rayquaza's current item while keeping the item Track editable", async () => {
    const baseCatalog = await getCatalogShell(6, 9, "en")
    const state = defaultTrackState(baseCatalog)
    state.attackerItemIds = [247]

    const rayquazaCatalog = await getCatalogShell(10079, 9, "en")
    const next = trackStateAfterCatalogTransition(state, rayquazaCatalog, {
      attackerOwnerChanged: true,
      attackerChanged: true,
      defenderChanged: false,
    })

    expect(rayquazaCatalog.attackerLockedItemId).toBeNull()
    expect(next.attackerItemIds).toEqual([247])
  })

  it("resets identity-locked Masks when switching either side to Mega Rayquaza", async () => {
    const baseCatalog = await getCatalogShell(10273, 10274, "en")
    const state = defaultTrackState(baseCatalog)

    const rayquazaCatalog = await getCatalogShell(10079, 10079, "en")
    const next = trackStateAfterCatalogTransition(state, rayquazaCatalog, {
      attackerOwnerChanged: true,
      attackerChanged: true,
      defenderChanged: true,
    })

    expect(next.attackerItemIds).toEqual(["none"])
    expect(next.defenderItemIds).toEqual(["none"])
  })

  it("does not restore pre-Mega item or ability values after switching back", async () => {
    const megaCatalog = await getCatalogShell(10034, 9, "en")
    const state = defaultTrackState(megaCatalog)
    const baseCatalog = await getCatalogShell(6, 9, "en")

    const next = trackStateAfterCatalogTransition(state, baseCatalog, {
      attackerOwnerChanged: true,
      attackerChanged: true,
      defenderChanged: false,
    })

    expect(next.attackerItemIds).toEqual(["none"])
    expect(next.attackerAbilityIds).toEqual(baseCatalog.defaultAttackerAbilityIds)
  })
})

describe("scenario pure transitions", () => {
  it("normalizes an empty screen selection without changing populated selections", () => {
    expect(normalizeScreens([])).toEqual(["none"])
    expect(normalizeScreens(["reflect", "light-screen"])).toEqual([
      "reflect",
      "light-screen",
    ])
  })

  it("reconciles offense ranges to existing and temporary presets", () => {
    const system: StatPreset = {
      id: "neutral-zero",
      kind: "system",
      values: { kind: "offense", stat: 100 },
    }
    const existingTemporary: StatPreset = {
      id: "temp-existing",
      kind: "temporary",
      values: { kind: "offense", stat: 200 },
    }

    const result = reconcileOffenseFromRange(
      [system],
      { min: 100, max: 200 },
      [existingTemporary],
    )

    expect(result.selectedIds).toEqual(["neutral-zero", "temp-existing"])
    expect(result.temporary).toEqual([existingTemporary])
  })

  it("creates one temporary preset per missing defense range corner", () => {
    const result = reconcileDefenseFromRange(
      [],
      { hp: { min: 100, max: 120 }, def: { min: 200, max: 220 } },
      [],
    )

    expect(result.selectedIds).toHaveLength(4)
    expect(result.temporary).toHaveLength(4)
    expect(result.temporary.every((preset) => preset.kind === "temporary")).toBe(true)
  })

  it("converts move ids and selected snapshot ids through the same snapshot list", async () => {
    const catalog = await getCatalogShell(6, 9, "en")
    const moveIds = catalog.moves.slice(0, 2).map((move) => move.id)
    const snapshots = snapshotsForMoveIds(catalog, moveIds)

    expect(snapshotMoveIds(snapshots)).toEqual(moveIds)
    expect(selectedSnapshotMoveIds(snapshots, [snapshots[1].id])).toEqual([moveIds[1]])
    expect(snapshotsForMoveIds(catalog, [Number.MAX_SAFE_INTEGER])).toEqual([])
  })
})
