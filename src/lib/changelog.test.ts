import { describe, expect, it } from "vitest"

import { assertLocalizedChangelogEntry, parseChangelog } from "./changelog-format"

describe("parseChangelog", () => {
  it("reads localized released and unreleased entries", () => {
    const entry = `<!-- changelog:start -->
<!-- changelog:en -->
Share setup links.
<!-- changelog:zh-hans -->
分享配置链接。
<!-- changelog:zh-hant -->
分享配置連結。
<!-- changelog:ja -->
設定リンクを共有できます。
<!-- changelog:end -->`

    expect(parseChangelog(`# PokeGauge\n\n## Unreleased\n\n${entry}`)).toEqual([
      {
        version: null,
        messages: {
          en: "Share setup links.",
          "zh-hans": "分享配置链接。",
          "zh-hant": "分享配置連結。",
          ja: "設定リンクを共有できます。",
        },
      },
    ])
    expect(parseChangelog(`# PokeGauge\n\n## 0.2.0\n\n### Minor Changes\n\n- abc: ${entry}`)[0]?.version).toBe("0.2.0")
    expect(() => assertLocalizedChangelogEntry(entry)).not.toThrow()
    expect(() => assertLocalizedChangelogEntry(entry.replace("<!-- changelog:ja -->", ""))).toThrow(
      "Changelog locale must appear exactly once: ja",
    )
  })
})
