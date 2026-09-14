import type { CalculationRules } from "@/lib/calculation-rules"

/** Missing Champions mechanisms, reviewed against the pinned upstream engine. */
const CHAMPIONS_UNSUPPORTED_MOVES = new Set([
  138, 167, 228, 362, 378, 449, 462, 485, 507, 614, 712, 713, 714,
  754, 755, 820, 856, 875, 876, 878, 879,
])

export function moveEffectIsSupported(moveId: number, rules: CalculationRules): boolean {
  return rules !== "champions" || !CHAMPIONS_UNSUPPORTED_MOVES.has(moveId)
}
