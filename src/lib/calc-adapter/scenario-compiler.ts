import type { MoveCategory } from "@/lib/catalog/types"
import type { HeldItemId } from "@/lib/held-item"
import {
  FROZEN_HELD_ITEM_BY_ID,
  type FrozenHeldItem,
  type HeldItemBattleStat,
  type HeldItemGate,
} from "@/lib/held-item/inventory"
import { isMegaStone, UNKNOWN_ABILITY_ID } from "@/lib/mega"
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
  type NormalizedBattlePokemon,
} from "@/lib/resources"

import { ADAPTABILITY_ABILITY_ID } from "./ability"
import {
  type CompiledDamageInput,
  type DamageFormulaBranch,
  applyModifier,
  chainModifiers,
  NEUTRAL_MODIFIER,
  typeEffectiveness,
} from "./damage-kernel"
import { compileScreenEffect, type Screen } from "./screen"
import {
  compileTerrainEffect,
  isGrounded,
  type Terrain,
} from "./terrain"
import type { ProbabilityMode, StatStage } from "./types"
import { compileWeatherEffect, type Weather } from "./weather"

export type RawScenarioPoint = {
  offense: number
  defense: {
    hp: number
    def: number
  }
}

export type RawScenario = {
  snapshot: MoveSnapshot
  attackerId: BattlePokemonId
  defenderId: BattlePokemonId
  attackerItemId: HeldItemId
  defenderItemId?: HeldItemId
  attackerAbilityId: number
  defenderAbilityId: number
  attackerStage: StatStage
  defenderStage: StatStage
  weather: Weather
  terrain: Terrain
  screen: Screen
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
  | "defender-held-item"
  | "attacker-ability"
  | "weather"
  | "terrain"
  | "defender-stat"
  | "defender-stage"
  | "defender-ability"
  | "screen"

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
  moveMechanics: MoveMechanics
  ko: KoInput
  sources: ScenarioSource[]
}

export type MoveMechanics = {
  basePower: number
  effectivePower: number
  accuracy: number | "always-hits"
  modifiers: {
    item: number
    weather: number
    terrain: number
    spread: number
    stab: number
    typeEffectiveness: number
    screen: number
  }
}

export type UnavailableReason =
  | "unconfigured-move"
  | "unsupported-move"
  | "weather-type-change"
  | "terrain-required"
  | "terrain-type-change"

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

type ItemSide = "attacker" | "defender"

type ItemGateContext = {
  holder: NormalizedBattlePokemon | undefined
  category: MoveCategory | undefined
  moveType: PokemonType | undefined
  effectiveness: number
  weather: Weather
  numericAccuracy: boolean
}

type CompiledHeldItem = {
  descriptor?: FrozenHeldItem
  basePowerModifier: number
  attackModifier: number
  defenseModifier: number
  finalModifier: number
  accuracyModifier: number
  criticalStage: number
  suppressOrdinaryWeatherDamage: boolean
  source: ScenarioSource
}

function itemTrack(side: ItemSide): "held-item" | "defender-held-item" {
  return side === "attacker" ? "held-item" : "defender-held-item"
}

function gateMatches(gate: HeldItemGate, context: ItemGateContext): boolean {
  switch (gate.kind) {
    case "damaging-move":
      return context.category !== undefined
    case "move-category":
      return context.category === gate.category
    case "move-type":
      return context.moveType !== undefined && gate.types.includes(context.moveType)
    case "super-effective":
      return context.effectiveness > 1
    case "holder-species":
      return context.holder !== undefined && gate.speciesIds.includes(context.holder.speciesId)
    case "holder-identity":
      return context.holder !== undefined && gate.battlePokemonIds.includes(context.holder.id)
    case "eviolite-eligible":
      return context.holder?.evioliteEligible === true
    case "numeric-accuracy":
      return context.numericAccuracy
    case "weather":
      return gate.weathers.includes(context.weather as "sun" | "rain")
  }
}

function battleStatFor(
  side: ItemSide,
  category: MoveCategory | undefined,
): HeldItemBattleStat | undefined {
  if (category === undefined) return undefined
  if (side === "attacker") {
    return category === "physical" ? "attack" : "special-attack"
  }
  return category === "physical" ? "defense" : "special-defense"
}

