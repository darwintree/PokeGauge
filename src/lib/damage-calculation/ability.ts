import {
  ADAPTABILITY_ABILITY_ID,
  BATTLE_ARMOR_ABILITY_ID,
  COMPOUND_EYES_ABILITY_ID,
  FAIRY_AURA_ABILITY_ID,
  FILTER_ABILITY_ID,
  FIRE_MANE_ABILITY_ID,
  FUR_COAT_ABILITY_ID,
  HEATPROOF_ABILITY_ID,
  HUGE_POWER_ABILITY_ID,
  HUSTLE_ABILITY_ID,
  INFILTRATOR_ABILITY_ID,
  IRON_FIST_ABILITY_ID,
  MEGA_LAUNCHER_ABILITY_ID,
  NO_ABILITY_ID,
  NO_GUARD_ABILITY_ID,
  PURE_POWER_ABILITY_ID,
  PURIFYING_SALT_ABILITY_ID,
  SAND_VEIL_ABILITY_ID,
  SAND_FORCE_ABILITY_ID,
  SOLAR_POWER_ABILITY_ID,
  SOLID_ROCK_ABILITY_ID,
  SHELL_ARMOR_ABILITY_ID,
  SNIPER_ABILITY_ID,
  SNOW_CLOAK_ABILITY_ID,
  STRONG_JAW_ABILITY_ID,
  TECHNICIAN_ABILITY_ID,
  THICK_FAT_ABILITY_ID,
  TOUGH_CLAWS_ABILITY_ID,
  SUPER_LUCK_ABILITY_ID,
  UNAWARE_ABILITY_ID,
  UNKNOWN_ABILITY_ID,
  WATER_BUBBLE_ABILITY_ID,
  abilityDamageModifierIsSupported,
  abilityIsProjectionNeutral,
} from "@/lib/ability"
import type { MoveCategory } from "@/lib/catalog"
import type { PokemonType } from "@/lib/pokemon"

import { NEUTRAL_MODIFIER } from "./damage-kernel"
import type { TrackSelectionActivation } from "./scenario-compiler"
import type { Weather } from "./weather"

type AbilityContext = {
  attackerAbilityId: number
  defenderAbilityId: number
  category?: MoveCategory
  moveType?: PokemonType
  power: number
  moveFlags: readonly string[]
  effectiveness: number
  weather: Weather
  hasStab: boolean
}

export type CompiledAbilityEffect = {
  basePowerModifier: number
  attackerAttackModifier: number
  defenderAttackModifier: number
  defenseModifier: number
  finalModifier: number
  attackerAccuracyModifier: number
  defenderAccuracyModifier: number
  criticalStage: number
  criticalFinalModifier: number
  preventsCritical: boolean
  ignoresAttackerStage: boolean
  ignoresDefenderStage: boolean
  bypassesScreens: boolean
  attackerNoGuard: boolean
  defenderNoGuard: boolean
  stabModifier: number
  attackerState: TrackSelectionActivation
  defenderState: TrackSelectionActivation
  activatesWeather: boolean
}

function neutralState(id: number): TrackSelectionActivation | undefined {
  return id === UNKNOWN_ABILITY_ID || id === NO_ABILITY_ID || abilityIsProjectionNeutral(id)
    ? "neutral"
    : undefined
}

