import { describe, expect, it } from "vitest"

import { getCatalogShell } from "@/lib/catalog"
import { defaultTrackState } from "@/lib/scenario-pipeline"

import { trackStateAfterCatalogTransition } from "./use-scenario-state"

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
