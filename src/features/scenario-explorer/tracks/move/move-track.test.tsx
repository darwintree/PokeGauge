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

it("toggles collapsed move chips without expanding", async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  const container = document.createElement("div")
  const root = createRoot(container)
  const onToggle = vi.fn()
  const onSelectionChange = vi.fn()
  const snapshots = [{
    id: "tackle",
    moveId: 33,
    power: 40,
    accuracy: 100,
    alwaysHits: false,
    criticalStage: 0 as const,
    spreadEligible: false,
    spread: false,
  }]

  await act(async () => {
    root.render(
      <IntlProvider locale="en" messages={localeMessages.en}>
        <MoveTrack
          label="Moves"
          attackerId={6}
          attackerTypes={["fire", "flying"]}
          defenderTypes={["normal"]}
          options={[{
            id: 33,
            label: "Tackle",
            summary: "",
            moveName: "Tackle",
            type: "normal",
            category: "physical",
            power: 40,
            accuracy: 100,
            isSpread: false,
          }]}
          snapshots={snapshots}
          selectedSnapshotIds={["tackle"]}
          onAdd={vi.fn()}
          onChange={vi.fn()}
          onRemove={vi.fn()}
          onSelectionChange={onSelectionChange}
          expanded={false}
          onToggle={onToggle}
          category="physical"
          onCategoryChange={vi.fn()}
        />
      </IntlProvider>,
    )
  })

  const tackle = [...container.querySelectorAll("button")].find(
    (button) => button.textContent?.includes("Tackle"),
  )
  expect(tackle).toBeDefined()
  await act(async () => tackle?.click())
  expect(onSelectionChange).toHaveBeenCalledWith([])
  expect(onToggle).not.toHaveBeenCalled()

  const addMove = container.querySelector('button[aria-label="Add move"]')
  expect(addMove).not.toBeNull()
  expect(addMove?.closest("[role=group]")?.getAttribute("aria-label")).toBe("Moves")
  await act(async () => addMove && (addMove as HTMLButtonElement).click())
  expect(onToggle).not.toHaveBeenCalled()

  await act(async () => root.unmount())
})
