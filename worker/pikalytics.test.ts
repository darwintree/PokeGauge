import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { resetPikalyticsFormatCacheForTest, resolvePikalyticsFormat } from "./index"

const POKEDEX_HTML = `
  <select id="format_dd">
    <option value="gen9championsvgc2026regma-1760">Pokemon Champions VGC 2026 Regulation Set M-A Showdown</option>
    <option value="gen9championsvgc2026regmc-1760" selected>Pokemon Champions VGC 2026 Regulation Set M-C Showdown</option>
  </select>
`

const AI_POKEDEX_MARKDOWN = `
## Format Information

- **Format**: Pokemon Champions VGC 2026 Reg M-C
- **Format Code**: \`gen9championsvgc2026regmc\`
- **Data Date**: 2026-05
`

function stubUpstream(responses: { pokedex?: Response; ai?: Response }): string[] {
  const requested: string[] = []
  vi.stubGlobal("fetch", (input: RequestInfo | URL) => {
    const url = String(input)
    requested.push(url)
    if (url.endsWith("/ai/pokedex")) return Promise.resolve(responses.ai ?? new Response(""))
    if (url.endsWith("/pokedex")) return Promise.resolve(responses.pokedex ?? new Response(""))
    return Promise.resolve(new Response("", { status: 404 }))
  })
  return requested
}

afterEach(() => {
  vi.unstubAllGlobals()
})

beforeEach(() => {
  resetPikalyticsFormatCacheForTest()
})

describe("Pikalytics format discovery", () => {
  it("reads the selected ladder format and the published data date", async () => {
    const requested = stubUpstream({
      pokedex: new Response(POKEDEX_HTML),
      ai: new Response(AI_POKEDEX_MARKDOWN),
    })

    await expect(resolvePikalyticsFormat()).resolves.toEqual({
      format: "gen9championsvgc2026regmc-1760",
      date: "2026-05",
    })
    expect(requested.sort()).toEqual([
      "https://www.pikalytics.com/ai/pokedex",
      "https://www.pikalytics.com/pokedex",
    ])
  })

  it("returns null when the date is not published", async () => {
    stubUpstream({
      pokedex: new Response(POKEDEX_HTML),
      ai: new Response("- **Format Code**: `gen9championsvgc2026regmc`"),
    })

    await expect(resolvePikalyticsFormat()).resolves.toBeNull()
  })

  it("returns null when upstream fails", async () => {
    stubUpstream({ pokedex: new Response("nope", { status: 503 }) })

    await expect(resolvePikalyticsFormat()).resolves.toBeNull()
  })

  it("reuses the resolved format within the cache window", async () => {
    const requested = stubUpstream({
      pokedex: new Response(POKEDEX_HTML),
      ai: new Response(AI_POKEDEX_MARKDOWN),
    })

    await resolvePikalyticsFormat()
    await resolvePikalyticsFormat()

    expect(requested).toHaveLength(2)
  })
})
