/**
 * Compile usage artifacts for the high-frequency usage rules.
 *
 * Why this exists: the ranking layer is the only thing with a `(source, rule)`
 * identity and a local cache. Per-Pokemon breakdowns had neither, and the Smogon
 * and Pikalytics readers bypassed caching entirely, so a single session could
 * issue hundreds of upstream requests and still show an empty Move track. Doing
 * the join and the row fan-out once per deploy removes that whole class of
 * failure from the request path.
 *
 * Runs after the client build in `pnpm build`. CI uses `pnpm build:offline`
 * to avoid upstream network dependencies. A failed compile must not deploy.
 *
 * Output layout under the directory given by `--out` (default `dist`):
 *
 *   usage/<source>/manifest.json   rule list + which rules are compiled
 *   usage/<source>/<rule>.json     one artifact per compiled rule
 *
 * Usage:
 *   tsx scripts/build-usage-artifacts.ts [--out dist] [--source champions|smogon|pikalytics] [--rules Current] [--concurrency 16]
 */
import { mkdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { setTimeout as delay } from "node:timers/promises"
import { gunzipSync } from "node:zlib"

import { discoverUsageCatalog } from "../worker/index"
import { isUsageSource, nameUsageRules, selectCompileRules, USAGE_SOURCES, type UsageCatalog, type UsageSource } from "../src/lib/usage-rules"

import { getMoveIdByJoinName, getAbilityIdByJoinName, listResources } from "../src/lib/resources"
import type { BattlePokemonId } from "../src/lib/resources"
import {
  CHAMPIONS_FORMAT,
  CHAMPIONS_INDEX_URL,
  battlePokemonIdsByJoinName,
  battleRowUsageRank,
  championsBattleRowsUrl,
  championsBattleRows,
  usageDetailSourceId,
  championsIndexUsageRank,
  resolveChampionsBattlePokemonId,
  normalizeJoinName,
  smogonRowsWithPercent,
  smogonNatureRows,
  pikalyticsPercent,
  type PikalyticsEntry,
  type ChampionsBattleApi,
  type ChampionsIndexApi,
  type ChampionsIndexPokemon,
} from "../src/lib/champions/upstream"
import {
  toBucket,
  usageArtifactUrl,
  usageManifestUrl,
  type UsageArtifact,
  type UsageArtifactBuckets,
} from "../src/lib/champions/usage-artifact"

type Cli = {
  outDir: string
  rules: string[] | undefined
  concurrency: number
  source?: UsageSource
}

function parseArgs(argv: string[]): Cli {
  let outDir = "dist"
  let rules: string[] | undefined
  let concurrency = 16
  let source: UsageSource | undefined
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === "--source") {
      const value = argv[++i]
      if (!isUsageSource(value)) throw new Error(`Unknown source: ${value}`)
      source = value
    } else if (arg === "--out" && argv[i + 1]) outDir = argv[++i]!
    else if (arg === "--rules" && argv[i + 1]) {
      rules = argv[++i]!.split(",").map((rule) => rule.trim()).filter(Boolean)
    } else if (arg === "--concurrency" && argv[i + 1]) {
      concurrency = Math.max(1, Number(argv[++i]) || 16)
    } else if (arg.startsWith("--")) {
      throw new Error(`Unknown flag: ${arg}`)
    }
  }
  if (rules && source && source !== "champions") throw new Error("--rules is only supported for Champions")
  return { outDir, rules, concurrency, source }
}

async function fetchJson<T>(url: string): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(120_000) })
      if ((response.status === 429 || response.status >= 500) && attempt < 3) {
        const retryAfter = response.headers.get("retry-after")
        let waitMs = 2000 * 2 ** attempt
        if (retryAfter) {
          waitMs = /^\d+$/.test(retryAfter) ? Number(retryAfter) * 1000 : Date.parse(retryAfter) - Date.now()
        }
        waitMs = Math.max(1000, waitMs || 1000)
        await response.body?.cancel()
        console.log(`Retrying ${url} after ${waitMs} ms (${response.status})`)
        await delay(waitMs)
        continue
      }
      if (!response.ok) throw new Error(`Upstream failed ${response.status}: ${url}`)
      if (url.endsWith(".gz")) {
        const bytes = Buffer.from(await response.arrayBuffer())
        return JSON.parse((bytes[0] === 0x1f && bytes[1] === 0x8b ? gunzipSync(bytes) : bytes).toString("utf8")) as T
      }
      return await response.json() as T
    } catch (error) {
      if (attempt >= 3 || !(error instanceof TypeError || error instanceof DOMException)) throw error
      await delay(2000 * 2 ** attempt)
    }
  }
}

