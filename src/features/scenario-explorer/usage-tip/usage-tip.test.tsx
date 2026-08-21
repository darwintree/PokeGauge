import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { IntlProvider } from "react-intl"
import { describe, expect, it } from "vitest"

import { localeMessages } from "@/lib/i18n"

import { UsageTipCard } from "./usage-tip"
import { USAGE_TIPS } from "./usage-tips"

describe("UsageTipCard box color swatches", () => {
  const boxTip = USAGE_TIPS.find((tip) => tip.id === "boxColors")!

  it("renders one narrow painted rectangle per color label", () => {
    const markup = renderToStaticMarkup(createElement(
      IntlProvider,
      { locale: "zh-Hans", messages: localeMessages["zh-hans"] },
      createElement(UsageTipCard, { tip: boxTip }),
    ))

    const swatches = markup.match(/inline-block h-2 w-3\.5/g)
    expect(swatches).toHaveLength(3)
    expect(markup).toContain("var(--damage-safe-end)")
    expect(markup).toContain("var(--damage-warm-end)")
    expect(markup).toContain("var(--damage-guaranteed-end)")
  })
})

describe("UsageTipCard stat range example", () => {
  const rangeTip = USAGE_TIPS.find((tip) => tip.id === "statValueOptions")!

  it.each([
    ["zh-hans", "区间", "展开"],
    ["zh-hant", "區間", "展開"],
    ["en", "range", "Expand"],
    ["ja", "レンジ", "展開"],
  ] as const)("renders the range and expand labels in %s", (locale, range, expand) => {
    const markup = renderToStaticMarkup(createElement(
      IntlProvider,
      { locale, messages: localeMessages[locale] },
      createElement(UsageTipCard, { tip: rangeTip }),
    ))

    expect(markup).toContain(range)
    expect(markup).toContain("inline-flex h-3 w-7 shrink-0")
    expect(markup).toContain("size-[5px] shrink-0 rounded-full bg-current")
    expect(markup).toContain(expand)
    expect(markup).toContain("size-3.5 shrink-0")
  })
})
