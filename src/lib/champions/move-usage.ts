import {
  getAbilityIdByJoinName,
  getItemIdByJoinName,
  getMoveIdByJoinName,
  getResource,
  listResources,
  type BattlePokemonId,
} from "@/lib/resources"
import type {
  ChampionsAbilityUsageRecord,
  ChampionsBattleFormat,
  ChampionsItemUsageRecord,
  ChampionsMoveUsageRecord,
  ChampionsNatureUsageRecord,
} from "./types"
import type { UsageSource } from "@/lib/usage-source-preference"

const CHAMPIONS_FORMAT: ChampionsBattleFormat = "Doubles"
const CHAMPIONS_INDEX_URL = "https://championsbattledata.com/api"
// Smogon publishes the Pokémon Champions VGC ladder separately from Doubles OU.
// Use the all-rating aggregate so it is comparable to the unfiltered Champions source.

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
  dataVersion?: string
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
  dataVersion?: string
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
const itemUsageCache = new Map<BattlePokemonId, Promise<ChampionsItemUsageRecord[]>>()
let itemUsageFetcher: (battlePokemonId: BattlePokemonId) => Promise<ChampionsItemUsageRecord[]> =
  fetchChampionsItemUsageOnline
const natureUsageCache = new Map<BattlePokemonId, Promise<ChampionsNatureUsageRecord[]>>()
let natureUsageFetcher: (
  battlePokemonId: BattlePokemonId,
) => Promise<ChampionsNatureUsageRecord[]> = fetchChampionsNatureUsageOnline
let pokemonUsagePromise: Promise<BattlePokemonId[]> | undefined
let pokemonUsageFetcher: () => Promise<BattlePokemonId[]> = fetchChampionsPokemonUsageOnline
let championsIndexPromise: Promise<ChampionsIndexApi> | undefined
const battleRowsCache = new Map<BattlePokemonId, Promise<ChampionsBattleApi | null>>()
let jsonFetcher: (url: string) => Promise<unknown> = fetchJsonFromNetwork
let usageSource: UsageSource = "champions"
let smogonPokemonUsagePromise: Promise<BattlePokemonId[]> | undefined
const smogonChaosCache = new Map<BattlePokemonId, Promise<Record<string, unknown> | null>>()
export function setUsageSource(source: UsageSource): void {
  usageSource = source
  usageCache.clear()
  abilityUsageCache.clear()
  itemUsageCache.clear()
  natureUsageCache.clear()
  pokemonUsagePromise = undefined
  smogonPokemonUsagePromise = undefined
  smogonChaosCache.clear()
}
export function getUsageSource(): UsageSource { return usageSource }

function normalizeJoinName(name: string): string {
  return name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
}

