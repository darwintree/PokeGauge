import { CHAMPIONS_INDEX_URL, type UsageSource, type UsageCatalog } from "../src/lib/usage-rules"

const SMOGON_ORIGIN = "https://www.smogon.com/stats/"
const PIKALYTICS_ORIGIN = "https://www.pikalytics.com"

export const UPSTREAM_HEADERS = {
  accept: "application/json",
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36",
} as const

const EDGE_CACHE_TTL_SECONDS = 3600
const EDGE_CACHE_NAME = "usage-upstream"

/**
 * Cache Worker responses at the edge so repeated requests skip the upstream
 * call. The key is taken from the path only, so query strings cannot fragment
 * the cache.
 */
function edgeCacheKey(request: Request): Request {
  const url = new URL(request.url)
  return new Request(`${url.origin}${url.pathname}`, { method: "GET" })
}

export async function withEdgeCache(
  request: Request,
  ctx: ExecutionContext,
  produce: () => Promise<Response>,
  key = edgeCacheKey(request),
): Promise<Response> {
  if (typeof caches === "undefined") return produce()
  let cache: Cache
  try {
    cache = await caches.open(EDGE_CACHE_NAME)
    // A cache read failure must not take the endpoint down.
    const hit = await cache.match(key)
    if (hit) return hit
  } catch {
    return produce()
  }
  const response = await produce()
  if (!response.ok) return response
  const headers = new Headers(response.headers)
  headers.set("cache-control", `public, max-age=${EDGE_CACHE_TTL_SECONDS}`)
  const stored = new Response(response.clone().body, { status: response.status, headers })
  ctx.waitUntil(cache.put(key, stored).catch(() => {}))
  return response
}

const SMOGON_VGC_FILE = /href="(gen\d+championsvgc[a-z0-9-]*reg[a-z]+(?:bo3)?-\d+\.json\.gz)"/g

function smogonUsageRuleLabel(fileBase: string): string {
  const match = fileBase.match(/^gen\d+championsvgc(\d+)(reg[a-z]+)(bo3)?-(\d+)$/)
  if (!match) return fileBase
  const [, year, reg, bo3, cutoff] = match
  const letters = reg.slice(3).toUpperCase()
  const regLabel = letters.length === 2 ? `Reg ${letters[0]}-${letters[1]}` : `Reg ${letters}`
  return `VGC ${year} ${regLabel}${bo3 ? " BO3" : ""} ${cutoff}`
}

type SmogonChaosMonth = { month: string; files: string[] }

async function listSmogonChaosMonth(): Promise<SmogonChaosMonth | null> {
  const now = new Date()
  for (const offset of [0, 1]) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1))
    const month = date.toISOString().slice(0, 7)
    const directory = await fetch(`${SMOGON_ORIGIN}${month}/chaos/`, { signal: AbortSignal.timeout(15_000) })
    if (!directory.ok) continue
    const html = await directory.text()
    const files = [...html.matchAll(SMOGON_VGC_FILE)].map((match) => match[1])
    if (files.length === 0) continue
    return { month, files }
  }
  return null
}

function defaultSmogonChaosFile(files: string[]): string | undefined {
  // Reuse the previous latest picker: last cutoff-0 VGC file in sort order.
  return files.filter((file) => /-0\.json\.gz$/.test(file)).sort().at(-1)
}

