import { moveStatChange, type MoveStatChange } from "@/lib/move/stat-change"
import type { MoveCategory } from "@/lib/catalog"
import {
  AIR_LOCK_ABILITY_ID,
  CLOUD_NINE_ABILITY_ID,
  KLUTZ_ABILITY_ID,
  LEVITATE_ABILITY_ID,
  MULTISCALE_ABILITY_ID,
  NO_ABILITY_ID,
  SCRAPPY_ABILITY_ID,
  SKILL_LINK_ABILITY_ID,
  SHEER_FORCE_ABILITY_ID,
  SHADOW_SHIELD_ABILITY_ID,
  PARENTAL_BOND_ABILITY_ID,
  TERA_SHELL_ABILITY_ID,
  UNNERVE_ABILITY_ID,
  abilityEffectIsSupported,
  abilitySupport,
  assumedSatisfiedAbilityFamily,
  type AssumedSatisfiedAbilityFamily,
} from "@/lib/ability"
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
  compileMoveExecution,
  movePowerIsCompatible,
  type MoveExecution,
} from "@/lib/move"
import {
  auditedMoveWarning,
  calcDerivedPowerDefault,
  isMoveExplicitlyUnsupported,
  moveBreaksScreensBeforeDamage,
  resolveReviewedMoveType,
} from "@/lib/move"
import { POKEMON_TYPES, type PokemonType, typeEffectiveness } from "@/lib/pokemon"
import {
  getBattlePokemonById,
  getAbilityById,
  getMoveById,
  type BattlePokemonId,
  type NormalizedBattlePokemon,
} from "@/lib/resources"
import { allStatValues } from "@/lib/stat-calculation"

import { calcRecognizesAbility, calcRecognizesItem } from "./calc-recognition"
import type { CalcContext, CalcPokemonContext } from "./calc-engine"
import { hasFullHpProtection } from "./calc-engine"
import { compileAbilityEffect } from "./ability"
import {
  type CompiledDamageInput,
  type DamageFormulaBranch,
  applyModifier,
  chainModifiers,
  NEUTRAL_MODIFIER,
} from "./damage-input"
import { resolveAbilityScenarioMoveType } from "./scenario-move-type"
import { compileScreenEffect, type Screen } from "./screen"
import {
  compileTerrainEffect,
  isGrounded,
  type Terrain,
} from "./terrain"
import type { ProbabilityMode, StatStage } from "./types"
import { compileWeatherEffect, resolveWeatherMoveType, type Weather } from "./weather"

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

export type ScenarioSupport = "supported" | "semi-supported"

export type CalculableScenario = {
  kind: "calculable"
  support: ScenarioSupport
  snapshotId: string
  move: {
    type: PokemonType
    breaksScreensBeforeDamage: boolean
  }
  calculation: CompiledDamageInput
  statChange?: MoveStatChange
  execution: MoveExecution
  /** Display modifiers after the resistance Berry has been consumed. */
  berry?: { normalFinalModifier: number; criticalFinalModifier: number }
  probability: ProbabilityInput
  hitFact: HitFact
  ko: KoInput
  sources: ScenarioSource[]
}

export type HitFact = number | "always-hits"

export type UnavailableReason =
  | "unconfigured-move"
  | "unsupported-move"
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
    outcome.move.type,
    {
      low: {
        defenderHp: outcome.calculation.low.defenderHp,
        normal: outcome.calculation.low.normal,
        critical: outcome.calculation.low.critical,
      },
      ...(outcome.calculation.high
        ? {
            high: {
              defenderHp: outcome.calculation.high.defenderHp,
              normal: outcome.calculation.high.normal,
              critical: outcome.calculation.high.critical,
            },
          }
        : {}),
    },
    outcome.probability,
    outcome.ko,
    outcome.execution,
    outcome.berry,
    outcome.statChange,
    ...(outcome.statChange || hasFullHpProtection(outcome.calculation.low.calc)
      ? [outcome.calculation.low.calc, outcome.calculation.high?.calc] : []),
  ])
}

function isMoveCategory(value: string): value is MoveCategory {
  return value === "physical" || value === "special"
}