async function fetchJsonFromNetwork<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Champions API request failed ${response.status}: ${url}`)
  return response.json() as Promise<T>
}

async function fetchJson<T>(url: string): Promise<T> {
  return jsonFetcher(url) as Promise<T>
}

function fetchChampionsIndex(): Promise<ChampionsIndexApi> {
  championsIndexPromise ??= fetchJson<ChampionsIndexApi>(CHAMPIONS_INDEX_URL)
  championsIndexPromise.catch(() => {
    championsIndexPromise = undefined
  })
  return championsIndexPromise
}

function championsIndexByName(index: ChampionsIndexApi): Map<string, ChampionsIndexPokemon> {
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

async function fetchChampionsPokemonUsageOnline(): Promise<BattlePokemonId[]> {
  const [pokemon, index] = await Promise.all([
    listResources("pokemon", "en"),
    fetchChampionsIndex(),
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
async function fetchSmogonPokemonUsageOnline(): Promise<BattlePokemonId[]> {
  const pokemon = await listResources("pokemon", "en")
  const byName = new Map(pokemon.flatMap((resource) => [resource.name, resource.pokemonSlug, resource.calcSpeciesName].map((name) => [normalizeJoinName(name), resource.battlePokemonId] as const)))
  const response = await fetchJson<{ data?: Record<string, Record<string, unknown>> }>("/api/smogon/latest")
  const data = response.data ?? {}
  return Object.entries(data)
    .sort(([, a], [, b]) => Number(b.usage ?? 0) - Number(a.usage ?? 0))
    .flatMap(([name]) => {
      const id = byName.get(normalizeJoinName(name))
      return id == null ? [] : [id]
    })
}

async function fetchSmogonChaos(battlePokemonId: BattlePokemonId): Promise<Record<string, unknown> | null> {
  const resource = await getResource("pokemon", battlePokemonId, "en")
  const slug = normalizeJoinName(resource.calcSpeciesName || resource.name)
  try {
    const response = await fetchJson<{ data?: Record<string, Record<string, unknown>> }>("/api/smogon/latest")
    const data = response.data ?? {}
    return data[resource.name] ?? data[slug] ?? Object.entries(data).find(([name]) => normalizeJoinName(name) === slug)?.[1] ?? null
  } catch { return null }
}

function smogonPercent(value: unknown, total: number): number | null {
  return typeof value === "number" && total > 0 ? (value / total) * 100 : null
}
function smogonRows(data: Record<string, unknown> | null, key: string): Array<[string, number]> {
  const values = data?.[key]
  if (!values || typeof values !== "object") return []
  return Object.entries(values as Record<string, unknown>).flatMap(([name, value]) => typeof value === "number" ? [[name, value]] : [])
}
function smogonRowsWithPercent(data: Record<string, unknown> | null, key: string): Array<[string, number, number | null]> {
  const rows = smogonRows(data, key)
  const total = rows.reduce((sum, [, value]) => sum + value, 0)
  return rows.sort(([, a], [, b]) => b - a).map(([name, value]) => [name, value, smogonPercent(value, total)])
}

async function fetchSmogonMoveUsageOnline(id: BattlePokemonId): Promise<ChampionsMoveUsageRecord[]> {
  const data = await fetchSmogonChaos(id); return smogonRowsWithPercent(data, "Moves").map(([name, , percentage], index) => ({ battlePokemonId: id, moveId: getMoveIdByJoinName(name) ?? -1, format: "Doubles" as const, season: "latest", source: "Smogon", dataVersion: "chaos", rank: index + 1, percentage, championsMoveName: name })).filter((row) => row.moveId !== -1)
}
async function fetchSmogonAbilityUsageOnline(id: BattlePokemonId): Promise<ChampionsAbilityUsageRecord[]> {
  const data = await fetchSmogonChaos(id); return smogonRowsWithPercent(data, "Abilities").map(([name, , percentage], index) => ({ battlePokemonId: id, abilityId: getAbilityIdByJoinName(name) ?? -1, format: "Doubles" as const, season: "latest", source: "Smogon", rank: index + 1, percentage, championsAbilityName: name })).filter((row) => row.abilityId !== -1)
}
async function fetchSmogonItemUsageOnline(id: BattlePokemonId): Promise<ChampionsItemUsageRecord[]> {
  const data = await fetchSmogonChaos(id); return smogonRowsWithPercent(data, "Items").map(([name, , percentage], index) => ({ battlePokemonId: id, itemId: getItemIdByJoinName(name) ?? null, format: "Doubles", season: "latest", source: "Smogon", dataVersion: "chaos", rank: index + 1, percentage, championsItemName: name }))
}
async function fetchSmogonNatureUsageOnline(id: BattlePokemonId): Promise<ChampionsNatureUsageRecord[]> {
  const data = await fetchSmogonChaos(id); return smogonRowsWithPercent(data, "Spreads").map(([name, , percentage], index) => ({ battlePokemonId: id, format: "Doubles", season: "latest", source: "Smogon", dataVersion: "chaos", rank: index + 1, percentage, nature: name.split(":")[0] }))
}

async function fetchPikalyticsMarkdown(path: string): Promise<string> {
  const response = await fetch(`/api/pikalytics/${path}`)
  if (!response.ok) throw new Error(`Pikalytics request failed ${response.status}`)
  return response.text()
}
function pikalyticsRows(markdown: string, heading: string): Array<[string, number]> {
  const section = markdown.split(`## ${heading}`)[1]?.split(/^## /m)[0] ?? ""
  return [...section.matchAll(/^[-*] \*\*(.+?)\*\*: ([0-9.]+)%/gm)].map(([, name, value]) => [name, Number(value)])
}
async function fetchPikalyticsPokemonUsageOnline(): Promise<BattlePokemonId[]> {
  const pokemon = await listResources("pokemon", "en")
  const byName = new Map(pokemon.flatMap((resource) => [resource.name, resource.pokemonSlug, resource.calcSpeciesName].map((name) => [normalizeJoinName(name), resource.battlePokemonId] as const)))
  const markdown = await fetchPikalyticsMarkdown("format")
  return [...markdown.matchAll(/^\| (\d+) \| \*\*(.+?)\*\* \| ([0-9.]+)%/gm)].sort((a, b) => Number(a[1]) - Number(b[1])).flatMap(([, , name]) => { const id = byName.get(normalizeJoinName(name)); return id == null ? [] : [id] })
}
async function fetchPikalyticsUsage(id: BattlePokemonId, heading: string): Promise<Array<[string, number]>> {
  const resource = await getResource("pokemon", id, "en")
  return pikalyticsRows(await fetchPikalyticsMarkdown(encodeURIComponent(resource.calcSpeciesName || resource.name)), heading)
}
async function fetchPikalyticsMoveUsageOnline(id: BattlePokemonId): Promise<ChampionsMoveUsageRecord[]> { return (await fetchPikalyticsUsage(id, "Common Moves")).map(([name, percentage], index) => ({ battlePokemonId: id, moveId: getMoveIdByJoinName(name) ?? -1, format: "Doubles" as const, season: "latest", source: "Pikalytics", dataVersion: "ai-markdown", rank: index + 1, percentage, championsMoveName: name })).filter((row) => row.moveId !== -1) }
async function fetchPikalyticsAbilityUsageOnline(id: BattlePokemonId): Promise<ChampionsAbilityUsageRecord[]> { return (await fetchPikalyticsUsage(id, "Common Abilities")).map(([name, percentage], index) => ({ battlePokemonId: id, abilityId: getAbilityIdByJoinName(name) ?? -1, format: "Doubles" as const, season: "latest", source: "Pikalytics", dataVersion: "ai-markdown", rank: index + 1, percentage, championsAbilityName: name })).filter((row) => row.abilityId !== -1) }
async function fetchPikalyticsItemUsageOnline(id: BattlePokemonId): Promise<ChampionsItemUsageRecord[]> { return (await fetchPikalyticsUsage(id, "Common Items")).map(([name, percentage], index) => ({ battlePokemonId: id, itemId: getItemIdByJoinName(name) ?? null, format: "Doubles" as const, season: "latest", source: "Pikalytics", dataVersion: "ai-markdown", rank: index + 1, percentage, championsItemName: name })) }

