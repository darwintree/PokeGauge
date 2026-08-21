import type { PokemonType } from "@/lib/pokemon"
import type { BattlePokemonId, UpstreamResourceId } from "@/lib/resources"
import type { HeldItemId } from "@/lib/held-item"
import type { OffensePresetId } from "./preset-labels"

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

export type CatalogAbilityOption = CatalogOption<UpstreamResourceId> & {
  accessibleLabel?: string
}

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
  /** Historical-Learnset subset used by the Move Picker's default display filter. */
  moveCandidates: CatalogMoveOption[]
  attackerItems: CatalogOption<HeldItemId>[]
  defenderItems: CatalogOption<HeldItemId>[]
  attackerAbilities: CatalogAbilityOption[]
  defenderAbilities: CatalogAbilityOption[]
  defaultMovePickStatus: "loading" | "ready" | "unavailable"
  defaultAbilityPickStatus: "loading" | "ready"
  defaultItemPickStatus: "loading" | "ready" | "unavailable"
  defaultStatPickStatus: "loading" | "ready"
  defaultOffensePresetId: OffensePresetId
  defaultMovePoolIds: UpstreamResourceId[]
  defaultMoveIds: UpstreamResourceId[]
  defaultAttackerItemPoolIds: HeldItemId[]
  defaultDefenderItemPoolIds: HeldItemId[]
  defaultAttackerItemIds: HeldItemId[]
  defaultDefenderItemIds: HeldItemId[]
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
