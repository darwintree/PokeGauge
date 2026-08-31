import { renderToStaticMarkup } from "react-dom/server"
import { Gauge } from "lucide-react"
import { IntlProvider } from "react-intl"
import { expect, it } from "vitest"

import { localeMessages } from "@/lib/i18n"

import { TrackPanel } from "./track-panel"

it("renders accessible red attacker and blue defender title marks", () => {
  function render(side: "attacker" | "defender") {
    return renderToStaticMarkup(
      <IntlProvider locale="en" messages={localeMessages.en}>
        <TrackPanel
          side={side}
          label="Ability"
          icon={Gauge}
          summary="Pressure"
          expanded={false}
          onToggle={() => {}}
        >
          <span />
        </TrackPanel>
      </IntlProvider>,
    )
  }

  const attacker = render("attacker")
  const defender = render("defender")
  expect(attacker).toContain("ATK")
  expect(attacker).toContain("Attacker")
  expect(attacker).toContain("bg-[var(--battle-side-attacker)]")
  expect(defender).toContain("DEF")
  expect(defender).toContain("Defender")
  expect(defender).toContain("bg-[var(--battle-side-defender)]")
})

it("renders stack header controls only while expanded", () => {
  function render(expanded: boolean) {
    return renderToStaticMarkup(
      <TrackPanel
        label="Stats"
        icon={Gauge}
        summary={<span>Summary</span>}
        summaryLayout="stack"
        headerTrailing={<button type="button">Mode</button>}
        expanded={expanded}
        onToggle={() => {}}
      >
        <span />
      </TrackPanel>,
    )
  }

  expect(render(true)).toContain(">Mode</button>")
  expect(render(false)).not.toContain(">Mode</button>")
})

it("keeps a static Choice Pool visible without expand controls", () => {
  const markup = renderToStaticMarkup(
    <IntlProvider locale="en" messages={localeMessages.en}>
      <TrackPanel
        expandable={false}
        label="Weather"
        icon={Gauge}
        summary={<span>PoolChip</span>}
      >
        <span>ExpandedOnly</span>
      </TrackPanel>
    </IntlProvider>,
  )

  expect(markup).toContain("PoolChip")
  expect(markup).not.toContain("ExpandedOnly")
  expect(markup).not.toContain("aria-expanded")
})