function compileHeldItem(
  itemId: HeldItemId,
  side: ItemSide,
  context: ItemGateContext,
): CompiledHeldItem {
  const track = itemTrack(side)
  const neutral = {
    basePowerModifier: NEUTRAL_MODIFIER,
    attackModifier: NEUTRAL_MODIFIER,
    defenseModifier: NEUTRAL_MODIFIER,
    finalModifier: NEUTRAL_MODIFIER,
    accuracyModifier: NEUTRAL_MODIFIER,
    criticalStage: 0,
    suppressOrdinaryWeatherDamage: false,
  }
  if (itemId === "none" || isMegaStone(itemId)) {
    return {
      ...neutral,
      source: { track, optionId: String(itemId), state: "neutral" },
    }
  }

  const descriptor = typeof itemId === "number"
    ? FROZEN_HELD_ITEM_BY_ID.get(itemId)
    : undefined
  const poolMatches = descriptor !== undefined &&
    (descriptor.pool === side || descriptor.pool === "lock")
  const gatesMatch = poolMatches &&
    !(side === "defender" && descriptor.pool === "lock") &&
    descriptor.effect.gates.every((gate) => gateMatches(gate, context))
  if (!descriptor || !gatesMatch) {
    return {
      ...neutral,
      ...(descriptor ? { descriptor } : {}),
      source: { track, optionId: String(itemId), state: "inactive" },
    }
  }

  const effect = descriptor.effect
  let effective = true
  const compiled: CompiledHeldItem = {
    ...neutral,
    descriptor,
    source: { track, optionId: String(itemId), state: "effective" },
  }
  switch (effect.kind) {
    case "base-power":
      compiled.basePowerModifier = effect.modifier
      break
    case "battle-stat": {
      const stat = battleStatFor(side, context.category)
      effective = stat !== undefined && effect.stats.includes(stat)
      if (effective && side === "attacker") compiled.attackModifier = effect.modifier
      if (effective && side === "defender") compiled.defenseModifier = effect.modifier
      break
    }
    case "final-damage":
      compiled.finalModifier = effect.modifier
      break
    case "accuracy":
      effective = effect.direction === (side === "attacker" ? "outgoing" : "incoming")
      if (effective) compiled.accuracyModifier = effect.modifier
      break
    case "critical-stage":
      effective = side === "attacker"
      if (effective) compiled.criticalStage = effect.stage
      break
    case "suppress-ordinary-weather-damage":
      effective = side === "defender"
      compiled.suppressOrdinaryWeatherDamage = effective
      break
  }
  if (!effective) compiled.source = { ...compiled.source, state: "inactive" }
  return compiled
}

function criticalProbability(stage: CriticalStage): number {
  return [1 / 24, 1 / 8, 1 / 2, 1][stage]
}

function compileProbability(
  mode: ProbabilityMode,
  accuracy: MoveMechanics["accuracy"],
  criticalStage: CriticalStage,
): ProbabilityInput {
  if (mode === "classic") {
    return {
      hitProbability: 1,
      criticalHitProbability: criticalStage === 3 ? 1 : 0,
    }
  }
  return {
    hitProbability: accuracy === "always-hits" ? 1 : Math.min(1, accuracy / 100),
    criticalHitProbability: criticalProbability(criticalStage),
  }
}

type BranchContext = {
  power: number
  basePowerModifier: number
  attackModifier: number
  defenseModifier: number
  finalModifiers: readonly number[]
  spread: boolean
  weatherModifier: number
  screenModifier: number
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
  return {
    power: context.power,
    basePowerModifier: context.basePowerModifier,
    attack: point.offense,
    attackStage: critical
      ? Math.max(context.attackerStage, 0)
      : context.attackerStage,
    attackModifier: context.attackModifier,
    defense: point.defense.def,
    defenseStage: critical
      ? Math.min(context.defenderStage, 0)
      : context.defenderStage,
    defenseModifier: context.defenseModifier,
    spreadModifier: context.spread ? 3072 : NEUTRAL_MODIFIER,
    weatherModifier: context.weatherModifier,
    criticalModifier: critical ? 6144 : NEUTRAL_MODIFIER,
    stabModifier: context.stabModifier,
    typeEffectivenessModifier: context.typeEffectivenessModifier,
    finalModifier: chainModifiers([
      critical ? NEUTRAL_MODIFIER : context.screenModifier,
      ...context.finalModifiers,
    ]),
  }
}

