import { afterEach, expect, it } from "vitest"

import {
  resetChampionsItemUsageFetcherForTest,
  setChampionsItemUsageFetcherForTest,
  type ChampionsItemUsageRecord,
} from "@/lib/champions"
import { ATTACKER_HELD_ITEM_IDS } from "@/lib/held-item"

import { resolveDefaultHeldItemPick } from "./held-item-defaults"

afterEach(resetChampionsItemUsageFetcherForTest)

function record(
  battlePokemonId: number,
  partial: Partial<ChampionsItemUsageRecord> &
    Pick<ChampionsItemUsageRecord, "itemId" | "rank" | "championsItemName">,
): ChampionsItemUsageRecord {
  return {
    battlePokemonId,
    format: "Doubles",
    season: "test",
    source: "test",
    dataVersion: "test",
    percentage: 10,
    ...partial,
  }
}

const attackerEligible = new Set(ATTACKER_HELD_ITEM_IDS)
const selectable = new Set([6, 10034, 10035, 445, 10058])

it("builds the top-10 boundary without backfill and selects non-form-trigger items", async () => {
  setChampionsItemUsageFetcherForTest(async (battlePokemonId) => [
    record(battlePokemonId, { itemId: 717, rank: 1, percentage: 95, championsItemName: "Charizardite Y" }),
    record(battlePokemonId, { itemId: 247, rank: 2, percentage: 3, championsItemName: "Life Orb" }),
    record(battlePokemonId, { itemId: null, rank: 3, percentage: 1, championsItemName: "nothing" }),
    record(battlePokemonId, { itemId: null, rank: 4, percentage: 0.5, championsItemName: "Unknown Relic" }),
    // Mapped but not attacker-eligible — occupies boundary slots, no backfill.
    record(battlePokemonId, { itemId: 9001, rank: 5, percentage: 0.4, championsItemName: "Focus Sash" }),
    record(battlePokemonId, { itemId: 9002, rank: 6, percentage: 0.3, championsItemName: "Leftovers" }),
    record(battlePokemonId, { itemId: 9003, rank: 7, percentage: 0.2, championsItemName: "Focus Band" }),
    record(battlePokemonId, { itemId: 9004, rank: 8, percentage: 0.1, championsItemName: "Bright Powder" }),
    record(battlePokemonId, { itemId: 9005, rank: 9, percentage: 0.1, championsItemName: "White Herb" }),
    record(battlePokemonId, { itemId: 9006, rank: 10, percentage: 0.1, championsItemName: "Mental Herb" }),
    // Outside boundary — must not enter even if eligible.
    record(battlePokemonId, { itemId: 245, rank: 11, percentage: 0.1, championsItemName: "Expert Belt" }),
  ])

  const result = await resolveDefaultHeldItemPick({
    battlePokemonId: 6,
    lockedItemId: null,
    sideEligibleIds: attackerEligible,
    selectableIds: selectable,
  })

  expect(result.status).toBe("ready")
  expect(result.poolIds).toEqual([717, 247])
  expect(result.selectedIds).toEqual([247])
})

it("falls back to none when usage is empty or only form-triggers remain", async () => {
  setChampionsItemUsageFetcherForTest(async (battlePokemonId) => [
    record(battlePokemonId, { itemId: 717, rank: 1, percentage: 100, championsItemName: "Charizardite Y" }),
  ])

  await expect(
    resolveDefaultHeldItemPick({
      battlePokemonId: 6,
      lockedItemId: null,
      sideEligibleIds: attackerEligible,
      selectableIds: selectable,
    }),
  ).resolves.toEqual({
    poolIds: [717],
    selectedIds: ["none"],
    status: "ready",
  })

  setChampionsItemUsageFetcherForTest(async () => {
    throw new Error("offline")
  })

  await expect(
    resolveDefaultHeldItemPick({
      battlePokemonId: 6,
      lockedItemId: null,
      sideEligibleIds: attackerEligible,
      selectableIds: selectable,
    }),
  ).resolves.toEqual({
    poolIds: [],
    selectedIds: ["none"],
    status: "unavailable",
  })
})

it("short-circuits locked identities to the locked item only", async () => {
  setChampionsItemUsageFetcherForTest(async () => {
    throw new Error("should not fetch")
  })

  await expect(
    resolveDefaultHeldItemPick({
      battlePokemonId: 10034,
      lockedItemId: 699,
      sideEligibleIds: attackerEligible,
      selectableIds: selectable,
    }),
  ).resolves.toEqual({
    poolIds: [699],
    selectedIds: [699],
    status: "ready",
  })
})
