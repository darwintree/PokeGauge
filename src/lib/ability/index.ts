/** PokeAPI's stable numeric identifier for Adaptability. */
export const ADAPTABILITY_ABILITY_ID = 91

/** Local neutral identity distinct from PokeAPI ids and Unknown ability. */
export const NO_ABILITY_ID = -1

/** Shared neutral sentinel when a Mega Ability relation is unavailable. */
export const UNKNOWN_ABILITY_ID = 0

export function abilityIsHiddenNeutral(id: string | number): boolean {
  return Number(id) === NO_ABILITY_ID
}
