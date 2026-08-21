// @vitest-environment happy-dom

import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { IntlProvider } from "react-intl"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { getCatalogShell } from "@/lib/catalog"
import { localeMessages } from "@/lib/i18n"

import { HeldItemTrack } from "./held-item-track"

describe("held-item Tracks", () => {
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
      poolIds: [stoneId],
      selectedIds: [stoneId],
      lockedId: side === "attacker"
        ? catalog.attackerLockedItemId
        : catalog.defenderLockedItemId,
      selectableIds: new Set([attackerId, defenderId]),
      onChange,
      onAdd: vi.fn(),
      onFormTriggerConfirm: vi.fn(),
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

  it("collapses selected items onto a second row", async () => {
    const catalog = await getCatalogShell(445, 727, "en")

    await renderTrack({
      catalog,
      poolIds: ["none", 247],
      selectedIds: ["none", 247],
      selectableIds: new Set([445, 727]),
      expanded: false,
      onChange: vi.fn(),
      onAdd: vi.fn(),
      onFormTriggerConfirm: vi.fn(),
    })

    const section = container.querySelector("section")
    expect(section?.querySelectorAll(":scope > div")).toHaveLength(2)
    expect(container.querySelector("button.track-option")).toBeNull()
    expect(container.querySelector('button[aria-label="Add held item"]')).toBeNull()
    expect(container.querySelector('img[src*="life-orb"]')).not.toBeNull()
    expect(container.querySelector(".lucide-circle-slash")).not.toBeNull()
  })

  it("renders the usage/manual pool rather than the full frozen catalog", async () => {
    const catalog = await getCatalogShell(445, 727, "en")

    await renderTrack({
      catalog,
      poolIds: [247],
      selectedIds: [247],
      selectableIds: new Set([445, 727]),
      onChange: vi.fn(),
      onAdd: vi.fn(),
      onFormTriggerConfirm: vi.fn(),
    })
    expect(container.querySelectorAll("button.track-option")).toHaveLength(1)
    expect(container.querySelector('button[aria-label="Life Orb"]')).not.toBeNull()
    expect(container.querySelector('button[aria-label="Add held item"]')).not.toBeNull()
  })

  it("shows official descriptions in the held-item picker", async () => {
    const catalog = await getCatalogShell(445, 727, "en")
    await renderTrack({
      catalog,
      poolIds: [247],
      selectedIds: [247],
      selectableIds: new Set([445, 727]),
      onChange: vi.fn(),
      onAdd: vi.fn(),
      onFormTriggerConfirm: vi.fn(),
    })

    await act(async () => {
      ;(container.querySelector('button[aria-label="Add held item"]') as HTMLButtonElement).click()
      await Promise.resolve()
    })

    expect(document.body.textContent).toContain(
      "It boosts the power of moves but at the cost of some HP on each hit.",
    )
  })

  it("restores explicit no-item after clearing every selected id", async () => {
    const catalog = await getCatalogShell(445, 727, "en")
    const onChange = vi.fn()
    await renderTrack({
      catalog,
      poolIds: ["none", 247],
      selectedIds: ["none", 247],
      selectableIds: new Set([445]),
      onChange,
      onAdd: vi.fn(),
      onFormTriggerConfirm: vi.fn(),
    })

    await act(async () => {
      ;(container.querySelector(
        'button[aria-label="Life Orb"]',
      ) as HTMLButtonElement).click()
      await Promise.resolve()
    })
    expect(onChange).toHaveBeenCalledWith(["none"])

    onChange.mockClear()
    await renderTrack({
      catalog,
      poolIds: ["none", 247],
      selectedIds: ["none"],
      selectableIds: new Set([445]),
      onChange,
      onAdd: vi.fn(),
      onFormTriggerConfirm: vi.fn(),
    })
    await act(async () => {
      ;(container.querySelector(
        'button[aria-label="No held item"]',
      ) as HTMLButtonElement).click()
      await Promise.resolve()
    })
    expect(onChange).toHaveBeenCalledWith(["none"])
  })

  it("keeps none selected when toggling an ordinary item on", async () => {
    const catalog = await getCatalogShell(445, 727, "en")
    const onChange = vi.fn()
    await renderTrack({
      catalog,
      poolIds: ["none", 247],
      selectedIds: ["none"],
      selectableIds: new Set([445]),
      onChange,
      onAdd: vi.fn(),
      onFormTriggerConfirm: vi.fn(),
    })

    await act(async () => {
      ;(container.querySelector(
        'button[aria-label="Life Orb"]',
      ) as HTMLButtonElement).click()
      await Promise.resolve()
    })

    expect(onChange).toHaveBeenCalledWith(["none", 247])
  })

  it("locks the matching Ogerpon Mask", async () => {
    const catalog = await getCatalogShell(10273, 727, "en")
    await renderTrack({
      catalog,
      poolIds: [2106],
      selectedIds: [2106],
      lockedId: catalog.attackerLockedItemId,
      selectableIds: new Set([10273, 727]),
      onChange: vi.fn(),
      onAdd: vi.fn(),
      onFormTriggerConfirm: vi.fn(),
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
      poolIds: [162],
      selectedIds: [162],
      selectableIds: new Set([727]),
      onChange: vi.fn(),
      onAdd: vi.fn(),
      onFormTriggerConfirm: vi.fn(),
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
