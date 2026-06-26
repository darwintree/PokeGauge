/** PROTOTYPE — typing lookups until catalog carries structured types */

import type { PokemonType } from "./pokemon-types"

const SPECIES_TYPES: Record<string, PokemonType[]> = {
  garchomp: ["dragon", "ground"],
  "landorus-therian": ["ground", "flying"],
  "flutter-mane": ["ghost", "fairy"],
  incineroar: ["fire", "dark"],
  amoonguss: ["grass", "poison"],
  rillaboom: ["grass"],
}

const MOVE_TYPES: Record<string, PokemonType> = {
  earthquake: "ground",
  "dragon-claw": "dragon",
  "stone-edge": "rock",
  "rock-slide": "rock",
  "stomping-tantrum": "ground",
  moonblast: "fairy",
  "shadow-ball": "ghost",
  "dazzling-gleam": "fairy",
}

export function speciesTypes(speciesId: string): PokemonType[] {
  return SPECIES_TYPES[speciesId] ?? []
}

export function moveType(moveId: string): PokemonType | undefined {
  return MOVE_TYPES[moveId]
}
