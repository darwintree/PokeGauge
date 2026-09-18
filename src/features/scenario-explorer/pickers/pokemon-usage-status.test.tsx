// @vitest-environment happy-dom
import { act } from "react"
import { createRoot } from "react-dom/client"
import { IntlProvider } from "react-intl"
import { expect, it, vi } from "vitest"

import { getCatalogShell } from "@/lib/catalog"
import { localeMessages } from "@/lib/i18n"
import { PokemonUsageStatus } from "./pokemon-usage-status"

it("announces pending details, offers retry on failure, and explains an empty recommendation", async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  const catalog = await getCatalogShell(445, 727, "en")
  const container = document.createElement("div")
  const root = createRoot(container)
  const retry = vi.fn()
  async function render(hasMoves = false) {
    await act(async () => root.render(
      <IntlProvider locale="en" messages={localeMessages.en}>
        <PokemonUsageStatus catalog={catalog} hasMoves={hasMoves} onRetry={retry} />
      </IntlProvider>,
    ))
  }
  try {
    await render()
    expect(container.querySelector('[role="status"]')?.textContent).toContain("Loading")
    expect(container.textContent).toContain("You can still select moves and items.")
    expect(container.querySelector("button")).toBeNull()
    catalog.defaultMovePickStatus = "ready"
    catalog.defaultAbilityPickStatus = "ready"
    catalog.defaultItemPickStatus = "unavailable"
    catalog.defaultStatPickStatus = "ready"
    await render()
    expect(container.textContent).toContain("could not load")
    await act(async () => container.querySelector("button")?.click())
    expect(retry).toHaveBeenCalledOnce()
    catalog.defaultItemPickStatus = "ready"
    await render()
    expect(container.textContent).toContain("No recommended moves")
    expect(container.textContent).toContain("Garchomp")
    await render(true)
    expect(container.textContent).toBe("")
  } finally {
    await act(async () => root.unmount())
  }
})