async function fetchChampionsBattleRows(
  pokemon: ChampionsIndexPokemon,
  season: string,
): Promise<ChampionsBattleApi> {
  const url = `https://championsbattledata.com/api/battle/${CHAMPIONS_FORMAT}/${encodeURIComponent(pokemon.battleName || pokemon.name)}?season=${encodeURIComponent(season)}`
  return fetchJson<ChampionsBattleApi>(url)
}

async function fetchChampionsBattleData(
  battlePokemonId: BattlePokemonId,
): Promise<ChampionsBattleApi | null> {
  const [pokemon, index] = await Promise.all([
    getResource("pokemon", battlePokemonId, "en"),
    fetchChampionsIndex(),
  ])
  const sourceId = pokemon.isMega ? pokemon.speciesId : battlePokemonId
  let promise = battleRowsCache.get(sourceId)
  if (!promise) {
    promise = fetchChampionsSourceBattleData(sourceId, index)
    battleRowsCache.set(sourceId, promise)
    promise.catch(() => {
      if (battleRowsCache.get(sourceId) === promise) {
        battleRowsCache.delete(sourceId)
      }
    })
  }
  return promise
}

async function fetchChampionsSourceBattleData(
  sourceId: BattlePokemonId,
  index: ChampionsIndexApi,
): Promise<ChampionsBattleApi | null> {
  const pokemon = await getResource("pokemon", sourceId, "en")
  const preferredName = CHAMPIONS_NAME_OVERRIDES[sourceId] ?? pokemon.name
  const championsPokemon = championsIndexByName(index).get(normalizeJoinName(preferredName))
  if (!championsPokemon) return null
  const battleData = await fetchChampionsBattleRows(
    championsPokemon,
    index.defaultSeason ?? "Current",
  )
  return { ...battleData, dataVersion: index.dataVersion ?? "" }
}