/** Fetch battle rows for one index entry, or null when upstream has none. */
async function fetchBattleRows(
  entry: ChampionsIndexPokemon,
  season: string,
): Promise<ChampionsBattleApi | null> {
  const url = championsBattleRowsUrl(entry, season)
  const response = await fetch(url, { signal: AbortSignal.timeout(120_000) })
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Upstream failed ${response.status}: ${url}`)
  return response.json() as Promise<ChampionsBattleApi>
}

/**
 * Run tasks with bounded concurrency. Champions tolerates ~16 parallel CSV reads.
 */
async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let next = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (;;) {
      const index = next++
      if (index >= items.length) return
      results[index] = await mapper(items[index]!, index)
    }
  })
  await Promise.all(workers)
  return results
}

/** A row awaiting projection, already reduced to its share value. */
type CollectedRow = { name: string; percentage: number | null }

/**
 * Upstream category names, mapped to the artifact's bucket keys. `Partial`
 * because upstream can publish a category this build does not compile, which is
 * skipped rather than stored.
 */
const BUCKET_KEY_BY_CATEGORY: Partial<Record<string, keyof UsageArtifactBuckets>> = {
  move: "m",
  ability: "a",
  held_item: "i",
  stat_alignment: "n",
}

/**
 * Project battle rows into buckets, keeping the same resolvable moves and
 * abilities as the runtime reader.
 */
function compileBuckets(rows: ChampionsBattleApi["data"]): UsageArtifactBuckets {
  const collected: Record<keyof UsageArtifactBuckets, CollectedRow[]> = { m: [], a: [], i: [], n: [] }

  // A single pass keeps each bucket in upstream order, because rows of the same
  // category stay in their original relative order within the source array.
  for (const row of rows ?? []) {
    const key = BUCKET_KEY_BY_CATEGORY[row.category]
    if (!key) continue
    // Match runtime filtering; items keep unmapped names and `nothing` so the
    // default-pick window does not backfill them.
    if (row.category === "move" && getMoveIdByJoinName(row.name) == null) {
      continue
    }
    if (row.category === "ability" && getAbilityIdByJoinName(row.name) == null) {
      continue
    }
    collected[key].push({ name: row.name, percentage: row.percentage_value ?? null })
  }

  return {
    m: toBucket(collected.m),
    a: toBucket(collected.a),
    i: toBucket(collected.i),
    n: toBucket(collected.n),
  }
}

type RankedId = { id: BattlePokemonId; rank: number }

function byUsageRank(a: RankedId, b: RankedId): number {
  return a.rank - b.rank
}

/**
 * Rank from the battle rows themselves, for seasons the index summary omits.
 * `column_position` on the first row is the Pokemon's own usage rank.
 */
function rankFromBattleRows(
  targeted: readonly { id: BattlePokemonId }[],
  detailById: Map<BattlePokemonId, ChampionsBattleApi["data"]>,
): RankedId[] {
  return targeted
    .flatMap(({ id }) => {
      const rows = detailById.get(id)
      if (!rows) return []
      const rank = battleRowUsageRank({ data: rows })
      return rank === undefined ? [] : [{ id, rank }]
    })
    .sort(byUsageRank)
}

async function compileArtifact(
  index: ChampionsIndexApi,
  season: string,
  concurrency: number,
): Promise<UsageArtifact> {
  // Join tables for moves and abilities are built lazily on first lookup, so
  // load them before resolving any name.
  const [pokemon] = await Promise.all([
    listResources("pokemon", "en"),
    listResources("move", "en"),
    listResources("ability", "en"),
  ])
  const pokemonByName = battlePokemonIdsByJoinName(pokemon)
  const entries = index.pokemon ?? []

  // Join every index entry to a local id once; both the ranking and the detail
  // fetch need the result, and name resolution is the expensive part.
  const targeted = entries.flatMap((entry) => {
    const id = resolveChampionsBattlePokemonId(entry, pokemonByName)
    return id === undefined ? [] : [{ entry, id }]
  })

  // Ranking: prefer the index summary; fall back to battle rows for seasons the
  // summary omits (everything except `Current` today).
  const byIndexRank = targeted
    .flatMap(({ entry, id }) => {
      const rank = championsIndexUsageRank(entry, season)
      return rank === undefined ? [] : [{ id, rank }]
    })
    .sort(byUsageRank)

  const detail = await mapWithConcurrency(targeted, concurrency, async ({ entry, id }) => {
    const battle = await fetchBattleRows(entry, season)
    return battle === null ? null : { id, rows: championsBattleRows(battle) }
  })

  const detailById = new Map<BattlePokemonId, ChampionsBattleApi["data"]>()
  for (const item of detail) if (item !== null) detailById.set(item.id, item.rows)

  const ranked = byIndexRank.length > 0 ? byIndexRank : rankFromBattleRows(targeted, detailById)

  const ranking = [...new Set(ranked.map(({ id }) => id))]
  if (ranking.length === 0) {
    throw new Error(`No ranked Pokemon for season ${season}; refusing to write an empty ranking`)
  }

  const pokemonEntries: Record<string, UsageArtifactBuckets> = {}
  for (const { battlePokemonId, speciesId, isMega } of pokemon) {
    const id = usageDetailSourceId({ battlePokemonId, speciesId, isMega })
    if (id !== battlePokemonId) continue // Megas inherit the base species rows.
    const rows = detailById.get(id)
    if (!rows) continue
    const compiled = compileBuckets(rows)
    if (compiled.m || compiled.a || compiled.i || compiled.n) {
      pokemonEntries[String(id)] = compiled
    }
  }

  const missing = ranking.filter((id) => pokemonEntries[String(id)] === undefined)
  if (missing.length > 0) {
    throw new Error(
      `Ranking references ${missing.length} Pokemon without detail rows: ${missing.join(", ")}`,
    )
  }

  return {
    source: "champions",
    rule: season,
    format: CHAMPIONS_FORMAT,
    dataVersion: index.dataVersion ?? "",
    generatedAt: new Date().toISOString(),
    ranking,
    pokemon: pokemonEntries,
  }
}

async function compileOtherArtifact(source: "smogon" | "pikalytics", rule: string, catalog: UsageCatalog, concurrency: number): Promise<UsageArtifact> {
  const resources = await listResources("pokemon", "en")
  const byName = battlePokemonIdsByJoinName(resources)
  const pokemon: Record<string, UsageArtifactBuckets> = {}
  const ranking: number[] = []
  if (source === "smogon") {
    const [month, format] = rule.split("/")
    const response = await fetchJson<{ data: Record<string, Record<string, unknown>> }>(`https://www.smogon.com/stats/${month}/chaos/${format}.json.gz`)
    for (const [name, data] of Object.entries(response.data).sort(([, a], [, b]) => Number(b.usage) - Number(a.usage))) {
      const id = byName.get(normalizeJoinName(name))
      if (id == null || pokemon[id]) continue
      function bucket(key: string): UsageArtifactBuckets["m"] {
        const rows = key === "Spreads" ? smogonNatureRows(data) : smogonRowsWithPercent(data, key)
        return toBucket(rows.map(([name, , percentage]) => ({ name, percentage })))
      }
      ranking.push(id)
      pokemon[id] = { m: bucket("Moves"), a: bucket("Abilities"), i: bucket("Items"), n: bucket("Spreads") }
    }
  } else {
    const root = `https://www.pikalytics.com/api`
    const roster = await fetchJson<PikalyticsEntry[]>(`${root}/l/${catalog.date}/${rule}`)
    const targets = roster.toSorted((a, b) => Number(a.rank) - Number(b.rank)).flatMap(entry => {
      const id = byName.get(normalizeJoinName(entry.name))
      return id == null ? [] : [{ id, name: entry.name }]
    })
    const entries = await mapWithConcurrency(targets, Math.min(concurrency, 2), async ({ id, name }) => {
      const entry = await fetchJson<PikalyticsEntry>(`${root}/p/${catalog.date}/${rule}/${encodeURIComponent(name)}`)
      if (typeof entry.name !== "string" || ![entry.moves, entry.abilities, entry.items].every(Array.isArray)) {
        throw new Error(`Invalid Pikalytics detail: ${rule}/${name}`)
      }
      return { id, buckets: {
        m: toBucket(entry.moves?.map(r => ({ name: r.move, percentage: pikalyticsPercent(r.percent) }))),
        a: toBucket(entry.abilities?.map(r => ({ name: r.ability, percentage: pikalyticsPercent(r.percent) }))),
        i: toBucket(entry.items?.map(r => ({ name: r.item, percentage: pikalyticsPercent(r.percent) }))),
        n: toBucket(entry.natures?.map(r => ({ name: r.nature, percentage: pikalyticsPercent(r.percent) }))),
      } }
    })
    for (const { id, buckets } of entries) {
      if (pokemon[id]) continue
      ranking.push(id)
      pokemon[id] = buckets
    }
  }
  // A successful Pikalytics response can explicitly publish empty statistics.
  // Keep that empty record, which is different from an unfetched/failed detail.
  if (!ranking.length || ranking.some(id => !pokemon[id]) ||
      (source === "smogon" && ranking.some(id => !Object.values(pokemon[id]).some(bucket => bucket?.length)))) {
    throw new Error(`${source}/${rule}: missing ranking or Pokemon details`)
  }
  return { source, rule, format: "Doubles", dataVersion: catalog.date ?? rule.split("/")[0], generatedAt: new Date().toISOString(), ranking, pokemon }
}

