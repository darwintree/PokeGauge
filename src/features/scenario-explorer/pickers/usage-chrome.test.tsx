// @vitest-environment happy-dom

import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { IntlProvider } from "react-intl"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { localeMessages } from "@/lib/i18n"
import type { UsageStoreSnapshot } from "@/lib/usage-store"

import { UsagePickerChrome } from "./usage-chrome"

const snapshot: UsageStoreSnapshot = {
  source: "champions",
  ruleId: "M4",
  rules: [
    { id: "Current", label: "Current" },
    { id: "M4", label: "M4" },
  ],
  currentSeriesOnly: true,
  fetchedAt: Date.now(),
  pendingUpdate: false,
  refreshing: false,
  generation: 0,
}

vi.mock("@/lib/usage-store", () => ({
  useUsageStore: () => snapshot,
  setUsageStoreSource: vi.fn(),
  setUsageStoreRule: vi.fn(),
  refreshUsageStore: vi.fn(),
  applyUsageStorePending: vi.fn(),
}))

describe("UsagePickerChrome", () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    snapshot.pendingUpdate = false
    container = document.createElement("div")
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => root.unmount())
    container.remove()
    document.body.innerHTML = ""
  })

  async function renderChrome() {
    await act(async () => {
      root.render(
        <IntlProvider locale="en" messages={localeMessages.en}>
          <UsagePickerChrome />
        </IntlProvider>,
      )
      await Promise.resolve()
    })
  }

  it("starts as one summary row without source or rule dropdowns", async () => {
    await renderChrome()
    const toggle = container.querySelector("[aria-expanded]")
    expect(toggle?.getAttribute("aria-expanded")).toBe("false")
    expect(toggle?.hasAttribute("aria-controls")).toBe(false)
    expect(toggle?.textContent).toContain("Pokémon Champions")
    expect(toggle?.textContent).toContain("M4")
    expect(container.querySelector('[aria-label="Usage source"]')).toBeNull()
    expect(container.querySelector('[aria-label="Usage rule"]')).toBeNull()
    expect(container.textContent).not.toContain("Fetch now")
  })

  it("expands on demand to cascade source, rules, fetch, and apply", async () => {
    snapshot.pendingUpdate = true
    await renderChrome()
    const toggle = container.querySelector("[aria-expanded]") as HTMLButtonElement
    expect(toggle.textContent).toContain("Update")
    expect(container.textContent).not.toContain("Apply update")

    await act(async () => {
      toggle.click()
      await Promise.resolve()
    })

    expect(toggle.getAttribute("aria-expanded")).toBe("true")
    expect(toggle.getAttribute("aria-controls")).toBeTruthy()
    expect(container.querySelector('[aria-label="Usage source"]')).not.toBeNull()
    expect(container.querySelector('[aria-label="Usage rule"]')).not.toBeNull()
    expect(container.textContent).toContain("Fetch now")
    expect(container.textContent).toContain("Apply update")
    expect(toggle.textContent).not.toContain("Update")
  })
})
