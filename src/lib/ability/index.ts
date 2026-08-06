/** PokeAPI's stable numeric identifier for Adaptability. */
export const ADAPTABILITY_ABILITY_ID = 91

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
