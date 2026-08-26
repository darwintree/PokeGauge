import { describe, expect, it, vi } from "vitest"

import { recordProductEvent } from "./index"

function request(body: object, headers: Record<string, string> = {}) {
  const json = JSON.stringify(body)
  return new Request("https://pokegauge.example/api/events", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "content-length": String(new TextEncoder().encode(json).byteLength),
      origin: "https://pokegauge.example",
      ...headers,
    },
    body: json,
  })
}

describe("Cloudflare product event endpoint", () => {
  it("writes one anonymous Analytics Engine point", async () => {
    const writeDataPoint = vi.fn()
    const response = await recordProductEvent(
      request({ event: "share", locale: "zh-hans" }),
      { ANALYTICS: { writeDataPoint } },
    )

    expect(response.status).toBe(204)
    expect(writeDataPoint).toHaveBeenCalledWith({
      blobs: ["share", "zh-hans", "unknown", "direct"],
      doubles: [1],
      indexes: ["pokegauge.example"],
    })
  })

  it("rejects unknown events and cross-origin writes", async () => {
    const env = { ANALYTICS: { writeDataPoint: vi.fn() } }

    await expect(recordProductEvent(
      request({ event: "unknown", locale: "en" }),
      env,
    )).resolves.toMatchObject({ status: 400 })
    await expect(recordProductEvent(
      request({ event: "share", locale: "en" }, { origin: "https://other.example" }),
      env,
    )).resolves.toMatchObject({ status: 403 })
    expect(env.ANALYTICS.writeDataPoint).not.toHaveBeenCalled()
  })
})
