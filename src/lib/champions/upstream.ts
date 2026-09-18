import { toBucket, type UsageArtifactBuckets } from "./usage-artifact"
import type { BattlePokemonId } from "../resources/types"

import type { ChampionsBattleFormat } from "./types"

/**
 * Upstream Champions access facts (URLs, index shape, name joining) live here so
 * the runtime reader and the deploy-time compiler share one definition. Drift
 * between the two would silently empty pickers, because the compiler resolves
 * upstream names to local ids and the runtime trusts the result.
 */

export const CHAMPIONS_FORMAT: ChampionsBattleFormat = "Doubles"
export { CHAMPIONS_INDEX_URL } from "../usage-rules"

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
 * Preferred usage identity: Mega recommendations use the base species.
 * Readers can use the selected form when the source has no base record.
 */
export function usageDetailSourceId(pokemon: {
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
  for (const name of aliases) {
    if (!name) continue
    const key = normalizeJoinName(name)
    const id = CHAMPIONS_POKEMON_ID_OVERRIDES[key] ?? pokemonByName.get(key)
    if (id !== undefined) return id
  }
  return undefined
}

export function championsIndexUsageRank(entry: ChampionsIndexPokemon, season: string): number | undefined {
  const row = entry.summary?.battleSummary?.[season]?.[CHAMPIONS_FORMAT]?.top?.move
  return row?.position ?? row?.column_position
}

export function battleRowUsageRank(battle: Pick<ChampionsBattleApi, "data" | "rows">): number | undefined {
  const row = (battle.data ?? battle.rows ?? [])[0]
  // Battle rows use column_position for the Pokemon's usage rank; `rank` is the move/item slot.
  return row?.column_position ?? row?.position
}

export function championsBattleRowsUrl(
  entry: Pick<ChampionsIndexPokemon, "battleName" | "name">,
  season: string,
): string {
  return `https://championsbattledata.com/api/battle/${CHAMPIONS_FORMAT}/${encodeURIComponent(entry.battleName || entry.name)}?season=${encodeURIComponent(season)}`
}

/** Battle rows for both upstream payload keys. */
export function championsBattleRows(battle: Pick<ChampionsBattleApi, "data" | "rows">): ChampionsBattleRow[] {
  return battle.data ?? battle.rows ?? []
}

function smogonPercent(value: unknown, total: number): number | null {
  return typeof value === "number" && total > 0 ? (value / total) * 100 : null
}
function smogonRows(data: Record<string, unknown> | null, key: string): Array<[string, number]> {
  const values = data?.[key]
  if (!values || typeof values !== "object") return []
  return Object.entries(values as Record<string, unknown>).flatMap(([name, value]) => typeof value === "number" ? [[name, value]] : [])
}
export function smogonRowsWithPercent(data: Record<string, unknown> | null, key: string): Array<[string, number, number | null]> {
  const rows = smogonRows(data, key)
  const total = rows.reduce((sum, [, value]) => sum + value, 0)
  return rows.sort(([, a], [, b]) => b - a).map(([name, value]) => [name, value, smogonPercent(value, total)])
}

/** Keep the strongest spread per nature: weaker repeats cannot affect preset/category inference. */
export function smogonNatureRows(data: Record<string, unknown> | null): Array<[string, number, number | null]> {
  const seen = new Set<string>()
  return smogonRowsWithPercent(data, "Spreads").flatMap(([spread, value, percentage]) => {
    const nature = spread.split(":")[0]
    if (seen.has(nature)) return []
    seen.add(nature)
    return [[nature, value, percentage] as [string, number, number | null]]
  })
}

export type PikalyticsEntry = {
  name: string
  rank: string
  percent: string
  abilities: Array<{ ability: string; percent: string }> | null
  items: Array<{ item: string; percent: string }> | null
  moves: Array<{ move: string; percent: string }> | null
  natures: Array<{ nature: string; percent: string }> | null
}

export function pikalyticsPercent(value: string | undefined): number | null {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

/** Both the compiler and API retain all named rows; the client resolves local IDs. */
export function championsBuckets(battle: Pick<ChampionsBattleApi, "data" | "rows">): UsageArtifactBuckets {
  if (!Array.isArray(battle.data ?? battle.rows)) throw new Error("Invalid Champions detail")
  const rows = championsBattleRows(battle)
  const bucket = (category: string) => toBucket(rows.filter(row => row.category === category)
    .toSorted((a, b) => a.rank - b.rank)
    .map(row => ({ name: row.name, percentage: row.percentage_value })))
  return { m: bucket("move"), a: bucket("ability"), i: bucket("held_item"), n: bucket("stat_alignment") }
}

export function smogonBuckets(data: Record<string, unknown>): UsageArtifactBuckets {
  const bucket = (key: string) => toBucket((key === "Spreads" ? smogonNatureRows(data) : smogonRowsWithPercent(data, key))
    .map(([name, , percentage]) => ({ name, percentage })))
  return { m: bucket("Moves"), a: bucket("Abilities"), i: bucket("Items"), n: bucket("Spreads") }
}

export function pikalyticsBuckets(entry: PikalyticsEntry): UsageArtifactBuckets {
  if (typeof entry?.name !== "string" || ![entry.moves, entry.abilities, entry.items].every(Array.isArray)) {
    throw new Error("Invalid Pikalytics detail")
  }
  return {
    m: toBucket(entry.moves?.map(r => ({ name: r.move, percentage: pikalyticsPercent(r.percent) }))),
    a: toBucket(entry.abilities?.map(r => ({ name: r.ability, percentage: pikalyticsPercent(r.percent) }))),
    i: toBucket(entry.items?.map(r => ({ name: r.item, percentage: pikalyticsPercent(r.percent) }))),
    n: toBucket(entry.natures?.map(r => ({ name: r.nature, percentage: pikalyticsPercent(r.percent) }))),
  }
}
