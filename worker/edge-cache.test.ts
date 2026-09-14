import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { proxyPikalytics, resetPikalyticsFormatCacheForTest } from "./index"

const STORE = "gen9championsvgc2026regmc-1760"

const POKEDEX_HTML = `<option value="${STORE}" selected>Format</option>`
const AI_MARKDOWN = "- **Data Date**: 2026-05"

function memoryCache(): Cache {
  const entries = new Map<string, Response>()
  return {
    match: async (request: RequestInfo | URL) => entries.get(String(request))?.clone(),
    put: async (request: RequestInfo | URL, response: Response) => {
      const stored = response.clone()
      entries.set(String(request), stored)
    },
  } as unknown as Cache
}

function stubGlobals(upstreamCalls: string[]): void {
  const cache = memoryCache()
  vi.stubGlobal("caches", { open: async () => cache })
  vi.stubGlobal("fetch", (input: RequestInfo | URL) => {
    const url = String(input)
    upstreamCalls.push(url)
    if (url.endsWith("/ai/pokedex")) return Promise.resolve(new Response(AI_MARKDOWN))
    if (url.endsWith("/pokedex")) return Promise.resolve(new Response(POKEDEX_HTML))
    if (url.includes("/api/l/")) return Promise.resolve(Response.json([{ name: "Rillaboom", rank: "1" }]))
    return Promise.resolve(new Response("", { status: 404 }))
  })
}

function request(path: string): Request {
  return new Request(`https://pokegauge.example${path}`)
}

const ctx = { waitUntil: (promise: Promise<unknown>) => promise, passThroughOnException: () => {} } as unknown as ExecutionContext

afterEach(() => {
  vi.unstubAllGlobals()
})

beforeEach(() => {
  resetPikalyticsFormatCacheForTest()
})

describe("edge cache", () => {
  it("serves the second request without touching the upstream", async () => {
    const upstreamCalls: string[] = []
    stubGlobals(upstreamCalls)

    const first = await proxyPikalytics(request("/api/pikalytics/latest"), ctx)
    const callsAfterFirst = upstreamCalls.length
    const second = await proxyPikalytics(request("/api/pikalytics/latest"), ctx)

    expect(first.status).toBe(200)
    expect(second.status).toBe(200)
    await expect(second.json()).resolves.toEqual({ format: STORE, date: "2026-05", data: [{ name: "Rillaboom", rank: "1" }] })
    expect(upstreamCalls).toHaveLength(callsAfterFirst)
  })

  it("does not cache error responses", async () => {
    const upstreamCalls: string[] = []
    stubGlobals(upstreamCalls)
    vi.stubGlobal("fetch", (input: RequestInfo | URL) => {
      upstreamCalls.push(String(input))
      return Promise.resolve(new Response("nope", { status: 503 }))
    })

    await proxyPikalytics(request("/api/pikalytics/latest"), ctx)
    await proxyPikalytics(request("/api/pikalytics/latest"), ctx)

    expect(upstreamCalls).toHaveLength(4)
  })

  it("rejects unknown paths before caching", async () => {
    const upstreamCalls: string[] = []
    stubGlobals(upstreamCalls)

    const response = await proxyPikalytics(request("/api/pikalytics/bogus"), ctx)

    expect(response.status).toBe(404)
    expect(upstreamCalls).toHaveLength(0)
  })
})
