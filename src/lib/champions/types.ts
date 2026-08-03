import type { BattlePokemonId, UpstreamResourceId } from "@/lib/resources"

export type ChampionsBattleFormat = "Doubles" | "Singles"

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
