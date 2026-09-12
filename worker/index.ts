const PRODUCT_EVENTS = new Set(["page_view", "scenario_ready", "share", "feedback"])
const SUPPORTED_LOCALES = new Set(["zh-hans", "zh-hant", "en", "ja"])
const SMOGON_ORIGIN = "https://www.smogon.com/stats/"
const PIKALYTICS_ORIGIN = "https://www.pikalytics.com"

const UPSTREAM_HEADERS = {
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

async function withEdgeCache(
  request: Request,
  ctx: ExecutionContext,
  produce: () => Promise<Response>,
): Promise<Response> {
  if (typeof caches === "undefined") return produce()
  const key = edgeCacheKey(request)
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

async function latestSmogonChampions(): Promise<Response> {
  const now = new Date()
  for (const offset of [0, 1]) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1))
    const month = date.toISOString().slice(0, 7)
    const directory = await fetch(`${SMOGON_ORIGIN}${month}/chaos/`)
    if (!directory.ok) continue
    const html = await directory.text()
    const files = [...html.matchAll(/href="(gen9championsvgc[a-z0-9-]*reg[a-z]+(?:bo3)?-0\.json\.gz)"/g)].map((match) => match[1]).sort()
    if (files.length === 0) continue
    const latestFile = files.at(-1)
    if (!latestFile) continue
    const upstream = await fetch(`${SMOGON_ORIGIN}${month}/chaos/${latestFile.replace(/\.gz$/, "")}`)
    if (!upstream.ok) continue
    return new Response(upstream.body, { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=3600" } })
  }
  return new Response("Smogon stats unavailable", { status: 404 })
}

export async function proxySmogonStats(request: Request, ctx: ExecutionContext): Promise<Response> {
  if (request.method !== "GET") return new Response("Method Not Allowed", { status: 405, headers: { allow: "GET" } })
  return withEdgeCache(request, ctx, async () => {
    const requestPath = new URL(request.url).pathname
    if (requestPath === "/api/smogon/latest") return latestSmogonChampions()
    const path = requestPath.replace(/^\/api\/smogon\//, "")
    if (!/^[0-9]{4}-[0-9]{2}\/chaos\/gen[0-9a-z-]+\.json(?:\.gz)?$/.test(path)) return new Response("Bad Request", { status: 400 })
    const upstream = await fetch(SMOGON_ORIGIN + path)
    if (!upstream.ok) return new Response("Smogon stats unavailable", { status: upstream.status })
    return new Response(upstream.body, { status: 200, headers: { "content-type": "application/json; charset=utf-8" } })
  })
}

type PikalyticsFormat = { format: string; date: string }

const PIKALYTICS_FORMAT_TTL_MS = 60 * 60 * 1000
let pikalyticsFormatCache: { value: PikalyticsFormat; expiresAt: number } | undefined

/**
 * Pikalytics discovers its own dataset from the site's GameConfig: the pokedex
 * page marks the active ladder format (including its rating suffix) with
 * `selected`, and the AI pokedex header carries the "Data Date" it is published
 * under. The pokedex response is large, so keep the resolved pair per isolate.
 */
export async function resolvePikalyticsFormat(): Promise<PikalyticsFormat | null> {
  if (pikalyticsFormatCache && pikalyticsFormatCache.expiresAt > Date.now()) {
    return pikalyticsFormatCache.value
  }
  const [pokedex, aiIndex] = await Promise.all([
    fetch(`${PIKALYTICS_ORIGIN}/pokedex`, { headers: UPSTREAM_HEADERS }),
    fetch(`${PIKALYTICS_ORIGIN}/ai/pokedex`, { headers: UPSTREAM_HEADERS }),
  ])
  if (!pokedex.ok || !aiIndex.ok) return null
  const pokedexHtml = await pokedex.text()
  const aiMarkdown = await aiIndex.text()
  // `selected` marks the active ladder format; keep its rating suffix because the
  // data endpoint is keyed by the full value.
  const selected = pokedexHtml
    .match(/<option[^>]*\bvalue="([a-z0-9][a-z0-9-]*)"[^>]*\bselected\b[^>]*>/)?.[1]
  const date = aiMarkdown.match(/- \*\*Data Date\*\*: `?([0-9]{4}-[0-9]{2})`?/)?.[1]
  if (!selected || !date) return null
  const value = { format: selected, date }
  pikalyticsFormatCache = { value, expiresAt: Date.now() + PIKALYTICS_FORMAT_TTL_MS }
  return value
}

export function resetPikalyticsFormatCacheForTest(): void {
  pikalyticsFormatCache = undefined
}

/** Pikalytics keys every data endpoint by the discovered date and format. */
async function fetchPikalytics(resource: string): Promise<Response> {
  const resolved = await resolvePikalyticsFormat()
  if (!resolved) return new Response("Pikalytics stats unavailable", { status: 502 })
  const upstream = await fetch(`${PIKALYTICS_ORIGIN}/api/${resource}/${resolved.date}/${resolved.format}`, { headers: UPSTREAM_HEADERS })
  if (!upstream.ok) return new Response("Pikalytics stats unavailable", { status: upstream.status })
  const data: unknown = await upstream.json()
  return Response.json({ ...resolved, data }, { headers: { "cache-control": `public, max-age=${EDGE_CACHE_TTL_SECONDS}` } })
}

export async function proxyPikalytics(request: Request, ctx: ExecutionContext): Promise<Response> {
  if (request.method !== "GET") return new Response("Method Not Allowed", { status: 405, headers: { allow: "GET" } })
  const path = decodeURIComponent(new URL(request.url).pathname.replace(/^\/api\/pikalytics\//, ""))
  return withEdgeCache(request, ctx, async () => {
    if (path === "latest") return fetchPikalytics("l")
    if (path.startsWith("pokemon/")) {
      const pokemon = path.slice("pokemon/".length)
      if (!/^[\w .'’-]+$/.test(pokemon)) return new Response("Bad Request", { status: 400 })
      return fetchPikalytics(`p/${encodeURIComponent(pokemon)}`)
    }
    return new Response("Not Found", { status: 404 })
  })
}

function referrerHost(request: Request): string {
  const referrer = request.headers.get("referer")
  if (!referrer) return "direct"
  try {
    return new URL(referrer).hostname || "direct"
  } catch {
    return "invalid"
  }
}

export async function recordProductEvent(
  request: Request,
  env: Pick<Env, "ANALYTICS">,
): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { allow: "POST" } })
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return new Response("Unsupported Media Type", { status: 415 })
  }

  const length = Number(request.headers.get("content-length"))
  if (!Number.isInteger(length) || length < 1 || length > 256) {
    return new Response("Payload Too Large", { status: 413 })
  }

  const url = new URL(request.url)
  const origin = request.headers.get("origin")
  if (origin && origin !== url.origin) return new Response("Forbidden", { status: 403 })

  let body: { event?: unknown; locale?: unknown }
  try {
    body = await request.json()
  } catch {
    return new Response("Bad Request", { status: 400 })
  }
  if (
    typeof body.event !== "string" || !PRODUCT_EVENTS.has(body.event) ||
    typeof body.locale !== "string" || !SUPPORTED_LOCALES.has(body.locale)
  ) {
    return new Response("Bad Request", { status: 400 })
  }

  env.ANALYTICS.writeDataPoint({
    blobs: [
      body.event,
      body.locale,
      typeof request.cf?.country === "string" ? request.cf.country : "unknown",
      referrerHost(request),
    ],
    doubles: [1],
    indexes: [url.hostname],
  })
  return new Response(null, { status: 204 })
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    if (new URL(request.url).pathname === "/api/events") {
      return recordProductEvent(request, env)
    }
    if (new URL(request.url).pathname.startsWith("/api/smogon/")) return proxySmogonStats(request, ctx)
    if (new URL(request.url).pathname.startsWith("/api/pikalytics/")) return proxyPikalytics(request, ctx)
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