function isPokemonType(value: string): value is PokemonType {
  return POKEMON_TYPES.includes(value as PokemonType)
}

function assumedStatus(
  family: AssumedSatisfiedAbilityFamily | undefined,
): CalcPokemonContext["status"] {
  switch (family) {
    case "self-poisoned":
      return "psn"
    case "status":
    case "burned":
      return "brn"
    default:
      return undefined
  }
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
    case "resistance-berry":
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

function neutralizeHeldItem(item: CompiledHeldItem): CompiledHeldItem {
  return {
    ...item,
    basePowerModifier: NEUTRAL_MODIFIER,
    attackModifier: NEUTRAL_MODIFIER,
    defenseModifier: NEUTRAL_MODIFIER,
    finalModifier: NEUTRAL_MODIFIER,
    accuracyModifier: NEUTRAL_MODIFIER,
    criticalStage: 0,
    suppressOrdinaryWeatherDamage: false,
  }
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
  damageNegated: boolean
  power: number
  basePowerModifier: number
  attackModifier: number
  defenseModifier: number
  finalModifiers: readonly number[]
  afterDamageFinalModifiers?: readonly number[]
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
  const finalModifiers = [
    critical ? NEUTRAL_MODIFIER : context.screenModifier,
    critical ? context.criticalAttackerFinalModifier : NEUTRAL_MODIFIER,
  ]
  return {
    damageNegated: context.damageNegated,
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
      ...finalModifiers,
      ...context.finalModifiers,
    ]),
    ...(context.afterDamageFinalModifiers ? {
      afterDamageFinalModifier: chainModifiers([...finalModifiers, ...context.afterDamageFinalModifiers]),
    } : {}),
  }
}


function weatherMechanicsIdentity(
  weather: ReturnType<typeof compileWeatherEffect>,
  ability: ReturnType<typeof compileAbilityEffect>,
  probabilityMode: ProbabilityMode,
): string {
  return JSON.stringify([
    weather.basePowerModifier,
    weather.damageModifier,
    probabilityMode === "battle-odds" ? weather.accuracy : undefined,
    ability.basePowerModifier,
    ability.attackerAttackModifier,
    ability.defenderAttackModifier,
    probabilityMode === "battle-odds" ? ability.attackerAccuracyModifier : undefined,
    probabilityMode === "battle-odds" ? ability.defenderAccuracyModifier : undefined,
  ])
}

