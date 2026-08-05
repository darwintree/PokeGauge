import {
  listChampionsItemUsageRecords,
  type ChampionsItemUsageRecord,
} from "@/lib/champions"
import {
  EXPLICIT_NO_ITEM_ID,
  isFormTriggerItem,
  isLegalFormTriggerTransition,
  type HeldItemId,
} from "@/lib/held-item"
import type { BattlePokemonId } from "@/lib/resources"

import { DEFAULT_USAGE_TIMEOUT_MS, withTimeout } from "./champions-defaults"

function orderItemUsageRecords(
  records: ChampionsItemUsageRecord[],
): ChampionsItemUsageRecord[] {
  const sorted = records.toSorted((a, b) => {
    const byRank = a.rank - b.rank
    if (byRank !== 0) return byRank
    const byUsage =
      (b.percentage ?? Number.NEGATIVE_INFINITY) -
      (a.percentage ?? Number.NEGATIVE_INFINITY)
    if (byUsage !== 0) return byUsage
    const byName = a.championsItemName.localeCompare(b.championsItemName)
    if (byName !== 0) return byName
    return (a.itemId ?? Number.POSITIVE_INFINITY) - (b.itemId ?? Number.POSITIVE_INFINITY)
  })

  const seen = new Set<number>()
  const ordered: ChampionsItemUsageRecord[] = []
  for (const record of sorted) {
    if (record.itemId != null) {
      if (seen.has(record.itemId)) continue
      seen.add(record.itemId)
    }
    ordered.push(record)
  }
  return ordered
}

export type DefaultHeldItemPick = {
  poolIds: HeldItemId[]
  selectedIds: HeldItemId[]
  status: "ready" | "unavailable"
}

export async function resolveDefaultHeldItemPick(input: {
  battlePokemonId: BattlePokemonId
  lockedItemId: HeldItemId | null
  sideEligibleIds: ReadonlySet<number>
  selectableIds: ReadonlySet<BattlePokemonId>
}): Promise<DefaultHeldItemPick> {
  if (input.lockedItemId !== null) {
    return {
      poolIds: [input.lockedItemId],
      selectedIds: [input.lockedItemId],
      status: "ready",
    }
  }

  try {
    const boundary = orderItemUsageRecords(
      await withTimeout(
        listChampionsItemUsageRecords(input.battlePokemonId),
        DEFAULT_USAGE_TIMEOUT_MS,
        "Default Held item pick",
      ),
    ).slice(0, 10)

    const poolIds: HeldItemId[] = []
    const selectedIds: HeldItemId[] = []

    for (const row of boundary) {
      if (row.itemId == null) continue
      if (isFormTriggerItem(row.itemId)) {
        if (
          isLegalFormTriggerTransition(
            input.battlePokemonId,
            row.itemId,
            input.selectableIds,
          )
        ) {
          poolIds.push(row.itemId)
        }
        continue
      }
      if (!input.sideEligibleIds.has(row.itemId)) continue
      poolIds.push(row.itemId)
      selectedIds.push(row.itemId)
    }

    return {
      poolIds,
      selectedIds: selectedIds.length > 0 ? selectedIds : [EXPLICIT_NO_ITEM_ID],
      status: "ready",
    }
  } catch {
    return {
      poolIds: [],
      selectedIds: [EXPLICIT_NO_ITEM_ID],
      status: "unavailable",
    }
  }
}
