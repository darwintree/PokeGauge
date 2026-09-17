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
  ChampionsItemUsageRecord,
  ChampionsMoveUsageRecord,
  ChampionsNatureUsageRecord,
} from "./types"
import type { UsageSource } from "@/lib/usage-source-preference"
import {
  loadUsageCache,
  saveUsageCache,
  usageFingerprint,
} from "@/lib/usage-source-preference"
import {
  CHAMPIONS_FORMAT,
  CHAMPIONS_INDEX_URL,
  CHAMPIONS_NAME_OVERRIDES,
  battlePokemonIdsByJoinName,
  battleRowUsageRank,
  championsBattleRows,
  championsBattleRowsUrl,
  usageDetailSourceId,
  championsIndexByName,
  championsIndexUsageRank,
  championsSeason,
  normalizeJoinName,
  resolveChampionsBattlePokemonId,
  smogonRowsWithPercent,
  smogonNatureRows,
  pikalyticsPercent,
  type PikalyticsEntry,
  type ChampionsBattleApi,
  type ChampionsBattleRow,
  type ChampionsIndexApi,
  type ChampionsIndexPokemon,
  type UsageJoinPokemon,
} from "./upstream"
import { loadUsageArtifact, loadUsageManifest, reloadUsageArtifacts } from "./artifact-client"
import type { UsageArtifact, UsageArtifactBucket } from "./usage-artifact"

// Smogon publishes the Pokémon Champions VGC ladder separately from Doubles OU.
// Use the all-rating aggregate so it is comparable to the unfiltered Champions source.

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
let usageRuleId: string | null = null
let pikalyticsDate: string | null = null
let smogonPokemonUsagePromise: Promise<BattlePokemonId[]> | undefined
let pikalyticsPokemonUsagePromise: Promise<BattlePokemonId[]> | undefined

/** Drop every cached usage result so the next read reflects current state. */
function clearUsageCaches(): void {
  usageCache.clear()
  abilityUsageCache.clear()
  itemUsageCache.clear()
  natureUsageCache.clear()
  battleRowsCache.clear()
  pokemonUsagePromise = undefined
  smogonPokemonUsagePromise = undefined
  pikalyticsPokemonUsagePromise = undefined
  resetPikalyticsCache()
  smogonDataCache.clear()
}

export function setUsageSource(
  source: UsageSource,
  ruleId?: string | null,
  extras?: { pikalyticsDate?: string | null },
): void {
  usageSource = source
  usageRuleId = ruleId ?? null
  if (extras && "pikalyticsDate" in extras) pikalyticsDate = extras.pikalyticsDate ?? null
  else if (source !== "pikalytics") pikalyticsDate = null
  clearUsageCaches()
}

function smogonStatsUrl(): string {
  if (!usageRuleId) return "/api/smogon/latest"
  const sep = usageRuleId.indexOf("/")
  if (sep <= 0) return "/api/smogon/latest"
  return `/api/smogon/${usageRuleId.slice(0, sep)}/chaos/${usageRuleId.slice(sep + 1)}.json`
}

function pikalyticsRosterUrl(): string {
  if (usageRuleId && pikalyticsDate) return `/api/pikalytics/l/${pikalyticsDate}/${usageRuleId}`
  return "/api/pikalytics/latest"
}

function pikalyticsPokemonUrl(name: string): string {
  if (usageRuleId && pikalyticsDate) {
    return `/api/pikalytics/p/${pikalyticsDate}/${usageRuleId}/${encodeURIComponent(name)}`
  }
  return `/api/pikalytics/pokemon/${encodeURIComponent(name)}`
}

/** Map an artifact bucket back to battle rows so the detail readers stay shared. */
function artifactBucketRows(
  bucket: UsageArtifactBucket | undefined,
  category: string,
): ChampionsBattleRow[] {
  if (!bucket?.length) return []
  return bucket.map(([name, percentage], index) => ({
    category,
    rank: index + 1,
    name,
    percentage_value: percentage,
  }))
}

