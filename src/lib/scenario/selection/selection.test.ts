import { describe, expect, it } from "vitest"
import {
  CLEAR_BODY_ABILITY_ID, DEFIANT_ABILITY_ID, DRIZZLE_ABILITY_ID,
  DROUGHT_ABILITY_ID, INTIMIDATE_ABILITY_ID, NO_ABILITY_ID,
} from "@/lib/ability"
import { getCatalogShell, type MatchupCatalog } from "@/lib/catalog"
import { buildSystemDefensePresets, buildSystemOffensePresets } from "@/lib/stat-preset"
import { createSelectionState, reduceSelection, selectionIsSettled, type SelectionContext } from "./index"

function context(catalog: MatchupCatalog): SelectionContext {
  return {
    catalog,
    offensePresets: buildSystemOffensePresets(catalog.matchup.attackerCalcName, catalog.moveCategory),
    defensePresets: buildSystemDefensePresets(catalog.matchup.defenderCalcName, catalog.moveCategory),
  }
}

function ready(catalog: MatchupCatalog): MatchupCatalog {
  return {
    ...catalog,
    defaultAbilityPickStatus: "ready",
    defaultItemPickStatus: "ready",
    defaultMovePickStatus: "ready",
    defaultStatPickStatus: "ready",
  }
}

describe("selection engine", () => {
  it("settles untouched defaults but protects user choices from late recommendations", async () => {
    const shell = await getCatalogShell(445, 727, "en", "physical")
    const initial = createSelectionState(context(shell))
    expect(selectionIsSettled(initial)).toBe(false)
    const edited = reduceSelection(initial, { type: "item-select", side: "attacker", ids: [247] })
    const catalog = { ...ready(shell), defaultAttackerItemIds: [270], defaultAttackerItemPoolIds: ["none", 270] } satisfies MatchupCatalog
    const settled = reduceSelection(edited, { type: "context", context: context(catalog) })
    expect(settled.trackState.attackerItemIds).toEqual([247])
    expect(selectionIsSettled(settled)).toBe(true)
    expect(reduceSelection(initial, { type: "context", context: context(catalog) }).trackState.attackerItemIds).toEqual([270])
    expect(initial.edited.size).toBe(0)
  })

  it("normalizes empty item selections and orders selected items by their pool", async () => {
    const catalog = ready(await getCatalogShell(445, 727, "en"))
    catalog.defaultAttackerItemPoolIds = ["none", 247, 270]
    let state = createSelectionState(context(catalog))
    state = reduceSelection(state, { type: "item-select", side: "attacker", ids: [270, 247] })
    expect(state.trackState.attackerItemIds).toEqual([247, 270])
    state = reduceSelection(state, { type: "item-select", side: "attacker", ids: [] })
    expect(state.trackState.attackerItemIds).toEqual(["none"])
    expect(state.trackState.attackerItemPoolIds).toEqual(["none", 247, 270])
  })

  it("keeps a legal carried item through form changes and subsequent async defaults", async () => {
    let state = createSelectionState(context(ready(await getCatalogShell(384, 9, "en"))))
    state = reduceSelection(state, { type: "item-select", side: "attacker", ids: [247] })
    const mega = await getCatalogShell(10079, 9, "en")
    state = reduceSelection(state, { type: "context", context: context(mega) })
    expect(state.trackState.attackerItemIds).toEqual([247])
    state = reduceSelection(state, { type: "context", context: context(ready(mega)) })
    expect(state.trackState.attackerItemIds).toEqual([247])
    state = reduceSelection(state, { type: "item-select", side: "attacker", ids: [] })
    expect(state.trackState.attackerItemIds).toEqual(["none"])
  })

  it("prevents item commands from replacing a locked form item", async () => {
    const state = createSelectionState(context(ready(await getCatalogShell(10034, 9, "en"))))
    expect(reduceSelection(state, { type: "item-select", side: "attacker", ids: [] })).toBe(state)
    expect(reduceSelection(state, { type: "item-add", side: "attacker", id: 247 })).toBe(state)
  })

  it("unions ability pair recommendations and returns to automatic stages on reset", async () => {
    const catalog = ready(await getCatalogShell(983, 727, "en", "physical"))
    catalog.defaultAttackerAbilityIds = [DEFIANT_ABILITY_ID]
    catalog.defaultDefenderAbilityIds = [INTIMIDATE_ABILITY_ID]
    let state = createSelectionState(context(catalog))
    expect(state.trackState.attackerStages).toEqual([1])
    expect(state.trackState.attackerStagePool).toEqual([0, 1, 2])
    state = reduceSelection(state, { type: "ability-select", side: "attacker", ids: [DEFIANT_ABILITY_ID, CLEAR_BODY_ABILITY_ID] })
    expect(state.trackState.attackerStages).toEqual([0, 1])
    state = reduceSelection(state, { type: "stage-select", side: "attacker", values: [3] })
    state = reduceSelection(state, { type: "ability-select", side: "defender", ids: [NO_ABILITY_ID] })
    expect(state.trackState.attackerStages).toEqual([3])
    state = reduceSelection(state, { type: "stage-reset", side: "attacker" })
    expect(state.trackState.attackerStages).toEqual([0])
    expect(state.trackState.attackerStagePool).toEqual([0, 1, 2])
  })

  it("protects manual weather while adding new candidates and preserves restored selections", async () => {
    const catalog = ready(await getCatalogShell(445, 727, "en"))
    let state = createSelectionState(context(catalog))
    state = reduceSelection(state, { type: "weather-select", values: ["snow"] })
    state = reduceSelection(state, { type: "ability-select", side: "attacker", ids: [DROUGHT_ABILITY_ID] })
    expect(state.trackState.weathers).toEqual(["snow"])
    expect(state.trackState.weatherPool).toContain("sun")
    const restored = createSelectionState(context(catalog), state.trackState)
    const next = reduceSelection(restored, { type: "context", context: context({
      ...catalog, defaultAttackerAbilityIds: [DRIZZLE_ABILITY_ID],
    }) })
    expect(next.trackState).toEqual(state.trackState)
  })

  it("projects a reset restored ability once loading finishes even if its default id is unchanged", async () => {
    const catalog = await getCatalogShell(445, 727, "en")
    catalog.defaultAttackerAbilityIds = [DROUGHT_ABILITY_ID]
    const original = createSelectionState(context(ready(catalog)))
    let state = createSelectionState(context(catalog), {
      ...original.trackState, weatherPool: ["none"], weathers: ["none"],
    })
    state = reduceSelection(state, { type: "ability-reset", side: "attacker" })
    state = reduceSelection(state, { type: "context", context: context(ready(catalog)) })
    expect(state.trackState.weathers).toEqual(["none"])
    expect(state.trackState.weatherPool).toContain("sun")
    expect(state.abilityProjectionPending).toBe(false)
  })
})
