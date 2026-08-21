import { describe, expect, it } from "vitest"

import { getCatalogShell } from "@/lib/catalog"
import {
  defaultTrackState,
  defensePresetsForState,
  normalizeScreens,
  offensePresetsForState,
  restorePersistedTrackState,
  selectedSnapshotMoveIds,
  snapshotMoveIds,
  snapshotsForMoveIds,
  trackStateAfterCatalogTransition,
  trackStateAfterDefenseMode,
  trackStateAfterDefenseRanges,
  trackStateAfterOffenseMode,
  trackStateAfterOffenseRange,
  trackStateAfterRemoveDefense,
  trackStateAfterRemoveOffense,
  trackStateAfterToggleDefense,
  trackStateAfterToggleOffense,
  type PersistedTrackState,
} from "@/lib/scenario"
import { DEFIANT_ABILITY_ID, DROUGHT_ABILITY_ID, INTIMIDATE_ABILITY_ID } from "@/lib/ability"
import { defaultOffensePresetSelection, type StatPreset } from "@/lib/stat-preset"

function offenseStat(presets: StatPreset[], id: string): number {
  const preset = presets.find((candidate) => candidate.id === id)
  if (preset?.values.kind !== "offense") throw new Error(`Expected offense preset ${id}`)
  return preset.values.stat
}