/**
 * Rebuild a battle payload from the compiled artifact. Everything downstream of
 * this point — the four detail readers, their generated-table joins, and the
 * ranking sort — is shared with proxy mode, so artifact and proxy reads cannot
 * diverge in shape.
 */
function battleDataFromArtifact(
  artifact: UsageArtifact,
  battlePokemonId: BattlePokemonId,
): ChampionsBattleApi | null {
  const entry = artifact.pokemon[String(battlePokemonId)]
  if (!entry) return null
  return {
    pokemon: String(battlePokemonId),
    format: artifact.format,
    season: artifact.rule,
    source: `usage/${artifact.source}/${artifact.rule}.json`,
    dataVersion: artifact.dataVersion,
    rows: [
      ...artifactBucketRows(entry.m, "move"),
      ...artifactBucketRows(entry.a, "ability"),
      ...artifactBucketRows(entry.i, "held_item"),
      ...artifactBucketRows(entry.n, "stat_alignment"),
    ],
  }
}

/**
 * The rule whose artifact applies to the current read.
 *
 * A cold start has no explicit rule yet, but the champion source still resolves
 * one (the upstream default season). The manifest carries that default, so the
 * artifact stays usable before the store has picked a rule.
 */
async function compiledRuleId(): Promise<string | null> {
  if (usageRuleId) return usageRuleId
  const manifest = await loadUsageManifest(usageSource)
  return manifest?.defaultId ?? null
}

/** Re-read `(source, rule)` data, bypassing every in-memory cache. */
export function reloadUsageData(): void {
  reloadUsageArtifacts()
  championsIndexPromise = undefined
  // Detail caches are keyed by Pokemon id alone, not by `(source, rule)`, so a
  // reload must drop them or a manual refresh would re-fetch the artifact and
  // still serve the previous breakdown for every Pokemon.
  clearUsageCaches()
}

async function loadCompiledArtifact(reload = false): Promise<UsageArtifact | null> {
  const rule = await compiledRuleId()
  if (!rule) return null
  return loadUsageArtifact(usageSource, rule, { reload })
}

export function peekCachedPokemonUsageIds(): BattlePokemonId[] | null {
  if (!usageRuleId) return null
  const snapshot = loadUsageCache(usageSource, usageRuleId)
  return snapshot?.pokemonIds ?? null
}

function rememberRanking(pokemonIds: BattlePokemonId[]): void {
  if (!usageRuleId) return
  saveUsageCache(usageSource, usageRuleId, {
    fetchedAt: Date.now(),
    fingerprint: rankingFingerprint(pokemonIds),
    pokemonIds,
  })
}

function rankingFingerprint(pokemonIds: BattlePokemonId[]): string {
  return usageFingerprint([usageSource, usageRuleId ?? "", pikalyticsDate ?? "", ...pokemonIds])
}

/**
 * Bound every usage request so its promise always settles.
 *
 * The detail caches store the in-flight promise and only evict it on rejection.
 * A request that never settles would therefore stay cached for the whole
 * session, and every later read — including a retry after the caller's own
 * timeout fired — would await the same dead promise. Timing out here guarantees
 * the cache sees a rejection and can drop it.
 */
const USAGE_REQUEST_TIMEOUT_MS = 15_000

