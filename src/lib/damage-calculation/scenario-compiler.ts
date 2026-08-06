import type { MoveCategory } from "@/lib/catalog"
import {
  FROZEN_HELD_ITEM_BY_ID,
  isMegaStone,
  type FrozenHeldItem,
  type HeldItemBattleStat,
  type HeldItemGate,
  type HeldItemId,
} from "@/lib/held-item"
import {
  type CriticalStage,
  type MoveSnapshot,
  normalizeSnapshotAccuracy,
  normalizeSnapshotPower,
} from "@/lib/move"
import {
  isMoveExplicitlyUnsupported,
  moveBreaksScreensBeforeDamage,
  resolveReviewedMoveType,
  reviewedVariablePowerDefault,
} from "@/lib/move"
import { POKEMON_TYPES, type PokemonType, typeEffectiveness } from "@/lib/pokemon"
import {
  getBattlePokemonById,
  getMoveById,
  type BattlePokemonId,
  type NormalizedBattlePokemon,
} from "@/lib/resources"

import { compileAbilityEffect } from "./ability"
import {
  type CompiledDamageInput,
  type DamageFormulaBranch,
  applyModifier,
  chainModifiers,
  NEUTRAL_MODIFIER,
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

export type TrackSelectionActivation = "active" | "inactive" | "unsupported" | "neutral"

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
  state: TrackSelectionActivation
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
  hitFact: HitFact
  ko: KoInput
  sources: ScenarioSource[]
}

export type HitFact = number | "always-hits"

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
  let active = true
  const compiled: CompiledHeldItem = {
    ...neutral,
    descriptor,
    source: { track, optionId: String(itemId), state: "active" },
  }
  switch (effect.kind) {
    case "base-power":
      compiled.basePowerModifier = effect.modifier
      break
    case "battle-stat": {
      const stat = battleStatFor(side, context.category)
      active = stat !== undefined && effect.stats.includes(stat)
      if (active && side === "attacker") compiled.attackModifier = effect.modifier
      if (active && side === "defender") compiled.defenseModifier = effect.modifier
      break
    }
    case "final-damage":
      compiled.finalModifier = effect.modifier
      break
    case "accuracy":
      active = effect.direction === (side === "attacker" ? "outgoing" : "incoming")
      if (active) compiled.accuracyModifier = effect.modifier
      break
    case "critical-stage":
      active = side === "attacker"
      if (active) compiled.criticalStage = effect.stage
      break
    case "suppress-ordinary-weather-damage":
      active = side === "defender"
      compiled.suppressOrdinaryWeatherDamage = active
      break
  }
  if (!active) compiled.source = { ...compiled.source, state: "inactive" }
  return compiled
}

function criticalProbability(stage: CriticalStage): number {
  return [1 / 24, 1 / 8, 1 / 2, 1][stage]
}

function compileProbability(
  mode: ProbabilityMode,
  hitFact: HitFact,
  criticalStage: CriticalStage,
  preventsCritical: boolean,
): ProbabilityInput {
  if (mode === "classic") {
    return {
      hitProbability: 1,
      criticalHitProbability: !preventsCritical && criticalStage === 3 ? 1 : 0,
    }
  }
  return {
    hitProbability: hitFact === "always-hits" ? 1 : Math.min(1, hitFact / 100),
    criticalHitProbability: preventsCritical ? 0 : criticalProbability(criticalStage),
  }
}

