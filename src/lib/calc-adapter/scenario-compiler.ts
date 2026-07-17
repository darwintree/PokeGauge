import type { MoveCategory } from "@/lib/catalog/types"
import { typeFromBoostId } from "@/lib/held-item"
import {
  type CriticalStage,
  type MoveSnapshot,
  normalizeSnapshotAccuracy,
  normalizeSnapshotPower,
} from "@/lib/move-snapshot"
import {
  isMoveExplicitlyUnsupported,
  moveBreaksScreensBeforeDamage,
  resolveReviewedMoveType,
  reviewedVariablePowerDefault,
} from "@/lib/move-semantics"
import { POKEMON_TYPES, type PokemonType } from "@/lib/pokemon/types"
import {
  getBattlePokemonById,
  getMoveById,
  type BattlePokemonId,
} from "@/lib/resources"

import { ADAPTABILITY_ABILITY_ID } from "./ability"
import {
  type CompiledDamageInput,
  type DamageFormulaBranch,
  chainModifiers,
  NEUTRAL_MODIFIER,
  typeEffectiveness,
} from "./damage-kernel"
import {
  defenderStatValuesForPokemon,
  offenseStatValueForPokemon,
} from "./local-stats"
import type {
  DefenderSetup,
  ProbabilityMode,
  StatSetup,
  StatStage,
} from "./types"
import { compileWeatherEffect, type Weather } from "./weather"

export type RawScenarioPoint = {
  offense: StatSetup
  defense: DefenderSetup
}

export type RawScenario = {
  snapshot: MoveSnapshot
  attackerId: BattlePokemonId
  defenderId: BattlePokemonId
  attackerItemId: string
  attackerAbilityId: number
  defenderAbilityId: number
  attackerStage: StatStage
  defenderStage: StatStage
  weather: Weather
  probabilityMode: ProbabilityMode
  sourceOptionIds?: {
    attackerStat: string
    defenderStat: string
  }
  lowOutcome: RawScenarioPoint
  highOutcome?: RawScenarioPoint
}

export type ProbabilityInput = {
  hitProbability: number
  criticalHitProbability: number
}

export type KoInput = {
  hitCounts: readonly [1, 2]
}

export type SourceState = "effective" | "inactive" | "unsupported" | "neutral"

export type ScenarioTrack =
  | "attacker-stat"
  | "attacker-stage"
  | "held-item"
  | "attacker-ability"
  | "weather"
  | "defender-stat"
  | "defender-stage"
  | "defender-ability"

export type ScenarioSource = {
  track: ScenarioTrack
  optionId: string
  state: SourceState
}

export type CalculableScenario = {
  kind: "calculable"
  snapshotId: string
  move: {
    type: PokemonType
    breaksScreensBeforeDamage: boolean
  }
  calculation: CompiledDamageInput
  probability: ProbabilityInput
  ko: KoInput
  sources: ScenarioSource[]
}

export type UnavailableReason =
  | "unconfigured-move"
  | "unsupported-move"
  | "weather-type-change"

export type UnavailableScenario = {
  kind: "unavailable"
  snapshotId: string
  reason: UnavailableReason
  missingFields?: Array<"power" | "accuracy">
  sources: ScenarioSource[]
}

export type CompilerOutcome = CalculableScenario | UnavailableScenario

export function calculationIdentity(outcome: CalculableScenario): string {
  return JSON.stringify([
    outcome.snapshotId,
    outcome.calculation,
    outcome.probability,
    outcome.ko,
  ])
}

function isMoveCategory(value: string): value is MoveCategory {
  return value === "physical" || value === "special"
}

function isPokemonType(value: string): value is PokemonType {
  return POKEMON_TYPES.includes(value as PokemonType)
}

function itemModifiers(
  itemId: string,
  category: MoveCategory,
  moveType: PokemonType,
): {
  attack: number
  basePower: number
  final: number
  source: ScenarioSource
} {
  const neutral = {
    attack: NEUTRAL_MODIFIER,
    basePower: NEUTRAL_MODIFIER,
    final: NEUTRAL_MODIFIER,
  }

  if (itemId === "none") {
    return {
      ...neutral,
      source: { track: "held-item", optionId: itemId, state: "neutral" },
    }
  }
  if (itemId === "life-orb") {
    return {
      ...neutral,
      final: 5324,
      source: { track: "held-item", optionId: itemId, state: "effective" },
    }
  }
  if (
    (itemId === "choice-band" && category === "physical") ||
    (itemId === "choice-specs" && category === "special")
  ) {
    return {
      ...neutral,
      attack: 6144,
      source: { track: "held-item", optionId: itemId, state: "effective" },
    }
  }

  const boostType = typeFromBoostId(itemId)
  if (boostType) {
    const effective = boostType === moveType
    return {
      ...neutral,
      basePower: effective ? 4915 : NEUTRAL_MODIFIER,
      source: {
        track: "held-item",
        optionId: itemId,
        state: effective ? "effective" : "inactive",
      },
    }
  }

  return {
    ...neutral,
    source: { track: "held-item", optionId: itemId, state: "inactive" },
  }
}

