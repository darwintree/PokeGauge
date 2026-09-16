import {
  isUsageArtifact,
  usageArtifactUrl,
  usageManifestUrl,
  type UsageArtifact,
  type UsageManifest,
} from "./usage-artifact"

/**
 * Runtime reader for the deploy-time compiled usage artifacts.
 *
 * The artifacts are plain files under `/usage/...`, served as static assets, so
 * reading them costs no Worker invocation and no upstream request. Every entry
 * point resolves to `null` when the artifact is unavailable — an uncompiled rule,
 * an older deployment, or a local dev server that never ran the compiler — and
 * the caller then falls back to proxy mode. Absence must never throw, because the
 * fallback is a normal operating mode rather than a failure.
 */

let manifestPromise: Promise<UsageManifest | null> | undefined
const artifactPromises = new Map<string, Promise<UsageArtifact | null>>()
let jsonFetcher: (url: string) => Promise<unknown> = fetchArtifactJsonFromNetwork

/**
 * Artifact reads are cached as in-flight promises, so a request that never
 * settles would be reused for the rest of the session. Bound it so the promise
 * always resolves (to `null`, meaning proxy mode) instead of hanging.
 */
const ARTIFACT_REQUEST_TIMEOUT_MS = 10_000

async function fetchArtifactJsonFromNetwork(url: string): Promise<unknown> {
  const response = await fetch(url, { signal: AbortSignal.timeout(ARTIFACT_REQUEST_TIMEOUT_MS) })
  if (!response.ok) return null
  // A single-page-app fallback answers unmatched paths with index.html, so a
  // missing artifact can arrive as 200 HTML rather than 404. Parse defensively.
  if (!(response.headers.get("content-type") ?? "").includes("json")) return null
  return response.json().catch(() => null)
}

function isManifest(value: unknown): value is UsageManifest {
  if (!value || typeof value !== "object") return false
  const candidate = value as Partial<UsageManifest>
  return typeof candidate.source === "string" &&
    typeof candidate.defaultId === "string" &&
    Array.isArray(candidate.rules) &&
    Array.isArray(candidate.compiledRules)
}

/**
 * Read and validate one artifact file. Deferred through `Promise.resolve()` so a
 * throw from the fetcher becomes a rejection this can absorb, and every failure
 * — transport, non-JSON, or shape — collapses to `null` for the caller.
 */
function loadArtifactJson<T>(url: string, isShape: (value: unknown) => value is T): Promise<T | null> {
  return Promise.resolve()
    .then(() => jsonFetcher(url))
    .then((value) => (isShape(value) ? value : null))
    .catch(() => null)
}

/** Fetch and cache the per-source manifest. `null` means proxy mode for the source. */
export function loadUsageManifest(source: string): Promise<UsageManifest | null> {
  manifestPromise ??= loadArtifactJson(usageManifestUrl(source), isManifest)
  return manifestPromise
}

/** Fetch and cache one compiled rule. `null` means the caller must use proxy mode. */
export function loadUsageArtifact(
  source: string,
  rule: string,
  options?: { reload?: boolean },
): Promise<UsageArtifact | null> {
  const key = `${source}/${rule}`
  if (options?.reload) artifactPromises.delete(key)
  let promise = artifactPromises.get(key)
  if (!promise) {
    promise = loadArtifactJson(usageArtifactUrl(source, rule), isUsageArtifact)
    artifactPromises.set(key, promise)
  }
  return promise
}

/**
 * Drop the cached artifacts so the next read revalidates them. A manual refresh
 * must be able to pick up a newer deployment, even in a long-lived tab.
 */
export function reloadUsageArtifacts(): void {
  manifestPromise = undefined
  artifactPromises.clear()
}

/** Swap the transport for tests. Clears the cache so the new fetcher is used. */
export function setUsageArtifactFetcherForTest(
  fetcher: (url: string) => Promise<unknown>,
): void {
  reloadUsageArtifacts()
  jsonFetcher = fetcher
}

export function resetUsageArtifactCache(): void {
  reloadUsageArtifacts()
  jsonFetcher = fetchArtifactJsonFromNetwork
}
