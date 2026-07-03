import type { PokemonType } from "@/lib/pokemon/types"
import type { BattlePokemonId, UpstreamResourceId } from "@/lib/resources"

export type MoveCategory = "physical" | "special"

export type CatalogOption<TId extends string | number = string> = {
  id: TId
  label: string
  summary: string
}

export type CatalogMoveOption = CatalogOption<UpstreamResourceId> & {
  moveName: string
  type: PokemonType
  category: MoveCategory
  power: number
  accuracy: number | null
  isSpread: boolean
}

export type MatchupIdentity = {
  attackerId: BattlePokemonId
  defenderId: BattlePokemonId
  attackerLabel: string
  defenderLabel: string
  attackerSpecies: string
  defenderSpecies: string
}

export type MatchupCatalog = {
  matchup: MatchupIdentity
  /** Attacker typing — drives default visible type-boost items in UI */
  attackerTypes: PokemonType[]
  /** All moves in pick share this category — v1 single-category attackers only */
  moveCategory: MoveCategory
  offenseStatLabel: string
  defenseStatLabel: string
  moves: CatalogMoveOption[]
  attackerStats: CatalogOption[]
  attackerItems: CatalogOption[]
  defenderBulks: CatalogOption[]
  defaultMoveIds: UpstreamResourceId[]
  defaultAttackerStatIds: string[]
  defaultAttackerItemIds: string[]
  defaultDefenderIds: string[]
}

export type SpeciesOption = {
  id: BattlePokemonId
  label: string
  species: string
  types: PokemonType[]
}
