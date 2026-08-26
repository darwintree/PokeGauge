// @vitest-environment happy-dom

import { act } from "react"
import { createRoot } from "react-dom/client"
import { afterEach, expect, it, vi } from "vitest"

import { useTrackProductEventOnce } from "./analytics"

function Harness({ locale }: { locale: string }) {
  useTrackProductEventOnce("page_view", locale)
  return null
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

it("tracks a mounted product event only once when locale changes", async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
  vi.stubGlobal("fetch", fetch)
  vi.stubEnv("DEV", false)
  const container = document.createElement("div")
  const root = createRoot(container)

  await act(async () => root.render(<Harness locale="en" />))
  await act(async () => root.render(<Harness locale="ja" />))

  expect(fetch).toHaveBeenCalledTimes(1)
  expect(fetch).toHaveBeenCalledWith("/api/events", expect.objectContaining({
    body: JSON.stringify({ event: "page_view", locale: "en" }),
  }))
  act(() => root.unmount())
})
