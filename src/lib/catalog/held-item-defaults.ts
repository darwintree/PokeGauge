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
  const sorted = records.toSorted(
    (a, b) =>
      a.rank - b.rank ||
      (b.percentage ?? Number.NEGATIVE_INFINITY) -
        (a.percentage ?? Number.NEGATIVE_INFINITY) ||
      a.championsItemName.localeCompare(b.championsItemName) ||
      (a.itemId ?? Number.POSITIVE_INFINITY) - (b.itemId ?? Number.POSITIVE_INFINITY),
  )

  // Keep null itemId rows (nothing / unmapped) in the top-10 window; dedupe mapped ids only.
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
  side: "attacker" | "defender"
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
      if (input.side === "defender" || selectedIds.length < 2) selectedIds.push(row.itemId)
    }

    return {
      poolIds: [EXPLICIT_NO_ITEM_ID, ...poolIds],
      selectedIds: [EXPLICIT_NO_ITEM_ID, ...selectedIds],
      status: "ready",
    }
  } catch {
    return {
      poolIds: [EXPLICIT_NO_ITEM_ID],
      selectedIds: [EXPLICIT_NO_ITEM_ID],
      status: "unavailable",
    }
  }
}
