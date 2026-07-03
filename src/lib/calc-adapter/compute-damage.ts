import type { MoveCategory } from "@/lib/catalog/types"
import { typeFromBoostId } from "@/lib/held-item"
import { POKEMON_TYPES, type PokemonType } from "@/lib/pokemon/types"
import { getBattlePokemonByCalcName, getMoveByCalcName } from "@/lib/resources"

import { calculateDamageRolls, type DamageModifierInput } from "./damage-kernel"
import { defenderStatValues, offenseStatValue } from "./local-stats"
import {
  closestDefenderSetupHigh,
  closestDefenderSetupLow,
  closestOffenseSetupAtOrAbove,
  closestOffenseSetupAtOrBelow,
  getOffenseStat,
  getOffenseStatBounds,
} from "./stat-bounds"
import type {
  ComputedDamage,
  DefenderSetup,
  StatRange,
  StatSetup,
} from "./types"

export { CALC_GEN, VGC_LEVEL } from "./calc-constants"
export {
  getDefenderDefBounds,
  getDefenderDefStat,
  getDefenderHp,
  getDefenderHpBounds,
  getOffenseStat,
  getOffenseStatBounds,
  nearestDefenderSetupForValues,
  nearestOffenseSetupForStat,
  snapToAchievableDefenseValues,
  snapToAchievableOffenseStat,
  warmDefenderSpreadCache,
} from "./stat-bounds"
export {
  defaultDefenderDefRange,
  defaultDefenderHpRange,
  defaultOffenseStatRange,
  defaultStatRange,
  defenderDefRangeFromPresets,
  defenderHpRangeFromPresets,
  offenseRangeFromPresets,
  clampStat,
  sameStatRange,
  snapToAnchors,
} from "./stat-range"

function pct(damage: number, hp: number) {
  return (damage / hp) * 100
}

function summarize(
  normalRolls: number[],
  critRolls: number[],
  defenderHp: number,
): ComputedDamage {
  const minDamage = Math.min(...normalRolls)
  const maxDamage = Math.max(...normalRolls)
  const avgDamage = normalRolls.reduce((a, b) => a + b, 0) / normalRolls.length
  const critMinDamage = Math.min(...critRolls)
  const critMaxDamage = Math.max(...critRolls)
  const ohkoRolls = normalRolls.filter((d) => d >= defenderHp).length

  return {
    defenderHp,
    minDamage,
    maxDamage,
    avgDamage,
    minPercent: pct(minDamage, defenderHp),
    maxPercent: pct(maxDamage, defenderHp),
    avgPercent: pct(avgDamage, defenderHp),
    critMinDamage,
    critMaxDamage,
    critMinPercent: pct(critMinDamage, defenderHp),
    critMaxPercent: pct(critMaxDamage, defenderHp),
    ohkoChance: ohkoRolls > 0 ? (ohkoRolls / 16) * 100 : undefined,
  }
}

function compiledItemModifiers(
  itemId: string | undefined,
  category: MoveCategory,
  moveType: PokemonType,
): DamageModifierInput {
  if (itemId === "life-orb") return { finalMultiplier: 5324 / 4096 }
  if (itemId === "choice-band" && category === "physical") return { attackMultiplier: 1.5 }
  if (itemId === "choice-specs" && category === "special") return { attackMultiplier: 1.5 }
  const boostType = itemId ? typeFromBoostId(itemId) : undefined
  if (boostType && boostType === moveType) return { powerMultiplier: 1.2 }
  return {}
}

function isPokemonType(type: string): type is PokemonType {
  return POKEMON_TYPES.includes(type as PokemonType)
}

function runLocalDamage(
  attackerSpecies: string,
  defenderSpecies: string,
  moveName: string,
  attackerStat: StatSetup,
  itemId: string | undefined,
  defender: DefenderSetup,
) {
  const attacker = getBattlePokemonByCalcName(attackerSpecies)
  const defenderPokemon = getBattlePokemonByCalcName(defenderSpecies)
  const move = getMoveByCalcName(moveName)
  if (!attacker) throw new Error(`Unknown generated attacker: ${attackerSpecies}`)
  if (!defenderPokemon) throw new Error(`Unknown generated defender: ${defenderSpecies}`)
  if (!move || move.power == null || (move.category !== "physical" && move.category !== "special")) {
    throw new Error(`Unsupported generated move for damage calculation: ${moveName}`)
  }
  if (!isPokemonType(move.type)) throw new Error(`Unsupported move type for damage calculation: ${move.type}`)

  const defenderStats = defenderStatValues(defenderSpecies, move.category, defender)
  const itemModifiers = compiledItemModifiers(itemId, move.category, move.type)
  return calculateDamageRolls({
    attack: offenseStatValue(attackerSpecies, move.category, attackerStat),
    defense: defenderStats.def,
    defenderHp: defenderStats.hp,
    attackerTypes: attacker.types,
    defenderTypes: defenderPokemon.types,
    moveType: move.type,
    movePower: move.power,
    category: move.category,
    modifiers: {
      ...itemModifiers,
      spread: move.isSpread,
    },
  })
}

