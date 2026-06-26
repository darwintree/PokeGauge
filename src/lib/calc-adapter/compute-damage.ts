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

import type { ComputedDamage, DefenderSetup, StatSetup } from "./types"

/** Gen 9 engine until Champions-native data exists */
export const CALC_GEN = 9

/** VGC Level 50 — tournament standard for doubles */
export const VGC_LEVEL = 50

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
