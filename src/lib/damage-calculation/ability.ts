import {
  ADAPTABILITY_ABILITY_ID,
  BATTLE_ARMOR_ABILITY_ID,
  BULLETPROOF_ABILITY_ID,
  BLAZE_ABILITY_ID,
  COMPOUND_EYES_ABILITY_ID,
  DRY_SKIN_ABILITY_ID,
  EARTH_EATER_ABILITY_ID,
  EELEVATE_ABILITY_ID,
  FAIRY_AURA_ABILITY_ID,
  FLASH_FIRE_ABILITY_ID,
  FILTER_ABILITY_ID,
  FIRE_MANE_ABILITY_ID,
  FLUFFY_ABILITY_ID,
  FUR_COAT_ABILITY_ID,
  GUTS_ABILITY_ID,
  HEATPROOF_ABILITY_ID,
  HUGE_POWER_ABILITY_ID,
  HUSTLE_ABILITY_ID,
  INFILTRATOR_ABILITY_ID,
  IRON_FIST_ABILITY_ID,
  KLUTZ_ABILITY_ID,
  LEVITATE_ABILITY_ID,
  LIGHTNING_ROD_ABILITY_ID,
  LONG_REACH_ABILITY_ID,
  MARVEL_SCALE_ABILITY_ID,
  MEGA_LAUNCHER_ABILITY_ID,
  MERCILESS_ABILITY_ID,
  MOTOR_DRIVE_ABILITY_ID,
  MULTISCALE_ABILITY_ID,
  NO_ABILITY_ID,
  NO_GUARD_ABILITY_ID,
  OVERGROW_ABILITY_ID,
  PURE_POWER_ABILITY_ID,
  PURIFYING_SALT_ABILITY_ID,
  SAND_VEIL_ABILITY_ID,
  SAP_SIPPER_ABILITY_ID,
  SCRAPPY_ABILITY_ID,
  SAND_FORCE_ABILITY_ID,
  SOLAR_POWER_ABILITY_ID,
  SOLID_ROCK_ABILITY_ID,
  SHELL_ARMOR_ABILITY_ID,
  SNIPER_ABILITY_ID,
  SNOW_CLOAK_ABILITY_ID,
  SOUNDPROOF_ABILITY_ID,
  STRONG_JAW_ABILITY_ID,
  SWARM_ABILITY_ID,
  TECHNICIAN_ABILITY_ID,
  THICK_FAT_ABILITY_ID,
  TORRENT_ABILITY_ID,
  TOUGH_CLAWS_ABILITY_ID,
  SUPER_LUCK_ABILITY_ID,
  UNAWARE_ABILITY_ID,
  UNKNOWN_ABILITY_ID,
  WATER_BUBBLE_ABILITY_ID,
  WATER_ABSORB_ABILITY_ID,
  VOLT_ABSORB_ABILITY_ID,
  abilityDamageModifierIsSupported,
  abilityIsProjectionNeutral,
} from "@/lib/ability"
import type { MoveCategory } from "@/lib/catalog"
import type { PokemonType } from "@/lib/pokemon"

import { chainModifiers, NEUTRAL_MODIFIER } from "./damage-kernel"
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
  typeRewriteBasePower?: number
  typeRewriteActive?: boolean
}