export function computeDamage(
  attackerSpecies: string,
  defenderSpecies: string,
  moveName: string,
  attackerStat: StatSetup,
  itemId: string | undefined,
  defender: DefenderSetup,
): ComputedDamage {
  const { defenderHp, normalRolls, critRolls } = runLocalDamage(
    attackerSpecies,
    defenderSpecies,
    moveName,
    attackerStat,
    itemId,
    defender,
  )
  return summarize(normalRolls, critRolls, defenderHp)
}

function mergeRangeResults(
  lowResult: ReturnType<typeof runLocalDamage>,
  highResult: ReturnType<typeof runLocalDamage>,
): ComputedDamage {
  const minDamage = Math.min(...lowResult.normalRolls)
  const maxDamage = Math.max(...highResult.normalRolls)
  const avgDamage =
    (lowResult.normalRolls.reduce((a, b) => a + b, 0) / 16 +
      highResult.normalRolls.reduce((a, b) => a + b, 0) / 16) /
    2
  const critMinDamage = Math.min(...lowResult.critRolls)
  const critMaxDamage = Math.max(...highResult.critRolls)
  const hp = lowResult.defenderHp
  const ohkoHigh = highResult.normalRolls.filter((d) => d >= hp).length

  return {
    defenderHp: hp,
    minDamage,
    maxDamage,
    avgDamage,
    minPercent: pct(minDamage, hp),
    maxPercent: pct(maxDamage, hp),
    avgPercent: pct(avgDamage, hp),
    critMinDamage,
    critMaxDamage,
    critMinPercent: pct(critMinDamage, hp),
    critMaxPercent: pct(critMaxDamage, hp),
    ohkoChance: ohkoHigh > 0 ? (ohkoHigh / 16) * 100 : undefined,
  }
}

export function computeDamageForStatRange(
  attackerSpecies: string,
  defenderSpecies: string,
  moveName: string,
  statRange: StatRange,
  category: MoveCategory,
  itemId: string | undefined,
  defender: DefenderSetup,
): ComputedDamage {
  const low = statRange.min
  const high = Math.max(statRange.max, statRange.min)
  const lowSetup = closestOffenseSetupAtOrBelow(attackerSpecies, category, low)
  const highSetup = closestOffenseSetupAtOrAbove(attackerSpecies, category, high)
  const lowResult = runLocalDamage(attackerSpecies, defenderSpecies, moveName, lowSetup, itemId, defender)
  const highResult = runLocalDamage(attackerSpecies, defenderSpecies, moveName, highSetup, itemId, defender)
  return mergeRangeResults(lowResult, highResult)
}

export function computeDamageForDefenderRange(
  attackerSpecies: string,
  defenderSpecies: string,
  moveName: string,
  attackerStat: StatSetup,
  category: MoveCategory,
  itemId: string | undefined,
  hpRange: StatRange,
  defRange: StatRange,
): ComputedDamage {
  const lowSetup = closestDefenderSetupLow(defenderSpecies, category, hpRange.min, defRange.min)
  const highSetup = closestDefenderSetupHigh(
    defenderSpecies,
    category,
    Math.max(hpRange.max, hpRange.min),
    Math.max(defRange.max, defRange.min),
  )
  const lowResult = runLocalDamage(attackerSpecies, defenderSpecies, moveName, attackerStat, itemId, lowSetup)
  const highResult = runLocalDamage(attackerSpecies, defenderSpecies, moveName, attackerStat, itemId, highSetup)
  return mergeRangeResults(lowResult, highResult)
}

export function computeDamageForCombinedRange(
  attackerSpecies: string,
  defenderSpecies: string,
  moveName: string,
  statRange: StatRange,
  category: MoveCategory,
  itemId: string | undefined,
  hpRange: StatRange,
  defRange: StatRange,
): ComputedDamage {
  const offLow = closestOffenseSetupAtOrBelow(attackerSpecies, category, statRange.min)
  const offHigh = closestOffenseSetupAtOrAbove(attackerSpecies, category, Math.max(statRange.max, statRange.min))
  const defLow = closestDefenderSetupLow(defenderSpecies, category, hpRange.min, defRange.min)
  const defHigh = closestDefenderSetupHigh(
    defenderSpecies,
    category,
    Math.max(hpRange.max, hpRange.min),
    Math.max(defRange.max, defRange.min),
  )
  const lowResult = runLocalDamage(attackerSpecies, defenderSpecies, moveName, offLow, itemId, defLow)
  const highResult = runLocalDamage(attackerSpecies, defenderSpecies, moveName, offHigh, itemId, defHigh)
  return mergeRangeResults(lowResult, highResult)
}

/** @deprecated use getOffenseStat */
export function getAttackStat(species: string, setup: StatSetup): number {
  return getOffenseStat(species, "physical", setup)
}

/** @deprecated use getOffenseStatBounds */
export function getAttackStatBounds(species: string) {
  return getOffenseStatBounds(species, "physical")
}
