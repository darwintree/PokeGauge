import { toID } from "@smogon/calc"

import { CALC_GENERATION } from "@/lib/damage-calculation/calc-constants"

import { GENERATED_ABILITIES } from "@/lib/resources/generated/abilities"

const GENERATED_ABILITY_BY_ID = GENERATED_ABILITIES as Record<
  number,
  { calcAbilityName: string } | undefined
>

/** PokeAPI's stable numeric identifier for Adaptability. */
export const ADAPTABILITY_ABILITY_ID = 91
export const BATTLE_ARMOR_ABILITY_ID = 4
export const VOLT_ABSORB_ABILITY_ID = 10
export const WATER_ABSORB_ABILITY_ID = 11
export const CLOUD_NINE_ABILITY_ID = 13
export const SAND_VEIL_ABILITY_ID = 8
export const COMPOUND_EYES_ABILITY_ID = 14
export const FLASH_FIRE_ABILITY_ID = 18
export const LEVITATE_ABILITY_ID = 26
export const LIGHTNING_ROD_ABILITY_ID = 31
export const SOUNDPROOF_ABILITY_ID = 43
export const HUSTLE_ABILITY_ID = 55
export const GUTS_ABILITY_ID = 62
export const MARVEL_SCALE_ABILITY_ID = 63
export const OVERGROW_ABILITY_ID = 65
export const BLAZE_ABILITY_ID = 66
export const TORRENT_ABILITY_ID = 67
export const SWARM_ABILITY_ID = 68
export const SHELL_ARMOR_ABILITY_ID = 75
export const AIR_LOCK_ABILITY_ID = 76
export const MOTOR_DRIVE_ABILITY_ID = 78
export const SNOW_CLOAK_ABILITY_ID = 81
export const DRY_SKIN_ABILITY_ID = 87
export const SNIPER_ABILITY_ID = 97
export const NO_GUARD_ABILITY_ID = 99
export const SUPER_LUCK_ABILITY_ID = 105
export const UNAWARE_ABILITY_ID = 109
export const SCRAPPY_ABILITY_ID = 113
export const HUGE_POWER_ABILITY_ID = 37
export const THICK_FAT_ABILITY_ID = 47
export const PURE_POWER_ABILITY_ID = 74
export const HEATPROOF_ABILITY_ID = 85
export const IRON_FIST_ABILITY_ID = 89
export const SOLAR_POWER_ABILITY_ID = 94
export const NORMALIZE_ABILITY_ID = 96
export const KLUTZ_ABILITY_ID = 103
export const TECHNICIAN_ABILITY_ID = 101
export const FILTER_ABILITY_ID = 111
export const SOLID_ROCK_ABILITY_ID = 116
export const RECKLESS_ABILITY_ID = 120
export const SHEER_FORCE_ABILITY_ID = 125
export const UNNERVE_ABILITY_ID = 127
export const MULTISCALE_ABILITY_ID = 136
export const INFILTRATOR_ABILITY_ID = 151
export const SAP_SIPPER_ABILITY_ID = 157
export const SAND_FORCE_ABILITY_ID = 159
export const PROTEAN_ABILITY_ID = 168
export const FUR_COAT_ABILITY_ID = 169
export const BULLETPROOF_ABILITY_ID = 171
export const STRONG_JAW_ABILITY_ID = 173
export const REFRIGERATE_ABILITY_ID = 174
export const MEGA_LAUNCHER_ABILITY_ID = 178
export const TOUGH_CLAWS_ABILITY_ID = 181
export const PIXILATE_ABILITY_ID = 182
export const AERILATE_ABILITY_ID = 184
export const FAIRY_AURA_ABILITY_ID = 187
export const MERCILESS_ABILITY_ID = 196
export const WATER_BUBBLE_ABILITY_ID = 199
export const LONG_REACH_ABILITY_ID = 203
export const LIQUID_VOICE_ABILITY_ID = 204
export const GALVANIZE_ABILITY_ID = 206
export const FLUFFY_ABILITY_ID = 218
export const LIBERO_ABILITY_ID = 236
export const PURIFYING_SALT_ABILITY_ID = 272
export const EARTH_EATER_ABILITY_ID = 297
export const SHARPNESS_ABILITY_ID = 292
export const DRAGONIZE_ABILITY_ID = 309
export const MEGA_SOL_ABILITY_ID = 310
export const EELEVATE_ABILITY_ID = 312
export const FIRE_MANE_ABILITY_ID = 313

/** Assumed-Satisfied Ability Selection: Track green-dot disclosure only. */
export type AssumedSatisfiedAbilityFamily =
  | "full-hp"
  | "low-hp"
  | "status"
  | "poisoned"

const ASSUMED_SATISFIED_ABILITY_FAMILY: Record<number, AssumedSatisfiedAbilityFamily> = {
  [MULTISCALE_ABILITY_ID]: "full-hp",
  [OVERGROW_ABILITY_ID]: "low-hp",
  [BLAZE_ABILITY_ID]: "low-hp",
  [TORRENT_ABILITY_ID]: "low-hp",
  [SWARM_ABILITY_ID]: "low-hp",
  [GUTS_ABILITY_ID]: "status",
  [MARVEL_SCALE_ABILITY_ID]: "status",
  [MERCILESS_ABILITY_ID]: "poisoned",
}

export function abilityDamageModifierIsSupported(id: number): boolean {
  const calcAbilityName = GENERATED_ABILITY_BY_ID[id]?.calcAbilityName
  return calcAbilityName === undefined ||
    CALC_GENERATION.abilities.get(toID(calcAbilityName)) !== undefined
}

export function assumedSatisfiedAbilityFamily(
  id: number,
): AssumedSatisfiedAbilityFamily | undefined {
  return ASSUMED_SATISFIED_ABILITY_FAMILY[id]
}

/** Local neutral identity distinct from PokeAPI ids and Unknown ability. */
export const NO_ABILITY_ID = -1

/** Shared neutral sentinel when a Mega Ability relation is unavailable. */
export const UNKNOWN_ABILITY_ID = 0

export const DRIZZLE_ABILITY_ID = 2
export const INTIMIDATE_ABILITY_ID = 22
export const SAND_STREAM_ABILITY_ID = 45
export const DROUGHT_ABILITY_ID = 70
export const SNOW_WARNING_ABILITY_ID = 117
export const DEFIANT_ABILITY_ID = 128
export const COMPETITIVE_ABILITY_ID = 172
export const ELECTRIC_SURGE_ABILITY_ID = 226
export const SAND_SPIT_ABILITY_ID = 245

const PROJECTION_ABILITY_IDS = new Set([
  DRIZZLE_ABILITY_ID,
  INTIMIDATE_ABILITY_ID,
  SAND_STREAM_ABILITY_ID,
  DROUGHT_ABILITY_ID,
  SNOW_WARNING_ABILITY_ID,
  DEFIANT_ABILITY_ID,
  COMPETITIVE_ABILITY_ID,
  ELECTRIC_SURGE_ABILITY_ID,
  SAND_SPIT_ABILITY_ID,
])

export function abilityIsHiddenNeutral(id: string | number): boolean {
  return Number(id) === NO_ABILITY_ID || PROJECTION_ABILITY_IDS.has(Number(id))
}

export function abilityIsProjectionNeutral(id: number): boolean {
  return PROJECTION_ABILITY_IDS.has(id)
}