const { outDir, rules: explicitRules, concurrency, source: explicitSource } = parseArgs(process.argv.slice(2))
// Explicit --rules remains a Champions-only diagnostic compile.
let sources: readonly UsageSource[] = USAGE_SOURCES
if (explicitSource) sources = [explicitSource]
else if (explicitRules) sources = ["champions"]
for (const source of sources) {
  const index = source === "champions" ? await fetchJson<ChampionsIndexApi>(CHAMPIONS_INDEX_URL) : null
  const available = index?.seasons?.length ? index.seasons : [index?.defaultSeason ?? "Current"]
  const catalog: UsageCatalog = index
    ? { defaultId: index.defaultSeason ?? available[0], rules: available.map(id => ({ id, label: id })) }
    : await discoverUsageCatalog(source)
  const rules = explicitRules ?? selectCompileRules(source, catalog)
  if (!rules.length) throw new Error(`No compile candidates for ${source}`)
  const usageDir = path.join(outDir, "usage", source)
  await rm(usageDir, { recursive: true, force: true })
  await mkdir(usageDir, { recursive: true })
  for (const rule of rules) {
    if (!catalog.rules.some(r => r.id === rule)) throw new Error(`Unknown rule: ${source}/${rule}`)
    console.log(`Compiling ${source}/${rule}`)
    const started = Date.now()
    const artifact = index ? await compileArtifact(index, rule, concurrency)
      : await compileOtherArtifact(source as "smogon" | "pikalytics", rule, catalog, concurrency)
    const target = path.join(outDir, usageArtifactUrl(source, rule).slice(1))
    await mkdir(path.dirname(target), { recursive: true })
    const serialized = JSON.stringify(artifact)
    await writeFile(target, serialized)
    console.log(`${source}/${rule}: ${artifact.ranking.length} ranked, ${Object.keys(artifact.pokemon).length} details, ${(serialized.length / 1024).toFixed(0)} KB, ${Date.now() - started} ms`)
  }
  await writeFile(path.join(usageDir, "manifest.json"), JSON.stringify({
    source, ...catalog, rules: nameUsageRules(catalog.rules), compiledRules: rules, generatedAt: new Date().toISOString(),
  }))
  console.log(`Wrote ${usageManifestUrl(source)} with ${rules.length} compiled rules`)
}
