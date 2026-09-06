/** PokeAPI's stable numeric identifier for Adaptability. */
export const ADAPTABILITY_ABILITY_ID = 91
export const BATTLE_ARMOR_ABILITY_ID = 4
export const VOLT_ABSORB_ABILITY_ID = 10
export const WATER_ABSORB_ABILITY_ID = 11
export const CLOUD_NINE_ABILITY_ID = 13
export const SAND_VEIL_ABILITY_ID = 8
export const COMPOUND_EYES_ABILITY_ID = 14
export const FLASH_FIRE_ABILITY_ID = 18
export const ROUGH_SKIN_ABILITY_ID = 24
export const LEVITATE_ABILITY_ID = 26
export const LIGHTNING_ROD_ABILITY_ID = 31
export const SOUNDPROOF_ABILITY_ID = 43
export const HUSTLE_ABILITY_ID = 55
export const GUTS_ABILITY_ID = 62
export const MARVEL_SCALE_ABILITY_ID = 63
export const PLUS_ABILITY_ID = 57
export const MINUS_ABILITY_ID = 58
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
export const TOXIC_BOOST_ABILITY_ID = 137
export const FLARE_BOOST_ABILITY_ID = 138
export const ANALYTIC_ABILITY_ID = 148
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
export const SHADOW_SHIELD_ABILITY_ID = 231
export const WATER_BUBBLE_ABILITY_ID = 199
export const LONG_REACH_ABILITY_ID = 203
export const LIQUID_VOICE_ABILITY_ID = 204
export const GALVANIZE_ABILITY_ID = 206
export const FLUFFY_ABILITY_ID = 218
export const LIBERO_ABILITY_ID = 236
export const PURIFYING_SALT_ABILITY_ID = 272
export const EARTH_EATER_ABILITY_ID = 297
export const SHARPNESS_ABILITY_ID = 292
export const SUPREME_OVERLORD_ABILITY_ID = 293
export const TERA_SHELL_ABILITY_ID = 305
export const DRAGONIZE_ABILITY_ID = 309
export const MEGA_SOL_ABILITY_ID = 310
export const EELEVATE_ABILITY_ID = 312
export const FIRE_MANE_ABILITY_ID = 313

export type AbilitySupport =
  | "supported"
  | "assumed-satisfied"
  | "unsupported"
  | "none"

export type AssumedSatisfiedAbilityFamily =
  | "full-hp"
  | "low-hp"
  | "status"
  | "target-poisoned"
  | "self-poisoned"
  | "burned"
  | "partner"
  | "last-move"

const ASSUMED_SATISFIED_ABILITY_FAMILY: Record<number, AssumedSatisfiedAbilityFamily> = {
  [PLUS_ABILITY_ID]: "partner",
  [MINUS_ABILITY_ID]: "partner",
  [MULTISCALE_ABILITY_ID]: "full-hp",
  [OVERGROW_ABILITY_ID]: "low-hp",
  [BLAZE_ABILITY_ID]: "low-hp",
  [TORRENT_ABILITY_ID]: "low-hp",
  [SWARM_ABILITY_ID]: "low-hp",
  [GUTS_ABILITY_ID]: "status",
  [MARVEL_SCALE_ABILITY_ID]: "status",
  [TOXIC_BOOST_ABILITY_ID]: "self-poisoned",
  [FLARE_BOOST_ABILITY_ID]: "burned",
  [ANALYTIC_ABILITY_ID]: "last-move",
  [MERCILESS_ABILITY_ID]: "target-poisoned",
  [SHADOW_SHIELD_ABILITY_ID]: "full-hp",
  [TERA_SHELL_ABILITY_ID]: "full-hp",
}

