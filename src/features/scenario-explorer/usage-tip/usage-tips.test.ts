import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  isUsageTipMutedOn,
  localCalendarDateKey,
  muteUsageTipsForLocalDay,
  pickUsageTip,
  USAGE_TIP_MUTE_STORAGE_KEY,
  USAGE_TIPS,
} from "./usage-tips"

describe("usage tips", () => {
  let data: Record<string, string>

  beforeEach(() => {
    data = {}
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => data[key] ?? null,
      setItem: (key: string, value: string) => {
        data[key] = value
      },
      removeItem: (key: string) => {
        delete data[key]
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("picks uniformly from the maintained catalog", () => {
    expect(pickUsageTip(USAGE_TIPS, () => 0)?.id).toBe("feedback")
    expect(pickUsageTip(USAGE_TIPS, () => 0.5)?.id).toBe("share")
    expect(pickUsageTip(USAGE_TIPS, () => 0.99)?.id).toBe("bookmark")
    expect(pickUsageTip([], () => 0)).toBeNull()
  })

  it("mutes every usage tip for the viewer's local calendar day", () => {
    const morning = new Date(2026, 7, 18, 9, 0, 0)
    const evening = new Date(2026, 7, 18, 23, 50, 0)
    const nextDay = new Date(2026, 7, 19, 0, 10, 0)

    expect(localCalendarDateKey(morning)).toBe("2026-08-18")
    muteUsageTipsForLocalDay(morning)
    expect(data[USAGE_TIP_MUTE_STORAGE_KEY]).toBe("2026-08-18")
    expect(isUsageTipMutedOn(evening)).toBe(true)
    expect(isUsageTipMutedOn(nextDay)).toBe(false)
  })
})