async function fetchChampionsMoveUsageOnline(
  battlePokemonId: BattlePokemonId,
): Promise<ChampionsMoveUsageRecord[]> {
  const [battleData] = await Promise.all([
    fetchChampionsBattleData(battlePokemonId),
    listResources("move", "en"),
  ])
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
        dataVersion: battleData.dataVersion ?? "",
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

async function fetchChampionsItemUsageOnline(
  battlePokemonId: BattlePokemonId,
): Promise<ChampionsItemUsageRecord[]> {
  const battleData = await fetchChampionsBattleData(battlePokemonId)
  if (!battleData) return []

  // Champions emits `held_item` (not `item`); keep unmapped/`nothing` rows with null itemId
  // so the top-10 boundary can skip without backfill.
  return (battleData.data ?? battleData.rows ?? [])
    .filter((row) => row.category === "held_item")
    .map((row) => ({
      battlePokemonId,
      itemId: getItemIdByJoinName(row.name) ?? null,
      format: CHAMPIONS_FORMAT,
      season: battleData.season,
      source: battleData.source,
      dataVersion: battleData.dataVersion ?? "",
      rank: row.rank,
      percentage: row.percentage_value ?? null,
      championsItemName: row.name,
    }))
}

async function fetchChampionsNatureUsageOnline(
  battlePokemonId: BattlePokemonId,
): Promise<ChampionsNatureUsageRecord[]> {
  const battleData = await fetchChampionsBattleData(battlePokemonId)
  if (!battleData) return []

  return (battleData.data ?? battleData.rows ?? [])
    .filter((row) => row.category === "stat_alignment")
    .map((row) => ({
      battlePokemonId,
      format: CHAMPIONS_FORMAT,
      season: battleData.season,
      source: battleData.source,
      dataVersion: battleData.dataVersion ?? "",
      rank: row.rank,
      percentage: row.percentage_value ?? null,
      nature: row.name,
    }))
}

export async function listChampionsMoveUsageRecords(
  battlePokemonId: BattlePokemonId,
): Promise<ChampionsMoveUsageRecord[]> {
  if (usageSource === "smogon") return fetchSmogonMoveUsageOnline(battlePokemonId)
  if (usageSource === "pikalytics") return fetchPikalyticsMoveUsageOnline(battlePokemonId)
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
  if (usageSource === "smogon") return fetchSmogonAbilityUsageOnline(battlePokemonId)
  if (usageSource === "pikalytics") return fetchPikalyticsAbilityUsageOnline(battlePokemonId)
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

export async function listChampionsItemUsageRecords(
  battlePokemonId: BattlePokemonId,
): Promise<ChampionsItemUsageRecord[]> {
  if (usageSource === "smogon") return fetchSmogonItemUsageOnline(battlePokemonId)
  if (usageSource === "pikalytics") return fetchPikalyticsItemUsageOnline(battlePokemonId)
  let promise = itemUsageCache.get(battlePokemonId)
  if (!promise) {
    promise = itemUsageFetcher(battlePokemonId)
    itemUsageCache.set(battlePokemonId, promise)
    promise.catch(() => {
      if (itemUsageCache.get(battlePokemonId) === promise) {
        itemUsageCache.delete(battlePokemonId)
      }
    })
  }
  return promise
}

export function setChampionsItemUsageFetcherForTest(
  fetcher: (battlePokemonId: BattlePokemonId) => Promise<ChampionsItemUsageRecord[]>,
): void {
  itemUsageCache.clear()
  itemUsageFetcher = fetcher
}

export function resetChampionsItemUsageFetcherForTest(): void {
  itemUsageCache.clear()
  itemUsageFetcher = fetchChampionsItemUsageOnline
}

export async function listChampionsNatureUsageRecords(
  battlePokemonId: BattlePokemonId,
): Promise<ChampionsNatureUsageRecord[]> {
  if (usageSource === "smogon") return fetchSmogonNatureUsageOnline(battlePokemonId)
  let promise = natureUsageCache.get(battlePokemonId)
  if (!promise) {
    promise = natureUsageFetcher(battlePokemonId)
    natureUsageCache.set(battlePokemonId, promise)
    promise.catch(() => {
      if (natureUsageCache.get(battlePokemonId) === promise) {
        natureUsageCache.delete(battlePokemonId)
      }
    })
  }
  return promise
}

export function setChampionsNatureUsageFetcherForTest(
  fetcher: (battlePokemonId: BattlePokemonId) => Promise<ChampionsNatureUsageRecord[]>,
): void {
  natureUsageCache.clear()
  natureUsageFetcher = fetcher
}

export function resetChampionsNatureUsageFetcherForTest(): void {
  natureUsageCache.clear()
  natureUsageFetcher = fetchChampionsNatureUsageOnline
}

export function listChampionsPokemonUsageIds(): Promise<BattlePokemonId[]> {
  if (usageSource === "smogon") { smogonPokemonUsagePromise ??= fetchSmogonPokemonUsageOnline(); smogonPokemonUsagePromise.catch(() => { smogonPokemonUsagePromise = undefined }); return smogonPokemonUsagePromise }
  if (usageSource === "pikalytics") { smogonPokemonUsagePromise ??= fetchPikalyticsPokemonUsageOnline(); smogonPokemonUsagePromise.catch(() => { smogonPokemonUsagePromise = undefined }); return smogonPokemonUsagePromise }
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

export function setChampionsJsonFetcherForTest(
  fetcher: (url: string) => Promise<unknown>,
): void {
  championsIndexPromise = undefined
  battleRowsCache.clear()
  usageCache.clear()
  abilityUsageCache.clear()
  itemUsageCache.clear()
  natureUsageCache.clear()
  pokemonUsagePromise = undefined
  jsonFetcher = fetcher
}

export function resetChampionsJsonFetcherForTest(): void {
  championsIndexPromise = undefined
  battleRowsCache.clear()
  usageCache.clear()
  abilityUsageCache.clear()
  itemUsageCache.clear()
  natureUsageCache.clear()
  pokemonUsagePromise = undefined
  jsonFetcher = fetchJsonFromNetwork
}
