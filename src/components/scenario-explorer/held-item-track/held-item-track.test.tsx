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

    await act(async () => {
      root.render(
        <IntlProvider locale="en" messages={localeMessages.en}>
          <HeldItemTrack
            catalog={catalog}
            side={side}
            selectedIds={[stoneId]}
            lockedId={side === "attacker"
              ? catalog.attackerLockedItemId
              : catalog.defenderLockedItemId}
            onChange={onChange}
          />
        </IntlProvider>,
      )
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
})
