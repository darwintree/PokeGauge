import type { BattlePokemonId } from "@/lib/resources"

import type { ChampionsBattleFormat } from "./types"

/**
 * A compiled usage artifact replaces the per-Pokemon upstream reads for one
 * `(source, rule)` pair. Ranking and per-Pokemon detail ship in one file so the
 * two can never disagree about which snapshot they describe.
 *
 * Shape rules the compiler and every reader depend on:
 *
 * - `ranking` is ordered by usage rank, descending — the picker order.
 * - `pokemon` is keyed by decimal `BattlePokemonId`. The upstream join name is
 *   deliberately absent: joining happens once at compile time, so an upstream
 *   rename fails the build instead of silently emptying a picker.
 * - A bucket is an array of `[name, percentage]` in upstream rank order, with
 *   `percentage` already resolved to a number or `null`. `[name, null]` is
 *   meaningful (Champions publishes teammates without a percentage) and must
 *   not be dropped. An empty bucket is omitted rather than stored as `[]`.
 * - Buckets keep every upstream row rather than a truncated window. The runtime
 *   already applies its own rank/window/dedupe rules, and several of those rules
 *   slice *after* filtering rows whose name does not resolve locally. Trimming
 *   here would change which rows survive that later filter, so the compiler must
 *   stay lossless up to `USAGE_ARTIFACT_ROW_GUARD`.
 * - Move, ability, and item names stay names. The compiler only guarantees the
 *   projection is lossless; the runtime keeps resolving names through the same
 *   generated tables it already uses, which are built from this same commit.
 */
export type UsageArtifactRow = [name: string, percentage: number | null]
export type UsageArtifactBucket = UsageArtifactRow[]

export type UsageArtifactBuckets = {
  /** Moves, in upstream rank order. */
  m?: UsageArtifactBucket
  /** Abilities, in upstream rank order. */
  a?: UsageArtifactBucket
  /** Held items, in upstream rank order. */
  i?: UsageArtifactBucket
  /** Natures, in upstream rank order. */
  n?: UsageArtifactBucket
}

export type UsageArtifact = {
  source: string
  rule: string
  format: ChampionsBattleFormat
  /** Upstream data version, for diagnosing a stale artifact. */
  dataVersion: string
  generatedAt: string
  /** Ranked `BattlePokemonId`s, best usage first. */
  ranking: BattlePokemonId[]
  pokemon: Record<string, UsageArtifactBuckets>
}

/**
 * Per-source index of what the last compile produced. It exists so the client can
 * learn the rule list and which rules are compiled without downloading the
 * multi-megabyte upstream index.
 */
export type UsageManifest = {
  source: string
  defaultId: string
  rules: Array<{ id: string; label: string }>
  /** Rules that have a compiled artifact. Anything else uses proxy mode. */
  compiledRules: string[]
  generatedAt: string
}

/**
 * Safety bound on rows per bucket. Champions publishes 10 rows per category, so
 * this never binds today; it only stops a pathological upstream payload from
 * bloating the artifact.
 */
const USAGE_ARTIFACT_ROW_GUARD = 64

/** Stable per-rule URL. Served as a static asset, never through the Worker. */
export function usageArtifactUrl(source: string, rule: string): string {
  return `/usage/${encodeURIComponent(source)}/${encodeURIComponent(rule)}.json`
}

/** Stable per-source manifest URL. */
export function usageManifestUrl(source: string): string {
  return `/usage/${encodeURIComponent(source)}/manifest.json`
}

function isBucket(value: unknown): value is UsageArtifactBucket {
  return Array.isArray(value) && value.every(
    (row) => Array.isArray(row) &&
      row.length === 2 &&
      typeof row[0] === "string" &&
      (row[1] === null || typeof row[1] === "number"),
  )
}

function isPokemonEntry(value: unknown): value is UsageArtifactBuckets {
  if (!value || typeof value !== "object") return false
  const entry = value as UsageArtifactBuckets
  return (["m", "a", "i", "n"] as const).every(
    (key) => entry[key] === undefined || isBucket(entry[key]),
  )
}

/** Shape check for a parsed artifact, so a truncated file is treated as absent. */
export function isUsageArtifact(value: unknown): value is UsageArtifact {
  if (!value || typeof value !== "object") return false
  const candidate = value as Partial<UsageArtifact>
  if (typeof candidate.source !== "string" || typeof candidate.rule !== "string") return false
  if (typeof candidate.format !== "string" || typeof candidate.dataVersion !== "string") return false
  if (!Array.isArray(candidate.ranking)) return false
  if (!candidate.ranking.every((id) => typeof id === "number")) return false
  if (!candidate.pokemon || typeof candidate.pokemon !== "object") return false
  return Object.values(candidate.pokemon).every(isPokemonEntry)
}

/** Build a bucket from upstream rows, preserving rank order and null percentages. */
export function toBucket(
  rows: readonly { name: string; percentage?: number | null }[] | undefined,
): UsageArtifactBucket | undefined {
  if (!rows?.length) return undefined
  return rows
    .slice(0, USAGE_ARTIFACT_ROW_GUARD)
    .map((row) => [row.name, row.percentage ?? null] as UsageArtifactRow)
}
