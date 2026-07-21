import {
  getAbilityIdByJoinName,
  getMoveIdByJoinName,
  getResource,
  listResources,
  type BattlePokemonId,
  type ChampionsAbilityUsageRecord,
  type ChampionsBattleFormat,
  type ChampionsMoveUsageRecord,
} from "@/lib/resources"

const CHAMPIONS_FORMAT: ChampionsBattleFormat = "Doubles"
const CHAMPIONS_INDEX_URL = "https://championsbattledata.com/api"

type ChampionsIndexPokemon = {
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

const CHAMPIONS_POKEMON_ID_OVERRIDES: Record<string, BattlePokemonId> = {
  taurospaldeaaqua: 10252,
  taurospaldeablaze: 10251,
  taurospaldeacombat: 10250,
  vivillonfancy: 666,
}

const usageCache = new Map<BattlePokemonId, Promise<ChampionsMoveUsageRecord[]>>()
let usageFetcher: (battlePokemonId: BattlePokemonId) => Promise<ChampionsMoveUsageRecord[]> =
  fetchChampionsMoveUsageOnline
const abilityUsageCache = new Map<BattlePokemonId, Promise<ChampionsAbilityUsageRecord[]>>()
let abilityUsageFetcher: (
  battlePokemonId: BattlePokemonId,
) => Promise<ChampionsAbilityUsageRecord[]> = fetchChampionsAbilityUsageOnline
let pokemonUsagePromise: Promise<BattlePokemonId[]> | undefined
let pokemonUsageFetcher: () => Promise<BattlePokemonId[]> = fetchChampionsPokemonUsageOnline

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

async function fetchChampionsPokemonUsageOnline(): Promise<BattlePokemonId[]> {
  const [pokemon, index] = await Promise.all([
    listResources("pokemon", "en"),
    fetchJson<ChampionsIndexApi>(CHAMPIONS_INDEX_URL),
  ])
  const pokemonByName = new Map(
    pokemon.flatMap((resource) =>
      [resource.name, resource.pokemonSlug, resource.calcSpeciesName].map(
        (name) => [normalizeJoinName(name), resource.battlePokemonId] as const,
      ),
    ),
  )
  const season = index.defaultSeason ?? "Current"
  const ranked = (index.pokemon ?? [])
    .flatMap((entry) => {
      const row = entry.summary?.battleSummary?.[season]?.[CHAMPIONS_FORMAT]?.top?.move
      const rank = row?.position ?? row?.column_position
      const aliases = [
        entry.showdownId,
        entry.showdownName,
        entry.name,
        entry.battleName,
        entry.slug,
      ]
      const id = aliases.reduce<BattlePokemonId | undefined>(
        (match, name) =>
          match ??
          (name
            ? CHAMPIONS_POKEMON_ID_OVERRIDES[normalizeJoinName(name)] ??
              pokemonByName.get(normalizeJoinName(name))
            : undefined),
        undefined,
      )
      return rank === undefined || id === undefined ? [] : [{ id, rank }]
    })
    .sort((a, b) => a.rank - b.rank)

  return [...new Set(ranked.map(({ id }) => id))]
}

async function fetchChampionsBattleRows(
  pokemon: ChampionsIndexPokemon,
  defaultSeason: string,
): Promise<ChampionsBattleApi | null> {
  const season =
    pokemon.battleDataCsvs?.find((entry) => entry.format === CHAMPIONS_FORMAT)?.season ??
    defaultSeason
  const url = `https://championsbattledata.com/api/battle/${CHAMPIONS_FORMAT}/${encodeURIComponent(pokemon.battleName || pokemon.name)}?season=${encodeURIComponent(season)}`
  return fetchJson<ChampionsBattleApi>(url)
}

async function fetchChampionsBattleData(
  battlePokemonId: BattlePokemonId,
): Promise<ChampionsBattleApi | null> {
  const [pokemon, index] = await Promise.all([
    getResource("pokemon", battlePokemonId, "en"),
    fetchJson<ChampionsIndexApi>(CHAMPIONS_INDEX_URL),
  ])
  const preferredName = CHAMPIONS_NAME_OVERRIDES[battlePokemonId] ?? pokemon.name
  const championsPokemon = championsIndexByName(index).get(normalizeJoinName(preferredName))
  return championsPokemon
    ? fetchChampionsBattleRows(championsPokemon, index.defaultSeason ?? "Current")
    : null
}

async function fetchChampionsMoveUsageOnline(
  battlePokemonId: BattlePokemonId,
): Promise<ChampionsMoveUsageRecord[]> {
  const battleData = await fetchChampionsBattleData(battlePokemonId)
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

async function fetchChampionsAbilityUsageOnline(
  battlePokemonId: BattlePokemonId,
): Promise<ChampionsAbilityUsageRecord[]> {
  const [battleData] = await Promise.all([
    fetchChampionsBattleData(battlePokemonId),
    listResources("ability", "en"),
  ])
  if (!battleData) return []

  return (battleData.data ?? battleData.rows ?? [])
    .filter((row) => row.category === "ability")
    .flatMap((row) => {
      const abilityId = getAbilityIdByJoinName(row.name)
      if (abilityId == null) return []
      return [{
        battlePokemonId,
        abilityId,
        format: CHAMPIONS_FORMAT,
        season: battleData.season,
        source: battleData.source,
        rank: row.rank,
        percentage: row.percentage_value ?? null,
        championsAbilityName: row.name,
      }]
    })
}

export async function listChampionsMoveUsageRecords(
  battlePokemonId: BattlePokemonId,
): Promise<ChampionsMoveUsageRecord[]> {
  let promise = usageCache.get(battlePokemonId)
  if (!promise) {
    promise = usageFetcher(battlePokemonId)
    usageCache.set(battlePokemonId, promise)
    promise.catch(() => {
      if (usageCache.get(battlePokemonId) === promise) {
        usageCache.delete(battlePokemonId)
      }
    })
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

export async function listChampionsAbilityUsageRecords(
  battlePokemonId: BattlePokemonId,
): Promise<ChampionsAbilityUsageRecord[]> {
  let promise = abilityUsageCache.get(battlePokemonId)
  if (!promise) {
    promise = abilityUsageFetcher(battlePokemonId)
    abilityUsageCache.set(battlePokemonId, promise)
    promise.catch(() => {
      if (abilityUsageCache.get(battlePokemonId) === promise) {
        abilityUsageCache.delete(battlePokemonId)
      }
    })
  }
  return promise
}

export function setChampionsAbilityUsageFetcherForTest(
  fetcher: (battlePokemonId: BattlePokemonId) => Promise<ChampionsAbilityUsageRecord[]>,
): void {
  abilityUsageCache.clear()
  abilityUsageFetcher = fetcher
}

export function resetChampionsAbilityUsageFetcherForTest(): void {
  abilityUsageCache.clear()
  abilityUsageFetcher = fetchChampionsAbilityUsageOnline
}

export function listChampionsPokemonUsageIds(): Promise<BattlePokemonId[]> {
  pokemonUsagePromise ??= pokemonUsageFetcher()
  return pokemonUsagePromise
}

export function setChampionsPokemonUsageFetcherForTest(
  fetcher: () => Promise<BattlePokemonId[]>,
): void {
  pokemonUsagePromise = undefined
  pokemonUsageFetcher = fetcher
}

export function resetChampionsPokemonUsageFetcherForTest(): void {
  pokemonUsagePromise = undefined
  pokemonUsageFetcher = fetchChampionsPokemonUsageOnline
}
