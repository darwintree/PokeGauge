import {
  getMoveIdByJoinName,
  getResource,
  type BattlePokemonId,
  type ChampionsBattleFormat,
  type ChampionsMoveUsageRecord,
} from "@/lib/resources"

const CHAMPIONS_FORMAT: ChampionsBattleFormat = "Doubles"
const CHAMPIONS_INDEX_URL = "https://championsbattledata.com/api"

type ChampionsIndexPokemon = {
  name: string
  slug: string
  battleName: string
  battleDataCsvs?: Array<{
    season: string
    format: ChampionsBattleFormat
    path: string
  }>
}

type ChampionsIndexApi = {
  defaultSeason?: string
  pokemon?: ChampionsIndexPokemon[]
}

type ChampionsBattleRow = {
  category: string
  rank: number
  name: string
  percentage_value?: number | null
}

type ChampionsBattleApi = {
  pokemon: string
  format: ChampionsBattleFormat
  season: string
  source: string
  data?: ChampionsBattleRow[]
  rows?: ChampionsBattleRow[]
}

const CHAMPIONS_NAME_OVERRIDES: Partial<Record<BattlePokemonId, string>> = {
  10021: "Landorus Therian",
}

const usageCache = new Map<BattlePokemonId, Promise<ChampionsMoveUsageRecord[]>>()
let usageFetcher: (battlePokemonId: BattlePokemonId) => Promise<ChampionsMoveUsageRecord[]> =
  fetchChampionsMoveUsageOnline

function normalizeJoinName(name: string): string {
  return name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Champions API request failed ${response.status}: ${url}`)
  return response.json() as Promise<T>
}

function championsIndexByName(index: ChampionsIndexApi): Map<string, ChampionsIndexPokemon> {
  return new Map(
    (index.pokemon ?? []).flatMap((pokemon) =>
      [pokemon.name, pokemon.battleName, pokemon.slug]
        .filter(Boolean)
        .map((name) => [normalizeJoinName(name), pokemon] as const),
    ),
  )
}

async function fetchChampionsBattleRows(
  pokemon: ChampionsIndexPokemon,
  defaultSeason: string,
): Promise<ChampionsBattleApi | null> {
  const season =
    pokemon.battleDataCsvs?.find((entry) => entry.format === CHAMPIONS_FORMAT)?.season ??
    defaultSeason
  const url = `https://championsbattledata.com/api/battle/${CHAMPIONS_FORMAT}/${encodeURIComponent(pokemon.battleName || pokemon.name)}?season=${encodeURIComponent(season)}`
  try {
    return await fetchJson<ChampionsBattleApi>(url)
  } catch {
    return null
  }
}

async function fetchChampionsMoveUsageOnline(
  battlePokemonId: BattlePokemonId,
): Promise<ChampionsMoveUsageRecord[]> {
  const [pokemon, index] = await Promise.all([
    getResource("pokemon", battlePokemonId, "en"),
    fetchJson<ChampionsIndexApi>(CHAMPIONS_INDEX_URL),
  ])
  const defaultSeason = index.defaultSeason ?? "Current"
  const preferredName = CHAMPIONS_NAME_OVERRIDES[battlePokemonId] ?? pokemon.name
  const championsPokemon = championsIndexByName(index).get(normalizeJoinName(preferredName))
  if (!championsPokemon) return []

  const battleData = await fetchChampionsBattleRows(championsPokemon, defaultSeason)
  if (!battleData) return []

  return (battleData.data ?? battleData.rows ?? [])
    .filter((row) => row.category === "move")
    .flatMap((row) => {
      const moveId = getMoveIdByJoinName(row.name)
      if (moveId == null) return []
      return [{
        battlePokemonId,
        moveId,
        format: CHAMPIONS_FORMAT,
        season: battleData.season,
        source: battleData.source,
        rank: row.rank,
        percentage: row.percentage_value ?? null,
        championsMoveName: row.name,
      }]
    })
}

export async function listChampionsMoveUsageRecords(
  battlePokemonId: BattlePokemonId,
): Promise<ChampionsMoveUsageRecord[]> {
  let promise = usageCache.get(battlePokemonId)
  if (!promise) {
    promise = usageFetcher(battlePokemonId).catch(() => [])
    usageCache.set(battlePokemonId, promise)
  }
  return promise
}

export function setChampionsMoveUsageFetcherForTest(
  fetcher: (battlePokemonId: BattlePokemonId) => Promise<ChampionsMoveUsageRecord[]>,
): void {
  usageCache.clear()
  usageFetcher = fetcher
}

export function resetChampionsMoveUsageFetcherForTest(): void {
  usageCache.clear()
  usageFetcher = fetchChampionsMoveUsageOnline
}