async function fetchJsonFromNetwork<T>(url: string): Promise<T> {
  const response = await fetch(url, { signal: AbortSignal.timeout(USAGE_REQUEST_TIMEOUT_MS) })
  if (!response.ok) throw new Error(`Usage request failed ${response.status}: ${url}`)
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

async function mapInBatches<T, R>(
  items: T[],
  batchSize: number,
  mapper: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = []
  for (let i = 0; i < items.length; i += batchSize) {
    out.push(...await Promise.all(items.slice(i, i + batchSize).map(mapper)))
  }
  return out
}

async function rankChampionsPokemonFromBattleRows(
  entries: ChampionsIndexPokemon[],
  season: string,
  pokemonByName: Map<string, BattlePokemonId>,
): Promise<Array<{ id: BattlePokemonId; rank: number }>> {
  const battleByName = new Map<string, Promise<ChampionsBattleApi | null>>()
  const rows = await mapInBatches(entries, 8, async (entry) => {
    const id = resolveChampionsBattlePokemonId(entry, pokemonByName)
    if (id === undefined) return []
    const key = entry.battleName || entry.name
    let battlePromise = battleByName.get(key)
    if (!battlePromise) {
      battlePromise = fetchChampionsBattleRows(entry, season).catch(() => null)
      battleByName.set(key, battlePromise)
    }
    const battle = await battlePromise
    if (!battle) return []
    const rank = battleRowUsageRank(battle)
    return rank === undefined ? [] : [{ id, rank }]
  })
  return rows.flat().sort((a, b) => a.rank - b.rank)
}

async function fetchChampionsPokemonUsageOnline(reload = false): Promise<BattlePokemonId[]> {
  // The compiled artifact already carries the ranking, so a compiled rule needs
  // neither the multi-megabyte index nor the per-season battle-row fan-out.
  const artifact = await loadCompiledArtifact(reload)
  if (artifact && artifact.ranking.length > 0) return artifact.ranking

  const [pokemon, index] = await Promise.all([
    listResources("pokemon", "en"),
    fetchChampionsIndex(),
  ])
  const pokemonByName = battlePokemonIdsByJoinName(pokemon)
  const season = championsSeason(usageRuleId, index)
  const entries = index.pokemon ?? []
  let ranked = entries
    .flatMap((entry) => {
      const rank = championsIndexUsageRank(entry, season)
      const id = resolveChampionsBattlePokemonId(entry, pokemonByName)
      return rank === undefined || id === undefined ? [] : [{ id, rank }]
    })
    .sort((a, b) => a.rank - b.rank)

  // Index battleSummary only ships Current. M4/M5/M6 ranks live on battle rows.
  // ponytail: first historical-season rank is ~200 HTTP requests (batch 8), then 12h cache.
  // Upgrade: Worker ranking snapshot so the client does not fan out.
  if (ranked.length === 0 && entries.length > 0) {
    ranked = await rankChampionsPokemonFromBattleRows(entries, season, pokemonByName)
  }

  return [...new Set(ranked.map(({ id }) => id))]
}
type SmogonData = Record<string, Record<string, unknown>>
const smogonDataCache = new Map<string, Promise<SmogonData>>()

function fetchSmogonData(): Promise<SmogonData> {
  const url = smogonStatsUrl()
  let promise = smogonDataCache.get(url)
  if (!promise) {
    promise = fetchJson<{ data?: SmogonData }>(url).then((response) => response.data ?? {})
    smogonDataCache.set(url, promise)
    promise.catch(() => {
      if (smogonDataCache.get(url) === promise) smogonDataCache.delete(url)
    })
  }
  return promise
}

async function fetchSmogonPokemonUsageOnline(): Promise<BattlePokemonId[]> {
  const [pokemon, data] = await Promise.all([listResources("pokemon", "en"), fetchSmogonData()])
  const byName = battlePokemonIdsByJoinName(pokemon)
  return Object.entries(data)
    .sort(([, a], [, b]) => Number(b.usage ?? 0) - Number(a.usage ?? 0))
    .flatMap(([name]) => {
      const id = byName.get(normalizeJoinName(name))
      return id == null ? [] : [id]
    })
}

async function fetchSmogonChaos(battlePokemonId: BattlePokemonId): Promise<Record<string, unknown> | null> {
  const [pokemon, data] = await Promise.all([getResource("pokemon", battlePokemonId, "en"), fetchSmogonData()])
  const resource = await getResource("pokemon", usageDetailSourceId(pokemon), "en")
  const find = (entry: typeof pokemon) => {
    const slug = normalizeJoinName(entry.calcSpeciesName || entry.name)
    return data[entry.name] ?? data[slug] ?? Object.entries(data).find(([name]) => normalizeJoinName(name) === slug)?.[1]
  }
  return find(resource) ?? find(pokemon) ?? null
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
  const data = await fetchSmogonChaos(id); return smogonNatureRows(data).map(([name, , percentage], index) => ({ battlePokemonId: id, format: "Doubles", season: "latest", source: "Smogon", dataVersion: "chaos", rank: index + 1, percentage, nature: name }))
}

type PikalyticsLatest = {
  format: string
  date: string
  data: PikalyticsEntry[]
}

type PikalyticsDetail = { format: string; date: string; data: PikalyticsEntry }

const pikalyticsEntryCache = new Map<BattlePokemonId, Promise<PikalyticsEntry | null>>()
let pikalyticsRosterPromise: Promise<Array<{ id: BattlePokemonId; name: string }>> | undefined

function resetPikalyticsCache(): void {
  pikalyticsRosterPromise = undefined
  pikalyticsEntryCache.clear()
}

function mapPikalyticsRoster(
  latest: PikalyticsLatest,
  pokemon: readonly UsageJoinPokemon[],
): Array<{ id: BattlePokemonId; name: string }> {
  const byName = battlePokemonIdsByJoinName(pokemon)
  return latest.data
    .toSorted((a, b) => Number(a.rank) - Number(b.rank))
    .flatMap((entry) => {
      const id = byName.get(normalizeJoinName(entry.name))
      return id == null ? [] : [{ id, name: entry.name }]
    })
}

/**
 * Pikalytics publishes the ranked roster in one request per format and keeps
 * per-Pokemon move/ability/item breakdowns on a separate request. Join the
 * roster onto local resources once so every lookup reuses the same index.
 */
function fetchPikalyticsRoster(): Promise<Array<{ id: BattlePokemonId; name: string }>> {
  if (!pikalyticsRosterPromise) {
    pikalyticsRosterPromise = (async () => {
      const [latest, pokemon] = await Promise.all([
        fetchJson<PikalyticsLatest>(pikalyticsRosterUrl()),
        listResources("pokemon", "en"),
      ])
      return mapPikalyticsRoster(latest, pokemon)
    })()
    pikalyticsRosterPromise.catch(resetPikalyticsCache)
  }
  return pikalyticsRosterPromise
}

async function fetchPikalyticsEntry(battlePokemonId: BattlePokemonId): Promise<PikalyticsEntry | null> {
  const [pokemon, roster] = await Promise.all([
    getResource("pokemon", battlePokemonId, "en"), fetchPikalyticsRoster(),
  ])
  const sourceId = usageDetailSourceId(pokemon)
  const entry = roster.find(member => member.id === sourceId)
    ?? roster.find(member => member.id === battlePokemonId)
  if (!entry) return null
  let promise = pikalyticsEntryCache.get(entry.id)
  if (!promise) {
    promise = fetchJson<PikalyticsDetail>(pikalyticsPokemonUrl(entry.name)).then(detail => detail.data)
    pikalyticsEntryCache.set(entry.id, promise)
    promise.catch(() => {
      if (pikalyticsEntryCache.get(entry.id) === promise) {
        pikalyticsEntryCache.delete(entry.id)
      }
    })
  }
  return promise
}

async function fetchPikalyticsMoveUsageOnline(id: BattlePokemonId): Promise<ChampionsMoveUsageRecord[]> {
  const entry = await fetchPikalyticsEntry(id)
  return (entry?.moves ?? []).map(({ move, percent }, index) => ({ battlePokemonId: id, moveId: getMoveIdByJoinName(move) ?? -1, format: "Doubles" as const, season: "latest", source: "Pikalytics", dataVersion: "pokedex", rank: index + 1, percentage: pikalyticsPercent(percent), championsMoveName: move })).filter((row) => row.moveId !== -1)
}
async function fetchPikalyticsAbilityUsageOnline(id: BattlePokemonId): Promise<ChampionsAbilityUsageRecord[]> {
  const entry = await fetchPikalyticsEntry(id)
  return (entry?.abilities ?? []).map(({ ability, percent }, index) => ({ battlePokemonId: id, abilityId: getAbilityIdByJoinName(ability) ?? -1, format: "Doubles" as const, season: "latest", source: "Pikalytics", rank: index + 1, percentage: pikalyticsPercent(percent), championsAbilityName: ability })).filter((row) => row.abilityId !== -1)
}
async function fetchPikalyticsItemUsageOnline(id: BattlePokemonId): Promise<ChampionsItemUsageRecord[]> {
  const entry = await fetchPikalyticsEntry(id)
  return (entry?.items ?? []).map(({ item, percent }, index) => ({ battlePokemonId: id, itemId: getItemIdByJoinName(item) ?? null, format: "Doubles", season: "latest", source: "Pikalytics", dataVersion: "pokedex", rank: index + 1, percentage: pikalyticsPercent(percent), championsItemName: item }))
}
async function fetchPikalyticsNatureUsageOnline(id: BattlePokemonId): Promise<ChampionsNatureUsageRecord[]> {
  const entry = await fetchPikalyticsEntry(id)
  return (entry?.natures ?? []).map(({ nature, percent }, index) => ({ battlePokemonId: id, format: "Doubles", season: "latest", source: "Pikalytics", dataVersion: "pokedex", rank: index + 1, percentage: pikalyticsPercent(percent), nature }))
}

async function fetchChampionsBattleRows(
  pokemon: ChampionsIndexPokemon,
  season: string,
): Promise<ChampionsBattleApi> {
  return fetchJson<ChampionsBattleApi>(championsBattleRowsUrl(pokemon, season))
}

async function fetchChampionsBattleData(
  battlePokemonId: BattlePokemonId,
): Promise<ChampionsBattleApi | null> {
  const pokemon = await getResource("pokemon", battlePokemonId, "en")
  const sourceId = usageDetailSourceId(pokemon)
  if (usageSource !== "champions") {
    const artifact = await loadCompiledArtifact()
    return artifact ? battleDataFromArtifact(artifact, sourceId) ?? battleDataFromArtifact(artifact, battlePokemonId) : null
  }
  let promise = battleRowsCache.get(sourceId)
  if (!promise) {
    promise = fetchChampionsSourceBattleData(sourceId)
    battleRowsCache.set(sourceId, promise)
    promise.catch(() => {
      if (battleRowsCache.get(sourceId) === promise) {
        battleRowsCache.delete(sourceId)
      }
    })
  }
  return promise
}

/**
 * Read one Pokemon's breakdown, preferring the compiled artifact.
 *
 * The artifact carries both ranking and detail for a `(source, rule)` pair, so
 * when it is present there is nothing to fan out and nothing to time out. When
 * it is absent — an uncompiled rule, or a dev server that never ran the compiler
 * — this falls back to the upstream index plus a per-Pokemon battle read.
 */
async function fetchChampionsSourceBattleData(
  sourceId: BattlePokemonId,
): Promise<ChampionsBattleApi | null> {
  const artifact = await loadCompiledArtifact()
  if (artifact) {
    const fromArtifact = battleDataFromArtifact(artifact, sourceId)
    if (fromArtifact) return fromArtifact
  }

  const index = await fetchChampionsIndex()
  const pokemon = await getResource("pokemon", sourceId, "en")
  const preferredName = CHAMPIONS_NAME_OVERRIDES[sourceId] ?? pokemon.name
  const championsPokemon = championsIndexByName(index).get(normalizeJoinName(preferredName))
  if (!championsPokemon) return null
  const battleData = await fetchChampionsBattleRows(
    championsPokemon,
    championsSeason(usageRuleId, index),
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
  if (usageSource !== "champions" && await loadCompiledArtifact()) return fetchChampionsMoveUsageOnline(battlePokemonId)
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
  if (usageSource !== "champions" && await loadCompiledArtifact()) return fetchChampionsAbilityUsageOnline(battlePokemonId)
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
  if (usageSource !== "champions" && await loadCompiledArtifact()) return fetchChampionsItemUsageOnline(battlePokemonId)
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
  if (usageSource !== "champions" && await loadCompiledArtifact()) return fetchChampionsNatureUsageOnline(battlePokemonId)
  if (usageSource === "smogon") return fetchSmogonNatureUsageOnline(battlePokemonId)
  if (usageSource === "pikalytics") return fetchPikalyticsNatureUsageOnline(battlePokemonId)
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

/**
 * Read the ranking. `reload` bypasses the in-memory artifact cache so a manual
 * refresh can pick up a newer deployment without reloading the page.
 */
export async function fetchUsageRanking(options?: { reload?: boolean }): Promise<{
  pokemonIds: BattlePokemonId[]
  fingerprint: string
}> {
  const pokemonIds = await fetchPokemonUsageIdsOnline(options?.reload ?? false)
  return { pokemonIds, fingerprint: rankingFingerprint(pokemonIds) }
}

async function fetchPokemonUsageIdsOnline(reload = false): Promise<BattlePokemonId[]> {
  if (reload) reloadUsageData()
  const artifact = await loadCompiledArtifact()
  if (artifact) return artifact.ranking
  if (usageSource === "smogon") return fetchSmogonPokemonUsageOnline()
  if (usageSource === "pikalytics") {
    const [latest, pokemon] = await Promise.all([
      fetchJson<PikalyticsLatest>(pikalyticsRosterUrl()),
      listResources("pokemon", "en"),
    ])
    return mapPikalyticsRoster(latest, pokemon).map((member) => member.id)
  }
  // The index carries every season's summary, so it is independent of the
  // selected rule. It is only dropped for an explicit manual refresh, which must
  // be able to re-read upstream; a rule change reuses the in-flight fetch instead
  // of discarding it and re-downloading several megabytes.
  return fetchChampionsPokemonUsageOnline(reload)
}

export function listChampionsPokemonUsageIds(): Promise<BattlePokemonId[]> {
  const cached = peekCachedPokemonUsageIds()
  if (cached && cached.length > 0) return Promise.resolve(cached)
  if (usageSource === "smogon") {
    smogonPokemonUsagePromise ??= fetchPokemonUsageIdsOnline().then((ids) => {
      rememberRanking(ids)
      return ids
    })
    smogonPokemonUsagePromise.catch(() => { smogonPokemonUsagePromise = undefined })
    return smogonPokemonUsagePromise
  }
  if (usageSource === "pikalytics") {
    pikalyticsPokemonUsagePromise ??= fetchPokemonUsageIdsOnline().then((ids) => {
      rememberRanking(ids)
      return ids
    })
    pikalyticsPokemonUsagePromise.catch(() => { pikalyticsPokemonUsagePromise = undefined })
    return pikalyticsPokemonUsagePromise
  }
  pokemonUsagePromise ??= pokemonUsageFetcher().then((ids) => {
    rememberRanking(ids)
    return ids
  })
  pokemonUsagePromise.catch(() => { pokemonUsagePromise = undefined })
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
  clearUsageCaches()
  jsonFetcher = fetcher
}

export function resetChampionsJsonFetcherForTest(): void {
  championsIndexPromise = undefined
  clearUsageCaches()
  jsonFetcher = fetchJsonFromNetwork
}
