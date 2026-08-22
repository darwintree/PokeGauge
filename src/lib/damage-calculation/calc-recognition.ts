import { toID } from "@smogon/calc"

import { CALC_GENERATION } from "./calc-constants"

/** Whether @smogon/calc 0.11.0 knows the given calc-usable ability name. */
export function calcRecognizesAbility(calcAbilityName: string): boolean {
  return CALC_GENERATION.abilities.get(toID(calcAbilityName)) !== undefined
}

/** Whether @smogon/calc 0.11.0 knows the given calc-usable item name. */
export function calcRecognizesItem(calcItemName: string): boolean {
  return CALC_GENERATION.items.get(toID(calcItemName)) !== undefined
}