describe("scenario identity transitions", () => {
  it("resets projection targets to neutral until identity defaults resolve", async () => {
    const baseCatalog = await getCatalogShell(6, 9, "en")
    const state = defaultTrackState(baseCatalog)
    state.weathers = ["none", "sun"]
    state.terrains = ["none", "electric"]
    state.attackerStages = [-1, 0, 2]
    state.defenderStages = [0, 1]

    const nextCatalog = await getCatalogShell(133, 143, "en")
    const next = trackStateAfterCatalogTransition(state, nextCatalog, {
      attackerOwnerChanged: true,
      attackerChanged: true,
      defenderChanged: true,
    })

    expect(next.weathers).toEqual(["none"])
    expect(next.terrains).toEqual(["none"])
    expect(next.attackerStages).toEqual([0])
    expect(next.defenderStages).toEqual([0])
  })

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
  it("keeps Weather and Terrain while resetting and reprojecting Stage on category changes", async () => {
    const physicalCatalog = await getCatalogShell(133, 143, "en", "physical")
    const state = defaultTrackState(physicalCatalog)
    state.attackerAbilityIds = [DEFIANT_ABILITY_ID, DROUGHT_ABILITY_ID]
    state.defenderAbilityIds = [INTIMIDATE_ABILITY_ID]
    state.weathers = ["none", "sun"]
    state.terrains = ["none", "electric"]
    state.attackerStages = [4]
    state.defenderStages = [-2]

    const next = trackStateAfterCatalogTransition(
      state,
      await getCatalogShell(133, 143, "en", "special"),
      {
        attackerOwnerChanged: true,
        attackerChanged: false,
        defenderChanged: false,
      },
    )

    expect(next.weathers).toEqual(["none", "sun"])
    expect(next.terrains).toEqual(["none", "electric"])
    expect(next.attackerStages).toEqual([0])
    expect(next.defenderStages).toEqual([0])
  })

  it("normalizes an empty screen selection without changing populated selections", () => {
    expect(normalizeScreens([])).toEqual(["none"])
    expect(normalizeScreens(["none", "walls"])).toEqual([
      "none",
      "walls",
    ])
  })

  it("defaults a new Matchup to discrete 32A and 0H0B+32H0B selections", async () => {
    const catalog = await getCatalogShell(6, 9, "en")
    const state = defaultTrackState(catalog)

    expect(state.statMode).toBe("preset")
    expect(state.defenderMode).toBe("preset")
    expect(state.offensePresetIds).toEqual(["neutral-max"])
    expect(state.defensePresetIds).toEqual(["min-bulk", "hp-32"])
    expect(state.offenseTemporaryPresets).toEqual([])
    expect(state.defenseTemporaryPresets).toEqual([])
    expect(
      defaultOffensePresetSelection(
        [{ id: "neutral-zero" }, { id: "extreme" }, { id: "neutral-max" }] as StatPreset[],
        [{ id: "user-offense" }] as StatPreset[],
      ),
    ).toEqual(["neutral-zero", "extreme", "user-offense"])
  })

  it("keeps the same selected set when switching Stat Track mode", async () => {
    const catalog = await getCatalogShell(6, 9, "en")
    const state = defaultTrackState(catalog)
    const presets = offensePresetsForState(catalog, state)
    const choice = trackStateAfterOffenseMode(state, "preset", presets)
    const back = trackStateAfterOffenseMode(choice, "range", presets)

    expect(choice.statMode).toBe("preset")
    expect(choice.offensePresetIds).toEqual(state.offensePresetIds)
    expect(back.statMode).toBe("range")
    expect(back.offensePresetIds).toEqual(state.offensePresetIds)
    expect(back.offenseTemporaryPresets).toEqual([])
  })

  it("writes two defense envelope endpoints, not four corners", async () => {
    const catalog = await getCatalogShell(6, 9, "en")
    const state = defaultTrackState(catalog)
    state.defenderMode = "preset"
    state.defensePresetIds = ["min-bulk", "standard-bulk"]
    state.defenseTemporaryPresets = []
    const presets = defensePresetsForState(catalog, state)
    const min = presets.find((preset) => preset.id === "min-bulk")
    const max = presets.find((preset) => preset.id === "standard-bulk")
    if (min?.values.kind !== "defense" || max?.values.kind !== "defense") {
      throw new Error("Expected system Defense Stat Presets")
    }

    const ranged = trackStateAfterDefenseMode(state, "range", presets)
    const selected = ranged.defensePresetIds.map((id) =>
      [...presets, ...ranged.defenseTemporaryPresets].find((preset) => preset.id === id),
    )

    expect(ranged.defensePresetIds).toHaveLength(2)
    expect(selected).toEqual([
      expect.objectContaining({
        values: { kind: "defense", hp: min.values.hp, def: min.values.def },
      }),
      expect.objectContaining({
        values: { kind: "defense", hp: max.values.hp, def: max.values.def },
      }),
    ])
  })

  it("does not deselect the last remaining Stat Value", async () => {
    const catalog = await getCatalogShell(6, 9, "en")
    const state = defaultTrackState(catalog)
    state.statMode = "preset"
    state.offensePresetIds = ["extreme"]
    const presets = offensePresetsForState(catalog, state)

    expect(trackStateAfterToggleOffense(state, "extreme", presets)).toBe(state)
    expect(trackStateAfterRemoveOffense(state, "extreme", presets)).toBeNull()

    state.defenderMode = "preset"
    state.defensePresetIds = ["hp-32"]
    const defensePresets = defensePresetsForState(catalog, state)
    expect(trackStateAfterToggleDefense(state, "hp-32", defensePresets)).toBe(state)
    expect(trackStateAfterRemoveDefense(state, "hp-32", defensePresets)).toBeNull()
  })

  it("keeps interior points when a Range boundary is dragged outward", async () => {
    const catalog = await getCatalogShell(6, 9, "en")
    const state = defaultTrackState(catalog)
    const presets = offensePresetsForState(catalog, state)
    state.offensePresetIds = ["neutral-zero", "extreme"]
    const choice = trackStateAfterToggleOffense(state, "neutral-max", presets)
    const grown = trackStateAfterOffenseRange(
      choice,
      { min: choice.statRange.min - 10, max: choice.statRange.max },
      offensePresetsForState(catalog, choice),
    )

    expect(grown.offensePresetIds).toEqual(
      expect.arrayContaining(["neutral-zero", "neutral-max", "extreme"]),
    )
    expect(grown.offenseTemporaryPresets).toHaveLength(1)
    expect(grown.offenseTemporaryPresets[0]?.values).toEqual({
      kind: "offense",
      stat: choice.statRange.min - 10,
    })
  })

  it("drops a previous Temporary endpoint once it is no longer on the envelope", async () => {
    const catalog = await getCatalogShell(6, 9, "en")
    const state = defaultTrackState(catalog)
    const presets = offensePresetsForState(catalog, state)
    state.offensePresetIds = ["neutral-zero", "extreme"]
    state.statRange = {
      min: offenseStat(presets, "neutral-zero"),
      max: offenseStat(presets, "extreme"),
    }
    const first = trackStateAfterOffenseRange(
      state,
      { min: state.statRange.min - 10, max: state.statRange.max },
      presets,
    )
    const second = trackStateAfterOffenseRange(
      first,
      { min: state.statRange.min - 20, max: state.statRange.max },
      offensePresetsForState(catalog, first),
    )

    expect(second.offenseTemporaryPresets).toHaveLength(1)
    expect(second.offenseTemporaryPresets[0]?.values).toEqual({
      kind: "offense",
      stat: state.statRange.min - 20,
    })
    expect(second.offensePresetIds).toEqual(
      expect.arrayContaining(["neutral-zero", "extreme"]),
    )
    expect(second.offensePresetIds).not.toContain(first.offenseTemporaryPresets[0]?.id)
  })

  it("drops a previous Temporary Defense endpoint once it is no longer on the envelope", async () => {
    const catalog = await getCatalogShell(6, 9, "en")
    const state = defaultTrackState(catalog)
    const presets = defensePresetsForState(catalog, state)
    const first = trackStateAfterDefenseRanges(
      state,
      {
        hp: { min: state.defenderRanges.hp.min - 10, max: state.defenderRanges.hp.max },
        def: state.defenderRanges.def,
      },
      presets,
    )
    const second = trackStateAfterDefenseRanges(
      first,
      {
        hp: { min: state.defenderRanges.hp.min - 20, max: state.defenderRanges.hp.max },
        def: state.defenderRanges.def,
      },
      defensePresetsForState(catalog, first),
    )

    expect(second.defenseTemporaryPresets).toHaveLength(1)
    expect(second.defenseTemporaryPresets[0]?.values).toEqual({
      kind: "defense",
      hp: state.defenderRanges.hp.min - 20,
      def: state.defenderRanges.def.min,
    })
    expect(second.defensePresetIds).not.toContain(first.defenseTemporaryPresets[0]?.id)
  })

  it("deselects outliers and deletes Temporary Stat Values when dragged inward", async () => {
    const catalog = await getCatalogShell(6, 9, "en")
    const state = defaultTrackState(catalog)
    const presets = offensePresetsForState(catalog, state)
    state.offensePresetIds = ["neutral-zero", "extreme"]
    state.statRange = {
      min: offenseStat(presets, "neutral-zero"),
      max: offenseStat(presets, "extreme"),
    }
    const grown = trackStateAfterOffenseRange(
      state,
      { min: state.statRange.min - 10, max: state.statRange.max },
      presets,
    )
    const shrunk = trackStateAfterOffenseRange(
      grown,
      state.statRange,
      offensePresetsForState(catalog, grown),
    )

    expect(shrunk.offensePresetIds).toEqual(["neutral-zero", "extreme"])
    expect(shrunk.offenseTemporaryPresets).toEqual([])
  })

  it("grows a one-member Range by keeping the original and adding a Temporary Stat Value", async () => {
    const catalog = await getCatalogShell(6, 9, "en")
    const state = defaultTrackState(catalog)
    state.statMode = "preset"
    state.offensePresetIds = ["extreme"]
    const presets = offensePresetsForState(catalog, state)
    const extreme = presets.find((preset) => preset.id === "extreme")
    if (extreme?.values.kind !== "offense") throw new Error("Expected EX")

    const grown = trackStateAfterOffenseRange(
      state,
      { min: extreme.values.stat, max: extreme.values.stat + 12 },
      presets,
    )

    expect(grown.offensePresetIds).toContain("extreme")
    expect(grown.offenseTemporaryPresets).toHaveLength(1)
    expect(grown.offenseTemporaryPresets[0]?.values).toEqual({
      kind: "offense",
      stat: extreme.values.stat + 12,
    })
  })

  it("orders crossed Range handles without clearing the selected set", async () => {
    const catalog = await getCatalogShell(6, 9, "en")
    const state = defaultTrackState(catalog)
    const presets = offensePresetsForState(catalog, state)
    const crossed = trackStateAfterOffenseRange(
      state,
      { min: state.statRange.max, max: state.statRange.min },
      presets,
    )

    expect(crossed.statRange).toEqual(state.statRange)
    expect(crossed.offensePresetIds).toEqual(state.offensePresetIds)
  })

  it("resets Stat Tracks to the new-Matchup discrete defaults on Identity change", async () => {
    const baseCatalog = await getCatalogShell(6, 9, "en")
    const state = defaultTrackState(baseCatalog)
    state.statMode = "preset"
    state.offensePresetIds = ["neutral-max"]

    const next = trackStateAfterCatalogTransition(
      state,
      await getCatalogShell(133, 9, "en"),
      {
        attackerOwnerChanged: true,
        attackerChanged: true,
        defenderChanged: false,
      },
    )

    expect(next.statMode).toBe("preset")
    expect(next.defenderMode).toBe("preset")
    expect(next.offensePresetIds).toEqual(["neutral-max"])
    expect(next.defensePresetIds).toEqual(["min-bulk", "hp-32"])
  })

  it("restores a dual-store Range snapshot from the saved interval plus in-envelope picks", async () => {
    const catalog = await getCatalogShell(6, 9, "en")
    const fresh = defaultTrackState(catalog)
    const presets = offensePresetsForState(catalog, fresh)
    const extreme = presets.find((preset) => preset.id === "extreme")
    if (extreme?.values.kind !== "offense") {
      throw new Error("Expected system Offense Stat Presets")
    }

    const raw: PersistedTrackState = {
      ...fresh,
      statMode: "range",
      offensePresetIds: ["neutral-zero", "neutral-max", "extreme"],
      statRange: { min: extreme.values.stat, max: extreme.values.stat },
      statRangeTouched: true,
      defenderRangeTouched: false,
    }
    const restored = restorePersistedTrackState(raw, catalog)

    expect(restored.statMode).toBe("range")
    expect(restored.offensePresetIds).toEqual(["extreme"])
    expect(restored.statRange).toEqual(raw.statRange)
  })

  it("restores a dual-store Choice snapshot from saved IDs, not the dormant interval", async () => {
    const catalog = await getCatalogShell(6, 9, "en")
    const fresh = defaultTrackState(catalog)
    const presets = offensePresetsForState(catalog, fresh)
    const extreme = presets.find((preset) => preset.id === "extreme")
    if (extreme?.values.kind !== "offense") {
      throw new Error("Expected system Offense Stat Presets")
    }

    const raw: PersistedTrackState = {
      ...fresh,
      statMode: "preset",
      offensePresetIds: ["neutral-max"],
      statRange: { min: extreme.values.stat, max: extreme.values.stat },
      statRangeTouched: true,
      defenderRangeTouched: false,
    }
    const restored = restorePersistedTrackState(raw, catalog)
    const envelope = presets.find((preset) => preset.id === "neutral-max")
    if (envelope?.values.kind !== "offense") {
      throw new Error("Expected system Offense Stat Presets")
    }

    expect(restored.statMode).toBe("preset")
    expect(restored.offensePresetIds).toEqual(["neutral-max"])
    expect(restored.statRange).toEqual({ min: envelope.values.stat, max: envelope.values.stat })
  })

  it("restores a dual-store Defense Range snapshot from the saved interval plus in-envelope picks", async () => {
    const catalog = await getCatalogShell(6, 9, "en")
    const fresh = defaultTrackState(catalog)
    const presets = defensePresetsForState(catalog, fresh)
    const hp32 = presets.find((preset) => preset.id === "hp-32")
    if (hp32?.values.kind !== "defense") {
      throw new Error("Expected system Defense Stat Presets")
    }

    const raw: PersistedTrackState = {
      ...fresh,
      defenderMode: "range",
      defensePresetIds: ["min-bulk", "hp-32", "standard-bulk"],
      defenderRanges: {
        hp: { min: hp32.values.hp, max: hp32.values.hp },
        def: { min: hp32.values.def, max: hp32.values.def },
      },
      statRangeTouched: false,
      defenderRangeTouched: true,
    }
    const restored = restorePersistedTrackState(raw, catalog)

    expect(restored.defenderMode).toBe("range")
    expect(restored.defensePresetIds).toEqual(["hp-32"])
    expect(restored.defenderRanges).toEqual(raw.defenderRanges)
  })

  it("restores a current-model snapshot without rewriting it to new-Matchup defaults", async () => {
    const catalog = await getCatalogShell(6, 9, "en")
    const fresh = defaultTrackState(catalog)
    const raw: PersistedTrackState = {
      ...fresh,
      statMode: "preset",
      offensePresetIds: ["neutral-max"],
    }
    const restored = restorePersistedTrackState(raw, catalog)

    expect(restored.statMode).toBe("preset")
    expect(restored.offensePresetIds).toEqual(["neutral-max"])
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
