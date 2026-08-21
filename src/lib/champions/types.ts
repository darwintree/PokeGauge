import type { BattlePokemonId, UpstreamResourceId } from "@/lib/resources"

export type ChampionsBattleFormat = "Doubles" | "Singles"

export type ChampionsMoveUsageRecord = {
  battlePokemonId: BattlePokemonId
  moveId: UpstreamResourceId
  format: ChampionsBattleFormat
  season: string
  source: string
  dataVersion: string
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

export type ChampionsItemUsageRecord = {
  battlePokemonId: BattlePokemonId
  /** null when Champions names `nothing` or an unmapped item identity. */
  itemId: UpstreamResourceId | null
  format: ChampionsBattleFormat
  season: string
  source: string
  dataVersion: string
  rank: number
  percentage: number | null
  championsItemName: string
}

export type ChampionsNatureUsageRecord = {
  battlePokemonId: BattlePokemonId
  format: ChampionsBattleFormat
  season: string
  source: string
  dataVersion: string
  rank: number
  percentage: number | null
  nature: string
}
