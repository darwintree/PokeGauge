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

describe("UsageTipCard expand stat example", () => {
  const expandTip = USAGE_TIPS.find((tip) => tip.id === "expandStat")!

  it("renders the result expand button", () => {
    const markup = renderToStaticMarkup(createElement(
      IntlProvider,
      { locale: "zh-Hans", messages: localeMessages["zh-hans"] },
      createElement(UsageTipCard, { tip: expandTip }),
    ))

    expect(markup).toContain("size-3.5 place-items-center rounded-[4px]")
    expect(markup).toContain("size-2.5 text-muted-foreground")
  })
})
