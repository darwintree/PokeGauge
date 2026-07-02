import type { SupportedLocale } from "@/lib/i18n"

export type ResourceType = "pokemon" | "move"
export type UpstreamResourceId = number
export type BattlePokemonId = UpstreamResourceId

export type LocalizedResourceBase<TType extends ResourceType> = {
  resourceType: TType
  id: UpstreamResourceId
  locale: SupportedLocale
  name: string
}

export type LocalizedPokemonResource = LocalizedResourceBase<"pokemon"> & {
  battlePokemonId: BattlePokemonId
}

export type LocalizedMoveResource = LocalizedResourceBase<"move">

export type LocalizedResourceByType = {
  pokemon: LocalizedPokemonResource
  move: LocalizedMoveResource
}