function criticalProbability(stage: CriticalStage): number {
  return [1 / 24, 1 / 8, 1 / 2, 1][stage]
}

function compileProbability(
  snapshot: MoveSnapshot,
  mode: ProbabilityMode,
  accuracy: number,
  weatherAccuracy?: number | "always-hits",
): ProbabilityInput {
  if (mode === "rolls") {
    return {
      hitProbability: 1,
      criticalHitProbability: snapshot.criticalStage === 3 ? 1 : 0,
    }
  }
  return {
    hitProbability: weatherAccuracy === "always-hits"
      ? 1
      : weatherAccuracy !== undefined
        ? weatherAccuracy / 100
        : snapshot.alwaysHits
          ? 1
          : accuracy / 100,
    criticalHitProbability: criticalProbability(snapshot.criticalStage),
  }
}

type BranchContext = {
  attacker: NonNullable<ReturnType<typeof getBattlePokemonById>>
  defender: NonNullable<ReturnType<typeof getBattlePokemonById>>
  category: MoveCategory
  power: number
  basePowerModifier: number
  attackModifier: number
  finalModifier: number
  spread: boolean
  weatherModifier: number
  stabModifier: number
  typeEffectivenessModifier: number
  attackerStage: StatStage
  defenderStage: StatStage
}

function compileBranch(
  point: RawScenarioPoint,
  context: BranchContext,
  critical: boolean,
): DamageFormulaBranch {
  const defender = defenderStatValuesForPokemon(
    context.defender,
    context.category,
    point.defense,
  )
  return {
    power: context.power,
    basePowerModifier: context.basePowerModifier,
    attack: offenseStatValueForPokemon(
      context.attacker,
      context.category,
      point.offense,
    ),
    attackStage: critical
      ? Math.max(context.attackerStage, 0)
      : context.attackerStage,
    attackModifier: context.attackModifier,
    defense: defender.def,
    defenseStage: critical
      ? Math.min(context.defenderStage, 0)
      : context.defenderStage,
    defenseModifier: NEUTRAL_MODIFIER,
    spreadModifier: context.spread ? 3072 : NEUTRAL_MODIFIER,
    weatherModifier: context.weatherModifier,
    criticalModifier: critical ? 6144 : NEUTRAL_MODIFIER,
    stabModifier: context.stabModifier,
    typeEffectivenessModifier: context.typeEffectivenessModifier,
    finalModifier: context.finalModifier,
  }
}

