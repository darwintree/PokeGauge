import { afterEach, expect, it, vi } from "vitest"
import { parsePikalyticsFormatOptions, usageRules } from "./index"
afterEach(() => vi.unstubAllGlobals())
it("returns heuristic recommendations from the published catalog", async () => {
  const upstream = vi.fn(() => { throw new Error("Unexpected upstream") })
  vi.stubGlobal("fetch", upstream)
  const env = { ASSETS: { fetch: vi.fn(async () => Response.json({ source: "champions", defaultId: "Current", rules: ["Current", "M6", "M5", "M4"].map(id => ({ id, label: id })), compiledRules: ["Current"] })) } }
  const response = await usageRules(new Request("https://example.com/api/usage/rules/champions"), env as unknown as Pick<Env, "ASSETS">)
  expect(await response.json()).toMatchObject({ defaultId: "Current", rules: [{ id: "Current", recommended: true }, { id: "M6", recommended: true }, { id: "M5", recommended: true }, { id: "M4", recommended: false }] })
  expect(upstream).not.toHaveBeenCalled()
})
it("validates source and exposes an upstream failure for retry", async () => {
  const env = { ASSETS: { fetch: vi.fn(async () => new Response("<html>")) } }
  vi.stubGlobal("fetch", vi.fn(async () => new Response("bad", { status: 503 })))
  expect((await usageRules(new Request("https://example.com/api/usage/rules/unknown"), env as unknown as Pick<Env, "ASSETS">)).status).toBe(400)
  expect((await usageRules(new Request("https://example.com/api/usage/rules/champions"), env as unknown as Pick<Env, "ASSETS">)).status).toBe(502)
})
it("discovers only visible selectable Pikalytics options", () => {
  expect(parsePikalyticsFormatOptions(`<select id="format_dd"><!-- <option value="preview">Preview</option> --><option hidden value="hidden">Hidden</option><option value="disabled" disabled>Disabled</option><option value="current" selected>Current</option></select>`)).toEqual([{ id: "current", label: "Current", selected: true }])
})