type BranchContext = {
  power: number
  basePowerModifier: number
  attackModifier: number
  defenseModifier: number
  finalModifiers: readonly number[]
  criticalAttackerFinalModifier: number
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
      critical ? context.criticalAttackerFinalModifier : NEUTRAL_MODIFIER,
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
  const hasOriginalTypeStab = Boolean(
    attacker && moveType && attacker.types.includes(moveType),
  )
  const ability = compileAbilityEffect({
    attackerAbilityId: raw.attackerAbilityId,
    defenderAbilityId: raw.defenderAbilityId,
    category: moveCategory,
    moveType,
    power,
    moveFlags: move?.flags ?? [],
    effectiveness,
    weather: raw.weather,
    hasStab: hasOriginalTypeStab,
  })
  const criticalStageWithoutAbility = Math.min(
    3,
    raw.snapshot.criticalStage + attackerItem.criticalStage,
  ) as CriticalStage
  const derivedCriticalStage = Math.min(
    3,
    criticalStageWithoutAbility + ability.criticalStage,
  ) as CriticalStage
  const criticalOnly = !ability.preventsCritical && derivedCriticalStage === 3
  const breaksScreensBeforeDamage = Boolean(
    move && moveBreaksScreensBeforeDamage(move.id),
  )
  const screen = compileScreenEffect(
    raw.screen,
    moveCategory,
    criticalOnly,
    breaksScreensBeforeDamage,
  )
  const attackerStageState: TrackSelectionActivation = raw.attackerStage === 0
    ? "neutral"
    : criticalOnly && raw.attackerStage < 0
      ? "inactive"
      : "active"
  const defenderStageState: TrackSelectionActivation = raw.defenderStage === 0
    ? "neutral"
    : criticalOnly && raw.defenderStage > 0
      ? "inactive"
      : "active"
  const numericAccuracyWith = (
    includeAttackerAbility: boolean,
    includeDefenderAbility: boolean,
    includeAttackerItem: boolean,
    includeDefenderItem: boolean,
  ): number => applyModifier(accuracy, chainModifiers([
    includeAttackerAbility ? ability.attackerAccuracyModifier : NEUTRAL_MODIFIER,
    includeDefenderAbility ? ability.defenderAccuracyModifier : NEUTRAL_MODIFIER,
    includeAttackerItem ? attackerItem.accuracyModifier : NEUTRAL_MODIFIER,
    includeDefenderItem
      ? defenderItem?.accuracyModifier ?? NEUTRAL_MODIFIER
      : NEUTRAL_MODIFIER,
  ]))
  const resolveHitFact = (
    includeAttackerAbility: boolean,
    includeDefenderAbility: boolean,
    includeAttackerItem: boolean,
    includeDefenderItem: boolean,
  ): HitFact => {
    const modifiedAccuracy = raw.snapshot.alwaysHits
      ? accuracy
      : numericAccuracyWith(
          includeAttackerAbility,
          includeDefenderAbility,
          includeAttackerItem,
          includeDefenderItem,
        )
    const resolved = weather.accuracy ??
      (raw.snapshot.alwaysHits ? "always-hits" : modifiedAccuracy)
    return ability.attackerNoGuard || ability.defenderNoGuard
      ? "always-hits"
      : resolved === "always-hits" ? resolved : Math.min(100, resolved)
  }
  const hitFact = resolveHitFact(true, true, true, true)
  const effectiveHitProbability = (fact: HitFact) =>
    fact === "always-hits" ? 1 : Math.min(1, fact / 100)
  const hitProbabilityWithout = (
    includeAttackerAbility: boolean,
    includeDefenderAbility: boolean,
    includeAttackerItem: boolean,
    includeDefenderItem: boolean,
  ) => effectiveHitProbability(resolveHitFact(
    includeAttackerAbility,
    includeDefenderAbility,
    includeAttackerItem,
    includeDefenderItem,
  ))
  const finalHitProbability = effectiveHitProbability(hitFact)

  let attackerItemState = attackerItem.source.state
  if (attackerItem.descriptor?.effect.kind === "accuracy") {
    attackerItemState = attackerItemState === "active" &&
      raw.probabilityMode === "battle-odds" &&
      finalHitProbability !== hitProbabilityWithout(true, true, false, true)
      ? "active"
      : "inactive"
  } else if (attackerItem.descriptor?.effect.kind === "critical-stage") {
    const criticalStageWithoutItem = Math.min(
      3,
      raw.snapshot.criticalStage + ability.criticalStage,
    )
    const visible = raw.probabilityMode === "battle-odds"
      ? derivedCriticalStage !== criticalStageWithoutItem
      : derivedCriticalStage === 3 && criticalStageWithoutItem < 3
    attackerItemState = attackerItemState === "active" && visible
      && !ability.preventsCritical
      ? "active"
      : "inactive"
  }

  let defenderItemState = defenderItem?.source.state
  if (defenderItem?.descriptor?.effect.kind === "accuracy") {
    defenderItemState = defenderItemState === "active" &&
      raw.probabilityMode === "battle-odds" &&
      finalHitProbability !== hitProbabilityWithout(true, true, true, false)
      ? "active"
      : "inactive"
  } else if (defenderItem?.descriptor?.effect.kind === "suppress-ordinary-weather-damage") {
    defenderItemState = defenderItemState === "active" && weather.ordinaryDamageSuppressed
      ? "active"
      : "inactive"
  }

  let attackerAbilityState = ability.attackerState
  if (ability.attackerAccuracyModifier !== NEUTRAL_MODIFIER) {
    const accuracyActive = raw.probabilityMode === "battle-odds" &&
      finalHitProbability !== hitProbabilityWithout(false, true, true, true)
    attackerAbilityState = attackerAbilityState === "active" || accuracyActive
      ? "active"
      : "inactive"
  }
  if (ability.criticalStage > 0) {
    const visible = raw.probabilityMode === "battle-odds"
      ? derivedCriticalStage !== criticalStageWithoutAbility
      : derivedCriticalStage === 3 && criticalStageWithoutAbility < 3
    attackerAbilityState = visible && !ability.preventsCritical ? "active" : "inactive"
  }
  if (ability.criticalFinalModifier !== NEUTRAL_MODIFIER) {
    attackerAbilityState = ability.preventsCritical ? "inactive" : "active"
  }
  if (ability.attackerNoGuard) {
    attackerAbilityState = raw.probabilityMode === "battle-odds" &&
      !raw.snapshot.alwaysHits ? "active" : "inactive"
  }

  let defenderAbilityState = ability.defenderState
  if (ability.defenderAccuracyModifier !== NEUTRAL_MODIFIER) {
    defenderAbilityState = raw.probabilityMode === "battle-odds" &&
      finalHitProbability !== hitProbabilityWithout(true, false, true, true)
      ? "active"
      : "inactive"
  }
  if (ability.defenderNoGuard) {
    defenderAbilityState = raw.probabilityMode === "battle-odds" &&
      !raw.snapshot.alwaysHits ? "active" : "inactive"
  }

  const sources: ScenarioSource[] = [
    ...(raw.sourceOptionIds
      ? [{
          track: "attacker-stat" as const,
          optionId: raw.sourceOptionIds.attackerStat,
          state: "active" as const,
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
      state: ability.activatesWeather ? "active" : weather.state,
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
          state: "active" as const,
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
      ability.basePowerModifier,
      attackerItem.basePowerModifier,
      terrain.basePowerModifier,
      weather.basePowerModifier,
    ]),
    attackModifier: chainModifiers([
      ability.attackerAttackModifier,
      ability.defenderAttackModifier,
      attackerItem.attackModifier,
    ]),
    defenseModifier: chainModifiers([
      ability.defenseModifier,
      defenderItem?.defenseModifier ?? NEUTRAL_MODIFIER,
    ]),
    finalModifiers: [
      ability.finalModifier,
      attackerItem.finalModifier,
      defenderItem?.finalModifier ?? NEUTRAL_MODIFIER,
    ],
    criticalAttackerFinalModifier: ability.criticalFinalModifier,
    spread:
      (move.isSpread || terrain.makesSpread) &&
      raw.snapshot.spreadEligible &&
      raw.snapshot.spread,
    stabModifier: hasOriginalTypeStab
      ? ability.stabModifier === NEUTRAL_MODIFIER ? 6144 : ability.stabModifier
      : NEUTRAL_MODIFIER,
    typeEffectivenessModifier: Math.round(effectiveness * NEUTRAL_MODIFIER),
    attackerStage: raw.attackerStage,
    defenderStage: raw.defenderStage,
    weatherModifier: weather.damageModifier,
    screenModifier: screen.modifier,
  }
  const compilePoint = (point: RawScenarioPoint) => {
    return {
      defenderHp: point.defense.hp,
      ...(ability.preventsCritical || derivedCriticalStage < 3
        ? { normal: compileBranch(point, context, false) }
        : {}),
      ...(!ability.preventsCritical
        ? { critical: compileBranch(point, context, true) }
        : {}),
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
      hitFact,
      derivedCriticalStage,
      ability.preventsCritical,
    ),
    hitFact,
    ko: { hitCounts: [1, 2] },
    sources,
  }
}