const UNSUPPORTED_ABILITY_IDS = new Set([
  // Generation III
  6, 16, 19, 20, 24, 29, 32, 35, 38, 41, 44, 49, 59, 60, 61, 73,
  // Generation IV
  77, 79, 82, 86, 90, 92, 93, 98, 102, 104, 112, 115, 121,
  // Generation V
  126, 130, 133, 134, 135, 139, 142, 143, 145, 147, 152, 160, 161, 162, 163, 164,
  // Generation VI
  166, 167, 185, 189, 190, 191,
  // Generation VII
  192, 195, 197, 198, 201, 209, 211, 212, 213, 214, 217, 219, 225, 227, 228, 229,
  230,
  // Generation VIII
  240, 247, 248, 249, 250, 251, 254, 256, 257, 258, 261, 263, 266, 267,
  // Generation IX
  268, 269, 270, 271, 275, 277, 278, 279, 280, 281, 282, 290, 291, 293, 294, 295,
  296, 299, 300, 302, 303, 304, 306, 307, 309, 310, 311, 312, 313,
])

const NONE_ABILITY_IDS = new Set([
  // Generation III
  1, 3, 5, 7, 9, 12, 15, 17, 21, 23, 27, 28, 30, 33, 34, 36, 39, 40, 42, 46, 48,
  50, 51, 52, 53, 54, 56, 64, 69, 71, 72,
  // Generation IV
  80, 83, 84, 95, 100, 106, 107, 108, 118, 119, 123,
  // Generation V
  124, 129, 131, 132, 140, 141, 144, 146, 149, 150, 153, 154, 155, 156, 158,
  // Generation VI
  165, 170, 175, 176, 177, 180, 183,
  // Generation VII
  193, 194, 202, 205, 207, 208, 210, 215, 216, 220, 221, 222, 223, 224,
  // Generation VIII
  237, 238, 239, 241, 242, 243, 253, 259, 260, 264, 265,
  // Generation IX
  283, 298, 301, 308,
])

export function abilitySupport(id: number): AbilitySupport {
  if (ASSUMED_SATISFIED_ABILITY_FAMILY[id]) return "assumed-satisfied"
  if (UNSUPPORTED_ABILITY_IDS.has(id)) return "unsupported"
  if (NONE_ABILITY_IDS.has(id)) return "none"
  return "supported"
}

export function abilityIsSelectable(id: number): boolean {
  return abilitySupport(id) !== "none"
}

export function abilityEffectIsSupported(id: number): boolean {
  const support = abilitySupport(id)
  return support === "supported" || support === "assumed-satisfied"
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
export const OBLIVIOUS_ABILITY_ID = 12
export const OWN_TEMPO_ABILITY_ID = 20
export const CLEAR_BODY_ABILITY_ID = 29
export const INNER_FOCUS_ABILITY_ID = 39
export const HYPER_CUTTER_ABILITY_ID = 52
export const WHITE_SMOKE_ABILITY_ID = 73
export const SIMPLE_ABILITY_ID = 86
export const CONTRARY_ABILITY_ID = 126
export const FULL_METAL_BODY_ABILITY_ID = 230
export const GUARD_DOG_ABILITY_ID = 275
export const SAND_STREAM_ABILITY_ID = 45
export const DROUGHT_ABILITY_ID = 70
export const SNOW_WARNING_ABILITY_ID = 117
export const DEFIANT_ABILITY_ID = 128
export const COMPETITIVE_ABILITY_ID = 172
export const ELECTRIC_SURGE_ABILITY_ID = 226
export const PSYCHIC_SURGE_ABILITY_ID = 227
export const MISTY_SURGE_ABILITY_ID = 228
export const GRASSY_SURGE_ABILITY_ID = 229
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
  PSYCHIC_SURGE_ABILITY_ID,
  MISTY_SURGE_ABILITY_ID,
  GRASSY_SURGE_ABILITY_ID,
  SAND_SPIT_ABILITY_ID,
])

export function abilityIsHiddenNeutral(id: string | number): boolean {
  return Number(id) === NO_ABILITY_ID || PROJECTION_ABILITY_IDS.has(Number(id))
}

export function abilityIsProjectionNeutral(id: number): boolean {
  return PROJECTION_ABILITY_IDS.has(id)
}
