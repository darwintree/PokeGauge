import { describe, expect, it } from "vitest"

import {
  DEFAULT_LOCALE,
  localeMessages,
  resolveInitialLocale,
} from "@/lib/i18n"

describe("locale selection", () => {
  it("uses a persisted supported locale before browser language", () => {
    expect(resolveInitialLocale("ja", ["en-US"])).toBe("ja")
  })

  it("matches supported browser languages deterministically", () => {
    expect(resolveInitialLocale(null, ["zh-TW", "en-US"])).toBe("zh-hant")
    expect(resolveInitialLocale(null, ["zh-CN", "en-US"])).toBe("zh-hans")
    expect(resolveInitialLocale(null, ["ja-JP"])).toBe("ja")
    expect(resolveInitialLocale(null, ["en-US"])).toBe("en")
  })

  it("falls back to the default supported locale for unsupported browser settings", () => {
    expect(resolveInitialLocale("fr", ["fr-FR"])).toBe(DEFAULT_LOCALE)
  })

  it("keeps every locale on the canonical message-key set", () => {
    const canonicalKeys = Object.keys(localeMessages.en).sort()
    for (const [locale, messages] of Object.entries(localeMessages)) {
      expect(Object.keys(messages).sort(), locale).toEqual(canonicalKeys)
    }
  })
})
