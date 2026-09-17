import { listChampionsItemUsageRecords } from "@/lib/champions"
import {
  recommendHeldItems, type HeldItemRecommendationInput,
} from "@/lib/scenario/selection/recommendations"

export type DefaultHeldItemPick = ReturnType<typeof recommendHeldItems> & {
  status: "ready" | "unavailable"
}

export async function resolveDefaultHeldItemPick(
  input: HeldItemRecommendationInput,
): Promise<DefaultHeldItemPick> {
  if (input.lockedItemId !== null) return { ...recommendHeldItems(input, []), status: "ready" }
  try {
    const records = await listChampionsItemUsageRecords(input.battlePokemonId)
    return { ...recommendHeldItems(input, records), status: "ready" }
  } catch {
    return { ...recommendHeldItems(input, []), status: "unavailable" }
  }
}
