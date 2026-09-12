const PRODUCT_EVENTS = new Set(["page_view", "scenario_ready", "share", "feedback"])
const SUPPORTED_LOCALES = new Set(["zh-hans", "zh-hant", "en", "ja"])
const SMOGON_ORIGIN = "https://www.smogon.com/stats/"
const PIKALYTICS_ORIGIN = "https://www.pikalytics.com"
const PIKALYTICS_FORMAT = "gen9championsvgc2026regmc"

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

export async function proxySmogonStats(request: Request): Promise<Response> {
  if (request.method !== "GET") return new Response("Method Not Allowed", { status: 405, headers: { allow: "GET" } })
  const requestPath = new URL(request.url).pathname
  if (requestPath === "/api/smogon/latest") return latestSmogonChampions()
  const path = requestPath.replace(/^\/api\/smogon\//, "")
  if (!/^[0-9]{4}-[0-9]{2}\/chaos\/gen[0-9a-z-]+\.json(?:\.gz)?$/.test(path)) return new Response("Bad Request", { status: 400 })
  const upstream = await fetch(SMOGON_ORIGIN + path)
  if (!upstream.ok) return new Response("Smogon stats unavailable", { status: upstream.status })
  return new Response(upstream.body, { status: 200, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=3600" } })
}

async function proxyPikalytics(request: Request): Promise<Response> {
  if (request.method !== "GET") return new Response("Method Not Allowed", { status: 405, headers: { allow: "GET" } })
  const path = new URL(request.url).pathname.replace(/^\/api\/pikalytics\//, "")
  if (path === "format") return fetch(`${PIKALYTICS_ORIGIN}/ai/pokedex/${PIKALYTICS_FORMAT}`)
  if (!/^[A-Za-z0-9-]+$/.test(path)) return new Response("Bad Request", { status: 400 })
  const upstream = await fetch(`${PIKALYTICS_ORIGIN}/ai/pokedex/${PIKALYTICS_FORMAT}/${path}`)
  if (!upstream.ok) return new Response("Pikalytics stats unavailable", { status: upstream.status })
  return new Response(upstream.body, { headers: { "content-type": "text/markdown; charset=utf-8", "cache-control": "public, max-age=3600" } })
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
  async fetch(request, env): Promise<Response> {
    if (new URL(request.url).pathname === "/api/events") {
      return recordProductEvent(request, env)
    }
    if (new URL(request.url).pathname.startsWith("/api/smogon/")) return proxySmogonStats(request)
    if (new URL(request.url).pathname.startsWith("/api/pikalytics/")) return proxyPikalytics(request)
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
