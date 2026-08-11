/** PokeAPI's stable numeric identifier for Adaptability. */
export const ADAPTABILITY_ABILITY_ID = 91
export const BATTLE_ARMOR_ABILITY_ID = 4
export const SAND_VEIL_ABILITY_ID = 8
export const COMPOUND_EYES_ABILITY_ID = 14
export const HUSTLE_ABILITY_ID = 55
export const GUTS_ABILITY_ID = 62
export const MARVEL_SCALE_ABILITY_ID = 63
export const OVERGROW_ABILITY_ID = 65
export const BLAZE_ABILITY_ID = 66
export const TORRENT_ABILITY_ID = 67
export const SWARM_ABILITY_ID = 68
export const SHELL_ARMOR_ABILITY_ID = 75
export const SNOW_CLOAK_ABILITY_ID = 81
export const SNIPER_ABILITY_ID = 97
export const NO_GUARD_ABILITY_ID = 99
export const SUPER_LUCK_ABILITY_ID = 105
export const UNAWARE_ABILITY_ID = 109
export const HUGE_POWER_ABILITY_ID = 37
export const THICK_FAT_ABILITY_ID = 47
export const PURE_POWER_ABILITY_ID = 74
export const HEATPROOF_ABILITY_ID = 85
export const IRON_FIST_ABILITY_ID = 89
export const SOLAR_POWER_ABILITY_ID = 94
export const NORMALIZE_ABILITY_ID = 96
export const TECHNICIAN_ABILITY_ID = 101
export const FILTER_ABILITY_ID = 111
export const SOLID_ROCK_ABILITY_ID = 116
export const RECKLESS_ABILITY_ID = 120
export const SHEER_FORCE_ABILITY_ID = 125
export const MULTISCALE_ABILITY_ID = 136
export const INFILTRATOR_ABILITY_ID = 151
export const SAND_FORCE_ABILITY_ID = 159
export const PROTEAN_ABILITY_ID = 168
export const FUR_COAT_ABILITY_ID = 169
export const STRONG_JAW_ABILITY_ID = 173
export const REFRIGERATE_ABILITY_ID = 174
export const MEGA_LAUNCHER_ABILITY_ID = 178
export const TOUGH_CLAWS_ABILITY_ID = 181
export const PIXILATE_ABILITY_ID = 182
export const AERILATE_ABILITY_ID = 184
export const FAIRY_AURA_ABILITY_ID = 187
export const MERCILESS_ABILITY_ID = 196
export const WATER_BUBBLE_ABILITY_ID = 199
export const LIQUID_VOICE_ABILITY_ID = 204
export const GALVANIZE_ABILITY_ID = 206
export const LIBERO_ABILITY_ID = 236
export const PURIFYING_SALT_ABILITY_ID = 272
export const SHARPNESS_ABILITY_ID = 292
export const DRAGONIZE_ABILITY_ID = 309
export const FIRE_MANE_ABILITY_ID = 313

export const DAMAGE_MODIFIER_ABILITY_IDS = new Set([
  BATTLE_ARMOR_ABILITY_ID,
  SAND_VEIL_ABILITY_ID,
  COMPOUND_EYES_ABILITY_ID,
  HUSTLE_ABILITY_ID,
  GUTS_ABILITY_ID,
  MARVEL_SCALE_ABILITY_ID,
  OVERGROW_ABILITY_ID,
  BLAZE_ABILITY_ID,
  TORRENT_ABILITY_ID,
  SWARM_ABILITY_ID,
  SHELL_ARMOR_ABILITY_ID,
  SNOW_CLOAK_ABILITY_ID,
  SNIPER_ABILITY_ID,
  NO_GUARD_ABILITY_ID,
  SUPER_LUCK_ABILITY_ID,
  ADAPTABILITY_ABILITY_ID,
  UNAWARE_ABILITY_ID,
  HUGE_POWER_ABILITY_ID,
  THICK_FAT_ABILITY_ID,
  PURE_POWER_ABILITY_ID,
  HEATPROOF_ABILITY_ID,
  IRON_FIST_ABILITY_ID,
  SOLAR_POWER_ABILITY_ID,
  NORMALIZE_ABILITY_ID,
  TECHNICIAN_ABILITY_ID,
  FILTER_ABILITY_ID,
  SOLID_ROCK_ABILITY_ID,
  MULTISCALE_ABILITY_ID,
  INFILTRATOR_ABILITY_ID,
  SAND_FORCE_ABILITY_ID,
  PROTEAN_ABILITY_ID,
  FUR_COAT_ABILITY_ID,
  STRONG_JAW_ABILITY_ID,
  REFRIGERATE_ABILITY_ID,
  MEGA_LAUNCHER_ABILITY_ID,
  TOUGH_CLAWS_ABILITY_ID,
  PIXILATE_ABILITY_ID,
  AERILATE_ABILITY_ID,
  FAIRY_AURA_ABILITY_ID,
  MERCILESS_ABILITY_ID,
  WATER_BUBBLE_ABILITY_ID,
  LIQUID_VOICE_ABILITY_ID,
  GALVANIZE_ABILITY_ID,
  LIBERO_ABILITY_ID,
  PURIFYING_SALT_ABILITY_ID,
  DRAGONIZE_ABILITY_ID,
  FIRE_MANE_ABILITY_ID,
])

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
  return DAMAGE_MODIFIER_ABILITY_IDS.has(id)
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
