/**
 * Compile usage artifacts for the high-frequency usage rules.
 *
 * Current Champions and Pikalytics snapshots contain only rankings. Their
 * details are fetched on demand by the Worker; historical Champions and Smogon
 * retain full snapshots because their rankings/details require bulk reads.
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

import { discoverUsageCatalog } from "../worker/usage-upstream"
import { isUsageSource, nameUsageRules, selectRecommendedRules, USAGE_SOURCES, type UsageCatalog, type UsageSource } from "../src/lib/usage-rules"

import { listResources } from "../src/lib/resources"
import type { BattlePokemonId } from "../src/lib/resources"
import {
  CHAMPIONS_FORMAT,
  CHAMPIONS_INDEX_URL,
  battlePokemonIdsByJoinName,
  battleRowUsageRank,
  championsBattleRowsUrl,
  championsBattleRows,
  championsIndexUsageRank,
  resolveChampionsBattlePokemonId,
  normalizeJoinName,
  championsBuckets,
  smogonBuckets,
  type PikalyticsEntry,
  type ChampionsBattleApi,
  type ChampionsIndexApi,
  type ChampionsIndexPokemon,
} from "../src/lib/champions/upstream"
import {
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
  const pokemon = await listResources("pokemon", "en")
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

  if (season === "Current") {
    if (!byIndexRank.length) throw new Error("Champions Current ranking is empty")
    return {
      source: "champions", rule: season, format: CHAMPIONS_FORMAT,
      dataVersion: index.dataVersion ?? "", generatedAt: new Date().toISOString(),
      ranking: [...new Set(byIndexRank.map(({ id }) => id))],
    }
  }

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
  for (const [id, rows] of detailById) {
    pokemonEntries[id] = championsBuckets({ data: rows })
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

async function compileOtherArtifact(source: "smogon" | "pikalytics", rule: string, catalog: UsageCatalog): Promise<UsageArtifact> {
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
      ranking.push(id)
      pokemon[id] = smogonBuckets(data)
    }
  } else {
    const root = `https://www.pikalytics.com/api`
    const roster = await fetchJson<PikalyticsEntry[]>(`${root}/l/${catalog.date}/${rule}`)
    const targets = roster.toSorted((a, b) => Number(a.rank) - Number(b.rank)).flatMap(entry => {
      const id = byName.get(normalizeJoinName(entry.name))
      return id == null ? [] : [{ id, name: entry.name }]
    })
    ranking.push(...new Set(targets.map(({ id }) => id)))
  }
  if (!ranking.length) throw new Error(`${source}/${rule}: missing ranking`)

  return { source, rule, format: "Doubles", dataVersion: catalog.date ?? rule.split("/")[0], generatedAt: new Date().toISOString(), ranking, ...(source === "smogon" ? { pokemon } : {}) }
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
  const rules = explicitRules ?? selectRecommendedRules(source, catalog)
  if (!rules.length) throw new Error(`No compile candidates for ${source}`)
  const usageDir = path.join(outDir, "usage", source)
  await rm(usageDir, { recursive: true, force: true })
  await mkdir(usageDir, { recursive: true })
  for (const rule of rules) {
    if (!catalog.rules.some(r => r.id === rule)) throw new Error(`Unknown rule: ${source}/${rule}`)
    console.log(`Compiling ${source}/${rule}`)
    const started = Date.now()
    const artifact = index ? await compileArtifact(index, rule, concurrency)
      : await compileOtherArtifact(source as "smogon" | "pikalytics", rule, catalog)
    const target = path.join(outDir, usageArtifactUrl(source, rule).slice(1))
    await mkdir(path.dirname(target), { recursive: true })
    const serialized = JSON.stringify(artifact)
    await writeFile(target, serialized)
    console.log(`${source}/${rule}: ${artifact.ranking.length} ranked, ${Object.keys(artifact.pokemon ?? {}).length} details, ${(serialized.length / 1024).toFixed(0)} KB, ${Date.now() - started} ms`)
  }
  await writeFile(path.join(usageDir, "manifest.json"), JSON.stringify({
    source, ...catalog, rules: nameUsageRules(catalog.rules), compiledRules: rules, generatedAt: new Date().toISOString(),
  }))
  console.log(`Wrote ${usageManifestUrl(source)} with ${rules.length} compiled rules`)
}
