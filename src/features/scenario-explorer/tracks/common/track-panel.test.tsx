// @vitest-environment happy-dom

import { act, useState } from "react"
import { createRoot } from "react-dom/client"
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


it.each(["Attack", "HP / Defense"])("toggles %s with one click on the header chevron", async (label) => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  const container = document.createElement("div")
  const root = createRoot(container)
  function Harness() {
    const [expanded, setExpanded] = useState(false)
    return <TrackPanel label={label} icon={Gauge} summary={<span>Summary</span>}
      summaryLayout="stack" expanded={expanded} onToggle={() => setExpanded(value => !value)}>
      <span>Stat editor</span>
    </TrackPanel>
  }
  try {
    await act(async () => root.render(<Harness />))
    const chevron = container.querySelector(".lucide-chevron-down")!
    expect(chevron.closest("button")?.textContent).toContain(label)
    await act(async () => chevron.dispatchEvent(new MouseEvent("click", { bubbles: true })))
    expect(container.querySelector("button")?.getAttribute("aria-expanded")).toBe("true")
    expect(container.textContent).toContain("Stat editor")
    await act(async () => chevron.dispatchEvent(new MouseEvent("click", { bubbles: true })))
    expect(container.querySelector("button")?.getAttribute("aria-expanded")).toBe("false")
    expect(container.textContent).not.toContain("Stat editor")
  } finally {
    await act(async () => root.unmount())
  }
})