export type CompiledAbilityEffect = {
  damageNegated: boolean
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
    basePower: context.typeRewriteBasePower ?? NEUTRAL_MODIFIER,
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
  let attackerActive = Boolean(context.typeRewriteActive)
  let defenderActive = false
  let damageNegated = false
  const flags = new Set(context.moveFlags)
  const activateImmunity = (matches: boolean) => {
    defenderActive = matches && context.effectiveness > 0
    damageNegated = defenderActive
  }

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
    case OVERGROW_ABILITY_ID:
      attackerActive = context.moveType === "grass"
      if (attackerActive) attackerModifiers.basePower = 6144
      break
    case BLAZE_ABILITY_ID:
      attackerActive = context.moveType === "fire"
      if (attackerActive) attackerModifiers.basePower = 6144
      break
    case TORRENT_ABILITY_ID:
      attackerActive = context.moveType === "water"
      if (attackerActive) attackerModifiers.basePower = 6144
      break
    case SWARM_ABILITY_ID:
      attackerActive = context.moveType === "bug"
      if (attackerActive) attackerModifiers.basePower = 6144
      break
    case GUTS_ABILITY_ID:
      attackerActive = context.category === "physical"
      if (attackerActive) attackerModifiers.attack = 6144
      break
    case MERCILESS_ABILITY_ID:
      attackerModifiers.criticalStage = 3
      break
    case LONG_REACH_ABILITY_ID:
      // Active only when cancelling defender Fluffy's contact facet.
      attackerActive = flags.has("contact") &&
        context.defenderAbilityId === FLUFFY_ABILITY_ID
      break
    case SCRAPPY_ABILITY_ID:
      // Effectiveness is resolved by the Scenario compiler before Held-item gates.
      break
    case FLUFFY_ABILITY_ID:
    case KLUTZ_ABILITY_ID:
      break
  }

  const effectiveContact = flags.has("contact") &&
    context.attackerAbilityId !== LONG_REACH_ABILITY_ID

  switch (context.defenderAbilityId) {
    case FLASH_FIRE_ABILITY_ID:
      activateImmunity(context.moveType === "fire")
      break
    case VOLT_ABSORB_ABILITY_ID:
    case LIGHTNING_ROD_ABILITY_ID:
    case MOTOR_DRIVE_ABILITY_ID:
      activateImmunity(context.moveType === "electric")
      break
    case WATER_ABSORB_ABILITY_ID:
      activateImmunity(context.moveType === "water")
      break
    case SAP_SIPPER_ABILITY_ID:
      activateImmunity(context.moveType === "grass")
      break
    case LEVITATE_ABILITY_ID:
    case EELEVATE_ABILITY_ID:
    case EARTH_EATER_ABILITY_ID:
      activateImmunity(context.moveType === "ground")
      break
    case DRY_SKIN_ABILITY_ID:
      defenderActive = (context.moveType === "water" && context.effectiveness > 0) ||
        context.moveType === "fire"
      if (context.moveType === "water" && context.effectiveness > 0) damageNegated = true
      if (context.moveType === "fire") attackerModifiers.basePower = 5120
      break
    case SOUNDPROOF_ABILITY_ID:
      activateImmunity(flags.has("sound"))
      break
    case BULLETPROOF_ABILITY_ID:
      activateImmunity(flags.has("ballistics"))
      break
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
    case MULTISCALE_ABILITY_ID:
      defenderActive = true
      defenderModifiers.final = 2048
      break
    case MARVEL_SCALE_ABILITY_ID:
      defenderActive = context.category === "physical"
      if (defenderActive) defenderModifiers.defense = 6144
      break
    case FLUFFY_ABILITY_ID: {
      const contactFacet = effectiveContact
      const fireFacet = context.moveType === "fire"
      defenderActive = contactFacet || fireFacet
      if (contactFacet && fireFacet) {
        defenderModifiers.final = chainModifiers([2048, 8192])
      } else if (contactFacet) {
        defenderModifiers.final = 2048
      } else if (fireFacet) {
        defenderModifiers.final = 8192
      }
      break
    }
    case LONG_REACH_ABILITY_ID:
    case KLUTZ_ABILITY_ID:
      break
  }

  const auraActive = context.moveType === "fairy" && (
    context.attackerAbilityId === FAIRY_AURA_ABILITY_ID ||
    context.defenderAbilityId === FAIRY_AURA_ABILITY_ID
  )
  if (auraActive) {
    if (context.attackerAbilityId === FAIRY_AURA_ABILITY_ID) attackerActive = true
    if (context.defenderAbilityId === FAIRY_AURA_ABILITY_ID) defenderActive = true
    attackerModifiers.basePower = chainModifiers([attackerModifiers.basePower, 5448])
  }

  const state = (id: number, active: boolean): TrackSelectionActivation =>
    neutralState(id) ?? (abilityDamageModifierIsSupported(id)
      ? active ? "active" : "inactive"
      : "unsupported")

  return {
    damageNegated,
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
