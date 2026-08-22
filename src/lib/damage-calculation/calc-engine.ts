import { calculate, Field, Move, Pokemon, toID } from "@smogon/calc"
import type { TypeName } from "@smogon/calc/dist/data/interface"

import type { PokemonType } from "@/lib/pokemon"

import { CALC_GENERATION, VGC_LEVEL } from "./calc-constants"

/** Stat values (final, after nature/EVs/SP) fed to the calc engine. */
export type CalcExactStats = {
  hp: number
  atk: number
  def: number
  spa: number
  spd: number
  spe: number
}

/** Stage boosts per non-HP stat, keyed like calc's StatsTable. */
export type CalcBoosts = {
  atk: number
  def: number
  spa: number
  spd: number
  spe: number
}

export type CalcPokemonContext = {
  calcSpeciesName: string
  /** Calc-usable ability name; omit when the ability is not recognized by calc. */
  abilityCalcName?: string
  /** Calc-usable item name; omit when the item is not recognized by calc. */
  itemCalcName?: string
  exactStats: CalcExactStats
  boosts: CalcBoosts
}

export type CalcMoveContext = {
  calcMoveName: string
  /** User-edited power (overrides the calc move's base power). */
  powerOverride?: number
  /** Effective Scenario Move Type when it differs from the calc move's type. */
  typeOverride?: PokemonType
  isCrit: boolean
  /** Spread target; "normal" when the spread toggle is off. */
  target: "allAdjacent" | "allAdjacentFoes" | "normal"
}

export type CalcFieldContext = {
  weather?: "Sun" | "Rain" | "Sand" | "Snow"
  terrain?: "Electric" | "Grassy" | "Psychic" | "Misty"
  defenderScreen?: "reflect" | "light-screen"
  gameType: "Singles" | "Doubles"
}

export type CalcContext = {
  attacker: CalcPokemonContext
  defender: CalcPokemonContext
  move: CalcMoveContext
  field: CalcFieldContext
}

/**
 * @smogon/calc at level 50 with IV 31, EV 0, Serious nature computes
 * non-HP stat = base + 20 and HP = base + 75. Inverting lets the adapter feed
 * exact product stat values while staying valid through calc's internal clone().
 */
function invertedBaseStats(stats: CalcExactStats) {
  return {
    hp: stats.hp - 75,
    atk: stats.atk - 20,
    def: stats.def - 20,
    spa: stats.spa - 20,
    spd: stats.spd - 20,
    spe: stats.spe - 20,
  }
}

function calcPokemon(context: CalcPokemonContext): Pokemon {
  return new Pokemon(CALC_GENERATION, context.calcSpeciesName, {
    level: VGC_LEVEL,
    ...(context.abilityCalcName ? { ability: context.abilityCalcName } : {}),
    ...(context.itemCalcName
      ? {
          item: CALC_GENERATION.items.get(toID(context.itemCalcName))?.name
            ?? context.itemCalcName,
        }
      : {}),
    boosts: { ...context.boosts },
    overrides: { baseStats: invertedBaseStats(context.exactStats) },
  })
}

function calcMove(context: CalcMoveContext): Move {
  return new Move(CALC_GENERATION, context.calcMoveName, {
    isCrit: context.isCrit,
    overrides: {
      ...(context.powerOverride === undefined ? {} : { basePower: context.powerOverride }),
      ...(context.typeOverride === undefined
        ? {}
        : {
            type: (context.typeOverride[0].toUpperCase() + context.typeOverride.slice(1)) as TypeName,
          }),
      target: context.target,
    },
  })
}

function calcField(context: CalcFieldContext): Field {
  return new Field({
    gameType: context.gameType,
    ...(context.weather ? { weather: context.weather } : {}),
    ...(context.terrain ? { terrain: context.terrain } : {}),
    defenderSide: {
      ...(context.defenderScreen === "reflect" ? { isReflect: true } : {}),
      ...(context.defenderScreen === "light-screen" ? { isLightScreen: true } : {}),
    },
  })
}

/** Normalize a calc damage result into the 16-roll array for one hit. */
export function rollsFromCalcDamage(
  damage: number | number[] | [number, number] | number[][],
): number[] {
  if (typeof damage === "number") return Array(16).fill(damage)
  if (damage.length === 0) return Array(16).fill(0)
  if (Array.isArray(damage[0])) {
    // Multi-hit matrix: use the first hit's rolls (single-hit product contract).
    return (damage[0] as number[]).slice()
  }
  return (damage as number[]).slice()
}

/** Compute the 16 normal rolls via @smogon/calc. */
export function calculateNormalRolls(context: CalcContext): number[] {
  const result = calculate(
    CALC_GENERATION,
    calcPokemon(context.attacker),
    calcPokemon(context.defender),
    calcMove({ ...context.move, isCrit: false }),
    calcField(context.field),
  )
  return rollsFromCalcDamage(result.damage)
}

/** Compute the 16 critical rolls via @smogon/calc. */
export function calculateCriticalRolls(context: CalcContext): number[] {
  const result = calculate(
    CALC_GENERATION,
    calcPokemon(context.attacker),
    calcPokemon(context.defender),
    calcMove({ ...context.move, isCrit: true }),
    calcField(context.field),
  )
  return rollsFromCalcDamage(result.damage)
}