async function latestSmogonChampions(): Promise<Response> {
  const listed = await listSmogonChaosMonth()
  if (!listed) return new Response("Smogon stats unavailable", { status: 404 })
  const latestFile = defaultSmogonChaosFile(listed.files)
  if (!latestFile) return new Response("Smogon stats unavailable", { status: 404 })
  const upstream = await fetch(`${SMOGON_ORIGIN}${listed.month}/chaos/${latestFile.replace(/\.gz$/, "")}`)
  if (!upstream.ok) return new Response("Smogon stats unavailable", { status: 404 })
  return new Response(upstream.body, { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=3600" } })
}

export async function listSmogonChampionsFormats(): Promise<Response> {
  const listed = await listSmogonChaosMonth()
  if (!listed) return new Response("Smogon stats unavailable", { status: 404 })
  const defaultFile = defaultSmogonChaosFile(listed.files)
  const rules = listed.files
    .map((file) => file.replace(/\.json\.gz$/, ""))
    .sort()
    .map((base) => ({ id: `${listed.month}/${base}`, label: smogonUsageRuleLabel(base) }))
  const defaultId = defaultFile
    ? `${listed.month}/${defaultFile.replace(/\.json\.gz$/, "")}`
    : rules.at(-1)?.id
  if (!defaultId) return new Response("Smogon stats unavailable", { status: 404 })
  return Response.json({ defaultId, rules }, { headers: { "cache-control": `public, max-age=${EDGE_CACHE_TTL_SECONDS}` } })
}

export async function proxySmogonStats(request: Request, ctx: ExecutionContext): Promise<Response> {
  if (request.method !== "GET") return new Response("Method Not Allowed", { status: 405, headers: { allow: "GET" } })
  return withEdgeCache(request, ctx, async () => {
    const requestPath = new URL(request.url).pathname
    if (requestPath === "/api/smogon/latest") return latestSmogonChampions()
    if (requestPath === "/api/smogon/formats") return listSmogonChampionsFormats()
    const path = requestPath.replace(/^\/api\/smogon\//, "")
    if (!/^[0-9]{4}-[0-9]{2}\/chaos\/gen[0-9a-z-]+\.json(?:\.gz)?$/.test(path)) return new Response("Bad Request", { status: 400 })
    const upstream = await fetch(SMOGON_ORIGIN + path)
    if (!upstream.ok) return new Response("Smogon stats unavailable", { status: upstream.status })
    return new Response(upstream.body, { status: 200, headers: { "content-type": "application/json; charset=utf-8" } })
  })
}

type PikalyticsFormat = { format: string; date: string }
type PikalyticsRule = { id: string; label: string }
type PikalyticsCatalog = PikalyticsFormat & { rules: PikalyticsRule[] }

const PIKALYTICS_FORMAT_TTL_MS = 60 * 60 * 1000
let pikalyticsCatalogCache: { value: PikalyticsCatalog; expiresAt: number } | undefined

const PIKALYTICS_FORMAT_SELECT = /<select[^>]*\bid=["']format_dd["'][^>]*>([\s\S]*?)<\/select>/i

/** Ladder formats only. The pokedex page also has nature/move/item <option>s. */
export function parsePikalyticsFormatOptions(
  html: string,
): Array<{ id: string; label: string; selected: boolean }> {
  const select = html.replace(/<!--[\s\S]*?-->/g, "").match(PIKALYTICS_FORMAT_SELECT)
  if (!select) return []
  const seen = new Set<string>()
  const options: Array<{ id: string; label: string; selected: boolean }> = []
  for (const match of select[1].matchAll(/<option([^>]*)\bvalue="([a-z0-9][a-z0-9-]*)"([^>]*)>([^<]*)/gi)) {
    if (/\b(?:disabled|hidden)\b|display\s*:\s*none/i.test(`${match[1]} ${match[3]}`)) continue
    const id = match[2]
    if (seen.has(id)) continue
    seen.add(id)
    options.push({
      id,
      label: match[4].trim(),
      selected: /\bselected\b/i.test(`${match[1]} ${match[3]}`),
    })
  }
  return options
}

/**
 * Pikalytics discovers its own dataset from the site's GameConfig: the pokedex
 * page marks the active ladder format (including its rating suffix) with
 * `selected`, and the AI pokedex header carries the "Data Date" it is published
 * under. The pokedex response is large, so keep the resolved catalog per isolate.
 */
export async function resolvePikalyticsCatalog(): Promise<PikalyticsCatalog | null> {
  if (pikalyticsCatalogCache && pikalyticsCatalogCache.expiresAt > Date.now()) {
    return pikalyticsCatalogCache.value
  }
  const [pokedex, aiIndex] = await Promise.all([
    fetch(`${PIKALYTICS_ORIGIN}/pokedex`, { headers: UPSTREAM_HEADERS, signal: AbortSignal.timeout(15_000) }),
    fetch(`${PIKALYTICS_ORIGIN}/ai/pokedex`, { headers: UPSTREAM_HEADERS, signal: AbortSignal.timeout(15_000) }),
  ])
  if (!pokedex.ok || !aiIndex.ok) return null
  const pokedexHtml = await pokedex.text()
  const aiMarkdown = await aiIndex.text()
  const options = parsePikalyticsFormatOptions(pokedexHtml)
  const selected = options.find((option) => option.selected)?.id ?? options[0]?.id
  const date = aiMarkdown.match(/- \*\*Data Date\*\*: `?([0-9]{4}-[0-9]{2})`?/)?.[1]
  if (!selected || !date || options.length === 0) return null
  const value = {
    format: selected,
    date,
    rules: options.map(({ id, label }) => ({ id, label: label || id })),
  }
  pikalyticsCatalogCache = { value, expiresAt: Date.now() + PIKALYTICS_FORMAT_TTL_MS }
  return value
}

export async function resolvePikalyticsFormat(): Promise<PikalyticsFormat | null> {
  const catalog = await resolvePikalyticsCatalog()
  return catalog ? { format: catalog.format, date: catalog.date } : null
}

export function resetPikalyticsFormatCacheForTest(): void {
  pikalyticsCatalogCache = undefined
}

/** Pikalytics keys both data endpoints by date and format, but the Pokemon comes last on detail. */
async function fetchPikalytics(
  endpoint: "l" | "p",
  pokemon?: string,
  target?: PikalyticsFormat,
): Promise<Response> {
  const resolved = target ?? await resolvePikalyticsFormat()
  if (!resolved) return new Response("Pikalytics stats unavailable", { status: 502 })
  const suffix = pokemon == null ? "" : `/${encodeURIComponent(pokemon)}`
  const upstream = await fetch(`${PIKALYTICS_ORIGIN}/api/${endpoint}/${resolved.date}/${resolved.format}${suffix}`, { headers: UPSTREAM_HEADERS, signal: AbortSignal.timeout(15_000) })
  if (!upstream.ok) return new Response("Pikalytics stats unavailable", { status: upstream.status })
  const data: unknown = await upstream.json()
  return Response.json({ ...resolved, data }, { headers: { "cache-control": `public, max-age=${EDGE_CACHE_TTL_SECONDS}` } })
}

async function listPikalyticsFormats(): Promise<Response> {
  const catalog = await resolvePikalyticsCatalog()
  if (!catalog) return new Response("Pikalytics stats unavailable", { status: 502 })
  return Response.json(
    { defaultId: catalog.format, date: catalog.date, rules: catalog.rules },
    { headers: { "cache-control": `public, max-age=${EDGE_CACHE_TTL_SECONDS}` } },
  )
}

export async function proxyPikalytics(request: Request, ctx: ExecutionContext): Promise<Response> {
  if (request.method !== "GET") return new Response("Method Not Allowed", { status: 405, headers: { allow: "GET" } })
  const path = decodeURIComponent(new URL(request.url).pathname.replace(/^\/api\/pikalytics\//, ""))
  return withEdgeCache(request, ctx, async () => {
    if (path === "latest") return fetchPikalytics("l")
    if (path === "formats") return listPikalyticsFormats()
    const specific = path.match(/^(l|p)\/(\d{4}-\d{2})\/([a-z0-9-]+)(?:\/(.+))?$/)
    if (specific) {
      const [, endpoint, date, format, pokemon] = specific
      if (pokemon && !/^[\w .'’-]+$/.test(pokemon)) return new Response("Bad Request", { status: 400 })
      if (endpoint === "p" && !pokemon) return new Response("Bad Request", { status: 400 })
      return fetchPikalytics(endpoint as "l" | "p", pokemon, { date, format })
    }
    if (path.startsWith("pokemon/")) {
      const pokemon = path.slice("pokemon/".length)
      if (!/^[\w .'’-]+$/.test(pokemon)) return new Response("Bad Request", { status: 400 })
      return fetchPikalytics("p", pokemon)
    }
    return new Response("Not Found", { status: 404 })
  })
}

export async function discoverUsageCatalog(source: UsageSource): Promise<UsageCatalog> {
  if (source === "champions") {
    const response = await fetch(CHAMPIONS_INDEX_URL, { signal: AbortSignal.timeout(15_000) })
    if (!response.ok) throw new Error("Champions catalog unavailable")
    const index = await response.json() as { seasons?: string[]; defaultSeason?: string }
    const ids = index.seasons?.length ? index.seasons : [index.defaultSeason ?? "Current"]
    return { defaultId: index.defaultSeason ?? ids[0], rules: ids.map(id => ({ id, label: id })) }
  }
  if (source === "smogon") {
    const response = await listSmogonChampionsFormats()
    if (!response.ok) throw new Error("Smogon catalog unavailable")
    return response.json()
  }
  const catalog = await resolvePikalyticsCatalog()
  if (!catalog) throw new Error("Pikalytics catalog unavailable")
  return { defaultId: catalog.format, date: catalog.date, rules: catalog.rules }
}

