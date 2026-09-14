import type { CalculationRules } from "@/lib/calculation-rules"
import type { HeldItemId } from "./types"

/** Audited missing modifiers in the pinned Champions engine; see the support audit. */
const CHAMPIONS_UNSUPPORTED_ITEMS = new Set([
  197, 274, 235, 203, 204, 683, 581, 112, 113, 442, 202, 2106, 2107, 2108, 1181,
])

export function heldItemEffectIsSupported(id: HeldItemId, rules: CalculationRules): boolean {
  return rules !== "champions" || typeof id !== "number" || !CHAMPIONS_UNSUPPORTED_ITEMS.has(id)
}
