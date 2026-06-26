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

import { ATTACKER_STAT_SETUPS } from "./presets"
import type {
  AttackStatBounds,
  ComputedDamage,
  DefenderSetup,
  StatRange,
  StatSetup,
} from "./types"

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

const OFFENSE_STAT = "atk" as const

const CANDIDATE_NATURES = [
  "Serious",
  "Adamant",
  "Jolly",
  "Modest",
  "Bold",
  "Lonely",
] as const

function enumerateSpreads(): StatSetup[] {
  const out: StatSetup[] = []
  for (const nature of CANDIDATE_NATURES) {
    for (let ev = 0; ev <= 252; ev += 4) {
      out.push({ nature, evs: { [OFFENSE_STAT]: ev } })
    }
  }
  return out
}

export function getAttackStat(species: string, setup: StatSetup): number {
  const p = new Pokemon(CALC_GEN, species, {
    level: VGC_LEVEL,
    nature: setup.nature,
    evs: setup.evs,
  })
  return p.stats[OFFENSE_STAT]
}

export function getAttackStatBounds(species: string): AttackStatBounds {
  const stats = enumerateSpreads().map((s) => getAttackStat(species, s))
  const min = Math.min(...stats)
  const max = Math.max(...stats)

  const snapIds = [
    { id: "neutral-zero", label: "无修正无努力" },
    { id: "neutral-max", label: "无修正满努力" },
    { id: "extreme", label: "+修正满努力" },
  ] as const

  const snapPoints = snapIds.map(({ id, label }) => ({
    value: getAttackStat(species, ATTACKER_STAT_SETUPS[id]),
    label,
  }))

  return { min, max, snapPoints }
}

export function defaultStatRange(species: string): StatRange {
  const bounds = getAttackStatBounds(species)
  const neutralMax =
    bounds.snapPoints.find((s) => s.label === "无修正满努力")?.value ?? bounds.min
  return { min: neutralMax, max: bounds.max }
}

function closestSetupAtOrBelow(species: string, target: number): StatSetup {
  let best: { setup: StatSetup; stat: number } | null = null
  for (const setup of enumerateSpreads()) {
    const stat = getAttackStat(species, setup)
    if (stat <= target && (!best || stat > best.stat)) {
      best = { setup, stat }
    }
  }
  return best?.setup ?? ATTACKER_STAT_SETUPS["neutral-zero"]
}

function closestSetupAtOrAbove(species: string, target: number): StatSetup {
  let best: { setup: StatSetup; stat: number } | null = null
  for (const setup of enumerateSpreads()) {
    const stat = getAttackStat(species, setup)
    if (stat >= target && (!best || stat < best.stat)) {
      best = { setup, stat }
    }
  }
  return best?.setup ?? ATTACKER_STAT_SETUPS.extreme
}

/**
 * Stat-range row: envelope of (statMin × rollMin) … (statMax × rollMax),
 * crit whiskers use the same stat endpoints.
 */
export function computeDamageForStatRange(
  attackerSpecies: string,
  defenderSpecies: string,
  moveName: string,
  statRange: StatRange,
  item: string | undefined,
  defender: DefenderSetup,
): ComputedDamage {
  const low = statRange.min
  const high = Math.max(statRange.max, statRange.min)

  const lowSetup = closestSetupAtOrBelow(attackerSpecies, low)
  const highSetup = closestSetupAtOrAbove(attackerSpecies, high)

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
