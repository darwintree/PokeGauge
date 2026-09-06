import { listChampionsItemUsageRecords } from "@/lib/champions"
import {
  recommendHeldItems, type HeldItemRecommendationInput,
} from "@/lib/scenario/selection/recommendations"
import { DEFAULT_USAGE_TIMEOUT_MS, withTimeout } from "./champions-defaults"

export type DefaultHeldItemPick = ReturnType<typeof recommendHeldItems> & {
  status: "ready" | "unavailable"
}

export async function resolveDefaultHeldItemPick(
  input: HeldItemRecommendationInput,
): Promise<DefaultHeldItemPick> {
  if (input.lockedItemId !== null) return { ...recommendHeldItems(input, []), status: "ready" }
  try {
    const records = await withTimeout(
      listChampionsItemUsageRecords(input.battlePokemonId),
      DEFAULT_USAGE_TIMEOUT_MS,
      "Default Held item pick",
    )
    return { ...recommendHeldItems(input, records), status: "ready" }
  } catch {
    return { ...recommendHeldItems(input, []), status: "unavailable" }
  }
}