export function compileScenario(raw: RawScenario): CompilerOutcome {
  const attacker = getBattlePokemonById(raw.attackerId)
  const defender = getBattlePokemonById(raw.defenderId)
  const move = getMoveById(raw.snapshot.moveId)
  const power = normalizeSnapshotPower(raw.snapshot.power)
  const accuracy = normalizeSnapshotAccuracy(raw.snapshot.accuracy)
  const moveType = move && isPokemonType(move.type)
    ? resolveReviewedMoveType(move.id, raw.attackerId, move.type, attacker?.types)
    : undefined
  const item = move && isMoveCategory(move.category) && moveType
    ? itemModifiers(raw.attackerItemId, move.category, moveType)
    : itemModifiers(raw.attackerItemId, "physical", "normal")
  const weather = compileWeatherEffect(
    raw.snapshot.moveId,
    moveType,
    raw.weather,
    raw.probabilityMode,
  )
  const criticalOnly = raw.snapshot.criticalStage === 3
  const attackerStageState: SourceState = raw.attackerStage === 0
    ? "neutral"
    : criticalOnly && raw.attackerStage < 0
      ? "inactive"
      : "effective"
  const defenderStageState: SourceState = raw.defenderStage === 0
    ? "neutral"
    : criticalOnly && raw.defenderStage > 0
      ? "inactive"
      : "effective"
  const hasOriginalTypeStab = Boolean(
    attacker && moveType && attacker.types.includes(moveType),
  )
  const attackerHasAdaptability =
    raw.attackerAbilityId === ADAPTABILITY_ABILITY_ID
  const attackerAbilityState: SourceState = attackerHasAdaptability
    ? hasOriginalTypeStab ? "effective" : "inactive"
    : "unsupported"
  const defenderAbilityState: SourceState =
    raw.defenderAbilityId === ADAPTABILITY_ABILITY_ID
      ? "inactive"
      : "unsupported"
  const sources: ScenarioSource[] = [
    ...(raw.sourceOptionIds
      ? [{
          track: "attacker-stat" as const,
          optionId: raw.sourceOptionIds.attackerStat,
          state: "effective" as const,
        }]
      : []),
    {
      track: "attacker-stage",
      optionId: String(raw.attackerStage),
      state: attackerStageState,
    },
    item.source,
    {
      track: "attacker-ability",
      optionId: String(raw.attackerAbilityId),
      state: attackerAbilityState,
    },
    {
      track: "weather",
      optionId: raw.weather,
      state: weather.state,
    },
    ...(raw.sourceOptionIds
      ? [{
          track: "defender-stat" as const,
          optionId: raw.sourceOptionIds.defenderStat,
          state: "effective" as const,
        }]
      : []),
    {
      track: "defender-stage",
      optionId: String(raw.defenderStage),
      state: defenderStageState,
    },
    {
      track: "defender-ability",
      optionId: String(raw.defenderAbilityId),
      state: defenderAbilityState,
    },
  ]
  const missingFields: Array<"power" | "accuracy"> = []
  if (power === 0) missingFields.push("power")
  if (accuracy === 0 && !raw.snapshot.alwaysHits) missingFields.push("accuracy")
  if (missingFields.length > 0) {
    return {
      kind: "unavailable",
      snapshotId: raw.snapshot.id,
      reason: "unconfigured-move",
      missingFields,
      sources,
    }
  }
  if (weather.unavailable) {
    return {
      kind: "unavailable",
      snapshotId: raw.snapshot.id,
      reason: weather.unavailable,
      sources,
    }
  }
  if (
    !attacker ||
    !defender ||
    !move ||
    !isMoveCategory(move.category) ||
    !moveType ||
    isMoveExplicitlyUnsupported(move.id) ||
    (move.power === null && reviewedVariablePowerDefault(move.id) === undefined)
  ) {
    return {
      kind: "unavailable",
      snapshotId: raw.snapshot.id,
      reason: "unsupported-move",
      sources,
    }
  }

  const category = move.category
  const effectiveness = typeEffectiveness(moveType, defender.types)
  const context: BranchContext = {
    attacker,
    defender,
    category,
    power,
    basePowerModifier: chainModifiers([
      item.basePower,
      weather.basePowerModifier,
    ]),
    attackModifier: item.attack,
    finalModifier: item.final,
    spread: move.isSpread && raw.snapshot.spreadEligible && raw.snapshot.spread,
    stabModifier: hasOriginalTypeStab
      ? attackerHasAdaptability ? 8192 : 6144
      : NEUTRAL_MODIFIER,
    typeEffectivenessModifier: Math.round(effectiveness * NEUTRAL_MODIFIER),
    attackerStage: raw.attackerStage,
    defenderStage: raw.defenderStage,
    weatherModifier: weather.damageModifier,
  }

  const compilePoint = (point: RawScenarioPoint) => {
    const defenderStats = defenderStatValuesForPokemon(
      defender,
      category,
      point.defense,
    )
    return {
      defenderHp: defenderStats.hp,
      ...(raw.snapshot.criticalStage < 3
        ? { normal: compileBranch(point, context, false) }
        : {}),
      critical: compileBranch(point, context, true),
    }
  }

  return {
    kind: "calculable",
    snapshotId: raw.snapshot.id,
    move: {
      type: moveType,
      breaksScreensBeforeDamage: moveBreaksScreensBeforeDamage(move.id),
    },
    calculation: {
      low: compilePoint(raw.lowOutcome),
      ...(raw.highOutcome ? { high: compilePoint(raw.highOutcome) } : {}),
    },
    probability: compileProbability(
      raw.snapshot,
      raw.probabilityMode,
      accuracy,
      weather.accuracy,
    ),
    ko: { hitCounts: [1, 2] },
    sources,
  }
}
