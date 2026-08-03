// @vitest-environment happy-dom

import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { IntlProvider } from "react-intl"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { getCatalogShell } from "@/lib/catalog"
import { localeMessages } from "@/lib/i18n/messages"

import { HeldItemTrack } from "./held-item-track"

describe("locked held-item Tracks", () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
    const values = new Map<string, string>()
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
        clear: () => values.clear(),
      },
    })
    container = document.createElement("div")
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => root.unmount())
    container.remove()
    localStorage.clear()
  })

  async function renderTrack(
    props: React.ComponentProps<typeof HeldItemTrack>,
  ) {
    await act(async () => {
      root.render(
        <IntlProvider locale="en" messages={localeMessages.en}>
          <HeldItemTrack {...props} />
        </IntlProvider>,
      )
    })
  }

  it.each([
    ["attacker", 10034, 9, 699, "Charizardite X"],
    ["defender", 6, 10035, 717, "Charizardite Y"],
  ] as const)("keeps the %s Mega Stone visible and non-replaceable", async (
    side,
    attackerId,
    defenderId,
    stoneId,
    label,
  ) => {
    const catalog = await getCatalogShell(attackerId, defenderId, "en")
    const onChange = vi.fn()

    await renderTrack({
      catalog,
      side,
      selectedIds: [stoneId],
      lockedId: side === "attacker"
        ? catalog.attackerLockedItemId
        : catalog.defenderLockedItemId,
      onChange,
    })

    const option = container.querySelector(`button.track-option[aria-label="${label}"]`)
    expect(option).not.toBeNull()
    expect((option as HTMLButtonElement).disabled).toBe(true)

    await act(async () => {
      ;(option as HTMLButtonElement).click()
      await Promise.resolve()
    })
    expect(onChange).not.toHaveBeenCalled()
  })

  it("renders the complete static pool for each unlocked side", async () => {
    const catalog = await getCatalogShell(445, 727, "en")

    await renderTrack({
      catalog,
      selectedIds: ["none"],
      onChange: vi.fn(),
    })
    expect(container.querySelectorAll("button.track-option")).toHaveLength(
      catalog.attackerItems.length,
    )
    expect(container.querySelector('button[aria-label="Life Orb"]')).not.toBeNull()
    expect(container.querySelector('button[aria-label="Eviolite"]')).toBeNull()

    await renderTrack({
      catalog,
      side: "defender",
      selectedIds: ["none"],
      onChange: vi.fn(),
    })
    expect(container.querySelectorAll("button.track-option")).toHaveLength(
      catalog.defenderItems.length,
    )
    expect(container.querySelector('button[aria-label="Eviolite"]')).not.toBeNull()
    expect(container.querySelector('button[aria-label="Life Orb"]')).toBeNull()
  })

  it("restores explicit no-item after removing the last unlocked item", async () => {
    const catalog = await getCatalogShell(445, 727, "en")
    const onChange = vi.fn()
    await renderTrack({ catalog, selectedIds: [247], onChange })

    await act(async () => {
      ;(container.querySelector(
        'button[aria-label="Life Orb"]',
      ) as HTMLButtonElement).click()
      await Promise.resolve()
    })

    expect(onChange).toHaveBeenCalledWith(["none"])
  })

  it("shows the localized item name in ordinary option tooltips", async () => {
    const catalog = await getCatalogShell(445, 727, "en")
    await renderTrack({ catalog, selectedIds: ["none"], onChange: vi.fn() })

    const option = container.querySelector(
      'button[aria-label="Life Orb"]',
    ) as HTMLButtonElement
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }))
      option.focus()
      await Promise.resolve()
    })

    expect(document.querySelector('[data-slot="tooltip-content"]')?.textContent)
      .toContain("Life Orb")
  })

  it("locks the matching Ogerpon Mask", async () => {
    const catalog = await getCatalogShell(10273, 727, "en")
    await renderTrack({
      catalog,
      selectedIds: [2106],
      lockedId: catalog.attackerLockedItemId,
      onChange: vi.fn(),
    })

    const options = container.querySelectorAll("button.track-option")
    expect(options).toHaveLength(1)
    expect(options[0].getAttribute("aria-label")).toBe("Wellspring Mask")
    expect((options[0] as HTMLButtonElement).disabled).toBe(true)
  })

  it("exposes partial-support warnings in text and with a red dot", async () => {
    const catalog = await getCatalogShell(445, 727, "en")
    await renderTrack({
      catalog,
      side: "defender",
      selectedIds: [162],
      onChange: vi.fn(),
    })

    const option = Array.from(
      container.querySelectorAll<HTMLButtonElement>("button.track-option"),
    ).find((button) => button.getAttribute("aria-label")?.startsWith("Passho Berry,"))
    expect(option?.getAttribute("aria-label")).toContain(
      "N-hit results treat the Berry as persistently held",
    )
    expect(option?.querySelector(".bg-destructive")).not.toBeNull()
  })
})
