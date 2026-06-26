import type { PokemonType } from "@/lib/pokemon/types"

export type MoveCategory = "physical" | "special"

export type CatalogOption = {
  id: string
  label: string
  summary: string
}

export type CatalogMoveOption = CatalogOption & {
  moveName: string
  type: PokemonType
}

export type MatchupIdentity = {
  attackerId: string
  defenderId: string
  attackerLabel: string
  defenderLabel: string
  attackerSpecies: string
  defenderSpecies: string
}

export type MatchupCatalog = {
  matchup: MatchupIdentity
  /** All moves in pick share this category — v1 single-category attackers only */
  moveCategory: MoveCategory
  offenseStatLabel: "物攻" | "特攻"
  defenseStatLabel: "物防" | "特防"
  moves: CatalogMoveOption[]
  attackerStats: CatalogOption[]
  attackerItems: CatalogOption[]
  defenderBulks: CatalogOption[]
  defaultMoveIds: string[]
  defaultAttackerStatIds: string[]
  defaultAttackerItemIds: string[]
  defaultDefenderIds: string[]
}

export type SpeciesOption = {
  id: string
  label: string
  species: string
  types: PokemonType[]
}
