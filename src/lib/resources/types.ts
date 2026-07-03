import type { SupportedLocale } from "@/lib/i18n"
import type { PokemonType } from "@/lib/pokemon/types"

export type ResourceType = "pokemon" | "move"
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
  pokemonSlug: string
  speciesSlug: string
  calcSpeciesName: string
  names: LocalizedNames
  speciesNames: LocalizedNames
  formNames: Partial<LocalizedNames>
  types: PokemonType[]
  baseStats: BattleStats
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
  damageKind: DamageKind
  target: string
  isSpread: boolean
}

export type GeneratedResourceDiagnostics = {
  generatedAt: string
  source: "pokeapi"
  pokemonIds: BattlePokemonId[]
  moveIds: UpstreamResourceId[]
  missingLocaleNames: Array<{
    resourceType: ResourceType | "pokemon-species" | "pokemon-form"
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

export type LocalizedResourceBase<TType extends ResourceType> = {
  resourceType: TType
  id: UpstreamResourceId
  locale: SupportedLocale
  name: string
}

export type LocalizedPokemonResource = LocalizedResourceBase<"pokemon"> & {
  battlePokemonId: BattlePokemonId
  calcSpeciesName: string
  types: PokemonType[]
  baseStats: BattleStats
}

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
}
