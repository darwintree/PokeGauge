import type { SupportedLocale } from "@/lib/i18n"
import type { PokemonType } from "@/lib/pokemon/types"

export type ResourceType = "pokemon" | "move" | "ability"
export type UpstreamResourceId = number
export type BattlePokemonId = UpstreamResourceId
export type DamageKind = "damage" | "damage+ailment" | "damage+lower" | "damage+raise" | "ohko" | "unique" | string
export type MoveDamageClass = "physical" | "special" | "status"
export type ChampionsBattleFormat = "Doubles" | "Singles"

export type LocalizedNames = Record<SupportedLocale, string>

export type BattleStats = {
  hp: number
  atk: number
  def: number
  spa: number
  spd: number
  spe: number
}

export type NormalizedBattlePokemon = {
  resourceType: "pokemon"
  id: BattlePokemonId
  speciesId: UpstreamResourceId
  isBattleOnly: boolean
  isMega: boolean
  pokemonSlug: string
  speciesSlug: string
  calcSpeciesName: string
  names: LocalizedNames
  speciesNames: LocalizedNames
  formNames: Partial<LocalizedNames>
  types: PokemonType[]
  abilityIds: UpstreamResourceId[]
  baseStats: BattleStats
}

export type NormalizedAbility = {
  resourceType: "ability"
  id: UpstreamResourceId
  slug: string
  names: LocalizedNames
}

export type NormalizedItem = {
  resourceType: "item"
  id: UpstreamResourceId
  slug: string
  names: LocalizedNames
}

export type NormalizedMove = {
  resourceType: "move"
  id: UpstreamResourceId
  slug: string
  calcMoveName: string
  names: LocalizedNames
  type: PokemonType | string
  category: MoveDamageClass
  power: number | null
  accuracy: number | null
  minHits?: number
  maxHits?: number
  critRate?: number
  damageKind: DamageKind
  target: string
  isSpread: boolean
}

export type GeneratedResourceDiagnostics = {
  source: "pokeapi"
  pokemonIds: BattlePokemonId[]
  moveIds: UpstreamResourceId[]
  abilityIds: UpstreamResourceId[]
  itemIds: UpstreamResourceId[]
  missingLocaleNames: Array<{
    resourceType: ResourceType | "item" | "pokemon-species" | "pokemon-form"
    id: UpstreamResourceId
    locale: SupportedLocale
    fallbackLocale?: SupportedLocale
  }>
  unsupportedBattleIdentities: Array<{
    id: UpstreamResourceId
    reason: string
  }>
}

export type ChampionsMoveUsageRecord = {
  battlePokemonId: BattlePokemonId
  moveId: UpstreamResourceId
  format: ChampionsBattleFormat
  season: string
  source: string
  rank: number
  percentage: number | null
  championsMoveName: string
}

export type ChampionsAbilityUsageRecord = {
  battlePokemonId: BattlePokemonId
  abilityId: UpstreamResourceId
  format: ChampionsBattleFormat
  season: string
  source: string
  rank: number
  percentage: number | null
  championsAbilityName: string
}

export type LocalizedResourceBase<TType extends ResourceType> = {
  resourceType: TType
  id: UpstreamResourceId
  locale: SupportedLocale
  name: string
}

export type LocalizedPokemonResource = LocalizedResourceBase<"pokemon"> & {
  battlePokemonId: BattlePokemonId
  speciesId: UpstreamResourceId
  speciesName: string
  formName: string | null
  isBattleOnly: boolean
  isMega: boolean
  pokemonSlug: string
  calcSpeciesName: string
  types: PokemonType[]
  abilityIds: UpstreamResourceId[]
  baseStats: BattleStats
}

export type LocalizedAbilityResource = LocalizedResourceBase<"ability">

export type LocalizedMoveResource = LocalizedResourceBase<"move"> & {
  calcMoveName: string
  type: PokemonType | string
  category: MoveDamageClass
  power: number | null
  accuracy: number | null
  damageKind: DamageKind
  target: string
  isSpread: boolean
}

export type LocalizedResourceByType = {
  pokemon: LocalizedPokemonResource
  move: LocalizedMoveResource
  ability: LocalizedAbilityResource
}
