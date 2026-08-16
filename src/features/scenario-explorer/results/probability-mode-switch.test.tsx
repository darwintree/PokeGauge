// @vitest-environment happy-dom

import { act, useState } from "react"
import { createRoot, type Root } from "react-dom/client"
import { IntlProvider } from "react-intl"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { localeMessages } from "@/lib/i18n"
import type { TrackState } from "@/lib/scenario"

import { ProbabilityModeSwitch } from "./probability-mode-switch"

const battleHint = localeMessages.en["probability.mode.battleOdds.hint"]
const classicHint = localeMessages.en["probability.mode.classic.hint"]

function Harness() {
  const [mode, setMode] = useState<TrackState["probabilityMode"]>("battle-odds")
  return <ProbabilityModeSwitch mode={mode} onChange={setMode} />
}

describe("probability mode compare panel", () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
    container = document.createElement("div")
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => root.unmount())
    container.remove()
    document.body.innerHTML = ""
  })

  async function render() {
    await act(async () => {
      root.render(
        <IntlProvider locale="en" messages={localeMessages.en}>
          <Harness />
        </IntlProvider>,
      )
    })
  }

  async function click(element: Element | null) {
    expect(element).not.toBeNull()
    await act(async () => {
      ;(element as HTMLElement).click()
      await Promise.resolve()
    })
  }

  it("keeps hints closed until compare is opened, then selects from the panel", async () => {
    await render()
    expect(container.textContent).not.toContain(battleHint)
    expect(container.textContent).not.toContain(classicHint)

    await click(container.querySelector('[aria-label="Compare modes"]'))
    expect(container.textContent).toContain(battleHint)
    expect(container.textContent).toContain(classicHint)
    expect(
      [...container.querySelectorAll('[aria-pressed="true"]')].some((button) =>
        button.textContent?.includes("Now"),
      ),
    ).toBe(true)

    const classicCard = [...container.querySelectorAll("button")].find((button) =>
      button.textContent?.includes(classicHint),
    )
    await click(classicCard ?? null)
    expect(
      [...container.querySelectorAll('[aria-pressed="true"]')].some((button) =>
        button.textContent?.includes("Classic mode"),
      ),
    ).toBe(true)
  })
})
