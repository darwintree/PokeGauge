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
 * This script is deliberately NOT part of `pnpm build`: CI must stay able to
 * build without network access. It runs in the deploy workflow instead, and a
 * failed run must not ship a half-written artifact set.
 *
 * Output layout under the directory given by `--out` (default `dist`):
 *
 *   usage/<source>/manifest.json   rule list + which rules are compiled
 *   usage/<source>/<rule>.json     one artifact per compiled rule
 *
 * Usage:
 *   tsx scripts/build-usage-artifacts.ts [--out dist] [--rules Current] [--concurrency 16]
 */
import { mkdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"

import { getMoveIdByJoinName, getAbilityIdByJoinName, listResources } from "../src/lib/resources"
import type { BattlePokemonId } from "../src/lib/resources"
import {
  CHAMPIONS_FORMAT,
  CHAMPIONS_INDEX_URL,
  battlePokemonIdsByJoinName,
  battleRowUsageRank,
  championsBattleRowsUrl,
  championsBattleRows,
  championsDetailSourceId,
  championsIndexUsageRank,
  resolveChampionsBattlePokemonId,
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

const SOURCE = "champions"
const DEFAULT_RULES = ["Current"]

type Cli = {
  outDir: string
  rules: string[]
  concurrency: number
}

function parseArgs(argv: string[]): Cli {
  let outDir = "dist"
  let rules = DEFAULT_RULES
  let concurrency = 16
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === "--out" && argv[i + 1]) outDir = argv[++i]!
    else if (arg === "--rules" && argv[i + 1]) {
      rules = argv[++i]!.split(",").map((rule) => rule.trim()).filter(Boolean)
    } else if (arg === "--concurrency" && argv[i + 1]) {
      concurrency = Math.max(1, Number(argv[++i]) || 16)
    } else if (arg.startsWith("--")) {
      throw new Error(`Unknown flag: ${arg}`)
    }
  }
  return { outDir, rules, concurrency }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Upstream failed ${response.status}: ${url}`)
  return response.json() as Promise<T>
}

/** Fetch battle rows for one index entry, or null when upstream has none. */
async function fetchBattleRows(
  entry: ChampionsIndexPokemon,
  season: string,
): Promise<ChampionsBattleApi | null> {
  const url = championsBattleRowsUrl(entry, season)
  const response = await fetch(url)
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

type CompiledBuckets = {
  pokemon: UsageArtifactBuckets
  /** Rows whose name did not resolve locally; a non-zero count means drift. */
  unresolved: number
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
 * Project battle rows into the artifact buckets, resolving names to local ids.
 *
 * The runtime does the same resolution with the same generated tables, so any
 * name that fails here would also have been dropped in the browser — compiling it
 * away only makes the loss visible at build time instead of silently in the UI.
 */
function compileBuckets(rows: ChampionsBattleApi["data"]): CompiledBuckets {
  const collected: Record<keyof UsageArtifactBuckets, CollectedRow[]> = { m: [], a: [], i: [], n: [] }
  let unresolved = 0

  // A single pass keeps each bucket in upstream order, because rows of the same
  // category stay in their original relative order within the source array.
  for (const row of rows ?? []) {
    const key = BUCKET_KEY_BY_CATEGORY[row.category]
    if (!key) continue
    // Moves and abilities must resolve, since the runtime drops unresolvable rows;
    // counting them here surfaces upstream drift at build time. Items deliberately
    // keep unmapped names and `nothing`, and natures resolve through another table.
    if (row.category === "move" && getMoveIdByJoinName(row.name) == null) {
      unresolved += 1
      continue
    }
    if (row.category === "ability" && getAbilityIdByJoinName(row.name) == null) {
      unresolved += 1
      continue
    }
    collected[key].push({ name: row.name, percentage: row.percentage_value ?? null })
  }

  return {
    pokemon: {
      m: toBucket(collected.m),
      a: toBucket(collected.a),
      i: toBucket(collected.i),
      n: toBucket(collected.n),
    },
    unresolved,
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
      const rank = battleRowUsageRank({ data: rows } as ChampionsBattleApi)
      return rank === undefined ? [] : [{ id, rank }]
    })
    .sort(byUsageRank)
}

async function compileArtifact(
  index: ChampionsIndexApi,
  season: string,
  concurrency: number,
): Promise<{ artifact: UsageArtifact; unresolved: number }> {
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
  let unresolved = 0
  for (const { battlePokemonId, speciesId, isMega } of pokemon) {
    const id = championsDetailSourceId({ battlePokemonId, speciesId, isMega })
    if (id !== battlePokemonId) continue // Megas inherit the base species rows.
    const rows = detailById.get(id)
    if (!rows) continue
    const compiled = compileBuckets(rows)
    unresolved += compiled.unresolved
    if (compiled.pokemon.m || compiled.pokemon.a || compiled.pokemon.i || compiled.pokemon.n) {
      pokemonEntries[String(id)] = compiled.pokemon
    }
  }

  const missing = ranking.filter((id) => pokemonEntries[String(id)] === undefined)
  if (missing.length > 0) {
    throw new Error(
      `Ranking references ${missing.length} Pokemon without detail rows: ${missing.join(", ")}`,
    )
  }

  return {
    artifact: {
      source: SOURCE,
      rule: season,
      format: CHAMPIONS_FORMAT,
      dataVersion: index.dataVersion ?? "",
      generatedAt: new Date().toISOString(),
      ranking,
      pokemon: pokemonEntries,
    },
    unresolved,
  }
}

const { outDir, rules, concurrency } = parseArgs(process.argv.slice(2))
const usageDir = path.join(outDir, "usage", SOURCE)

console.log(`Compiling ${SOURCE} usage artifacts into ${usageDir}`)
const index = await fetchJson<ChampionsIndexApi>(CHAMPIONS_INDEX_URL)
const available = index.seasons?.length ? index.seasons : [index.defaultSeason ?? "Current"]
console.log(
  `Index: ${index.pokemon?.length ?? 0} Pokemon, dataVersion=${index.dataVersion ?? "?"}, seasons=${available.join(",")}`,
)

// The artifact directory is replaced wholesale so a rule that is no longer
// compiled cannot linger as a stale file the client would still happily serve.
await rm(usageDir, { recursive: true, force: true })
await mkdir(usageDir, { recursive: true })

const compiled: string[] = []
for (const rule of rules) {
  if (!available.includes(rule)) {
    throw new Error(`Rule ${rule} is not in the upstream season list: ${available.join(",")}`)
  }
  const started = Date.now()
  const { artifact, unresolved } = await compileArtifact(index, rule, concurrency)
  const serialized = JSON.stringify(artifact)
  await writeFile(path.join(usageDir, `${rule}.json`), serialized)
  compiled.push(rule)
  console.log(
    `  ${rule}: ${artifact.ranking.length} ranked, ${Object.keys(artifact.pokemon).length} detail, ` +
    `${(serialized.length / 1024).toFixed(0)} KB, unresolved=${unresolved}, ${Date.now() - started} ms`,
  )
}

const manifest = {
  source: SOURCE,
  defaultId: index.defaultSeason ?? available[0] ?? "Current",
  rules: available.map((id) => ({ id, label: id })),
  compiledRules: compiled,
  generatedAt: new Date().toISOString(),
}
await writeFile(path.join(usageDir, "manifest.json"), JSON.stringify(manifest))
console.log(`Wrote manifest with ${compiled.length} compiled rule(s): ${compiled.join(",")}`)
console.log(`Client paths: ${usageManifestUrl(SOURCE)}, ${usageArtifactUrl(SOURCE, compiled[0] ?? "Current")}`)
