import type { BattlePokemonId } from "@/lib/resources"

import type { ChampionsBattleFormat } from "./types"

/**
 * Upstream Champions access facts (URLs, index shape, name joining) live here so
 * the runtime reader and the deploy-time compiler share one definition. Drift
 * between the two would silently empty pickers, because the compiler resolves
 * upstream names to local ids and the runtime trusts the result.
 */

export const CHAMPIONS_FORMAT: ChampionsBattleFormat = "Doubles"
export const CHAMPIONS_INDEX_URL = "https://championsbattledata.com/api"

export type ChampionsIndexPokemon = {
  name: string
  slug: string
  battleName: string
  showdownId?: string
  showdownName?: string
  battleDataCsvs?: Array<{
    season: string
    format: ChampionsBattleFormat
    path: string
  }>
  summary?: {
    battleSummary?: Record<
      string,
      Partial<
        Record<ChampionsBattleFormat, {
          top?: { move?: { position?: number; column_position?: number } }
        }>
      >
    >
  }
}

export type ChampionsIndexApi = {
  defaultSeason?: string
  seasons?: string[]
  dataVersion?: string
  pokemon?: ChampionsIndexPokemon[]
}

export type ChampionsBattleRow = {
  category: string
  rank: number
  name: string
  percentage_value?: number | null
  column_position?: number
  position?: number
}

export type ChampionsBattleApi = {
  pokemon: string
  format: ChampionsBattleFormat
  season: string
  source: string
  dataVersion?: string
  data?: ChampionsBattleRow[]
  rows?: ChampionsBattleRow[]
}

export const CHAMPIONS_NAME_OVERRIDES: Partial<Record<BattlePokemonId, string>> = {
  10021: "Landorus Therian",
}

export const CHAMPIONS_POKEMON_ID_OVERRIDES: Record<string, BattlePokemonId> = {
  taurospaldeaaqua: 10252,
  taurospaldeablaze: 10251,
  taurospaldeacombat: 10250,
  vivillonfancy: 666,
}

export function normalizeJoinName(name: string): string {
  return name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
}

export type UsageJoinPokemon = {
  name: string
  pokemonSlug: string
  calcSpeciesName: string
  battlePokemonId: BattlePokemonId
  speciesId: BattlePokemonId
  isMega: boolean
  isBattleOnly: boolean
}

/** Picker-visible identity. Gigantamax and other battle-only forms share calc names with the species. */
function rankingBattlePokemonId(pokemon: UsageJoinPokemon): BattlePokemonId {
  return pokemon.isMega || !pokemon.isBattleOnly ? pokemon.battlePokemonId : pokemon.speciesId
}

/**
 * Identity a per-Pokemon usage read is keyed by. Mega identities are dex-only, so
 * their breakdowns belong to the base species; every other form keeps its own.
 */
export function championsDetailSourceId(pokemon: {
  battlePokemonId: BattlePokemonId
  speciesId: BattlePokemonId
  isMega: boolean
}): BattlePokemonId {
  return pokemon.isMega ? pokemon.speciesId : pokemon.battlePokemonId
}

export function battlePokemonIdsByJoinName(
  pokemon: readonly UsageJoinPokemon[],
): Map<string, BattlePokemonId> {
  const byName = new Map<string, BattlePokemonId>()
  for (const entry of pokemon) {
    const id = rankingBattlePokemonId(entry)
    const isCanonical = entry.battlePokemonId === entry.speciesId && !entry.isMega
    for (const alias of [entry.name, entry.pokemonSlug, entry.calcSpeciesName]) {
      const key = normalizeJoinName(alias)
      if (!key) continue
      if (!byName.has(key) || isCanonical) byName.set(key, id)
    }
  }
  return byName
}

export function championsIndexByName(index: ChampionsIndexApi): Map<string, ChampionsIndexPokemon> {
  return new Map(
    (index.pokemon ?? []).flatMap((pokemon) =>
      [
        pokemon.showdownId,
        pokemon.showdownName,
        pokemon.name,
        pokemon.battleName,
        pokemon.slug,
      ]
        .filter((name): name is string => Boolean(name))
        .map((name) => [normalizeJoinName(name), pokemon] as const),
    ),
  )
}

export function resolveChampionsBattlePokemonId(
  entry: ChampionsIndexPokemon,
  pokemonByName: Map<string, BattlePokemonId>,
): BattlePokemonId | undefined {
  const aliases = [
    entry.showdownId,
    entry.showdownName,
    entry.name,
    entry.battleName,
    entry.slug,
  ]
  return aliases.reduce<BattlePokemonId | undefined>(
    (match, name) =>
      match ??
      (name
        ? CHAMPIONS_POKEMON_ID_OVERRIDES[normalizeJoinName(name)] ??
          pokemonByName.get(normalizeJoinName(name))
        : undefined),
    undefined,
  )
}

export function championsIndexUsageRank(entry: ChampionsIndexPokemon, season: string): number | undefined {
  const row = entry.summary?.battleSummary?.[season]?.[CHAMPIONS_FORMAT]?.top?.move
  return row?.position ?? row?.column_position
}

export function battleRowUsageRank(battle: ChampionsBattleApi): number | undefined {
  const row = (battle.data ?? battle.rows ?? [])[0]
  // Battle rows use column_position for the Pokemon's usage rank; `rank` is the move/item slot.
  return row?.column_position ?? row?.position
}

/** Resolve the season to read, preferring the user-selected rule. */
export function championsSeason(
  ruleId: string | null,
  index: { defaultSeason?: string },
): string {
  return ruleId ?? index.defaultSeason ?? "Current"
}

export function championsBattleRowsUrl(
  entry: Pick<ChampionsIndexPokemon, "battleName" | "name">,
  season: string,
): string {
  return `https://championsbattledata.com/api/battle/${CHAMPIONS_FORMAT}/${encodeURIComponent(entry.battleName || entry.name)}?season=${encodeURIComponent(season)}`
}

/** Battle rows for both upstream payload keys. */
export function championsBattleRows(battle: ChampionsBattleApi): ChampionsBattleRow[] {
  return battle.data ?? battle.rows ?? []
}
