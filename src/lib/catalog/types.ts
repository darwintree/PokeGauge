import type { PokemonType } from "@/lib/pokemon/types"
import type { BattlePokemonId, UpstreamResourceId } from "@/lib/resources"
import type { HeldItemId } from "@/lib/held-item"

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

export type CatalogAbilityOption = CatalogOption<UpstreamResourceId>

export type Matchup = {
  attackerId: BattlePokemonId
  defenderId: BattlePokemonId
  attackerLabel: string
  defenderLabel: string
  attackerCalcName: string
  defenderCalcName: string
}

export type MatchupCatalog = {
  matchup: Matchup
  /** Selected Battle Pokémon typing used by Move and domain compilation. */
  attackerTypes: PokemonType[]
  defenderTypes: PokemonType[]
  /** All moves in pick share this category — v1 single-category attackers only */
  moveCategory: MoveCategory
  offenseStatLabel: string
  defenseStatLabel: string
  moves: CatalogMoveOption[]
  attackerStats: CatalogOption[]
  attackerItems: CatalogOption<HeldItemId>[]
  defenderItems: CatalogOption<HeldItemId>[]
  attackerAbilities: CatalogAbilityOption[]
  defenderBulks: CatalogOption[]
  defenderAbilities: CatalogAbilityOption[]
  defaultMovePickStatus: "loading" | "ready" | "unavailable"
  defaultAbilityPickStatus: "loading" | "ready"
  defaultMovePoolIds: UpstreamResourceId[]
  defaultMoveIds: UpstreamResourceId[]
  defaultAttackerStatIds: string[]
  defaultAttackerItemIds: HeldItemId[]
  defaultDefenderItemIds: HeldItemId[]
  defaultDefenderIds: string[]
  defaultAttackerAbilityIds: UpstreamResourceId[]
  defaultDefenderAbilityIds: UpstreamResourceId[]
  attackerLockedItemId: HeldItemId | null
  defenderLockedItemId: HeldItemId | null
  attackerLockedAbilityId: UpstreamResourceId | null
  defenderLockedAbilityId: UpstreamResourceId | null
  attackerPreservesItem: boolean
  defenderPreservesItem: boolean
}

export type BattlePokemonOption = {
  id: BattlePokemonId
  speciesId: UpstreamResourceId
  label: string
  species: string
  form: string | null
  isMega: boolean
  types: PokemonType[]
}
