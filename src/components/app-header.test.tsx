// @vitest-environment happy-dom

import { act, useState } from "react"
import { createRoot, type Root } from "react-dom/client"
import { IntlProvider } from "react-intl"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { localeMessages, type SupportedLocale } from "@/lib/i18n"
import type { ProbabilityMode } from "@/lib/damage-calculation"
import type { StatNameStrategy } from "@/lib/stat-preset"

import { AppHeader } from "./app-header"

function Harness() {
  const [locale, setLocale] = useState<SupportedLocale>("en")
  const [probabilityMode, setProbabilityMode] = useState<ProbabilityMode>("battle-odds")
  const [statNameStrategy, setStatNameStrategy] = useState<StatNameStrategy>("habcds")

  return (
    <IntlProvider locale={locale} messages={localeMessages[locale]}>
      <AppHeader
        locale={locale}
        onLocaleChange={setLocale}
        probabilityMode={probabilityMode}
        onProbabilityModeChange={setProbabilityMode}
        statNameStrategy={statNameStrategy}
        onStatNameStrategyChange={setStatNameStrategy}
        feedbackScenarioUrl={null}
      />
    </IntlProvider>
  )
}

function click(element: Element | null) {
  if (!element) throw new Error("Expected clickable element")
  act(() => element.dispatchEvent(new MouseEvent("click", { bubbles: true })))
}

function choose(id: string, value: string) {
  const select = document.querySelector<HTMLSelectElement>(`#${id}`)
  if (!select) throw new Error(`Expected select #${id}`)
  act(() => {
    select.value = value
    select.dispatchEvent(new Event("change", { bubbles: true }))
  })
}

describe("app settings", () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
    container = document.createElement("div")
    document.body.append(container)
    root = createRoot(container)
    act(() => root.render(<Harness />))
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.restoreAllMocks()
  })

  it("opens on Preferences and applies all three global preferences", () => {
    click(document.querySelector('[aria-label="Settings"]'))

    expect(document.querySelector('[role="tab"][aria-selected="true"]')?.textContent)
      .toContain("Preferences")

    choose("settings-locale", "ja")
    expect(document.documentElement.textContent).toContain("環境設定")

    choose("settings-stat-display", "english")
    expect(document.querySelector<HTMLSelectElement>("#settings-stat-display")?.value)
      .toBe("english")

    choose("settings-probability-mode", "classic")
    expect(document.querySelector<HTMLSelectElement>("#settings-probability-mode")?.value)
      .toBe("classic")
    expect(document.body.textContent).toContain(localeMessages.ja["probability.mode.classic.hint"])
  })

  it("exposes accessible tabs and switches sections", () => {
    click(document.querySelector('[aria-label="Settings"]'))
    const updates = [...document.querySelectorAll('[role="tab"]')]
      .find((tab) => tab.textContent?.includes("Updates"))
    click(updates ?? null)

    expect(document.querySelector('[role="tab"][aria-selected="true"]')?.textContent)
      .toContain("Updates")
    expect(document.querySelector('[role="tabpanel"]')?.textContent).toContain("Latest changes")
  })
})