export function compileAbilityEffect(context: AbilityContext): CompiledAbilityEffect {
  const attackerModifiers = {
    basePower: NEUTRAL_MODIFIER,
    attack: NEUTRAL_MODIFIER,
    stab: NEUTRAL_MODIFIER,
    accuracy: NEUTRAL_MODIFIER,
    criticalStage: 0,
    criticalFinal: NEUTRAL_MODIFIER,
  }
  const defenderModifiers = {
    attack: NEUTRAL_MODIFIER,
    defense: NEUTRAL_MODIFIER,
    final: NEUTRAL_MODIFIER,
    accuracy: NEUTRAL_MODIFIER,
  }
  let activatesWeather = false
  let attackerActive = false
  let defenderActive = false
  const flags = new Set(context.moveFlags)

  switch (context.attackerAbilityId) {
    case ADAPTABILITY_ABILITY_ID:
      attackerActive = context.hasStab
      if (attackerActive) attackerModifiers.stab = 8192
      break
    case HUGE_POWER_ABILITY_ID:
    case PURE_POWER_ABILITY_ID:
      attackerActive = context.category === "physical"
      if (attackerActive) attackerModifiers.attack = 8192
      break
    case HUSTLE_ABILITY_ID:
      attackerActive = context.category === "physical"
      if (attackerActive) {
        attackerModifiers.attack = 6144
        attackerModifiers.accuracy = 3277
      }
      break
    case COMPOUND_EYES_ABILITY_ID:
      attackerModifiers.accuracy = 5325
      break
    case SUPER_LUCK_ABILITY_ID:
      attackerModifiers.criticalStage = 1
      break
    case SNIPER_ABILITY_ID:
      attackerActive = true
      attackerModifiers.criticalFinal = 6144
      break
    case FIRE_MANE_ABILITY_ID:
      attackerActive = context.moveType === "fire"
      if (attackerActive) attackerModifiers.attack = 6144
      break
    case WATER_BUBBLE_ABILITY_ID:
      attackerActive = context.moveType === "water"
      if (attackerActive) attackerModifiers.attack = 8192
      break
    case SOLAR_POWER_ABILITY_ID:
      attackerActive = context.weather === "sun" && context.category === "special"
      activatesWeather = attackerActive
      if (attackerActive) attackerModifiers.attack = 6144
      break
    case TECHNICIAN_ABILITY_ID:
      attackerActive = context.power <= 60
      if (attackerActive) attackerModifiers.basePower = 6144
      break
    case TOUGH_CLAWS_ABILITY_ID:
      attackerActive = flags.has("contact")
      if (attackerActive) attackerModifiers.basePower = 5325
      break
    case IRON_FIST_ABILITY_ID:
      attackerActive = flags.has("punch")
      if (attackerActive) attackerModifiers.basePower = 4915
      break
    case STRONG_JAW_ABILITY_ID:
      attackerActive = flags.has("bite")
      if (attackerActive) attackerModifiers.basePower = 6144
      break
    case MEGA_LAUNCHER_ABILITY_ID:
      attackerActive = flags.has("pulse")
      if (attackerActive) attackerModifiers.basePower = 6144
      break
    case SAND_FORCE_ABILITY_ID:
      attackerActive = context.weather === "sand" &&
        context.moveType !== undefined &&
        ["rock", "ground", "steel"].includes(context.moveType)
      activatesWeather = attackerActive
      if (attackerActive) attackerModifiers.basePower = 5325
      break
  }

  switch (context.defenderAbilityId) {
    case BATTLE_ARMOR_ABILITY_ID:
    case SHELL_ARMOR_ABILITY_ID:
      defenderActive = true
      break
    case SAND_VEIL_ABILITY_ID:
      defenderActive = context.weather === "sand"
      if (defenderActive) defenderModifiers.accuracy = 3277
      break
    case SNOW_CLOAK_ABILITY_ID:
      defenderActive = context.weather === "snow"
      if (defenderActive) defenderModifiers.accuracy = 3277
      break
    case WATER_BUBBLE_ABILITY_ID:
      defenderActive = context.moveType === "fire"
      if (defenderActive) defenderModifiers.attack = 2048
      break
    case THICK_FAT_ABILITY_ID:
      defenderActive = context.moveType === "fire" || context.moveType === "ice"
      if (defenderActive) defenderModifiers.attack = 2048
      break
    case PURIFYING_SALT_ABILITY_ID:
      defenderActive = context.moveType === "ghost"
      if (defenderActive) defenderModifiers.attack = 2048
      break
    case HEATPROOF_ABILITY_ID:
      defenderActive = context.moveType === "fire"
      if (defenderActive) defenderModifiers.attack = 2048
      break
    case FUR_COAT_ABILITY_ID:
      defenderActive = context.category === "physical"
      if (defenderActive) defenderModifiers.defense = 8192
      break
    case FILTER_ABILITY_ID:
    case SOLID_ROCK_ABILITY_ID:
      defenderActive = context.effectiveness > 1
      if (defenderActive) defenderModifiers.final = 3072
      break
  }

  const auraActive = context.moveType === "fairy" && (
    context.attackerAbilityId === FAIRY_AURA_ABILITY_ID ||
    context.defenderAbilityId === FAIRY_AURA_ABILITY_ID
  )
  if (auraActive) {
    if (context.attackerAbilityId === FAIRY_AURA_ABILITY_ID) attackerActive = true
    if (context.defenderAbilityId === FAIRY_AURA_ABILITY_ID) defenderActive = true
    attackerModifiers.basePower = 5448
  }

  const state = (id: number, active: boolean): TrackSelectionActivation =>
    neutralState(id) ?? (abilityDamageModifierIsSupported(id)
      ? active ? "active" : "inactive"
      : "unsupported")

  return {
    basePowerModifier: attackerModifiers.basePower,
    attackerAttackModifier: attackerModifiers.attack,
    defenderAttackModifier: defenderModifiers.attack,
    defenseModifier: defenderModifiers.defense,
    finalModifier: defenderModifiers.final,
    attackerAccuracyModifier: attackerModifiers.accuracy,
    defenderAccuracyModifier: defenderModifiers.accuracy,
    criticalStage: attackerModifiers.criticalStage,
    criticalFinalModifier: attackerModifiers.criticalFinal,
    preventsCritical: context.defenderAbilityId === BATTLE_ARMOR_ABILITY_ID ||
      context.defenderAbilityId === SHELL_ARMOR_ABILITY_ID,
    ignoresAttackerStage: context.defenderAbilityId === UNAWARE_ABILITY_ID,
    ignoresDefenderStage: context.attackerAbilityId === UNAWARE_ABILITY_ID,
    bypassesScreens: context.attackerAbilityId === INFILTRATOR_ABILITY_ID,
    attackerNoGuard: context.attackerAbilityId === NO_GUARD_ABILITY_ID,
    defenderNoGuard: context.defenderAbilityId === NO_GUARD_ABILITY_ID,
    stabModifier: attackerModifiers.stab,
    attackerState: state(context.attackerAbilityId, attackerActive),
    defenderState: state(context.defenderAbilityId, defenderActive),
    activatesWeather,
  }
}
