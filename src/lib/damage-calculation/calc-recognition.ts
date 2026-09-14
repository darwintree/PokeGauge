import { toID } from "@smogon/calc"

import type { CalculationRules } from "@/lib/calculation-rules"
import { calcGeneration } from "./calc-constants"

/** Whether @smogon/calc knows the given calc-usable ability name. */
export function calcRecognizesAbility(calcAbilityName: string, rules: CalculationRules = "gen9"): boolean {
  return calcGeneration(rules).abilities.get(toID(calcAbilityName)) !== undefined
}

/** Whether @smogon/calc knows the given calc-usable item name. */
export function calcRecognizesItem(calcItemName: string, rules: CalculationRules = "gen9"): boolean {
  return calcGeneration(rules).items.get(toID(calcItemName)) !== undefined
}