export function compileScenario(raw: RawScenario): CompilerOutcome {
  const attacker = getBattlePokemonById(raw.attackerId)
  const defender = getBattlePokemonById(raw.defenderId)
  const move = getMoveById(raw.snapshot.moveId)
  const power = normalizeSnapshotPower(raw.snapshot.power)
  const accuracy = normalizeSnapshotAccuracy(raw.snapshot.accuracy)
  const moveCategory = move && isMoveCategory(move.category) ? move.category : undefined
  const moveType = move && isPokemonType(move.type)
    ? resolveReviewedMoveType(move.id, raw.attackerId, move.type, attacker?.types)
    : undefined
  const effectiveness = moveType && defender
    ? typeEffectiveness(moveType, defender.types)
    : 1
  const commonItemContext = {
    category: moveCategory,
    moveType,
    effectiveness,
    weather: raw.weather,
    numericAccuracy: !raw.snapshot.alwaysHits && accuracy > 0,
  }
  const attackerItem = compileHeldItem(raw.attackerItemId, "attacker", {
    ...commonItemContext,
    holder: attacker,
  })
  const defenderItem = raw.defenderItemId === undefined
    ? undefined
    : compileHeldItem(raw.defenderItemId, "defender", {
        ...commonItemContext,
        holder: defender,
      })
  const weather = compileWeatherEffect(
    raw.snapshot.moveId,
    moveType,
    raw.weather,
    raw.probabilityMode,
    defenderItem?.suppressOrdinaryWeatherDamage ?? false,
  )
  const terrain = compileTerrainEffect(
    raw.snapshot.moveId,
    moveType,
    raw.terrain,
    isGrounded(attacker?.types ?? [], raw.attackerAbilityId),
    isGrounded(defender?.types ?? [], raw.defenderAbilityId),
  )
  const derivedCriticalStage = Math.min(
    3,
    raw.snapshot.criticalStage + attackerItem.criticalStage,
  ) as CriticalStage
  const criticalOnly = derivedCriticalStage === 3
  const breaksScreensBeforeDamage = Boolean(
    move && moveBreaksScreensBeforeDamage(move.id),
  )
  const screen = compileScreenEffect(
    raw.screen,
    moveCategory,
    criticalOnly,
    breaksScreensBeforeDamage,
  )
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
  const attackerAbilityState: SourceState = raw.attackerAbilityId === UNKNOWN_ABILITY_ID
    ? "neutral"
    : attackerHasAdaptability
    ? hasOriginalTypeStab ? "effective" : "inactive"
    : "unsupported"
  const defenderAbilityState: SourceState =
    raw.defenderAbilityId === UNKNOWN_ABILITY_ID
      ? "neutral"
      : raw.defenderAbilityId === ADAPTABILITY_ABILITY_ID
      ? "inactive"
      : "unsupported"

  const numericAccuracyWith = (
    includeAttackerItem: boolean,
    includeDefenderItem: boolean,
  ): number => applyModifier(accuracy, chainModifiers([
    includeAttackerItem ? attackerItem.accuracyModifier : NEUTRAL_MODIFIER,
    includeDefenderItem
      ? defenderItem?.accuracyModifier ?? NEUTRAL_MODIFIER
      : NEUTRAL_MODIFIER,
  ]))
  const itemModifiedAccuracy = raw.snapshot.alwaysHits
    ? accuracy
    : numericAccuracyWith(true, true)
  const resolvedAccuracy = weather.accuracy ??
    (raw.snapshot.alwaysHits ? "always-hits" : itemModifiedAccuracy)
  const moveAccuracy: MoveMechanics["accuracy"] = resolvedAccuracy === "always-hits"
    ? resolvedAccuracy
    : Math.min(100, resolvedAccuracy)
  const normalizedItemAccuracy = (includeAttackerItem: boolean, includeDefenderItem: boolean) =>
    Math.min(1, numericAccuracyWith(includeAttackerItem, includeDefenderItem) / 100)

  let attackerItemState = attackerItem.source.state
  if (attackerItem.descriptor?.effect.kind === "accuracy") {
    attackerItemState = attackerItemState === "effective" &&
      raw.probabilityMode === "battle-odds" &&
      weather.accuracy === undefined &&
      normalizedItemAccuracy(true, true) !== normalizedItemAccuracy(false, true)
      ? "effective"
      : "inactive"
  } else if (attackerItem.descriptor?.effect.kind === "critical-stage") {
    const visible = raw.probabilityMode === "battle-odds"
      ? derivedCriticalStage !== raw.snapshot.criticalStage
      : derivedCriticalStage === 3 && raw.snapshot.criticalStage < 3
    attackerItemState = attackerItemState === "effective" && visible
      ? "effective"
      : "inactive"
  }

  let defenderItemState = defenderItem?.source.state
  if (defenderItem?.descriptor?.effect.kind === "accuracy") {
    defenderItemState = defenderItemState === "effective" &&
      raw.probabilityMode === "battle-odds" &&
      weather.accuracy === undefined &&
      normalizedItemAccuracy(true, true) !== normalizedItemAccuracy(true, false)
      ? "effective"
      : "inactive"
  } else if (defenderItem?.descriptor?.effect.kind === "suppress-ordinary-weather-damage") {
    defenderItemState = defenderItemState === "effective" && weather.ordinaryDamageSuppressed
      ? "effective"
      : "inactive"
  }

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
    { ...attackerItem.source, state: attackerItemState },
    ...(defenderItem === undefined
      ? []
      : [{ ...defenderItem.source, state: defenderItemState ?? defenderItem.source.state }]),
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
    {
      track: "terrain",
      optionId: raw.terrain,
      state: terrain.state,
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
    {
      track: "screen",
      optionId: raw.screen,
      state: screen.state,
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
  if (terrain.unavailable) {
    return {
      kind: "unavailable",
      snapshotId: raw.snapshot.id,
      reason: terrain.unavailable,
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

  const context: BranchContext = {
    power,
    basePowerModifier: chainModifiers([
      attackerItem.basePowerModifier,
      weather.basePowerModifier,
      terrain.basePowerModifier,
    ]),
    attackModifier: attackerItem.attackModifier,
    defenseModifier: defenderItem?.defenseModifier ?? NEUTRAL_MODIFIER,
    finalModifiers: [
      attackerItem.finalModifier,
      defenderItem?.finalModifier ?? NEUTRAL_MODIFIER,
    ],
    spread:
      (move.isSpread || terrain.makesSpread) &&
      raw.snapshot.spreadEligible &&
      raw.snapshot.spread,
    stabModifier: hasOriginalTypeStab
      ? attackerHasAdaptability ? 8192 : 6144
      : NEUTRAL_MODIFIER,
    typeEffectivenessModifier: Math.round(effectiveness * NEUTRAL_MODIFIER),
    attackerStage: raw.attackerStage,
    defenderStage: raw.defenderStage,
    weatherModifier: weather.damageModifier,
    screenModifier: screen.modifier,
  }
  const mechanicsModifiers = {
    item: attackerItem.basePowerModifier,
    weather: chainModifiers([
      weather.basePowerModifier,
      weather.damageModifier,
    ]),
    terrain: terrain.basePowerModifier,
    spread: context.spread ? 3072 : NEUTRAL_MODIFIER,
    stab: context.stabModifier,
    typeEffectiveness: context.typeEffectivenessModifier,
    screen: context.screenModifier,
  }

  const compilePoint = (point: RawScenarioPoint) => {
    return {
      defenderHp: point.defense.hp,
      ...(derivedCriticalStage < 3
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
      breaksScreensBeforeDamage,
    },
    calculation: {
      low: compilePoint(raw.lowOutcome),
      ...(raw.highOutcome ? { high: compilePoint(raw.highOutcome) } : {}),
    },
    probability: compileProbability(
      raw.probabilityMode,
      moveAccuracy,
      derivedCriticalStage,
    ),
    moveMechanics: {
      basePower: power,
      effectivePower: mechanicsModifiers.typeEffectiveness === 0
        ? 0
        : Math.max(1, applyModifier(power, chainModifiers([
            mechanicsModifiers.item,
            mechanicsModifiers.weather,
            mechanicsModifiers.spread,
            mechanicsModifiers.stab,
            mechanicsModifiers.typeEffectiveness,
          ]))),
      accuracy: moveAccuracy,
      modifiers: mechanicsModifiers,
    },
    ko: { hitCounts: [1, 2] },
    sources,
  }
}
