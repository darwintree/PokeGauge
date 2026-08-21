// @vitest-environment happy-dom

import { act } from "react"
import { createRoot } from "react-dom/client"
import { IntlProvider } from "react-intl"
import { expect, it, vi } from "vitest"

import { localeMessages } from "@/lib/i18n"

import { MoveTrack } from "./move-track"

it("keeps a collapsed Move Track closed when changing category", async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  const container = document.createElement("div")
  const root = createRoot(container)
  const onCategoryChange = vi.fn()
  const onToggle = vi.fn()

  await act(async () => {
    root.render(
      <IntlProvider locale="en" messages={localeMessages.en}>
        <MoveTrack
          label="Moves"
          attackerId={6}
          attackerTypes={["fire", "flying"]}
          defenderTypes={["normal"]}
          options={[]}
          snapshots={[]}
          selectedSnapshotIds={[]}
          onAdd={vi.fn()}
          onChange={vi.fn()}
          onRemove={vi.fn()}
          onSelectionChange={vi.fn()}
          expanded={false}
          onToggle={onToggle}
          category="physical"
          onCategoryChange={onCategoryChange}
        />
      </IntlProvider>,
    )
  })

  const special = [...container.querySelectorAll("button")].find(
    (button) => button.textContent === "Special",
  )
  expect(special).toBeDefined()

  await act(async () => special?.click())

  expect(onCategoryChange).toHaveBeenCalledWith("special")
  expect(onToggle).not.toHaveBeenCalled()

  await act(async () => root.unmount())
})