export function compileScenario(raw: RawScenario): CompilerOutcome {
  const attacker = getBattlePokemonById(raw.attackerId)
  const defender = getBattlePokemonById(raw.defenderId)
  const move = getMoveById(raw.snapshot.moveId)
  const power = normalizeSnapshotPower(raw.snapshot.power)
  const accuracy = normalizeSnapshotAccuracy(raw.snapshot.accuracy)
  const moveCategory = move && isMoveCategory(move.category) ? move.category : undefined
  const attackerNullifiesWeather = raw.attackerAbilityId === CLOUD_NINE_ABILITY_ID ||
    raw.attackerAbilityId === AIR_LOCK_ABILITY_ID
  const defenderNullifiesWeather = raw.defenderAbilityId === CLOUD_NINE_ABILITY_ID ||
    raw.defenderAbilityId === AIR_LOCK_ABILITY_ID
  const hasWeatherNullifier = attackerNullifiesWeather || defenderNullifiesWeather
  const effectiveWeather: Weather = hasWeatherNullifier ? "none" : raw.weather
  const identityMoveType = move && isPokemonType(move.type)
    ? resolveWeatherMoveType(
        move.id,
        effectiveWeather,
        resolveReviewedMoveType(move.id, raw.attackerId, move.type, attacker?.types),
      )
    : undefined
  const hasOriginalTypeStab = Boolean(
    attacker && identityMoveType && attacker.types.includes(identityMoveType),
  )
  const typeRewrite = identityMoveType &&
    abilityEffectIsSupported(raw.attackerAbilityId)
    ? resolveAbilityScenarioMoveType({
        abilityId: raw.attackerAbilityId,
        moveId: raw.snapshot.moveId,
        moveType: identityMoveType,
        moveFlags: move?.flags ?? [],
        category: moveCategory,
        hasOriginalTypeStab,
      })
    : undefined
  const moveType = typeRewrite?.scenarioMoveType ?? identityMoveType
  const hasScenarioStab = Boolean(
    (attacker && moveType && attacker.types.includes(moveType)) ||
      typeRewrite?.grantsScenarioStab,
  )
  const rawEffectiveness = moveType && defender
    ? typeEffectiveness(moveType, defender.types)
    : 1
  const scrappyRemovesGhostImmunity = raw.attackerAbilityId === SCRAPPY_ABILITY_ID &&
    defender?.types.includes("ghost") === true &&
    (moveType === "normal" || moveType === "fighting")
  const effectivenessBeforeTeraShell = scrappyRemovesGhostImmunity && moveType && defender
    ? typeEffectiveness(moveType, defender.types.filter((type) => type !== "ghost"))
    : rawEffectiveness
  const effectiveness = raw.defenderAbilityId === TERA_SHELL_ABILITY_ID
    ? 0.5
    : effectivenessBeforeTeraShell
  const commonItemContext = {
    category: moveCategory,
    moveType,
    effectiveness,
    weather: raw.weather,
    numericAccuracy: !raw.snapshot.alwaysHits && accuracy > 0,
  }
  const attackerItemRaw = compileHeldItem(raw.attackerItemId, "attacker", {
    ...commonItemContext,
    holder: attacker,
  })
  const defenderItemRaw = raw.defenderItemId === undefined
    ? undefined
    : compileHeldItem(raw.defenderItemId, "defender", {
        ...commonItemContext,
        holder: defender,
      })
  const attackerHasKlutz = raw.attackerAbilityId === KLUTZ_ABILITY_ID
  const defenderHasKlutz = raw.defenderAbilityId === KLUTZ_ABILITY_ID
  const attackerHasUnnerve = raw.attackerAbilityId === UNNERVE_ABILITY_ID
  const defenderBerryEligible = Boolean(
    defenderItemRaw?.descriptor?.effect.kind === "resistance-berry" &&
    defenderItemRaw.source.state === "active",
  )
  const attackerItem = attackerHasKlutz
    ? neutralizeHeldItem(attackerItemRaw)
    : attackerItemRaw
  const defenderItem = defenderItemRaw === undefined
    ? undefined
    : defenderHasKlutz || (attackerHasUnnerve && defenderBerryEligible)
      ? neutralizeHeldItem(defenderItemRaw)
      : defenderItemRaw

  function compileAbilityForWeather(weather: Weather) {
    return compileAbilityEffect({
      attackerAbilityId: raw.attackerAbilityId,
      defenderAbilityId: raw.defenderAbilityId,
      category: moveCategory,
      moveType,
      power,
      moveFlags: move?.flags ?? [],
      effectiveness,
      weather,
      hasStab: hasScenarioStab,
      typeRewriteBasePower: typeRewrite?.basePowerModifier,
      typeRewriteActive: typeRewrite?.active,
    })
  }

  const utilityUmbrellaSuppressesActual =
    defenderItem?.suppressOrdinaryWeatherDamage ?? false
  const weather = compileWeatherEffect(
    raw.snapshot.moveId,
    moveType,
    effectiveWeather,
    raw.probabilityMode,
    utilityUmbrellaSuppressesActual,
  )
  function compileTerrainFor(attackerAbilityId: number, defenderAbilityId: number) {
    return compileTerrainEffect(
      raw.snapshot.moveId,
      moveType,
      raw.terrain,
      isGrounded(attacker?.types ?? [], attackerAbilityId),
      isGrounded(defender?.types ?? [], defenderAbilityId),
    )
  }
  const terrain = compileTerrainFor(raw.attackerAbilityId, raw.defenderAbilityId)
  const attackerAirborneAbility = raw.attackerAbilityId === LEVITATE_ABILITY_ID
  const defenderAirborneAbility = raw.defenderAbilityId === LEVITATE_ABILITY_ID
  const terrainMechanicsIdentity = (effect: ReturnType<typeof compileTerrainEffect>) =>
    JSON.stringify([effect.basePowerModifier, effect.makesSpread, effect.unavailable])
  const terrainWithoutAttackerAirborne = attackerAirborneAbility
    ? compileTerrainFor(NO_ABILITY_ID, raw.defenderAbilityId)
    : terrain
  const terrainWithoutDefenderAirborne = defenderAirborneAbility
    ? compileTerrainFor(raw.attackerAbilityId, NO_ABILITY_ID)
    : terrain
  const ability = compileAbilityForWeather(effectiveWeather)
  const attackerAirborneActive = attackerAirborneAbility &&
    effectiveness > 0 &&
    !ability.damageNegated
    && terrainMechanicsIdentity(terrain) !== terrainMechanicsIdentity(terrainWithoutAttackerAirborne)
  const defenderAirborneActive = defenderAirborneAbility &&
    effectiveness > 0 &&
    !ability.damageNegated
    && terrainMechanicsIdentity(terrain) !== terrainMechanicsIdentity(terrainWithoutDefenderAirborne)

  const rawWeatherEffect = compileWeatherEffect(
    raw.snapshot.moveId,
    moveType,
    raw.weather,
    raw.probabilityMode,
  )
  const noWeatherEffect = compileWeatherEffect(
    raw.snapshot.moveId,
    moveType,
    "none",
    raw.probabilityMode,
  )
  const rawWeatherAbility = compileAbilityForWeather(raw.weather)
  const noWeatherAbility = compileAbilityForWeather("none")
  const rawWeatherHasEffect = weatherMechanicsIdentity(
    rawWeatherEffect,
    rawWeatherAbility,
    raw.probabilityMode,
  ) !== weatherMechanicsIdentity(
    noWeatherEffect,
    noWeatherAbility,
    raw.probabilityMode,
  )
  const weatherNullifierActive = raw.weather !== "none" &&
    rawWeatherHasEffect
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
  const screenWithoutBypass = compileScreenEffect(
    raw.screen,
    moveCategory,
    criticalOnly,
    breaksScreensBeforeDamage,
  )
  const infiltratorBypassesScreen = ability.bypassesScreens &&
    screenWithoutBypass.state === "active"
  const screen = infiltratorBypassesScreen
    ? {
        modifier: NEUTRAL_MODIFIER,
        state: "inactive" as const,
        applied: screenWithoutBypass.applied,
      }
    : screenWithoutBypass
  const attackerUnawareActive = ability.ignoresDefenderStage && (
    criticalOnly ? raw.defenderStage < 0 : raw.defenderStage !== 0
  )
  const defenderUnawareActive = ability.ignoresAttackerStage && (
    criticalOnly ? raw.attackerStage > 0 : raw.attackerStage !== 0
  )
  const effectiveAttackerStage = ability.ignoresAttackerStage ? 0 : raw.attackerStage
  const effectiveDefenderStage = ability.ignoresDefenderStage ? 0 : raw.defenderStage
  const stageState = (
    stage: StatStage,
    ignored: boolean,
    criticalOnlySwallow: boolean,
  ): TrackSelectionActivation => {
    if (stage === 0) return "neutral"
    if (ignored || criticalOnlySwallow) return "inactive"
    return "active"
  }
  const attackerStageState = stageState(
    raw.attackerStage,
    ability.ignoresAttackerStage,
    criticalOnly && raw.attackerStage < 0,
  )
  const defenderStageState = stageState(
    raw.defenderStage,
    ability.ignoresDefenderStage,
    criticalOnly && raw.defenderStage > 0,
  )
  const numericAccuracyWith = (
    includeAttackerAbility: boolean,
    includeDefenderAbility: boolean,
    attackerItemAccuracy: number,
    defenderItemAccuracy: number,
  ): number => applyModifier(accuracy, chainModifiers([
    includeAttackerAbility ? ability.attackerAccuracyModifier : NEUTRAL_MODIFIER,
    includeDefenderAbility ? ability.defenderAccuracyModifier : NEUTRAL_MODIFIER,
    attackerItemAccuracy,
    defenderItemAccuracy,
  ]))
  const resolveHitFactWithItemMods = (
    includeAttackerAbility: boolean,
    includeDefenderAbility: boolean,
    attackerItemAccuracy: number,
    defenderItemAccuracy: number,
  ): HitFact => {
    const modifiedAccuracy = raw.snapshot.alwaysHits
      ? accuracy
      : numericAccuracyWith(
          includeAttackerAbility,
          includeDefenderAbility,
          attackerItemAccuracy,
          defenderItemAccuracy,
        )
    const resolved = weather.accuracy ??
      (raw.snapshot.alwaysHits ? "always-hits" : modifiedAccuracy)
    return ability.attackerNoGuard || ability.defenderNoGuard
      ? "always-hits"
      : resolved === "always-hits" ? resolved : Math.min(100, resolved)
  }
  const resolveHitFact = (
    includeAttackerAbility: boolean,
    includeDefenderAbility: boolean,
    includeAttackerItem: boolean,
    includeDefenderItem: boolean,
  ): HitFact => resolveHitFactWithItemMods(
    includeAttackerAbility,
    includeDefenderAbility,
    includeAttackerItem ? attackerItem.accuracyModifier : NEUTRAL_MODIFIER,
    includeDefenderItem
      ? defenderItem?.accuracyModifier ?? NEUTRAL_MODIFIER
      : NEUTRAL_MODIFIER,
  )
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

  // Item activation is judged as if Klutz were absent; Klutz then suppresses active hooks.
  let attackerItemState = attackerItemRaw.source.state
  if (attackerItemRaw.descriptor?.effect.kind === "accuracy") {
    const withRawItem = effectiveHitProbability(resolveHitFactWithItemMods(
      true,
      true,
      attackerItemRaw.accuracyModifier,
      defenderItem?.accuracyModifier ?? NEUTRAL_MODIFIER,
    ))
    const withoutAttackerItem = effectiveHitProbability(resolveHitFactWithItemMods(
      true,
      true,
      NEUTRAL_MODIFIER,
      defenderItem?.accuracyModifier ?? NEUTRAL_MODIFIER,
    ))
    attackerItemState = attackerItemState === "active" &&
      raw.probabilityMode === "battle-odds" &&
      withRawItem !== withoutAttackerItem
      ? "active"
      : "inactive"
  } else if (attackerItemRaw.descriptor?.effect.kind === "critical-stage") {
    const criticalStageWithRawItem = Math.min(
      3,
      raw.snapshot.criticalStage + attackerItemRaw.criticalStage + ability.criticalStage,
    )
    const criticalStageWithoutItem = Math.min(
      3,
      raw.snapshot.criticalStage + ability.criticalStage,
    )
    const visible = raw.probabilityMode === "battle-odds"
      ? criticalStageWithRawItem !== criticalStageWithoutItem
      : criticalStageWithRawItem === 3 && criticalStageWithoutItem < 3
    attackerItemState = attackerItemState === "active" && visible
      && !ability.preventsCritical
      ? "active"
      : "inactive"
  }

  let defenderItemState = defenderItemRaw?.source.state
  if (defenderItemRaw?.descriptor?.effect.kind === "accuracy") {
    const withRawItem = effectiveHitProbability(resolveHitFactWithItemMods(
      true,
      true,
      attackerItem.accuracyModifier,
      defenderItemRaw.accuracyModifier,
    ))
    const withoutDefenderItem = effectiveHitProbability(resolveHitFactWithItemMods(
      true,
      true,
      attackerItem.accuracyModifier,
      NEUTRAL_MODIFIER,
    ))
    defenderItemState = defenderItemState === "active" &&
      raw.probabilityMode === "battle-odds" &&
      withRawItem !== withoutDefenderItem
      ? "active"
      : "inactive"
  } else if (defenderItemRaw?.descriptor?.effect.kind === "suppress-ordinary-weather-damage") {
    const wouldSuppress = compileWeatherEffect(
      raw.snapshot.moveId,
      moveType,
      raw.weather,
      raw.probabilityMode,
      true,
    ).ordinaryDamageSuppressed
    defenderItemState = defenderItemState === "active" && wouldSuppress
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
  if (ability.ignoresDefenderStage) {
    attackerAbilityState = attackerUnawareActive ? "active" : "inactive"
  }
  if (ability.bypassesScreens) {
    attackerAbilityState = infiltratorBypassesScreen ? "active" : "inactive"
  }
  if (raw.attackerAbilityId === SCRAPPY_ABILITY_ID) {
    attackerAbilityState = scrappyRemovesGhostImmunity &&
      effectivenessBeforeTeraShell !== rawEffectiveness &&
      !ability.damageNegated
      ? "active"
      : "inactive"
  }
  if (attackerAirborneAbility) {
    attackerAbilityState = attackerAbilityState === "active" || attackerAirborneActive
      ? "active"
      : "inactive"
  }
  if (attackerNullifiesWeather) {
    attackerAbilityState = weatherNullifierActive ? "active" : "inactive"
  }
  if (attackerHasKlutz) {
    const klutzActive = attackerItemState === "active"
    attackerAbilityState = klutzActive ? "active" : "inactive"
    if (klutzActive) attackerItemState = "inactive"
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
  if (ability.ignoresAttackerStage) {
    defenderAbilityState = defenderUnawareActive ? "active" : "inactive"
  }
  if (defenderAirborneAbility) {
    defenderAbilityState = defenderAbilityState === "active" || defenderAirborneActive
      ? "active"
      : "inactive"
  }
  if (defenderNullifiesWeather) {
    defenderAbilityState = weatherNullifierActive ? "active" : "inactive"
  }
  if (raw.defenderAbilityId === UNNERVE_ABILITY_ID) {
    defenderAbilityState = "inactive"
  }
  if (defenderHasKlutz) {
    const klutzActive = defenderItemState === "active"
    defenderAbilityState = klutzActive ? "active" : "inactive"
    if (klutzActive) defenderItemState = "inactive"
  }
  if (attackerHasUnnerve) {
    attackerAbilityState = defenderBerryEligible ? "active" : "inactive"
    if (defenderBerryEligible) defenderItemState = "inactive"
  }

  const rawWeatherReplaced = raw.weather !== "none" && hasWeatherNullifier
  let weatherState: TrackSelectionActivation = weather.state
  if (raw.weather === "none") {
    weatherState = "neutral"
  } else if (rawWeatherReplaced) {
    weatherState = "inactive"
  } else if (ability.activatesWeather) {
    weatherState = "active"
  }
  if (abilitySupport(raw.attackerAbilityId) === "unsupported") {
    attackerAbilityState = "unsupported"
  }
  if (abilitySupport(raw.defenderAbilityId) === "unsupported") {
    defenderAbilityState = "unsupported"
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
      state: weatherState,
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
      optionId: screen.applied ?? raw.screen,
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
    !movePowerIsCompatible(raw.snapshot.moveId, power) ||
    (move.power === null && calcDerivedPowerDefault(move.id) === undefined)
  ) {
    return {
      kind: "unavailable",
      snapshotId: raw.snapshot.id,
      reason: "unsupported-move",
      sources,
    }
  }

  const context: BranchContext = {
    damageNegated: ability.damageNegated,
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
    ...([MULTISCALE_ABILITY_ID, SHADOW_SHIELD_ABILITY_ID].includes(raw.defenderAbilityId) ? {
      afterDamageFinalModifiers: [
        attackerItem.finalModifier,
        defenderItemRaw?.descriptor?.effect.kind === "resistance-berry"
          ? NEUTRAL_MODIFIER : defenderItem?.finalModifier ?? NEUTRAL_MODIFIER,
      ],
    } : {}),
    criticalAttackerFinalModifier: ability.criticalFinalModifier,
    spread:
      (move.isSpread || terrain.makesSpread) &&
      raw.snapshot.spreadEligible &&
      raw.snapshot.spread,
    stabModifier: hasScenarioStab
      ? ability.stabModifier === NEUTRAL_MODIFIER ? 6144 : ability.stabModifier
      : NEUTRAL_MODIFIER,
    typeEffectivenessModifier: Math.round(effectiveness * NEUTRAL_MODIFIER),
    attackerStage: effectiveAttackerStage,
    defenderStage: effectiveDefenderStage,
    weatherModifier: weather.damageModifier,
    screenModifier: screen.modifier,
  }
  const calcMoveName = move.calcMoveName
  const execution = compileMoveExecution(move.id, power, raw.attackerAbilityId, context.spread)
  if (raw.attackerAbilityId === SKILL_LINK_ABILITY_ID || raw.attackerAbilityId === PARENTAL_BOND_ABILITY_ID) {
    const source = sources.find((source) => source.track === "attacker-ability")
    if (source) source.state = JSON.stringify(execution) ===
      JSON.stringify(compileMoveExecution(move.id, power, NO_ABILITY_ID, context.spread))
      ? "inactive" : "active"
  }
  const calcDerivesMoveType = typeRewrite?.active === true ||
    raw.snapshot.moveId === 311 /* Weather Ball */
  const attackerCalcAbilityName = getAbilityById(raw.attackerAbilityId)?.calcAbilityName
  const defenderCalcAbilityName = getAbilityById(raw.defenderAbilityId)?.calcAbilityName
  const attackerItemCalcName = typeof raw.attackerItemId === "number"
    ? FROZEN_HELD_ITEM_BY_ID.get(raw.attackerItemId)?.calcItemName
    : undefined
  const defenderItemCalcName = typeof raw.defenderItemId === "number"
    ? FROZEN_HELD_ITEM_BY_ID.get(raw.defenderItemId)?.calcItemName
    : undefined
  const attackerNeutralStats = allStatValues(attacker.calcSpeciesName)
  const defenderNeutralStats = allStatValues(defender.calcSpeciesName)
  const attackerAssumption = assumedSatisfiedAbilityFamily(raw.attackerAbilityId)
  const defenderAssumption = assumedSatisfiedAbilityFamily(raw.defenderAbilityId)
  const attackerStatus = assumedStatus(attackerAssumption)
  const defenderStatus = attackerAssumption === "target-poisoned"
    ? "psn" as const
    : assumedStatus(defenderAssumption)
  const analyticAssumed = attackerAssumption === "last-move"
  const spreadTarget = context.spread
    ? (move.isSpread ? "allAdjacent" as const : "allAdjacentFoes" as const)
    : "normal" as const
  const calcContext = (point: RawScenarioPoint): CalcContext => {
    const attackerStats: CalcPokemonContext["exactStats"] = {
      ...attackerNeutralStats,
      ...(moveCategory === "physical" ? { atk: point.offense } : { spa: point.offense }),
    }
    const defenderStats: CalcPokemonContext["exactStats"] = {
      ...defenderNeutralStats,
      hp: point.defense.hp,
      ...(moveCategory === "physical" ? { def: point.defense.def } : { spd: point.defense.def }),
    }
    const attackerBoosts: CalcPokemonContext["boosts"] = {
      atk: moveCategory === "physical" ? effectiveAttackerStage : 0,
      def: 0,
      spa: moveCategory === "special" ? effectiveAttackerStage : 0,
      spd: 0,
      spe: 0,
    }
    if (analyticAssumed && calcMoveName === "Pursuit") {
      attackerStats.spe = defenderStats.spe
    }
    const defenderBoosts: CalcPokemonContext["boosts"] = {
      atk: 0,
      def: moveCategory === "physical" ? effectiveDefenderStage : 0,
      spa: 0,
      spd: moveCategory === "special" ? effectiveDefenderStage : 0,
      spe: 0,
    }
    const weather: CalcContext["field"]["weather"] =
      effectiveWeather === "sun" ? "Sun"
      : effectiveWeather === "rain" ? "Rain"
      : effectiveWeather === "sand" ? "Sand"
      : effectiveWeather === "snow" ? "Snow"
      : undefined
    const terrain: CalcContext["field"]["terrain"] =
      raw.terrain === "electric" ? "Electric"
      : raw.terrain === "grassy" ? "Grassy"
      : raw.terrain === "psychic" ? "Psychic"
      : raw.terrain === "misty" ? "Misty"
      : undefined
    const defenderScreen = screen.state === "active" && screen.applied
      ? screen.applied
      : undefined
    return {
      attacker: {
        calcSpeciesName: attacker.calcSpeciesName,
        ...(attackerCalcAbilityName &&
          (raw.attackerAbilityId !== PARENTAL_BOND_ABILITY_ID || execution.parentalBond) &&
          abilityEffectIsSupported(raw.attackerAbilityId) &&
          calcRecognizesAbility(attackerCalcAbilityName)
          ? { abilityCalcName: attackerCalcAbilityName }
          : {}),
        ...(attackerItemCalcName && calcRecognizesItem(attackerItemCalcName)
          ? { itemCalcName: attackerItemCalcName }
          : {}),
        exactStats: attackerStats,
        boosts: attackerBoosts,
        ...(attackerAssumption === "low-hp"
          ? { currentHp: Math.max(1, Math.floor(attackerStats.hp / 3)) }
          : {}),
        ...(attackerStatus ? { status: attackerStatus } : {}),
        ...(attackerAssumption === "partner" ? { abilityOn: true } : {}),
      },
      defender: {
        calcSpeciesName: defender.calcSpeciesName,
        ...(defenderCalcAbilityName &&
          abilityEffectIsSupported(raw.defenderAbilityId) &&
          calcRecognizesAbility(defenderCalcAbilityName)
          ? { abilityCalcName: defenderCalcAbilityName }
          : {}),
        ...(defenderItemCalcName && calcRecognizesItem(defenderItemCalcName)
          ? { itemCalcName: defenderItemCalcName }
          : {}),
        exactStats: defenderStats,
        boosts: defenderBoosts,
        ...(defenderAssumption === "low-hp"
          ? { currentHp: Math.max(1, Math.floor(defenderStats.hp / 3)) }
          : {}),
        ...(defenderStatus ? { status: defenderStatus } : {}),
        ...(defenderAssumption === "partner" ? { abilityOn: true } : {}),
      },
      move: {
        calcMoveName,
        target: spreadTarget,
        ...(calcDerivedPowerDefault(raw.snapshot.moveId) === undefined &&
          move.power !== null && move.power > 0 && raw.snapshot.power !== move.power
          ? { powerOverride: raw.snapshot.power }
          : {}),
        ...(!calcDerivesMoveType && moveType !== move.type ? { typeOverride: moveType } : {}),
        isCrit: false,
      },
      field: {
        gameType: "Doubles" as const,
        ...(weather ? { weather } : {}),
        ...(terrain ? { terrain } : {}),
        ...(defenderScreen ? { defenderScreen } : {}),
        ...(analyticAssumed && calcMoveName !== "Pursuit"
          ? { defenderIsSwitchingOut: true }
          : {}),
      },
    }
  }
  const compilePoint = (point: RawScenarioPoint) => {
    return {
      defenderHp: point.defense.hp,
      calc: calcContext(point),
      ...(ability.preventsCritical || derivedCriticalStage < 3
        ? { normal: compileBranch(point, context, false) }
        : {}),
      ...(!ability.preventsCritical
        ? { critical: compileBranch(point, context, true) }
        : {}),
    }
  }

  const change = moveStatChange(raw.snapshot.moveId)
  const statChange = change &&
    raw.attackerAbilityId !== SHEER_FORCE_ABILITY_ID &&
    (raw.probabilityMode !== "classic" || change.probability === 1)
    ? change
    : undefined

  return {
    kind: "calculable",
    ...(statChange ? { statChange } : {}),
    support: auditedMoveWarning(raw.snapshot.moveId) || raw.terrain === "grassy"
      ? "semi-supported"
      : "supported",
    snapshotId: raw.snapshot.id,
    move: {
      type: moveType,
      breaksScreensBeforeDamage,
    },
    calculation: {
      low: compilePoint(raw.lowOutcome),
      ...(raw.highOutcome ? { high: compilePoint(raw.highOutcome) } : {}),
    },
    execution,
    ...(defenderItemRaw?.descriptor?.effect.kind === "resistance-berry"
      ? {
          berry: {
            normalFinalModifier: compileBranch(raw.lowOutcome, {
              ...context,
              finalModifiers: [ability.finalModifier, attackerItem.finalModifier],
            }, false).finalModifier,
            criticalFinalModifier: compileBranch(raw.lowOutcome, {
              ...context,
              finalModifiers: [ability.finalModifier, attackerItem.finalModifier],
            }, true).finalModifier,
          },
        }
      : {}),
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
