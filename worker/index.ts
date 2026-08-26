const PRODUCT_EVENTS = new Set(["page_view", "scenario_ready", "share", "feedback"])
const SUPPORTED_LOCALES = new Set(["zh-hans", "zh-hant", "en", "ja"])

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
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
