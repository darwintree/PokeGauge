import type { BattlePokemonId } from "../resources/types"

import type { ChampionsBattleFormat } from "./types"

/** Compact named buckets shared by compiled snapshots and the detail API.
 * Rows retain upstream order and null percentages; local resources resolve names.
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
  /** Absent for ranking-only snapshots; an empty record means published empty statistics. */
  pokemon?: Record<string, UsageArtifactBuckets>
}

/**
 * Per-source catalog and snapshot coverage, read by the Worker.
 */
export type UsageManifest = {
  source: string
  defaultId: string
  rules: Array<{ id: string; label: string }>
  /** Published dataset month when the source keys requests by date. */
  date?: string
  /** Rules that have a compiled artifact. Other rules are read from upstream by the Worker. */
  compiledRules: string[]
  generatedAt: string
}

/** Stable per-rule asset path used by the compiler and Worker. */
export function usageArtifactUrl(source: string, rule: string): string {
  return `/usage/${encodeURIComponent(source)}/${rule.split("/").map(encodeURIComponent).join("/")}.json`
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
      (row[1] === null || (typeof row[1] === "number" && Number.isFinite(row[1]))),
  )
}

export function isUsageBuckets(value: unknown): value is UsageArtifactBuckets {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  if (!Object.keys(value).every(key => ["m", "a", "i", "n"].includes(key))) return false
  const entry = value as UsageArtifactBuckets
  return (["m", "a", "i", "n"] as const).every(
    (key) => entry[key] === undefined || isBucket(entry[key]),
  )
}

/** Validate a parsed snapshot before the API serves it. */
export function isUsageArtifact(value: unknown): value is UsageArtifact {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  const candidate = value as Partial<UsageArtifact>
  if (typeof candidate.source !== "string" || typeof candidate.rule !== "string") return false
  if (typeof candidate.format !== "string" || typeof candidate.dataVersion !== "string") return false
  if (!Array.isArray(candidate.ranking)) return false
  if (!candidate.ranking.every((id) => typeof id === "number")) return false
  return candidate.pokemon === undefined || (candidate.pokemon !== null &&
    typeof candidate.pokemon === "object" && !Array.isArray(candidate.pokemon) &&
    Object.values(candidate.pokemon).every(isUsageBuckets))
}

/** Build a bucket from upstream rows, preserving rank order and null percentages. */
export function toBucket(
  rows: readonly { name: string; percentage?: number | null }[] | undefined,
): UsageArtifactBucket | undefined {
  if (!rows?.length) return undefined
  return rows.map((row) => [row.name, row.percentage ?? null] as UsageArtifactRow)
}
