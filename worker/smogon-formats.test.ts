import { afterEach, describe, expect, it, vi } from "vitest"

import { proxySmogonStats } from "./index"

const CHAOS_HTML = `
<a href="gen9championsvgc2026regma-0.json.gz">regma-0</a>
<a href="gen9championsvgc2026regmb-0.json.gz">regmb-0</a>
<a href="gen9championsvgc2026regmb-1760.json.gz">regmb-1760</a>
<a href="gen9championsvgc2026regmbbo3-0.json.gz">bo3-0</a>
`

function request(path: string): Request {
  return new Request(`https://pokegauge.example${path}`)
}

const ctx = {
  waitUntil: (promise: Promise<unknown>) => promise,
  passThroughOnException: () => {},
} as unknown as ExecutionContext

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("Smogon format listing", () => {
  it("lists VGC chaos files with cutoffs and keeps cutoff-0 as the source default", async () => {
    const requested: string[] = []
    vi.stubGlobal("fetch", (input: RequestInfo | URL) => {
      const url = String(input)
      requested.push(url)
      if (url.endsWith("/chaos/") || url.endsWith("/chaos")) {
        return Promise.resolve(new Response(CHAOS_HTML))
      }
      return Promise.resolve(new Response("{}", { headers: { "content-type": "application/json" } }))
    })

    const response = await proxySmogonStats(request("/api/smogon/formats"), ctx)
    const body = await response.json() as {
      defaultId: string
      rules: Array<{ id: string; label: string }>
    }

    expect(body.defaultId).toMatch(/\/gen9championsvgc2026regmbbo3-0$/)
    expect(body.rules.map((rule) => rule.id.split("/")[1])).toEqual([
      "gen9championsvgc2026regma-0",
      "gen9championsvgc2026regmb-0",
      "gen9championsvgc2026regmb-1760",
      "gen9championsvgc2026regmbbo3-0",
    ])
    expect(body.rules.find((rule) => rule.id.endsWith("regmb-1760"))?.label).toBe("VGC 2026 Reg M-B 1760")
    expect(requested.some((url) => url.includes(".json"))).toBe(false)
  })

  it("does not parse chaos JSON when proxying a specific file", async () => {
    vi.stubGlobal("fetch", (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes("/chaos/gen9championsvgc2026regmb-1760.json")) {
        return Promise.resolve(new Response("{\"data\":{}}", { headers: { "content-type": "application/json" } }))
      }
      return Promise.resolve(new Response("nope", { status: 404 }))
    })

    const response = await proxySmogonStats(
      request("/api/smogon/2026-08/chaos/gen9championsvgc2026regmb-1760.json"),
      ctx,
    )
    expect(response.status).toBe(200)
    await expect(response.text()).resolves.toBe("{\"data\":{}}")
  })
})
