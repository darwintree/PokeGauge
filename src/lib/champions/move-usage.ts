import {
  getAbilityIdByJoinName, getItemIdByJoinName, getMoveIdByJoinName,
  listResources, type BattlePokemonId,
} from "@/lib/resources"
import type {
  ChampionsAbilityUsageRecord, ChampionsItemUsageRecord,
  ChampionsMoveUsageRecord, ChampionsNatureUsageRecord,
} from "./types"
import { loadUsageCache, saveUsageCache, usageFingerprint, type UsageSource } from "@/lib/usage-source-preference"
import { CHAMPIONS_FORMAT, championsBattleRows, type ChampionsBattleApi } from "./upstream"
import { isUsageBuckets, type UsageArtifactBucket } from "./usage-artifact"

type UsageContext = { source: UsageSource; ruleId: string | null; date: string | null }
let context: UsageContext = { source: "champions", ruleId: null, date: null }
const details = new Map<string, Promise<ChampionsBattleApi>>()
const rankings = new Map<string, Promise<BattlePokemonId[]>>()
const usageCache = new Map<string, Promise<ChampionsMoveUsageRecord[]>>()
const abilityUsageCache = new Map<string, Promise<ChampionsAbilityUsageRecord[]>>()
const itemUsageCache = new Map<string, Promise<ChampionsItemUsageRecord[]>>()
const natureUsageCache = new Map<string, Promise<ChampionsNatureUsageRecord[]>>()
let usageFetcher = fetchChampionsMoveUsageOnline
let abilityUsageFetcher = fetchChampionsAbilityUsageOnline
let itemUsageFetcher = fetchChampionsItemUsageOnline
let natureUsageFetcher = fetchChampionsNatureUsageOnline
let pokemonUsageFetcher = fetchPokemonUsageIdsOnline
let jsonFetcher: (url: string) => Promise<unknown> = fetchJsonFromNetwork

function usageUrl(path: string, selected = context): string {
  const query = new URLSearchParams()
  if (selected.ruleId) query.set("rule", selected.ruleId)
  if (selected.source === "pikalytics" && selected.date) query.set("date", selected.date)
  return `/api/usage/${path}${query.size ? `?${query}` : ""}`
}

function detailUrl(id: BattlePokemonId, selected = context): string {
  return usageUrl(`pokemon/${selected.source}/${id}`, selected)
}

export function setUsageSource(source: UsageSource, ruleId?: string | null, extras?: { pikalyticsDate?: string | null }): void {
  context = { source, ruleId: ruleId ?? null, date: source === "pikalytics" ? extras?.pikalyticsDate ?? context.date : null }
  reloadUsageData()
}

export function reloadUsageData(): void {
  for (const cache of [details, rankings, usageCache, abilityUsageCache, itemUsageCache, natureUsageCache]) cache.clear()
}

async function fetchJsonFromNetwork(url: string): Promise<unknown> {
  // A cold API read can resolve a catalog, roster, then detail (each upstream read is bounded).
  const response = await fetch(url, { signal: AbortSignal.timeout(45_000) })
  if (!response.ok) throw new Error(`Usage request failed ${response.status}: ${url}`)
  return response.json()
}

function bucketRows(bucket: UsageArtifactBucket | undefined, category: string) {
  return (bucket ?? []).map(([name, percentage], index) => ({ category, name, percentage_value: percentage, rank: index + 1 }))
}

/** All four consumers share one request, including failures and retries. */
function fetchChampionsBattleData(id: BattlePokemonId): Promise<ChampionsBattleApi> {
  const selected = context
  const url = detailUrl(id, selected)
  let promise = details.get(url)
  if (!promise) {
    promise = jsonFetcher(url).then(entry => {
      if (!isUsageBuckets(entry)) throw new Error("Invalid usage detail")
      return {
        pokemon: String(id), format: CHAMPIONS_FORMAT, season: selected.ruleId ?? "default",
        source: url, dataVersion: selected.date ?? selected.ruleId ?? "",
        rows: [...bucketRows(entry.m, "move"), ...bucketRows(entry.a, "ability"),
          ...bucketRows(entry.i, "held_item"), ...bucketRows(entry.n, "stat_alignment")],
      }
    })
    details.set(url, promise)
    promise.catch(() => { if (details.get(url) === promise) details.delete(url) })
  }
  return promise
}

