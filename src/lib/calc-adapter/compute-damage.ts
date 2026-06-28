/**
 * Damage via @smogon/calc (Showdown formula).
 *
 * Product ruleset: Pokémon Champions · VGC doubles.
 * Engine mapping: Champions ruleset → Gen 9 (@smogon/calc GEN 9) until
 * Champions-native species/move data lands in the calc library.
 *
 * Battle format: VGC doubles uses Level 50 spreads (LEVEL constant below).
 *
 * @see https://github.com/smogon/damage-calc
 */

import { calculate, Move, Pokemon } from "@smogon/calc"

import type { MoveCategory } from "@/lib/catalog/types"

import { CALC_GEN, VGC_LEVEL } from "./calc-constants"
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

function runCalc(
  attackerSpecies: string,
  defenderSpecies: string,
  moveName: string,
  attackerStat: StatSetup,
  item: string | undefined,
  defender: DefenderSetup,
) {
  const attackerPokemon = new Pokemon(CALC_GEN, attackerSpecies, {
    level: VGC_LEVEL,
    nature: attackerStat.nature,
    evs: attackerStat.evs,
    item,
  })
  const defenderPokemon = new Pokemon(CALC_GEN, defenderSpecies, {
    level: VGC_LEVEL,
    nature: defender.nature,
    evs: defender.evs,
  })
  const move = new Move(CALC_GEN, moveName)
  const critMove = new Move(CALC_GEN, moveName, { isCrit: true })

  const hp = defenderPokemon.maxHP()
  const normal = calculate(CALC_GEN, attackerPokemon, defenderPokemon, move)
  const crit = calculate(CALC_GEN, attackerPokemon, defenderPokemon, critMove)

  return {
    hp,
    normalRolls: normal.damage as number[],
    critRolls: crit.damage as number[],
  }
}

export function computeDamage(
  attackerSpecies: string,
  defenderSpecies: string,
  moveName: string,
  attackerStat: StatSetup,
  item: string | undefined,
  defender: DefenderSetup,
): ComputedDamage {
  const { hp, normalRolls, critRolls } = runCalc(
    attackerSpecies,
    defenderSpecies,
    moveName,
    attackerStat,
    item,
    defender,
  )
  return summarize(normalRolls, critRolls, hp)
}

function mergeRangeResults(
  lowResult: ReturnType<typeof runCalc>,
  highResult: ReturnType<typeof runCalc>,
): ComputedDamage {
  const minDamage = Math.min(...lowResult.normalRolls)
  const maxDamage = Math.max(...highResult.normalRolls)
  const avgDamage =
    (lowResult.normalRolls.reduce((a, b) => a + b, 0) / 16 +
      highResult.normalRolls.reduce((a, b) => a + b, 0) / 16) /
    2
  const critMinDamage = Math.min(...lowResult.critRolls)
  const critMaxDamage = Math.max(...highResult.critRolls)
  const hp = lowResult.hp
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

/**
 * Offense stat-range row: envelope of (statMin × rollMin) … (statMax × rollMax).
 */
export function computeDamageForStatRange(
  attackerSpecies: string,
  defenderSpecies: string,
  moveName: string,
  statRange: StatRange,
  category: MoveCategory,
  item: string | undefined,
  defender: DefenderSetup,
): ComputedDamage {
  const low = statRange.min
  const high = Math.max(statRange.max, statRange.min)

  const lowSetup = closestOffenseSetupAtOrBelow(attackerSpecies, category, low)
  const highSetup = closestOffenseSetupAtOrAbove(attackerSpecies, category, high)

  const lowResult = runCalc(
    attackerSpecies,
    defenderSpecies,
    moveName,
    lowSetup,
    item,
    defender,
  )
  const highResult = runCalc(
    attackerSpecies,
    defenderSpecies,
    moveName,
    highSetup,
    item,
    defender,
  )

  return mergeRangeResults(lowResult, highResult)
}

/**
 * Defender range row: diagonal envelope (HP_min, Def_min) → (HP_max, Def_max).
 */
export function computeDamageForDefenderRange(
  attackerSpecies: string,
  defenderSpecies: string,
  moveName: string,
  attackerStat: StatSetup,
  category: MoveCategory,
  item: string | undefined,
  hpRange: StatRange,
  defRange: StatRange,
): ComputedDamage {
  const hpLow = hpRange.min
  const hpHigh = Math.max(hpRange.max, hpRange.min)
  const defLow = defRange.min
  const defHigh = Math.max(defRange.max, defRange.min)

  const lowSetup = closestDefenderSetupLow(
    defenderSpecies,
    category,
    hpLow,
    defLow,
  )
  const highSetup = closestDefenderSetupHigh(
    defenderSpecies,
    category,
    hpHigh,
    defHigh,
  )

  const lowResult = runCalc(
    attackerSpecies,
    defenderSpecies,
    moveName,
    attackerStat,
    item,
    lowSetup,
  )
  const highResult = runCalc(
    attackerSpecies,
    defenderSpecies,
    moveName,
    attackerStat,
    item,
    highSetup,
  )

  return mergeRangeResults(lowResult, highResult)
}

/**
 * Both tracks in range: offense endpoints × defender diagonal endpoints.
 */
export function computeDamageForCombinedRange(
  attackerSpecies: string,
  defenderSpecies: string,
  moveName: string,
  statRange: StatRange,
  category: MoveCategory,
  item: string | undefined,
  hpRange: StatRange,
  defRange: StatRange,
): ComputedDamage {
  const offLow = closestOffenseSetupAtOrBelow(
    attackerSpecies,
    category,
    statRange.min,
  )
  const offHigh = closestOffenseSetupAtOrAbove(
    attackerSpecies,
    category,
    Math.max(statRange.max, statRange.min),
  )
  const defLow = closestDefenderSetupLow(
    defenderSpecies,
    category,
    hpRange.min,
    defRange.min,
  )
  const defHigh = closestDefenderSetupHigh(
    defenderSpecies,
    category,
    Math.max(hpRange.max, hpRange.min),
    Math.max(defRange.max, defRange.min),
  )

  const lowResult = runCalc(
    attackerSpecies,
    defenderSpecies,
    moveName,
    offLow,
    item,
    defLow,
  )
  const highResult = runCalc(
    attackerSpecies,
    defenderSpecies,
    moveName,
    offHigh,
    item,
    defHigh,
  )

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
