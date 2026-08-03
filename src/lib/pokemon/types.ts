/** 18 Pokémon types — domain ids; colors live in global styles `--pokemon-type-*` tokens. */

export const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const

export type PokemonType = (typeof POKEMON_TYPES)[number]
