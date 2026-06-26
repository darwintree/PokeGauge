/**
 * Damage via @smogon/calc (Showdown formula).
 * Product ruleset: Pokémon Champions · VGC doubles — engine GEN until Champions data lands.
 *
 * @see https://github.com/smogon/damage-calc
 */

import { calculate, Move, Pokemon } from "@smogon/calc"

const GEN = 9

export type StatSetup = {
  nature: string
  evs: Partial<Record<"hp" | "atk" | "def" | "spa" | "spd" | "spe", number>>
}

export type DefenderSetup = StatSetup

export type ComputedDamage = {
  defenderHp: number
  minDamage: number
  maxDamage: number
  avgDamage: number
  minPercent: number
  maxPercent: number
  avgPercent: number
  critMinDamage: number
  critMaxDamage: number
  critMinPercent: number
  critMaxPercent: number
  ohkoChance?: number
}

export type StatRange = {
  min: number
  max: number
}

export type AttackStatBounds = {
  min: number
  max: number
  snapPoints: Array<{ value: number; label: string }>
}

const OFFENSE_STAT = "atk" as const

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

export function getAttackStat(species: string, setup: StatSetup): number {
  const p = new Pokemon(GEN, species, {
    level: 100,
    nature: setup.nature,
    evs: setup.evs,
  })
  return p.stats[OFFENSE_STAT]
}

/** Brute-force legal spreads to find bounds and closest setup for a target stat */
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

function runCalc(
  attackerSpecies: string,
  defenderSpecies: string,
  moveName: string,
  attackerStat: StatSetup,
  item: string | undefined,
  defender: DefenderSetup,
) {
  const attackerPokemon = new Pokemon(GEN, attackerSpecies, {
    level: 100,
    nature: attackerStat.nature,
    evs: attackerStat.evs,
    item,
  })
  const defenderPokemon = new Pokemon(GEN, defenderSpecies, {
    level: 100,
    nature: defender.nature,
    evs: defender.evs,
  })
  const move = new Move(GEN, moveName)
  const critMove = new Move(GEN, moveName, { isCrit: true })

  const hp = defenderPokemon.maxHP()
  const normal = calculate(GEN, attackerPokemon, defenderPokemon, move)
  const crit = calculate(GEN, attackerPokemon, defenderPokemon, critMove)

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

/** Preset stat spreads */
export const ATTACKER_STAT_SETUPS: Record<string, StatSetup> = {
  "neutral-zero": { nature: "Serious", evs: {} },
  "neutral-max": { nature: "Serious", evs: { atk: 252 } },
  standard: { nature: "Jolly", evs: { atk: 252 } },
  extreme: { nature: "Adamant", evs: { atk: 252 } },
}

export const ATTACKER_ITEM_NAMES: Record<string, string | undefined> = {
  none: undefined,
  "life-orb": "Life Orb",
  "choice-band": "Choice Band",
}

export const DEFENDER_SETUPS: Record<string, DefenderSetup> = {
  "standard-bulk": { nature: "Impish", evs: { hp: 252, def: 252 } },
  "min-bulk": { nature: "Serious", evs: {} },
}

export const MOVE_NAMES: Record<string, string> = {
  earthquake: "Earthquake",
  "dragon-claw": "Dragon Claw",
  "stone-edge": "Stone Edge",
}