async function fetchChampionsMoveUsageOnline(
  battlePokemonId: BattlePokemonId,
): Promise<ChampionsMoveUsageRecord[]> {
  const [battleData] = await Promise.all([
    fetchChampionsBattleData(battlePokemonId),
    listResources("move", "en"),
  ])
  if (!battleData) return []

  return championsBattleRows(battleData)
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

  return championsBattleRows(battleData)
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
  return championsBattleRows(battleData)
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

  return championsBattleRows(battleData)
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
  const key = detailUrl(battlePokemonId)
  let promise = usageCache.get(key)
  if (!promise) {
    promise = usageFetcher(battlePokemonId)
    usageCache.set(key, promise)
    promise.catch(() => {
      if (usageCache.get(key) === promise) {
        usageCache.delete(key)
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
  const key = detailUrl(battlePokemonId)
  let promise = abilityUsageCache.get(key)
  if (!promise) {
    promise = abilityUsageFetcher(battlePokemonId)
    abilityUsageCache.set(key, promise)
    promise.catch(() => {
      if (abilityUsageCache.get(key) === promise) {
        abilityUsageCache.delete(key)
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
  const key = detailUrl(battlePokemonId)
  let promise = itemUsageCache.get(key)
  if (!promise) {
    promise = itemUsageFetcher(battlePokemonId)
    itemUsageCache.set(key, promise)
    promise.catch(() => {
      if (itemUsageCache.get(key) === promise) {
        itemUsageCache.delete(key)
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
  const key = detailUrl(battlePokemonId)
  let promise = natureUsageCache.get(key)
  if (!promise) {
    promise = natureUsageFetcher(battlePokemonId)
    natureUsageCache.set(key, promise)
    promise.catch(() => {
      if (natureUsageCache.get(key) === promise) {
        natureUsageCache.delete(key)
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

function rankingFingerprint(ids: BattlePokemonId[], selected: UsageContext): string {
  return usageFingerprint([selected.source, selected.ruleId ?? "", selected.date ?? "", ...ids])
}

export function peekCachedPokemonUsageIds(): BattlePokemonId[] | null {
  return context.ruleId ? loadUsageCache(context.source, context.ruleId, context.date)?.pokemonIds ?? null : null
}

async function fetchPokemonUsageIdsOnline(selected = context): Promise<BattlePokemonId[]> {
  const data = await jsonFetcher(usageUrl(`ranking/${selected.source}`, selected)) as { pokemonIds?: unknown }
  if (!Array.isArray(data?.pokemonIds) || !data.pokemonIds.every(id => Number.isSafeInteger(id) && id > 0)) {
    throw new Error("Invalid usage ranking")
  }
  return data.pokemonIds
}

export async function fetchUsageRanking(options?: { reload?: boolean }): Promise<{ pokemonIds: BattlePokemonId[]; fingerprint: string }> {
  const selected = context
  if (options?.reload) reloadUsageData()
  const pokemonIds = await fetchPokemonUsageIdsOnline(selected)
  return { pokemonIds, fingerprint: rankingFingerprint(pokemonIds, selected) }
}

export function listChampionsPokemonUsageIds(): Promise<BattlePokemonId[]> {
  const selected = context
  const cached = peekCachedPokemonUsageIds()
  if (cached?.length) return Promise.resolve(cached)
  const key = usageUrl(`ranking/${selected.source}`, selected)
  let promise = rankings.get(key)
  if (!promise) {
    promise = pokemonUsageFetcher(selected).then(ids => {
      // A response from a previous selection must not overwrite that selection's refreshed cache.
      if (selected === context && selected.ruleId) saveUsageCache(selected.source, selected.ruleId, {
        fetchedAt: Date.now(), fingerprint: rankingFingerprint(ids, selected), pokemonIds: ids,
      }, selected.date)
      return ids
    })
    rankings.set(key, promise)
    promise.catch(() => { if (rankings.get(key) === promise) rankings.delete(key) })
  }
  return promise
}

export function setChampionsPokemonUsageFetcherForTest(fetcher: () => Promise<BattlePokemonId[]>): void {
  rankings.clear()
  pokemonUsageFetcher = fetcher
}
export function resetChampionsPokemonUsageFetcherForTest(): void {
  rankings.clear()
  pokemonUsageFetcher = fetchPokemonUsageIdsOnline
}
export function setChampionsJsonFetcherForTest(fetcher: (url: string) => Promise<unknown>): void {
  reloadUsageData()
  jsonFetcher = fetcher
}
export function resetChampionsJsonFetcherForTest(): void {
  reloadUsageData()
  jsonFetcher = fetchJsonFromNetwork
}
