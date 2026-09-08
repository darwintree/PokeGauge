import { calculate, Field, Move, Pokemon, toID } from "@smogon/calc"
import type { AbilityName, TypeName } from "@smogon/calc/dist/data/interface"

import type { MoveStatChange } from "@/lib/move/stat-change"
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
  currentHp?: number
  status?: "brn" | "psn"
  abilityOn?: boolean
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
  defenderIsSwitchingOut?: boolean
  gameType: "Singles" | "Doubles"
}

export type CalcContext = {
  attacker: CalcPokemonContext
  defender: CalcPokemonContext
  move: CalcMoveContext
  field: CalcFieldContext
}

/** These defenses depend on the HP entering a move use; calc handles their distinct hit rules. */
export function hasFullHpProtection(context: CalcContext): boolean {
  return ["Multiscale", "Shadow Shield", "Tera Shell"].includes(context.defender.abilityCalcName ?? "")
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
    ability: (context.abilityCalcName ?? "No Ability") as AbilityName,
    ...(context.currentHp === undefined ? {} : { curHP: context.currentHp }),
    ...(context.status ? { status: context.status } : {}),
    ...(context.abilityOn ? { abilityOn: true } : {}),
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

function calcMove(context: CalcMoveContext, hits?: number): Move {
  return new Move(CALC_GENERATION, context.calcMoveName, {
    isCrit: context.isCrit,
    ...(hits === undefined ? {} : { hits }),
    overrides: {
      willCrit: context.isCrit,
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

export type CalcHitMatrix = {
  rolls: readonly (readonly number[])[]
  /** Whether calc applies a resistance Berry on the first row. */
  consumesBerry: boolean
}

/** Project cumulative hit effects onto the initial calc context. */
export function applyCalcStatChanges(context: CalcContext, change: MoveStatChange, count: number): CalcContext {
  const pokemon = context[change.side]
  return { ...context, [change.side]: {
    ...pokemon,
    boosts: { ...pokemon.boosts,
      [change.stat]: Math.max(-6, Math.min(6, pokemon.boosts[change.stat] + count * change.stages)),
    },
  } }
}

/** Read calc's per-Hit results without collapsing them or summing equal-index rolls. */
export function calculateHitMatrix(
  context: CalcContext,
  hits: number,
  critical: boolean,
  berryConsumed: boolean,
  resistanceBerry: boolean,
): CalcHitMatrix {
  const defenderContext = berryConsumed && resistanceBerry
    ? { ...context.defender, itemCalcName: undefined }
    : context.defender
  const defender = calcPokemon(defenderContext)
  const result = calculate(
    CALC_GENERATION,
    calcPokemon(context.attacker),
    defender,
    calcMove({ ...context.move, isCrit: critical }, hits),
    calcField(context.field),
  )
  const damage = result.damage
  let rolls: readonly (readonly number[])[]
  if (typeof damage === "number") {
    rolls = Array.from({ length: hits }, () => Array(16).fill(damage))
  } else if (Array.isArray(damage[0])) {
    rolls = damage as number[][]
  } else if (hits === 2 && damage.length === 2) {
    rolls = (damage as number[]).map((value) => Array(16).fill(value))
  } else {
    rolls = [damage as number[]]
  }
  if (rolls.length !== hits) throw new Error(`Expected ${hits} Hit rows for ${context.move.calcMoveName}, got ${rolls.length}`)
  const consumesBerry = resistanceBerry && !berryConsumed &&
    Boolean(result.rawDesc.defenderItem) &&
    toID(result.rawDesc.defenderItem!) === toID(defender.item) &&
    rolls[0].some((damage) => damage > 0)
  return { rolls, consumesBerry }
}

function calcField(context: CalcFieldContext): Field {
  return new Field({
    gameType: context.gameType,
    ...(context.weather ? { weather: context.weather } : {}),
    ...(context.terrain ? { terrain: context.terrain } : {}),
    defenderSide: {
      ...(context.defenderScreen === "reflect" ? { isReflect: true } : {}),
      ...(context.defenderScreen === "light-screen" ? { isLightScreen: true } : {}),
      ...(context.defenderIsSwitchingOut ? { isSwitching: "out" as const } : {}),
    },
  })
}
